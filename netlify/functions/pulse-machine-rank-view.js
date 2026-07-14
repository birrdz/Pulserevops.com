// ════════════════════════════════════════════════════════════════════════
// pulse-machine-rank-view — read today's (or any day's) SERP rank-check
// snapshot from the pulse-rank-checks blob and render either JSON or a
// minimal dashboard.
//
// Auth: ?key=pulsemachine
// Usage:
//   /.netlify/functions/pulse-machine-rank-view?key=pulsemachine
//   /.netlify/functions/pulse-machine-rank-view?key=pulsemachine&day=2026-04-29
//   /.netlify/functions/pulse-machine-rank-view?key=pulsemachine&format=json
// ════════════════════════════════════════════════════════════════════════

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

const ADMIN_KEY = 'pulsemachine';

function initStore(name) {
  if (!getStore) return null;
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  if (tok && sid) { try { return getStore({ name, siteID: sid, token: tok }); } catch (e) { return null; } }
  try { return getStore(name); } catch (e) { return null; }
}

function dayKey(d) { return (d || new Date()).toISOString().slice(0, 10); }

function escHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

exports.handler = async (event) => {
  const params = event.queryStringParameters || {};
  if (params.key !== ADMIN_KEY) return { statusCode: 403, body: 'forbidden' };

  const ranks = initStore('pulse-rank-checks');
  if (!ranks) return { statusCode: 500, body: 'no store' };

  const day = params.day || dayKey();
  const format = params.format || 'html';

  let snapshot = null;
  try { snapshot = await ranks.get(day + '.json', { type: 'json' }); } catch (e) {}

  let index = { snapshots: [] };
  try { index = (await ranks.get('_index.json', { type: 'json' })) || index; } catch (e) {}

  if (format === 'json') {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      body: JSON.stringify({ ok: true, day, snapshot, recent: index.snapshots.slice(0, 14) }, null, 2),
    };
  }

  // HTML view
  const recentRows = (index.snapshots || []).slice(0, 14).map(s => `
    <tr>
      <td><a href="?key=${ADMIN_KEY}&day=${s.day}" style="color:#FF8C1A;">${escHtml(s.day)}</a></td>
      <td style="text-align:center;">${s.totalRanked}/${s.total}</td>
      <td style="text-align:right;color:rgba(237,229,216,0.5);font-size:11px;">${new Date(s.ts).toISOString().slice(11,16)} UTC</td>
    </tr>
  `).join('');

  let mainSection = '';
  if (!snapshot) {
    mainSection = `
      <div style="background:#1A2025;border:1px solid rgba(255,193,7,0.3);border-radius:8px;padding:18px;color:#FFD740;">
        ⚠ No snapshot found for ${escHtml(day)}.<br>
        <span style="font-size:12px;color:rgba(237,229,216,0.6);">The cron may not have run yet, or SERPER_API_KEY is missing. Trigger manually:
        <code style="background:#0a0d12;padding:2px 6px;border-radius:4px;color:#FF8C1A;">POST /.netlify/functions/pulse-machine-rank-check-background?force=1</code></span>
      </div>`;
  } else {
    const ranked = (snapshot.results || []).filter(r => r.ranked);
    const notRanked = (snapshot.results || []).filter(r => !r.ranked);
    const errors = (snapshot.results || []).filter(r => r.error);

    const rankedHtml = ranked.map(r => `
      <div style="background:#0e131c;border:1px solid rgba(34,197,94,0.3);border-left:3px solid #22c55e;border-radius:8px;padding:12px 14px;margin-bottom:8px;">
        <div style="font-size:14px;font-weight:700;color:#EDE5D8;margin-bottom:4px;">#${r.position} · ${escHtml(r.question)}</div>
        <div style="font-size:12px;color:rgba(237,229,216,0.6);">Query: <span style="color:#FFD740;">${escHtml(r.query)}</span></div>
        ${r.url ? `<div style="font-size:11px;margin-top:4px;"><a href="${escHtml(r.url)}" target="_blank" style="color:#FF8C1A;">${escHtml(r.url.slice(0, 100))}</a></div>` : ''}
      </div>
    `).join('') || '<div style="color:rgba(237,229,216,0.5);font-size:13px;padding:14px 0;">Nothing ranking yet. Normal for fresh entries — Google indexing typically takes 1–4 weeks.</div>';

    const notRankedHtml = notRanked.length ? `
      <details style="margin-top:18px;">
        <summary style="cursor:pointer;color:rgba(237,229,216,0.7);font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">⏳ ${notRanked.length} not yet ranked</summary>
        <div style="margin-top:8px;background:#0e131c;border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:12px;">
          ${notRanked.map(r => `<div style="font-size:12px;padding:4px 0;color:rgba(237,229,216,0.65);">• ${escHtml(r.question.slice(0, 100))} <span style="color:rgba(237,229,216,0.35);font-size:11px;">— "${escHtml(r.query)}"</span></div>`).join('')}
        </div>
      </details>` : '';

    const errHtml = errors.length ? `
      <div style="background:#1A2025;border:1px solid rgba(239,68,68,0.3);border-radius:8px;padding:14px;margin-top:14px;font-size:12px;color:#ef4444;">
        ${errors.length} query error${errors.length === 1 ? '' : 's'}: ${escHtml(errors.map(e => e.error).slice(0,3).join(', '))}
      </div>` : '';

    mainSection = `
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:24px;">
        <div style="background:#1A2025;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:14px;text-align:center;">
          <div style="font-size:11px;color:rgba(237,229,216,0.5);letter-spacing:1.4px;text-transform:uppercase;font-weight:700;">Ranked</div>
          <div style="font-size:28px;font-weight:900;color:#22c55e;margin-top:4px;">${snapshot.totalRanked}/${snapshot.total}</div>
        </div>
        <div style="background:#1A2025;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:14px;text-align:center;">
          <div style="font-size:11px;color:rgba(237,229,216,0.5);letter-spacing:1.4px;text-transform:uppercase;font-weight:700;">Engine</div>
          <div style="font-size:14px;font-weight:700;color:#FFD740;margin-top:9px;">${escHtml(snapshot.engine === 'serper' ? 'Google' : snapshot.engine || '—')}</div>
        </div>
        <div style="background:#1A2025;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:14px;text-align:center;">
          <div style="font-size:11px;color:rgba(237,229,216,0.5);letter-spacing:1.4px;text-transform:uppercase;font-weight:700;">Run At</div>
          <div style="font-size:14px;font-weight:700;color:#fff;margin-top:9px;">${new Date(snapshot.ts).toISOString().slice(11,16)} UTC</div>
        </div>
      </div>

      <div style="font-size:11px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;color:#22c55e;margin:18px 0 10px;">✓ Ranking on ${snapshot.engine === 'serper' ? 'Google' : snapshot.engine}</div>
      ${rankedHtml}
      ${notRankedHtml}
      ${errHtml}
    `;
  }

  const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>SERP Rank · PULSE</title>
