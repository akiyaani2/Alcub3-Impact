#!/usr/bin/env python3
"""Compute NDWI rasters from a local Observatory imagery manifest."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).parent.parent.parent / "waterwatch"))

from waterwatch.satellite import SatelliteClient
from common import OUTPUT_DIR, load_json, save_json, utc_now_iso


def main() -> None:
    parser = argparse.ArgumentParser(description="Compute NDWI outputs from local band bundles")
    parser.add_argument("--input", required=True, help="Path to imagery-manifest.json")
    parser.add_argument("--output", default=str(OUTPUT_DIR), help="Base output directory")
    args = parser.parse_args()

    manifest = load_json(args.input)
    region_slug = manifest["region_slug"]
    output_dir = Path(args.output) / region_slug
    output_dir.mkdir(parents=True, exist_ok=True)

    client = SatelliteClient(data_dir=output_dir)
    ndwi_scenes = []

    for scene in manifest.get("scenes", []):
        bands_path = scene.get("bands_path")
        if not bands_path:
            continue
        bundle = np.load(bands_path)
        ndwi = client.compute_ndwi(bundle["green"], bundle["nir"])
        ndwi_path = output_dir / f"{scene['scene_slug']}-ndwi.npy"
        np.save(ndwi_path, ndwi)
        ndwi_scenes.append(
            {
                **scene,
                "ndwi_path": str(ndwi_path),
                "ndwi_stats": {
                    "min": round(float(ndwi.min()), 4),
                    "max": round(float(ndwi.max()), 4),
                    "mean": round(float(ndwi.mean()), 4),
                },
            }
        )

    ndwi_manifest = {
        "region": manifest.get("region"),
        "region_slug": region_slug,
        "bbox": manifest.get("bbox"),
        "date_range": manifest.get("date_range"),
        "source_manifest": str(Path(args.input)),
        "generated_at": utc_now_iso(),
        "scenes": ndwi_scenes,
    }

    ndwi_manifest_path = output_dir / "ndwi-manifest.json"
    save_json(ndwi_manifest_path, ndwi_manifest)
    print(f"NDWI manifest saved to {ndwi_manifest_path}")
    print(f"Next: python observatory/scripts/detect_water.py --input {ndwi_manifest_path}")


if __name__ == "__main__":
    main()
