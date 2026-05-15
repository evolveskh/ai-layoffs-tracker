# Implementation Plan: AI-Layoffs Tracker

## 1. Product Name & Elevator Pitch

**Product Name:** `AI-Layoffs Tracker` (working title) — domain: `ai-layoffs.com` or `thetradeoff.io`

**Elevator Pitch:**  
Companies are firing thousands while pouring billions into AI. Our dashboard puts the numbers side‑by‑side so you can see the tradeoff at a glance — updated daily for the transparency the tech industry needs.

## 2. Target Audience

**Primary persona: "The Displaced Tech Analyst"**  
- A senior software engineer or IT professional in **Southeast Asia** (Khmer‑speaking, English‑literate).  
- Recently laid off from a global tech company.  
- Frustrated by headlines of massive AI investments while colleagues are being let go.  
- Wants **hard numbers** to share with their network and to understand the trend for career planning.

**Secondary persona: "The Ethical Investor"**  
- Retail investor or financial blogger tracking corporate responsibility.  
- Needs a data source to cite in analyses about AI‑driven job displacement.

## 3. MVP Features

| Priority | Feature | Description | Why in MVP |
|----------|---------|-------------|-------------|
| **P0** | Company Comparison Table | Sortable table with columns: Company, Total Layoffs, AI Investment, Layoff per $1B AI spend. | Core value prop – immediate answer. |
| **P0** | Basic Detail Page per Company | Timeline of layoff/investment events with sources. | Deep-dive + shareable URL. |
| **P0** | Daily Update Indicator | "Last updated: [date]" badge, auto‑rebuild daily. | Builds trust, encourages return visits. |
| **P1** | Comparison Chart | Dual‑axis bar chart on homepage showing layoffs vs investment for top companies. | Visual impact, viral potential. |
| **P1** | Filter by Sector | Dropdown to filter companies by sector (Big Tech, SaaS, etc.). | Basic usability without complexity. |
| **P2** | Shareable Social Cards | Dynamically generated OG image with company stats. | Viral sharing on Twitter/LinkedIn. |
| **P2** | Company Search | Text search box. | Basic UX. |

## 4. User Flow & UI Layout

### Homepage
- **Header:** Logo, "Last updated: [timestamp]", GitHub link.
- **Hero:** Headline: "They Fired Thousands. Then Spent Billions on AI." Short intro.
- **Main Table:** Sortable, with columns:  
  `Company (logo+name) | Sector | Total Layoffs | AI Investment (USD) | Layoff/AI Ratio`
- **Chart:** Top 10 companies, dual‑axis bars (red = layoffs, green = investment).
- **Footer:** Methodology, sources, contact.

### Detail Page (`/company/[slug]`)
- Company header with name, logo, summary stats.
- Timeline: chronological events (layoff and investment) with date, description, source link.
- Interactive chart: cumulative layoffs and investments over time.
- "Back to home" link.

### Mobile Design
- Table becomes **vertical card stack**: each card shows company name, layoffs, investment, ratio.
- Chart reflows full‑width.
- Simple top nav with hamburger menu or minimal header.

## 5. Data Model / Schema

### `data/companies.json`
```json
[
  {
    "id": "meta",
    "name": "Meta Platforms Inc.",
    "ticker": "META",
    "sector": "Big Tech",
    "logo_url": "/logos/meta.png",
    "total_employees": 72000,
    "description": "Social media and metaverse company",
    "last_updated": "2026-05-15T00:00:00Z"
  }
]
```
| Field | Type | Description |
|-------|------|-------------|
| `id` | string (slug) | Unique URL identifier |
| `name` | string | Full company name |
| `ticker` | string\|null | Stock ticker (optional) |
| `sector` | enum | `"Big Tech"`, `"SaaS"`, `"Semiconductor"`, `"E-commerce"`, `"Enterprise"`, `"Other"` |
| `logo_url` | string | Path to image |
| `total_employees` | number\|null | Latest known headcount |
| `description` | string\|null | Short blurb |
| `last_updated` | ISO timestamp | When the company record was modified |

