import Link from "next/link";
import { AccessLadder } from "@/components/access-ladder";
import { AccessRequestForm } from "@/components/access-request-form";

export default function AccountPage() {
  return (
    <div className="impact-page max-w-6xl">
      <section className="impact-hero pb-8">
        <div className="impact-hero-grid">
          <div>
            <div className="impact-eyebrow">Account / Progressive Access</div>
            <h1 className="impact-title">
              Use it now.
              <br />
              <span className="impact-title-accent">Create continuity later.</span>
            </h1>
            <p className="impact-lead">
              ALCUB3 Impact should not hide the first useful surface behind a login. The account
              layer exists to save state, deliver alerts, and unlock higher-leverage workflows once
              people actually want them.
            </p>
            <div className="impact-actions">
              <Link href="/pulse" className="impact-button">
                Try Water Pulse first
              </Link>
              <Link href="/footprint" className="impact-button-secondary">
                Run AI Footprint
              </Link>
            </div>
          </div>

          <div className="impact-panel">
            <div className="impact-mini-label">Account principles</div>
            <div className="mt-5 space-y-3 text-sm leading-7 text-zinc-400">
              <p>No login wall before first value.</p>
              <p>One ALCUB3 identity across platform and venture surfaces.</p>
              <p>Soft gate for history and alerts. Hard gate for API and team workflows.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="impact-section">
        <AccessLadder ctaHref="#request-access" ctaLabel="Set your access preference" />
      </section>

      <section className="impact-section">
        <div className="impact-grid-2">
          <div className="impact-panel">
            <div className="impact-section-label">What gets gated</div>
            <div className="mt-5 space-y-4 text-sm leading-7 text-zinc-400">
              <p>
                <strong className="text-zinc-200">Open:</strong> check a zip code, run a footprint
                estimate, inspect methodology, browse answers, and view the Observatory preview.
              </p>
              <p>
                <strong className="text-zinc-200">Soft gate:</strong> save places, save model
                profiles, subscribe to alerts, and retain personal history across sessions.
              </p>
              <p>
                <strong className="text-zinc-200">Hard gate:</strong> API keys, exports, partner
                dashboards, shared monitoring, portfolio views, and institutional reporting.
              </p>
            </div>
          </div>

          <div className="impact-panel">
            <div className="impact-section-label">Identity plan</div>
            <div className="mt-5 space-y-4 text-sm leading-7 text-zinc-400">
              <p>
                The same ALCUB3 identity should eventually work across the core platform app and
                Impact. People should not have to juggle separate accounts to move between
                governed autonomous work and water intelligence surfaces.
              </p>
              <p>
                Preferred launch methods: Google, Apple, GitHub, and email magic link. Start with
                the providers people already trust. Add SSO and team controls when the product
                motion needs them.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="impact-section" id="request-access">
        <AccessRequestForm />
      </section>
    </div>
  );
}
