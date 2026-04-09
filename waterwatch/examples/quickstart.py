"""Minimal BasinKit quickstart example."""

from __future__ import annotations

from basinkit import WaterIntel


def main() -> None:
    intel = WaterIntel(timeout=15.0)
    try:
        pulse = intel.pulse(lat=33.4484, lon=-112.0740)
    finally:
        intel.close()

    print("Phoenix Water Pulse")
    print("-------------------")
    print(f"Overall score: {pulse['score']['overall_score']}")
    print(f"Grade: {pulse['score']['grade']}")
    print(f"Quality grade: {pulse['quality']['quality_grade']}")
    print(f"Drought level: {pulse['drought']['drought_level']}")
    print(f"Flood status: {pulse['flood']['flood_status']}")


if __name__ == "__main__":
    main()
