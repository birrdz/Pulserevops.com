// Audit ALL aquarium (aq) Q&A / essay entries for image rendering issues.
// Usage: node _audit_aq_qa_images.js [--email]
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const REPORT_F = WD + '/_aq_qa_image_audit.json';
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const RECIPIENT = 'koryjordanwhite@gmail.com';
const QA_MIN_IMAGES = 3;

for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const { getStore } = require('@netlify/blobs');
const { pickGoldTemplate } = require('./_pulse_gold_template_router');
const { auditImages } = require('./netlify/functions/lib/ensure-entry-images');
const { leadingImageMatch, isWeakCoverUrl } = require('./netlify/functions/lib/img-cover-lib');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const { auditQaGoldTemplate } = require('./_qa_gold_template');
const { isFillableImageUrl, isBrokenQaImageUrl, bodyPageImageUrls } = require('./_ddg_facecard_lib');
const { isKoryCroImg } = require('./_img_flux_lib');
const { libraryEntryPublicUrl } = require('./netlify/functions/lib/library-entry-url');

const BAD_URL = /pollinations\.ai|placeholder\.svg|\/img\/auto\/|lightbulb|pulse-logo|kory-white|pravatar|growleads|cro-cover|unsplash\.com\/photo/i;
const WRONG_TOPICAL = /\b(?:CRM|RevOps|sales\s+funnel|revenue\s+team|business\s+team|legacy\s+CRM|sales\s+operations|data\s+center\s+infrastructure)\b/i;

const SEND_EMAIL = process.argv.includes('--email');

function extractImages(body) {
  const all = [];
  for (const m of String(body || '').matchAll(/!\[([^\]]*)\]\(([^)\s]+)\)/g)) {
    all.push({ alt: m[1], url: m[2], kind: 'inline' });
  }
  for (const m of String(body || '').matchAll(/@@PRODUCT[^\n]* img="([^"]+)"/g)) {
    all.push({ alt: 'product', url: m[1], kind: 'product' });
  }
  return all;
}

function directAnswerBlock(body) {
  const m = String(body || '').match(/(?:^|\n)##\s+Direct\s+Answer[\s\S]*?(?=\n##\s+|$)/i);
  return m ? m[0] : '';
}

function heroNotFirstLine(body) {
  const b = String(body || '').trim();
  if (!b) return false;
  const firstNonEmpty = b.split('\n').find(l => l.trim());
  if (!firstNonEmpty) return false;
  return !/^﻿?\s*!\[[^\]]*\]\([^)]+\)/.test(firstNonEmpty);
}

