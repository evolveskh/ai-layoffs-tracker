// Reliable RSS-based news collector for AI-Layoffs Tracker
// Uses direct RSS feeds from Tier 1-2 outlets (no API keys needed)
// Sources verified working from this server: Bloomberg, TechCrunch

// RSS feeds by tier
const RSS_FEEDS = [
  // Tier 1
  { url: 'https://feeds.bloomberg.com/technology/news.rss', tier: 1, name: 'bloomberg' },
  { url: 'https://feeds.bloomberg.com/news.rss', tier: 1, name: 'bloomberg-news' },
  
  // Tier 2
  { url: 'https://techcrunch.com/feed/', tier: 2, name: 'techcrunch' },
  { url: 'https://www.theverge.com/rss/index.xml', tier: 2, name: 'verge' },
  { url: 'https://arstechnica.com/feed/', tier: 2, name: 'ars' },
  { url: 'https://www.wired.com/feed/rss', tier: 2, name: 'wired' },
  
  // Tier 3 - Company IR (checked separately)
];

// Keywords to filter for relevant articles
const LAYOFF_KEYWORDS = ['layoff', 'layoffs', 'laid off', 'cuts', 'jobs', 'workforce', 'reduction', 'firing', 'fired'];
const AI_KEYWORDS = ['AI', 'artificial intelligence', 'capex', 'investment', 'spending', 'billion', 'data center', 'infrastructure', 'compute'];

function isRelevant(title) {
  const t = title.toLowerCase();
  const hasLayoff = LAYOFF_KEYWORDS.some(k => t.includes(k.toLowerCase()));
  const hasAI = AI_KEYWORDS.some(k => t.includes(k.toLowerCase()));
  // Article is relevant if it mentions layoffs OR (AI + major company)
  return hasLayoff || hasAI;
}

function extractCompany(title) {
  const t = title.toLowerCase();
  const companies = {
    meta: 'meta',
    facebook: 'meta',
    google: 'google',
    alphabet: 'google',
    amazon: 'amazon',
    microsoft: 'microsoft',
    apple: 'apple',
    nvidia: 'nvidia',
    oracle: 'oracle',
    intel: 'intel',
    tesla: 'tesla',
    dell: 'dell',
    ibm: 'ibm',
    sap: 'sap',
    cisco: 'cisco',
    salesforce: 'salesforce',
    paypal: 'paypal',
    shopify: 'shopify',
    spotify: 'spotify',
    uber: 'uber',
    lyft: 'lyft',
    twitter: 'twitter',
    'x corp': 'twitter',
    snap: 'snap',
    snapchat: 'snap',
    netflix: 'netflix',
  };
  for (const [key, id] of Object.entries(companies)) {
    if (t.includes(key)) return id;
  }
  return null;
}

async function fetchRSS(feed) {
  try {
    const res = await fetch(feed.url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AI-NewsBot/1.0)' },
      signal: AbortSignal.timeout(15000)
    });
    if (!res.ok) return { feed: feed.name, error: `HTTP ${res.status}` };
    
    const xml = await res.text();
    const items = [];
    const re = /<item>[\s\S]*?<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>[\s\S]*?<link>(.*?)<\/link>[\s\S]*?<pubDate>(.*?)<\/pubDate>[\s\S]*?<\/item>/g;
    
    let match;
    while ((match = re.exec(xml)) !== null) {
      const [, title, link, date] = match;
      const cleanTitle = title.replace(/<!\[CDATA\[|\]\]>/g, '').trim();
      if (isRelevant(cleanTitle)) {
        items.push({
          title: cleanTitle,
          url: link.trim(),
          date: date.trim(),
          source_domain: feed.name,
          source_tier: feed.tier,
          company_hint: extractCompany(cleanTitle),
          accepted: true
        });
      }
    }
    return { feed: feed.name, items };
  } catch (e) {
    return { feed: feed.name, error: e.message };
  }
}

async function main() {
  const results = await Promise.all(RSS_FEEDS.map(fetchRSS));
  
  const allItems = [];
  const feedStatus = [];
  
  for (const r of results) {
    if (r.error) {
      feedStatus.push({ feed: r.feed, status: 'error', error: r.error });
    } else {
      feedStatus.push({ feed: r.feed, status: 'ok', articles: r.items.length });
      allItems.push(...r.items);
    }
  }
  
  // Deduplicate by URL
  const seen = new Set();
  const unique = [];
  for (const item of allItems) {
    if (!seen.has(item.url)) {
      seen.add(item.url);
      unique.push(item);
    }
  }
  
  // Sort by tier (Tier 1 first)
  unique.sort((a, b) => a.source_tier - b.source_tier);
  
  console.log(JSON.stringify({
    total_relevant: unique.length,
    feeds_checked: RSS_FEEDS.length,
    feed_status: feedStatus,
    articles: unique
  }, null, 2));
}

main().catch(console.error);
