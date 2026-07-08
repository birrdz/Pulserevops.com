// ════════════════════════════════════════════════════════════════════════
// pulse-machine-publish-prep-background — daily cron that bundles related
// library answers into pillar-page DRAFTS and stages them for Claude Code
// (or you) to review before they go live.
//
// Workflow:
//  1. Read the library _index.json
//  2. Group entries by topic tag, find tags with ≥ 5 answered questions
//  3. For each qualifying tag, ask Sonnet to write a 1,200-word pillar
//     synthesizing those entries into a single deep-dive page
//  4. Persist the draft to `staging/<tag>.json` with status: 'pending'
//
// Drafts are NOT auto-published. Use the staging endpoint to list pending
// drafts and approve/edit/reject them in a Claude Code review session.
//
// Schedule: once per day (08:00 UTC by default in netlify.toml).
// ════════════════════════════════════════════════════════════════════════
const https = require('https');
const { BACKGROUND_PUBLISH } = require('./lib/anthropic-models');

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

const MIN_ENTRIES_PER_PILLAR = 5;
const MODEL                  = BACKGROUND_PUBLISH;
const ESTIMATED_COST_USD     = 0.06;   // pillar synthesis ~ 1 sonnet call, no web search
const DAILY_PILLAR_CAP       = 5;      // max pillars generated per run (keep cost predictable)

const PILLAR_SYSTEM = `You are The Machine's editor. You're going to take a cluster of research-library entries that all share a single topic tag, and synthesize them into ONE coherent ~1,000-word pillar page that someone could actually read end-to-end.

Output structure (markdown, no preamble):
# <punchy headline that names the topic — not a question>

<2-3 sentence opening that frames why this topic matters in sales right now>

## The data
<Pull the most concrete numbers, benchmarks, and named-vendor signals from the source entries. Use a markdown table if there are multiple comparable benchmarks.>

## How the best operators handle it
<3-5 numbered actions, written as if you'd advise a CRO doing this tomorrow morning>

## Common traps
<3-4 bullets — what people get wrong>

## What we're watching next
<2-3 sentences pointing to follow-up questions the Machine has queued. Keeps the page feeling alive.>

Voice rules:
- Direct, named-vendor, named-framework specific
- No hedging, no "in conclusion," no marketing fluff
- Strong opinions, defended with the source data
- All claims should be grounded in the source entries provided — do NOT invent new benchmarks

After your pillar, on a new line starting with "DERIVED_FROM:", list the ids of the source entries you drew from as a JSON array.

Then on a line starting with "TITLE:", give a clean ≤ 60-char title for the page.
Then on a line starting with "SLUG:", give a clean URL slug (lowercase, hyphens, ≤ 40 chars).`;

