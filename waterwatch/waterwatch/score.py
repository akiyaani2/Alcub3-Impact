"""Composite water health scoring algorithm."""

from __future__ import annotations


# Weights for composite score (must sum to 1.0)
WEIGHTS = {
    "quality": 0.45,    # Water quality is the primary concern
    "drought": 0.30,    # Drought risk affects availability
    "flood": 0.25,      # Flood risk affects safety and infrastructure
}

# Grade thresholds
GRADE_THRESHOLDS = [
    (90, "A", "Excellent"),
    (75, "B", "Good"),
    (60, "C", "Fair"),
    (40, "D", "Poor"),
    (0,  "F", "Critical"),
]


class WaterScorer:
    """Computes composite water health score from quality, drought, and flood data."""

    def compute(self, *, quality: dict, drought: dict, flood: dict) -> dict:
        # Extract component scores (0-100 scale, higher = better)
        quality_score = quality.get("quality_score", 50)
        drought_score = self._drought_to_score(drought.get("drought_score", 0))
        flood_score = self._flood_to_score(flood.get("flood_score", 0))

        # Weighted composite
        composite = (
            quality_score * WEIGHTS["quality"]
            + drought_score * WEIGHTS["drought"]
            + flood_score * WEIGHTS["flood"]
        )
        composite = max(0, min(100, round(composite)))

        # Grade
        grade, grade_label = "F", "Critical"
        for threshold, g, label in GRADE_THRESHOLDS:
            if composite >= threshold:
                grade, grade_label = g, label
                break

        # Top concerns
        concerns = []
        if quality_score < 60:
            concerns.append({
                "area": "water_quality",
                "severity": "high" if quality_score < 40 else "moderate",
                "detail": f"Water quality score: {quality_score}/100",
            })
        if drought.get("drought_score", 0) >= 2:
            concerns.append({
                "area": "drought",
                "severity": drought.get("risk", "moderate"),
                "detail": drought.get("description", "Drought conditions detected"),
            })
        if flood.get("flood_score", 0) >= 30:
            concerns.append({
                "area": "flood_risk",
                "severity": flood.get("risk", "moderate"),
                "detail": f"Flood status: {flood.get('flood_status', 'unknown')}",
            })

        return {
            "overall_score": composite,
            "grade": grade,
            "grade_label": grade_label,
            "components": {
                "quality": {
                    "score": quality_score,
                    "weight": WEIGHTS["quality"],
                    "weighted": round(quality_score * WEIGHTS["quality"], 1),
                },
                "drought": {
                    "score": drought_score,
                    "weight": WEIGHTS["drought"],
                    "weighted": round(drought_score * WEIGHTS["drought"], 1),
                    "raw_level": drought.get("drought_level", "None"),
                },
                "flood": {
                    "score": flood_score,
                    "weight": WEIGHTS["flood"],
                    "weighted": round(flood_score * WEIGHTS["flood"], 1),
                    "raw_status": flood.get("flood_status", "normal"),
                },
            },
            "concerns": concerns,
            "methodology": {
                "version": "1.0",
                "weights": WEIGHTS,
                "note": "Score is 0-100 (higher = better water health). "
                        "Based on EPA water quality data, NOAA flood predictions, "
                        "and US Drought Monitor conditions.",
            },
        }

    @staticmethod
    def _drought_to_score(drought_level: int) -> int:
        """Convert drought level (0-5, higher=worse) to score (0-100, higher=better)."""
        return max(0, 100 - drought_level * 20)

    @staticmethod
    def _flood_to_score(flood_score: int) -> int:
        """Convert flood score (0-100, higher=worse) to score (0-100, higher=better)."""
        return max(0, 100 - flood_score)
