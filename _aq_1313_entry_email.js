// Immediate email when an Aquarium entry passes 13/13 + gold audit on save.
// Usage: await notifyAq1313Entry({ id, title, body, template, grade, url, wordCount, imageCount })
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const RECIPIENT = 'koryjordanwhite@gmail.com';
const KEY_CACHE = WD + '/_ask_owner_key.cache';
const LOG_F = WD + '/_aq_1313_entry_email.log';
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

for (const l of (() => {
  try { return fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/); } catch (e) { return []; }
})()) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const { auditTop10GoldTemplate } = require('./_ranking_top10_gold_template');
const { auditQaGoldTemplate } = require('./_qa_gold_template');
const { pillarUrl } = require('./_ranking_list_rebuild_lib');
const { wordCount } = require('./_format_fixer_lib');
const { auditImages } = require('./netlify/functions/lib/ensure-entry-images');

function env(k) {
  try {
    const m = fs.readFileSync(WD + '/.env.local', 'utf8').match(new RegExp('^' + k + '=(.+)$', 'm'));
    return m ? m[1].trim() : '';
  } catch (e) {
    return '';
  }
}

function log(msg) {
  const line = new Date().toISOString() + ' ' + msg;
  try { fs.appendFileSync(LOG_F, line + '\n'); } catch (e) {}
  console.log('[1313-email] ' + msg);
}

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function linkHtml(url, label) {
  const u = String(url || '').trim();
  const text = esc(label || u);
  return '<a href="' + u + '" style="color:#0b57d0;text-decoration:underline;font-weight:700" target="_blank" rel="noopener noreferrer">' + text + '</a>';
}

async function resendKey() {
  let k = env('resendapikey') || env('RESEND_API_KEY');
  if (k) return k;
  try { k = fs.readFileSync(KEY_CACHE, 'utf8').trim(); if (k) return k; } catch (e) {}
  const TOKEN = env('NETLIFY_AUTH_TOKEN');
  const s = await fetch('https://api.netlify.com/api/v1/sites/' + SITE, { headers: { Authorization: 'Bearer ' + TOKEN } }).then(r => r.json());
  const acct = s.account_slug || s.account_name;
  const r = await fetch('https://api.netlify.com/api/v1/accounts/' + acct + '/env/resendapikey?site_id=' + SITE, { headers: { Authorization: 'Bearer ' + TOKEN } });
  if (!r.ok) throw new Error('netlify env ' + r.status);
  const j = await r.json();
  const val = (j.values || []).find(v => v.context === 'all' || v.context === 'production') || (j.values || [])[0];
  k = val && val.value;
  if (!k) throw new Error('no resend key');
  try { fs.writeFileSync(KEY_CACHE, k); } catch (e) {}
  return k;
}

function templateLabel(template) {
  if (template === 'top10' || template === 'aq1158') return 'Top 10';
  if (template === 'qa' || template === 'q11133') return 'Q&A';
  return String(template || 'Unknown');
}

function countImages(id, body, template) {
  const b = String(body || '');
  if (template === 'top10' || template === 'aq1158') {
    const audit = auditImages(id, b);
    return audit.productImgs || (b.match(/^@@PRODUCT\b/gm) || []).length;
  }
  return (b.match(/!\[[^\]]*\]\([^)]+\)/g) || []).length;
}

function goldCompliant(id, body, title, template) {
  if (template === 'top10' || template === 'aq1158') {
    return auditTop10GoldTemplate(body, title).compliant;
  }
  if (template === 'qa' || template === 'q11133') {
    return auditQaGoldTemplate(body, title, id).compliant;
  }
  return false;
}

/**
 * Send immediate 13/13 notification if grade === 13 and gold audit passes.
 * Returns { sent: boolean, reason?: string }
 */
