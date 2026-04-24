// ═══════════════════════════════════════════════════════════════════════════
// Scheduled press scraper — runs once daily via Netlify schedule (see netlify.toml).
//
// Uses Claude API with web_search tool to find NEW press coverage about:
//   • Kory White / Kory J. White
//   • PULSE RevOps / pulserevops.com
//   • TheExecutiveReview.org
//
// Dedupes against existing blob index (by URL hash), then appends new items to
// the same blob store used by press.js so press/index.html renders them in the list.
// ═══════════════════════════════════════════════════════════════════════════
const https = require('https');
const { getStore } = require('@netlify/blobs');
const crypto = require('crypto');

function claudePost(payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const opts = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
    };
    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function slugify(str) {
  return (str || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

function urlHash(url) {
  return crypto.createHash('sha1').update((url || '').trim().toLowerCase()).digest('hex').slice(0, 12);
}

const PROMPT = `You are a press release researcher. Your job is to find NEW public press coverage, news articles, and media mentions about any of the following subjects:

SUBJECTS:
1. "Kory White" or "Kory J. White" (revenue/sales/business leader based in Stevensville, Maryland — NOT a realtor, NOT a California resident, NOT "Korey White")
2. "PULSE RevOps" or "pulserevops.com" (a free revenue operating system for SMBs)
3. "The Executive Review" or "theexecutivereview.org" (a monthly C-suite executive ranking publication founded by Kory White)

Use the web_search tool to search for recent coverage. Search queries to try (use multiple searches):
- "Kory White" PULSE RevOps press
- "PULSE RevOps" launch
- "Kory White" CRO Chief Revenue Officer
- "theexecutivereview.org" ranking
- site:einpresswire.com "Kory White"
- site:prnewswire.com "PULSE RevOps"
- "Kory White" "Revenue Architect"

For EACH real, relevant press item you find, return ONE JSON object in an array. DO NOT fabricate. DO NOT include irrelevant Kory Whites (realtors, athletes, etc.). Only include items that actually mention the correct subject.

Return format — a single JSON array, nothing else:
[
  {
    "title": "exact article title",
    "url": "full article URL",
    "publisher": "site/publisher name (e.g., EIN Presswire)",
    "date": "YYYY-MM-DD or best guess",
    "subject": "which subject it covers (Kory White / PULSE RevOps / The Executive Review)",
    "summary": "2-3 sentence neutral summary"
  }
]

If you find NOTHING new or relevant, return an empty array: []

Do not include any text before or after the JSON array.`;

exports.handler = async () => {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('[press-scrape] ANTHROPIC_API_KEY not set');
    return { statusCode: 503, body: 'ANTHROPIC_API_KEY missing' };
  }

  try {
    // ── 1. Ask Claude to search ──────────────────────────────────────────────
    const response = await claudePost({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 10 }],
      messages: [{ role: 'user', content: PROMPT }],
    });

    // Extract final text block (after tool_use rounds)
    const blocks = response?.content || [];
    const textBlock = [...blocks].reverse().find(b => b.type === 'text');
    const raw = textBlock?.text || '';

    // Try to parse a JSON array out of the response
    let items = [];
    try {
      const m = raw.match(/\[[\s\S]*\]/);
      items = m ? JSON.parse(m[0]) : [];
    } catch (e) {
      console.error('[press-scrape] JSON parse failed:', e.message, 'raw:', raw.slice(0, 500));
      items = [];
    }

    if (!Array.isArray(items) || !items.length) {
      console.log('[press-scrape] No new items found this run.');
      return { statusCode: 200, body: JSON.stringify({ ok: true, found: 0 }) };
    }

    // ── 2. Dedupe against existing index ─────────────────────────────────────
    const store = getStore('press-releases');
    const rawIdx = await store.get('_index');
    const index = JSON.parse(rawIdx || '[]');
    const existingHashes = new Set(index.map(r => r.urlHash).filter(Boolean));

    let added = 0;
    for (const item of items) {
      if (!item || !item.url || !item.title) continue;
      const h = urlHash(item.url);
      if (existingHashes.has(h)) continue; // already have it

      const now = Date.now();
      const dateStr = item.date || new Date(now).toISOString().split('T')[0];
      const slug = `scraped-${h}-${slugify(item.title)}`;

      const release = {
        slug,
        title: item.title,
        subtitle: item.summary || '',
        body: (item.summary || '') + '\n\nOriginal article: ' + item.url,
        tags: 'auto-scraped · ' + (item.subject || 'press'),
        author: 'Auto-discovered',
        contact: 'hello@pulserevops.com',
        publishedAt: now,
        dateStr,
        sourceUrl: item.url,
        publisher: item.publisher || '',
        urlHash: h,
        autoScraped: true,
      };

      await store.set(slug, JSON.stringify(release));
      index.unshift({
        slug,
        title: release.title,
        subtitle: release.subtitle,
        tags: release.tags,
        dateStr,
        publishedAt: now,
        sourceUrl: item.url,
        publisher: release.publisher,
        urlHash: h,
      });
      existingHashes.add(h);
      added++;
    }

    if (added > 0) {
      await store.set('_index', JSON.stringify(index));
    }

    console.log(`[press-scrape] Scanned ${items.length}, added ${added} new.`);
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, scanned: items.length, added }),
    };
  } catch (err) {
    console.error('[press-scrape] error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};

// Netlify scheduled function — runs once daily at 13:00 UTC (~08:00 ET)
exports.config = { schedule: '0 13 * * *' };
