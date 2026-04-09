# Contributing

Thanks for your interest in contributing to ALCUB3 Impact.

This repo mixes a public product surface, an open-source toolkit, and Labs workflows. The main contribution standard is simple: improve clarity, usefulness, and trust without overstating what the system can currently do.

## Good Contribution Areas

- public-data connectors in `waterwatch/`
- scoring utilities and tests
- observatory workflow improvements
- docs and methodology clarity
- bug fixes in the Next.js app
- public trust-layer improvements such as clearer caveats or maturity labels

## Before You Open A PR

1. Read the relevant docs in `docs/`
2. Keep product, Labs, and Research lanes distinct
3. Avoid adding claims that are stronger than the evidence supports
4. Prefer small, reviewable changes

## Local Setup

### App

```bash
cd app
npm install
npm run dev
```

### WaterWatch

```bash
cd waterwatch
pip install -e .
pytest
```

### Observatory

Check the scripts in `observatory/scripts/` and keep large datasets out of git.

## Claim Discipline

This matters in this repo more than in most.

If you touch copy, docs, or user-facing scoring language:

- distinguish measured vs estimated vs modeled outputs
- do not present modeled risk as direct diagnosis
- do not add investor or fundraising language to public docs
- do not use “no competition” or “first ever” language unless it is carefully defensible

## Pull Requests

A good PR should include:

- what changed
- why it changed
- how it was validated
- any caveats or limits

If the change affects public-facing claims or methodology, mention that explicitly.

## Documentation

If you make a meaningful public-facing change, update the relevant doc:

- `README.md`
- `docs/VISION.md`
- `docs/METHODOLOGY.md`
- `docs/ROADMAP.md`
- `docs/RESEARCH.md`

## Questions

If a change is large or touches public claims, open an issue or start a discussion first.