### `data/events.json`
```json
[
  {
    "id": "evt-001",
    "company_id": "meta",
    "type": "layoff",
    "date": "2023-03-14",
    "number": 10000,
    "amount": null,
    "description": "Second round of layoffs announced",
    "source_url": "https://techcrunch.com/...",
    "source_name": "TechCrunch",
    "verified": true
  },
  {
    "id": "evt-002",
    "company_id": "meta",
    "type": "investment",
    "date": "2025-04-24",
    "number": null,
    "amount": 145000,
    "description": "Meta increases AI capex to $145B for 2025",
    "source_url": "https://reuters.com/...",
    "source_name": "Reuters",
    "verified": true
  }
]
```
| Field | Type | Description |
|-------|------|-------------|
| `id` | string (uuid) | Unique event identifier |
| `company_id` | string | References `companies.id` |
| `type` | `"layoff"` \| `"investment"` | Event kind |
| `date` | ISO date | Date of announcement |
| `number` | number\|null | Headcount laid off (for layoffs) |
| `amount` | number\|null | AI spend in **millions USD** (for investments) |
| `description` | string | Free‑text summary |
| `source_url` | string | Link to authoritative source |
| `source_name` | string | Publication name |
| `verified` | boolean | Manual review flag |

**Derived fields** (computed at build time):  
- `total_layoffs` – sum of `number`  
- `total_investment` – sum of `amount`  
- `layoff_per_billion_ai` – `total_layoffs / (total_investment / 1000)`  
- `investment_per_layoff` – inverted ratio

## 6. Data Collection Strategy

### Initial Data Seeding
1. Manually gather from **layoffs.fyi** (public Google Sheet export) — 2023‑present tech layoffs.
2. Scrape **SEC filings** (10‑K/10‑Q) and major news outlets for AI capex numbers.
3. Use the Business Insider "$725B Big Tech AI spend" article as a starting point.
4. Populate `companies.json` with ~20‑30 high‑profile companies and all their historical events in `events.json`.

### Daily Update Mechanism
- **Script:** `scripts/update-data.mjs` (Node, no dependencies beyond `node-fetch`).
- **Trigger:** GitHub Actions workflow (`daily-update.yml`) runs at `0 6 * * *` UTC.
- **Flow:**
  1. Fetch RSS feeds (Google News queries: `"tech layoffs"`, `"AI capex"`, `"AI investment billion"`).
  2. Extract candidate articles (title+link).
  3. (Latest) For each candidate, **check against existing events** (by URL) to avoid duplication.
  4. If a new relevant article is found, **create a pending entry** in `data/pending.json` with AI‑assisted structured extraction (use a simple `regex` or a free LLM API).  
     - MVP *alternative*: manual curation — the script only emails/Slack‑alerts the maintainer with new article links.
  5. Maintainer reviews `pending.json`, moves verified entries to `events.json`, and pushes the commit.
- **Post‑MVP automation:** Integrate with **NewsAPI** or **GNews** free tiers; use an LLM agent to extract layoff numbers and investment amounts from article text.

### Data Integrity
- All events **must** have a `source_url`.
- Pre‑commit hook validates JSON structure with `zod` schema.
- Manual PR process for community contributions.

## 7. Tech Stack

