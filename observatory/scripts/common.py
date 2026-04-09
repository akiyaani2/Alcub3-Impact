"""Shared helpers for public Observatory scripts."""

from __future__ import annotations

import json
import re
from datetime import UTC, datetime
from pathlib import Path

import numpy as np


REPO_ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = REPO_ROOT / "observatory" / "data"
OUTPUT_DIR = REPO_ROOT / "observatory" / "outputs"


REGIONS = {
    "lake-mead": {
        "name": "Lake Mead, Nevada",
        "bbox": [-114.9, 36.0, -114.6, 36.3],
        "description": "North America's largest reservoir — drought indicator",
    },
    "gaza": {
        "name": "Gaza Aquifer, Palestine",
        "bbox": [34.2, 31.2, 34.6, 31.6],
        "description": "Coastal aquifer under extreme stress",
    },
    "lake-chad": {
        "name": "Lake Chad, Sahel",
        "bbox": [13.5, 12.5, 14.5, 13.5],
        "description": "Shrinking lake affecting 30M+ people across 4 countries",
    },
    "central-valley": {
        "name": "Central Valley, California",
        "bbox": [-121.0, 36.0, -119.5, 37.5],
        "description": "Agricultural groundwater under pressure",
    },
    "aral-sea": {
        "name": "Aral Sea, Central Asia",
        "bbox": [58.0, 44.0, 60.0, 46.0],
        "description": "Historic ecological disaster — recovery tracking",
    },
}


def utc_now_iso() -> str:
    return datetime.now(UTC).replace(microsecond=0).isoformat()


def slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def save_json(path: str | Path, payload: dict) -> Path:
    output = Path(path)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(payload, indent=2))
    return output


def load_json(path: str | Path) -> dict:
    return json.loads(Path(path).read_text())


def scene_slug(scene: dict, index: int) -> str:
    base = scene.get("date", "")[:10] or scene.get("name", "") or f"scene-{index+1}"
    return slugify(base)


def generate_mock_bands(seed: int, shape: tuple[int, int] = (256, 256)) -> tuple[np.ndarray, np.ndarray]:
    """Generate deterministic green/nir bands for a synthetic water body scene."""
    rng = np.random.default_rng(seed)
    height, width = shape
    yy, xx = np.mgrid[0:height, 0:width]

    green = rng.normal(0.22, 0.03, size=shape)
    nir = rng.normal(0.42, 0.04, size=shape)

    cx = width * (0.45 + rng.uniform(-0.08, 0.08))
    cy = height * (0.5 + rng.uniform(-0.08, 0.08))
    rx = width * (0.18 + rng.uniform(0.0, 0.08))
    ry = height * (0.12 + rng.uniform(0.0, 0.07))

    water_mask = (((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2) <= 1

    green[water_mask] = rng.normal(0.48, 0.04, size=int(water_mask.sum()))
    nir[water_mask] = rng.normal(0.12, 0.03, size=int(water_mask.sum()))

    shoreline_mask = (((xx - cx) / (rx * 1.2)) ** 2 + ((yy - cy) / (ry * 1.2)) ** 2) <= 1
    shoreline_only = shoreline_mask & ~water_mask
    green[shoreline_only] = rng.normal(0.32, 0.03, size=int(shoreline_only.sum()))
    nir[shoreline_only] = rng.normal(0.26, 0.03, size=int(shoreline_only.sum()))

    return np.clip(green, 0, 1).astype(np.float32), np.clip(nir, 0, 1).astype(np.float32)


def resolve_region_slug(payload: dict, fallback: str = "custom") -> str:
    if payload.get("region_slug"):
        return payload["region_slug"]
    region_name = payload.get("region")
    if region_name:
        return slugify(region_name)
    return fallback
