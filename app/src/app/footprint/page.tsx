"use client";

import { useState } from "react";

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
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">AI Water Footprint Calculator</h1>
        <p className="text-zinc-400">
          How much water does your AI usage consume? Find out.
        </p>
      </div>

      {/* Calculator */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-6 mb-8">
        {/* Provider */}
        <div>
          <label className="block text-sm text-zinc-400 mb-2">AI Provider</label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {PROVIDERS.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setProvider(p.id);
                  setModel(p.models[0]);
                }}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                  provider === p.id
                    ? "border-water bg-water/10 text-water"
                    : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Model */}
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Model</label>
          <div className="flex gap-2 flex-wrap">
            {currentModels.map((m) => (
              <button
                key={m}
                onClick={() => setModel(m)}
                className={`px-3 py-1.5 text-sm font-mono rounded-lg border transition-colors ${
                  model === m
                    ? "border-water bg-water/10 text-water"
                    : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Queries slider */}
        <div>
          <label className="block text-sm text-zinc-400 mb-2">
            Queries per month:{" "}
            <span className="text-zinc-200 font-mono">
              {queries.toLocaleString()}
            </span>
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
          <div className="flex justify-between text-xs text-zinc-500 mt-1">
            <span>100</span>
            <span>10K</span>
            <span>100K</span>
            <span>1M</span>
          </div>
        </div>

        <button
          onClick={calculate}
          disabled={loading}
          className="w-full py-3 bg-water hover:bg-water-dark disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
        >
          {loading ? "Calculating..." : "Calculate Water Footprint"}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-500">
          {/* Big number */}
          <div className="text-center py-8">
            <div className="text-5xl font-bold text-water mb-1">
              {result.water_gallons_monthly < 1
                ? result.water_liters_monthly.toFixed(1) + " L"
                : result.water_gallons_monthly.toFixed(1) + " gal"}
            </div>
            <div className="text-zinc-400">per month</div>
            <div className="text-sm text-zinc-500 mt-2">
              {result.water_liters_annual.toFixed(0)} liters /{" "}
              {result.water_gallons_annual.toFixed(0)} gallons per year
            </div>
          </div>

          {/* Context */}
          <div className="grid grid-cols-2 gap-4">
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
              label="to offset"
              sublabel="per month"
            />
            <StatCard
              value={`${result.methodology.wue_l_per_kwh} L/kWh`}
              label="water usage effectiveness"
              sublabel={result.methodology.source}
            />
          </div>

          {/* Methodology note */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-xs text-zinc-500">
            <p>
              Estimates based on published data center Water Usage Effectiveness
              (WUE) metrics and model energy consumption benchmarks. Actual water
              usage varies by data center location, cooling technology, and time
              of year.{" "}
              <a href="/methodology" className="text-water hover:underline">
                Full methodology
              </a>
            </p>
          </div>

          {/* CTA */}
          <div className="rounded-xl border border-water/20 bg-water/5 p-6 text-center">
            <p className="text-zinc-300 mb-1">
              Want to offset your AI water footprint?
            </p>
            <p className="text-sm text-zinc-500 mb-4">
              Direct your contribution to verified water access projects.
            </p>
            <a
              href="https://www.charitywater.org/donate"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex px-5 py-2.5 bg-water hover:bg-water-dark text-white font-medium rounded-lg transition-colors"
            >
              Offset with charity: water
            </a>
          </div>
        </div>
      )}
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
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-center">
      <div className="text-2xl font-bold text-zinc-100">{value}</div>
      <div className="text-sm text-zinc-400 mt-1">{label}</div>
      <div className="text-xs text-zinc-500">{sublabel}</div>
    </div>
  );
}
