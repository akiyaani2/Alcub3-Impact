import type { Metadata } from "next";
import { Source_Serif_4, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { SiteFooter } from "@/components/site-footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://impact.alcub3.com"),
  title: "ALCUB3 Impact — Water Intelligence Venture",
  description:
    "ALCUB3 Impact is the water-intelligence venture built on ALCUB3's shared platform rails. Products, labs, and research for water visibility, accountability, and action.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ALCUB3 Impact — Water Intelligence Venture",
    description: "Water intelligence products, observatory proof, and public methodology.",
    type: "website",
    url: "https://impact.alcub3.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable} ${sourceSerif.variable} dark`}>
      <body className="min-h-screen bg-black text-zinc-100 font-sans antialiased">
        <Nav />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
