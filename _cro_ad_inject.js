// _cro_ad_inject.js — inject the CRO Syndicate ad (5 red/white variations,
// randomly spread) into answer bodies via BLOBS (no deploy; only writes
// answers/<id>.json, never _index.json — zero clobber risk).
// Placement: Top-10 -> after numbered section #3 (before #4); regular Q&A -> ~30% by ## headings.
// Click targets: face/photo -> LinkedIn · name -> Calendly · Book button -> Calendly
//                "CRO Syndicate" -> crosyndicate.com · "1-page CRO profile" -> resume PDF
// Idempotent (skips bodies already containing class="cro-ad"); backs up original to entry.answer_pread.
//
// Usage:
//   node _cro_ad_inject.js --test <id>        inject one + verify live
//   node _cro_ad_inject.js --count 100        random N across pillars, one at a time, verify each
//   node _cro_ad_inject.js --remove <id>      restore original (un-inject) one entry
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });

const R = '#C8112B', RD = '#A50E23';
const LI = 'https://www.linkedin.com/in/korywhite';
const CAL = 'https://calendly.com/korywhiterevops';
const SYND = 'https://crosyndicate.com/';
const RESUME = '/assets/kory-white-cro-1page.pdf';
const PIC = '/assets/kory-white.jpg';
const F = "font-family:'Plus Jakarta Sans',system-ui,sans-serif;";
const WBTN = `background:#fff;color:${R};font-weight:800;text-decoration:none;border-radius:9px;`;
const WLINK = 'color:#fff;font-weight:800;text-decoration:underline;';
const EYE = 'font-size:11px;font-weight:800;letter-spacing:0.16em;text-transform:uppercase;color:rgba(255,255,255,0.85);';
const photoLink = (w, b) => `<a href="${LI}" target="_blank" rel="noopener" data-pulse-click="curator-photo" aria-label="Kory White on LinkedIn"><img src="${PIC}" alt="Kory White, Fractional CRO" loading="lazy" style="width:${w}px;height:${w}px;border-radius:50%;object-fit:cover;display:block;border:${b}px solid #fff;"></a>`;
const nameLink = `<a href="${CAL}" target="_blank" rel="noopener" data-pulse-click="hire-cro" style="${WLINK}">Kory White</a>`;
const syndLink = `<a href="${SYND}" target="_blank" rel="noopener" data-pulse-click="cro-syndicate" style="${WLINK}">CRO Syndicate</a>`;
const bookBtn = (pad, fs2, nowrap) => `<a href="${CAL}" target="_blank" rel="noopener" data-pulse-click="hire-cro" style="display:inline-block;${nowrap ? 'white-space:nowrap;' : ''}${WBTN}font-size:${fs2}px;padding:${pad};">Book a 20-minute call &rarr;</a>`;

