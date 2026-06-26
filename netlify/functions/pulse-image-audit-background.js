// pulse-image-audit-background — continuous, $0 image-context auditor. Walks the
// whole catalog on a rolling cursor; for each entry it extracts the item image
// URLs and flags any that come from stock/illustration/marketplace hosts (the
// "Womb → fetus", "The Seoul Summit → eBay coin" class). Progress is written to
// _img_audit_progress.json and surfaced in the 15-min heartbeat. No LLM, no
// vision — heuristic (domain/path) only; catches the high-confidence offenders.
// When a full pass finishes it loops for continuous re-auditing.
const { getStore } = require('@netlify/blobs');
let isJunkImageUrl = () => false;
try { ({ isJunkImageUrl } = require('../../_img_query')); } catch (e) {}

const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const BATCH = 150;
const CHROME_RX = /pulse-og|kory-white|-logo\.|pulse-mark|cro-syndicate|icon-\d|apple-touch/i;

function store() {
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  return tok ? getStore({ name: 'pulse-machine-library', siteID: SITE, token: tok }) : getStore('pulse-machine-library');
}

exports.handler = async () => {
  const s = store();
  const idx = (await s.get('_index.json', { type: 'json' }).catch(() => null)) || { entries: [] };
  const ids = (idx.entries || []).filter((e) => e && e.id).map((e) => e.id);
  const total = ids.length;

  let p = (await s.get('_img_audit_progress.json', { type: 'json' }).catch(() => null)) || null;
  if (!p || typeof p.cursor !== 'number' || p.cursor >= total) {
    // start a fresh pass (first run, or the previous pass completed → re-audit)
    p = { cursor: 0, flagged: 0, flagged_ids: [], total, pass: (p && p.pass ? p.pass + 1 : 1), started_at: Date.now() };
  }

  const slice = ids.slice(p.cursor, p.cursor + BATCH);
  for (const id of slice) {
    const rec = await s.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
    if (rec) {
      const urls = (JSON.stringify(rec).match(/https?:\/\/[^"'\s)]+\.(?:jpg|jpeg|png|webp)/gi) || [])
        .filter((u) => !CHROME_RX.test(u));
      if (urls.some(isJunkImageUrl)) {
        p.flagged++;
        if (p.flagged_ids.length < 300) p.flagged_ids.push(id);
      }
    }
  }
  p.cursor += slice.length;
  p.total = total;
  p.updated_at = Date.now();
  if (p.cursor >= total) p.last_pass_completed_at = Date.now();
  await s.setJSON('_img_audit_progress.json', p);

  return { statusCode: 200, body: JSON.stringify({ ok: true, cursor: p.cursor, total, flagged: p.flagged, pass: p.pass }) };
};
