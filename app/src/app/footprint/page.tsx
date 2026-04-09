"use client";

import Link from "next/link";
import { useState } from "react";
import { AccessLadder } from "@/components/access-ladder";

const PROVIDERS = [
  { id: "openai", label: "OpenAI", models: ["gpt-4", "gpt-4o", "gpt-3.5-turbo"] },
  { id: "anthropic", label: "Anthropic", models: ["claude-opus", "claude-sonnet", "claude-haiku"] },
  { id: "google", label: "Google", models: ["gemini-pro", "gemini-flash"] },
  { id: "meta", label: "Meta", models: ["llama-3-70b", "llama-3-8b"] },
  { id: "microsoft", label: "Microsoft", models: ["gpt-4", "gpt-4o"] },
  { id: "amazon", label: "AWS", models: ["claude-sonnet", "claude-haiku"] },
];

interface FootprintResult {
  provider: string;
  model: string;
  queries_per_month: number;
  water_liters_monthly: number;
  water_gallons_monthly: number;
  water_liters_annual: number;
  water_gallons_annual: number;
  offset_cost_usd_monthly: number;
  context: {
    equivalent_showers: number;
    equivalent_drinking_days: number;
  };
  methodology: {
    wue_l_per_kwh: number;
    source: string;
  };
}