| Layer | Choice | Justification |
|-------|--------|----------------|
| **Framework** | **Next.js 15 (App Router) + TypeScript** | SSG for static pages, ISR for daily freshness, API routes if needed, excellent Vercel ecosystem. Matches user's Vercel experience. |
| **Styling** | **Tailwind CSS v4** | Utility‑first, fast prototyping, small bundle. No extra UI library. |
| **Charts** | **Recharts** (`recharts`) | Declarative, React‑native, lightweight. Supports `ComposedChart` with dual axes. |
| **Data Layer** | **JSON files in `data/`** | Zero‑infrastructure, version‑controlled, easy to edit manually. |
| **Validation** | **Zod** (`zod`) | Type‑safe schema validation at build time. |
| **Date Handling** | **date‑fns** (`date-fns`) | Lightweight, tree‑shakeable. |
| **OG Images** | **@vercel/og** | Generates social previews on the fly. |
| **Testing** | **Vitest** + **Playwright** (optional) | Unit tests for data parsing, E2E for critical paths. |
| **CI/CD** | **GitHub Actions** | Scheduled data update + deploy and linting. |
| **Hosting** | **Vercel (Hobby)** | Free, custom domain, auto‑deploy, serverless functions. |

## 8. File / Project Structure

```
ai-layoffs-tracker/
├── public/
│   ├── logos/                   # Company logo images (PNG)
│   │   ├── meta.png
│   │   └── ...
│   ├── favicon.ico
│   └── robots.txt
├── data/
│   ├── companies.json           # Company metadata
│   ├── events.json              # All events (layoffs + investments)
│   ├── pending.json             # Awaiting review (optional)
│   └── schema.ts                # Zod validation schemas
├── scripts/
│   ├── update-data.mjs          # Daily scraping / curation script
│   ├── validate-data.mjs        # JSON linter
│   └── seed.mjs                 # Initial data populator
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout (Tailwind, metadata)
│   │   ├── page.tsx             # Homepage (server component)
│   │   ├── company/
│   │   │   └── [slug]/
│   │   │       ├── page.tsx     # Detail page
│   │   │       └── opengraph-image.tsx  # Dynamic OG image
│   │   ├── api/
│   │   │   └── summary/
│   │   │       └── route.ts     # Optional JSON API endpoint
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── HomePage.tsx         # Client component for interactive home
│   │   ├── CompanyTable.tsx     # Sortable table
│   │   ├── CompanyCard.tsx      # Mobile card view
│   │   ├── ComparisonChart.tsx  # Dual‑axis bar chart
│   │   ├── EventTimeline.tsx    # Timeline on detail page
│   │   ├── FilterBar.tsx        # Sector filter
│   │   └── ui/                  # Reusable primitives (Button, etc.)
│   ├── lib/
│   │   ├── data.ts              # Read JSON, compute summaries
│   │   ├── utils.ts             # Helpers
│   │   └── types.ts             # TypeScript interfaces
│   └── styles/
│       └── globals.css          # Tailwind directives + custom globals
├── .github/
│   ├── workflows/
│   │   ├── daily-update.yml     # Cron job for data update
│   │   └── validate.yml         # Validate on PR
│   └── PULL_REQUEST_TEMPLATE.md
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── vercel.json
├── README.md
└── LICENSE
```

## 9. Google SEO Optimization

### Meta Tags & Structured Data (Every Page)

```tsx
// Root layout.tsx — global defaults
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
    images: [{ url: "/og-default.png", width: 1200, height: 630 }]
  },
  twitter: {
    card: "summary_large_image",
    title: "AI-Layoffs Tracker — Who's Firing & Spending on AI",
    description: "Companies fired thousands. Then spent billions on AI. See the numbers.",
    images: ["/og-default.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true }
  }
};
```

### Per-Company Detail Page SEO
```tsx
// company/[slug]/page.tsx
export async function generateMetadata({ params }) {
  const company = getCompany(params.slug);
  return {
    title: `${company.name}: ${company.total_layoffs} Laid Off vs $${company.total_investment}B AI Spend`,
    description: `${company.name} has laid off ${formatNumber(company.total_layoffs)} employees while investing $${company.total_investment}B in AI. Full timeline and breakdown.`,
    openGraph: {
      title: `${company.name} Layoffs vs AI Investment`,
      description: `${formatNumber(company.total_layoffs)} laid off. $${company.total_investment}B into AI.`,
      images: [{ url: `/api/og?company=${company.id}`, width: 1200, height: 630 }]
    },
    twitter: {
      card: "summary_large_image",
      title: `${company.name} Layoffs vs AI Investment`,
      description: `${formatNumber(company.total_layoffs)} laid off. $${company.total_investment}B into AI.`,
      images: [`/api/og?company=${company.id}`]
    }
  };
}
```

