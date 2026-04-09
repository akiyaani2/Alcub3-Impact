import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-water/5 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto px-4 pt-24 pb-16 text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-water/10 border border-water/20 text-water text-sm mb-6">
            Open Source
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
            AI uses water.
            <br />
            <span className="text-water">Now you can see it.</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10">
            Every AI query consumes water for data center cooling. ALCUB3 Impact
            gives you the tools to measure, understand, and offset your water
            footprint — powered by open data and open-source AI.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/pulse"
              className="px-6 py-3 bg-water hover:bg-water-dark text-white font-medium rounded-lg transition-colors"
            >
              Check Your Water Score
            </Link>
            <a
              href="https://github.com/akiyaani2/Alcub3-Impact"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-zinc-700 hover:border-zinc-500 text-zinc-300 font-medium rounded-lg transition-colors"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-6">
          <Card
            title="Water Pulse"
            description="Enter your zip code. Get your water health score — quality, drought risk, flood risk, and AI water footprint. All from free federal data."
            href="/pulse"
            tag="Consumer"
          />
          <Card
            title="WaterWatch"
            description="Open-source Python library for water intelligence. Unified API across USGS, NOAA, EPA, and Sentinel-2 satellite imagery."
            href="https://github.com/akiyaani2/Alcub3-Impact/tree/main/waterwatch"
            tag="Open Source"
            external
          />
          <Card
            title="Observatory"
            description="Satellite water monitoring. Before/after change detection using free Sentinel-2 imagery and SAM 3 AI segmentation."
            href="/observatory"
            tag="Labs"
          />
          <Card
            title="Impact API"
            description="Enterprise water footprint reporting. Measure, report, and offset the water cost of your AI infrastructure."
            href="/api/footprint?provider=openai&model=gpt-4&queries=10000"
            tag="Enterprise"
          />
        </div>
      </section>

      {/* Data sources */}
      <section className="border-t border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold mb-2">Built on open data</h2>
          <p className="text-zinc-400 mb-8">
            Every data source is free, public, and requires no API key.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "USGS Water Data", desc: "Real-time streamflow + quality from 1000s of stations" },
              { name: "EPA ECHO", desc: "430M+ contamination records, violations, PFAS" },
              { name: "NOAA NWPS", desc: "Flood predictions + streamflow forecasts" },
              { name: "US Drought Monitor", desc: "Drought indices updated daily" },
              { name: "Sentinel-2", desc: "10m satellite imagery, 5-day revisit, free" },
              { name: "WHO / UNICEF JMP", desc: "Global water access statistics, 190+ countries" },
            ].map((source) => (
              <div
                key={source.name}
                className="p-4 rounded-lg bg-zinc-900 border border-zinc-800"
              >
                <div className="text-sm font-medium text-zinc-200">{source.name}</div>
                <div className="text-xs text-zinc-500 mt-1">{source.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between text-sm text-zinc-500">
          <span>ALCUB3 Impact — Open Source, MIT License</span>
          <div className="flex gap-4">
            <Link href="/methodology" className="hover:text-zinc-300">Methodology</Link>
            <a href="https://github.com/akiyaani2/Alcub3-Impact" className="hover:text-zinc-300">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Card({
  title,
  description,
  href,
  tag,
  external,
}: {
  title: string;
  description: string;
  href: string;
  tag: string;
  external?: boolean;
}) {
  const Component = external ? "a" : Link;
  const extraProps = external ? { target: "_blank" as const, rel: "noopener noreferrer" } : {};

  return (
    <Component
      href={href}
      {...extraProps}
      className="group p-6 rounded-xl border border-zinc-800 hover:border-zinc-600 bg-zinc-900/50 hover:bg-zinc-900 transition-all"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">{tag}</span>
      </div>
      <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-water transition-colors mb-2">
        {title}
      </h3>
      <p className="text-sm text-zinc-400">{description}</p>
    </Component>
  );
}
