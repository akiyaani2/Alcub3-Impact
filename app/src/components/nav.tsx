"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

const links = [
  { href: "/", label: "Water Intelligence" },
  { href: "/pulse", label: "Pulse" },
  { href: "/footprint", label: "AI Footprint" },
  { href: "/observatory", label: "Observatory" },
  { href: "/methodology", label: "Methodology" },
  { href: "/partners", label: "Partners" },
  { href: "/progress", label: "Progress" },
];

const exploreLinks = [
  {
    href: "https://alcub3.com",
    label: "ALCUB3",
    description: "Core platform and company",
  },
  {
    href: "https://labs.alcub3.com",
    label: "Labs",
    description: "R&D, prototypes, simulations",
  },
  {
    href: "https://research.alcub3.com",
    label: "Research",
    description: "Validated methods and reports",
  },
  {
    href: "https://learning.alcub3.com",
    label: "The Institute",
    description: "Learning and curriculum",
  },
  {
    href: "https://blog.alcub3.com",
    label: "The Construct",
    description: "Editorial and launches",
  },
];

export function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (detailsRef.current && !detailsRef.current.contains(e.target as Node)) {
        detailsRef.current.open = false;
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <div className="sticky top-0 z-50 relative">
      <nav className="border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-water/40 bg-water/15 text-xs font-semibold tracking-[0.24em] text-water shadow-[0_0_40px_rgba(37,99,235,0.25)]">
              A3
            </div>
            <div className="leading-tight">
              <div className="text-[0.72rem] font-mono uppercase tracking-[0.22em] text-zinc-500">
                ALCUB3 Impact
              </div>
              <div className="text-sm font-medium text-zinc-100">
                Water Intelligence Venture
              </div>
            </div>
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden ml-auto p-2 text-zinc-400 hover:text-white"
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <div className="no-scrollbar hidden lg:flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-sm transition-all ${
                  pathname === link.href
                    ? "border-water/40 bg-water/15 text-water"
                    : "border-transparent text-zinc-400 hover:border-white/10 hover:bg-white/5 hover:text-zinc-200"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden shrink-0 items-center gap-3 lg:flex">
            <details ref={detailsRef} className="group relative">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 transition hover:border-water/30 hover:text-white">
                Explore
                <span className="text-xs text-zinc-500 transition group-open:rotate-180">▾</span>
              </summary>
              <div className="absolute right-0 top-[calc(100%+0.75rem)] w-72 rounded-2xl border border-white/10 bg-black/95 p-3 shadow-2xl shadow-black/50">
                {exploreLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block rounded-xl px-3 py-3 transition hover:bg-white/5"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="text-sm font-medium text-zinc-100">{link.label}</div>
                    <div className="mt-1 text-xs text-zinc-500">{link.description}</div>
                  </a>
                ))}
                <a
                  href="https://github.com/akiyaani2/Alcub3-Impact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block rounded-xl border border-white/10 px-3 py-3 text-sm text-zinc-300 transition hover:border-water/30 hover:text-white"
                >
                  View the open-source repo
                </a>
              </div>
            </details>

            <Link href="/account" className="impact-button-secondary">
              Account
            </Link>

            <Link href="/pulse" className="impact-button">
              See Water Pulse
            </Link>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/10 p-4">
          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm ${
                  pathname === link.href ? "bg-blue-500/15 text-blue-400" : "text-zinc-400 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-white/10 mt-2 pt-2">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2 px-3">Explore ALCUB3</p>
              {exploreLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 text-sm text-zinc-400 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <Link
              href="/pulse"
              onClick={() => setMobileOpen(false)}
              className="mt-2 text-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
            >
              See Water Pulse
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
