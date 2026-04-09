import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ALCUB3 Impact — AI Water Intelligence",
  description:
    "Open-source AI water intelligence platform. Check your water health score, track AI water footprint, and help protect global water access.",
  openGraph: {
    title: "ALCUB3 Impact — AI Water Intelligence",
    description: "Enter your zip code. See your water.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable} dark`}>
      <body className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased">
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  );
}
