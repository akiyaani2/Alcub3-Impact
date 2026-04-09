# Impact Observatory

Impact Observatory is the Labs-facing proof surface inside ALCUB3 Impact.

This folder contains reproducible satellite and geospatial workflows for public demos, early monitoring, and inspectable water-intelligence experiments.

## Public Pipeline

The current public pipeline is intentionally simple:

1. search for available scenes
2. create a local imagery manifest
3. compute NDWI
4. detect water coverage and change

## Reproducible Demo

Use the mock path for a deterministic end-to-end run without external credentials:

```bash
python observatory/scripts/process_region.py --region lake-mead --start 2025-01 --end 2026-04
python observatory/scripts/download_imagery.py --results observatory/outputs/lake-mead-search-results.json --mock
python observatory/scripts/compute_ndwi.py --input observatory/data/lake-mead/imagery-manifest.json
python observatory/scripts/detect_water.py --input observatory/outputs/lake-mead/ndwi-manifest.json
```

## What This Is Not Yet

- not a production orchestration system
- not a full Earth observation platform
- not authenticated Copernicus downloading at scale

It is a credible public Labs surface that can be inspected, reproduced, and extended.