const V = [];
V.push(`<aside class="cro-ad cro-ad-1" aria-label="Sponsored — Fractional CRO" style="display:flex;align-items:center;gap:16px;margin:30px 0;padding:18px 20px;border-radius:14px;background:${R};color:#fff;${F}"><div style="flex:0 0 auto;">${photoLink(74,2)}</div><div style="flex:1;min-width:0;"><div style="${EYE}margin-bottom:5px;">Sponsored &middot; Fractional CRO</div><div style="font-size:17px;font-weight:800;line-height:1.3;">Need a proven operator who has actually carried the number?</div><div style="font-size:14px;color:rgba(255,255,255,0.92);margin-top:4px;line-height:1.5;">${nameLink} &mdash; Fractional Chief Revenue Officer and proven revenue operator &mdash; takes a limited number of engagements through ${syndLink}.</div><div style="margin-top:10px;">${bookBtn('9px 18px',13.5,false)}</div></div></aside>`);
V.push(`<aside class="cro-ad cro-ad-2" aria-label="Sponsored — Fractional CRO" style="display:flex;align-items:center;gap:13px;margin:28px 0;padding:14px 17px;border-radius:10px;background:${R};color:#fff;${F}"><div style="flex:0 0 auto;">${photoLink(46,2)}</div><div style="font-size:14px;line-height:1.45;flex:1;">Hire a <strong>proven fractional CRO</strong> &mdash; skip the 9-month search. ${nameLink}, builder &amp; scaler, via ${syndLink}.</div>${bookBtn('8px 15px',13,true)}</aside>`);
V.push(`<aside class="cro-ad cro-ad-3" aria-label="Sponsored — Fractional CRO" style="margin:30px 0;padding:24px;border-radius:16px;background:${R};color:#fff;text-align:center;${F}"><div style="${EYE}margin-bottom:10px;">Sponsored &middot; CRO Syndicate</div><div style="font-size:18px;font-weight:700;line-height:1.45;max-width:560px;margin:0 auto;">&ldquo;The kind of operator who fixes a broken forecast in weeks instead of quarters.&rdquo;</div><div style="display:inline-flex;align-items:center;gap:10px;margin-top:14px;">${photoLink(40,2)}<span style="font-size:13.5px;text-align:left;">${nameLink}<br><span style="color:rgba(255,255,255,0.9);font-weight:700;">Proven Fractional CRO &middot; builder &amp; scaler</span></span></div><div style="margin-top:14px;">${bookBtn('9px 20px',13.5,false)}</div></aside>`);
V.push(`<aside class="cro-ad cro-ad-4" aria-label="Sponsored — Fractional CRO" style="margin:30px 0;padding:20px 22px;border-radius:14px;background:${R};color:#fff;border:1px solid ${RD};${F}"><div style="${EYE}margin-bottom:6px;">Sponsored &middot; Fractional CRO</div><div style="display:flex;align-items:center;gap:18px;flex-wrap:wrap;"><div style="flex:1;min-width:240px;"><div style="font-size:18px;font-weight:800;line-height:1.3;">Pipeline flat? Forecast you can&rsquo;t trust?</div><div style="font-size:14px;color:rgba(255,255,255,0.92);margin-top:4px;line-height:1.5;">Talk to ${nameLink} &mdash; a sitting-CRO operator and proven scaler &mdash; this week, via ${syndLink}. Engagements start in days, not months.</div></div>${bookBtn('11px 20px',13.5,true)}</div></aside>`);
V.push(`<aside class="cro-ad cro-ad-5" aria-label="Sponsored — Fractional CRO" style="display:flex;align-items:center;gap:16px;margin:30px 0;padding:18px 20px;border-radius:14px;background:${R};color:#fff;${F}"><div style="flex:1;min-width:0;"><div style="${EYE}margin-bottom:5px;">Sponsored &middot; Fractional CRO</div><div style="font-size:17px;font-weight:800;line-height:1.3;">A $0&ndash;$200M revenue builder, on your team part-time.</div><div style="font-size:14px;color:rgba(255,255,255,0.92);margin-top:4px;line-height:1.5;">${nameLink} &mdash; proven operator, builder &amp; scaler &mdash; available through ${syndLink}.</div><div style="margin-top:10px;display:flex;gap:10px;flex-wrap:wrap;"><a href="${RESUME}" target="_blank" rel="noopener" data-pulse-click="kory-resume" style="display:inline-block;border:1.5px solid #fff;color:#fff;font-weight:800;font-size:13px;padding:8px 15px;border-radius:9px;text-decoration:none;">&#128196; 1-page CRO profile</a>${bookBtn('9px 16px',13,false)}</div></div><div style="flex:0 0 auto;">${photoLink(74,2)}</div></aside>`);

const AD_MARK = 'class="cro-ad';

