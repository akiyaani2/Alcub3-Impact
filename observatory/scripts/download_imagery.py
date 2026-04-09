#!/usr/bin/env python3
"""Create a local imagery manifest for Observatory work.

This script currently supports a reproducible mock mode for demos and testing.
Authenticated Copernicus downloads can be added later without changing the manifest shape.
"""

from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np

from common import DATA_DIR, load_json, resolve_region_slug, save_json, scene_slug, utc_now_iso, generate_mock_bands


def main() -> None:
    parser = argparse.ArgumentParser(description="Create a local imagery manifest from search results")
    parser.add_argument("--results", required=True, help="Path to *-search-results.json")
    parser.add_argument("--output", default=str(DATA_DIR), help="Base output directory")
    parser.add_argument("--limit", type=int, default=5, help="Max scenes to prepare")
    parser.add_argument("--mock", action="store_true", help="Generate deterministic mock band files")
    args = parser.parse_args()

    results = load_json(args.results)
    region_slug = resolve_region_slug(results)
    output_dir = Path(args.output) / region_slug
    output_dir.mkdir(parents=True, exist_ok=True)

    scenes = []
    for index, scene in enumerate(results.get("results", [])[: args.limit]):
        slug = scene_slug(scene, index)
        entry = {
            "id": scene.get("id"),
            "name": scene.get("name"),
            "date": scene.get("date"),
            "cloud_cover": scene.get("cloud_cover"),
            "scene_slug": slug,
            "mode": "metadata_only",
        }

        if args.mock:
            green, nir = generate_mock_bands(seed=index + 1)
            bands_path = output_dir / f"{slug}-bands.npz"
            np.savez_compressed(bands_path, green=green, nir=nir)
            entry["mode"] = "mock"
            entry["bands_path"] = str(bands_path)

        scenes.append(entry)

    manifest = {
        "region": results.get("region"),
        "region_slug": region_slug,
        "bbox": results.get("bbox"),
        "date_range": results.get("date_range"),
        "source_results": str(Path(args.results)),
        "generated_at": utc_now_iso(),
        "mode": "mock" if args.mock else "metadata_only",
        "scenes": scenes,
    }

    manifest_path = output_dir / "imagery-manifest.json"
    save_json(manifest_path, manifest)

    print(f"Manifest saved to {manifest_path}")
    if args.mock:
        print(f"Generated {len(scenes)} mock band bundles in {output_dir}")
        print(f"Next: python observatory/scripts/compute_ndwi.py --input {manifest_path}")
    else:
        print("Created metadata-only manifest. Re-run with --mock for a reproducible public demo.")


if __name__ == "__main__":
    main()
