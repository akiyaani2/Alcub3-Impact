"""Static catalog data for the public WaterIntel toolkit surface."""

from __future__ import annotations

from waterwatch.footprint import MODEL_ENERGY_KWH, PROVIDER_WUE


OBSERVATORY_REGIONS = {
    "lake-mead": {
        "name": "Lake Mead, Nevada",
        "bbox": [-114.9, 36.0, -114.6, 36.3],
        "description": "North America's largest reservoir and a visible drought indicator.",
    },
    "gaza": {
        "name": "Gaza Aquifer, Palestine",
        "bbox": [34.2, 31.2, 34.6, 31.6],
        "description": "Coastal aquifer under severe water stress.",
    },
    "lake-chad": {
        "name": "Lake Chad, Sahel",
        "bbox": [13.5, 12.5, 14.5, 13.5],
        "description": "Shrinking lake with cross-border humanitarian and ecological impact.",
    },
    "central-valley": {
        "name": "Central Valley, California",
        "bbox": [-121.0, 36.0, -119.5, 37.5],
        "description": "Agricultural basin facing groundwater pressure and drought volatility.",
    },
    "aral-sea": {
        "name": "Aral Sea, Central Asia",
        "bbox": [58.0, 44.0, 60.0, 46.0],
        "description": "Historic ecological collapse and partial recovery tracking case.",
    },
}


def footprint_catalog() -> dict[str, list[str]]:
    """Return the currently known provider and model catalog."""
    return {
        "providers": sorted(PROVIDER_WUE.keys()),
        "models": sorted(MODEL_ENERGY_KWH.keys()),
    }
