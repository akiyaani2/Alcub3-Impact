import Link from "next/link";
import { ImpactHeroGlobe } from "@/components/impact-hero-globe";
import { AccessLadder } from "@/components/access-ladder";

export default function Home() {
  return (
    <div className="impact-page">
      <section className="impact-hero">
        <div className="impact-hero-grid">
          <div>
            <div className="impact-eyebrow">ALCUB3 Impact / Water Intelligence</div>
            <h1 className="impact-title">
              Make water
              <br />
              <span className="impact-title-accent">legible.</span>
            </h1>
            <p className="impact-lead">
              ALCUB3 Impact is the water-intelligence venture built on ALCUB3&apos;s shared
              platform rails. We turn open data, geospatial sensing, and public methodology
              into products people can use, proof surfaces people can inspect, and research
              others can challenge.
            </p>
            <div className="impact-actions">
              <Link href="/pulse" className="impact-button">
                Check Water Pulse
              </Link>
              <Link href="/observatory" className="impact-button-secondary">
                Explore Observatory
              </Link>
              <a
                href="https://github.com/akiyaani2/Alcub3-Impact"
                target="_blank"
                rel="noopener noreferrer"
                className="impact-button-ghost"
              >
                View open source
              </a>
            </div>
          </div>

          <div className="impact-panel impact-panel-globe">
            <div className="impact-mini-label">Operating Model</div>
            <ImpactHeroGlobe />
            <div className="impact-track-grid mt-6">
              <TrackRow
                title="Product"
                description="Water Pulse, AI Footprint, and later the Impact API."
              />
              <TrackRow
                title="Labs"
                description="Observatory workflows, forecasting previews, and sensing experiments."
              />
              <TrackRow
                title="Research"
                description="Methodology, evidence tiers, benchmark notes, and public reports."
              />
            </div>
            <div className="impact-rule my-6" />
            <p className="text-sm leading-7 text-zinc-400">
              Product is usable. Labs is experimental. Research is what we are prepared to
              defend publicly. Keeping those lanes distinct is part of the trust model.
            </p>
          </div>
        </div>
      </section>

      <section className="impact-section">
        <div className="impact-section-head">
          <div className="impact-section-label">01 / Launch Stack</div>
          <h2 className="impact-section-title">What ships now, what compounds later.</h2>
          <p className="impact-section-copy">
            The immediate wedge is not everything in water. It is one intelligence engine
            with several interfaces: consumer, proof, open source, and institutional.
          </p>
        </div>
        <div className="impact-grid-2">
          <Card
            title="Water Pulse"
            description="The consumer entry point: zip-code water visibility across quality, drought, flood, and the next layer of PFAS, groundwater, and infrastructure risk."
            href="/pulse"
            tag="Product"
          />
          <Card
            title="WaterWatch"
            description="The open-source developer layer: fetching, scoring, and reporting primitives that keep the venture legible and extensible."
            href="https://github.com/akiyaani2/Alcub3-Impact/tree/main/waterwatch"
            tag="Open Source"
            external
          />
          <Card
            title="Observatory"
            description="The proof layer. Water change, forecast signals, and regional monitoring surfaces powered by geospatial workflows and open imagery."
            href="/observatory"
            tag="Labs"
          />
          <Card
            title="Impact API"
            description="The higher-value institutional layer: water reporting, portfolio risk, property intelligence, and partner workflows. Early access for now."
            href="/impact-api"
            tag="Product"
          />
        </div>
      </section>

      <section className="impact-section">
        <div className="impact-section-head">
          <div className="impact-section-label">02 / Research-Driven Expansion</div>
          <h2 className="impact-section-title">The next strongest layers are already visible.</h2>
          <p className="impact-section-copy">
            The recent paper review materially sharpened the roadmap. These additions
            strengthen both impact and monetization without bloating the launch.
          </p>
        </div>
        <div className="impact-grid-4">
          <SignalCard
            title="PFAS Risk Indicator"
            state="Next"
            description="A geospatial risk layer built from public data and modeled correlates. Strong consumer hook, but clearly framed as risk rather than diagnosis."
          />
          <SignalCard
            title="Groundwater Health"
            state="Next"
            description="A hidden-crisis layer that makes the score more real in places where groundwater quietly underpins drinking water."
          />
          <SignalCard
            title="Infrastructure Risk"
            state="Next"
            description="Pipe age, violation history, nearby facilities, and flood exposure bridge consumer usefulness and enterprise value."
          />
          <SignalCard
            title="Portfolio Water Risk"
            state="Later"
            description="The highest-value institutional surface: property, insurer, lender, and site-selection intelligence for capital decisions."
          />
        </div>
      </section>

      <section className="impact-section">
        <div className="impact-section-head">
          <div className="impact-section-label">03 / Claim Discipline</div>
          <h2 className="impact-section-title">Every visible claim needs an evidence tier.</h2>
          <p className="impact-section-copy">
            The fastest way to make this credible is to separate what is directly observed
            from what is estimated, modeled, or still on the roadmap.
          </p>
        </div>
        <div className="impact-grid-2">
          <EvidenceCard
            title="Measured"
            description="Station data, published violations, gauge states, and other directly sourced observations."
          />
          <EvidenceCard
            title="Estimated"
            description="AI water footprint and reporting layers where the method is defensible but facility-level data is unavailable."
          />
          <EvidenceCard
            title="Modeled"
            description="PFAS risk, groundwater health, and forecast surfaces that rely on validated but probabilistic inference."
          />
          <EvidenceCard
            title="Roadmap"
            description="Signals or use cases we intend to build but do not yet claim operationally."
          />
        </div>
      </section>

      <section className="impact-section">
        <div className="impact-panel">
          <div className="impact-section-label">04 / Shared Rails</div>
          <h2 className="impact-section-title">Built on ALCUB3&apos;s platform, not confused with it.</h2>
          <div className="impact-grid-2 mt-6">
            <p className="text-sm leading-7 text-zinc-300">
              ALCUB3 Impact borrows what should be shared: memory systems, agent
              workflows, observability, publishing operations, model infrastructure,
              and governance rails.
            </p>
            <p className="text-sm leading-7 text-zinc-400">
              But it remains a distinct venture with its own buyer motion, proof
              requirements, mission logic, and product architecture. It is not another
              SKU beside AI Workers.
            </p>
          </div>
        </div>
      </section>

      <section className="impact-section">
        <div className="impact-section-head">
          <div className="impact-section-label">05 / Open Substrate</div>
          <h2 className="impact-section-title">
            Built on public data, open tools, and selective model infrastructure.
          </h2>
        </div>
        <div className="impact-grid-3">
          {[
            {
              name: "USGS + NOAA + EPA",
              desc: "Measured river, flood, and regulatory data for the trust base.",
            },
            {
              name: "Sentinel + geospatial workflows",
              desc: "The visual and remote-sensing layer for Observatory and future forecasting.",
            },
            {
              name: "WaterWatch",
              desc: "The open-source developer layer that unifies fetching, scoring, and reporting primitives.",
            },
            {
              name: "Public methodology",
              desc: "Claims, caveats, and scoring logic published instead of hidden behind dashboards.",
            },
            {
              name: "Selective AI infrastructure",
              desc: "Use the best open model and inference tools available, but do not turn vendors into the identity.",
            },
            {
              name: "Partner validation",
              desc: "Ground truth, field context, and review loops are part of the product, not an afterthought.",
            },
          ].map((source) => (
            <div key={source.name} className="impact-card">
              <div className="impact-chip impact-chip-neutral">{source.name}</div>
              <p className="mt-4 text-sm leading-7 text-zinc-400">{source.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="impact-section">
        <div className="impact-section-head">
          <div className="impact-section-label">06 / Access</div>
          <h2 className="impact-section-title">Guest-first now. Account-led when it helps.</h2>
          <p className="impact-section-copy">
            The open surfaces should stay public. Accounts exist for saved places, alerts,
            continuity, shared work, and higher-leverage partner workflows.
          </p>
        </div>
        <AccessLadder />
      </section>
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
    <Component href={href} {...extraProps} className="impact-card group block">
      <div className="impact-chip">{tag}</div>
      <h3 className="mt-5 text-2xl font-display leading-none text-zinc-100 transition-colors group-hover:text-blue-100">
        {title}
      </h3>
      <p className="mt-4 text-sm leading-7 text-zinc-400">{description}</p>
      <div className="mt-6 text-sm font-medium text-water">Explore →</div>
    </Component>
  );
}

function TrackRow({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
      <div className="text-[0.72rem] font-mono uppercase tracking-[0.2em] text-water">{title}</div>
      <p className="mt-2 text-sm leading-7 text-zinc-400">{description}</p>
    </div>
  );
}

function SignalCard({
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

function EvidenceCard({
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
