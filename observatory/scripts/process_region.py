#!/usr/bin/env python3
"""
Observatory: Download Sentinel-2 imagery and compute water detection for a region.

Usage:
    python process_region.py --region lake-mead --start 2025-01 --end 2026-04
    python process_region.py --bbox -114.9,36.0,-114.6,36.3 --start 2025-01 --end 2026-04

Requires: pip install waterwatch[satellite]
"""

import argparse
import json
import sys
from pathlib import Path

# Add waterwatch to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent / "waterwatch"))

from waterwatch.satellite import SatelliteClient

# Pre-defined regions of interest
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
    results = search_region(client, bbox, start_date, end_date)

    if not results:
        print("No imagery found. Try widening the date range or increasing cloud cover threshold.")
        return

    # Save search results
    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)

    region_slug = args.region or "custom"
    output_file = output_dir / f"{region_slug}-search-results.json"
    with open(output_file, "w") as f:
        json.dump(
            {
                "region": name,
                "bbox": bbox,
                "date_range": [start_date, end_date],
                "imagery_count": len(results),
                "results": results,
            },
            f,
            indent=2,
        )
    print(f"\nSearch results saved to {output_file}")
    print("\nNext steps:")
    print("  1. Download imagery: python download_imagery.py --results", output_file)
    print("  2. Compute NDWI: python compute_ndwi.py --input <downloaded_dir>")
    print("  3. Run SAM 3: python detect_water.py --input <ndwi_output>")


if __name__ == "__main__":
    main()
