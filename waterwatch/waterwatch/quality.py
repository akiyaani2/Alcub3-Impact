"""Water quality data from USGS, EPA, and Water Quality Portal."""

from __future__ import annotations

import httpx

# USGS Water Quality Portal — 430M+ records from 400+ agencies
WQP_BASE = "https://www.waterqualitydata.us"
# EPA ECHO — enforcement, compliance, violations
ECHO_BASE = "https://echodata.epa.gov/echo"
# USGS Water Services — real-time monitoring stations
USGS_BASE = "https://waterservices.usgs.gov/nwis"

# Common contaminants to check (EPA regulated)
PRIORITY_CONTAMINANTS = [
    "Arsenic",
    "Lead",
    "Nitrate",
    "PFOS",
    "PFOA",
    "Chromium",
    "Uranium",
    "Radium-226",
    "Fluoride",
    "Copper",
]

# Thresholds are used here as public screening guidance, not as a substitute for direct
# utility notices, lab tests, or a full regulatory compliance determination.
CONTAMINANT_THRESHOLDS = {
    "Arsenic": {"value": 10.0, "unit": "ug/L", "basis": "EPA MCL"},
    "Lead": {"value": 15.0, "unit": "ug/L", "basis": "EPA action level"},
    "Nitrate": {"value": 10.0, "unit": "mg/L", "basis": "EPA MCL as N"},
    "PFOS": {"value": 4.0, "unit": "ng/L", "basis": "EPA MCL"},
    "PFOA": {"value": 4.0, "unit": "ng/L", "basis": "EPA MCL"},
    "Chromium": {"value": 100.0, "unit": "ug/L", "basis": "EPA MCL (total chromium)"},
    "Uranium": {"value": 30.0, "unit": "ug/L", "basis": "EPA MCL"},
    "Radium-226": {
        "value": 5.0,
        "unit": "pCi/L",
        "basis": "EPA combined radium screening threshold",
    },
    "Fluoride": {"value": 4.0, "unit": "mg/L", "basis": "EPA MCL"},
    "Copper": {"value": 1.3, "unit": "mg/L", "basis": "EPA action level"},
}

CONTAMINANT_ALIASES = {
    "Arsenic": ("arsenic",),
    "Lead": ("lead",),
    "Nitrate": ("nitrate", "nitrate as n", "nitrite+nitrate"),
    "PFOS": ("pfos", "perfluorooctane sulfonate"),
    "PFOA": ("pfoa", "perfluorooctanoic acid"),
    "Chromium": ("chromium",),
    "Uranium": ("uranium",),
    "Radium-226": ("radium-226", "radium 226", "radium,226"),
    "Fluoride": ("fluoride",),
    "Copper": ("copper",),
}

UNIT_FACTORS_TO_NG_L = {
    "mg/l": 1_000_000.0,
    "mg/l as n": 1_000_000.0,
    "mg/l as nitrogen": 1_000_000.0,
    "ug/l": 1_000.0,
    "µg/l": 1_000.0,
    "ng/l": 1.0,
    "ppt": 1.0,
}

UNIT_FACTORS_TO_PCI_L = {
    "pci/l": 1.0,
    "pci l-1": 1.0,
}


def _normalize_text(value: str) -> str:
    return " ".join(value.lower().replace("_", " ").split())


def _canonical_contaminant_name(name: str) -> str:
    normalized = _normalize_text(name)
    for canonical, aliases in CONTAMINANT_ALIASES.items():
        if any(alias in normalized for alias in aliases):
            return canonical
    return name


def _normalize_unit(unit: str) -> str:
    normalized = _normalize_text(unit)
    return (
        normalized.replace("micrograms per liter", "ug/l")
        .replace("milligrams per liter", "mg/l")
        .replace("nanograms per liter", "ng/l")
        .replace("picocuries per liter", "pci/l")
        .replace("μ", "µ")
    )


def _convert_value(value: float, *, source_unit: str, target_unit: str) -> float | None:
    source = _normalize_unit(source_unit)
    target = _normalize_unit(target_unit)

    if target in UNIT_FACTORS_TO_NG_L:
        source_factor = UNIT_FACTORS_TO_NG_L.get(source)
        target_factor = UNIT_FACTORS_TO_NG_L.get(target)
        if source_factor is None or target_factor is None:
            return None
        return value * source_factor / target_factor

    if target == "pci/l":
        factor = UNIT_FACTORS_TO_PCI_L.get(source)
        if factor is None:
            return None
        return value * factor

    return None


