import Link from "next/link";

const shipped = [
  "Water Pulse v1 with quality, drought, and flood scoring",
  "Open-source WaterWatch base layer for fetching and scoring water data",
  "Methodology summary that separates current outputs from future layers",
  "Observatory preview as a visible Labs surface",
];

const inProgress = [
  "PFAS risk indicator from public geospatial priors",
  "Groundwater and infrastructure risk additions to Water Pulse",
  "Impact API early-access packaging",
  "Research-to-product evidence tier system across the full venture",
];

const notYet = [
  "Enterprise-grade stress-weighted reporting as a mature product",
  "Institutional property and portfolio water-risk surfaces",
  "Fully interactive Observatory maps at production quality",
];

export default function ProgressPage() {
  return (
    <div className="impact-page max-w-6xl">
      <section className="impact-hero pb-8">
        <div className="impact-hero-grid">
          <div>
            <div className="impact-eyebrow">Trust / Progress</div>
            <h1 className="impact-title">
              Show the work.
              <br />
              <span className="impact-title-accent">Show the gaps too.</span>
            </h1>
            <p className="impact-lead">
              Progress is where ALCUB3 Impact reports what is shipped, what is underway, and what
              is still aspirational. If this venture is going to ask for trust, it needs an honest
              scoreboard.
            </p>
          </div>

          <div className="impact-panel">
            <div className="impact-mini-label">Current focus</div>
            <div className="mt-5 space-y-3 text-sm leading-7 text-zinc-400">
              <p>Make the consumer layer useful now.</p>
              <p>Use Labs to surface proof.</p>
              <p>Use Research to keep claims disciplined.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="impact-grid-3">
        <ProgressColumn title="Shipped" items={shipped} />
        <ProgressColumn title="In Progress" items={inProgress} />
        <ProgressColumn title="Not Yet" items={notYet} />
      </section>

      <section className="impact-section">
        <div className="impact-panel">
          <div className="impact-section-label">Next quarter</div>
          <div className="impact-grid-2 mt-5">
            <GoalCard
              title="Strengthen Water Pulse"
              description="Add the next trust-building layers without pretending they are measured when they are modeled."
            />
            <GoalCard
              title="Package Impact API"
              description="Turn the higher-value reporting surface into a real early-access offering with clear buyer use cases."
            />
            <GoalCard
              title="Make Observatory more inspectable"
              description="Improve the visual proof layer so regional change can be understood without reading raw pipeline docs."
            />
            <GoalCard
              title="Promote research properly"
              description="Start publishing the deeper methods and benchmark notes in a form that can graduate to the Research domain."
            />
          </div>
        </div>
      </section>

      <section className="impact-section">
        <div className="impact-panel">
          <div className="impact-mini-label">Move with intent</div>
          <div className="impact-grid-2 mt-5">
            <div>
              <h3 className="text-2xl font-display leading-none text-zinc-100">
                Speed matters. False certainty is expensive.
              </h3>
              <p className="mt-4 text-sm leading-7 text-zinc-400">
                The right balance is to ship interfaces quickly while being unusually explicit about
                what is still uncertain, inferred, or under active R&D.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/methodology" className="impact-button-secondary">
                Read methodology
              </Link>
              <Link href="/observatory" className="impact-button-ghost">
                See Observatory
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProgressColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="impact-panel">
      <div className="text-[0.72rem] font-mono uppercase tracking-[0.22em] text-water">{title}</div>
      <ul className="mt-5 space-y-3 text-sm leading-7 text-zinc-400">
        {items.map((item) => (
          <li key={item} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function GoalCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="impact-card">
      <h3 className="text-2xl font-display leading-none text-zinc-100">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-zinc-400">{description}</p>
    </div>
  );
}