async function notifyAq1313Entry(opts) {
  opts = opts || {};
  const id = String(opts.id || '').toLowerCase();
  if (!/^aq\d+$/i.test(id)) return { sent: false, reason: 'not_aq' };

  const grade = opts.grade != null ? opts.grade : opts.quality_score;
  const forceTest = !!opts.forceTest;
  if (!forceTest && (grade == null || grade < 13)) return { sent: false, reason: 'grade_below_13' };

  const body = String(opts.body || '');
  const title = opts.title || opts.question || id;
  const template = opts.template || 'unknown';
  const url = opts.url || pillarUrl(id);

  if (!forceTest && !goldCompliant(id, body, title, template)) {
    return { sent: false, reason: 'gold_audit_fail' };
  }

  const tplLabel = templateLabel(template);
  const isQa = template === 'qa' || template === 'q11133';
  const goldRef = isQa ? 'q11133' : 'aq1158';
  const wc = opts.wordCount != null ? opts.wordCount : wordCount(body);
  const imgs = opts.imageCount != null ? opts.imageCount : countImages(id, body, template);
  const subject = (forceTest ? '[TEST] ' : '') + '✅ 13/13 · ' + id + ' · ' + tplLabel;

  const html = `<div style="font-family:system-ui,Arial,sans-serif;font-size:15px;line-height:1.6;color:#15110d;max-width:640px">
    <p style="font-size:18px;font-weight:800;margin:0 0 8px">✅ 13/13 · ${esc(id)} · ${esc(tplLabel)}</p>
    <p style="margin:0 0 6px;font-size:13px;color:#0b57d0;font-weight:700">${isQa ? 'General Q&amp;A · q11133 gold law' : 'Top 10 ranking · aq1158 gold law'}</p>
    <p style="margin:0 0 12px;font-weight:700">${esc(title)}</p>
    <p style="margin:0 0 14px">${linkHtml(url, url)}</p>
    <table style="border-collapse:collapse;font-size:14px">
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">ID</td><td><b>${esc(id)}</b></td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Shape</td><td><b>${esc(tplLabel)}</b> (${goldRef})</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Grade</td><td><b>13/13</b></td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Words</td><td>${wc}</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Images</td><td>${imgs}${isQa ? '' : ' product'}</td></tr>
    </table>
    <p style="color:#8a7a63;font-size:12px;margin-top:14px">${new Date().toLocaleString()} · Aquarium dual-gold redo</p>
  </div>`;

  const key = await resendKey();
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'PULSE Engine <onboarding@resend.dev>',
      to: [RECIPIENT],
      subject,
      html,
    }),
  });
  const txt = await r.text();
  if (!r.ok) throw new Error('resend ' + r.status + ' ' + txt.slice(0, 160));
  log('sent · ' + id + ' · ' + tplLabel + ' · ' + wc + 'w · ' + imgs + ' imgs');
  return { sent: true, subject };
}

module.exports = {
  notifyAq1313Entry,
  RECIPIENT,
  templateLabel,
};

if (require.main === module) {
  const testId = (process.argv.find(a => a.startsWith('--id=')) || '').split('=')[1] || '';
  const testQa = process.argv.includes('--test-qa');
  const forceTest = process.argv.includes('--force');
  if (!testQa) {
    console.log('Usage: node _aq_1313_entry_email.js --test-qa [--id=aq1234] [--force]');
    process.exit(1);
  }
  (async () => {
    const { getStore } = require('@netlify/blobs');
    const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
    const { wordCount: wcFn } = require('./_format_fixer_lib');
    const id = String(testId || 'aq1160').toLowerCase();
    const store = getStore({ name: 'pulse-machine-library', siteID: SITE, token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
    const e = await store.get('answers/' + id + '.json', { type: 'json' });
    if (!e || !e.answer) throw new Error('missing entry: ' + id);
    const title = e.question || id;
    const grade = gradeEntry(id, e.answer).score;
    const r = await notifyAq1313Entry({
      id,
      title,
      body: e.answer,
      template: 'qa',
      grade: forceTest ? 13 : grade,
      url: pillarUrl(id),
      wordCount: wcFn(e.answer),
      forceTest,
    });
    console.log(JSON.stringify(r, null, 2));
  })().catch(e => {
    console.error(e.message);
    process.exit(1);
  });
}
