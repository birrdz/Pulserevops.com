// _fr_interlink.js — Hub-and-spoke SEO interlinking for the Franchises (fr####) pillar.
//
// GOAL: every fr entry (except the hub) links BACK to the flagship franchise
// "best franchises to buy in 2027" leaderboard hub, so internal authority funnels there.
//
// SAFETY / LAWS:
//   - APPEND-ONLY: never rewrites or deletes existing body content. Only adds the
//     backlink if it is missing.
//   - CLOBBER-SAFE: strong-reads the entry blob immediately before writing it back,
//     and never touches _index.json wholesale.
//   - /knowledge/<id> links ONLY (pretty pillar URLs 404).
//
// Usage:
//   node -r ./_loadenv.js _fr_interlink.js --hub fr1114 --ids fr0001,fr0002      // pilot
//   node -r ./_loadenv.js _fr_interlink.js --hub fr1114 --all                    // full run
//   node -r ./_loadenv.js _fr_interlink.js --hub fr1114 --all --dry-run          // preview
//   node -r ./_loadenv.js _fr_interlink.js --hub fr1114 --ids fr0001 --verify    // just report link state
const { getStore } = require('@netlify/blobs');

const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_BLOBS_TOKEN;

function arg(name, def) {
  const i = process.argv.indexOf('--' + name);
  return i >= 0 ? process.argv[i + 1] : def;
}
const HUB = arg('hub');
const ALL = process.argv.includes('--all');
const DRY = process.argv.includes('--dry-run');
const VERIFY = process.argv.includes('--verify');
const IDS = (() => {
  const inline = arg('ids');
  return inline ? inline.split(',').map((s) => s.trim()).filter(Boolean) : [];
})();

if (!HUB || !/^fr\d+$/.test(HUB) || (!ALL && !IDS.length)) {
  console.error('usage: node -r ./_loadenv.js _fr_interlink.js --hub fr#### (--all | --ids a,b) [--dry-run] [--verify]');
  process.exit(1);
}

function store() {
  return getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
}

// True if the body already links to the hub (by /knowledge/<hubid> or bare id mention).
function hasHubLink(body, hubId) {
  if (!body) return false;
  return body.includes('/knowledge/' + hubId) || new RegExp('\\b' + hubId + '\\b').test(body);
}

// Append the backlink. APPEND-ONLY: preserves everything already present.
// If a "## Related on PULSE" section exists, add the line inside it (right after the
// heading). Otherwise append a fresh section at the end of the body.
function appendBacklink(body, hubId, hubTitle) {
  const line = `→ [${hubTitle}](/knowledge/${hubId}) — every franchise on PULSE, ranked.`;
  const text = String(body || '');
  const re = /(^|\n)(#{2,3}\s*Related on PULSE[^\n]*\n)/i;
  const m = text.match(re);
  if (m) {
    const insertAt = m.index + m[0].length;
    return text.slice(0, insertAt) + line + '\n' + text.slice(insertAt);
  }
  const sep = text.endsWith('\n') ? '\n' : '\n\n';
  return text + sep + '## Related on PULSE\n\n' + line + '\n';
}

(async () => {
  const st = store();

  // Resolve hub title from its blob (exact title required in the link text).
  const hubBlob = await st.get('answers/' + HUB + '.json', { type: 'json', consistency: 'strong' }).catch(() => null);
  if (!hubBlob) { console.error('HUB blob not found: ' + HUB); process.exit(1); }
  const HUB_TITLE = hubBlob.question;

  // Build the target id list.
  let ids = IDS;
  if (ALL) {
    const idx = await st.get('_index.json', { type: 'json', consistency: 'strong' });
    ids = (idx.entries || []).filter((e) => e && e.id && /^fr\d+$/.test(e.id)).map((e) => e.id);
  }
  ids = ids.filter((id) => id !== HUB); // never link the hub to itself

  const res = { hub: HUB, hub_title: HUB_TITLE, total: ids.length, added: 0, already: 0, missing_blob: 0, errored: [], verify: [] };

  for (const id of ids) {
    try {
      // Strong read immediately before any write (clobber-safe).
      const blob = await st.get('answers/' + id + '.json', { type: 'json', consistency: 'strong' });
      if (!blob || typeof blob.answer !== 'string') { res.missing_blob++; res.errored.push({ id, reason: 'no_blob_or_answer' }); continue; }

      const present = hasHubLink(blob.answer, HUB);
      if (VERIFY) { res.verify.push({ id, hasLink: present }); continue; }

      if (present) { res.already++; continue; }
      if (DRY) { res.added++; continue; }

      const newAnswer = appendBacklink(blob.answer, HUB, HUB_TITLE);
      // Re-read strong right before write to minimize clobber window, re-apply if changed.
      const fresh = await st.get('answers/' + id + '.json', { type: 'json', consistency: 'strong' });
      const base = (fresh && typeof fresh.answer === 'string') ? fresh : blob;
      if (hasHubLink(base.answer, HUB)) { res.already++; continue; } // someone added it meanwhile
      base.answer = appendBacklink(base.answer, HUB, HUB_TITLE);
      base.interlinked_hub = HUB;
      base.interlinked_at = Date.now();
      await st.setJSON('answers/' + id + '.json', base);
      res.added++;
      if (res.added % 50 === 0) console.error('  ...progress: ' + res.added + ' added, ' + res.already + ' already (of ' + res.total + ')');
    } catch (e) {
      res.errored.push({ id, reason: String((e && e.message) || e) });
    }
  }

  console.log(JSON.stringify(res, null, 2));
})().catch((e) => { console.error('ERR', e && e.message, e && e.stack); process.exit(1); });