function claudePost(payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const opts = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
    };
    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', c => { data += c; });
      res.on('end', () => {
        try { resolve({ ok: res.statusCode === 200, status: res.statusCode, data: JSON.parse(data), raw: data }); }
        catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function initStore() {
  if (!getStore) return null;
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  if (tok && sid) { try { return getStore({ name: 'pulse-machine-library', siteID: sid, token: tok }); } catch (e) { return null; } }
  try { return getStore('pulse-machine-library'); } catch (e) { return null; }
}

function parsePillarOutput(raw) {
  const text = String(raw || '').trim();
  const titleMatch  = text.match(/^TITLE:\s*(.+)$/im);
  const slugMatch   = text.match(/^SLUG:\s*(.+)$/im);
  const fromMatch   = text.match(/^DERIVED_FROM:\s*(\[.*\])\s*$/im);
  const earliest = Math.min(
    fromMatch ? fromMatch.index : text.length,
    titleMatch ? titleMatch.index : text.length,
    slugMatch ? slugMatch.index : text.length,
  );
  const body = text.slice(0, earliest).trim();
  let derivedFrom = [];
  try { if (fromMatch) derivedFrom = JSON.parse(fromMatch[1]); } catch (e) {}
  if (!Array.isArray(derivedFrom)) derivedFrom = [];
  const title = titleMatch ? titleMatch[1].trim().slice(0, 80) : '';
  const slug  = slugMatch  ? slugMatch[1].trim().toLowerCase().replace(/[^\w-]/g, '-').replace(/-+/g, '-').slice(0, 48) : '';
  return { body, title, slug, derivedFrom };
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

  if (!process.env.ANTHROPIC_API_KEY) return { statusCode: 200, body: 'no key' };
  const store = initStore();
  if (!store) return { statusCode: 200, body: 'no store' };

  // 1. Read library index
  let idx;
  try { idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] }; }
  catch (e) { return { statusCode: 200, body: 'no index' }; }
  if (!idx.entries || !idx.entries.length) return { statusCode: 200, body: 'empty library' };

  // 2. Group by tag
  const byTag = {};
  for (const e of idx.entries) {
    for (const t of e.tags || []) {
      if (!byTag[t]) byTag[t] = [];
      byTag[t].push(e);
    }
  }
  const eligibleTags = Object.keys(byTag).filter(t => byTag[t].length >= MIN_ENTRIES_PER_PILLAR);

  // 3. Skip tags that already have a recent draft (within 7 days)
  let staging;
  try { staging = (await store.get('_staging_index.json', { type: 'json' })) || { drafts: [] }; }
  catch (e) { staging = { drafts: [] }; }
  const recentTags = new Set(
    (staging.drafts || [])
      .filter(d => d.ts && (Date.now() - d.ts) < 7 * 24 * 60 * 60 * 1000)
      .map(d => d.tag)
  );
  const todoTags = eligibleTags.filter(t => !recentTags.has(t)).slice(0, DAILY_PILLAR_CAP);

  if (!todoTags.length) {
    console.log('[publish-prep] nothing to draft (no eligible tags or all recent)');
    return { statusCode: 200, body: 'nothing-to-draft' };
  }

  const newDrafts = [];

  for (const tag of todoTags) {
    const entries = byTag[tag].slice(0, 12); // top 12 entries by recency

    // Fetch full answers for each entry
    const fullEntries = await Promise.all(
      entries.map(e => store.get('answers/' + e.id + '.json', { type: 'json' }).catch(() => null))
    );
    const sourceBlock = fullEntries.filter(Boolean).map((e, i) => {
      return `### ENTRY ${i+1} (id: ${e.id})\nQ: ${e.question}\nA: ${e.answer}\nTags: ${(e.tags || []).join(', ')}`;
    }).join('\n\n');

    let resp;
    try {
      resp = await claudePost({
        model: MODEL,
        max_tokens: 2400,
        system: PILLAR_SYSTEM,
        messages: [{ role: 'user', content: 'TAG: ' + tag + '\n\nSOURCE ENTRIES:\n\n' + sourceBlock }],
      });
    } catch (e) {
      console.error('[publish-prep] api err for tag', tag, e && e.message);
      continue;
    }
    if (!resp.ok) {
      console.error('[publish-prep] api fail tag=' + tag, resp.status);
      continue;
    }
    const blocks = resp.data.content || [];
    let raw = '';
    for (const b of blocks) if (b.type === 'text' && b.text) raw += b.text;
    const { body, title, slug, derivedFrom } = parsePillarOutput(raw);
    if (!body || body.length < 200) { console.warn('[publish-prep] empty pillar for tag', tag); continue; }

    const draftId = (Date.now().toString(36) + Math.random().toString(36).slice(2, 6));
    const finalSlug = slug || tag.replace(/[^\w-]/g, '-');
    const draft = {
      id: draftId,
      tag,
      slug: finalSlug,
      title: title || tag,
      body,
      derived_from: Array.isArray(derivedFrom) && derivedFrom.length ? derivedFrom : entries.map(e => e.id),
      ts: Date.now(),
      status: 'pending',  // pending → approved → published, or rejected
    };
    try { await store.setJSON('staging/' + draftId + '.json', draft); }
    catch (e) { console.error('[publish-prep] save err', e && e.message); continue; }
    newDrafts.push({ id: draftId, tag, slug: finalSlug, title: draft.title, ts: draft.ts });
    console.log('[publish-prep] drafted', tag, '→', draftId);
  }

  // 4. Update staging index
  try {
    const merged = newDrafts.concat(staging.drafts || []).slice(0, 200);
    await store.setJSON('_staging_index.json', { drafts: merged, updated: Date.now() });
  } catch (e) { console.error('[publish-prep] staging-index err', e && e.message); }

  // Track spend (rough — Sonnet pillar synthesis without web_search)
  try {
    let meta = (await store.get('_meta.json', { type: 'json' })) || { spend_today: 0, day: '', runs_today: 0 };
    meta.spend_today = +((meta.spend_today || 0) + ESTIMATED_COST_USD * newDrafts.length).toFixed(3);
    await store.setJSON('_meta.json', meta);
  } catch (e) {}

  return { statusCode: 200, body: JSON.stringify({ ok: true, drafted: newDrafts.length, drafts: newDrafts }) };
};
