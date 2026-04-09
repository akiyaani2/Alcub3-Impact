import Link from "next/link";

const exploreLinks = [
  { href: "https://alcub3.com", label: "ALCUB3", external: true },
  { href: "https://labs.alcub3.com", label: "Labs", external: true },
  { href: "https://research.alcub3.com", label: "Research", external: true },
  { href: "https://learning.alcub3.com", label: "The Institute", external: true },
  { href: "https://blog.alcub3.com", label: "The Construct", external: true },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 md:grid-cols-[1.3fr_repeat(3,minmax(0,1fr))]">
        <div>
          <div className="text-[0.72rem] font-mono uppercase tracking-[0.24em] text-water">
            ALCUB3 Impact
          </div>
          <h3 className="mt-3 font-display text-3xl leading-none text-zinc-50">
            Water intelligence for visibility, accountability, and action.
          </h3>
          <p className="mt-4 max-w-sm text-sm leading-7 text-zinc-400">
            An adjacent venture built on ALCUB3&apos;s shared platform rails. Product,
            Labs, and Research stay distinct so claims stay credible.
          </p>
        </div>

        <FooterColumn
          title="Product"
          links={[
            { href: "/", label: "Water Intelligence" },
            { href: "/pulse", label: "Water Pulse" },
            { href: "/footprint", label: "AI Footprint" },
            { href: "/impact-api", label: "Impact API" },
            { href: "/account", label: "Account" },
          ]}
        />

        <FooterColumn
          title="Proof"
          links={[
            { href: "/observatory", label: "Observatory" },
            { href: "/methodology", label: "Methodology" },
            { href: "/answers", label: "Answers" },
            { href: "/progress", label: "Progress" },
          ]}
        />

        <FooterColumn title="Explore" links={exploreLinks} />
      </div>

      <div className="mx-auto max-w-7xl px-4">
        <div className="mt-12 border-t border-white/10 pt-6 flex items-center justify-between text-xs text-zinc-500">
          <p>&copy; 2026 ALCUB3. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="https://alcub3.com/privacy" className="hover:text-zinc-300 transition-colors">Privacy</a>
            <a href="https://alcub3.com/terms" className="hover:text-zinc-300 transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string; external?: boolean }[];
}) {
  return (
    <div>
      <div className="text-[0.72rem] font-mono uppercase tracking-[0.22em] text-zinc-500">
        {title}
      </div>
      <div className="mt-4 flex flex-col gap-3">
        {links.map((link) =>
          link.external ? (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-300 transition hover:text-white"
            >
              {link.label}
            </a>
          ) : (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-zinc-300 transition hover:text-white"
            >
              {link.label}
            </Link>
          )
        )}
      </div>
    </div>
  );
}
