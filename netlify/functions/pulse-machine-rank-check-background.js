// ════════════════════════════════════════════════════════════════════════
// pulse-machine-rank-check — daily SERP rank checker for library entries.
//
// Runs once per day at 11:00 UTC (cron: "0 11 * * *"). Pulls the 20 most
// recent library entries, queries each via Brave Search API, and records
// whether pulserevops.com appears in the top 30 results. Stores a daily
// snapshot in the `pulse-rank-checks` blob and emails Kory a diff vs. the
// prior day's snapshot — NEW rankings, LOST rankings, MOVED positions.
//
// Engine: prefers Serper.dev (Google results), falls back to Brave or Bing.
//   - SERPER_API_KEY (https://serper.dev) — primary, gives Google SERP data
//   - BRAVE_API_KEY (https://api.search.brave.com) — alt, free 2k/mo
//   - BING_API_KEY (Azure)                          — alt
//
// Cost: ~$0 (free tiers). 20 entries × 30 days = 600 queries/mo.
// ════════════════════════════════════════════════════════════════════════

const https = require('https');

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

const SITE_HOST = 'pulserevops.com';
const SITE = 'https://' + SITE_HOST;
const ENTRY_LIMIT = 20;
const RESULTS_DEPTH = 30;

function initStore(name) {
  if (!getStore) return null;
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  if (tok && sid) { try { return getStore({ name, siteID: sid, token: tok }); } catch (e) { return null; } }
  try { return getStore(name); } catch (e) { return null; }
}

function dayKey(d) {
  const x = d || new Date();
  return x.toISOString().slice(0, 10);
}

function escHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

// Build a search query from an entry — strip filler words, cap at ~10 words.
// Goal: a query a real person might actually type, not the verbatim question.
function queryFromEntry(e) {
  const q = String(e.question || e.title || '').toLowerCase();
  const stripped = q
    .replace(/[?!.,;:()"']/g, ' ')
    .replace(/\b(what|why|how|when|where|who|is|are|the|a|an|to|do|does|of|in|for|on|with|and|or|should|can|i|my|our|we|you|your)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = stripped.split(' ').filter(w => w.length > 2).slice(0, 8);
  return words.join(' ');
}

function httpsGetJson(url, headers, timeoutMs) {
  return new Promise((resolve) => {
    const u = new URL(url);
    const req = https.request({
      hostname: u.hostname, path: u.pathname + u.search, method: 'GET',
      headers, timeout: timeoutMs || 8000,
    }, (res) => {
      let buf = '';
      res.on('data', c => buf += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(buf) }); }
        catch (e) { resolve({ status: res.statusCode, data: null, raw: buf.slice(0, 200) }); }
      });
    });
    req.on('error', () => resolve({ status: 0, data: null }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 0, data: null, error: 'timeout' }); });
    req.end();
  });
}

async function searchBrave(query, apiKey) {
  const r = await httpsGetJson(
    'https://api.search.brave.com/res/v1/web/search?count=' + RESULTS_DEPTH + '&q=' + encodeURIComponent(query),
    { 'Accept': 'application/json', 'X-Subscription-Token': apiKey }
  );
  if (r.status !== 200 || !r.data) return { ok: false, results: [], error: r.error || 'brave_' + r.status };
  const web = r.data.web || {};
  const items = (web.results || []).map((it, idx) => ({ position: idx + 1, url: it.url || '', title: it.title || '' }));
  return { ok: true, results: items };
}

async function searchBing(query, apiKey) {
  const r = await httpsGetJson(
    'https://api.bing.microsoft.com/v7.0/search?count=' + RESULTS_DEPTH + '&q=' + encodeURIComponent(query),
    { 'Ocp-Apim-Subscription-Key': apiKey }
  );
  if (r.status !== 200 || !r.data) return { ok: false, results: [], error: 'bing_' + r.status };
  const web = r.data.webPages || {};
  const items = (web.value || []).map((it, idx) => ({ position: idx + 1, url: it.url || '', title: it.name || '' }));
  return { ok: true, results: items };
}

