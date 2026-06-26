const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const { sendProgressEmail } = require('./_progress_email');

try {
  const e = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of e.split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (_) {}

const ts = new Date().toISOString();

(async () => {
  const s = getStore({
    name: 'pulse-machine-library',
    siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
    token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN,
  });
  const st = (await s.get('_economy_cro_infinite_state.json', { type: 'json' })) || {};
  const hb = (await s.get('_economy_cro_infinite_heartbeat.json', { type: 'json' })) || {};

  let cgDone = 0;
  let cgLast = '—';
  try {
    const p = JSON.parse(fs.readFileSync('C:/Users/koryj/website/_cg_sprint300_progress.json', 'utf8'));
    cgDone = (p.done || []).length;
    cgLast = (p.done || []).slice(-1)[0] || '—';
  } catch (_) {}

  const html = `<p><b>PULSE status update — ${ts.slice(0, 16).replace('T', ' ')} UTC</b></p>

<h3>Netlify deploy (live)</h3>
<ul>
  <li>Production: <a href="https://pulserevops.com">pulserevops.com</a></li>
  <li>Deploy: <code>6a39deb1902aa7492bcaf84c</code></li>
  <li>Economy cron: <b>every 2 min</b> — <code>pulse-cro-economy-tick-background</code></li>
  <li>Topics: RevOps Google-top → long-tail</li>
</ul>

<h3>Economy Q&amp;A cron</h3>
<table border="1" cellpadding="6" cellspacing="0">
<tr><td>Posted (total)</td><td><b>${st.posted ?? '?'}</b></td></tr>
<tr><td>Next ID</td><td><b>q${st.nextId ?? '?'}</b></td></tr>
<tr><td>Topic gen</td><td>${st.topicGen || '—'}</td></tr>
<tr><td>Queue remaining</td><td>${Math.max(0, (st.queue?.length || 0) - (st.cursor || 0))}</td></tr>
<tr><td>Cancelled</td><td>${st.cancelled ? 'YES' : 'no'}</td></tr>
</table>
<p><b>Last tick heartbeat</b> (${hb.ts ? new Date(hb.ts).toISOString() : 'none yet'}):</p>
<ul>
  <li>OK: ${hb.ok ?? '—'}</li>
  <li>Last Q: ${hb.id ? `<a href="https://pulserevops.com/knowledge/${hb.id}">${hb.id}</a>` : '—'}</li>
  <li>Last ST: ${hb.stId || '—'}</li>
  <li>SEO pass: ${hb.seo?.seoOk ?? '—'}</li>
  <li>IndexNow: ${hb.index?.ok ?? '—'}</li>
  <li>Elapsed: ${hb.elapsed_ms ?? '—'}ms</li>
</ul>

<h3>Pulse Coaching (CG) sprint — local DDG batch</h3>
<ul>
  <li>Live CG entries: <b>393</b> (cg0001 → cg0690)</li>
  <li>Sprint300 progress: <b>${cgDone} / 300</b> — latest <b>${cgLast}</b></li>
  <li>150-entry batch: ~${Math.min(cgDone - 116, 150)} / 150 from cg0635 (still running on DDG)</li>
  <li>Pillar: <a href="https://pulserevops.com/coaching">/coaching</a></li>
</ul>

<h3>Git / infra notes</h3>
<ul>
  <li>Commit <code>96f9302</code>: CG sprint runner + <code>--limit</code> (not pushed — no remote)</li>
  <li>Grok API: not configured (DDG + Pollinations + Gemini fallback)</li>
</ul>

<p style="color:#666;font-size:12px;">Sent ${ts}</p>`;

  const r = await sendProgressEmail(`PULSE status — deploy + 2min Q&A cron + CG sprint`, html);
  console.log(JSON.stringify(r, null, 2));
  if (!r.ok) process.exit(1);
})();
