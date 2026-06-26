// Daily retro-linking — for each 10/10 entry polished in the last 24h, find
// up to 3 older 10/10 entries that share ≥2 tags AND don't yet link to it,
// and append a "Related: [question](/knowledge/qNEW)" line to those older
// entries. Effect: new entries get internal-link juice from established pages,
// crawl discovery improves, average internal-link depth tightens.

const { getStore } = require('@netlify/blobs');
const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

function initStore() {
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  try { return getStore('pulse-machine-library'); }
  catch { return getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok }); }
}

function tagOverlap(a, b) {
  const ta = new Set((a || []).map(t => String(t).toLowerCase()));
  const tb = new Set((b || []).map(t => String(t).toLowerCase()));
  let n = 0;
  for (const t of ta) if (tb.has(t)) n++;
  return n;
}

const { isVisitorPriorityActive } = require('./lib/visitor-priority');

exports.handler = async () => {
  /* visitor-priority-injected */
  try {
    let __vp_getStore = null;
    try { __vp_getStore = require('@netlify/blobs').getStore; } catch (_e) {}
    if (__vp_getStore) {
      let __vp_store = null;
      try { __vp_store = __vp_getStore('pulse-machine-library'); }
      catch (_e) {
        const __vp_tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
        const __vp_sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
        if (__vp_tok && __vp_sid) {
          try { __vp_store = __vp_getStore({ name: 'pulse-machine-library', siteID: __vp_sid, token: __vp_tok }); } catch (_e2) {}
        }
      }
      if (__vp_store && await isVisitorPriorityActive(__vp_store)) {
        return { statusCode: 200, body: JSON.stringify({ ok: true, paused: 'visitor-priority' }) };
      }
    }
  } catch (_e) {}

  const store = initStore();
  const idx = await store.get('_index.json', { type: 'json' });
  if (!idx || !Array.isArray(idx.entries)) {
    return { statusCode: 200, body: 'no index' };
  }

  // 10/10 entries polished in the last 24h are the link targets
  const since = Date.now() - 24 * 60 * 60 * 1000;
  const recent = idx.entries.filter(e => e.quality_score === 10 && (e.polished_at || 0) >= since);
  if (!recent.length) {
    return { statusCode: 200, body: JSON.stringify({ ok: true, recent: 0, reason: 'nothing fresh to retro-link' }) };
  }

  // All other 10/10 entries are candidate "older" pages that could link to a recent target
  const allTen = idx.entries.filter(e => e.quality_score === 10);
  const updates = [];

  for (const target of recent) {
    const targetId = target.id;
    const targetQ  = target.question || target.id;
    const targetTags = target.tags || [];

    // Score every other 10/10 entry by tag overlap, drop self and entries that
    // were polished AFTER the target (we only retro-link from older to newer)
    const candidates = allTen
      .filter(e => e.id !== targetId)
      .filter(e => (e.polished_at || 0) < (target.polished_at || 0))
      .map(e => ({ e, overlap: tagOverlap(e.tags, targetTags) }))
      .filter(c => c.overlap >= 2)
      .sort((a, b) => b.overlap - a.overlap)
      .slice(0, 3);

    for (const c of candidates) {
      const sourceEntry = await store.get('answers/' + c.e.id + '.json', { type: 'json' });
      if (!sourceEntry) continue;
      const ans = sourceEntry.answer || '';
      const linkPath = '/knowledge/' + targetId;
      // Skip if this entry already links to the target
      if (ans.indexOf(linkPath) !== -1) continue;
      // Skip if this entry already has a Retro-Linked block referencing target
      const newLine = '- [' + (targetQ.length > 110 ? targetQ.slice(0, 107) + '...' : targetQ) + '](' + linkPath + ')';
      let updatedAns;
      if (ans.indexOf('## Recently Added — Related') !== -1) {
        // Append to existing block
        updatedAns = ans.replace(/## Recently Added — Related\s*\n([\s\S]*?)(\n## |\n*$)/, function(_, list, tail) {
          return '## Recently Added — Related\n' + list.trimEnd() + '\n' + newLine + '\n' + tail;
        });
      } else {
        updatedAns = ans.trimEnd() + '\n\n## Recently Added — Related\n' + newLine + '\n';
      }
      sourceEntry.answer = updatedAns;
      sourceEntry.last_touched_at = Date.now();
      await store.setJSON('answers/' + c.e.id + '.json', sourceEntry);

      // Mirror last_modified_ms in index
      const i = idx.entries.findIndex(e => e.id === c.e.id);
      if (i >= 0) idx.entries[i].last_modified_ms = Date.now();

      updates.push({ from: c.e.id, to: targetId, overlap: c.overlap });
      // Cap total updates per run so we don't blow blob-write budget
      if (updates.length >= 30) break;
    }
    if (updates.length >= 30) break;
  }
  await store.setJSON('_index.json', idx);

  // Fire IndexNow batch so the modified pages get re-crawled
  try {
    fetch('https://pulserevops.com/.netlify/functions/pulse-machine-indexnow-batch-background', { method: 'POST' }).catch(() => {});
  } catch (_e) {}

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, recent_targets: recent.length, links_added: updates.length, updates }),
  };
};
