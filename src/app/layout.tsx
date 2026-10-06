import type { Metadata } from "next";
import { Unbounded, Geist_Mono } from "next/font/google";
import { JsonLdScript } from "@/components/JsonLdScript";
import { personJsonLd } from "@/lib/schema";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://franciscoalencar.com"),
  title: {
    default: "Francisco Alencar, Branded Entertainment Creative",
    template: "%s · Francisco Alencar",
  },
  description:
    "Creative Director, Screenwriter, Strategist. 20+ films, 140M+ views for Google, YouTube, TikTok, Waze, Motorola, Mercado Livre, Netflix, CazéTV, and Nubank. AI-native practice built on Claude. Based in São Paulo, working globally.",
  keywords: [
    "Francisco Alencar",
    "Champs Alencar",
    "Creative Director Brazil",
    "Branded Entertainment Brazil",
    "Brazilian Screenwriter",
    "AI-native creative",
    "Generative AI for film",
    "São Paulo Creative Director",
    "YouTube Brand creative",
    "CazéTV Creative Director",
  ],
  openGraph: {
    type: "website",
    siteName: "Francisco Alencar",
    title: "Francisco Alencar, Creative Director · Screenwriter · Strategist",
    description:
      "20+ films, 140M+ views for Google, YouTube, TikTok, Netflix, CazéTV, Nubank. AI-native creative practice from São Paulo.",
  },
  twitter: { card: "summary_large_image" },
  alternates: {
    languages: { en: "/", "pt-BR": "/?lang=pt" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${unbounded.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <JsonLdScript data={personJsonLd()} />
        {children}
        {/* Vercel Web Analytics — ~1KB, first-party (/_vercel/insights),
            cookieless, no consent banner required. Chosen to satisfy the
            "sem analytics pesado" performance rule in CLAUDE.md. */}
        <Analytics />
      </body>
    </html>
  );
}
