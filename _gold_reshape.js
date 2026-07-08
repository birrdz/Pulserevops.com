// _gold_reshape.js — DETERMINISTIC Q&A golden reshaper (owner 2026-07-07 "cookie cutter").
// The geo entries already have the pieces (Direct Answer, content, images, FAQ, Sources, Related) — they just
// fail the audit on ORDER. This re-slots them into the fixed golden scaffold with zero AI (no drift, instant):
//   Direct Answer (first) → intro prose → content H2s (text→image) → Related questions → [Bottom Line]
//   → FAQ → Sources → Related on PULSE
// Also strips leading images (image_before_direct_answer) and live pollinations URLs (self-host law).
'use strict';

function reshapeQaToGold(body) {
  let b = String(body || '').replace(/\r\n/g, '\n').trim();
  // 1. drop image lines whose URL is a LIVE pollinations endpoint (self-hosted-only law)
  b = b.replace(/^!\[[^\]]*\]\((?:https?:)?\/\/[^)]*pollinations\.ai[^)]*\)[ \t]*$/gim, '');
  // 2. strip any leading images before the first heading (image_before_direct_answer)
  b = b.replace(/^(?:\s*!\[[^\]]*\]\([^)]+\)\s*\n+)+/, '');
  // 3. split into intro (before first ##) and ## sections
  const firstH2 = b.search(/^##\s/m);
  const intro = firstH2 >= 0 ? b.slice(0, firstH2).trim() : b.trim();
  const rest = firstH2 >= 0 ? b.slice(firstH2) : '';
  const parts = rest.split(/(?=^##\s)/m).map(s => s.trim()).filter(Boolean);
  // 4. classify sections
  let da = null, relatedQ = null, bottom = null, faq = null, sources = null, relatedPulse = null;
  const content = [];
  for (const p of parts) {
    const h = ((p.match(/^##\s+(.+)$/m) || [])[1] || '').trim();
    const hl = h.toLowerCase();
    if (/^direct answer\b/i.test(h) && !da) da = p;
    else if (/related questions/i.test(hl) && !relatedQ) relatedQ = p;
    else if (/^bottom line\b/i.test(hl) && !bottom) bottom = p;
    else if (/^faq\b|^frequently asked/i.test(hl) && !faq) faq = p;
    else if (/^(sources|references)\b/i.test(hl) && !sources) sources = p;
    else if (/related on pulse/i.test(hl) && !relatedPulse) relatedPulse = p;
    else content.push(p);
  }
  // 5. reassemble in the locked golden order
  const out = [];
  if (da) out.push(da);
  if (intro) out.push(intro);                 // intro prose AFTER the Direct Answer gold box
  out.push(...content);                        // depth sections (text→image), original order
  if (relatedQ) out.push(relatedQ);
  if (bottom) out.push(bottom);
  if (faq) out.push(faq);
  if (sources) out.push(sources);
  if (relatedPulse) out.push(relatedPulse);
  return out.join('\n\n').replace(/\n{3,}/g, '\n\n').trim();
}

module.exports = { reshapeQaToGold };
