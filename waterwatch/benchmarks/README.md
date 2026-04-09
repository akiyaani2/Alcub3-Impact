# Benchmarks

This directory holds the public benchmark pack for BasinKit.

The goal is not to pretend the toolkit has a perfect scientific benchmark suite today. The goal is to make validation more concrete, reproducible, and inspectable.

## What Lives Here

- canonical reference-location reports
- benchmark notes and rationale
- generated outputs when you choose to run them locally

## Current Pack

- `reference-locations-2026-04-09.md`

This report defines a starter set of real-world locations that stress different parts of the stack:

- urban water stress
- municipal utility context
- public water-trust context
- infrastructure reliability
- dense-city baseline
- reservoir and surface-water decline

## How To Run

From `waterwatch/`:

```bash
basinkit locations --json
basinkit benchmark --json
basinkit benchmark --limit 3 --output benchmarks/latest-reference-results.json
```

## Ground Rules

- benchmark outputs should distinguish measured vs modeled signals
- generated results should be timestamped if committed later
- benchmark packs should prefer public, well-understood locations over cherry-picked marketing demos
