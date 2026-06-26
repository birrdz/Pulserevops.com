// Gap-fill REFILL — generates fresh, unique, real titles per pillar via DeepSeek
// (DeepSeek = all writing law), dedups against the LIVE index + the existing
// queue, and APPENDS {prefix,title,kind} to _gapfill_queue.json. Run when the
// queue is draining; the writer (_gapfill_run.js) skips already-written titles.
// Usage: node _gapfill_refill.js [--per=22]
const fs = require('fs');
const { dsChat } = require('./_ds_lib');
try { const e = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8'); for (const l of e.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (e) {}
const { getStore } = require('@netlify/blobs');
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const QFILE = 'C:/Users/koryj/website/_gapfill_queue.json';
const PER = parseInt((process.argv.find(a => a.startsWith('--per=')) || '--per=22').split('=')[1], 10) || 22;
const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();

// Biggest-gap pillars. kind 'top10' => Top-10 ranking shape (BEST OVERALL/VALUE
// pills); 'regular' => the pillar's own ruleset (Q&A / KPI / training / stack).
const PILLARS = [
  { p: 'q',  kind: 'regular', desc: 'B2B RevOps / sales / GTM questions framed around current 2027 events (AI in the funnel, vendor consolidation, longer sales cycles, buying committees). Each a single clear question.' },
  { p: 'cg', kind: 'regular', desc: 'sales coaching questions a front-line manager would ask their team. Each a single clear question.' },
  { p: 'st', kind: 'regular', desc: 'ready-to-run sales training session / team-meeting templates (one specific topic per title).' },
  { p: 'tk', kind: 'regular', desc: 'recommended software / tech stacks for a specific industry or role, titled like "The <X> Tech Stack for <Y> in 2027".' },
  { p: 'tl', kind: 'regular', desc: 'how-to and tool questions about RevOps tooling and fractional-CRO services. Each a single clear question.' },
  { p: 'ik', kind: 'top10',   desc: 'industry-specific revenue KPI lists, one industry per title, titled exactly "Top 10 <Industry> Revenue KPIs".' },
  { p: 'er', kind: 'top10',   desc: 'consumer electronics / product review rankings, titled "Top 10 <Product Category> in 2027 — Best Overall + Best Value".' },
  { p: 'sc', kind: 'top10',   desc: 'school / college rankings by US region or specialty, titled "Top 10 <Schools/Colleges> in <Place>".' },
  { p: 'dn', kind: 'top10',   desc: 'restaurant / dining rankings by US city, titled "Top 10 Places to Dine in <City>".' },
  { p: 'ca', kind: 'top10',   desc: 'car rankings by category or use-case, titled "Top 10 <Car Category> in 2027".' },
  { p: 'bt', kind: 'top10',   desc: 'boat rankings by category or use-case, titled "Top 10 <Boat Category> in 2027".' },
  { p: 'aq', kind: 'top10',   desc: 'aquarium gear, livestock, or setup rankings, titled "Top 10 <Aquarium Topic>".' },
  { p: 'co', kind: 'top10',   desc: 'collectibles rankings framed by a real decade/era with accurate years, titled "Top 10 <Collectible Category> of the <Decade>".' },
  { p: 'bs', kind: 'regular', desc: 'business / leadership book summaries, one real book per title, titled "<Real Book Title> by <Author>: Summary".' },
];

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const idx = await store.get('_index.json', { type: 'json' });
  const seen = new Set((idx.entries || []).map(e => norm(e.question)));
  const queue = JSON.parse(fs.readFileSync(QFILE, 'utf8'));
  for (const it of queue) seen.add(norm(it.title));

  // 🔒 PILLAR-BY-PILLAR (owner law): all writers work ONE pillar until closeout.
  // Active pillar = --pillar=<p> arg, else _current_pillar.txt, else all (legacy).
  const argP = (process.argv.find(a => a.startsWith('--pillar=')) || '').split('=')[1];
  let curP = argP;
  if (!curP) { try { curP = fs.readFileSync('C:/Users/koryj/website/_current_pillar.txt', 'utf8').trim(); } catch (e) {} }
  const ACTIVE = curP ? PILLARS.filter(x => x.p === curP) : PILLARS;
  if (curP) console.log(`[refill] PILLAR-BY-PILLAR active pillar = ${curP} (${ACTIVE.length} pillar def)`);

  let added = 0;
  for (const { p, kind, desc } of ACTIVE) {
    const ask = kind === 'top10'
      ? `Generate ${PER + 8} distinct, concrete, REAL "Top 10 ..." ranking titles about ${desc} Every title MUST start with "Top 10 ", be unique, specific, and reference real categories/places/products (no invented brands). Return ONLY a JSON array of strings.`
      : `Generate ${PER + 8} distinct, specific, search-worthy titles about ${desc} Each unique and concrete, NOT a "Top 10" list. Return ONLY a JSON array of strings.`;
    let arr = [];
    try {
      const r = await dsChat([{ role: 'user', content: ask }], { temperature: 0.95, max_tokens: 4000 });
      const m = r.content.match(/\[[\s\S]*\]/);
      arr = m ? JSON.parse(m[0]) : [];
    } catch (e) { console.log(`refill ${p} ERR ${e.message}`); continue; }
    let n = 0;
    for (const t of arr) {
      if (n >= PER) break;
      const title = String(t).trim();
      if (!title || seen.has(norm(title))) continue;
      seen.add(norm(title));
      queue.push({ prefix: p, title, kind });
      n++; added++;
    }
    console.log(`refill ${p}/${kind}: +${n}`);
  }
  fs.writeFileSync(QFILE, JSON.stringify(queue, null, 1));
  console.log(`DONE: appended ${added} titles; queue now ${queue.length}`);
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });
