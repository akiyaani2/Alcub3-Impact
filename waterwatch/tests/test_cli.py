"""CLI smoke tests for the BasinKit entry point."""

from __future__ import annotations

import json
import sys

from waterwatch import cli


def run_cli(args: list[str], capsys) -> dict:
    previous = sys.argv
    sys.argv = ["basinkit", *args]
    try:
        cli.main()
    finally:
        sys.argv = previous
    output = capsys.readouterr().out
    return json.loads(output)


def test_sources_command(capsys):
    payload = run_cli(["sources", "--json"], capsys)
    assert payload["toolkit"] == "BasinKit"
    assert "quality" in payload["source_families"]


def test_methodology_command(capsys):
    payload = run_cli(["methodology", "--json"], capsys)
    assert payload["current_public_score"]["version"] == "v0.1"
    assert "measured" in payload["evidence_tiers"]


def test_regions_command(capsys):
    payload = run_cli(["regions", "--json"], capsys)
    assert "lake-mead" in payload["regions"]


def test_providers_command(capsys):
    payload = run_cli(["providers", "--json"], capsys)
    assert "openai" in payload["catalog"]["providers"]
