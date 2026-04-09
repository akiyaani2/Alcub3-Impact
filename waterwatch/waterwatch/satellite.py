"""Satellite water detection using Sentinel-2 + NDWI + optional SAM 3."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

# Sentinel-2 band indices for water detection
# NDWI = (Green - NIR) / (Green + NIR)
# MNDWI = (Green - SWIR) / (Green + SWIR)
SENTINEL2_BANDS = {
    "green": "B03",   # Band 3: 560nm, 10m resolution
    "nir": "B08",     # Band 8: 842nm, 10m resolution
    "swir": "B11",    # Band 11: 1610nm, 20m resolution
}

# Copernicus Data Space Ecosystem
COPERNICUS_API = "https://catalogue.dataspace.copernicus.eu/odata/v1"
COPERNICUS_AUTH = "https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token"


class SatelliteClient:
    """Downloads and processes Sentinel-2 imagery for water detection.

    Requires optional dependencies: pip install waterwatch[satellite]
    For SAM 3 segmentation: pip install waterwatch[ml]
    """

    def __init__(self, data_dir: str | Path = "data/sentinel") -> None:
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(parents=True, exist_ok=True)

    def search_imagery(
        self,
        *,
        bbox: list[float],
        start_date: str,
        end_date: str,
        max_cloud_cover: float = 20.0,
        max_results: int = 10,
    ) -> list[dict]:
        """Search for Sentinel-2 imagery in a bounding box.

        Args:
            bbox: [west, south, east, north] in WGS84
            start_date: ISO date string (YYYY-MM-DD)
            end_date: ISO date string (YYYY-MM-DD)
            max_cloud_cover: Maximum cloud cover percentage
            max_results: Maximum number of results

        Returns:
            List of imagery metadata dicts
        """
        try:
            import httpx
        except ImportError:
            raise ImportError("httpx is required: pip install httpx")

        west, south, east, north = bbox
        aoi = f"POLYGON(({west} {south},{east} {south},{east} {north},{west} {north},{west} {south}))"

        filter_parts = [
            f"Collection/Name eq 'SENTINEL-2'",
            f"OData.CSC.Intersects(area=geography'SRID=4326;{aoi}')",
            f"ContentDate/Start gt {start_date}T00:00:00.000Z",
            f"ContentDate/Start lt {end_date}T23:59:59.999Z",
            f"Attributes/OData.CSC.DoubleAttribute/any(att:att/Name eq 'cloudCover' and att/OData.CSC.DoubleAttribute/Value lt {max_cloud_cover})",
        ]

        with httpx.Client(timeout=30) as client:
            resp = client.get(
                f"{COPERNICUS_API}/Products",
                params={
                    "$filter": " and ".join(filter_parts),
                    "$top": str(max_results),
                    "$orderby": "ContentDate/Start desc",
                },
            )
            if resp.status_code == 200:
                data = resp.json()
                return [
                    {
                        "id": item["Id"],
                        "name": item["Name"],
                        "date": item.get("ContentDate", {}).get("Start", ""),
                        "cloud_cover": next(
                            (
                                a["Value"]
                                for a in item.get("Attributes", [])
                                if a.get("Name") == "cloudCover"
                            ),
                            None,
                        ),
                        "footprint": item.get("Footprint", ""),
                    }
                    for item in data.get("value", [])
                ]
        return []

    def compute_ndwi(self, green_band: Any, nir_band: Any) -> Any:
        """Compute Normalized Difference Water Index from band arrays.

        NDWI = (Green - NIR) / (Green + NIR)
        Values > 0.3 typically indicate water.

        Requires: pip install waterwatch[satellite]
        """
        try:
            import numpy as np
        except ImportError:
            raise ImportError("numpy required: pip install waterwatch[satellite]")

        green = green_band.astype(np.float32)
        nir = nir_band.astype(np.float32)

        denominator = green + nir
        ndwi = np.where(denominator > 0, (green - nir) / denominator, 0)
        return ndwi

    def detect_water_bodies(
        self, ndwi: Any, threshold: float = 0.3
    ) -> dict:
        """Classify water pixels from NDWI array.

        Returns statistics about water coverage.
        """
        try:
            import numpy as np
        except ImportError:
            raise ImportError("numpy required: pip install waterwatch[satellite]")

        water_mask = ndwi > threshold
        total_pixels = ndwi.size
        water_pixels = int(np.sum(water_mask))
        water_pct = round(water_pixels / total_pixels * 100, 2) if total_pixels > 0 else 0

        return {
            "total_pixels": total_pixels,
            "water_pixels": water_pixels,
            "water_percentage": water_pct,
            "threshold": threshold,
            "method": "NDWI",
        }

    def change_detection(
        self, ndwi_before: Any, ndwi_after: Any, threshold: float = 0.3
    ) -> dict:
        """Detect water body changes between two time periods."""
        try:
            import numpy as np
        except ImportError:
            raise ImportError("numpy required: pip install waterwatch[satellite]")

        water_before = ndwi_before > threshold
        water_after = ndwi_after > threshold

        gained = int(np.sum(water_after & ~water_before))   # New water
        lost = int(np.sum(water_before & ~water_after))     # Lost water
        stable = int(np.sum(water_before & water_after))    # Unchanged water

        total_before = int(np.sum(water_before))
        total_after = int(np.sum(water_after))
        change_pct = round(
            (total_after - total_before) / max(total_before, 1) * 100, 2
        )

        return {
            "water_pixels_before": total_before,
            "water_pixels_after": total_after,
            "water_gained_pixels": gained,
            "water_lost_pixels": lost,
            "water_stable_pixels": stable,
            "change_percentage": change_pct,
            "interpretation": (
                "expanding" if change_pct > 5
                else "shrinking" if change_pct < -5
                else "stable"
            ),
        }

    def export_geojson(self, results: dict, output_path: str | Path) -> Path:
        """Export detection results as GeoJSON."""
        output = Path(output_path)
        output.parent.mkdir(parents=True, exist_ok=True)

        geojson = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": results,
                    "geometry": None,
                }
            ],
        }

        with open(output, "w") as f:
            json.dump(geojson, f, indent=2)

        return output