function localAssetMissing(url) {
  const u = String(url || '').trim();
  if (!/^\/assets\//.test(u)) return false;
  try {
    const st = fs.statSync(WD + u);
    return !st.isFile() || st.size < 8000;
  } catch (e) {
    return true;
  }
}

function classifyUrl(url, id, alt) {
  const u = String(url || '').trim();
  const issues = [];
  if (!u) issues.push('empty_url');
  if (BAD_URL.test(u)) issues.push('broken_weak_url');
  if (/pollinations\.ai/i.test(u)) issues.push('pollinations_url');
  if (/placeholder\.svg/i.test(u)) issues.push('placeholder_url');
  if (/^https?:\/\//i.test(u) && !/pulserevops\.com/i.test(u)) issues.push('external_hotlink');
  if (isFillableImageUrl(u)) issues.push('fillable_url');
  if (isBrokenQaImageUrl(u, id, {})) issues.push('broken_render');
  if (localAssetMissing(u)) issues.push('missing_local_asset');
  if (isKoryCroImg(u) || /\/assets\/cro-cover-/i.test(u) || /kory-white/i.test(u)) issues.push('cro_kory_image');
  if (WRONG_TOPICAL.test(decodeURIComponent(u)) || WRONG_TOPICAL.test(String(alt || ''))) issues.push('wrong_topical_image');
  return issues;
}

function duplicateUrlsInEntry(images) {
  const seen = new Map();
  const dupes = [];
  for (const im of images) {
    const u = String(im.url || '').trim();
    if (!u) continue;
    if (seen.has(u)) dupes.push({ url: u.slice(0, 120) });
    else seen.set(u, im.alt);
  }
  return dupes;
}

function auditEntry(id, title, body) {
  const images = extractImages(body);
  const issueTypes = {};
  const samples = [];
  const bump = (type, sample) => {
    issueTypes[type] = (issueTypes[type] || 0) + 1;
    if (sample && samples.length < 12) samples.push({ type, ...sample });
  };

  const imgAudit = auditImages(id, body);
  const gold = auditQaGoldTemplate(body, title, id);
  const grade = gradeEntry(id, body);
  const pageUrls = [...bodyPageImageUrls(body)];

  if (!imgAudit.coverOk) bump('missing_or_weak_hero', { url: (leadingImageMatch(body) || [])[2] || '' });
  if (gold.issues && gold.issues.includes('missing_top_hero')) bump('missing_top_hero', {});
  if (heroNotFirstLine(body) && images.length) bump('hero_not_first_line', { url: images[0] && images[0].url });

  if (images.length < QA_MIN_IMAGES) bump('too_few_images', { count: images.length, min: QA_MIN_IMAGES });

  const da = directAnswerBlock(body);
  if (da) {
    for (const m of da.matchAll(/!\[[^\]]*\]\(([^)\s]+)\)/g)) {
      bump('image_in_direct_answer', { url: m[1].slice(0, 120) });
    }
  }

  for (const dupe of duplicateUrlsInEntry(images)) bump('duplicate_url_same_entry', { url: dupe.url });

  for (const im of images) {
    for (const t of classifyUrl(im.url, id, im.alt)) bump(t, { url: im.url.slice(0, 120), alt: String(im.alt).slice(0, 60) });
  }

  if (grade.criteria && grade.criteria.images_law === false) bump('images_law_fail', { score: grade.score });

  const brokenCount = pageUrls.filter(u => isBrokenQaImageUrl(u, id, {})).length;
  if (brokenCount > 0) bump('entry_has_broken_urls', { count: brokenCount });

  const issueCount = Object.values(issueTypes).reduce((a, b) => a + b, 0);
  const severity =
    (issueTypes.missing_or_weak_hero || 0) * 5 +
    (issueTypes.missing_top_hero || 0) * 5 +
    (issueTypes.too_few_images || 0) * 4 +
    (issueTypes.broken_render || 0) * 2 +
    (issueTypes.broken_weak_url || 0) * 3 +
    (issueTypes.pollinations_url || 0) * 3 +
    (issueTypes.missing_local_asset || 0) * 4 +
    (issueTypes.external_hotlink || 0) * 2 +
    (issueTypes.cro_kory_image || 0) * 4 +
    (issueTypes.wrong_topical_image || 0) * 5 +
    (issueTypes.duplicate_url_same_entry || 0) * 2 +
    (issueTypes.image_in_direct_answer || 0) * 3 +
    (issueTypes.fillable_url || 0) * 1 +
    (issueTypes.images_law_fail || 0) * 3;

  return {
    id,
    title: String(title || '').slice(0, 100),
    url: libraryEntryPublicUrl({ id }) || `https://pulserevops.com/aquariums/${id}`,
    imageCount: images.length,
    brokenUrlCount: brokenCount,
    coverOk: imgAudit.coverOk,
    gradeScore: grade.score,
    goldCompliant: !!gold.compliant,
    issueTypes,
    issueCount,
    severity,
    samples,
    urls: [...new Set(images.map(i => i.url))].slice(0, 8),
  };
}

function rollup(entries) {
  const byType = {};
  let withIssues = 0;
  for (const e of entries) {
    if (e.issueCount > 0) withIssues++;
    for (const [t, n] of Object.entries(e.issueTypes || {})) {
      byType[t] = (byType[t] || 0) + n;
    }
  }
  return { byType, withIssues };
}

function env(k) {
  try {
    const m = fs.readFileSync(WD + '/.env.local', 'utf8').match(new RegExp('^' + k + '=(.+)$', 'm'));
    return m ? m[1].trim() : '';
  } catch (e) {
    return '';
  }
}

