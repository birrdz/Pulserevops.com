// Live campaign-progress JSON for the on-site dashboard widget.
// GET /.netlify/functions/pulse-progress  → { target, written, imgDone, pending, visits, pillars[] }
const { getStore } = require('@netlify/blobs');
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const BASELINE = 19851, TARGET = 8730;
const PILLAR = {
  q:['Knowledge',7318,1400], fr:['Franchises',980,1175], er:['Electronics',626,720], ik:['Industry KPIs',536,559],
  sc:['Schools',324,556], tk:['Tech Stacks',436,384], tl:['Tools/CRO',891,380], cg:['Coaching',593,294],
  st:['Sales Trainings',730,275], pt:['Pets',168,242], bs:['Book Summaries',309,236], aq:['Aquariums',450,216],
  bt:['Boats',400,216], ca:['Cars',973,200], ra:['Revenue Arch',530,180], gb:['Graphics',545,167],
  bo:['Buildouts',235,135], ai:['AI Infra',200,130], ev:['Event Venues',100,130], nl:['Nightlife',179,121],
  dn:['Dining',183,107], sw:['Software',95,105], sk:['Skill Drills',100,100], gp:['GTM Playbooks',398,100],
  hf:['NIL/HS',62,90], tn:['Towns',141,89], co:['Collectibles',74,76], es:['Home Builders',193,67],
  sy:['Style',100,65], mv:['Movies',51,64], tv:['Travel',281,60], gm:['Games',63,57], lv:['Retire',117,50],
  sp:['Speeches',100,50], wl:['Wellness',65,45], cl:['Clubs',50,40], ga:['Wedding Venues',50,30],
};
exports.handler = async () => {
  try {
    const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
    const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: tok });
    const idx = await store.get('_index.json', { type: 'json' });
    // NET-NEW GAP-FILL ONLY (2026-06-26): exclude cross-pillar copies (they carry
    // copied_from/mirror_of) so the bar doesn't conflate pillar-to-pillar copies with
    // new gap-fill Q&As. Count non-copy entries per pillar above that pillar's baseline.
    const cur = {};
    for (const e of idx.entries) {
      if (!e || !e.id || e.copied_from || e.mirror_of) continue;
      const m = String(e.id).match(/^([a-z]+)/);
      if (m) cur[m[1]] = (cur[m[1]] || 0) + 1;
    }
    const pillars = Object.entries(PILLAR).map(([p, [name, base, gap]]) => ({ p, name, written: Math.max(0, (cur[p] || 0) - base), gap }))
      .filter(x => x.written > 0).sort((a, b) => b.written - a.written);
    const W = pillars.reduce((a, x) => a + x.written, 0);
    const P = idx.entries.filter(e => e && e.images_pending && !e.copied_from).length;
    const imgDone = Math.max(0, W - P);
    let visits = 0, clicks = 0;
    try { const d = await require('./_stats').readDaily(); visits = d.views || 0; clicks = d.clicks || 0; } catch (e) {}
    return { statusCode: 200, headers: { 'content-type': 'application/json', 'cache-control': 'no-store', 'access-control-allow-origin': '*' },
      body: JSON.stringify({ target: TARGET, written: W, imgDone, pending: P, visits, clicks, total: idx.entries.length, pillars }) };
  } catch (e) {
    return { statusCode: 200, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ error: String(e.message || e), target: TARGET, written: 0 }) };
  }
};
