"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Impact" },
  { href: "/pulse", label: "Water Pulse" },
  { href: "/observatory", label: "Observatory" },
  { href: "/methodology", label: "Methodology" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-water flex items-center justify-center text-white text-xs font-bold">
            A3
          </div>
          <span className="font-semibold text-sm text-zinc-100">
            ALCUB3 Impact
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                pathname === link.href
                  ? "text-water bg-water/10"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://github.com/akiyaani2/Alcub3-Impact"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-md transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
