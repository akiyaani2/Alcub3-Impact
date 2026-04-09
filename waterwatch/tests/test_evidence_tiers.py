"""Tests for machine-readable evidence tiers and BasinKit compatibility imports."""

from __future__ import annotations

from basinkit import WaterIntel
from waterwatch.climate import ClimateClient
from waterwatch.footprint import FootprintCalculator
from waterwatch.quality import WaterQualityClient
from waterwatch.score import WaterScorer


def test_basinkit_import_alias_exposes_waterintel():
    intel = WaterIntel(timeout=5.0)
    try:
        assert hasattr(intel, "pulse")
        assert hasattr(intel, "water_quality")
    finally:
        intel.close()


def test_quality_payload_includes_evidence_tier(monkeypatch):
    client = WaterQualityClient()
    try:
        monkeypatch.setattr(client, "_find_stations", lambda **_: [{"id": "station-1"}])
        monkeypatch.setattr(client, "_get_violations", lambda **_: [])
        monkeypatch.setattr(
            client,
            "_get_recent_results",
            lambda **_: [
                {
                    "contaminant": "PFOS",
                    "exceeds_limit": False,
                }
            ],
        )
        result = client.get_quality(lat=33.4484, lon=-112.0740)
    finally:
        client.close()

    assert result["evidence_tier"] == "measured"
    assert result["methodology"]["comparison_tier"] == "estimated"


def test_climate_payloads_include_evidence_tiers(monkeypatch):
    client = ClimateClient()
    try:
        monkeypatch.setattr(client, "_get_usdm_status", lambda **_: {"level": "D2", "trend": "stable"})
        monkeypatch.setattr(
            client,
            "_get_precipitation_status",
            lambda **_: {"note": "synthetic", "source": "test"},
        )
        monkeypatch.setattr(client, "_find_nearby_gauges", lambda **_: [{"id": "g1"}])
        monkeypatch.setattr(
            client,
            "_get_gauge_status",
            lambda gauge_id: {
                "gauge_id": gauge_id,
                "flood_category": "minor",
                "current_level_ft": 12.0,
                "forecast_level_ft": 13.5,
                "trend": "rising",
            },
        )
        drought = client.get_drought(lat=33.4484, lon=-112.0740)
        flood = client.get_flood_risk(lat=33.4484, lon=-112.0740)
    finally:
        client.close()

    assert drought["evidence_tier"] == "measured"
    assert flood["evidence_tier"] == "estimated"


def test_score_and_footprint_payloads_include_evidence_tiers():
    scorer = WaterScorer()
    score = scorer.compute(
        quality={"quality_score": 75},
        drought={"drought_score": 1, "drought_level": "D0"},
        flood={"flood_score": 10, "flood_status": "normal"},
    )
    calc = FootprintCalculator()
    footprint = calc.estimate(provider="openai", model="gpt-4o", queries_per_month=500)

    assert score["evidence_tier"] == "estimated"
    assert score["methodology"]["evidence_tier"] == "estimated"
    assert footprint["evidence_tier"] == "estimated"
    assert footprint["methodology"]["evidence_tier"] == "estimated"