### Technical SEO Checklist
- [ ] **JSON‑LD structured data** — `WebSite` on home, `Dataset` on detail pages (schema.org)
- [ ] **Canonical URLs** — set via `<link rel="canonical">` on every page
- [ ] **Sitemap.xml** — auto‑generated with `next-sitemap` package, includes all `/company/[slug]` pages
- [ ] **Robots.txt** — allow all, point to sitemap
- [ ] **Semantic HTML** — `<article>`, `<section>`, `<nav>`, `<table>` with proper `<thead>/<tbody>`
- [ ] **Heading hierarchy** — single `<h1>` per page, proper `<h2>/<h3>` nesting
- [ ] **Alt text** — on all logos and chart images
- [ ] **Performance** — Lighthouse score >90 (SSG pages, minimal JS, optimized images)
- [ ] **SSL** — enforced via Vercel (automatic HTTPS redirect)
- [ ] **Breadcrumbs** — on detail pages for internal linking: Home > Company Name
- [ ] **404 page** — custom `not-found.tsx` with links back to home
- [ ] **Target keywords per page:**
  - Home: "tech layoffs tracker", "AI investment tracker", "companies laying off for AI"
  - Detail: `"[Company Name] layoffs"`, `"[Company Name] AI investment"`, `"[Company Name] capex"`

### Sitemap Generation
```bash
npm install next-sitemap
```
```js
// next-sitemap.config.js
module.exports = {
  siteUrl: "https://ai-layoffs.com",
  generateRobotsTxt: true,
  additionalPaths: async (config) => {
    const companies = require("./data/companies.json");
    return companies.map(c => ({
      loc: `/company/${c.id}`,
      changefreq: "daily",
      priority: 0.8,
      lastmod: c.last_updated
    }));
  }
};
```

## 10. OG Images — Optimized for X (Twitter)

X uses `twitter:card = "summary_large_image"` which renders at **1200×630** (same as Open Graph). Every company detail page must generate a custom social card with the company's key stats — this is the primary viral vector.

### OG Image Design (Using @vercel/og)