class WaterQualityClient:
    """Fetches water quality data from federal APIs."""

    def __init__(self, timeout: float = 30.0) -> None:
        self._client = httpx.Client(timeout=timeout)

    def get_quality(self, *, lat: float, lon: float, radius_miles: float = 25) -> dict:
        """Get water quality summary for a location."""
        stations = self._find_stations(lat=lat, lon=lon, radius_miles=radius_miles)
        violations = self._get_violations(lat=lat, lon=lon)
        contaminants = self._get_recent_results(lat=lat, lon=lon, radius_miles=radius_miles)

        violation_count = len(violations)
        contaminant_flags = [c for c in contaminants if c.get("exceeds_limit")]

        if violation_count == 0 and len(contaminant_flags) == 0:
            quality_grade = "good"
            quality_score = 85
        elif violation_count <= 2 and len(contaminant_flags) <= 1:
            quality_grade = "fair"
            quality_score = 60
        else:
            quality_grade = "poor"
            quality_score = max(10, 60 - violation_count * 10 - len(contaminant_flags) * 5)

        return {
            "quality_score": quality_score,
            "quality_grade": quality_grade,
            "monitoring_stations": len(stations),
            "violations": violations,
            "violation_count": violation_count,
            "contaminants_detected": contaminants,
            "contaminants_exceeding_limits": contaminant_flags,
            "pfas_risk": self._assess_pfas_risk(contaminants),
            "data_sources": ["USGS Water Quality Portal", "EPA ECHO"],
            "location": {"lat": lat, "lon": lon, "radius_miles": radius_miles},
        }

    def _find_stations(self, *, lat: float, lon: float, radius_miles: float) -> list[dict]:
        """Find USGS monitoring stations near a location."""
        try:
            resp = self._client.get(
                f"{WQP_BASE}/data/Station/search",
                params={
                    "lat": str(lat),
                    "long": str(lon),
                    "within": str(radius_miles),
                    "siteType": "Well;Spring;Stream;Lake, Reservoir, Impoundment",
                    "mimeType": "application/json",
                    "sorted": "no",
                    "minresults": "1",
                    "providers": "NWIS;STORET",
                },
                headers={"Accept": "application/json"},
            )
            if resp.status_code == 200:
                data = resp.json()
                features = data.get("features", [])
                return [
                    {
                        "id": f.get("properties", {}).get("MonitoringLocationIdentifier", ""),
                        "name": f.get("properties", {}).get("MonitoringLocationName", ""),
                        "type": f.get("properties", {}).get("MonitoringLocationTypeName", ""),
                        "org": f.get("properties", {}).get("OrganizationFormalName", ""),
                    }
                    for f in features[:20]
                ]
        except (httpx.HTTPError, ValueError):
            pass
        return []

    def _get_violations(self, *, lat: float, lon: float) -> list[dict]:
        """Get EPA drinking water violations near a location."""
        try:
            resp = self._client.get(
                f"{ECHO_BASE}/sdw_drinking_water",
                params={
                    "p_lat": str(lat),
                    "p_long": str(lon),
                    "p_radius": "25",
                    "output": "JSON",
                    "responseset": "10",
                },
            )
            if resp.status_code == 200:
                data = resp.json()
                results = data.get("Results", {}).get("SDWSearchResults", {})
                if isinstance(results, list):
                    return [
                        {
                            "system_name": r.get("PWSName", ""),
                            "violation_type": r.get("ViolationTypeName", ""),
                            "contaminant": r.get("ContaminantName", ""),
                            "compliance_period": r.get("CompliancePeriodBeginDate", ""),
                        }
                        for r in results
                    ]
        except (httpx.HTTPError, ValueError, KeyError):
            pass
        return []

    def _get_recent_results(
        self, *, lat: float, lon: float, radius_miles: float
    ) -> list[dict]:
        """Get recent water quality test results from WQP."""
        try:
            resp = self._client.get(
                f"{WQP_BASE}/data/Result/search",
                params={
                    "lat": str(lat),
                    "long": str(lon),
                    "within": str(min(radius_miles, 10)),
                    "characteristicName": ";".join(PRIORITY_CONTAMINANTS),
                    "startDateLo": "01-01-2024",
                    "mimeType": "application/json",
                    "sorted": "no",
                    "minresults": "1",
                },
                headers={"Accept": "application/json"},
            )
            if resp.status_code == 200:
                data = resp.json()
                features = data.get("features", [])
                results = []
                for f in features[:50]:
                    props = f.get("properties", {})
                    value = props.get("ResultMeasureValue", "")
                    try:
                        numeric_val = float(value) if value else None
                    except (ValueError, TypeError):
                        numeric_val = None
                    results.append(
                        self._annotate_contaminant_result(
                            contaminant=props.get("CharacteristicName", ""),
                            value=numeric_val,
                            unit=props.get("ResultMeasure/MeasureUnitCode", ""),
                            date=props.get("ActivityStartDate", ""),
                        )
                    )
                return results
        except (httpx.HTTPError, ValueError):
            pass
        return []

    def _annotate_contaminant_result(
        self, *, contaminant: str, value: float | None, unit: str, date: str
    ) -> dict:
        canonical = _canonical_contaminant_name(contaminant)
        threshold = CONTAMINANT_THRESHOLDS.get(canonical)

        result = {
            "contaminant": contaminant,
            "canonical_contaminant": canonical,
            "value": value,
            "unit": unit,
            "date": date,
            "comparison_supported": False,
            "exceeds_limit": False,
            "threshold_value": threshold["value"] if threshold else None,
            "threshold_unit": threshold["unit"] if threshold else None,
            "threshold_basis": threshold["basis"] if threshold else None,
            "normalized_value": None,
            "screening_note": (
                "Public screening threshold only; not a full regulatory compliance determination."
                if threshold
                else None
            ),
        }

        if threshold is None or value is None:
            return result

        normalized = _convert_value(value, source_unit=unit, target_unit=threshold["unit"])
        if normalized is None:
            return result

        result["comparison_supported"] = True
        result["normalized_value"] = round(normalized, 4)
        result["exceeds_limit"] = normalized > threshold["value"]
        return result

    def _assess_pfas_risk(self, contaminants: list[dict]) -> str:
        """Assess PFAS contamination risk based on detected contaminants."""
        pfas_found = [
            c for c in contaminants
            if c.get("contaminant", "").upper() in ("PFOS", "PFOA", "PFAS")
        ]
        if any(c.get("exceeds_limit") for c in pfas_found):
            return "elevated"
        if pfas_found:
            return "detected"
        return "no_data"

    def close(self) -> None:
        self._client.close()

    def __del__(self) -> None:
        try:
            self.close()
        except Exception:
            pass
