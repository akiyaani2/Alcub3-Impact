"""AI water footprint estimation using published data center WUE data."""

from __future__ import annotations

# Water Usage Effectiveness (WUE) data from published sustainability reports
# Units: liters of water per kWh of electricity consumed
# Sources: Google (2024 Environmental Report), Microsoft (2024 Sustainability Report),
#          Meta (2024 Sustainability Report), research papers
PROVIDER_WUE = {
    "google": {
        "wue_l_per_kwh": 1.1,  # Google average WUE
        "source": "Google 2024 Environmental Report",
        "renewable_pct": 100,
    },
    "microsoft": {
        "wue_l_per_kwh": 1.8,  # Microsoft average (higher in arid regions)
        "source": "Microsoft 2024 Sustainability Report",
        "renewable_pct": 100,
    },
    "meta": {
        "wue_l_per_kwh": 0.9,  # Meta has efficient cooling
        "source": "Meta 2024 Sustainability Report",
        "renewable_pct": 100,
    },
    "openai": {
        "wue_l_per_kwh": 1.8,  # Uses Microsoft Azure infrastructure
        "source": "Estimated from Microsoft Azure WUE",
        "renewable_pct": 100,
    },
    "anthropic": {
        "wue_l_per_kwh": 1.5,  # Mix of GCP and AWS
        "source": "Estimated from GCP/AWS WUE averages",
        "renewable_pct": 95,
    },
    "amazon": {
        "wue_l_per_kwh": 1.4,
        "source": "AWS 2024 Sustainability Report",
        "renewable_pct": 100,
    },
    "default": {
        "wue_l_per_kwh": 1.5,
        "source": "Industry average estimate",
        "renewable_pct": 80,
    },
}

# Estimated energy per inference query (kWh)
# Based on published research and model architecture estimates
MODEL_ENERGY_KWH = {
    # Large language models
    "gpt-4": 0.005,        # ~5 Wh per query (estimated)
    "gpt-4o": 0.003,       # Smaller/optimized
    "gpt-3.5-turbo": 0.001,
    "claude-opus-4-6": 0.005,
    "claude-sonnet-4-6": 0.003,
    "claude-haiku-4-5": 0.001,
    "gemini-pro": 0.004,
    "gemini-flash": 0.001,
    "llama-3-70b": 0.004,
    "llama-3-8b": 0.001,
    # Image models
    "dall-e-3": 0.02,       # Image generation is energy-intensive
    "midjourney": 0.02,
    "stable-diffusion": 0.008,
    # Default
    "default": 0.003,
}


class FootprintCalculator:
    """Estimates the water footprint of AI usage."""

    def estimate(
        self,
        *,
        provider: str = "openai",
        model: str = "gpt-4",
        queries_per_month: int = 1000,
    ) -> dict:
        provider_key = provider.lower()
        model_key = model.lower()

        wue_data = PROVIDER_WUE.get(provider_key, PROVIDER_WUE["default"])
        energy_per_query = MODEL_ENERGY_KWH.get(model_key, MODEL_ENERGY_KWH["default"])

        wue = wue_data["wue_l_per_kwh"]

        # Total energy (kWh/month)
        total_energy_kwh = energy_per_query * queries_per_month

        # Total water (liters/month)
        total_water_liters = total_energy_kwh * wue
        total_water_gallons = total_water_liters * 0.264172

        # Annual projections
        annual_liters = total_water_liters * 12
        annual_gallons = total_water_gallons * 12

        # Offset cost estimate ($1 per 1000 gallons = rough charity:water equivalent)
        offset_cost_monthly = total_water_gallons / 1000
        offset_cost_annual = annual_gallons / 1000

        # Context comparisons
        showers_equivalent = total_water_liters / 65  # avg shower = 65L
        drinking_days = total_water_liters / 2  # 2L/day recommended

        return {
            "provider": provider,
            "model": model,
            "queries_per_month": queries_per_month,
            "energy_kwh_per_query": energy_per_query,
            "total_energy_kwh_monthly": round(total_energy_kwh, 4),
            "water_liters_monthly": round(total_water_liters, 2),
            "water_gallons_monthly": round(total_water_gallons, 2),
            "water_liters_annual": round(annual_liters, 2),
            "water_gallons_annual": round(annual_gallons, 2),
            "offset_cost_usd_monthly": round(offset_cost_monthly, 2),
            "offset_cost_usd_annual": round(offset_cost_annual, 2),
            "context": {
                "equivalent_showers": round(showers_equivalent, 1),
                "equivalent_drinking_water_days": round(drinking_days, 1),
            },
            "methodology": {
                "wue_l_per_kwh": wue,
                "wue_source": wue_data["source"],
                "energy_source": "Estimated from model architecture and published benchmarks",
                "note": "These are estimates. Actual water usage varies by data center location, "
                        "cooling technology, and time of year. See methodology page for details.",
            },
        }

    def estimate_company(
        self,
        *,
        cloud_provider: str = "aws",
        compute_hours_monthly: float = 100,
        gpu_type: str = "a100",
    ) -> dict:
        """Estimate water footprint for enterprise compute usage."""
        # GPU power consumption (watts)
        gpu_watts = {
            "a100": 400,
            "h100": 700,
            "l40": 300,
            "t4": 70,
            "v100": 300,
            "a10g": 150,
            "default": 300,
        }

        watts = gpu_watts.get(gpu_type.lower(), gpu_watts["default"])
        kwh = (watts / 1000) * compute_hours_monthly
        wue_data = PROVIDER_WUE.get(cloud_provider.lower(), PROVIDER_WUE["default"])
        water_liters = kwh * wue_data["wue_l_per_kwh"]
        water_gallons = water_liters * 0.264172

        return {
            "cloud_provider": cloud_provider,
            "compute_hours_monthly": compute_hours_monthly,
            "gpu_type": gpu_type,
            "energy_kwh_monthly": round(kwh, 2),
            "water_liters_monthly": round(water_liters, 2),
            "water_gallons_monthly": round(water_gallons, 2),
            "offset_cost_usd_monthly": round(water_gallons / 1000, 2),
            "methodology": {
                "gpu_watts": watts,
                "wue_l_per_kwh": wue_data["wue_l_per_kwh"],
                "wue_source": wue_data["source"],
            },
        }
