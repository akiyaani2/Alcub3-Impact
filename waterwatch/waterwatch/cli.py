"""BasinKit CLI for the ALCUB3 Impact open-source toolkit."""

from __future__ import annotations

import argparse
import json
from typing import Any

from waterwatch import WaterIntel


def _dump(payload: dict[str, Any], *, as_json: bool) -> None:
    if as_json:
        print(json.dumps(payload, indent=2, sort_keys=True))
        return
    print(json.dumps(payload, indent=2))


def _sources_payload() -> dict[str, Any]:
    return {
        "toolkit": "BasinKit",
        "package_path": "waterwatch",
        "source_families": {
            "quality": [
                "EPA ECHO",
                "Water Quality Portal",
                "USGS Water Data",
            ],
            "drought_and_flood": [
                "U.S. Drought Monitor",
                "Drought.gov",
                "NOAA National Water Prediction Service",
            ],
            "satellite_and_geospatial": [
                "Copernicus Data Space Ecosystem",
                "Sentinel-1",
                "Sentinel-2",
                "WRI Aqueduct",
            ],
        },
        "docs": {
            "methodology": "docs/METHODOLOGY.md",
            "sources": "docs/SOURCES.md",
            "research": "docs/RESEARCH.md",
        },
    }


def _methodology_payload() -> dict[str, Any]:
    return {
        "evidence_tiers": [
            "measured",
            "estimated",
            "modeled",
            "roadmap",
        ],
        "current_public_score": {
            "version": "v0.1",
            "components": [
                "water quality",
                "drought",
                "flood",
            ],
            "note": "This is a public trust-building score, not a final scientific standard.",
        },
        "docs": {
            "methodology": "docs/METHODOLOGY.md",
            "vision": "docs/VISION.md",
        },
    }


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="basinkit",
        description="Developer and research CLI for ALCUB3 Impact water intelligence.",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    quality = subparsers.add_parser("quality", help="Lookup water quality context")
    quality.add_argument("--json", action="store_true", help="Output JSON")
    quality.add_argument("--lat", type=float, required=True)
    quality.add_argument("--lon", type=float, required=True)
    quality.add_argument("--radius-miles", type=float, default=25)

    drought = subparsers.add_parser("drought", help="Lookup drought status")
    drought.add_argument("--json", action="store_true", help="Output JSON")
    drought.add_argument("--lat", type=float, required=True)
    drought.add_argument("--lon", type=float, required=True)

    flood = subparsers.add_parser("flood", help="Lookup flood risk")
    flood.add_argument("--json", action="store_true", help="Output JSON")
    flood.add_argument("--lat", type=float, required=True)
    flood.add_argument("--lon", type=float, required=True)

    score = subparsers.add_parser("score", help="Compute composite water score")
    score.add_argument("--json", action="store_true", help="Output JSON")
    score.add_argument("--lat", type=float, required=True)
    score.add_argument("--lon", type=float, required=True)

    footprint = subparsers.add_parser("footprint", help="Estimate AI water footprint")
    footprint.add_argument("--json", action="store_true", help="Output JSON")
    footprint.add_argument("--provider", default="openai")
    footprint.add_argument("--model", default="gpt-4")
    footprint.add_argument("--queries", type=int, default=1000)

    company = subparsers.add_parser(
        "footprint-company", help="Estimate company compute water footprint"
    )
    company.add_argument("--json", action="store_true", help="Output JSON")
    company.add_argument("--cloud", default="aws")
    company.add_argument("--gpu", default="a100")
    company.add_argument("--hours", type=float, default=100)

    sources = subparsers.add_parser("sources", help="Show source families and citation docs")
    sources.add_argument("--json", action="store_true", help="Output JSON")

    methodology = subparsers.add_parser("methodology", help="Show evidence-tier and method summary")
    methodology.add_argument("--json", action="store_true", help="Output JSON")

    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()
    intel = WaterIntel()

    if args.command == "quality":
        payload = intel.water_quality(
            lat=args.lat,
            lon=args.lon,
            radius_miles=args.radius_miles,
        )
    elif args.command == "drought":
        payload = intel.drought_status(lat=args.lat, lon=args.lon)
    elif args.command == "flood":
        payload = intel.flood_risk(lat=args.lat, lon=args.lon)
    elif args.command == "score":
        payload = intel.water_score(lat=args.lat, lon=args.lon)
    elif args.command == "footprint":
        payload = intel.ai_water_footprint(
            provider=args.provider,
            model=args.model,
            queries_per_month=args.queries,
        )
    elif args.command == "footprint-company":
        payload = intel.footprint.estimate_company(
            cloud_provider=args.cloud,
            gpu_type=args.gpu,
            compute_hours_monthly=args.hours,
        )
    elif args.command == "sources":
        payload = _sources_payload()
    elif args.command == "methodology":
        payload = _methodology_payload()
    else:
        parser.error(f"Unknown command: {args.command}")
        return

    _dump(payload, as_json=args.json)


if __name__ == "__main__":
    main()
