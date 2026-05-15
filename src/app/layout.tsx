import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AI-Layoffs Tracker — Who's Firing & Spending on AI",
    template: "%s | AI-Layoffs Tracker"
  },
  description: "Track which tech companies are laying off the most employees while spending billions on AI. Updated daily with verified data.",
  keywords: ["tech layoffs", "AI investment", "AI capex", "tech jobs", "layoffs 2025", "layoffs 2026"],
  authors: [{ name: "AI-Layoffs Tracker" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "AI-Layoffs Tracker",
    title: "AI-Layoffs Tracker — Who's Firing & Spending on AI",
    description: "Companies fired thousands. Then spent billions on AI. See the numbers.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }]
  },
  twitter: {
    card: "summary_large_image",
    title: "AI-Layoffs Tracker — Who's Firing & Spending on AI",
    description: "Companies fired thousands. Then spent billions on AI. See the numbers.",
    images: ["/opengraph-image"]
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0f172a] text-[#f8fafc] font-sans antialiased">
        <header className="border-b border-slate-700/50 bg-[#1e293b]/50 backdrop-blur sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold tracking-tight">
              🤖 AI-Layoffs Tracker
            </a>
            <nav className="flex gap-4 text-sm text-slate-400">
              <a href="/" className="hover:text-white transition">Home</a>
              <a href="https://github.com/evolveskh/ai-layoffs-tracker" className="hover:text-white transition">GitHub</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-slate-700/50 mt-20 py-8 text-center text-sm text-slate-500">
          <p>Data sourced from public company filings, layoffs.fyi, and news reports. Last updated daily.</p>
          <p className="mt-2 flex items-center justify-center gap-4">
            <a href="https://github.com/evolveskh/ai-layoffs-tracker" className="hover:text-white transition">GitHub</a>
            <span>·</span>
            <a href="https://ai-layoffs-tracker-gamma.vercel.app" className="hover:text-white transition">ai-layoffs-tracker-gamma.vercel.app</a>
          </p>
          <p className="mt-1">© {new Date().getFullYear()} AI-Layoffs Tracker</p>
        </footer>
      </body>
    </html>
  );
}