async function resendKey() {
  const KEY_CACHE = WD + '/_ask_owner_key.cache';
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

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function sendAuditEmail(report) {
  const top10 = (report.worst || []).slice(0, 10);
  const rows = Object.entries(report.issueBreakdown.byType || {}).sort((a, b) => b[1] - a[1]);
  const batchFix = !!report.batchFixRecommended;

  const html = `<div style="font-family:system-ui,Arial,sans-serif;font-size:15px;line-height:1.6;color:#15110d;max-width:720px">
    <p style="font-size:18px;font-weight:800;margin:0 0 8px">🐠 AQ Q&amp;A image audit</p>
    <p style="margin:0 0 12px;color:#6b5d49">Scanned <b>${report.totalScanned}</b> aquarium Q&amp;A entries (not Top 10 rankings).</p>
    <table style="border-collapse:collapse;font-size:14px;margin-bottom:16px">
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Entries with issues</td><td><b>${report.withIssues}</b> / ${report.totalScanned}</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Clean entries</td><td><b>${report.clean}</b></td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Batch fix recommended</td><td><b>${batchFix ? 'YES — run fillEntryMissingImages on all 59' : 'NO — spot fixes OK'}</b></td></tr>
    </table>
    <p style="font-weight:700;margin:0 0 6px">Issue breakdown</p>
    <ul style="margin:0 0 16px;padding-left:18px">${rows.map(([k, v]) => `<li><code>${esc(k)}</code>: <b>${v}</b></li>`).join('') || '<li>none</li>'}</ul>
    <p style="font-weight:700;margin:0 0 6px">Top 10 worst entries</p>
    <ol style="margin:0;padding-left:18px">${top10.map(e => `<li><a href="${esc(e.url)}">${esc(e.id)}</a> — severity ${e.severity} · ${e.imageCount} imgs · ${Object.keys(e.issueTypes).join(', ')}</li>`).join('')}</ol>
    <p style="margin-top:14px;color:#8a7a63;font-size:13px">Report: <code>_aq_qa_image_audit.json</code> · ${new Date().toLocaleString()}</p>
  </div>`;

  const key = await resendKey();
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'PULSE Engine <onboarding@resend.dev>',
      to: [RECIPIENT],
      subject: '🐠 AQ Q&A image audit — ' + report.withIssues + '/' + report.totalScanned + ' entries with issues',
      html,
    }),
  });
  const txt = await r.text();
  if (!r.ok) throw new Error('resend ' + r.status + ' ' + txt.slice(0, 200));
  console.log('EMAIL_SENT', RECIPIENT);
}

(async () => {
  const store = getStore({
    name: 'pulse-machine-library',
    siteID: SITE,
    token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
  });

  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const aqRows = (idx.entries || []).filter(e => e && /^aq\d+$/i.test(e.id));
  const entries = [];
  let skippedTop10 = 0;
  let noBlob = 0;

  for (const row of aqRows) {
    let body = '';
    let title = row.question || '';
    try {
      const e = await store.get('answers/' + row.id + '.json', { type: 'json' });
      body = e && e.answer ? e.answer : '';
      title = (e && e.question) || title;
    } catch (err) {}
    if (!body) { noBlob++; continue; }

    const route = pickGoldTemplate(row.id, body, title);
    if (route.template !== 'qa') {
      skippedTop10++;
      continue;
    }

    entries.push(auditEntry(row.id, title, body));
  }

  entries.sort((a, b) => b.severity - a.severity || b.issueCount - a.issueCount);
  const roll = rollup(entries);
  const clean = entries.length - roll.withIssues;

  const report = {
    generated: new Date().toISOString(),
    pillar: 'aq',
    template: 'qa',
    totalAqEntries: aqRows.length,
    skippedTop10,
    noBlob,
    totalScanned: entries.length,
    withIssues: roll.withIssues,
    clean,
    issueBreakdown: roll,
    worst: entries.filter(e => e.issueCount > 0).slice(0, 25),
    all: entries,
    batchFixRecommended: roll.withIssues > 5 && (
      (roll.byType.pollinations_url || 0) > 50 ||
      (roll.byType.external_hotlink || 0) > 50 ||
      (roll.byType.broken_render || 0) > 50
    ),
  };

  fs.writeFileSync(REPORT_F, JSON.stringify(report, null, 2));

  console.log('\n=== AQ Q&A IMAGE AUDIT ===');
  console.log('Total aq entries:', aqRows.length);
  console.log('Skipped (Top 10):', skippedTop10);
  console.log('Q&A scanned:', entries.length);
  console.log('With issues:', roll.withIssues, '/', entries.length);
  console.log('Clean:', clean);
  console.log('\nIssue breakdown:');
  for (const [k, v] of Object.entries(roll.byType).sort((a, b) => b[1] - a[1])) {
    console.log(' ', k + ':', v);
  }
  console.log('\nTop 10 worst:');
  for (const e of report.worst.slice(0, 10)) {
    console.log(' ', e.id, 'severity=' + e.severity, 'imgs=' + e.imageCount, Object.keys(e.issueTypes).join(','));
    console.log('   ', e.url);
  }
  console.log('\nWrote', REPORT_F);
  console.log('Batch fix recommended:', report.batchFixRecommended ? 'YES' : 'NO');

  if (SEND_EMAIL) await sendAuditEmail(report);
})().catch(err => {
  console.error('FATAL', err && err.stack ? err.stack : err);
  process.exit(1);
});
