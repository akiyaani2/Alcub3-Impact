import Link from "next/link";
import { AccessRequestForm } from "@/components/access-request-form";

export default function PartnersPage() {
  return (
    <div className="impact-page max-w-6xl">
      <section className="impact-hero pb-8">
        <div className="impact-hero-grid">
          <div>
            <div className="impact-eyebrow">Product / Partners</div>
            <h1 className="impact-title">
              Build with us
              <br />
              <span className="impact-title-accent">where water matters.</span>
            </h1>
            <p className="impact-lead">
              ALCUB3 Impact works best where domain partners, public-interest operators, and
              institutional buyers all need the same thing: clearer water visibility and a
              more defensible basis for action.
            </p>
          </div>

          <div className="impact-panel">
            <div className="impact-mini-label">What we bring</div>
            <div className="mt-5 space-y-3 text-sm leading-7 text-zinc-400">
              <p>Open-data ingestion, geospatial workflows, agent infrastructure, and reporting surfaces.</p>
              <p>Method discipline, product design, and a willingness to publish caveats instead of hiding them.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="impact-section">
        <div className="impact-section-head">
          <div className="impact-section-label">01 / Partner lanes</div>
          <h2 className="impact-section-title">Different partners, different motions.</h2>
        </div>
        <div className="impact-grid-2">
          <PartnerCard
            title="NGOs and public-interest operators"
            description="Field validation, regional context, program delivery, and public-interest deployment."
          />
          <PartnerCard
            title="Research institutions"
            description="Joint methodology, shared datasets, peer pressure, and benchmark rigor."
          />
          <PartnerCard
            title="Utilities and infrastructure operators"
            description="Operational visibility, monitoring workflows, and risk surfacing where the stakes are real."
          />
          <PartnerCard
            title="Insurers, lenders, and property platforms"
            description="The highest-value future motion: portfolio and property water risk at institutional scale."
          />
        </div>
      </section>

      <section className="impact-section">
        <div className="impact-panel">
          <div className="impact-section-label">02 / Engagement model</div>
          <div className="impact-grid-3 mt-5">
            <StepCard
              number="01"
              title="Align on the problem"
              description="Start from the decision that needs to improve, not the model that sounds impressive."
            />
            <StepCard
              number="02"
              title="Define evidence"
              description="Agree on what can be measured, estimated, modeled, or left as roadmap before anything ships."
            />
            <StepCard
              number="03"
              title="Ship the right surface"
              description="Product, Labs, and Research stay distinct so the partnership output lands in the right place."
            />
          </div>
        </div>
      </section>

      <section className="impact-section">
        <div className="impact-panel">
          <div className="impact-mini-label">Start the conversation</div>
          <div className="impact-grid-2 mt-5">
            <div>
              <h3 className="text-2xl font-display leading-none text-zinc-100">
                The strongest partnerships combine data, context, and accountability.
              </h3>
              <p className="mt-4 text-sm leading-7 text-zinc-400">
                If you are working on water access, environmental risk, water-heavy infrastructure,
                real-estate intelligence, or public-interest monitoring, this is the right time to talk.
              </p>
            </div>
              <div className="flex flex-wrap gap-3">
              <Link href="/account" className="impact-button">
                Request partner access
              </Link>
              <Link href="/impact-api" className="impact-button-secondary">
                See Impact API
              </Link>
              <Link href="/progress" className="impact-button-ghost">
                Review current progress
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="impact-section">
        <AccessRequestForm
          intent="partner"
          title="Start the partner access path"
          description="Use this to signal whether you want partner access, shared monitoring, or early access to institutional water-risk workflows. The public surfaces stay open; partner surfaces get provisioned deliberately."
        />
      </section>
    </div>
  );
}

function PartnerCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="impact-card">
      <h3 className="text-2xl font-display leading-none text-zinc-100">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-zinc-400">{description}</p>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="impact-card">
      <div className="text-[0.72rem] font-mono uppercase tracking-[0.22em] text-water">{number}</div>
      <h3 className="mt-4 text-2xl font-display leading-none text-zinc-100">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-zinc-400">{description}</p>
    </div>
  );
}
