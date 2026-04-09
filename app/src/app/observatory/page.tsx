import Link from "next/link";
import { AccessLadder } from "@/components/access-ladder";

export default function ObservatoryPage() {
  return (
    <div className="impact-page max-w-6xl">
      <section className="impact-hero pb-8">
        <div className="impact-hero-grid">
          <div>
            <div className="impact-eyebrow">Labs / Observatory</div>
            <h1 className="impact-title">
              Make proof
              <br />
              <span className="impact-title-accent">visible.</span>
            </h1>
            <p className="impact-lead">
              Observatory is the Labs surface inside ALCUB3 Impact. It turns remote sensing,
              forecasting, and monitoring work into something the public can actually inspect
              without pretending every signal is already production-grade.
            </p>
          </div>

          <div className="impact-panel">
            <div className="impact-mini-label">What this page is</div>
            <div className="mt-5 space-y-3 text-sm leading-7 text-zinc-400">
              <p>Observatory is a proof surface, not the canonical research archive.</p>
              <p>
                The interface is public. The workflows come from Labs. The claims must still be
                grounded by Research and methodology.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="impact-section">
        <div className="impact-section-head">
          <div className="impact-section-label">01 / Preview Regions</div>
          <h2 className="impact-section-title">Regional signals worth watching.</h2>
        </div>
        <div className="impact-grid-2">
          <RegionCard
            name="Lake Mead, Nevada"
            status="shrinking"
            change={-12.4}
            period="Jan 2025 - Apr 2026"
            description="Continued drought-driven decline in North America's largest reservoir."
          />
          <RegionCard
            name="Gaza Aquifer, Palestine"
            status="critical"
            change={-8.2}
            period="Jan 2025 - Apr 2026"
            description="Groundwater depletion accelerated by infrastructure damage and overextraction."
          />
          <RegionCard
            name="Lake Chad, Sahel"
            status="shrinking"
            change={-3.1}
            period="Jan 2025 - Apr 2026"
            description="Continued long-term shrinkage affecting 30M+ people across 4 countries."
          />
          <RegionCard
            name="Central Valley, California"
            status="recovering"
            change={4.7}
            period="Jan 2025 - Apr 2026"
            description="Groundwater levels recovering after 2024-2025 wet season."
          />
        </div>
      </section>

      <section className="impact-section">
        <div className="impact-section-head">
          <div className="impact-section-label">02 / Signal Stack</div>
          <h2 className="impact-section-title">What Observatory grows into.</h2>
          <p className="impact-section-copy">
            The long-term surface is not just before/after imagery. It is a visible layer for drought,
            flood, groundwater, contamination, and regional change.
          </p>
        </div>
        <div className="impact-grid-4">
          <Signal title="Water-body change" state="Now" description="Visible shoreline change, expansion, contraction, and basin-level comparison." />
          <Signal title="Drought and flood" state="Now" description="A bridge between measured public risk feeds and more predictive forecasting later." />
          <Signal title="Groundwater" state="Next" description="Modeled depletion or recovery surfaces that make the hidden crisis legible." />
          <Signal title="Contamination proxies" state="Next" description="PFAS-risk, water-quality proxies, and environmental justice overlays once the method is ready." />
        </div>
      </section>

      <section className="impact-section">
        <div className="impact-panel">
          <div className="impact-section-label">03 / How it works</div>
          <div className="mt-5 space-y-5 text-sm text-zinc-400">
            <Step
              n={1}
              title="Download free satellite imagery"
              detail="Sentinel-2 via Copernicus for global optical coverage with no commercial licensing barrier."
            />
            <Step
              n={2}
              title="Compute water and context indices"
              detail="NDWI, land-cover context, hydrology priors, and regional overlays create the initial signal layer."
            />
            <Step
              n={3}
              title="Segment and compare"
              detail="SAM-powered masking and geospatial processing expose visible change across time windows."
            />
            <Step
              n={4}
              title="Publish with caveats"
              detail="Only surfaces with defensible methods graduate out of Labs language and into broader public claims."
            />
          </div>
        </div>
      </section>

      <section className="impact-section">
        <div className="impact-panel">
          <div className="impact-mini-label">Where to go next</div>
          <div className="impact-grid-2 mt-5">
            <div>
              <h3 className="text-2xl font-display leading-none text-zinc-100">
                Labs should point outward.
              </h3>
              <p className="mt-4 text-sm leading-7 text-zinc-400">
                Observatory is strongest when it links cleanly to methodology and later to canonical
                research, not when it tries to carry the whole trust burden alone.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/methodology" className="impact-button-secondary">
                Read methodology
              </Link>
              <Link href="/account" className="impact-button-secondary">
                Track regions later
              </Link>
              <Link href="/answers" className="impact-button-ghost">
                See answers
              </Link>
              <a
                href="https://github.com/akiyaani2/Alcub3-Impact/tree/main/observatory"
                target="_blank"
                rel="noopener noreferrer"
                className="impact-button"
              >
                View pipeline
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="impact-section">
        <AccessLadder ctaLabel="Choose access for region tracking" />
      </section>
    </div>
  );
}

function RegionCard({
  name,
  status,
  change,
  period,
  description,
}: {
  name: string;
  status: string;
  change: number;
  period: string;
  description: string;
}) {
  const statusColor =
    status === "critical"
      ? "text-red-400 bg-red-500/10"
      : status === "shrinking"
        ? "text-orange-400 bg-orange-500/10"
        : status === "recovering"
          ? "text-green-400 bg-green-500/10"
          : "text-zinc-400 bg-zinc-800";

  const changeColor = change > 0 ? "text-green-400" : "text-red-400";
  const changePrefix = change > 0 ? "+" : "";

  return (
    <div className="impact-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-zinc-100">{name}</h3>
        <span
          className={`text-xs font-mono px-2 py-0.5 rounded-full ${statusColor}`}
        >
          {status}
        </span>
      </div>
      <p className="text-sm text-zinc-400 mb-3">{description}</p>
      <div className="flex items-center justify-between text-xs">
        <span className="text-zinc-500">{period}</span>
        <span className={`font-mono ${changeColor}`}>
          {changePrefix}{change}% water area
        </span>
      </div>
    </div>
  );
}

function Step({
  n,
  title,
  detail,
}: {
  n: number;
  title: string;
  detail: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-water/20 text-xs text-water">
        {n}
      </div>
      <div>
        <div className="text-zinc-200 font-medium">{title}</div>
        <div className="text-zinc-500">{detail}</div>
      </div>
    </div>
  );
}

function Signal({
  title,
  state,
  description,
}: {
  title: string;
  state: string;
  description: string;
}) {
  return (
    <div className="impact-card">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xl font-display leading-none text-zinc-100">{title}</h3>
        <span className="impact-chip impact-chip-neutral">{state}</span>
      </div>
      <p className="mt-4 text-sm leading-7 text-zinc-400">{description}</p>
    </div>
  );
}
