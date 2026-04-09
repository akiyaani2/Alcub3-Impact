import Link from "next/link";
import { AccessRequestForm } from "@/components/access-request-form";

export default function ImpactApiPage() {
  return (
    <div className="impact-page max-w-6xl">
      <section className="impact-hero pb-8">
        <div className="impact-hero-grid">
          <div>
            <div className="impact-eyebrow">Product / Impact API</div>
            <h1 className="impact-title">
              The institutional
              <br />
              <span className="impact-title-accent">water layer.</span>
            </h1>
            <p className="impact-lead">
              Impact API is the higher-value reporting and risk surface for ALCUB3 Impact. It is
              where AI footprint accountability, water-risk intelligence, and partner workflows
              begin to compound into a serious business.
            </p>
          </div>

          <div className="impact-panel">
            <div className="impact-mini-label">Status</div>
            <div className="mt-5 space-y-3 text-sm leading-7 text-zinc-400">
              <p>Early access. Not yet a mature production SKU.</p>
              <p>Current goal: package the wedge without overselling completeness.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="impact-section">
        <div className="impact-section-head">
          <div className="impact-section-label">01 / Use cases</div>
          <h2 className="impact-section-title">Where the money is more likely to be.</h2>
        </div>
        <div className="impact-grid-2">
          <UseCase
            title="AI water reporting"
            description="Estimate and compare the water implications of model usage, infrastructure, and workload mix."
          />
          <UseCase
            title="Property and portfolio risk"
            description="Surface PFAS, groundwater, infrastructure, and flood/drought context for institutional decisions."
          />
          <UseCase
            title="Site selection"
            description="Help operators evaluate water availability and risk before placing water-intensive infrastructure."
          />
          <UseCase
            title="Partner observability"
            description="Shared dashboards and regional monitoring layers for NGOs, operators, and public-interest programs."
          />
        </div>
      </section>

      <section className="impact-section">
        <div className="impact-panel">
          <div className="impact-section-label">02 / Packaging rules</div>
          <div className="impact-grid-3 mt-5">
            <RuleCard
              title="Do not sell certainty you do not have"
              description="Lead with defensible reporting and risk surfaces, not magical omniscience."
            />
            <RuleCard
              title="Use consumer trust as entry, not endpoint"
              description="Water Pulse helps distribution. The bigger revenue sits further upstream in institutional workflow."
            />
            <RuleCard
              title="Let Research harden the story"
              description="As methods mature, graduate them into canonical research and then promote them into the product surface."
            />
          </div>
        </div>
      </section>

      <section className="impact-section">
        <div className="impact-panel">
          <div className="impact-mini-label">What to do now</div>
          <div className="impact-grid-2 mt-5">
            <div>
              <h3 className="text-2xl font-display leading-none text-zinc-100">
                Keep it early-access and sharp.
              </h3>
              <p className="mt-4 text-sm leading-7 text-zinc-400">
                The strongest move is to frame Impact API as a clear next layer for selected partners
                instead of pretending it is already a full-market enterprise platform.
              </p>
            </div>
              <div className="flex flex-wrap gap-3">
              <Link href="/account" className="impact-button">
                Request early access
              </Link>
              <Link href="/partners" className="impact-button-secondary">
                See partner motion
              </Link>
              <Link href="/methodology" className="impact-button-ghost">
                Review methodology
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="impact-section">
        <AccessRequestForm
          intent="api"
          title="Package access before you overbuild it"
          description="Impact API should stay early-access and tightly scoped while the buyer motion hardens. Leave the preferred identity route now and use the open surfaces while the gated layer comes online."
        />
      </section>
    </div>
  );
}

function UseCase({ title, description }: { title: string; description: string }) {
  return (
    <div className="impact-card">
      <h3 className="text-2xl font-display leading-none text-zinc-100">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-zinc-400">{description}</p>
    </div>
  );
}

function RuleCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="impact-card">
      <h3 className="text-2xl font-display leading-none text-zinc-100">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-zinc-400">{description}</p>
    </div>
  );
}