```tsx
// src/app/company/[slug]/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }) {
  const company = getCompany(params.slug);
  
  return new ImageResponse(
    (
      <div style={{
        width: "100%", height: "100%",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        color: "white",
        fontFamily: "Inter, system-ui",
        display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        padding: 60
      }}>
        {/* Company Logo */}
        <img src={`https://ai-layoffs.com/logos/${company.id}.png`} 
             width={80} height={80} style={{ marginBottom: 24, borderRadius: 12 }} />
        
        {/* Main Stat: Layoffs */}
        <div style={{ fontSize: 72, fontWeight: 800, color: "#ef4444", marginBottom: 8 }}>
          {formatNumber(company.total_layoffs)} laid off
        </div>
        
        {/* VS */}
        <div style={{ fontSize: 28, color: "#94a3b8", marginBottom: 8 }}>vs</div>
        
        {/* Main Stat: AI Spend */}
        <div style={{ fontSize: 72, fontWeight: 800, color: "#22c55e", marginBottom: 24 }}>
          ${company.total_investment}B AI spend
        </div>
        
        {/* URL + Tagline */}
        <div style={{ fontSize: 24, color: "#64748b", marginTop: 16 }}>
          ai-layoffs.com/{company.id} — Track the tradeoff
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
```

### Default/Fallback OG Image
```tsx
// src/app/opengraph-image.tsx (root — used when no specific card exists)
export default function DefaultOG() {
  return new ImageResponse(
    (
      <div style={{ background: "#0f172a", width: "100%", height: "100%", 
                    display: "flex", flexDirection: "column", 
                    justifyContent: "center", alignItems: "center", 
                    color: "white", fontFamily: "Inter" }}>
        <div style={{ fontSize: 64, fontWeight: 800 }}>AI-Layoffs Tracker</div>
        <div style={{ fontSize: 32, color: "#94a3b8", marginTop: 16 }}>
          Who's Firing & Spending on AI
        </div>
        <div style={{ fontSize: 24, color: "#64748b", marginTop: 24 }}>
          Updated daily · ai-layoffs.com
        </div>
      </div>
    )
  );
}
```

### OG Image Checklist for X
- [ ] Use `twitter:card = "summary_large_image"` (NOT "summary" — that crops to small)
- [ ] OG image is exactly **1200×630px** (X's preferred ratio)
- [ ] Text is large enough to read in timeline (min 40px for headlines, 24px for body)
- [ ] High contrast — dark backgrounds with bright stat colors work best on X
- [ ] Include the domain URL in the image (bottom/watermark) for brand recognition
- [ ] Include company logo for instant recognition
- [ ] OG image URL must be absolute (not relative) — prepend `https://ai-layoffs.com`
- [ ] Test with **Twitter Card Validator** before launch: https://cards-dev.twitter.com/validator
- [ ] Avoid thin fonts — stick to Inter, system-ui, or similar bold fonts
- [ ] No excessive text — 2-3 data points max per card

### Social Sharing Page (Optional Post-MVP)
A dedicated `/share/[slug]` page optimized for copying a ready-to-tweet stats card:
```
🤖 Meta laid off 11,000 employees
💰 Spent $145B on AI
📊 That's 76 layoffs per $1B of AI spend

ai-layoffs.com/meta
```

## 11. Deployment on Vercel

