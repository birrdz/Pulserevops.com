// ════════════════════════════════════════════════════════════════════════
// pulse-machine-daily-recap — end-of-day digest of everything the Machine
// researched in the last 24 hours.
//
// Runs once per day at 00:05 UTC (cron: "5 0 * * *"), pulls every entry
// where day === yesterday's UTC date, and emails Kory a styled HTML
// summary with question, tags, snippet excerpt, and a per-entry link.
//
// Email is throttled: one send per UTC day (idempotent if cron retries).
// ════════════════════════════════════════════════════════════════════════

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

const SITE = 'https://pulserevops.com';

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

function dayKey(d) {
  const x = d || new Date();
  return x.toISOString().slice(0, 10);
}

function yesterdayKey() {
  const y = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return dayKey(y);
}

function stripMd(s) {
  return String(s || '')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/^\s*>\s*/gm, '')
    .replace(/^\|.*\|\s*$/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function snippetOf(answer, n) {
  n = n || 200;
  const blocks = String(answer || '').split(/\n\s*\n/);
  for (const b of blocks) {
    const t = b.trim();
    if (!t) continue;
    if (/^#{1,6}\s/.test(t)) continue;
    if (/^[-=*_]{3,}\s*$/.test(t)) continue;
    if (/^```/.test(t)) continue;
    if (/^\|/.test(t)) continue;
    const cleaned = stripMd(t);
    if (cleaned.length < 40) continue;
    return cleaned.slice(0, n) + (cleaned.length > n ? '…' : '');
  }
  return stripMd(answer).slice(0, n);
}

exports.handler = async () => {
  const apiKey = process.env.RESEND_API_KEY || process.env.resendapikey;
  const to     = process.env.ALERT_TO_EMAIL || process.env.alert_to_email;
  const from   = process.env.ALERT_FROM_EMAIL || 'onboarding@resend.dev';

  if (!apiKey || !to) {
    console.warn('[recap] RESEND_API_KEY or ALERT_TO_EMAIL missing — skipping');
    return { statusCode: 200, body: 'no email config' };
  }

  const store = initStore();
  if (!store) {
    console.warn('[recap] blob store unavailable');
    return { statusCode: 200, body: 'no store' };
  }

  const day = yesterdayKey();

  // Idempotency: bail if we already sent today's recap (handles cron retries).
  try {
    const sentRec = await store.get('_recap_sent.json', { type: 'json' });
    if (sentRec && sentRec.day === day) {
      console.log('[recap] already sent for', day);
      return { statusCode: 200, body: 'already sent' };
    }
  } catch (e) {}

  // Pull index + filter to yesterday's entries.
  let entries = [];
  let libTotal = 0;
  try {
    const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
    libTotal = (idx.entries || []).length;
    entries = (idx.entries || []).filter(e => {
      if (!e || !e.ts) return false;
      return dayKey(new Date(e.ts)) === day;
    });
  } catch (e) {
    console.error('[recap] index read fail', e && e.message);
    return { statusCode: 200, body: 'index err' };
  }

  // Spend tally for the day (read meta — but meta resets daily so this only
  // works when the recap fires before the first cron of the new UTC day).
  let spendY = null;
  try {
    const meta = await store.get('_meta.json', { type: 'json' });
    if (meta && meta.day === day) spendY = meta.spend_today;
  } catch (e) {}

  // Pull pending pillar drafts staged by pulse-machine-publish-prep cron.
  // These are the items the user needs to decide on each morning — the
  // central artifact of the daily-debrief workflow.
  let staged = [];
  try {
    const stagingIdx = await store.get('staging/_index.json', { type: 'json' });
    if (stagingIdx && Array.isArray(stagingIdx.drafts)) {
      staged = stagingIdx.drafts.slice(0, 10);
    }
  } catch (e) {}

  // For each entry, fetch a snippet of the answer for the email body.
  const top = entries.slice(0, 50);
  const fulls = await Promise.all(
    top.map(e => store.get('answers/' + e.id + '.json', { type: 'json' }).catch(() => null))
  );

  const dateLabel = new Date(day + 'T12:00:00Z').toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const statRow = `
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:18px 0 22px;border-collapse:separate;border-spacing:8px 0;">
      <tr>
        <td style="background:#1A2025;border:1px solid rgba(232,113,10,0.3);border-radius:10px;padding:14px 16px;text-align:center;">
          <div style="font-size:11px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:#FF8C1A;">New Answers</div>
          <div style="font-size:22px;font-weight:900;color:#fff;margin-top:4px;">${entries.length}</div>
        </td>
        <td style="background:#1A2025;border:1px solid rgba(232,113,10,0.3);border-radius:10px;padding:14px 16px;text-align:center;">
          <div style="font-size:11px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:#FF8C1A;">Library Total</div>
          <div style="font-size:22px;font-weight:900;color:#fff;margin-top:4px;">${libTotal}</div>
        </td>
        <td style="background:#1A2025;border:1px solid rgba(232,113,10,0.3);border-radius:10px;padding:14px 16px;text-align:center;">
          <div style="font-size:11px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:#FF8C1A;">Spend</div>
          <div style="font-size:22px;font-weight:900;color:#fff;margin-top:4px;">${spendY != null ? '$' + spendY.toFixed(2) : '—'}</div>
        </td>
      </tr>
    </table>`;

  // Pillar-draft section — only shown when there are drafts pending review.
  // Tells the user "open Claude Code, say 'review drafts'" in plain language.
  const stagedHtml = staged.length
    ? `<div style="margin:20px 0 6px;padding:14px 16px;background:rgba(232,113,10,0.08);border:1px solid rgba(232,113,10,0.35);border-left:4px solid #FF8C1A;border-radius:8px;">
         <div style="font-size:11px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:#FF8C1A;margin-bottom:6px;">⚠ ${staged.length} pillar draft${staged.length === 1 ? '' : 's'} waiting for review</div>
         <div style="font-size:13px;color:#EDE5D8;line-height:1.55;margin-bottom:8px;">The Machine bundled these tag-clusters into 1,000-word pillar pages overnight. Open Claude Code and say <code style="background:rgba(0,0,0,0.4);padding:1px 6px;border-radius:4px;color:#FFD740;font-family:monospace;">review drafts</code> to walk through them.</div>
         <ul style="margin:8px 0 0;padding-left:18px;color:rgba(237,229,216,0.78);font-size:12.5px;line-height:1.7;">
           ${staged.map(d => `<li><strong style="color:#fff;">${escHtml((d.title || d.slug || d.id || '').slice(0, 80))}</strong>${d.tags ? ` <span style="color:rgba(237,229,216,0.45);">· ${escHtml((Array.isArray(d.tags) ? d.tags.slice(0,3).join(' · ') : ''))}</span>` : ''}</li>`).join('')}
         </ul>
       </div>`
    : '';

  const itemsHtml = entries.length
    ? top.map((e, i) => {
        const full = fulls[i];
        const snippet = full && full.answer ? snippetOf(full.answer, 220) : '';
        const tagsLine = (e.tags || []).slice(0, 5).map(t =>
          `<span style="display:inline-block;background:rgba(232,113,10,0.12);color:#FF8C1A;font-size:10px;letter-spacing:1px;text-transform:uppercase;font-weight:700;padding:2px 8px;border-radius:99px;margin-right:4px;margin-top:4px;">${escHtml(t)}</span>`
        ).join('');
        return `
          <a href="${SITE}/knowledge/${escHtml(e.id)}" style="display:block;text-decoration:none;color:inherit;background:#0e131c;border:1px solid rgba(255,255,255,0.08);border-left:3px solid #E8710A;border-radius:8px;padding:14px 16px;margin-bottom:10px;">
            <div style="font-size:15px;font-weight:700;color:#EDE5D8;line-height:1.35;margin-bottom:6px;">${escHtml(e.question)}</div>
            ${snippet ? `<div style="font-size:13px;color:rgba(237,229,216,0.65);line-height:1.55;margin-bottom:8px;">${escHtml(snippet)}</div>` : ''}
            ${tagsLine ? `<div>${tagsLine}</div>` : ''}
          </a>`;
      }).join('')
    : `<div style="background:#1A2025;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:18px;color:#94a3b8;text-align:center;">No new entries researched on ${escHtml(dateLabel)}. Check the admin dashboard if this is unexpected.</div>`;

  const html = `<!doctype html>
<html>
<head><meta charset="utf-8"><title>Pulse Machine — Daily Recap · ${escHtml(dateLabel)}</title></head>
<body style="margin:0;padding:24px 16px;background:#070a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#EDE5D8;">
  <div style="max-width:640px;margin:0 auto;background:#111518;border:1px solid rgba(232,113,10,0.25);border-radius:14px;padding:28px 28px 32px;">
    <div style="font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#FF8C1A;margin-bottom:6px;">◉ Pulse Machine — Daily Recap</div>
    <h1 style="font-size:22px;font-weight:900;color:#fff;margin:0 0 4px;line-height:1.25;">The Machine's day</h1>
    <div style="font-size:13px;color:rgba(237,229,216,0.55);">${escHtml(dateLabel)}</div>
    ${statRow}
    ${stagedHtml}
    <div style="font-size:11px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;color:#FF8C1A;margin:8px 0 12px;">${entries.length} answers researched</div>
    ${itemsHtml}
    <div style="margin-top:24px;padding-top:18px;border-top:1px solid rgba(255,255,255,0.08);font-size:12px;color:rgba(237,229,216,0.5);line-height:1.7;">
      <a href="${SITE}/knowledge.html" style="color:#FF8C1A;text-decoration:none;font-weight:700;">📚 Open the library</a>
      &nbsp;·&nbsp;
      <a href="${SITE}/admin?key=pulsemachine" style="color:#FF8C1A;text-decoration:none;font-weight:700;">⚙ Admin dashboard</a>
      &nbsp;·&nbsp;
      <a href="${SITE}/rss.xml" style="color:#FF8C1A;text-decoration:none;font-weight:700;">📡 RSS</a>
    </div>
    <div style="margin-top:14px;font-size:11px;color:rgba(237,229,216,0.35);line-height:1.6;">
      Researched autonomously by the Pulse Machine · Claude Sonnet 4.6 + live web search · One follow-up answer in, ten new questions out, every hour.
    </div>
  </div>
</body>
</html>`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `🟠 Pulse Machine — ${entries.length} answers · ${dateLabel}`,
        html,
      }),
    });
    if (!res.ok) {
      const t = await res.text();
      console.error('[recap] resend fail', res.status, t.slice(0, 200));
      return { statusCode: 200, body: 'send fail' };
    }
    await store.setJSON('_recap_sent.json', { day, ts: Date.now(), count: entries.length });
    console.log('[recap] sent · day=' + day + ' count=' + entries.length);
    return { statusCode: 200, body: JSON.stringify({ ok: true, day, count: entries.length }) };
  } catch (e) {
    console.error('[recap] send err', e && e.message);
    return { statusCode: 200, body: 'send err' };
  }
};
