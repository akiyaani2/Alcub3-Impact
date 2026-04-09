# CLI

The CLI is for the developer, research, and operations layer of ALCUB3 Impact.

It is not a consumer product. It exists to make the open-source toolkit easy to run, inspect, and demo from a terminal.

## Why A CLI Exists

A command-line interface helps with:

- reproducible demos
- debugging public-data connectors
- quick local queries
- batch jobs and scripts
- research workflows
- partner and NGO evaluation

Without a CLI, the toolkit is readable but less operable.

## Current Direction

The recommended public command name is:

- `basinkit`

That name can become public before the internal Python import path changes.

## v0.1 Scope

The first CLI should stay narrow and useful.

### Query Commands

```bash
basinkit quality --lat 40.7128 --lon -74.0060
basinkit drought --lat 40.7128 --lon -74.0060
basinkit flood --lat 40.7128 --lon -74.0060
basinkit score --lat 40.7128 --lon -74.0060
```

### Footprint Commands

```bash
basinkit footprint --provider openai --model gpt-4o --queries 10000
basinkit footprint-company --cloud aws --gpu a100 --hours 100
```

### Source and Method Commands

```bash
basinkit sources
basinkit methodology
```

### Observatory-Oriented Commands

These can start as wrappers around the existing scripts and mature later:

```bash
basinkit observatory search --region lake-mead --start 2025-01 --end 2026-04
```

## Output Rules

Default output should be human-readable.

Add `--json` for machine use and reproducible scripts.

Examples:

```bash
basinkit score --lat 33.4484 --lon -112.0740 --json
basinkit footprint --provider openai --model gpt-4o --queries 20000 --json
```

## What v0.1 Should Not Try To Do

- full account features
- private partner workflows
- enterprise auth
- production observatory orchestration
- direct diagnosis language

## CLI And Trust

The CLI is part of the trust model because it lets people:

- inspect outputs directly
- test assumptions quickly
- reproduce examples from docs
- see source and evidence-tier context without the marketing layer
