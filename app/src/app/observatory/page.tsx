export default function ObservatoryPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-water/10 border border-water/20 text-water text-sm mb-4">
          Labs
        </div>
        <h1 className="text-3xl font-bold mb-2">Observatory</h1>
        <p className="text-zinc-400">
          Satellite water monitoring powered by Sentinel-2 and SAM 3.
        </p>
      </div>

      {/* Preview regions */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
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

      {/* How it works */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8">
        <h2 className="text-lg font-semibold mb-4">How It Works</h2>
        <div className="space-y-4 text-sm text-zinc-400">
          <Step
            n={1}
            title="Download free satellite imagery"
            detail="Sentinel-2 via Copernicus (10m resolution, 5-day revisit, no commercial restrictions)"
          />
          <Step
            n={2}
            title="Compute water index (NDWI)"
            detail="(Green - NIR) / (Green + NIR) — values above 0.3 indicate water"
          />
          <Step
            n={3}
            title="Segment water bodies with SAM 3"
            detail="Meta's Segment Anything Model 3 (Apache 2.0) extracts precise water body polygons"
          />
          <Step
            n={4}
            title="Detect changes over time"
            detail="Compare timestamps to show flood expansion, drought progression, or recovery"
          />
        </div>
      </div>

      {/* Coming soon */}
      <div className="mt-8 text-center">
        <p className="text-sm text-zinc-500 mb-4">
          Interactive satellite maps and time-lapse visualizations launching soon.
        </p>
        <a
          href="https://github.com/akiyaani2/Alcub3-Impact/tree/main/observatory"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex px-4 py-2 border border-zinc-700 hover:border-zinc-500 text-sm text-zinc-300 rounded-lg transition-colors"
        >
          View Processing Pipeline on GitHub
        </a>
      </div>
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
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
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
      <div className="w-6 h-6 rounded-full bg-water/20 text-water text-xs flex items-center justify-center shrink-0 mt-0.5">
        {n}
      </div>
      <div>
        <div className="text-zinc-200 font-medium">{title}</div>
        <div className="text-zinc-500">{detail}</div>
      </div>
    </div>
  );
}
