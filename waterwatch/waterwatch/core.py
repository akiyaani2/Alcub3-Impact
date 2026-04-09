"""WaterIntel — unified entry point for all water intelligence queries."""

from __future__ import annotations

from waterwatch.quality import WaterQualityClient
from waterwatch.climate import ClimateClient
from waterwatch.footprint import FootprintCalculator
from waterwatch.score import WaterScorer


class WaterIntel:
    """Unified water intelligence client.

    Usage:
        intel = WaterIntel()
        score = intel.water_score(lat=40.7128, lon=-74.0060)
        quality = intel.water_quality(lat=40.7128, lon=-74.0060)
        drought = intel.drought_status(lat=40.7128, lon=-74.0060)
        footprint = intel.ai_water_footprint(provider="openai", model="gpt-4", queries_per_month=10000)
    """

    def __init__(self) -> None:
        self.quality = WaterQualityClient()
        self.climate = ClimateClient()
        self.footprint = FootprintCalculator()
        self._scorer = WaterScorer()

    def water_quality(self, *, lat: float, lon: float, radius_miles: float = 25) -> dict:
        return self.quality.get_quality(lat=lat, lon=lon, radius_miles=radius_miles)

    def drought_status(self, *, lat: float, lon: float) -> dict:
        return self.climate.get_drought(lat=lat, lon=lon)

    def flood_risk(self, *, lat: float, lon: float) -> dict:
        return self.climate.get_flood_risk(lat=lat, lon=lon)

    def ai_water_footprint(
        self,
        *,
        provider: str = "openai",
        model: str = "gpt-4",
        queries_per_month: int = 1000,
    ) -> dict:
        return self.footprint.estimate(
            provider=provider, model=model, queries_per_month=queries_per_month
        )

    def water_score(self, *, lat: float, lon: float) -> dict:
        quality_data = self.water_quality(lat=lat, lon=lon)
        drought_data = self.drought_status(lat=lat, lon=lon)
        flood_data = self.flood_risk(lat=lat, lon=lon)
        return self._scorer.compute(
            quality=quality_data, drought=drought_data, flood=flood_data
        )