### Configuration
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ],
  "redirects": [
    { "source": "/home", "destination": "/", "permanent": true }
  ]
}
```

### Deployment Flow
1. **Push to `main`** → Vercel automatically builds and deploys
2. **Daily cron** (GitHub Actions) → runs `npm run update-data` → commits new data → triggers Vercel Deploy Hook
3. **Custom domain** → `ai-layoffs.com` in Vercel project settings → automatic SSL

### Vercel-Specific Optimizations
- [ ] Enable **ISR** (`revalidate: 86400`) on homepage for daily refresh without full rebuild
- [ ] Use **Edge Functions** for OG image generation (`runtime: "edge"`)
- [ ] Enable **Vercel Analytics** (free tier) for traffic insights
- [ ] Set up **Vercel Cron Jobs** as fallback if GitHub Actions fails (free: 1 cron per project)
- [ ] Configure **Vercel Preview Deployments** for PR review branches
- [ ] Set environment variables in Vercel dashboard (not in repo)

### Vercel Environment Variables
```
NEXT_PUBLIC_SITE_URL=https://ai-layoffs.com
NEXT_PUBLIC_GTM_ID=              # Google Tag Manager (optional)
```

## 12. Competitor Gap Analysis

| Competitor | What They Do | Our Gap / Advantage |
|------------|--------------|---------------------|
| **layoffs.fyi** | Tracks tech layoffs only (dates, headcount). | We **add AI investment** side‑by‑side, telling the "why" story. |
| **trueup.io** | Job openings + layoffs + some funding data. No direct comparison. | We focus exclusively on **layoff‑vs‑AI** narrative, not job boards. |
| **Crunchbase** | Startup funding database. | We connect **layoffs to investment**, not just funding. |
| **VisualCapitalist** | Occasional infographics, not daily. | We are a **live, filterable database** updated daily. |
| **News outlets** (CNBC, Bloomberg) | Articles with scattered numbers. | We aggregate into a **structured, queryable resource**. |

**Our differentiator:** A single‑page dashboard answering: *"Which companies are firing the most people while spending the most on AI?"* – backed by a clear, sharable metric.

## 13. Growth / Viral Strategy

- **SEO‑optimised pages:** Structured data (JSON‑LD), unique meta for each company, sitemap.xml. Target long‑tail keywords: *"Meta layoffs AI investment 2025"*, *"tech layoffs vs capex"*.
- **Dynamic OG images:** Every company detail page gets a custom social card with its key stats. Encourages sharing on Twitter, LinkedIn, Reddit.
- **"Wall of Shame" leaderboard:** Ranked list of companies with worst layoff‑per‑dollar‑spent ratios – highly shareable as screenshots.
- **Embeddable badge:** Small SVG/HTML widget: *"Meta: 11,000 laid off / $145B AI"* that journalists can embed in articles.
- **Open‑source data:** Host on GitHub; invite crowd‑sourced data contributions via pull requests.
- **Data journalism outreach:** Offer exclusive data access to tech/labor reporters.
- **Khmer/SEA localisation:** Consider a Khmer summary page (later) to engage local audience.

## 14. Monetization (If Viable)

*Not a priority for MVP.* Post‑launch options:  
- **Sponsorships:** Niche AI‑ethics or career‑coaching companies buy a banner.
- **Premium data export:** CSV/API access to historical data for researchers (one‑time fee or $10/mo).
- **Ethical job board:** Partner with companies that are hiring *despite* AI investment – featured listings.
- **Newsletter:** Paid weekly summary of the biggest layoff/AI moves.
- **Donations:** "Buy me a coffee" button for supporters.

## 15. Cost Estimates

| Item | Monthly | Annual |
|------|---------|--------|
| Domain (ai-layoffs.com) | — | $12 |
| Vercel Hosting (Hobby) | $0 | $0 |
| GitHub Actions (2,000 min/mo free) | $0 | $0 |
| News API (NewsAPI free tier) | $0 | $0 |
| Data collection labor (manual, ~2 hrs/week) | $800 (optional) | $9,600 (if outsourced) |
| **Total Minimum Startup Cost** | **$0/mo** | **$12** |

**Build cost:** ~2‑3 weeks of a full‑stack developer's time. If paid, $5,000–$10,000. If self‑built, opportunity cost only.

## 16. MVP Week‑by‑Week Breakdown (3 Weeks)

### **Week 1: Data Foundation & Static Shell**
- **Days 1‑2:** Init Next.js + Tailwind + TypeScript project. Set up GitHub repo with folder structure and basic linting.
- **Days 3‑4:** Define JSON schemas (`companies.json`, `events.json`) and create seed data for 20‑30 companies (use existing research).
- **Day 5:** Implement `lib/data.ts` to read JSON, compute totals and ratios. Build `page.tsx` rendering a **static table** (no interactivity).
- **Days 6‑7:** Create `CompanyTable` client component with **sortable columns** (use React state). Style with Tailwind. Add mobile card view (`CompanyCard`).

### **Week 2: Charts, Detail Pages & Filtering**
- **Days 1‑2:** Build `ComparisonChart` with Recharts (`ComposedChart`, dual axes) on homepage.
- **Day 3:** Dynamic route `/company/[slug]` – `generateStaticParams`, detail page layout, summary stats, and event timeline (`EventTimeline`).
- **Day 4:** Add `FilterBar` (sector dropdown) and search input. Wire up to table and chart.
- **Day 5:** Implement dynamic OG images using `@vercel/og` in `opengraph-image.tsx` — both company‑specific and default. Test with Twitter Card Validator.
- **Days 6‑7:** Polish UI (loading states, empty states). Set up **daily cron** GitHub Action that simply rebuilds and deploys (no data update yet). Write README.

### **Week 3: Deployment, Data Pipeline & Launch**
- **Days 1‑2:** Deploy to Vercel, configure custom domain. Full responsiveness QA on real devices. Verify all OG images render correctly on X/Twitter.
- **Day 3:** Build `scripts/collect-news.mjs` — scrapes Google News RSS, de-duplicates, outputs JSON. Create the Hermes cron job (one `cronjob create` command). Test manually with `cronjob run`.
- **Days 4‑5:** Manual data entry sprint – populate events for all tracked companies (ensure at least 50+ events). Validate with `validate-data.mjs`.
- **Day 6:** SEO polish (meta tags, `sitemap.xml`, `robots.txt`, JSON‑LD, canonical URLs, breadcrumbs). Add Plausible or Vercel Analytics.
- **Day 7:** **Launch.** Share on Twitter, LinkedIn, Hacker News, Reddit (`r/technology`, `r/dataisbeautiful`). Pitch to tech newsletters.

## 17. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **Scraping layoffs.fyi blocked / TOS violation** | Medium | High – no new layoff data | Use only official sources; manual curation fallback; explore layoffs.fyi API partnership. |
| **Data inaccuracies** | High | High – lose user trust | Require `source_url`; community error reporting via GitHub Issues; automated validation. |
| **Vercel free tier limits (bandwidth/build mins)** | Low | Medium – if viral | Monitor; upgrade to Pro ($20/mo) if needed. |
| **Legal / defamation claims** | Low | High | Only report publicly available data; attribute every figure; include disclaimer. |
| **Maintainer burnout (manual updates)** | Medium | Medium – stale data | Automate ASAP; grow open‑source contributor base. |
| **Competitor launches same idea** | Medium | Medium | First‑mover advantage; open‑source to build community loyalty. |
| **API / dependency breaking changes** | Low | Low | Pin dependency versions; use stable releases. |
| **OG images not loading on X** | Medium | High — no viral sharing | Test via Twitter Card Validator before launch; use absolute URLs; ensure Edge runtime works. |

## 18. Daily Automation via Hermes Agent Cron

Instead of GitHub Actions, the daily data update pipeline uses **Hermes Agent's built-in cron system**. This is superior because the agent can *reason* about fuzzy news data — extracting numbers, normalizing company names, and deciding confidence levels — rather than just executing a dumb script.

### Why Hermes Cron

| | GitHub Actions | Hermes Cron |
|---|---|---|
| Script execution | ✅ | ✅ |
| LLM reasoning on articles | ❌ Needs separate API | ✅ Agent IS the LLM |
| Fuzzy data extraction | ❌ Can't reason | ✅ Native extraction |
| Normalize company names | ❌ Needs mapping table | ✅ Agent understands context |
| Deliver report to user | ❌ Extra setup needed | ✅ Auto-delivered to Telegram |
| Setup complexity | Auth, secrets, YAML | One `cronjob create` command |

### Architecture

```
Daily Cron (Hermes) 6AM KL time
         │
         ▼
  ┌──────────────────────────────────┐
  │ SCRIPT (collect-news.mjs)        │
  │  → Scrapes Google News RSS       │
  │  → Fetches layoffs.fyi headers   │
  │  → Outputs JSON of candidates    │
  │  → stdout injected into agent    │
  └────────────┬─────────────────────┘
               │
               ▼
  ┌──────────────────────────────────┐
  │ HERMES AGENT (reasoning step)    │
  │  → Reads events.json (read_file) │
  │  → Deduplicates against existing │
  │  → Extracts: company, type,      │
  │    number, amount, date          │
  │  → Assigns confidence score      │
  │  → High-conf → writes to events  │
  │  → Medium-conf → pending.json    │
  │  → Git commit + push             │
  └────────────┬─────────────────────┘
               │
               ▼
       ┌──────────────┐
       │ Vercel Deploy │ (webhook triggered)
       └──────────────┘
               │
               ▼
       ┌──────────────┐
       │ Final Report  │ → delivered to Telegram DM
       └──────────────┘
