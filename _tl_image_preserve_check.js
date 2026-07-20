#!/usr/bin/env node
/**
 * Process one image-bearing tl finish unit and email before/after image inventory.
 */
process.env.GOLD_SKIP_IMG_GATE = '1';
const fs = require('fs');
const { spawn } = require('child_process');
const { getStore } = require('/workspace/node_modules/@netlify/blobs');
const { gradeEntry } = require('/workspace/netlify/functions/lib/grade-entry');

try {
  for (const line of fs.readFileSync('/tmp/aq-drip.env', 'utf8').split(/\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith("'") && v.endsWith("'")) || (v.startsWith('"') && v.endsWith('"'))) v = v.slice(1, -1);
    if (!process.env[m[1]]) process.env[m[1]] = v;
  }
} catch (_e) {}

const cfg = require('/home/ubuntu/.config/netlify/config.json');
const token = Object.values(cfg.users || {})[0].auth.token;
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token });

function inventory(entry) {
  const body = String((entry && entry.answer) || '');
  const md = body.match(/!\[[^\]]*\]\([^)]+\)/g) || [];
  const html = body.match(/<img\b[^>]*>/gi) || [];
  const products = body.match(/^@@PRODUCT\b[^\n]*/gm) || [];
  const coverFields = {
    img: (entry && entry.img) || null,
    cover: (entry && entry.cover) || null,
    face_path: (entry && entry.face_path) || null,
    cover_src: (entry && entry.cover_src) || null,
  };
  const coverOk = !!(coverFields.img || coverFields.cover || coverFields.face_path);
  const mdUrls = md.map((m) => (m.match(/\(([^)]+)\)/) || [])[1] || '');
  const kinds = { assets: 0, pexels: 0, pollinations: 0, other: 0 };
  for (const u of mdUrls) {
    if (/\/assets\//i.test(u) || /pulserevops\.com\/assets/i.test(u)) kinds.assets++;
    else if (/pexels/i.test(u)) kinds.pexels++;
    else if (/pollinations/i.test(u)) kinds.pollinations++;
    else kinds.other++;
  }
  return {
    mdCount: md.length,
    htmlCount: html.length,
    productCount: products.length,
    coverOk,
    coverFields,
    kinds,
    mdSamples: md.slice(0, 6),
    visibleOnPageLikely: md.length + html.length + products.length > 0 || coverOk,
  };
}

async function emailProof(payload) {
  const key = process.env.RESEND_API_KEY || process.env.resendapikey;
  const to = process.env.ALERT_TO || 'koryjordanwhite@gmail.com';
  const from = process.env.ALERT_FROM_EMAIL || 'PULSE Engine <onboarding@resend.dev>';
  const b = payload.before;
  const a = payload.after;
  const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const html = `<div style="font-family:Arial,sans-serif;line-height:1.5">
    <div style="background:#B91C1C;color:#fff;padding:14px 18px;font-weight:700;font-size:20px">🔴 RED LIGHT — image-preserve check</div>
    <div style="padding:16px;border:3px solid #B91C1C;background:#FEF2F2">
      <p><b>${payload.id}</b> · score ${payload.beforeScore} → ${payload.afterScore} · pass=${payload.pass}</p>
      <p><a href="https://pulserevops.com/tools/${payload.id}">https://pulserevops.com/tools/${payload.id}</a></p>
      <h3>Can counts lie?</h3>
      <ul>
        <li><b>Yes — “0 images” in body</b> can still have a cover/face card in <code>img</code>.</li>
        <li><b>Yes — markdown count &gt; 0</b> can still be broken/missing files on disk.</li>
        <li>Renderer can also show cover even when section markdown is empty.</li>
      </ul>
      <table style="border-collapse:collapse;font-size:14px">
        <tr><th style="text-align:left;padding:4px 10px 4px 0"></th><th>Before</th><th>After</th></tr>
        <tr><td style="padding:2px 10px 2px 0">Markdown images</td><td>${b.mdCount}</td><td>${a.mdCount}</td></tr>
        <tr><td style="padding:2px 10px 2px 0">HTML img tags</td><td>${b.htmlCount}</td><td>${a.htmlCount}</td></tr>
        <tr><td style="padding:2px 10px 2px 0">@@PRODUCT lines</td><td>${b.productCount}</td><td>${a.productCount}</td></tr>
        <tr><td style="padding:2px 10px 2px 0">Cover/face field</td><td>${b.coverOk ? 'YES' : 'no'}</td><td>${a.coverOk ? 'YES' : 'no'}</td></tr>
        <tr><td style="padding:2px 10px 2px 0">Likely visible</td><td>${b.visibleOnPageLikely}</td><td>${a.visibleOnPageLikely}</td></tr>
        <tr><td style="padding:2px 10px 2px 0">assets/pexels/pollinations</td><td>${b.kinds.assets}/${b.kinds.pexels}/${b.kinds.pollinations}</td><td>${a.kinds.assets}/${a.kinds.pexels}/${a.kinds.pollinations}</td></tr>
      </table>
      <p><b>Cover before:</b> <code>${esc(b.coverFields.img || b.coverFields.cover || b.coverFields.face_path || '(none)')}</code></p>
      <p><b>Cover after:</b> <code>${esc(a.coverFields.img || a.coverFields.cover || a.coverFields.face_path || '(none)')}</code></p>
      <p><b>Markdown after:</b><br>${(a.mdSamples || []).map((s) => '<code>' + esc(s) + '</code>').join('<br>') || '(none)'}</p>
      <p style="margin-top:12px"><b>Verdict:</b> ${esc(payload.verdict)}</p>
      <p style="color:#666;font-size:12px">${new Date().toISOString()}</p>
    </div>
  </div>`;
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `🔴 RED LIGHT — image check ${payload.id} (md ${b.mdCount}→${a.mdCount}, cover ${b.coverOk}→${a.coverOk})`,
      html,
      text: `image check ${payload.id} md ${b.mdCount}->${a.mdCount} cover ${b.coverOk}->${a.coverOk}`,
    }),
  });
  const t = await r.text();
  console.log('EMAIL', r.status, t.slice(0, 180));
  if (!r.ok) throw new Error('email failed ' + r.status);
}

