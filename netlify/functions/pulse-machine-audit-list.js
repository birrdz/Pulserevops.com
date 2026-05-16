// ════════════════════════════════════════════════════════════════════════
// pulse-machine-audit-list — read endpoint for the daily site-audit
// recommendations produced by the audit cron.
//
// Auth: ?key=pulsemachine
// Usage:
//   /.netlify/functions/pulse-machine-audit-list?key=pulsemachine
//     → HTML dashboard with the latest audit's recommendations
//   /.netlify/functions/pulse-machine-audit-list?key=pulsemachine&id=audit-xyz
//     → view a specific audit
//   /.netlify/functions/pulse-machine-audit-list?key=pulsemachine&format=json
//     → raw JSON
// ════════════════════════════════════════════════════════════════════════

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

const ADMIN_KEY = 'pulsemachine';

function initStore() {
  if (!getStore) return null;
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  if (tok && sid) { try { return getStore({ name: 'pulse-machine-library', siteID: sid, token: tok }); } catch (e) { return null; } }
  try { return getStore('pulse-machine-library'); } catch (e) { return null; }
}

function escHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

const PRIORITY_COLOR = { high: '#ef4444', medium: '#FFD740', low: '#94a3b8' };
const TYPE_ICON = {
  'faq-add': '❓', 'cta-tweak': '🔘', 'cross-link': '🔗',
  'copy-refine': '✏️', 'new-howto': '📋', 'visitor-friction': '⚠',
  'pillar-candidate': '🏛', 'dashboard-tweak': '📊',
};

