"""BasinKit CLI for the ALCUB3 Impact open-source toolkit."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

from waterwatch import WaterIntel
from waterwatch.catalog import OBSERVATORY_REGIONS, footprint_catalog


def _dump(payload: dict[str, Any], *, as_json: bool) -> None:
    if as_json:
        print(json.dumps(payload, indent=2, sort_keys=True))
        return
    print(json.dumps(payload, indent=2))


def _emit(payload: dict[str, Any], *, as_json: bool, output_path: str | None) -> None:
    if output_path:
        output = Path(output_path)
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(json.dumps(payload, indent=2, sort_keys=as_json))
    _dump(payload, as_json=as_json)


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


def _add_output_flag(command: argparse.ArgumentParser) -> None:
    command.add_argument("--output", help="Write JSON output to a file")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="basinkit",
        description="Developer and research CLI for ALCUB3 Impact water intelligence.",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    quality = subparsers.add_parser("quality", help="Lookup water quality context")
    quality.add_argument("--json", action="store_true", help="Output JSON")
    _add_output_flag(quality)
    quality.add_argument("--lat", type=float, required=True)
    quality.add_argument("--lon", type=float, required=True)
    quality.add_argument("--radius-miles", type=float, default=25)

    drought = subparsers.add_parser("drought", help="Lookup drought status")
    drought.add_argument("--json", action="store_true", help="Output JSON")
    _add_output_flag(drought)
    drought.add_argument("--lat", type=float, required=True)
    drought.add_argument("--lon", type=float, required=True)

    flood = subparsers.add_parser("flood", help="Lookup flood risk")
    flood.add_argument("--json", action="store_true", help="Output JSON")
    _add_output_flag(flood)
    flood.add_argument("--lat", type=float, required=True)
    flood.add_argument("--lon", type=float, required=True)

    score = subparsers.add_parser("score", help="Compute composite water score")
    score.add_argument("--json", action="store_true", help="Output JSON")
    _add_output_flag(score)
    score.add_argument("--lat", type=float, required=True)
    score.add_argument("--lon", type=float, required=True)

    pulse = subparsers.add_parser("pulse", help="Return the full Water Pulse bundle")
    pulse.add_argument("--json", action="store_true", help="Output JSON")
    _add_output_flag(pulse)
    pulse.add_argument("--lat", type=float, required=True)
    pulse.add_argument("--lon", type=float, required=True)
    pulse.add_argument("--radius-miles", type=float, default=25)

    footprint = subparsers.add_parser("footprint", help="Estimate AI water footprint")
    footprint.add_argument("--json", action="store_true", help="Output JSON")
    _add_output_flag(footprint)
    footprint.add_argument("--provider", default="openai")
    footprint.add_argument("--model", default="gpt-4")
    footprint.add_argument("--queries", type=int, default=1000)

    company = subparsers.add_parser(
        "footprint-company", help="Estimate company compute water footprint"
    )
    company.add_argument("--json", action="store_true", help="Output JSON")
    _add_output_flag(company)
    company.add_argument("--cloud", default="aws")
    company.add_argument("--gpu", default="a100")
    company.add_argument("--hours", type=float, default=100)

    sources = subparsers.add_parser("sources", help="Show source families and citation docs")
    sources.add_argument("--json", action="store_true", help="Output JSON")
    _add_output_flag(sources)

    methodology = subparsers.add_parser("methodology", help="Show evidence-tier and method summary")
    methodology.add_argument("--json", action="store_true", help="Output JSON")
    _add_output_flag(methodology)

    providers = subparsers.add_parser("providers", help="Show supported footprint providers and models")
    providers.add_argument("--json", action="store_true", help="Output JSON")
    _add_output_flag(providers)

    regions = subparsers.add_parser("regions", help="Show curated public observatory regions")
    regions.add_argument("--json", action="store_true", help="Output JSON")
    _add_output_flag(regions)

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
    elif args.command == "pulse":
        payload = intel.pulse(
            lat=args.lat,
            lon=args.lon,
            radius_miles=args.radius_miles,
        )
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
    elif args.command == "providers":
        payload = {
            "toolkit": "BasinKit",
            "catalog": footprint_catalog(),
        }
    elif args.command == "regions":
        payload = {
            "toolkit": "BasinKit",
            "regions": OBSERVATORY_REGIONS,
        }
    else:
        parser.error(f"Unknown command: {args.command}")
        return

    _emit(payload, as_json=args.json, output_path=getattr(args, "output", None))


if __name__ == "__main__":
    main()
