# ALCUB3 Impact

Open-source AI water intelligence platform.

**Water Pulse** | **WaterWatch** | **Observatory** | **Impact API**

---

## What This Is

ALCUB3 Impact builds water intelligence products for people, organizations, and public-interest partners. We combine free public water data with open-source AI to make water information accessible, predictive, and actionable.

- **Water Pulse** — Enter your zip code, get your water health score. Quality, drought risk, flood risk, AI water footprint.
- **WaterWatch** — Open-source Python library for water intelligence. Unified API across USGS, NOAA, EPA, Sentinel-2, and more.
- **Observatory** — Satellite water monitoring. Before/after change detection, flood mapping, drought progression.
- **Impact API** — Enterprise water footprint reporting and offset verification.

## Quick Start

### Water Pulse (Web App)

```bash
cd app
npm install
npm run dev
# → http://localhost:3000
```

### WaterWatch (Python Library)

```bash
cd waterwatch
pip install -e .
```

```python
from waterwatch import WaterIntel

intel = WaterIntel()

# Water quality for a location
quality = intel.water_quality(lat=40.7128, lon=-74.0060)

# Drought conditions
drought = intel.drought_status(lat=40.7128, lon=-74.0060)

# AI water footprint estimate
footprint = intel.ai_water_footprint(provider="openai", model="gpt-4", queries_per_month=10000)

# Satellite water detection
water = intel.detect_water(bbox=[-74.1, 40.6, -73.9, 40.8], date_range=["2025-01", "2026-01"])
```

### Observatory

```bash
cd observatory
python scripts/process_region.py --region gaza --start 2025-01 --end 2026-04
```

## Data Sources (All Free)

| Source | What | Access |
|--------|------|--------|
| USGS Water Data | Real-time streamflow, water quality | api.waterdata.usgs.gov |
| EPA Water Quality Portal | 430M+ contamination records | waterqualitydata.us |
| NOAA NWPS | Flood predictions, streamflow forecasts | water.noaa.gov |
| Drought.gov | Drought indices, daily updates | drought.gov |
| Sentinel-2 (Copernicus) | 10m satellite imagery, 5-day revisit | dataspace.copernicus.eu |
| WHO/UNICEF JMP | Global water access statistics | washdata.org |

## Tech Stack

- **Frontend:** Next.js 15 + Tailwind CSS (Vercel)
- **Python Library:** WaterWatch (pip installable)
- **Satellite Processing:** SAM 3 + segment-geospatial + WaterDetect
- **APIs:** USGS, NOAA, EPA, Copernicus (all free)
- **Database:** Supabase (free tier)

## Architecture

```
alcub3-impact/
├── app/                    # Next.js 15 web application
│   ├── src/
│   │   ├── app/            # App router pages
│   │   ├── components/     # UI components
│   │   ├── lib/            # Data fetching + scoring
│   │   └── styles/         # Tailwind config
│   └── package.json
├── waterwatch/             # Python library (pip installable)
│   ├── waterwatch/
│   │   ├── quality.py      # USGS/EPA water quality
│   │   ├── climate.py      # NOAA flood/drought
│   │   ├── satellite.py    # Sentinel-2 + SAM 3
│   │   ├── footprint.py    # AI water footprint
│   │   └── score.py        # Composite scoring
│   ├── tests/
│   ├── notebooks/
│   └── pyproject.toml
├── observatory/            # Satellite processing pipeline
│   ├── scripts/
│   ├── data/               # Downloaded imagery (gitignored)
│   └── outputs/            # Processed maps (committed)
├── api/                    # FastAPI for ML-heavy endpoints
└── docs/
```

## License

MIT

## Contributing

This is an open-source project. Contributions welcome. See [CONTRIBUTING.md](docs/CONTRIBUTING.md).

---

Built by [ALCUB3](https://alcub3.com) | Powered by open data and open-source AI