function httpsPostJson(url, headers, payload, timeoutMs) {
  return new Promise((resolve) => {
    const u = new URL(url);
    const data = JSON.stringify(payload);
    const req = https.request({
      hostname: u.hostname, path: u.pathname + u.search, method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
      timeout: timeoutMs || 10000,
    }, (res) => {
      let buf = '';
      res.on('data', c => buf += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(buf) }); }
        catch (e) { resolve({ status: res.statusCode, data: null }); }
      });
    });
    req.on('error', () => resolve({ status: 0, data: null }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 0, data: null, error: 'timeout' }); });
    req.write(data);
    req.end();
  });
}

async function searchSerper(query, apiKey) {
  const r = await httpsPostJson(
    'https://google.serper.dev/search',
    { 'X-API-KEY': apiKey },
    { q: query, num: RESULTS_DEPTH }
  );
  if (r.status !== 200 || !r.data) return { ok: false, results: [], error: 'serper_' + r.status };
  const organic = r.data.organic || [];
  const items = organic.map((it, idx) => ({
    position: it.position || (idx + 1),
    url: it.link || '',
    title: it.title || '',
  }));
  return { ok: true, results: items };
}

function findHostMatch(results, host, entryId) {
  for (const r of results) {
    try {
      const u = new URL(r.url);
      if (!u.hostname.endsWith(host)) continue;
      // Prefer exact match for /knowledge/<id> when id is provided
      if (entryId && u.pathname.includes('/knowledge/' + entryId)) {
        return { position: r.position, url: r.url, exactPath: true };
      }
      // Otherwise return first hit on the host
      if (!entryId) return { position: r.position, url: r.url, exactPath: false };
    } catch (e) {}
  }
  // Fallback: first host hit even if not exact path match
  for (const r of results) {
    try {
      const u = new URL(r.url);
      if (u.hostname.endsWith(host)) return { position: r.position, url: r.url, exactPath: false };
    } catch (e) {}
  }
  return null;
}

