"""Tests for contaminant threshold handling in water quality results."""

from waterwatch.quality import WaterQualityClient


def test_arsenic_threshold_supports_unit_conversion():
    client = WaterQualityClient()
    try:
        result = client._annotate_contaminant_result(
            contaminant="Arsenic",
            value=0.02,
            unit="mg/L",
            date="2026-04-01",
        )
    finally:
        client.close()

    assert result["canonical_contaminant"] == "Arsenic"
    assert result["comparison_supported"] is True
    assert result["normalized_value"] == 20.0
    assert result["exceeds_limit"] is True


def test_nitrate_threshold_passes_with_compatible_units():
    client = WaterQualityClient()
    try:
        result = client._annotate_contaminant_result(
            contaminant="Nitrate as N",
            value=9.5,
            unit="mg/L as N",
            date="2026-04-01",
        )
    finally:
        client.close()

    assert result["canonical_contaminant"] == "Nitrate"
    assert result["comparison_supported"] is True
    assert result["exceeds_limit"] is False


def test_pfas_threshold_uses_ng_per_liter_screening():
    client = WaterQualityClient()
    try:
        result = client._annotate_contaminant_result(
            contaminant="PFOS",
            value=5.2,
            unit="ng/L",
            date="2026-04-01",
        )
    finally:
        client.close()

    assert result["comparison_supported"] is True
    assert result["threshold_value"] == 4.0
    assert result["exceeds_limit"] is True


def test_unsupported_units_do_not_fake_comparison():
    client = WaterQualityClient()
    try:
        result = client._annotate_contaminant_result(
            contaminant="Lead",
            value=11.0,
            unit="mg/kg",
            date="2026-04-01",
        )
    finally:
        client.close()

    assert result["comparison_supported"] is False
    assert result["exceeds_limit"] is False


def test_pfas_risk_escalates_when_threshold_exceeded():
    client = WaterQualityClient()
    try:
        elevated = client._assess_pfas_risk(
            [
                {"contaminant": "PFOS", "exceeds_limit": True},
            ]
        )
        detected = client._assess_pfas_risk(
            [
                {"contaminant": "PFOS", "exceeds_limit": False},
            ]
        )
    finally:
        client.close()

    assert elevated == "elevated"
    assert detected == "detected"
