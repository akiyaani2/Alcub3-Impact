#!/usr/bin/env python3
"""Detect water coverage and change from NDWI outputs."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).parent.parent.parent / "waterwatch"))

from waterwatch.satellite import SatelliteClient
from common import OUTPUT_DIR, load_json, save_json, utc_now_iso


def main() -> None:
    parser = argparse.ArgumentParser(description="Compute water detection summaries from NDWI rasters")
    parser.add_argument("--input", required=True, help="Path to ndwi-manifest.json")
    parser.add_argument("--output", default=str(OUTPUT_DIR), help="Base output directory")
    parser.add_argument("--threshold", type=float, default=0.3, help="NDWI threshold for water detection")
    args = parser.parse_args()

    manifest = load_json(args.input)
    region_slug = manifest["region_slug"]
    output_dir = Path(args.output) / region_slug
    output_dir.mkdir(parents=True, exist_ok=True)

    client = SatelliteClient(data_dir=output_dir)
    scene_results = []
    ndwi_arrays = []

    for scene in manifest.get("scenes", []):
        ndwi_path = scene.get("ndwi_path")
        if not ndwi_path:
            continue
        ndwi = np.load(ndwi_path)
        ndwi_arrays.append((scene["scene_slug"], ndwi))
        scene_results.append(
            {
                "scene_slug": scene["scene_slug"],
                "date": scene.get("date"),
                "threshold": args.threshold,
                "summary": client.detect_water_bodies(ndwi, threshold=args.threshold),
            }
        )

    change_summary = None
    if len(ndwi_arrays) >= 2:
        first_slug, first = ndwi_arrays[0]
        last_slug, last = ndwi_arrays[-1]
        change_summary = {
            "from_scene": first_slug,
            "to_scene": last_slug,
            "summary": client.change_detection(first, last, threshold=args.threshold),
        }

    payload = {
        "region": manifest.get("region"),
        "region_slug": region_slug,
        "generated_at": utc_now_iso(),
        "threshold": args.threshold,
        "scene_results": scene_results,
        "change_detection": change_summary,
    }

    json_path = output_dir / "water-detection.json"
    save_json(json_path, payload)

    geojson_path = output_dir / "water-detection.geojson"
    geojson = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": None,
                "properties": {
                    "scene_slug": result["scene_slug"],
                    "date": result.get("date"),
                    **result["summary"],
                },
            }
            for result in scene_results
        ],
    }
    geojson_path.write_text(json.dumps(geojson, indent=2))

    print(f"Water detection summary saved to {json_path}")
    print(f"GeoJSON summary saved to {geojson_path}")
    if change_summary:
        print(
            "Change interpretation:",
            change_summary["summary"]["interpretation"],
            f"({change_summary['from_scene']} -> {change_summary['to_scene']})",
        )


if __name__ == "__main__":
    main()
