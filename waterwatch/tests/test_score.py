"""Tests for water health scoring algorithm."""

from waterwatch.score import WaterScorer


def test_perfect_score():
    scorer = WaterScorer()
    result = scorer.compute(
        quality={"quality_score": 95},
        drought={"drought_score": 0, "drought_level": "None", "description": "No drought", "risk": "low"},
        flood={"flood_score": 0, "flood_status": "normal", "risk": "minimal"},
    )

    assert result["overall_score"] >= 90
    assert result["grade"] == "A"
    assert len(result["concerns"]) == 0


def test_poor_quality():
    scorer = WaterScorer()
    result = scorer.compute(
        quality={"quality_score": 30},
        drought={"drought_score": 0, "drought_level": "None"},
        flood={"flood_score": 0, "flood_status": "normal"},
    )

    assert result["overall_score"] < 70
    assert any(c["area"] == "water_quality" for c in result["concerns"])


def test_severe_drought():
    scorer = WaterScorer()
    result = scorer.compute(
        quality={"quality_score": 80},
        drought={"drought_score": 4, "drought_level": "D4", "description": "Exceptional drought", "risk": "critical"},
        flood={"flood_score": 0, "flood_status": "normal"},
    )

    assert result["overall_score"] < 70
    assert any(c["area"] == "drought" for c in result["concerns"])


def test_flooding():
    scorer = WaterScorer()
    result = scorer.compute(
        quality={"quality_score": 80},
        drought={"drought_score": 0, "drought_level": "None"},
        flood={"flood_score": 80, "flood_status": "major_flooding", "risk": "critical"},
    )

    assert result["overall_score"] < 75
    assert any(c["area"] == "flood_risk" for c in result["concerns"])


def test_score_bounds():
    scorer = WaterScorer()
    result = scorer.compute(
        quality={"quality_score": 0},
        drought={"drought_score": 5},
        flood={"flood_score": 100, "flood_status": "major_flooding"},
    )

    assert 0 <= result["overall_score"] <= 100


def test_methodology_included():
    scorer = WaterScorer()
    result = scorer.compute(
        quality={"quality_score": 50},
        drought={"drought_score": 1},
        flood={"flood_score": 10, "flood_status": "normal"},
    )

    assert "methodology" in result
    assert result["methodology"]["version"] == "1.0"
    assert "weights" in result["methodology"]
