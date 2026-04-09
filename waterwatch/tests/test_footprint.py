"""Tests for AI water footprint calculator."""

from waterwatch.footprint import FootprintCalculator


def test_basic_estimate():
    calc = FootprintCalculator()
    result = calc.estimate(provider="openai", model="gpt-4", queries_per_month=1000)

    assert result["provider"] == "openai"
    assert result["model"] == "gpt-4"
    assert result["queries_per_month"] == 1000
    assert result["water_liters_monthly"] > 0
    assert result["water_gallons_monthly"] > 0
    assert result["offset_cost_usd_monthly"] >= 0


def test_different_providers():
    calc = FootprintCalculator()
    google = calc.estimate(provider="google", model="gemini-pro", queries_per_month=1000)
    microsoft = calc.estimate(provider="microsoft", model="gpt-4", queries_per_month=1000)

    # Microsoft has higher WUE than Google
    assert microsoft["water_liters_monthly"] > google["water_liters_monthly"]


def test_scaling():
    calc = FootprintCalculator()
    low = calc.estimate(queries_per_month=100)
    high = calc.estimate(queries_per_month=10000)

    assert high["water_liters_monthly"] == 100 * low["water_liters_monthly"]


def test_unknown_provider_uses_default():
    calc = FootprintCalculator()
    result = calc.estimate(provider="unknown_provider", model="unknown_model")

    assert result["water_liters_monthly"] > 0
    assert "estimate" in result["methodology"]["wue_source"].lower() or "average" in result["methodology"]["wue_source"].lower()


def test_company_estimate():
    calc = FootprintCalculator()
    result = calc.estimate_company(
        cloud_provider="aws",
        compute_hours_monthly=100,
        gpu_type="a100",
    )

    assert result["cloud_provider"] == "aws"
    assert result["energy_kwh_monthly"] == 40.0  # 400W * 100h / 1000
    assert result["water_liters_monthly"] > 0


def test_context_comparisons():
    calc = FootprintCalculator()
    result = calc.estimate(queries_per_month=10000)

    assert "equivalent_showers" in result["context"]
    assert "equivalent_drinking_water_days" in result["context"]
    assert result["context"]["equivalent_showers"] > 0