```

### The Collection Script

```javascript
// scripts/collect-news.mjs
// Runs in ~5 seconds, outputs JSON to stdout
// Hermes cron injects this into the agent's context

import fetch from 'node-fetch';

const QUERIES = [
  'tech+layoffs',
  'AI+capex+billion',
  '"laid+off"+"artificial+intelligence"',
  'big+tech+AI+investment+announcement'
];

const candidates = [];

// Google News RSS (free, no auth)
for (const q of QUERIES) {
  const url = `https://news.google.com/rss/search?q=${q}&hl=en-US&ceid=US:en`;
  const res = await fetch(url);
  const xml = await res.text();
  
  const re = /<item>.*?<title>(.+?)<\/title>.*?<link>(.+?)<\/link>.*?<pubDate>(.+?)<\/pubDate>.*?<\/item>/gs;
  for (const [, title, link, date] of xml.matchAll(re)) {
    candidates.push({ title, url: link, date, source: 'google-news' });
  }
}

// De-dup by URL
const unique = candidates.filter((c, i, arr) => 
  arr.findIndex(x => x.url === c.url) === i
);

console.log(JSON.stringify(unique, null, 2));
```

### Hermes Cron Job Setup

```bash
# Create the cron job (one-time setup)
hermes cronjob create \
  --name "AI-Layoffs Daily Update" \
  --schedule "0 9 * * *" \
  --workdir /root/ai-layoffs-tracker \
  --script scripts/collect-news.mjs \
  --prompt "You are the AI-Layoffs Tracker data updater.

