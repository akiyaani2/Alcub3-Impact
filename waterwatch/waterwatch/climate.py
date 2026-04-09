"""Climate and weather data for water — NOAA, Drought.gov, NWPS."""

from __future__ import annotations

import httpx

# NOAA National Water Prediction Service
NWPS_BASE = "https://api.water.noaa.gov/nwps/v1"
# US Drought Monitor
DROUGHT_BASE = "https://usdm.unl.edu/api"
# NOAA Climate Data Online
CDO_BASE = "https://www.ncei.noaa.gov/cdo-web/api/v2"


# Drought level descriptions
DROUGHT_LEVELS = {
    "None": {"level": 0, "description": "No drought", "risk": "low"},
    "D0": {"level": 1, "description": "Abnormally dry", "risk": "low"},
    "D1": {"level": 2, "description": "Moderate drought", "risk": "moderate"},
    "D2": {"level": 3, "description": "Severe drought", "risk": "high"},
    "D3": {"level": 4, "description": "Extreme drought", "risk": "very_high"},
    "D4": {"level": 5, "description": "Exceptional drought", "risk": "critical"},
}


class ClimateClient:
    """Fetches flood risk and drought data from NOAA and partners."""

    def __init__(self, timeout: float = 30.0) -> None:
        self._client = httpx.Client(timeout=timeout)

    def get_drought(self, *, lat: float, lon: float) -> dict:
        """Get current drought conditions for a location."""
        # Try USDM API for current drought status
        drought_data = self._get_usdm_status(lat=lat, lon=lon)

        # Get precipitation deficit from NOAA
        precip = self._get_precipitation_status(lat=lat, lon=lon)

        level_info = DROUGHT_LEVELS.get(drought_data.get("level", "None"), DROUGHT_LEVELS["None"])

        return {
            "evidence_tier": "measured",
            "drought_level": drought_data.get("level", "None"),
            "drought_score": level_info["level"],
            "description": level_info["description"],
            "risk": level_info["risk"],
            "precipitation": precip,
            "trend": drought_data.get("trend", "stable"),
            "data_source": "US Drought Monitor / NOAA",
            "location": {"lat": lat, "lon": lon},
        }

    def get_flood_risk(self, *, lat: float, lon: float) -> dict:
        """Get flood risk assessment for a location using NOAA NWPS."""
        gauges = self._find_nearby_gauges(lat=lat, lon=lon)
        flood_status = "normal"
        flood_score = 0
        gauge_data = []

        for gauge in gauges[:5]:
            gauge_id = gauge.get("id", "")
            status = self._get_gauge_status(gauge_id)
            if status:
                gauge_data.append(status)
                if status.get("flood_category") == "major":
                    flood_status = "major_flooding"
                    flood_score = max(flood_score, 90)
                elif status.get("flood_category") == "moderate":
                    flood_status = "moderate_flooding"
                    flood_score = max(flood_score, 70)
                elif status.get("flood_category") == "minor":
                    flood_status = "minor_flooding"
                    flood_score = max(flood_score, 50)
                elif status.get("flood_category") == "action":
                    if flood_status == "normal":
                        flood_status = "watch"
                    flood_score = max(flood_score, 30)

        return {
            "evidence_tier": "estimated",
            "flood_status": flood_status,
            "flood_score": flood_score,
            "risk": self._score_to_risk(flood_score),
            "nearby_gauges": len(gauges),
            "gauge_readings": gauge_data,
            "data_source": "NOAA National Water Prediction Service",
            "location": {"lat": lat, "lon": lon},
            "methodology": {
                "evidence_tier": "estimated",
                "note": "Flood status is derived from nearby NOAA gauge observations and forecast "
                "categories. It is a public risk estimate, not a parcel-specific engineering assessment.",
            },
        }

    def _get_usdm_status(self, *, lat: float, lon: float) -> dict:
        """Query US Drought Monitor for current conditions."""
        try:
            # USDM county-level endpoint
            resp = self._client.get(
                f"{DROUGHT_BASE}/county_statistics/GetDroughtSeverityStatisticsByCoordinates",
                params={"lat": str(lat), "lon": str(lon), "statisticsType": "1"},
            )
            if resp.status_code == 200:
                data = resp.json()
                if isinstance(data, list) and data:
                    entry = data[0]
                    # Find the highest active drought level
                    for level in ["D4", "D3", "D2", "D1", "D0"]:
                        if entry.get(level, 0) > 0:
                            return {"level": level, "trend": "stable"}
                    return {"level": "None", "trend": "stable"}
        except (httpx.HTTPError, ValueError, KeyError, IndexError):
            pass
        return {"level": "None", "trend": "unknown"}

    def _find_nearby_gauges(self, *, lat: float, lon: float) -> list[dict]:
        """Find NOAA NWPS stream gauges near a location."""
        try:
            resp = self._client.get(
                f"{NWPS_BASE}/gauges",
                params={
                    "latitude": str(lat),
                    "longitude": str(lon),
                    "distance": "50",
                },
            )
            if resp.status_code == 200:
                data = resp.json()
                gauges = data.get("gauges", [])
                return [
                    {
                        "id": g.get("lid", ""),
                        "name": g.get("name", ""),
                        "river": g.get("stream", ""),
                        "distance_miles": g.get("distance", 0),
                    }
                    for g in gauges
                ]
        except (httpx.HTTPError, ValueError):
            pass
        return []

    def _get_gauge_status(self, gauge_id: str) -> dict | None:
        """Get current status of a specific NWPS gauge."""
        try:
            resp = self._client.get(f"{NWPS_BASE}/gauges/{gauge_id}")
            if resp.status_code == 200:
                data = resp.json()
                gauge = data.get("gauge", data)
                status = gauge.get("status", {})
                observed = status.get("observed", {})
                forecast = status.get("forecast", {})
                flood_cat = status.get("floodCategory", "no_flooding")
                return {
                    "gauge_id": gauge_id,
                    "flood_category": flood_cat.lower().replace(" ", "_"),
                    "current_level_ft": observed.get("primary", None),
                    "forecast_level_ft": forecast.get("primary", None),
                    "trend": status.get("trend", "unknown"),
                }
        except (httpx.HTTPError, ValueError, KeyError):
            pass
        return None

    def _get_precipitation_status(self, *, lat: float, lon: float) -> dict:
        """Get precipitation data. Returns basic info; detailed needs CDO API key."""
        return {
            "note": "Detailed precipitation requires NOAA CDO API key (free registration)",
            "source": "ncei.noaa.gov/cdo-web",
        }

    @staticmethod
    def _score_to_risk(score: int) -> str:
        if score >= 80:
            return "critical"
        if score >= 60:
            return "high"
        if score >= 40:
            return "moderate"
        if score >= 20:
            return "low"
        return "minimal"

    def close(self) -> None:
        self._client.close()