<style>
  body { background:#0a0d12; color:#EDE5D8; font-family:'Segoe UI',system-ui,sans-serif; padding:32px 16px; margin:0; min-height:100vh; }
  .wrap { max-width:780px; margin:0 auto; }
  h1 { color:#FF8C1A; font-size:13px; letter-spacing:2px; text-transform:uppercase; margin:0 0 4px; }
  h2 { font-family:Georgia,serif; font-size:24px; font-weight:800; color:#fff; margin:0 0 18px; }
  table { width:100%; border-collapse:collapse; margin-top:8px; font-size:13px; }
  table td { padding:8px 10px; border-bottom:1px solid rgba(255,255,255,0.06); }
</style><link rel="stylesheet" href="/assets/pulse-tan.css"><link rel="stylesheet" href="/css/pulse-jet-sides.css"></head>
<body><div class="wrap">
  <h1>◉ Pulse Machine — SERP Rank</h1>
  <h2>${escHtml(day)}</h2>
  ${mainSection}

  <div style="margin-top:32px;padding-top:18px;border-top:1px solid rgba(255,255,255,0.08);">
    <div style="font-size:11px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;color:#94a3b8;margin-bottom:10px;">Recent runs</div>
    <table>${recentRows || '<tr><td colspan="3" style="color:rgba(237,229,216,0.4);">No prior runs.</td></tr>'}</table>
  </div>
</div></body></html>`;

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
    body: html,
  };
};