CONTEXT: The script output above contains candidate news articles about tech layoffs and AI investments.

YOUR TASK:
1. Read data/events.json to get existing events
2. For each candidate article, extract structured data:
   - company_name → normalize to match companies.json id (meta, google, microsoft, amazon, oracle, etc.)
   - type → 'layoff' or 'investment'
   - number → employees laid off (or null)
   - amount → AI spend in millions USD (or null)
   - date → YYYY-MM-DD
3. Confidence scoring:
   - >0.95: Numbers explicitly stated → ADD to events.json directly
   - 0.85-0.95: Mentioned but imprecise → ADD to data/pending.json for review
   - <0.85: Vague mention → SKIP
4. Write new events using the write_file or patch tool
5. Run: git add data/ && git commit -m 'data: daily update YYYY-MM-DD' && git push
6. Report: Summary of what was added (company, type, numbers) in your final response

Be conservative. Only add events when numbers are clear in the article."
  --enabled-toolsets '["terminal", "file"]'
```

### What the Cron Job Delivers Daily

You'll receive this report via Telegram (same chat) at 9 AM KL time:

```
📅 Daily Update — 2026-05-15
────────────────────────────
🔍 Scanned: 47 articles
🎯 Relevant: 12 candidates

✅ Auto-added (high confidence, >0.95):
  • Oracle: 30,000 laid off (source: inc.com)
  • Meta: $145B AI capex FY2025 (source: reuters.com)
  • Google: $75B AI infrastructure (source: bloomberg.com)

⏳ Queued for review (medium confidence, 0.85-0.95):
  • Amazon: layoffs reported (conf: 0.89)
  • Microsoft: AI spending rumored (conf: 0.87)

❌ Skipped: 7 (low confidence or duplicates)
────────────────────────────
🚀 Committed + pushed to main. Vercel deploying...
```

### Costs

| Component | Cost |
|-----------|------|
| Hermes cron system | Your existing LLM usage |
| `collect-news.mjs` | 0.1 seconds, free |
| Agent reasoning | ~2,000 tokens per run ($0.001-0.002) |
| **Total monthly** | **~$0.06** (30 runs) |

### Cron Management Commands

```bash
hermes cronjob list         # See the job
hermes cronjob run <job_id> # Trigger manually for testing
hermes cronjob pause <job_id>  # Pause updates
hermes cronjob remove <job_id> # Delete
```