// Insert the ad block into a markdown body at the right spot.
function injectInto(body, vi) {
  const ad = '\n\n' + V[vi] + '\n\n';
  const lines = body.split('\n');
  // numbered tool sections: "## 3. Recurly", "## 4. Zuora", ...
  const numbered = [];
  lines.forEach((ln, i) => { const m = ln.match(/^##\s+(\d+)\.\s/); if (m) numbered.push({ i, n: +m[1] }); });
  if (numbered.length >= 4) {
    // before the 4th tool (prefer the one literally numbered 4, else the 4th in order)
    const four = numbered.find(x => x.n === 4) || numbered[3];
    lines.splice(four.i, 0, ad);
    return { body: lines.join('\n'), mode: 'top10-after-3' };
  }
  // regular Q&A: all H2 headings, insert ~30% down
  const heads = [];
  lines.forEach((ln, i) => { if (/^##\s+/.test(ln)) heads.push(i); });
  if (heads.length >= 2) {
    const idx = Math.max(1, Math.round(0.3 * heads.length));
    lines.splice(heads[Math.min(idx, heads.length - 1)], 0, ad);
    return { body: lines.join('\n'), mode: `qa-30pct(h${idx}/${heads.length})` };
  }
  // fallback: ~30% through paragraphs
  const paras = body.split(/\n\n+/);
  const at = Math.max(1, Math.round(0.3 * paras.length));
  paras.splice(at, 0, V[vi]);
  return { body: paras.join('\n\n'), mode: `qa-para(${at}/${paras.length})` };
}

async function verifyLive(id) {
  const u = `https://pulserevops.com/.netlify/functions/pulse-machine-entry?id=${encodeURIComponent(id)}`;
  for (let t = 0; t < 2; t++) {
    try {
      const r = await fetch(u, { headers: { 'cache-control': 'no-cache' } });
      const h = await r.text();
      if (h.includes(AD_MARK)) return true;
    } catch (e) {}
    await new Promise(z => setTimeout(z, 1500));
  }
  return false;
}

async function injectOne(id, vi) {
  const e = await store.get(`answers/${id}.json`, { type: 'json' });
  if (!e || !e.answer) return { id, ok: false, why: 'no-answer-blob' };
  if (e.answer.includes(AD_MARK)) return { id, ok: true, skipped: 'already-has-ad' };
  const variation = (typeof vi === 'number') ? vi : Math.floor(Math.random() * V.length);
  const { body, mode } = injectInto(e.answer, variation);
  if (e.answer_pread == null) e.answer_pread = e.answer; // backup once
  e.answer = body;
  e.cro_ad = variation + 1;
  e.cro_ad_at = Date.now();
  await store.setJSON(`answers/${id}.json`, e);
  const live = await verifyLive(id);
  return { id, ok: true, variation: variation + 1, mode, verified: live };
}

async function removeOne(id) {
  const e = await store.get(`answers/${id}.json`, { type: 'json' });
  if (!e) return { id, ok: false, why: 'no-blob' };
  if (e.answer_pread == null) return { id, ok: false, why: 'no-backup' };
  e.answer = e.answer_pread; delete e.answer_pread; delete e.cro_ad; delete e.cro_ad_at;
  await store.setJSON(`answers/${id}.json`, e);
  return { id, ok: true, restored: true };
}

(async () => {
  const args = process.argv.slice(2);
  if (args[0] === '--test') {
    console.log(JSON.stringify(await injectOne(args[1], args[2] != null ? +args[2] : undefined)));
    return;
  }
  if (args[0] === '--remove') { console.log(JSON.stringify(await removeOne(args[1]))); return; }
  if (args[0] === '--count') {
    const N = +args[1] || 100;
    const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
    // eligible: real entries, skip the CRO ad landing pages (tl9001-9110)
    let pool = idx.entries.map(e => e && e.id).filter(Boolean)
      .filter(id => !/^tl90\d\d$|^tl91\d\d$/.test(id));
    // shuffle (Fisher-Yates) for random spread across pillars
    for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
    let done = 0, verified = 0, skipped = 0, failed = 0; const byVar = {};
    for (const id of pool) {
      if (done >= N) break;
      let res;
      try { res = await injectOne(id); } catch (e) { res = { id, ok: false, why: e.message }; }
      if (res.skipped) { skipped++; continue; }
      if (!res.ok) { failed++; console.log('FAIL', JSON.stringify(res)); continue; }
      done++; if (res.verified) verified++; byVar[res.variation] = (byVar[res.variation] || 0) + 1;
      console.log(`[${done}/${N}] ${id} v${res.variation} ${res.mode} ${res.verified ? 'LIVE✓' : 'live?'}`);
    }
    console.log(JSON.stringify({ summary: true, done, verified, skipped, failed, byVar }));
    return;
  }
  console.log('usage: --test <id> [vi] | --count N | --remove <id>');
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
