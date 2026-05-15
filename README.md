# 🤖 AI-Layoffs Tracker

[**ai-layoffs-tracker-gamma.vercel.app**](https://ai-layoffs-tracker-gamma.vercel.app)

Track which tech companies are firing thousands while spending billions on AI — side-by-side dashboard updated daily.

## Live
**https://ai-layoffs-tracker-gamma.vercel.app**

## Features
- 22+ tech companies tracked (Meta, Google, Amazon, Microsoft, Oracle, Apple, Nvidia, and more)
- Layoffs vs AI investment side-by-side comparison
- Sortable table + dual-axis chart
- Detailed per-company timeline with sources
- SEO-optimized with dynamic OG images for X/Twitter
- Auto-updated daily via Hermes Agent cron

## Tech Stack
- Next.js 16 + TypeScript
- Tailwind CSS v4
- Recharts
- @vercel/og (dynamic social cards)
- Deployed on Vercel

## Data
```bash
data/companies.json  # Company metadata (22 companies)
data/events.json     # Layoff + investment events (60+ events)
```

## Dev

```bash
npm install
npm run dev     # localhost:3000
npm run build   # production build
```

## Deploy

```bash
vercel --prod
```

## Daily Update

The [collect-news.mjs](scripts/collect-news.mjs) script scrapes Google News RSS for tech layoff and AI investment headlines. A Hermes Agent cron job runs daily at 9AM KL time, extracts structured data, and auto-publishes high-confidence events.

## License

MIT
