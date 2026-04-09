#!/usr/bin/env python3
"""
Observatory: Download Sentinel-2 imagery and compute water detection for a region.

Usage:
    python process_region.py --region lake-mead --start 2025-01 --end 2026-04
    python process_region.py --bbox -114.9,36.0,-114.6,36.3 --start 2025-01 --end 2026-04

Requires: pip install waterwatch[satellite]
"""

import argparse
import sys
from pathlib import Path

# Add waterwatch to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent / "waterwatch"))

from waterwatch.satellite import SatelliteClient
from common import REGIONS, save_json, utc_now_iso


def search_region(client: SatelliteClient, bbox: list, start: str, end: str):
    """Search for available Sentinel-2 imagery."""
    print(f"Searching Copernicus for imagery in bbox {bbox}...")
    results = client.search_imagery(
        bbox=bbox,
        start_date=start,
        end_date=end,
        max_cloud_cover=15.0,
        max_results=20,
    )
    print(f"Found {len(results)} images with <15% cloud cover")
    for r in results[:5]:
        print(f"  {r['date'][:10]} | cloud: {r.get('cloud_cover', '?')}% | {r['name'][:60]}")
    return results


def main():
    parser = argparse.ArgumentParser(description="Process satellite imagery for water detection")
    parser.add_argument("--region", choices=list(REGIONS.keys()), help="Pre-defined region")
    parser.add_argument("--bbox", type=str, help="Custom bbox: west,south,east,north")
    parser.add_argument("--start", required=True, help="Start date (YYYY-MM)")
    parser.add_argument("--end", required=True, help="End date (YYYY-MM)")
    parser.add_argument("--output", default="observatory/outputs", help="Output directory")
    parser.add_argument("--max-results", type=int, default=20, help="Max scenes to return")
    parser.add_argument("--cloud-cover", type=float, default=15.0, help="Max cloud cover percentage")
    args = parser.parse_args()

    if args.region:
        region = REGIONS[args.region]
        bbox = region["bbox"]
        name = region["name"]
        print(f"\nRegion: {name}")
        print(f"Description: {region['description']}")
    elif args.bbox:
        bbox = [float(x) for x in args.bbox.split(",")]
        name = f"custom-{args.bbox}"
    else:
        parser.error("Either --region or --bbox is required")
        return

    start_date = f"{args.start}-01"
    end_date = f"{args.end}-28"

    client = SatelliteClient(data_dir="observatory/data")

    # Search for imagery
    results = client.search_imagery(
        bbox=bbox,
        start_date=start_date,
        end_date=end_date,
        max_cloud_cover=args.cloud_cover,
        max_results=args.max_results,
    )

    print(f"Found {len(results)} images with <{args.cloud_cover}% cloud cover")
    for r in results[:5]:
        print(f"  {r['date'][:10]} | cloud: {r.get('cloud_cover', '?')}% | {r['name'][:60]}")

    if not results:
        print("No imagery found. Try widening the date range or increasing cloud cover threshold.")
        return

    # Save search results
    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)

    region_slug = args.region or "custom"
    output_file = output_dir / f"{region_slug}-search-results.json"
    save_json(
        output_file,
        {
            "region": name,
            "region_slug": region_slug,
            "bbox": bbox,
            "date_range": [start_date, end_date],
            "imagery_count": len(results),
            "generated_at": utc_now_iso(),
            "results": results,
        },
    )
    print(f"\nSearch results saved to {output_file}")
    print("\nNext steps:")
    print("  1. Reproducible demo bands: python observatory/scripts/download_imagery.py --results", output_file, "--mock")
    print("  2. Compute NDWI: python observatory/scripts/compute_ndwi.py --input <manifest.json>")
    print("  3. Detect water: python observatory/scripts/detect_water.py --input <ndwi-manifest.json>")


if __name__ == "__main__":
    main()
