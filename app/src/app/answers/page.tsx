import Link from "next/link";

const faqs = [
  {
    question: "Is Water Pulse a lab test?",
    answer:
      "No. It is a public-facing water score built from measured public inputs and simple modeled synthesis. It should help people orient quickly, not replace local testing or regulatory action.",
  },
  {
    question: "Are PFAS and groundwater live now?",
    answer:
      "Not as operational score layers in the current release. They are part of the near-term roadmap and will be surfaced with clear evidence-tier labeling when ready.",
  },
  {
    question: "Why separate Product, Labs, and Research?",
    answer:
      "Because usable software, experimental work, and validated public knowledge should not all be described with the same confidence level.",
  },
  {
    question: "Is the AI footprint calculator exact?",
    answer:
      "No. It is an estimate built from published WUE and workload assumptions. The point is visibility and accountability, not fake precision.",
  },
  {
    question: "Where does the commercial upside come from?",
    answer:
      "The long-term value sits in institutional water reporting, portfolio risk, site selection, and decision support. The consumer layer builds trust and distribution.",
  },
];

export default function AnswersPage() {
  return (
    <div className="impact-page max-w-5xl">
      <section className="impact-hero pb-8">
        <div className="impact-hero-grid">
          <div>
            <div className="impact-eyebrow">Research / Answers</div>
            <h1 className="impact-title">
              Answer the
              <br />
              <span className="impact-title-accent">real objections.</span>
            </h1>
            <p className="impact-lead">
              This page exists so the product story does not overrun the truth. If a claim needs
              more nuance, caveat, or framing, it belongs here.
            </p>
          </div>

          <div className="impact-panel">
            <div className="impact-mini-label">Intent</div>
            <p className="mt-5 text-sm leading-7 text-zinc-400">
              Fast-moving ventures usually hide uncertainty. ALCUB3 Impact should do the opposite.
              The goal is clarity without killing ambition.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq.question} className="impact-panel">
            <h2 className="text-2xl font-display leading-none text-zinc-100">{faq.question}</h2>
            <p className="mt-4 text-sm leading-7 text-zinc-400">{faq.answer}</p>
          </div>
        ))}
      </section>

      <section className="impact-section">
        <div className="impact-panel">
          <div className="impact-mini-label">Keep going</div>
          <div className="flex flex-wrap gap-3 pt-5">
            <Link href="/methodology" className="impact-button-secondary">
              Read methodology
            </Link>
            <Link href="/progress" className="impact-button-ghost">
              See progress
            </Link>
            <Link href="/impact-api" className="impact-button">
              See Impact API
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
