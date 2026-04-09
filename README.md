# ALCUB3 Impact

AI-native water intelligence built on public data, open tools, and transparent methods.

ALCUB3 Impact is the water-intelligence venture built on ALCUB3's shared platform rails. This repository contains the public product surface, the open-source developer layer, and the observatory workflows that make the system inspectable.

## What This Repo Includes

| Surface | Status | What it does |
| --- | --- | --- |
| `Water Pulse` | Beta | Consumer water lookup by zip code with public-data scoring and contextual risk surfaces |
| `BasinKit` | Live | MIT-licensed Python toolkit for water intelligence primitives (`waterwatch/` during transition) |
| `Observatory` | Labs | Satellite and geospatial workflows for water change and monitoring |
| `Impact API` | Waitlist / Beta | Hosted water intelligence and reporting infrastructure |

## Public vs Hosted

This repository is intentionally mixed:

- **Open-source / public**
  - BasinKit library
  - public methodology
  - observatory scripts and example outputs
  - guest-first web experience
- **Hosted / gated**
  - saved places, alerts, and account history
  - private monitoring workflows
  - higher-volume Impact API access
  - enterprise and portfolio intelligence features

The goal is to keep the trust layer open while monetizing the hosted layer.

## Product Model

ALCUB3 Impact separates three lanes publicly:

- **Product**: usable surfaces people can act on now
- **Labs**: experimental sensing, forecasting, and observatory work
- **Research**: methods, caveats, and evidence that we are prepared to defend publicly

That distinction is part of the trust model.

## Current Launch Stack

### Water Pulse

Guest-first consumer entry point for local water visibility.

- Zip code lookup
- Water quality, drought, and flood context
- product-facing methodology and answers pages
- no sign-in required for first value

Planned layers include PFAS risk, groundwater health, and infrastructure risk. Those should be presented as modeled or estimated outputs, not as direct diagnosis.

### BasinKit

MIT-licensed Python toolkit for fetching, scoring, and reporting water intelligence.

- public-data connectors
- scoring primitives
- reporting helpers
- geospatial and satellite hooks

### Observatory

Labs-facing proof surface for water monitoring.

- regional previews
- geospatial workflows
- water-body change detection
- flood / drought monitoring experiments

### Impact API

Hosted infrastructure for developers, partners, and institutional users.

- water reporting
- risk scoring
- monitoring workflows
- partner and portfolio surfaces

## Quick Start

### Water Pulse app

```bash
cd app
npm install
npm run dev
```

Open `http://localhost:3000`.

Useful routes:

- `/` — Water Intelligence homepage
- `/pulse` — Water Pulse
- `/footprint` — AI water footprint
- `/observatory` — Labs surface
- `/methodology` — product-facing trust layer
- `/answers` — public product FAQ / explanation
- `/account` — progressive access and gating model

### BasinKit

```bash
cd waterwatch
pip install -e .
```

```python
from waterwatch import WaterIntel

intel = WaterIntel()

quality = intel.water_quality(lat=40.7128, lon=-74.0060)
drought = intel.drought_status(lat=40.7128, lon=-74.0060)
footprint = intel.ai_water_footprint(provider="openai", model="gpt-4", queries_per_month=10000)
water = intel.detect_water(
    bbox=[-74.1, 40.6, -73.9, 40.8],
    date_range=["2025-01", "2026-01"],
)
```

### Observatory

```bash
cd observatory
python scripts/process_region.py --region lake_mead --start 2025-01 --end 2026-04
```

## Evidence Tiers

Every public-facing claim should be understood as one of:

- **Measured**: direct public observations, gauges, or regulatory records
- **Estimated**: defensible approximations where direct facility-level data is unavailable
- **Modeled**: probabilistic inference built from validated signals and correlates
- **Roadmap**: active direction, not yet an operational claim

See [docs/METHODOLOGY.md](docs/METHODOLOGY.md).

## Data Sources

Core public sources currently used or targeted:

- USGS Water Data
- EPA ECHO / drinking water records
- NOAA / flood and drought feeds
- Drought.gov / US Drought Monitor
- Sentinel-1 / Sentinel-2 imagery
- WHO / UNICEF JMP
- WRI Aqueduct (for stress-weighted impact work)

## Architecture

```text
alcub3-impact/
├── app/                    # Next.js app for public product surfaces
│   ├── src/app/            # Routes and API handlers
│   ├── src/components/     # Shared UI components
│   └── public/             # Static assets
├── waterwatch/             # BasinKit toolkit package (path retained during transition)
│   ├── waterwatch/         # Core package
│   └── tests/             # Library tests
├── observatory/            # Geospatial / satellite workflows
│   ├── scripts/
│   ├── data/               # Downloaded inputs (gitignored)
│   └── outputs/            # Example outputs
├── api/                    # Reserved for heavier hosted endpoints
└── docs/                   # Public vision, methods, roadmap, and contribution docs
```

## Documentation

- [Vision](docs/VISION.md)
- [Naming](docs/NAMING.md)
- [Methodology](docs/METHODOLOGY.md)
- [Roadmap](docs/ROADMAP.md)
- [Research](docs/RESEARCH.md)
- [Sources](docs/SOURCES.md)
- [CLI](docs/CLI.md)
- [Contributing](docs/CONTRIBUTING.md)
- [Security](docs/SECURITY.md)

## Contributing

Contributions are welcome, especially in:

- public-data connectors
- scoring and reporting utilities
- observatory workflows
- documentation and methodology clarity
- test coverage

Start with [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md).

## License

MIT. See [LICENSE](LICENSE).

Built by [ALCUB3](https://alcub3.com).
