# Naming

This document keeps the public naming system coherent as ALCUB3 Impact grows.

The goal is not to rename things constantly. The goal is to make the system clearer, more ownable, and easier to explain.

## Naming Principles

- Keep the venture name distinctive
- Keep product names legible
- Keep developer and infrastructure names literal enough to trust
- Avoid overly generic names where possible
- Prefer one durable name per surface instead of aliases everywhere

## Canonical Public System

### Venture

- **ALCUB3 Impact**
  - the water-intelligence venture
  - built on ALCUB3 shared platform rails

### Public Homepage

- **Water Intelligence**
  - the homepage framing inside `impact.alcub3.com`
  - this is the thesis and product category language, not a separate product brand

### Public Product

- **Water Pulse**
  - guest-first local water visibility
  - consumer and public entry point

### Open-Source Developer Layer

- **BasinKit**
  - the adopted public name for the toolkit
  - broader and more ownable than `WaterWatch`
  - fits a library that spans quality, scoring, satellite, drought, flood, and reporting primitives

### Labs Surface

- **Impact Observatory**
  - the Labs-facing proof surface
  - clearer than the generic standalone name `Observatory`
  - ties the work back to the venture while preserving the Labs role

### Hosted Developer and Institutional Layer

- **Water Intelligence API**
  - the adopted public product name
  - clearer than `Impact API`
  - more descriptive for developers, partners, and institutional users

## Transition Guidance

The current repository and package paths still use `waterwatch/` and the route path `/impact-api` in some places. That is acceptable during transition.

Recommended order of migration:

1. Keep the current code paths stable
2. Introduce `BasinKit` as the public toolkit name
3. Expose `basinkit` as the CLI command
4. Rename external docs and site copy before renaming import paths
5. Only rename the Python import path when the package surface is stable enough to justify the breaking change

## What Should Stay Stable

These names are strong enough to keep:

- **ALCUB3**
- **ALCUB3 Impact**
- **Water Pulse**

## What Should Avoid Overgrowth

Avoid creating too many sibling brands too early.

Bad pattern:

- one name for the product
- one different name for the page
- one different name for the CLI
- one different name for the repo

Good pattern:

- one venture name
- one product name
- one toolkit name
- one labs/proof name
- one API name