exports.handler = async (event) => {
  const serperKey = process.env.SERPER_API_KEY || '';
  const braveKey = process.env.BRAVE_API_KEY || '';
  const bingKey = process.env.BING_API_KEY || '';
  // Priority: Serper (Google results) > Brave > Bing
  const engine = serperKey ? 'serper' : (braveKey ? 'brave' : (bingKey ? 'bing' : null));

  // ?force=1 bypasses the idempotency guard for manual re-runs
  const params = (event && event.queryStringParameters) || {};
  const force = params.force === '1' || params.force === 'true';

  if (!engine) {
    console.warn('[rank-check] no SERP API key (SERPER_API_KEY/BRAVE_API_KEY/BING_API_KEY) — skipping');
    return { statusCode: 200, body: 'no api key' };
  }

  const lib = initStore('pulse-machine-library');
  const ranks = initStore('pulse-rank-checks');
  if (!lib || !ranks) return { statusCode: 200, body: 'no store' };

  const day = dayKey();

  // Idempotency (skipped when ?force=1)
  if (!force) {
    try {
      const existing = await ranks.get(day + '.json', { type: 'json' });
      if (existing && existing.complete) return { statusCode: 200, body: 'already ran' };
    } catch (e) {}
  }

  // Pull library index
  const idx = (await lib.get('_index.json', { type: 'json' })) || { entries: [] };
  const recent = (idx.entries || [])
    .filter(e => e && e.id && e.question)
    .sort((a, b) => (b.ts || 0) - (a.ts || 0))
    .slice(0, ENTRY_LIMIT);

  // Yesterday snapshot for diff
  const yKey = dayKey(new Date(Date.now() - 24 * 60 * 60 * 1000));
  let yesterday = null;
  try { yesterday = await ranks.get(yKey + '.json', { type: 'json' }); } catch (e) {}
  const yMap = {};
  if (yesterday && Array.isArray(yesterday.results)) {
    for (const r of yesterday.results) yMap[r.id] = r;
  }

  // Run searches sequentially with small delay (be polite to Brave free tier)
  const today = [];
  for (const e of recent) {
    const query = queryFromEntry(e);
    if (!query) continue;
    const search = engine === 'serper'
      ? await searchSerper(query, serperKey)
      : engine === 'brave'
        ? await searchBrave(query, braveKey)
        : await searchBing(query, bingKey);
    if (!search.ok) {
      today.push({ id: e.id, question: e.question, query, ranked: false, error: search.error });
      continue;
    }
    const hit = findHostMatch(search.results, SITE_HOST, e.id);
    today.push({
      id: e.id,
      question: e.question,
      query,
      ranked: !!hit,
      position: hit ? hit.position : null,
      url: hit ? hit.url : null,
      exactPath: hit ? hit.exactPath : false,
    });
    // Politeness delay between queries (Serper handles ~5 req/sec, Brave ~2)
    await new Promise(r => setTimeout(r, engine === 'serper' ? 200 : 350));
  }

  // Diff vs. yesterday
  const newlyRanked = [];
  const lostRankings = [];
  const moved = [];
  for (const r of today) {
    const prev = yMap[r.id];
    if (r.ranked && (!prev || !prev.ranked)) newlyRanked.push(r);
    else if (!r.ranked && prev && prev.ranked) lostRankings.push({ ...r, prevPosition: prev.position });
    else if (r.ranked && prev && prev.ranked && prev.position !== r.position) {
      moved.push({ ...r, prevPosition: prev.position, delta: prev.position - r.position });
    }
  }

  const totalRanked = today.filter(r => r.ranked).length;
  const snapshot = { day, engine, total: today.length, totalRanked, results: today, complete: true, ts: Date.now() };
  await ranks.setJSON(day + '.json', snapshot);

  // Maintain a rolling index for the dashboard / debug
  let rankIdx = { snapshots: [] };
  try { rankIdx = (await ranks.get('_index.json', { type: 'json' })) || rankIdx; } catch (e) {}
  rankIdx.snapshots = [{ day, total: today.length, totalRanked, ts: Date.now() }, ...(rankIdx.snapshots || []).filter(s => s.day !== day)].slice(0, 90);
  await ranks.setJSON('_index.json', rankIdx);

  // Email summary — only send when there's signal worth reading.
  // (Skip the email on days where nothing changed AND nothing is ranking yet.)
  const apiKey = process.env.RESEND_API_KEY || process.env.resendapikey;
  const to     = process.env.ALERT_TO_EMAIL || process.env.alert_to_email;
  const from   = process.env.ALERT_FROM_EMAIL || 'onboarding@resend.dev';
  const hasSignal = totalRanked > 0 || newlyRanked.length > 0 || lostRankings.length > 0 || moved.length > 0;
  // Email also on the first-ever run so user gets confirmation the cron works,
  // even if nothing's ranking yet. yesterday=null means no prior snapshot exists.
  const isFirstRun = !yesterday;
  const shouldEmail = hasSignal || isFirstRun;

  if (apiKey && to && shouldEmail) {
    const dateLabel = new Date(day + 'T12:00:00Z').toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    const renderHits = (arr, label, color) => arr.length ? `
      <div style="margin:18px 0 6px;font-size:11px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;color:${color};">${label} · ${arr.length}</div>
      ${arr.map(r => `
        <div style="background:#0e131c;border:1px solid rgba(255,255,255,0.08);border-left:3px solid ${color};border-radius:8px;padding:12px 14px;margin-bottom:8px;">
          <div style="font-size:14px;font-weight:700;color:#EDE5D8;line-height:1.35;margin-bottom:4px;">${escHtml(r.question)}</div>
          <div style="font-size:12px;color:rgba(237,229,216,0.65);margin-bottom:6px;">Query: <span style="color:#FFD740;">${escHtml(r.query)}</span></div>
          <div style="font-size:12px;color:rgba(237,229,216,0.75);">
            ${r.position ? `Position: <strong style="color:#fff;">#${r.position}</strong>` : ''}
            ${r.prevPosition ? ` &nbsp;·&nbsp; was #${r.prevPosition}` : ''}
            ${r.delta ? ` &nbsp;·&nbsp; <span style="color:${r.delta > 0 ? '#22c55e' : '#ef4444'};">${r.delta > 0 ? '↑' : '↓'} ${Math.abs(r.delta)}</span>` : ''}
            ${r.url ? `<br><a href="${escHtml(r.url)}" style="color:#FF8C1A;font-size:11px;text-decoration:none;">${escHtml(r.url.slice(0, 80))}</a>` : ''}
          </div>
        </div>
      `).join('')}
    ` : '';

    const stillRanked = today.filter(r => r.ranked && !newlyRanked.includes(r) && !moved.includes(r));
    const notRankedYet = today.filter(r => !r.ranked && !lostRankings.find(l => l.id === r.id));

    const html = `<!doctype html>
<html><body style="margin:0;padding:24px 16px;background:#070a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#EDE5D8;">
  <div style="max-width:640px;margin:0 auto;background:#111518;border:1px solid rgba(232,113,10,0.25);border-radius:14px;padding:28px;">
    <div style="font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#FF8C1A;margin-bottom:6px;">◉ Pulse Machine — SERP Rank Check</div>
    <h1 style="font-size:22px;font-weight:900;color:#fff;margin:0 0 4px;line-height:1.25;">${totalRanked} of ${today.length} entries ranking on ${engine === 'serper' ? 'Google' : engine === 'brave' ? 'Brave' : 'Bing'}</h1>
    <div style="font-size:13px;color:rgba(237,229,216,0.55);">${escHtml(dateLabel)}</div>

    ${renderHits(newlyRanked, '🆕 Newly ranked', '#22c55e')}
    ${renderHits(moved.filter(m => m.delta > 0), '↑ Moved up', '#22c55e')}
    ${renderHits(moved.filter(m => m.delta < 0), '↓ Moved down', '#FFD740')}
    ${renderHits(lostRankings, '🚫 Lost rankings', '#ef4444')}
    ${renderHits(stillRanked, '✓ Still ranking (unchanged)', '#94a3b8')}
    ${isFirstRun && notRankedYet.length ? `
      <div style="margin:18px 0 6px;font-size:11px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;color:#94a3b8;">⏳ Not ranking yet · ${notRankedYet.length}</div>
      <div style="background:#0e131c;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:14px 16px;font-size:12.5px;color:rgba(237,229,216,0.7);line-height:1.6;">
        These ${notRankedYet.length} entries are too new for Google to have indexed. Normal for a fresh domain — typical lag is 1–4 weeks. The cron will surface them as "🆕 Newly ranked" the day they break in.
      </div>
    ` : ''}

    <div style="margin-top:24px;padding-top:18px;border-top:1px solid rgba(255,255,255,0.08);font-size:11px;color:rgba(237,229,216,0.45);line-height:1.65;">
      Engine: ${engine === 'serper' ? 'Google (via Serper.dev)' : engine === 'brave' ? 'Brave Search' : 'Bing'} · Top ${RESULTS_DEPTH} results checked · ${today.length} entries queried.<br>
      ${engine === 'serper' ? 'Real Google SERP data — what an actual searcher sees.' : engine === 'brave' ? 'Brave indexes faster than Google for new sites — leading indicator.' : ''}
    </div>
  </div>
</body></html>`;

    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from, to: [to],
          subject: `🔍 SERP (${engine === 'serper' ? 'Google' : engine}) · ${totalRanked}/${today.length} ranking · ${newlyRanked.length} new · ${dateLabel}`,
          html,
        }),
      });
    } catch (e) { console.error('[rank-check] email err', e && e.message); }
  }

  console.log('[rank-check] done', { day, engine, total: today.length, ranked: totalRanked, new: newlyRanked.length });
  return { statusCode: 200, body: JSON.stringify({ ok: true, day, total: today.length, ranked: totalRanked, newlyRanked: newlyRanked.length, moved: moved.length, lost: lostRankings.length }) };
};
