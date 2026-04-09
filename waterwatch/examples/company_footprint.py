"""Estimate AI compute water footprint for a simple company scenario."""

from __future__ import annotations

from basinkit import WaterIntel


def main() -> None:
    intel = WaterIntel()
    scenario = intel.footprint.estimate_company(
        cloud_provider="aws",
        gpu_type="a100",
        compute_hours_monthly=250,
    )

    print("Company Compute Footprint")
    print("-------------------------")
    print(f"Estimated gallons per month: {scenario['water_gallons_monthly']}")
    print(f"Estimated liters per month: {scenario['water_liters_monthly']}")
    print(f"Cloud: {scenario['cloud_provider']}")
    print(f"GPU: {scenario['gpu_type']}")


if __name__ == "__main__":
    main()
