"use client";

import { useState } from "react";
import { ScoreRing } from "@/components/score-ring";
import { ConcernCard } from "@/components/concern-card";

interface WaterScore {
  overall_score: number;
  grade: string;
  grade_label: string;
  quality: {
    quality_score: number;
    quality_grade: string;
    violation_count: number;
    systems_checked: number;
    pfas_risk: string;
  };
  drought: {
    drought_level: string;
    drought_score: number;
    description: string;
    risk: string;
  };
  flood: {
    flood_status: string;
    flood_score: number;
    risk: string;
    nearby_gauges: number;
    alerts?: string[];
  };
  streamflow: {
    stations: { name: string; flow_cfs: number; status: string }[];
    station_count: number;
  };
  concerns: { area: string; severity: string; detail: string }[];
  location: {
    lat: number;
    lon: number;
    city: string;
    state: string;
  };
}

export default function PulsePage() {
  const [zip, setZip] = useState("");
  const [score, setScore] = useState<WaterScore | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\d{5}$/.test(zip)) {
      setError("Enter a valid 5-digit zip code");
      return;
    }

    setLoading(true);
    setError(null);
    setScore(null);

    try {
      const res = await fetch(`/api/pulse?zip=${zip}`);
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to get water score");
        return;
      }
      setScore(await res.json());
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Water Pulse</h1>
        <p className="text-zinc-400">
          Enter your zip code. See your water health score.
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto mb-12">
        <input
          type="text"
          value={zip}
          onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
          placeholder="Enter zip code"
          className="flex-1 px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 text-center text-lg font-mono placeholder:text-zinc-500 focus:outline-none focus:border-water"
          maxLength={5}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-water hover:bg-water-dark disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
        >
          {loading ? "..." : "Check"}
        </button>
      </form>

      {error && (
        <div className="text-center text-red-400 text-sm mb-8">{error}</div>
      )}

      {/* Results */}
      {score && (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Location */}
          <div className="text-center text-sm text-zinc-400">
            {score.location.city}, {score.location.state} ({zip})
          </div>

          {/* Overall Score */}
          <div className="flex justify-center relative">
            <ScoreRing
              score={score.overall_score}
              grade={score.grade}
              label={score.grade_label}
              size={180}
            />
          </div>

          {/* Component Scores */}
          <div className="grid grid-cols-3 gap-4">
            <ComponentScore
              label="Water Quality"
              score={score.quality.quality_score}
              detail={`${score.quality.violation_count} violation(s)`}
            />
            <ComponentScore
              label="Drought Risk"
              score={Math.max(0, 100 - score.drought.drought_score * 20)}
              detail={score.drought.description}
            />
            <ComponentScore
              label="Flood Risk"
              score={Math.max(0, 100 - score.flood.flood_score)}
              detail={score.flood.flood_status.replace(/_/g, " ")}
            />
          </div>

          {/* Concerns */}
          {score.concerns.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-zinc-300">Active Concerns</h3>
              {score.concerns.map((c, i) => (
                <ConcernCard key={i} {...c} />
              ))}
            </div>
          )}

          {/* Streamflow */}
          {score.streamflow.station_count > 0 && (
            <div className="rounded-xl border border-zinc-800 p-6 bg-zinc-900/50 space-y-3">
              <h3 className="text-sm font-medium text-zinc-300">
                Nearby Stream Gauges ({score.streamflow.station_count} USGS stations)
              </h3>
              {score.streamflow.stations.slice(0, 3).map((s, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400 truncate mr-4">{s.name}</span>
                  <span className="font-mono text-zinc-200 shrink-0">
                    {s.flow_cfs.toLocaleString()} cfs
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Details */}
          <div className="rounded-xl border border-zinc-800 p-6 bg-zinc-900/50 space-y-4">
            <h3 className="text-sm font-medium text-zinc-300">Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Detail label="Water systems" value={`${score.quality.systems_checked} active`} />
              <Detail label="PFAS risk" value={score.quality.pfas_risk.replace(/_/g, " ")} />
              <Detail label="Drought level" value={score.drought.drought_level} />
              <Detail label="Stream gauges" value={`${score.streamflow.station_count} USGS`} />
            </div>
          </div>

          {/* Donate CTA */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 text-center">
            <h3 className="text-lg font-semibold text-zinc-100 mb-2">
              Help protect water access
            </h3>
            <p className="text-sm text-zinc-400 mb-4">
              785 million people lack clean water. Your contribution funds verified
              water projects worldwide.
            </p>
            <div className="flex items-center justify-center gap-3">
              <a
                href="https://www.charitywater.org/donate"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-water hover:bg-water-dark text-white text-sm font-medium rounded-lg transition-colors"
              >
                Donate via charity: water
              </a>
              <a
                href="/footprint"
                className="px-5 py-2.5 border border-zinc-700 hover:border-zinc-500 text-zinc-300 text-sm font-medium rounded-lg transition-colors"
              >
                Calculate AI footprint
              </a>
            </div>
          </div>

          {/* Data sources */}
          <div className="text-center text-xs text-zinc-500 space-y-1">
            <p>
              Data: EPA ECHO, US Drought Monitor, NOAA NWPS, US Census Bureau
            </p>
            <p>
              Methodology: Quality (45%) + Drought (30%) + Flood (25%) = Overall Score
            </p>
          </div>

          {/* Newsletter CTA */}
          <div className="rounded-xl border border-water/20 bg-water/5 p-6 text-center">
            <p className="text-sm text-zinc-300 mb-3">
              Get monthly Water Pulse updates for your area
            </p>
            <NewsletterInline zip={zip} />
          </div>
        </div>
      )}
    </div>
  );
}

function ComponentScore({
  label,
  score,
  detail,
}: {
  label: string;
  score: number;
  detail: string;
}) {
  const color =
    score >= 80
      ? "text-green-400"
      : score >= 60
        ? "text-yellow-400"
        : score >= 40
          ? "text-orange-400"
          : "text-red-400";

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-center">
      <div className={`text-2xl font-bold ${color}`}>{score}</div>
      <div className="text-xs text-zinc-400 mt-1">{label}</div>
      <div className="text-xs text-zinc-500 mt-0.5">{detail}</div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-zinc-500">{label}</div>
      <div className="text-zinc-200 font-mono">{value}</div>
    </div>
  );
}

function NewsletterInline({ zip }: { zip: string }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, type: "newsletter", zip }),
    });
    setSubmitted(true);
  }

  if (submitted) {
    return <p className="text-sm text-water">Signed up. We&apos;ll keep you posted.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="flex-1 px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-water"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-water hover:bg-water-dark text-white text-sm font-medium rounded-lg transition-colors"
      >
        Subscribe
      </button>
    </form>
  );
}
