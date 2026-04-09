# Methodology

This document is the public trust layer for ALCUB3 Impact.

It explains what the current public product surfaces are doing, what kind of evidence they rely on, and where the current limits are. It is intentionally simpler than an internal research brief and more precise than marketing copy.

## Evidence Tiers

Every public-facing claim should fit one of four categories.

### Measured

Direct observations from public sources such as:

- regulatory records
- gauges
- public station data
- official drought classifications

### Estimated

Defensible approximations where direct facility-level data is unavailable.

Examples:

- AI water footprint estimates
- reporting outputs built from modeled workload assumptions

### Modeled

Probabilistic inference built from validated signals and correlates.

Examples:

- PFAS risk indicators
- groundwater health inference
- infrastructure risk surfaces

### Roadmap

An intended capability that should not yet be treated as an operational claim.

## Current Public Methods

### Water Pulse v0.1

The current public Water Pulse score is a simplified composite intended to make first-use water visibility legible without overstating certainty.

Current public components:

- **Water quality**
  - primary evidence type: measured
  - current source family: EPA drinking-water and violation records
- **Drought**
  - primary evidence type: measured
  - current source family: public drought classifications
- **Flood**
  - primary evidence type: measured
  - current source family: public flood / gauge state signals

This public score is a trust-building first release, not a final scientific standard.

## AI Water Footprint

The current footprint surface should be understood as an estimate, not a facility-specific measurement.

Working public model shape:

```text
water_liters = energy_per_query_kwh × workload_volume × water_usage_effectiveness
```

Important caveats:

- exact per-facility water usage is rarely public
- Scope 2 water can materially change total impact
- location and season matter
- raw liters alone are not sufficient for meaningful impact comparison

The long-term direction is stress-weighted impact, not just volume reporting.

## Adjusted Water Impact Direction

The core research direction is to move from raw water volume toward an adjusted impact model that reflects local stress.

That means:

- a liter in one basin should not be treated the same as a liter in another
- seasonal variation matters
- future climate stress should eventually matter

This work is research-backed, but the public product should only expose it as it becomes operationally defensible.

## Next Modeled Layers

The strongest next modeled surfaces are:

- **PFAS risk**
  - risk layer, not direct diagnosis
- **Groundwater health**
  - especially relevant where aquifers underpin drinking water
- **Infrastructure risk**
  - pipe age, violation history, nearby facilities, flood exposure
- **Portfolio / property risk**
  - institutional layer for property, infrastructure, and capital decisions

These should always be labeled as modeled unless backed by direct observation.

## Open Questions

The public methodology is still evolving. Important open questions include:

- how to communicate uncertainty without making the product unusable
- how to compare local scores across very different data densities
- how to version methodology changes clearly
- how to separate what is product-useful from what is still research-only

## Versioning Guidance

Methodology changes should be versioned when:

- score weights change
- source inputs change materially
- a component moves from estimated to measured
- a modeled layer becomes product-visible

Suggested public format:

- `v0.1` — initial public score
- `v0.2` — source expansion or logic revision
- `v1.0` — stable, defended public method

## Limitations

- Public water data often lags current conditions
- Coverage is uneven across regions
- Regulatory records do not equal full real-time water truth
- AI water accounting remains infrastructure-sensitive
- Modeled outputs can be useful without being diagnostic

## Canonical Deeper Work

This file is the public product-facing summary.

As the broader ALCUB3 research surface matures, canonical deeper methods, benchmark notes, and reports should live there. Impact should keep the approachable trust layer because product users need a readable explanation, not a paper archive.
