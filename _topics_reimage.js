// _topics_reimage.js — replace the homepage topic-band images (/assets/topics/<slug>.jpg) with the
// best relevant real image (Pexels library) or a generated one (Pollinator), graded BRIGHT & CHEERFUL
// via the updated _gp_grade.js. One at a time. Resume-safe (skips slugs already done this run).
'use strict';
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
try { for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (e) {}
const { grade } = require('./_gp_grade.js');
const PEXELS = process.env.PEXELS_API_KEY || '';
const PTOK = process.env.POLLINATOR_API_KEY || process.env.POLLINATIONS_TOKEN || process.env.POLLINATIONS_API_KEY || '';
const OUT = WD + '/assets/topics';
try { fs.mkdirSync(OUT, { recursive: true }); } catch (e) {}
const sleep = ms => new Promise(r => setTimeout(r, ms));
const W = 1280, H = 520;   // wide banner (bands are full-bleed strips)

// slug -> Pexels query (best relevant real photo). Pollinator prompt derives from the same words.
const TOPICS = [
  ['go-to-market-playbooks', 'business strategy team meeting bright office'],
  ['industry-kpis', 'analytics dashboard data charts screen'],
  ['revenue-architecture', 'modern glass office building sunny'],
  ['tech-stacks', 'software developer workspace computers'],
  ['sales-trainings', 'business conference presentation audience'],
  ['sales-book-summaries', 'open books bright library reading'],
  ['coaching', 'business coaching handshake meeting'],
  ['tools', 'laptop workspace desk productivity bright'],
  ['software', 'programming code screen developer'],
  ['ai-infrastructure', 'data center servers technology blue'],
  ['current-events', 'busy newsroom journalists city daylight'],
  ['franchises', 'bright storefront restaurant business'],
  ['estates', 'luxury mansion real estate sunny'],
  ['buildouts', 'modern commercial interior construction'],
  ['contracts', 'signing business contract handshake'],
  ['cars', 'sports car sunny road'],
  ['boats', 'luxury yacht ocean blue sky'],
  ['electronic-reviews', 'consumer electronics gadgets bright'],
  ['telco', 'cell tower telecommunications blue sky'],
  ['graphics', 'colorful abstract design bright'],
  ['aquariums', 'vibrant coral reef aquarium fish'],
  ['collectibles', 'vintage collectibles display bright'],
  ['pets', 'happy golden retriever dog sunny'],
  ['style', 'fashion style bright colorful clothing'],
  ['wellness', 'yoga wellness sunrise nature bright'],
  ['drills', 'athletes training practice sunny field'],
  ['travel', 'tropical beach travel turquoise'],
  ['resorts', 'luxury resort pool tropical sunny'],
  ['dining', 'fine dining restaurant colorful food'],
  ['clubs', 'golf country club green sunny'],
  ['nightlife', 'vibrant nightclub colorful lights'],
  ['events', 'festive event celebration crowd bright'],
  ['towns', 'charming colorful town street sunny'],
  ['living', 'bright modern living room home'],
  ['movies', 'cinema movie theater colorful'],
  ['gaming', 'esports gaming setup vibrant neon'],
  ['media', 'media studio camera production bright'],
  ['speeches', 'public speaking stage bright audience'],
  ['sports', 'stadium sports action bright'],
  ['highschool-football-recruiting', 'american football stadium sunny'],
];

async function pexelsBest(query) {
  if (!PEXELS) return null;
  try {
    const q = encodeURIComponent(query.split(/\s+/).slice(0, 5).join(' '));
    const r = await fetch('https://api.pexels.com/v1/search?query=' + q + '&per_page=15&orientation=landscape', { headers: { Authorization: PEXELS }, signal: AbortSignal.timeout(30000) });
    if (!r.ok) return null;
    const photos = ((await r.json()).photos || []).filter(p => p.width >= 1200).sort((a, b) => (b.width * b.height) - (a.width * a.height));
    if (!photos.length) return null;
    const url = photos[0].src && (photos[0].src.large2x || photos[0].src.large || photos[0].src.original);
    const ir = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (!ir.ok) return null;
    const b = Buffer.from(await ir.arrayBuffer());
    return b.length > 3000 ? b : null;
  } catch (e) { return null; }
}
async function pollinate(query, seed) {
  const prompt = 'bright cheerful vivid professional photograph of ' + query + ', high quality, colorful, sharp, sunny, no text, no watermark, no logo';
  const url = 'https://image.pollinations.ai/prompt/' + encodeURIComponent(prompt) + '?width=' + W + '&height=' + H + '&nologo=true&model=flux&seed=' + (seed % 1000000);
  for (let a = 0; a < 4; a++) {
    try {
      const r = await fetch(url, { headers: PTOK ? { Authorization: 'Bearer ' + PTOK } : {}, signal: AbortSignal.timeout(120000) });
      if (r.ok && (r.headers.get('content-type') || '').startsWith('image')) { const b = Buffer.from(await r.arrayBuffer()); if (b.length > 3000) return b; }
    } catch (e) {}
    await sleep(3000 * (a + 1));
  }
  return null;
}

(async () => {
  const only = process.argv[2];   // optional single slug for testing
  const list = only ? TOPICS.filter(t => t[0] === only) : TOPICS;
  let done = 0, pex = 0, poll = 0, miss = 0;
  for (let i = 0; i < list.length; i++) {
    const [slug, query] = list[i];
    let buf = await pexelsBest(query), src = 'pexels';
    if (!buf) { buf = await pollinate(query, (i + 1) * 7919); src = 'pollinator'; }
    if (!buf) { console.log('MISS ' + slug); miss++; continue; }
    await grade(buf, OUT + '/' + slug + '.jpg', { w: W, h: H, pass: 0 });
    if (src === 'pexels') pex++; else poll++;
    done++;
    console.log('[topics] ' + (i + 1) + '/' + list.length + '  ' + slug + '  <- ' + src);
    await sleep(2500);
  }
  console.log('[topics] DONE  updated=' + done + '  pexels=' + pex + '  pollinator=' + poll + '  miss=' + miss);
})().catch(e => { console.error('FATAL', e && e.message); process.exit(1); });
