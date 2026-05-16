// ════════════════════════════════════════════════════════════════════════
// pulse-machine-learn-background — runs hourly. The Machine is proactive:
// while no one is asking, it scans the web for fresh sales / GTM / SaaS /
// leadership content and persists a rolling "knowledge feed" of findings.
//
// Pulse-machine.js reads the latest feed at request time and folds it into
// system context, so The Machine's answers are always anchored to data
// from the last few hours, not just from training-time.
//
// Runs on Netlify schedule (15-min budget for background functions).
// ════════════════════════════════════════════════════════════════════════
const https = require('https');

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

const SCAN_PROMPT = `You are The Machine's research scout. Your job: scan the web RIGHT NOW for fresh sales / GTM / SaaS / leadership / RevOps signals from the last 7 days, and return a tight knowledge digest that future questioners will benefit from.

Use web_search aggressively. Hunt across:
- Sales-leadership job postings (LinkedIn, Greenhouse, Wellfound, BuiltIn) — who's hiring CROs, VPs of Sales, Directors; comp ranges if visible
- Vendor moves — Apollo, Salesforce, HubSpot, Outreach, Gong, Clari, Salesloft, ZoomInfo, 6sense — new features, pricing changes, layoffs, leadership changes
- Funding & M&A in sales tech (TechCrunch, Crunchbase signals)
- Comp / benchmark publications — Pavilion, Bridge Group, OpenView, SaaStr, KeyBanc — anything new
- Podcast / newsletter highlights — 30 Minutes to President's Club, The GTM Podcast, Topline, Lenny's Newsletter — most-discussed plays this week
- Earnings-call commentary from public SaaS on sales execution / win rates / NRR
- Notable LinkedIn posts from senior CROs / VPs Sales that got real traction

Return a JSON array of 6-10 entries, each with:
{ "topic": "<one of: hiring | vendor | funding | comp | benchmark | playbook | podcast | leadership | earnings>",
  "headline": "<one-sentence summary, ≤ 22 words>",
  "detail":   "<2-3 sentences with concrete numbers, names, dates>",
  "url":      "<https URL of the source>",
  "freshness":"<YYYY-MM-DD or 'this-week'>" }

ONLY the JSON array. No prose. No markdown fences. If a search returned weak signal, skip it — quality over filler.`;

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

exports.handler = async () => {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('[learn-bg] ANTHROPIC_API_KEY missing — skip');
    return { statusCode: 200, body: 'no key' };
  }

  let store = null;
  if (getStore) {
    try { store = getStore('pulse-machine-feed'); }
    catch (_e1) {
      const tok = process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
      const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
      if (tok && sid) {
        try { store = getStore({ name: 'pulse-machine-feed', siteID: sid, token: tok }); } catch (_e2) {}
      }
    }
  }

  let entries = [];
  try {
    const r = await claudePost({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      system: SCAN_PROMPT,
      tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 8 }],
      messages: [{ role: 'user', content: 'Run the scan now. Today\'s date is ' + new Date().toISOString().slice(0,10) + '. Return only the JSON array of fresh findings.' }],
    });
    if (!r.ok) {
      console.error('[learn-bg] api fail', r.status, r.raw && r.raw.slice(0, 300));
      return { statusCode: 200, body: 'api fail' };
    }
    const blocks = r.data.content || [];
    let raw = '';
    for (const b of blocks) {
      if (b.type === 'text' && b.text) raw += b.text;
    }
    raw = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/```$/, '').trim();
    try { entries = JSON.parse(raw); } catch (e) {
      const m = raw.match(/\[[\s\S]*\]/);
      if (m) { try { entries = JSON.parse(m[0]); } catch (e2) {} }
    }
    if (!Array.isArray(entries)) entries = [];
  } catch (err) {
    console.error('[learn-bg] err', err && err.message);
    return { statusCode: 200, body: 'err' };
  }

  // Stamp + sanitize
  const now = Date.now();
  entries = entries.filter(e => e && e.headline && e.detail).slice(0, 12).map(e => ({
    topic:     String(e.topic || 'misc').slice(0, 24),
    headline:  String(e.headline).slice(0, 240),
    detail:    String(e.detail).slice(0, 600),
    url:       String(e.url || '').slice(0, 500),
    freshness: String(e.freshness || '').slice(0, 24),
    captured:  now,
  }));

  if (!entries.length) return { statusCode: 200, body: 'empty scan' };

  // Merge with last run (newest first), cap at 50
  if (store) {
    try {
      const prev = (await store.get('latest.json', { type: 'json' })) || { entries: [] };
      const merged = entries.concat(Array.isArray(prev.entries) ? prev.entries : []).slice(0, 50);
      await store.setJSON('latest.json', { ts: now, entries: merged });
      // Also store per-run snapshot for audit
      const runKey = 'runs/' + new Date(now).toISOString().replace(/[:.]/g,'-') + '.json';
      await store.setJSON(runKey, { ts: now, entries });
    } catch (e) {
      console.error('[learn-bg] blob err', e && e.message);
    }
  }

  console.log('[learn-bg] captured', entries.length, 'entries');
  return { statusCode: 200, body: JSON.stringify({ ok:true, count: entries.length }) };
};
