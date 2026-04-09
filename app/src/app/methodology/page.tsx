import Link from "next/link";

export default function MethodologyPage() {
  return (
    <div className="impact-page max-w-5xl">
      <section className="impact-hero pb-8">
        <div className="impact-hero-grid">
          <div>
            <div className="impact-eyebrow">Research / Methodology</div>
            <h1 className="impact-title">
              Publish the
              <br />
              <span className="impact-title-accent">caveats too.</span>
            </h1>
            <p className="impact-lead">
              Methodology is the trust surface for ALCUB3 Impact. It translates the deeper
              research program into something product users can read without pretending the
              current system is more certain than it is.
            </p>
          </div>

          <div className="impact-panel">
            <div className="impact-mini-label">Version status</div>
            <div className="mt-5 space-y-3">
              <StatusRow label="Water Pulse" value="v0.1 public score" />
              <StatusRow label="AI Footprint" value="estimated reporting surface" />
              <StatusRow label="Next layers" value="PFAS, groundwater, infrastructure" />
            </div>
          </div>
        </div>
      </section>

      <section className="impact-section">
        <div className="impact-section-head">
          <div className="impact-section-label">01 / Evidence tiers</div>
          <h2 className="impact-section-title">What kind of claim are you looking at?</h2>
        </div>
        <div className="impact-grid-4">
          <TierCard title="Measured" description="Direct observations from public station, gauge, or regulatory data." />
          <TierCard title="Estimated" description="Reasoned approximations such as footprint accounting where direct facility data is unavailable." />
          <TierCard title="Modeled" description="Probabilistic inference built from defensible signals, correlations, and validated methods." />
          <TierCard title="Roadmap" description="A direction that is under active development but should not yet be read as an operational claim." />
        </div>
      </section>

      <section className="impact-section">
        <Section title="Current Water Pulse Score">
          <p>
            The current Water Pulse score is a weighted composite of three components, each scored
            0-100 with higher numbers meaning better conditions.
          </p>
          <div className="overflow-x-auto">
            <table className="mt-4 w-full min-w-[34rem] text-sm">
              <thead>
                <tr className="border-b border-white/10 text-zinc-300">
                  <th className="py-3 pr-4 text-left">Component</th>
                  <th className="py-3 pr-4 text-left">Weight</th>
                  <th className="py-3 text-left">Evidence type</th>
                </tr>
              </thead>
              <tbody className="text-zinc-400">
                <tr className="border-b border-white/6">
                  <td className="py-3 pr-4">Water Quality</td>
                  <td className="py-3 pr-4">45%</td>
                  <td className="py-3">Measured regulatory data via EPA ECHO</td>
                </tr>
                <tr className="border-b border-white/6">
                  <td className="py-3 pr-4">Drought Risk</td>
                  <td className="py-3 pr-4">30%</td>
                  <td className="py-3">Measured public drought classification</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4">Flood Risk</td>
                  <td className="py-3 pr-4">25%</td>
                  <td className="py-3">Measured gauge states, simplified into public score</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Quality scoring">
          <p>
            Quality scores are derived from EPA ECHO drinking water data within a local radius.
            The current public release is intentionally simple. It is a trust-building first score,
            not the final model.
          </p>
          <ul className="list-disc space-y-2 pl-5 text-zinc-400">
            <li>0 violations: 85/100 baseline</li>
            <li>1-2 violations: reduced into a fair band</li>
            <li>3+ violations: poor band with more explicit concern surfacing</li>
          </ul>
          <p className="text-sm text-zinc-500">
            PFAS is not currently a definitive lab-backed output here. The next step is a separate
            PFAS risk indicator, not a false claim of direct detection.
          </p>
        </Section>

        <Section title="AI Water Footprint">
          <p>
            The calculator uses Water Usage Effectiveness (WUE) and workload assumptions to estimate
            water cost from AI queries.
          </p>
          <code className="mt-4 block rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-zinc-300">
            water_liters = energy_per_query_kwh × queries_per_month × wue_l_per_kwh
          </code>
          <p className="text-sm text-zinc-500">
            This is an estimate. Exact per-facility, per-hour water use is rarely public. The
            commercial roadmap is to move from generic estimate toward stress-weighted impact and
            Scope 1 + Scope 2 reporting.
          </p>
        </Section>

        <Section title="What comes next">
          <ul className="list-disc space-y-2 pl-5 text-zinc-400">
            <li>PFAS risk indicator from public geospatial priors and known correlates</li>
            <li>Groundwater health layers for regions dependent on unseen aquifers</li>
            <li>Infrastructure risk from pipe age, violations, and regional context</li>
            <li>Portfolio and property water risk for institutional users</li>
          </ul>
        </Section>

        <Section title="Limitations">
          <ul className="list-disc space-y-2 pl-5 text-zinc-400">
            <li>Public water-quality data can lag real-time conditions.</li>
            <li>Drought classifications are periodic, not continuous.</li>
            <li>Flood signals depend on gauge coverage and public feeds.</li>
            <li>AI water footprint estimates remain model- and infrastructure-sensitive.</li>
            <li>International coverage will require different source quality and lower-resolution inputs.</li>
          </ul>
        </Section>
      </section>

      <section className="impact-section">
        <div className="impact-panel">
          <div className="impact-mini-label">Canonical deeper work</div>
          <div className="impact-grid-2 mt-5">
            <div>
              <h3 className="text-2xl font-display leading-none text-zinc-100">
                This page is the product-facing summary.
              </h3>
              <p className="mt-4 text-sm leading-7 text-zinc-400">
                As the broader ALCUB3 Research domain matures, it should hold the canonical
                methods, benchmark notes, and public reports. Impact keeps the summary surface
                because users need an approachable trust layer.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/answers" className="impact-button-secondary">
                Read answers
              </Link>
              <a
                href="https://github.com/akiyaani2/Alcub3-Impact/tree/main/waterwatch"
                target="_blank"
                rel="noopener noreferrer"
                className="impact-button"
              >
                Review BasinKit
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="impact-panel mt-6">
      <h2 className="text-2xl font-display leading-none text-zinc-100">{title}</h2>
      <div className="mt-4 space-y-3 text-sm leading-7 text-zinc-400">{children}</div>
    </section>
  );
}

function TierCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="impact-stat-card">
      <div className="text-[0.72rem] font-mono uppercase tracking-[0.22em] text-water">{title}</div>
      <p className="mt-4 text-sm leading-7 text-zinc-400">{description}</p>
    </div>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
      <div className="text-[0.7rem] font-mono uppercase tracking-[0.2em] text-water">{label}</div>
      <p className="mt-2 text-sm leading-7 text-zinc-400">{value}</p>
    </div>
  );
}
