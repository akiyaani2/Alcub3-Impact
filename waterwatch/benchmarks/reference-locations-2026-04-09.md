# Reference Locations Benchmark Pack

Date: 2026-04-09
Toolkit: BasinKit (`waterwatch` package path)
Status: active

## Purpose

This pack defines a first set of known locations that can be used to pressure-test the public water-intelligence stack.

It is not a formal scientific benchmark yet.

It is the first reproducible public benchmark pack for:

- Water Pulse lookups
- BasinKit connector behavior
- score-composition sanity checks
- Observatory storytelling alignment

## Locations

| ID | Location | Benchmark Focus | Expected Dominant Signal |
|---|---|---|---|
| `phoenix-az` | Phoenix, Arizona | Urban water stress | Drought sensitivity and high regional water stress |
| `tucson-az` | Tucson, Arizona | Municipal desert utility context | Drought and groundwater pressure |
| `flint-mi` | Flint, Michigan | Public water trust | Quality and trust benchmark, not drought-led |
| `jackson-ms` | Jackson, Mississippi | Infrastructure reliability | Utility resilience and system reliability context |
| `new-york-ny` | New York, New York | Dense-city baseline | Higher monitoring density, weaker drought signal |
| `lake-mead-nv` | Lake Mead, Nevada | Surface-water stress | Reservoir decline and drought narrative |

## Why These Locations

- `Phoenix` and `Tucson` connect directly to the current utility-conversation geography.
- `Flint` is a public-data transparency and trust case.
- `Jackson` adds infrastructure reliability rather than only drought.
- `New York` provides a dense, better-instrumented urban comparison point.
- `Lake Mead` links public product, Observatory imagery, and drought storytelling.

## How To Use

```bash
basinkit locations --json
basinkit benchmark --json
basinkit benchmark --limit 3 --output benchmarks/latest-reference-results.json
```

## What Good Looks Like

A good benchmark run should show:

- stable connector behavior across multiple locations
- location-sensitive scoring rather than one-size-fits-all outputs
- public-data provenance for quality, drought, and flood inputs
- explainable differences between drought-led, quality-led, and infrastructure-led cases

## Next Upgrade

The next benchmark layer should add:

- stored generated outputs with timestamps
- Observatory-aligned regional reports
- explicit expected ranges per component
- a small regression suite for benchmark diffs over time