export default function FootprintPage() {
  const [provider, setProvider] = useState("openai");
  const [model, setModel] = useState("gpt-4");
  const [queries, setQueries] = useState(1000);
  const [result, setResult] = useState<FootprintResult | null>(null);
  const [loading, setLoading] = useState(false);

  const currentModels = PROVIDERS.find((p) => p.id === provider)?.models ?? [];

  async function calculate() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/footprint?provider=${provider}&model=${model}&queries=${queries}`
      );
      if (res.ok) setResult(await res.json());
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="impact-page max-w-6xl">
      <section className="impact-hero pb-8">
        <div className="impact-hero-grid">
          <div>
            <div className="impact-eyebrow">Product / AI Footprint</div>
            <h1 className="impact-title">
              Account for the
              <br />
              <span className="impact-title-accent">water cost of AI.</span>
            </h1>
            <p className="impact-lead">
              This surface is a product wedge into a bigger reporting layer. Start with a defensible
              estimate, publish the assumptions, and evolve toward stress-weighted and portfolio-grade
              water intelligence for institutions.
            </p>
          </div>

          <div className="impact-panel">
            <div className="impact-mini-label">How to read this</div>
            <div className="mt-5 space-y-3 text-sm leading-7 text-zinc-400">
              <p>
                Today&apos;s calculator is an <strong className="text-zinc-200">estimated</strong> footprint
                based on workload, model family, and published WUE assumptions.
              </p>
              <p>
                The direction is toward <strong className="text-zinc-200">stress-weighted</strong> impact,
                Scope 1 + Scope 2 accounting, and reporting surfaces institutions can actually use.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="impact-grid-2">
        <div className="impact-panel space-y-6">
          <div>
            <label className="mb-2 block text-sm text-zinc-400">AI Provider</label>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setProvider(p.id);
                    setModel(p.models[0]);
                  }}
                  className={`rounded-2xl border px-3 py-2 text-sm transition-colors ${
                    provider === p.id
                      ? "border-water/40 bg-water/12 text-water"
                      : "border-white/10 text-zinc-400 hover:border-white/20"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">Model</label>
            <div className="flex flex-wrap gap-2">
              {currentModels.map((m) => (
                <button
                  key={m}
                  onClick={() => setModel(m)}
                  className={`rounded-full border px-3 py-1.5 font-mono text-sm transition-colors ${
                    model === m
                      ? "border-water/40 bg-water/12 text-water"
                      : "border-white/10 text-zinc-400 hover:border-white/20"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Queries per month:{" "}
              <span className="font-mono text-zinc-200">{queries.toLocaleString()}</span>
            </label>
            <input
              type="range"
              min={100}
              max={1000000}
              step={100}
              value={queries}
              onChange={(e) => setQueries(parseInt(e.target.value))}
              className="w-full accent-water"
            />
            <div className="mt-1 flex justify-between text-xs text-zinc-500">
              <span>100</span>
              <span>10K</span>
              <span>100K</span>
              <span>1M</span>
            </div>
          </div>

          <button onClick={calculate} disabled={loading} className="impact-button w-full">
            {loading ? "Calculating..." : "Calculate Water Footprint"}
          </button>
        </div>

        <div className="impact-panel">
          <div className="impact-mini-label">Why this matters</div>
          <div className="mt-5 space-y-4 text-sm leading-7 text-zinc-400">
            <p>
              Raw liters are not the whole story. The real commercial opportunity is water impact
              that reflects region, infrastructure, and eventually stress-weighted context.
            </p>
            <p>
              This calculator is the public-facing edge of a larger reporting product that can later
              serve enterprise AI disclosures, procurement, and portfolio comparisons.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/impact-api" className="impact-button-secondary">
                See Water Intelligence API
              </Link>
              <Link href="/account" className="impact-button">
                Save reporting profile
              </Link>
              <Link href="/methodology" className="impact-button-ghost">
                Read methodology
              </Link>
            </div>
          </div>
        </div>
      </section>

      {result && (
        <section className="impact-section space-y-6">
          <div className="py-4 text-center">
            <div className="text-6xl font-bold text-water">
              {result.water_gallons_monthly < 1
                ? `${result.water_liters_monthly.toFixed(1)} L`
                : `${result.water_gallons_monthly.toFixed(1)} gal`}
            </div>
            <div className="mt-1 text-zinc-400">per month</div>
            <div className="mt-2 text-sm text-zinc-500">
              {result.water_liters_annual.toFixed(0)} liters /{" "}
              {result.water_gallons_annual.toFixed(0)} gallons per year
            </div>
          </div>

          <div className="impact-grid-2">
            <StatCard
              value={result.context.equivalent_showers.toString()}
              label="showers equivalent"
              sublabel="per month"
            />
            <StatCard
              value={result.context.equivalent_drinking_days.toString()}
              label="days of drinking water"
              sublabel="for one person"
            />
            <StatCard
              value={`$${result.offset_cost_usd_monthly.toFixed(2)}`}
              label="offset proxy"
              sublabel="per month"
            />
            <StatCard
              value={`${result.methodology.wue_l_per_kwh} L/kWh`}
              label="WUE assumption"
              sublabel={result.methodology.source}
            />
          </div>

          <div className="impact-panel text-sm leading-7 text-zinc-400">
            Estimates are based on published Water Usage Effectiveness benchmarks and model-energy
            assumptions. Actual water use varies by facility, region, cooling infrastructure, and time.
            <span className="mx-2 text-zinc-600">•</span>
            <Link href="/methodology" className="impact-link">
              Full methodology
            </Link>
          </div>

          <div className="impact-panel">
            <div className="impact-mini-label">Next step</div>
            <div className="impact-grid-2 mt-5">
              <div>
                <h3 className="text-2xl font-display leading-none text-zinc-100">
                  Move from estimate to reporting.
                </h3>
                <p className="mt-4 text-sm leading-7 text-zinc-400">
                  The long-term value is not the consumer calculator alone. It is the reporting,
                  benchmarking, and water-risk intelligence layer behind it.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/impact-api" className="impact-button">
                  Join API early access
                </Link>
                <Link href="/account" className="impact-button-secondary">
                  Save this estimate
                </Link>
                <Link href="/pulse" className="impact-button-secondary">
                  See Water Pulse
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="impact-section">
        <AccessLadder ctaLabel="Set up account access for reporting" />
      </section>
    </div>
  );
}

function StatCard({
  value,
  label,
  sublabel,
}: {
  value: string;
  label: string;
  sublabel: string;
}) {
  return (
    <div className="impact-stat-card text-center">
      <div className="text-2xl font-bold text-zinc-100">{value}</div>
      <div className="text-sm text-zinc-400 mt-1">{label}</div>
      <div className="text-xs text-zinc-500">{sublabel}</div>
    </div>
  );
}
