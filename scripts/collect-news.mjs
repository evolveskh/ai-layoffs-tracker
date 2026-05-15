// Google News RSS scraper for daily updates
// Usage: node scripts/collect-news.mjs
import { writeFileSync } from 'fs';

const QUERIES = [
  'tech+layoffs',
  'AI+capex+billion',
];

async function main() {
  const candidates = [];
  for (const q of QUERIES) {
    const res = await fetch(`https://news.google.com/rss/search?q=${q}&hl=en-US&ceid=US:en`);
    const xml = await res.text();
    const re = /<item>.*?<title>(.+?)<\/title>.*?<link>(.+?)<\/link>.*?<pubDate>(.+?)<\/pubDate>.*?<\/item>/gs;
    for (const [, title, link, date] of xml.matchAll(re)) {
      candidates.push({ title, url: link, date, source: 'google-news' });
    }
  }
  const unique = candidates.filter((c, i, arr) => arr.findIndex(x => x.url === c.url) === i);
  console.log(JSON.stringify(unique, null, 2));
}

main().catch(console.error);
