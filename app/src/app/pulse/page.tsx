"use client";

import Link from "next/link";
import { useState } from "react";
import { ScoreRing } from "@/components/score-ring";
import { ConcernCard } from "@/components/concern-card";
import { AccessLadder } from "@/components/access-ladder";

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
    <div className="impact-page max-w-6xl">
      <section className="impact-hero pb-8">
        <div className="impact-hero-grid">
          <div>
            <div className="impact-eyebrow">Product / Water Pulse</div>
            <h1 className="impact-title">
              A water score for
              <br />
              <span className="impact-title-accent">where you live.</span>
            </h1>
            <p className="impact-lead">
              Water Pulse is the consumer entry point into ALCUB3 Impact. Today it combines
              quality, drought, and flood signals into one readable score. Next it expands into
              PFAS risk, groundwater health, and infrastructure risk.
            </p>
          </div>

          <div className="impact-panel">
            <div className="impact-mini-label">What v1 includes</div>
            <div className="mt-5 space-y-3">
              <SummaryRow label="Now" value="Quality, drought, and flood risk" />
              <SummaryRow label="Next" value="PFAS indicator and groundwater health" />
              <SummaryRow label="Later" value="Infrastructure and property water risk" />
            </div>
          </div>
        </div>
      </section>

      <section className="impact-grid-2">
        <div className="impact-panel">
          <div className="impact-mini-label">Check your area</div>
          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
              placeholder="Enter zip code"
              className="impact-input flex-1 text-center text-lg font-mono placeholder:text-zinc-500"
              maxLength={5}
            />
            <button type="submit" disabled={loading} className="impact-button min-w-36">
              {loading ? "Checking..." : "Check score"}
            </button>
          </form>
          <p className="mt-4 text-sm leading-7 text-zinc-500">
            Try <button type="button" className="impact-link" onClick={() => setZip("10001")}>10001</button>,{" "}
            <button type="button" className="impact-link" onClick={() => setZip("48502")}>48502</button>,{" "}
            <button type="button" className="impact-link" onClick={() => setZip("85001")}>85001</button>, or{" "}
            <button type="button" className="impact-link" onClick={() => setZip("90001")}>90001</button>.
          </p>
          {error && <div className="mt-4 text-sm text-red-400">{error}</div>}
        </div>

        <div className="impact-panel">
          <div className="impact-mini-label">Claim discipline</div>
          <div className="mt-5 space-y-4 text-sm leading-7 text-zinc-400">
            <p>
              Water Pulse is a public-facing score, not a lab test. The current release blends
              measured public data with simple modeled synthesis so people can understand local
              water conditions quickly.
            </p>
            <p>
              <strong className="text-zinc-200">Measured:</strong> violations, drought states, gauge conditions.
              <br />
              <strong className="text-zinc-200">Modeled next:</strong> PFAS risk, groundwater, infrastructure.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/methodology" className="impact-button-secondary">
                Read methodology
              </Link>
              <Link href="/account" className="impact-button">
                Save places later
              </Link>
              <Link href="/answers" className="impact-button-ghost">
                See answers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {score && (
        <section className="impact-section space-y-8">
          <div className="text-center text-sm text-zinc-400">
            {score.location.city}, {score.location.state} ({zip})
          </div>

          <div className="flex justify-center">
            <ScoreRing
              score={score.overall_score}
              grade={score.grade}
              label={score.grade_label}
              size={180}
            />
          </div>

          <div className="impact-grid-3">
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

          {score.concerns.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-400">
                Active Concerns
              </h3>
              {score.concerns.map((c, i) => (
                <ConcernCard key={i} {...c} />
              ))}
            </div>
          )}

          <div className="impact-grid-2">
            {score.streamflow.station_count > 0 && (
              <div className="impact-panel space-y-3">
                <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-300">
                  Nearby Stream Gauges ({score.streamflow.station_count} USGS stations)
                </h3>
                {score.streamflow.stations.slice(0, 3).map((s, i) => (
                  <div key={i} className="flex items-center justify-between gap-4 text-sm">
                    <span className="truncate text-zinc-400">{s.name}</span>
                    <span className="shrink-0 font-mono text-zinc-200">
                      {s.flow_cfs.toLocaleString()} cfs
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="impact-panel space-y-4">
              <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-300">
                Score Details
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <Detail label="Water systems" value={`${score.quality.systems_checked} active`} />
                <Detail label="PFAS risk" value={score.quality.pfas_risk.replace(/_/g, " ")} />
                <Detail label="Drought level" value={score.drought.drought_level} />
                <Detail label="Stream gauges" value={`${score.streamflow.station_count} USGS`} />
              </div>
            </div>
          </div>

          <div className="impact-panel">
            <div className="impact-mini-label">What to do next</div>
            <div className="impact-grid-2 mt-5">
              <div>
                <h3 className="text-2xl font-display leading-none text-zinc-100">
                  Turn the score into action.
                </h3>
                <p className="mt-4 text-sm leading-7 text-zinc-400">
                  Water Pulse is meant to be habit-forming, not just informative. Check your score,
                  understand the caveats, then go deeper into footprint, methodology, or partner work.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/footprint" className="impact-button">
                  Calculate AI footprint
                </Link>
                <Link href="/account" className="impact-button-secondary">
                  Save this place
                </Link>
                <Link href="/observatory" className="impact-button-secondary">
                  Explore Observatory
                </Link>
                <Link href="/partners" className="impact-button-ghost">
                  Partner with us
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-zinc-500 space-y-1">
            <p>Data: EPA ECHO, US Drought Monitor, NOAA NWPS, US Census Bureau</p>
            <p>Current score: Quality (45%) + Drought (30%) + Flood (25%)</p>
          </div>

          <div className="impact-callout p-6 text-center">
            <p className="mb-3 text-sm text-zinc-300">
              Get Water Pulse updates as the score expands into PFAS, groundwater, and infrastructure.
            </p>
            <NewsletterInline zip={zip} />
          </div>
        </section>
      )}

      <section className="impact-section">
        <AccessLadder ctaLabel="Choose access for alerts and saved places" />
      </section>
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
    <div className="impact-stat-card text-center">
      <div className={`text-2xl font-bold ${color}`}>{score}</div>
      <div className="mt-1 text-xs text-zinc-400">{label}</div>
      <div className="mt-0.5 text-xs text-zinc-500">{detail}</div>
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
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-sm gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="impact-input flex-1 text-sm placeholder:text-zinc-500"
      />
      <button type="submit" className="impact-button px-4 py-2 text-sm">
        Subscribe
      </button>
    </form>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
      <div className="text-[0.7rem] font-mono uppercase tracking-[0.2em] text-water">{label}</div>
      <p className="mt-2 text-sm leading-7 text-zinc-400">{value}</p>
    </div>
  );
}
