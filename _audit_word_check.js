// Deep audit: fetch rendered HTML for each entry in last 24h and parse
// word count + structure checks. Throttled to ~30 req/min to stay well
// under the 60/min rate limit.
const fs = require('fs');
const https = require('https');

const SITE = 'pulserevops.com';
const RECENT = JSON.parse(fs.readFileSync('C:/Users/koryj/website/_audit_recent.json','utf8'));

const ROUTES = {
  ik: '/industry-kpis/',
  q:  '/knowledge/',
  vq: '/knowledge/',
  st: '/sales-trainings/',
  bs: '/sales-book-summaries/',
  tk: '/tech-stacks/',
  gb: '/graphics/',
};

const FLOORS = {
  ik: { fail: 1200, severe: 800,  target: 1500, label: 'Industry KPIs' },
  q:  { fail: 1000, severe: 700,  target: 1200, label: 'Knowledge Q&A' },
  vq: { fail: 1000, severe: 700,  target: 1200, label: 'Visitor Q&A' },
  st: { fail: 1000, severe: 700,  target: 1200, label: 'Sales Trainings' },
  bs: { fail: 1200, severe: 800,  target: 1500, label: 'Book Summaries' },
  tk: { fail: 1000, severe: 700,  target: 1200, label: 'Tech Stacks' },
  // graphics aren't a text pillar — skip word count, structural only
};

function get(path) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: SITE,
      path,
      method: 'GET',
      headers: { 'user-agent': 'pulse-audit-bot/1.0', 'accept': 'text/html' },
    }, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    req.setTimeout(20000, () => { req.destroy(new Error('timeout')); });
    req.end();
  });
}

function getArticle(html) {
  const m = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  return m ? m[1] : '';
}
function stripTags(s) {
  return s
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'")
    .replace(/&[a-z]+;/gi, ' ');
}

function audit(id, html) {
  // Page-reported answer word count (most accurate — counts raw markdown body)
  const wm = html.match(/📖[^<]*?([0-9,]+)\s*words/);
  const reportedWords = wm ? parseInt(wm[1].replace(/,/g,''), 10) : null;

  const article = getArticle(html);
  const h2s = (article.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi) || [])
    .map(s => stripTags(s).trim()).filter(Boolean);

  // Mermaid blocks (rendered as <pre class="mermaid"> or <div class="mermaid">)
  const mermaidCount = (article.match(/class=["'][^"']*\bmermaid\b/gi) || []).length;

  // Structural section presence (case-insensitive H2 text match)
  const h2text = h2s.join(' | ').toLowerCase();
  const has = {
    faq:        /\bfaq\b|frequently asked/.test(h2text),
    bottomLine: /bottom line/.test(h2text),
    sources:    /\bsources\b|references/.test(h2text),
    directAnswer: /direct answer/i.test(article) || /direct answer/i.test(html.slice(0, 30000)),
  };

  return {
    id,
    reportedWords,
    h2Count: h2s.length,
    h2s,
    mermaidCount,
    has,
  };
}

async function main() {
  const allPrefixes = ['ik','q','vq','st','bs','tk','gb'];
  const work = [];
  for (const pfx of allPrefixes) {
    const ids = RECENT[pfx] || [];
    const route = ROUTES[pfx];
    if (!route) continue;
    for (const id of ids) work.push({ pfx, id, path: route + id });
  }
  console.log('Total to fetch:', work.length);

  const results = [];
  const failures = [];
  // Throttle: ~1.5s between calls = 40/min, well under 60/min limit
  const DELAY = 1500;
  let i = 0;
  for (const item of work) {
    i++;
    try {
      const r = await get(item.path);
      if (r.status !== 200) {
        failures.push({ id: item.id, status: r.status });
        if (r.status === 429) {
          console.log('rate limited, backing off 60s');
          await new Promise(rs => setTimeout(rs, 60000));
        }
      } else {
        const a = audit(item.id, r.body);
        a.pfx = item.pfx;
        results.push(a);
      }
    } catch (e) {
      failures.push({ id: item.id, error: e.message });
    }
    if (i % 25 === 0) console.log('progress', i, '/', work.length);
    await new Promise(rs => setTimeout(rs, DELAY));
  }
  fs.writeFileSync('C:/Users/koryj/website/_audit_results.json', JSON.stringify({ results, failures }, null, 2));
  console.log('done. results:', results.length, 'failures:', failures.length);
}
main();
