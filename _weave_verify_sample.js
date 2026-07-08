// _weave_verify_sample.js — independent spot-check of the LATEST-11 weaves + above-fold CRO card.
// Samples N entries per pillar prefix from the live blob and checks for:
//   <!--pillar-weave-->  (every non-tl pillar)   |  <!--cro-weave-->  (tl)   |  class="cro-ad" + above-fold position
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });

const PER = parseInt(process.env.PER || '12', 10);

function pfx(key) { const id = String(key).split('/').pop(); const m = id.match(/^([a-z]+)/); return m ? m[1] : '?'; }
// above-fold = the cro-ad appears before the first content H2 after Direct Answer (i.e. early in body)
function aboveFold(body) {
  const i = body.indexOf('class="cro-ad');
  if (i < 0) return false;
  // find first "## " H2 that's NOT Direct Answer
  const da = body.search(/##\s*Direct Answer/i);
  // position of card relative to total — above-fold if within first 35% of body OR right after Direct Answer
  return i > 0 && i < Math.max(1500, body.length * 0.35);
}

(async () => {
  const { blobs } = await store.list();
  const byP = {};
  for (const b of blobs) { if (!String(b.key).startsWith('answers/')) continue; const p = pfx(b.key); (byP[p] = byP[p] || []).push(b.key); }
  const prefixes = Object.keys(byP).sort((a, b) => byP[a].length - byP[b].length);
  console.log(`total blobs ${blobs.length} across ${prefixes.length} prefixes\n`);
  console.log('pfx    n     sampled  weave%  croCard%  aboveFold%');
  let agg = { s: 0, w: 0, c: 0, af: 0 };
  for (const p of prefixes) {
    const keys = byP[p];
    // evenly spaced sample
    const step = Math.max(1, Math.floor(keys.length / PER));
    const pick = [];
    for (let i = 0; i < keys.length && pick.length < PER; i += step) pick.push(keys[i]);
    let s = 0, w = 0, c = 0, af = 0;
    const wantMark = p === 'tl' ? '<!--cro-weave-->' : '<!--pillar-weave-->';
    for (const k of pick) {
      let e; try { e = await store.get(k, { type: 'json' }); } catch { continue; }
      if (!e || !e.answer) continue;
      const body = String(e.answer); s++;
      if (body.includes(wantMark) || body.includes('## Related on PULSE')) w++;
      const hasCard = body.includes('class="cro-ad');
      if (hasCard) c++;
      if (hasCard && aboveFold(body)) af++;
    }
    agg.s += s; agg.w += w; agg.c += c; agg.af += af;
    const pct = (x) => s ? Math.round(100 * x / s) + '%' : '-';
    console.log(`${p.padEnd(6)} ${String(keys.length).padEnd(5)} ${String(s).padEnd(8)} ${pct(w).padEnd(7)} ${pct(c).padEnd(9)} ${pct(af)}`);
  }
  const A = (x) => agg.s ? Math.round(100 * x / agg.s) + '%' : '-';
  console.log(`\nSAMPLED ${agg.s} entries — weave ${A(agg.w)} · CRO card ${A(agg.c)} · above-fold ${A(agg.af)}`);
})();
