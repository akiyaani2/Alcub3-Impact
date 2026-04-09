import Link from "next/link";

const tiers = [
  {
    label: "Open",
    title: "First value without a login",
    points: [
      "Check Water Pulse for any zip code",
      "Run the AI Footprint calculator",
      "Read Methodology, Answers, and Progress",
      "Inspect the Observatory preview",
    ],
  },
  {
    label: "Account",
    title: "Continuity when it becomes useful",
    points: [
      "Save places and model profiles",
      "Get local alerts and product updates",
      "Build personal score and reporting history",
      "Move between ALCUB3 products with one identity",
    ],
  },
  {
    label: "Team",
    title: "Higher-leverage access for partners",
    points: [
      "API keys and shared monitoring workspaces",
      "Exports, portfolio views, and partner dashboards",
      "Regional watchlists and observability workflows",
      "Institutional reporting and early access programs",
    ],
  },
];

export function AccessLadder({
  ctaHref = "/account",
  ctaLabel = "Choose access",
}: {
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="impact-panel">
      <div className="impact-mini-label">Access model</div>
      <div className="impact-grid-3 mt-5">
        {tiers.map((tier) => (
          <div key={tier.label} className="impact-card">
            <div className="impact-chip impact-chip-neutral">{tier.label}</div>
            <h3 className="mt-4 text-2xl font-display leading-none text-zinc-100">
              {tier.title}
            </h3>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-zinc-400">
              {tier.points.map((point) => (
                <li key={point} className="impact-bullet">
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={ctaHref} className="impact-button">
          {ctaLabel}
        </Link>
        <p className="impact-inline-note">
          Guest-first by default. Sign in only when you want continuity, alerts, or shared access.
        </p>
      </div>
    </div>
  );
}
