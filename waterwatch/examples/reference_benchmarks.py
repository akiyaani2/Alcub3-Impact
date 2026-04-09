"""Run the curated BasinKit reference benchmark pack."""

from __future__ import annotations

import json

from waterwatch.benchmarks import run_reference_benchmarks


def main() -> None:
    payload = run_reference_benchmarks(limit=3, timeout=15.0)
    print(json.dumps(payload, indent=2))


if __name__ == "__main__":
    main()