function runOnce() {
  return new Promise((resolve, reject) => {
    const child = spawn('node', ['/workspace/_tl_finish_drip.js'], {
      env: Object.assign({}, process.env, { ONCE: '1', GOLD_SKIP_IMG_GATE: '1', INTERVAL_MS: '1000' }),
      stdio: 'inherit',
    });
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error('once exit ' + code))));
  });
}

(async () => {
  const candidates = ['tl0110', 'tl0140', 'tl0131', 'tl0127', 'tl0141'];
  let id = null;
  let entry = null;
  let before = null;
  for (const c of candidates) {
    const e = await store.get('answers/' + c + '.json', { type: 'json', consistency: 'strong' });
    if (!e) continue;
    const inv = inventory(e);
    if (inv.mdCount >= 1) {
      id = c;
      entry = e;
      before = inv;
      break;
    }
  }
  if (!entry) throw new Error('no candidate with markdown images');

  const stPath = '/tmp/tl-finish-drip-state.json';
  const st = JSON.parse(fs.readFileSync(stPath, 'utf8'));
  const q = (st.queue || []).filter((x) => x !== id);
  q.splice(st.cursor || 0, 0, id);
  st.queue = q;
  fs.writeFileSync(stPath, JSON.stringify(st, null, 2));

  const beforeScore = gradeEntry(id, entry.answer, { imagesDeferred: true, title: entry.question }).score;
  console.log('BEFORE', JSON.stringify({ id, beforeScore, before }, null, 2));

  await runOnce();

  const afterEntry = await store.get('answers/' + id + '.json', { type: 'json', consistency: 'strong' });
  const after = inventory(afterEntry);
  const afterScore = gradeEntry(id, afterEntry.answer, { imagesDeferred: true, title: afterEntry.question }).score;
  const lostMd = after.mdCount < before.mdCount;
  const lostCover = before.coverOk && !after.coverOk;
  let verdict = 'Images preserved (markdown + cover intact).';
  if (lostMd || lostCover) verdict = 'IMAGE LOSS DETECTED.';
  else if (before.mdCount === 0 && before.coverOk) {
    verdict = 'Body markdown was 0 but cover existed — false “no images”.';
  }

  console.log('AFTER', JSON.stringify({ id, afterScore, after, verdict }, null, 2));
  await emailProof({
    id,
    beforeScore,
    afterScore,
    pass: afterScore >= 13,
    before,
    after,
    verdict,
  });

  // resume supervised drip if helper exists
  if (fs.existsSync('/tmp/run-tl-finish.sh') && !require('child_process').execSync('pgrep -f "node /workspace/_tl_finish_drip.js" || true').toString().includes('_tl_finish_drip.js')) {
    const out = fs.openSync('/tmp/tl-finish-drip.console.log', 'a');
    const child = spawn('/tmp/run-tl-finish.sh', [], { detached: true, stdio: ['ignore', out, out] });
    child.unref();
    console.log('drip resumed pid', child.pid);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
