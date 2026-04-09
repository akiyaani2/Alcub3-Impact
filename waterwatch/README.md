# WaterWatch

Public naming is moving toward **BasinKit** for the toolkit and `basinkit` for the CLI. The current Python package path remains `waterwatch` during the transition.

WaterWatch is the open-source developer layer for ALCUB3 Impact.

It is a Python toolkit for water intelligence primitives built on public data and transparent methods.

## Status

Alpha. Useful for early development, experimentation, and integration work, but still evolving.

## What It Covers

- water-quality fetching and scoring helpers
- drought and climate context
- AI water-footprint estimation
- satellite and geospatial hooks
- reporting-oriented intelligence primitives

## Install

```bash
pip install -e .
```

## Example

```python
from waterwatch import WaterIntel

intel = WaterIntel()

quality = intel.water_quality(lat=40.7128, lon=-74.0060)
drought = intel.drought_status(lat=40.7128, lon=-74.0060)
footprint = intel.ai_water_footprint(
    provider="openai",
    model="gpt-4",
    queries_per_month=10000,
)
```

## CLI

Install the package locally, then use the first CLI entry point:

```bash
basinkit sources
basinkit methodology
basinkit score --lat 33.4484 --lon -112.0740 --json
basinkit footprint --provider openai --model gpt-4o --queries 10000 --json
```

## Design Intent

WaterWatch is not meant to hide public water data behind a black box. It is meant to make:

- public-data access easier
- scoring primitives reusable
- reporting infrastructure more legible
- product claims easier to inspect

## Relationship To ALCUB3 Impact

WaterWatch is the open-source trust layer.

The hosted venture layer lives in the broader ALCUB3 Impact stack:

- Water Pulse
- Observatory
- Impact API

See the root [README](../README.md) and [docs](../docs/) for the broader public context.

## License

MIT.
