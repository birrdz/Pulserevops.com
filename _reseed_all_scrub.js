// _reseed_all_scrub — put the WHOLE Q&A population back in the scrubber (owner 4444). Only ~1% are
// truly 12/13; the rest are legacy /10. Writes every catalog id into the scrub queue so scrub-auto
// works the entire library up to a true 12/13. cc_signed (already certified) go LAST so the unproven
// ones get worked first.
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const QUEUE = WD + '/_scrub_button_queue.json';

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const es = (idx.entries || []).filter(e => e && e.id && /^[a-z]{2,3}\d/.test(e.id) && !/\bdemo\b|standing desk|\btest entry\b/i.test(String(e.question || '')));
  // unproven first (score < 12 or no cc sign-off), certified last
  const unproven = [], certified = [];
  for (const e of es) {
    const certed = e.cc_signed || (typeof e.quality_score === 'number' && e.quality_score >= 12 && e.format_v);
    (certed ? certified : unproven).push(e.id);
  }
  // keep whatever is already queued at the very front (don't disrupt in-flight)
  let existing = []; try { existing = JSON.parse(fs.readFileSync(QUEUE, 'utf8')) || []; } catch (e) {}
  const seen = new Set(), out = [];
  for (const id of existing.concat(unproven, certified)) { if (!seen.has(id)) { seen.add(id); out.push(id); } }
  fs.writeFileSync(QUEUE, JSON.stringify(out));
  console.log('[reseed] queued ' + out.length + ' (' + unproven.length + ' unproven-first, ' + certified.length + ' certified-last) of ' + es.length + ' catalog');
})().catch(e => { console.log('[reseed] FATAL', e && e.message); process.exit(1); });
