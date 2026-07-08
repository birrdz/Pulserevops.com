// One-shot: email the two PULSE golden templates (ranking list + Q&A) to owner.
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const RECIPIENT = 'koryjordanwhite@gmail.com';
const KEY_CACHE = WD + '/_ask_owner_key.cache';
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

for (const l of (() => {
  try { return fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/); } catch (e) { return []; }
})()) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const { getStore } = require('@netlify/blobs');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const { auditRankingListMaster } = require('./_ranking_list_master_law');
const { auditImages } = require('./netlify/functions/lib/ensure-entry-images');
const { pillarUrl } = require('./_ranking_list_rebuild_lib');

const RANKING_ID = 'aq1158';
const QA_ID = 'q11133';

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function linkHtml(url, label) {
  const u = String(url || '').trim();
  const text = esc(label || u);
  return '<a href="' + u + '" style="color:#0b57d0;text-decoration:underline;font-weight:700" target="_blank" rel="noopener noreferrer">' + text + '</a>';
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

function analyzeEntry(id, body, title, e) {
  const grade = gradeEntry(id, body);
  const plain = body.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
  const wordCount = plain.split(/\s+/).filter(Boolean).length;
  const mermaidCount = (body.match(/```mermaid/g) || []).length;
  const productLines = (body.match(/^@@PRODUCT\b/gm) || []).length;
  const mdImgs = (body.match(/!\[[^\]]*\]\([^)]+\)/g) || []).length;
  const hasTopHero = /^!\[/.test(body.trim());
  const headings = body.split('\n').filter(l => /^#{1,3}\s/.test(l)).map(l => l.trim());
  const faqHeading = /^#{2,3}\s+FAQ/im.test(body);
  const relatedHeading = /^#{2,3}\s+Related/im.test(body);
  const directAnswer = /^#{2,3}\s+Direct\s+Answer/im.test(body);
  const rankingAudit = auditRankingListMaster(body, title);
  const imgAudit = auditImages(id, body);
  return {
    id,
    title: title || e.question,
    url: id.startsWith('aq') ? pillarUrl(id) : 'https://pulserevops.com/knowledge/' + id,
    format_v: e.format_v,
    cover_src: e.cover_src,
    wordCount,
    grade: grade.score,
    missing: grade.missing,
    mermaidCount,
    productLines,
    mdImgs,
    hasTopHero,
    headings,
    faqHeading,
    relatedHeading,
    directAnswer,
    rankingAudit,
    imgAudit,
    mediaCount: mdImgs + productLines,
  };
}

function rankingTemplateHtml(a) {
  const url = a.url;
  return `
  <h2 style="margin:24px 0 8px;font-size:20px">1. Top 10 / Ranking List — ${esc(a.id)}</h2>
  <p style="margin:0 0 10px"><b>Live reference:</b> ${linkHtml(url, url)}</p>
  <p style="margin:0 0 10px;color:#6b5d49">Documented in <code>_ranking_master_pillar_config.js</code> (sampleId), <code>_ranking_list_master_law.js</code> (4444 law), and <code>_ranking_list_rebuild_lib.js</code>. Current blob: <code>${esc(a.format_v || '')}</code>, cover_src <code>${esc(a.cover_src || '')}</code>.</p>
  <p style="margin:0 0 8px;font-weight:700">Page order (no top hero — product photos only)</p>
  <ol style="margin:0 0 12px;padding-left:22px;line-height:1.55">
    <li><b>H1 title</b> (rendered from index question, not in blob)</li>
    <li><b>Word count badge</b> (renderer)</li>
    <li><b>## Direct Answer</b> — gold box; names Best Overall (#1) and Best Value (#2) with prices</li>
    <li><b>## How We Ranked These Products</b> — weighted criteria bullets (5 factors, % weights)</li>
    <li><b>## 1. … 🏆 BEST OVERALL</b> through <b>## 10. …</b> — each pick has:
      <ul style="margin:6px 0 0;padding-left:18px">
        <li>One <code>@@PRODUCT name="…" img="…" site="…"</code> line (DDG/real product photo — <b>no separate top hero</b>)</li>
        <li>Body: Price/Cost, Pros, Cons, Verdict (bold product names &amp; specs)</li>
      </ul>
    </li>
    <li>Optional mid-body H2s (e.g. Essential Upgrades, Common Pitfalls) — allowed between ranks and tail</li>
    <li><b>## How to Choose</b> — includes <b>1+ mermaid</b> decision flowchart</li>
    <li><b>## What to Look For</b> — buyer checklist bullets</li>
    <li><b>## FAQ</b> — 4+ Q&amp;As (<code>**Question?**</code> format)</li>
    <li><b>## Bottom Line</b> — recap Best Overall + Best Value</li>
    <li><b>## Sources</b> — 5+ real references (manufacturer docs, community guides, review outlets)</li>
  </ol>
  <p style="margin:0 0 8px"><b>Images:</b> <b>0 top hero</b> · <b>${a.productLines} @@PRODUCT</b> product cards (live: ${a.imgAudit.productImgs} verified) · ${a.mdImgs} markdown images in blob</p>
  <p style="margin:0 0 8px"><b>Mermaid:</b> ${a.mermaidCount} diagram(s) (law requires ≥1; rebuild lib pads to 2 if short)</p>
  <p style="margin:0 0 8px"><b>Word count:</b> ${a.wordCount} words (ER floor: 1,800; this entry grades ${a.grade}/13)</p>
  <p style="margin:0 0 8px"><b>Grader checks:</b> Best Overall + Best Value pills, ${a.rankingAudit.expectedCount || 10} numbered sections, ranking_list_master ${a.rankingAudit.compliant ? '✅' : '❌ ' + (a.rankingAudit.issues || []).join(', ')}</p>
  <p style="margin:0 0 4px;color:#8a7a63;font-size:13px"><b>NOT in ranking lists:</b> top hero / entry-cover image, TL;DR, Related on PULSE (Q&amp;A only).</p>`;
}

function qaTemplateHtml(a) {
  const url = a.url;
  return `
  <h2 style="margin:24px 0 8px;font-size:20px">2. General Q&amp;A / Direct Answer — ${esc(a.id)}</h2>
  <p style="margin:0 0 10px"><b>Live reference:</b> ${linkHtml(url, url)}</p>
  <p style="margin:0 0 10px;color:#6b5d49">Documented in <code>grade-entry.js</code> (q11133 gold reference), <code>pulse-machine-visitor-autopilot-background.js</code> (Q11133_SYSTEM), and <code>_scrub_button_server.js</code> WRITE_SYS.</p>
  <p style="margin:0 0 8px;font-weight:700">Page order (hero + sections)</p>
  <ol style="margin:0 0 12px;padding-left:22px;line-height:1.55">
    <li><b>Top hero image</b> — <code>![alt](url)</code> as first line (face-card / topical photo; CRO card injects after Direct Answer on live page)</li>
    <li><b>## Direct Answer</b> — H2 (not H3); dense 3–5 sentence paragraph; concrete names, numbers, frameworks; <b>NO TL;DR</b></li>
    <li><b>5–7 numbered H2 sections</b> — <code>## 1. …</code> through <code>## 5./6./7. …</code>, each with <code>### N.X</code> subsections (2–4 each) and optional section images between blocks</li>
    <li><b>EXACTLY 2 mermaid</b> <code>flowchart TD</code> diagrams in different numbered sections (plain node labels)</li>
    <li><b>## Bottom Line</b> — mandatory H2; 2–3 sentence close with operating rhythm</li>
    <li><b>## FAQ</b> — 4–6 Q&amp;As (<code>**Question?**</code> then answer); scrubber target is 6</li>
    <li><b>## Sources</b> — 5–10 bulleted real named sources (research firms, filings, practitioner blogs)</li>
    <li><b>## Related on PULSE</b> — internal library link line</li>
  </ol>
  <p style="margin:0 0 8px"><b>Images:</b> <b>1 top hero</b> + section images between H2 blocks (live: ${a.mdImgs} markdown imgs; media law min 3 total)</p>
  <p style="margin:0 0 8px"><b>Mermaid:</b> ${a.mermaidCount} diagrams (grader requires ≥2 for Q&amp;A pillar)</p>
  <p style="margin:0 0 8px"><b>Word count:</b> ${a.wordCount} words (Q&amp;A floor: 1,100; scrubber target ~2,000; grades ${a.grade}/13)</p>
  <p style="margin:0 0 8px"><b>Grader checks:</b> direct_answer, h2_six_plus, two_mermaids, faq_section, sources_section, no TL;DR, lighter bold (≥8 spans)</p>
  <p style="margin:0 0 4px;color:#8a7a63;font-size:13px"><b>NOT in Q&amp;A:</b> @@PRODUCT lines, Best Overall/Value pills, numbered product ranking sections.</p>`;
}

(async () => {
  const store = getStore({
    name: 'pulse-machine-library',
    siteID: SITE,
    token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
  });

  const rankingEntry = await store.get('answers/' + RANKING_ID + '.json', { type: 'json' });
  const qaEntry = await store.get('answers/' + QA_ID + '.json', { type: 'json' });
  if (!rankingEntry || !qaEntry) throw new Error('missing blob entry');

  const ranking = analyzeEntry(RANKING_ID, rankingEntry.answer || '', rankingEntry.question, rankingEntry);
  const qa = analyzeEntry(QA_ID, qaEntry.answer || '', qaEntry.question, qaEntry);

  const html = `<div style="font-family:system-ui,Arial,sans-serif;font-size:15px;line-height:1.6;color:#15110d;max-width:720px">
    <p style="font-size:18px;font-weight:800;margin:0 0 8px">PULSE Golden Templates — verify before rules</p>
    <p style="margin:0 0 16px;color:#6b5d49">Two reference entries for your approval. Structural Integrity Guardrails are <b>not</b> applied yet — these are the live gold standards to sign off on first.</p>
    ${rankingTemplateHtml(ranking)}
    ${qaTemplateHtml(qa)}
    <hr style="border:none;border-top:1px solid #e8dfd0;margin:24px 0">
    <p style="margin:0 0 8px;font-weight:700">Quick links</p>
    <ul style="margin:0;padding-left:18px">
      <li>Ranking list: ${linkHtml(ranking.url, ranking.url)}</li>
      <li>Q&amp;A: ${linkHtml(qa.url, qa.url)}</li>
      <li>Aquariums hub: ${linkHtml('https://pulserevops.com/aquariums', 'https://pulserevops.com/aquariums')}</li>
      <li>Knowledge hub: ${linkHtml('https://pulserevops.com/knowledge', 'https://pulserevops.com/knowledge')}</li>
    </ul>
    <p style="color:#8a7a63;font-size:12px;margin-top:16px">Sent ${new Date().toLocaleString()} · Reply to approve or request changes before rules translation.</p>
  </div>`;

  const subject = 'PULSE Golden Templates — Top 10 (aq1158) + Q&A (q11133)';

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
  if (!r.ok) throw new Error('resend ' + r.status + ' ' + txt.slice(0, 200));

  console.log('EMAIL_SENT ok to', RECIPIENT);
  console.log('RANKING', RANKING_ID, ranking.url, 'grade', ranking.grade, 'words', ranking.wordCount, 'products', ranking.productLines, 'hero', ranking.hasTopHero);
  console.log('QA', QA_ID, qa.url, 'grade', qa.grade, 'words', qa.wordCount, 'mermaid', qa.mermaidCount, 'hero', qa.hasTopHero);
})().catch(err => {
  console.error('ERR', err.message);
  process.exit(1);
});
