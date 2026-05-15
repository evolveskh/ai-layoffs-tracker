import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";

export const metadata: Metadata = {
  title: {
    default: "AI-Layoffs Tracker",
    template: "%s | AI-Layoffs Tracker"
  },
  description: "Track which tech companies are laying off the most employees while spending billions on AI. Updated daily with verified data.",
  keywords: ["tech layoffs", "AI investment", "AI capex", "tech jobs", "layoffs 2025", "layoffs 2026"],
  authors: [{ name: "AI-Layoffs Tracker" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "AI-Layoffs Tracker",
    title: "AI-Layoffs Tracker",
    description: "Companies fired thousands. Then spent billions on AI. See the numbers.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }]
  },
  twitter: {
    card: "summary_large_image",
    title: "AI-Layoffs Tracker",
    description: "Companies fired thousands. Then spent billions on AI. See the numbers.",
    images: ["/opengraph-image"]
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-[#fafafa] font-sans antialiased">
        <header className="sticky top-0 z-50 h-[48px] border-b border-[#171717] bg-[#0a0a0a] flex items-center">
          <div className="max-w-7xl w-full mx-auto px-4 flex items-center justify-between">
            <a href="/" className="text-[18px] font-semibold tracking-normal text-[#fafafa]">
              AI-Layoffs
            </a>
            <nav className="flex gap-6 text-[13px] text-[#a3a3a3]">
              <a href="/" className="hover:text-[#fafafa] transition-colors duration-150">Home</a>
              <a href="https://github.com/evolveskh/ai-layoffs-tracker" className="hover:text-[#fafafa] transition-colors duration-150">GitHub</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <Analytics />
        <SpeedInsights />
        <footer className="border-t border-[#171717] mt-20 py-8 text-center text-[13px] text-[#525252]">
          <p>Data sourced from public company filings, layoffs.fyi, and news reports. Last updated daily.</p>
          <p className="mt-2 flex items-center justify-center gap-4">
            <a href="https://github.com/evolveskh/ai-layoffs-tracker" className="hover:text-[#a3a3a3] transition-colors duration-150">GitHub</a>
            <span>·</span>
            <a href="https://ai-layoffs-tracker-gamma.vercel.app" className="hover:text-[#a3a3a3] transition-colors duration-150">Live Site</a>
          </p>
          <p className="mt-1">© {new Date().getFullYear()} AI-Layoffs Tracker</p>
        </footer>
      </body>
    </html>
  );
}
