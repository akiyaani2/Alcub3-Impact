"""Reference locations and benchmark helpers for BasinKit."""

from __future__ import annotations

import json
from importlib.resources import files
from typing import Any

from waterwatch.core import WaterIntel


def default_fixture_path() -> str:
    return str(files("waterwatch").joinpath("data/reference_locations.json"))


def load_reference_locations(fixture_path: str | None = None) -> list[dict[str, Any]]:
    path = fixture_path or default_fixture_path()
    with open(path, "r", encoding="utf-8") as handle:
        payload = json.load(handle)
    return payload["locations"]


def reference_locations_payload(fixture_path: str | None = None) -> dict[str, Any]:
    locations = load_reference_locations(fixture_path)
    return {
        "toolkit": "BasinKit",
        "fixture": fixture_path or default_fixture_path(),
        "count": len(locations),
        "locations": locations,
    }


def _summarize_pulse(location: dict[str, Any], pulse: dict[str, Any]) -> dict[str, Any]:
    score = pulse.get("score", {})
    quality = pulse.get("quality", {})
    drought = pulse.get("drought", {})
    flood = pulse.get("flood", {})
    return {
        "id": location["id"],
        "name": location["name"],
        "lat": location["lat"],
        "lon": location["lon"],
        "benchmark_focus": location["benchmark_focus"],
        "expected_signal": location["expected_signal"],
        "score": score.get("overall_score"),
        "grade": score.get("grade"),
        "quality_grade": quality.get("quality_grade"),
        "drought_level": drought.get("drought_level"),
        "flood_status": flood.get("flood_status"),
        "pfas_risk": quality.get("pfas_risk"),
    }


def run_reference_benchmarks(
    *,
    fixture_path: str | None = None,
    limit: int | None = None,
    timeout: float = 15.0,
) -> dict[str, Any]:
    locations = load_reference_locations(fixture_path)
    if limit is not None:
        locations = locations[:limit]

    intel = WaterIntel(timeout=timeout)
    results: list[dict[str, Any]] = []
    try:
        for location in locations:
            try:
                pulse = intel.pulse(lat=location["lat"], lon=location["lon"])
            except Exception as exc:  # pragma: no cover - live benchmark safety
                results.append(
                    {
                        "id": location["id"],
                        "name": location["name"],
                        "lat": location["lat"],
                        "lon": location["lon"],
                        "benchmark_focus": location["benchmark_focus"],
                        "expected_signal": location["expected_signal"],
                        "status": "error",
                        "error": str(exc),
                    }
                )
                continue

            summary = _summarize_pulse(location, pulse)
            summary["status"] = "ok"
            results.append(summary)
    finally:
        intel.close()

    return {
        "toolkit": "BasinKit",
        "fixture": fixture_path or default_fixture_path(),
        "count": len(results),
        "results": results,
    }