exports.handler = async (event) => {
  const params = event.queryStringParameters || {};
  if (params.key !== ADMIN_KEY) return { statusCode: 403, body: 'forbidden' };

  const store = initStore();
  if (!store) return { statusCode: 500, body: 'no store' };

  const format = params.format || 'html';

  // Pull the audit index
  let idx = { audits: [] };
  try { idx = (await store.get('_audits_index.json', { type: 'json' })) || idx; } catch (e) {}
  const audits = idx.audits || [];

  // Resolve which audit to show: explicit id, or the most recent
  let targetId = params.id || (audits[0] && audits[0].id);
  let audit = null;
  if (targetId) {
    try { audit = await store.get('audits/' + targetId + '.json', { type: 'json' }); } catch (e) {}
  }

  if (format === 'json') {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      body: JSON.stringify({ ok: true, audit, recent: audits.slice(0, 30) }, null, 2),
    };
  }

  // HTML view
  let mainSection = '';
  if (!audit) {
    mainSection = `
      <div style="background:#1A2025;border:1px solid rgba(255,193,7,0.3);border-radius:8px;padding:18px;color:#FFD740;">
        ⚠ No audits found yet.<br>
        <span style="font-size:12px;color:rgba(237,229,216,0.6);">The site-audit cron runs daily at 09:00 UTC. Trigger one manually:
        <code style="background:#0a0d12;padding:2px 6px;border-radius:4px;color:#FF8C1A;">POST /.netlify/functions/pulse-machine-site-audit-background?key=pulsemachine</code></span>
      </div>`;
  } else {
    const recs = audit.recommendations || [];
    const ts = audit.ts ? new Date(audit.ts).toISOString().replace('T', ' ').slice(0, 16) + ' UTC' : '—';

    const recsHtml = recs.map((r, i) => {
      const color = PRIORITY_COLOR[r.priority] || '#94a3b8';
      const icon = TYPE_ICON[r.type] || '◆';
      return `
        <div style="background:#0e131c;border:1px solid rgba(255,255,255,0.08);border-left:4px solid ${color};border-radius:8px;padding:14px 16px;margin-bottom:10px;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:wrap;">
            <span style="font-size:11px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;color:${color};padding:2px 8px;background:rgba(${color === '#ef4444' ? '239,68,68' : color === '#FFD740' ? '255,215,64' : '148,163,184'},0.15);border-radius:99px;">${escHtml(r.priority || 'med')} · ${escHtml(r.estimated_effort || '?')}</span>
            <span style="font-size:11px;font-weight:700;color:rgba(237,229,216,0.6);text-transform:uppercase;letter-spacing:1px;">${icon} ${escHtml(r.type || '—')}</span>
            <span style="font-size:11px;color:rgba(237,229,216,0.4);font-family:monospace;">${escHtml(r.target_page || '—')}</span>
          </div>
          <div style="font-size:14px;font-weight:700;color:#fff;line-height:1.4;margin-bottom:6px;">${escHtml(r.proposed_change || '')}</div>
          <div style="font-size:12px;color:rgba(237,229,216,0.7);line-height:1.55;margin-bottom:6px;"><strong style="color:rgba(237,229,216,0.85);">Current:</strong> ${escHtml(r.current_state || '—')}</div>
          <div style="font-size:12px;color:rgba(237,229,216,0.55);line-height:1.5;font-style:italic;">↳ ${escHtml(r.rationale || '')} <span style="color:rgba(237,229,216,0.35);">${r.data_signal ? '· ' + escHtml(r.data_signal) : ''}</span></div>
        </div>`;
    }).join('') || '<div style="color:rgba(237,229,216,0.5);">No recommendations in this audit.</div>';

    const ctxLine = audit.context_summary
      ? `Library entries reviewed: ${audit.context_summary.library_recent_count || 0} · Visitor offerings: ${audit.context_summary.visitor_offerings_count || 0} · Intent companies: ${audit.context_summary.intent_top_companies || 0}`
      : '';

    mainSection = `
      <div style="font-size:11px;color:rgba(237,229,216,0.45);font-family:monospace;margin-bottom:6px;">id: ${escHtml(audit.id || targetId)} · generated ${escHtml(ts)}</div>
      <div style="font-size:11px;color:rgba(237,229,216,0.5);margin-bottom:18px;">${escHtml(ctxLine)}</div>

      <div style="font-size:11px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;color:#FF8C1A;margin:18px 0 10px;">${recs.length} recommendation${recs.length === 1 ? '' : 's'}</div>
      ${recsHtml}
    `;
  }

  // Recent audits sidebar (clickable)
  const recentRows = audits.slice(0, 30).map(a => {
    const tsLabel = a.ts ? new Date(a.ts).toISOString().slice(0, 10) + ' ' + new Date(a.ts).toISOString().slice(11, 16) : '—';
    const isCurrent = a.id === targetId;
    return `
      <tr ${isCurrent ? 'style="background:rgba(232,113,10,0.08);"' : ''}>
        <td><a href="?key=${ADMIN_KEY}&id=${a.id}" style="color:${isCurrent ? '#FFD740' : '#FF8C1A'};font-family:monospace;font-size:11px;">${escHtml(a.id)}</a></td>
        <td style="text-align:center;font-size:12px;">${a.rec_count || 0}</td>
        <td style="text-align:right;color:rgba(237,229,216,0.5);font-size:11px;">${escHtml(tsLabel)}</td>
      </tr>
    `;
  }).join('');

  const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>Site Audits · PULSE</title>
<style>
  body { background:#0a0d12; color:#EDE5D8; font-family:'Segoe UI',system-ui,sans-serif; padding:32px 16px; margin:0; min-height:100vh; }
  .wrap { max-width:880px; margin:0 auto; }
  h1 { color:#FF8C1A; font-size:13px; letter-spacing:2px; text-transform:uppercase; margin:0 0 4px; }
  h2 { font-family:Georgia,serif; font-size:24px; font-weight:800; color:#fff; margin:0 0 8px; }
  table { width:100%; border-collapse:collapse; margin-top:8px; font-size:13px; }
  table td { padding:6px 10px; border-bottom:1px solid rgba(255,255,255,0.06); }
</style></head>
<body><div class="wrap">
  <h1>◉ Pulse Machine — Site Audit</h1>
  <h2>Recommendations from Sonnet</h2>
  ${mainSection}

  <div style="margin-top:36px;padding-top:18px;border-top:1px solid rgba(255,255,255,0.08);">
    <div style="font-size:11px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;color:#94a3b8;margin-bottom:10px;">Recent audits (click to view)</div>
    <table>${recentRows || '<tr><td colspan="3" style="color:rgba(237,229,216,0.4);">No prior audits.</td></tr>'}</table>
  </div>
</div></body></html>`;

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
    body: html,
  };
};
