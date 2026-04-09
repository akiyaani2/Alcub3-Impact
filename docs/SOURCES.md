# Sources

This file is the citation and provenance layer for the public repo.

It is not meant to be a full academic bibliography. It is the minimum source map needed to make public methods, examples, and product claims more inspectable.

## How To Use This File

When a public-facing method or claim appears in:

- `README.md`
- `docs/METHODOLOGY.md`
- `docs/RESEARCH.md`
- app copy
- API output metadata

it should be traceable to at least one source family here.

## Public Data Sources

### Water Quality and Compliance

- EPA ECHO
  - enforcement, compliance, violations
  - https://echo.epa.gov/tools/data-downloads
- Water Quality Portal
  - integrated public water-quality observations
  - https://www.waterqualitydata.us/
- USGS Water Data / NWIS
  - gauges, stations, and monitoring records
  - https://waterdata.usgs.gov/nwis

### Drought and Flood

- U.S. Drought Monitor
  - drought classifications
  - https://droughtmonitor.unl.edu/
- Drought.gov
  - drought datasets and public context
  - https://www.drought.gov/
- NOAA National Water Prediction Service
  - river gauges, flood categories, and forecast context
  - https://water.noaa.gov/

### Satellite and Geospatial

- Copernicus Data Space Ecosystem APIs
  - Sentinel access, STAC, OData, openEO
  - https://documentation.dataspace.copernicus.eu/APIs.html
- Copernicus STAC catalogue
  - https://documentation.dataspace.copernicus.eu/APIs/newSTACcatalogue.html
- WRI Aqueduct
  - basin and water-stress context
  - https://www.wri.org/aqueduct

## AI Water Footprint References

- Li et al., 2023
  - Making AI Less “Thirsty”: Uncovering and Addressing the Secret Water Footprint of AI Models
  - https://arxiv.org/abs/2304.03271

Use for:

- AI training and inference water-demand framing
- water-usage-effectiveness discussion
- contextualizing why raw liters alone are not enough

## Water-System Agents and Interfaces

- LLM-EPANET
  - agentic / natural-language interaction with water-system simulation workflows
  - https://arxiv.org/abs/2503.16191

Use for:

- future natural-language water interfaces
- agentic workflows over structured water systems

## Stress-Weighted Water Impact

- SCARF / stress-weighted water-impact research
  - use the specific internal citations and benchmark notes when productized

Use for:

- adjusted water impact direction
- basin-sensitive scoring
- future AWI logic

## Satellite and Water Intelligence Research

These source families inform the Observatory and future modeled layers:

- satellite-based water-body monitoring
- optical and radar fusion
- segmentation for surface-water detection
- water-access prediction from imagery

Canonical public reporting should eventually promote the strongest of these into benchmark notes or research summaries with clearer versioning.

## Source Discipline Rules

- Do not present a modeled result as measured
- Do not quote a market, technical, or scientific claim publicly without at least one traceable source
- Prefer primary sources where possible
- If the source is a company sustainability report or industry estimate, label it as such
- If a result depends on a chain of assumptions, document the assumptions

## What Should Eventually Move To `research.alcub3.com`

As the broader ALCUB3 research surface matures, deeper canonical artifacts should move into:

- method notes
- benchmark reports
- validation writeups
- field notes

This repo should keep the source map useful, lightweight, and tied to product reality.
