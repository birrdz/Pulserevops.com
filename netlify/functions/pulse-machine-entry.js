// ════════════════════════════════════════════════════════════════════════
// pulse-machine-entry — server-renders one library entry as a full HTML
// page at its own URL, so every Q/A becomes independently indexable in
// Google + Perplexity + ChatGPT. Each entry gets:
//   - Per-page <title>, <meta description>, OG/Twitter cards
//   - QAPage + TechArticle JSON-LD with this entry as mainEntity
//   - Server-rendered markdown (so crawlers don't need to execute JS)
//   - Mermaid client-side render for diagrams
//   - Deep Dive cluster links (3 related entries by tag overlap)
//   - Citation cards
//
// Mounted at /knowledge/<id> via netlify.toml redirect.
// ════════════════════════════════════════════════════════════════════════

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

const SITE = 'https://pulserevops.com';
// Owner 2026-07-08: article body is text-only — no hero, product, section, or inline
// images on answer pages. CRO header card (crohdr / background-image) is unchanged.
const ANSWER_CONTENT_IMAGES_OFF = true;
const { isRankingListBody, RANKING_LIST_NO_TOP_HERO } = require('../../_ranking_list_master_law');
const { appliesQaGold } = require('../../_qa_gold_template');
const { pulseOrgLogoImageObject, PULSE_SITE, PULSE_SHARE_ICON, PULSE_OG_IMAGE, PULSE_FAVICON_ICO, PULSE_ICON_192, PULSE_ICON_512, PULSE_APPLE_TOUCH } = require('./lib/pulse-brand');

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
function escAttr(s) { return escHtml(s); }
function hostOf(u) { try { return new URL(u).hostname.replace(/^www\./,''); } catch(e) { return u; } }

// ── Markdown → HTML (server-side, no deps). Same dialect as /knowledge.html
const URL_RE = /\bhttps?:\/\/[^\s<>"'\)\]]+/g;
function renderInline(text) {
  // Stash already-converted markdown links behind opaque placeholders so the
  // bare-URL pass below can't re-match URLs inside their own href attributes
  // (the bug that produced HTML-soup like `[label](url" target="_blank">label)`
  // on entry pages — markdown link gets HTML-ified, then URL_RE re-wraps the
  // URL inside the href, and the inner replacement breaks the outer tag).
  const mdLinks = [];
  text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_, l, u) => {
    const i = mdLinks.length;
    mdLinks.push('<a href="' + u + '" target="_blank" rel="noopener noreferrer">' + escHtml(l) + '</a>');
    return '\x00MDLINK' + i + '\x00';
  });
  text = text.replace(/`([^`]+)`/g, (_, c) => '<code>' + escHtml(c) + '</code>');
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  text = text.replace(URL_RE, u => '<a href="' + u + '" target="_blank" rel="noopener noreferrer">' + u + '</a>');
  // Restore the markdown-link placeholders.
  text = text.replace(/\x00MDLINK(\d+)\x00/g, (_, i) => mdLinks[parseInt(i, 10)]);
  return text;
}
function renderTable(lines) {
  const rows = lines.map(l => l.replace(/^\||\|$/g, '').split('|').map(c => c.trim()))
    .filter(r => !r.every(c => /^[:\-\s]+$/.test(c)));
  if (!rows.length) return '';
  const head = rows[0]; const body = rows.slice(1);
  return '<table><thead><tr>' + head.map(c => '<th>' + renderInline(escHtml(c)) + '</th>').join('') + '</tr></thead><tbody>'
    + body.map(r => '<tr>' + r.map(c => '<td>' + renderInline(escHtml(c)) + '</td>').join('') + '</tr>').join('')
    + '</tbody></table>';
}
// Proxy external images through wsrv.nl so hotlink-protected hosts (licdn, wp
// sites, vendor CDNs) still load in-browser. Local/pollinations URLs pass through.
function imgProxy(u) {
  u = String(u || '').trim();
  if (!/^https?:\/\//i.test(u)) return u;
  if (/(^|\/\/)(pulserevops\.com|wsrv\.nl|images\.weserv\.nl|image\.pollinations\.ai)/i.test(u)) return u;
  // wsrv often 404s Pinterest/CDN hosts — img tags can load these direct in-browser.
  if (/pinimg\.com|pinterest\.com|redd\.it|redditmedia\.com|i\.imgur\.com/i.test(u)) return u;
  // Resize + WebP at the proxy so huge external photos (e.g. DDG real images) don't ship at full
  // resolution — big site-wide page-weight cut now that pages carry 3-10 images each.
  // w=760 (owner 2026-07-06 speed): content images display ~600-800px — 1280 was 2-3x the bytes + slower wsrv resize.
  return 'https://wsrv.nl/?url=' + encodeURIComponent(u.replace(/^https?:\/\//i, '')) + '&w=760&output=webp&q=80&we&n=-1';
}

// Chained fallback: wsrv-proxied → direct (e.g. https m.media-amazon.com) → branded image.
// Amazon CDN posters can 404 at wsrv AND direct on some mobile networks; the terminal
// branded fallback guarantees a dead poster NEVER shows a broken-image icon.
const IMG_ONERROR = "this.onerror=null;var s=this,f1=this.getAttribute('data-fallback'),f2=this.getAttribute('data-fallback2');if(f1&&this.src!==f1){this.onerror=function(){s.onerror=null;if(f2&&s.src!==f2)s.src=f2;};this.src=f1;}else if(f2&&this.src!==f2){this.src=f2;}";
// Branded fallback shown when a poster src is "N/A", empty, or the remote (Amazon CDN) image dies.
const BRANDED_IMG_FALLBACK = '/pulse-og.svg';
// OMDb returns the literal string "N/A" when a title has no poster — never render that as a src.
function isNaImageUrl(u) {
  const s = String(u || '').trim();
  return !s || /^n\/?a$/i.test(s) || /\/N\/A(\.[a-z]+)?$/i.test(s);
}

/** Build img attributes: https-forced, N/A-guarded, referrer-safe, dimensioned, onerror→branded fallback. */
function entryImgAttrs(url, alt, opts) {
  opts = opts || {};
  const na = isNaImageUrl(url);
  // Force HTTPS (mixed content is blocked on mobile); OMDb posters come from m.media-amazon.com over http.
  const raw = na ? '' : String(url || '').trim().replace(/^http:\/\//i, 'https://');
  const brandFb = resolveEntryAssetUrl(BRANDED_IMG_FALLBACK);
  const src = na ? brandFb : resolveEntryAssetUrl(raw);
  const direct = /^https?:\/\//i.test(raw) ? raw : '';
  // Chained fallback (no broken icons, ever):
  //   step 1 (data-fallback)  → explicit opts.fallback, else the direct https poster URL (bypasses wsrv proxy)
  //   step 2 (data-fallback2) → ALWAYS the branded image, as the terminal guarantee
  let fb1 = opts.fallback ? resolveEntryAssetUrl(opts.fallback) : (direct && src !== direct ? direct : '');
  if (fb1 === src) fb1 = '';
  const fb2 = brandFb !== src ? brandFb : '';
  const load = opts.eager ? 'eager' : 'lazy';
  const fetchP = opts.eager ? ' fetchpriority="high"' : '';
  const w = opts.width || 760;
  const h = opts.height || 428;
  let attrs = ' src="' + escAttr(src) + '" alt="' + escAttr(alt || '') + '" width="' + w + '" height="' + h + '" loading="' + load + '"' + fetchP + ' decoding="async" referrerpolicy="no-referrer"';
  if (fb1 && fb1 !== src) attrs += ' data-fallback="' + escAttr(fb1) + '"';
  if (fb2 && fb2 !== src && fb2 !== fb1) attrs += ' data-fallback2="' + escAttr(fb2) + '"';
  attrs += ' onerror="' + IMG_ONERROR + '"';
  return attrs;
}

function leadingCoverFromBody(body) {
  const m = String(body || '').match(/^﻿?\s*!\[([^\]]*)\]\((.+)\)\s*$/m);
  if (!m) return null;
  let url = m[2].trim();
  const tm = url.match(/^(.*?)\s+"[^"]*"$/); if (tm) url = tm[1].trim();
  return { alt: m[1], url };
}

function stripLeadingCoverMarkdown(body) {
  return String(body || '').replace(/^﻿?\s*!\[[^\]]*\]\([^)]+\)\s*\n+/m, '');
}

function entryCoverFigureHtml(alt, url) {
  if (ANSWER_CONTENT_IMAGES_OFF) return '';
  const attrs = entryImgAttrs(url, alt, { eager: true, width: 1200, height: 675 });
  return '<figure class="entry-cover" style="margin:0 0 18px;background:#ECE3D2;border-radius:14px;overflow:hidden;border:1px solid rgba(29,23,17,.10);">'
    + '<img' + attrs + ' style="width:100%;height:auto;aspect-ratio:16/9;border-radius:14px;display:block;background:#ECE3D2;object-fit:cover;max-height:520px;"></figure>';
}

function entryCoverFigureHtmlWithFallback(alt, url, fallback) {
  /* TOP HERO renders even with ANSWER_CONTENT_IMAGES_OFF — hero is 1 of the 2 allowed images (owner 2026-07-08) */
  const raw = String(url || '').trim();
  const direct = /^https?:\/\//i.test(raw) ? raw.replace(/^http:\/\//i, 'https://') : '';
  const fb = fallback ? fallback : (direct || '');
  const attrs = entryImgAttrs(url, alt, { eager: true, width: 1200, height: 675, fallback: fb });
  return '<figure class="entry-cover" style="margin:0 0 18px;background:#ECE3D2;border-radius:14px;overflow:hidden;border:1px solid rgba(29,23,17,.10);">'
    + '<img' + attrs + ' style="width:100%;height:auto;aspect-ratio:16/9;border-radius:14px;display:block;background:#ECE3D2;object-fit:cover;max-height:520px;"></figure>';
}

/** Absolute URL for /assets paths; wsrv proxy for externals. */
function resolveEntryAssetUrl(url) {
  url = String(url || '').trim().replace(/^http:\/\//i, 'https://');
  if (!url) return '';
  if (/^https:\/\//i.test(url)) return imgProxy(url);
  if (url.startsWith('//')) return 'https:' + url;
  if (url.startsWith('/')) return SITE + url;
  return imgProxy(url);
}

function firstProductImg(body) {
  const m = String(body || '').match(/@@PRODUCT[^\n]* img="([^"]+)"/);
  return m ? m[1].trim() : '';
}

function pickHeroUrl(body, idxImg, id, skipHero) {
  if (skipHero) return '';
  const lead = leadingCoverFromBody(body);
  const leadUrl = lead && lead.url ? String(lead.url).trim() : '';
  const idx = idxImg && String(idxImg).trim();
  // Only skip the legacy flux placeholder /assets/qa/{id}.jpg — numbered self-hosted covers are valid heroes.
  const legacyFluxFace = (u) => !!(id && u && u.toLowerCase() === ('/assets/qa/' + id.toLowerCase() + '.jpg'));
  const product = firstProductImg(body);
  const hosted = (u) => u && /pulserevops\.com\/img\/auto\//i.test(u);
  // Self-hosted first, then https body/index — skip broken local flux face-card slots.
  if (hosted(leadUrl)) return leadUrl;
  if (hosted(idx)) return idx;
  if (hosted(product)) return product;
  if (/^https?:\/\//i.test(leadUrl)) return leadUrl;
  if (idx && /^https?:\/\//i.test(idx)) return idx;
  if (product && /^https?:\/\//i.test(product)) return product;
  if (leadUrl && !legacyFluxFace(leadUrl)) return leadUrl;
  if (idx && !legacyFluxFace(idx)) return idx;
  return product || (!legacyFluxFace(leadUrl) && leadUrl) || (!legacyFluxFace(idx) && idx) || '';
}

const DIRECT_ANSWER_BOX_OPEN = '<div class="direct-answer-box" style="margin:0 0 22px;padding:18px 20px;border:2px solid #C8821E !important;border-radius:14px;background:#FBF3E4 !important;box-shadow:0 0 0 1px rgba(200,130,30,.18), inset 0 0 0 1px rgba(200,130,30,.08) !important;">'
  + '<div class="direct-answer-label" style="font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:#C8821E;font-weight:800;margin-bottom:10px;">Direct Answer</div>';

/** Wrap rendered Direct Answer prose in the gold box if renderMd missed it. */
function wrapDirectAnswerGold(html) {
  if (!html || /class="direct-answer-box"/i.test(html)) return html;
  const h2m = html.match(/<h2[^>]*>\s*Direct Answer\s*<\/h2>/i);
  if (!h2m) return html;
  const contentStart = h2m.index + h2m[0].length;
  const end = afterDirectAnswerPos(html);
  const contentEnd = end !== -1 ? end : html.length;
  const content = html.slice(contentStart, contentEnd);
  return html.slice(0, h2m.index) + DIRECT_ANSWER_BOX_OPEN + content + '</div>' + html.slice(contentEnd);
}

function renderMd(text, styleIncl, skipFirstCover) {
  text = String(text || '').replace(/\r\n/g, '\n').trim();
  const lines = text.split('\n'); const out = []; let i = 0; let paraBuf = []; let coverImgDone = false; let directAnswerOpen = false;
  const flush = () => { if (paraBuf.length) { const j = paraBuf.join(' ').trim(); if (j) out.push('<p>' + renderInline(escHtml(j)) + '</p>'); paraBuf = []; } };
  const closeDirectAnswer = () => { if (directAnswerOpen) { out.push('</div>'); directAnswerOpen = false; } };
  while (i < lines.length) {
    const line = lines[i]; const t = line.trim();
    if (/^```mermaid\s*$/i.test(t)) {
      flush(); i++; const mer = [];
      while (i < lines.length && !/^```/.test(lines[i].trim())) { mer.push(lines[i]); i++; }
      i++;
      const src = mer.join('\n').trim();
      if (src) out.push('<div class="mermaid-wrap"><div class="mermaid">' + escHtml(src) + '</div></div>');
      continue;
    }
    // ```outfit board (Style pillar) -> a clean styled card with color swatches,
    // instead of showing literal ``` fences + raw key:value lines.
    if (/^```outfit\b/i.test(t)) {
      flush(); i++; const blk = [];
      while (i < lines.length && !/^```/.test(lines[i].trim())) { blk.push(lines[i].trim()); i++; }
      i++; // closing fence
      const meta = {}; const items = [];
      for (const s of blk) {
        if (!s) continue;
        const kv = s.match(/^(gender|title|occasion|budget|age|img):\s*(.+)$/i);
        if (kv) { meta[kv[1].toLowerCase()] = kv[2]; continue; }
        const it = s.replace(/^[-•*]\s*/, '').split('|').map(x => x.trim());
        if (it.length >= 2) items.push(it);
      }
      let h = '<div class="outfit-board" style="margin:18px 0;border:1px solid rgba(29,23,17,.14);border-radius:14px;background:#FBF8F1;overflow:hidden;">';
      // Per-outfit photo: a REAL matching image (img:) takes priority; otherwise an
      // auto-generated example from the board's own data (gender + age + pieces).
      const gender = /women|female|ladies/i.test(meta.gender || '') ? 'woman' : (/men|male/i.test(meta.gender || '') ? 'man' : 'person');
      const ageStr = (meta.age || '').trim();
      const pieces = items.map(function (it) { return ((it[1] || '') + ' ' + (it[0] || '')).trim(); }).filter(Boolean).slice(0, 6).join(', ');
      const oprompt = 'full body fashion editorial photo of a ' + (ageStr ? ageStr + ' ' : '') + gender + ' wearing ' + (pieces || (meta.title || 'a complete outfit')) + ', studio lighting, plain neutral background, realistic';
      const realImg = (meta.img || '').trim();
      const oimg = realImg
        ? imgProxy(realImg)
        : 'https://image.pollinations.ai/prompt/' + encodeURIComponent(oprompt) + '?width=768&height=1024&nologo=true';
      if (!ANSWER_CONTENT_IMAGES_OFF) {
        h += '<img' + entryImgAttrs(oimg, (ageStr ? ageStr + ' ' : '') + gender + ' — ' + (meta.title || 'outfit') + ' look', { width: 760, height: 560 }) + ' style="display:block;width:100%;height:auto;max-height:560px;object-fit:cover;object-position:top;background:#ECE3D2;">';
      }
      h += '<div style="padding:16px 18px;">';
      if (meta.title) h += '<div style="font-family:Fraunces,Georgia,serif;font-weight:800;font-size:1.15rem;color:#1d1711;">' + escHtml(meta.title) + '</div>';
      const sub = [meta.gender, meta.age, meta.occasion, meta.budget].filter(Boolean).map(escHtml).join(' · ');
      if (sub) h += '<div style="color:#6b5d49;font-size:.9rem;margin:2px 0 12px;">' + sub + '</div>';
      if (items.length) {
        h += '<div style="display:flex;flex-direction:column;gap:8px;">';
        for (const it of items) {
          const name = it[0] || ''; const color = it[1] || '';
          const hex = (/^#?[0-9a-f]{3,6}$/i.test(it[2] || '')) ? (it[2].startsWith('#') ? it[2] : '#' + it[2]) : '';
          const desc = it[3] || (hex ? '' : it[2]) || '';
          h += '<div style="display:flex;align-items:center;gap:10px;">';
          if (hex) h += '<span style="width:16px;height:16px;border-radius:4px;border:1px solid rgba(0,0,0,.15);background:' + escAttr(hex) + ';flex:0 0 auto;"></span>';
          h += '<span style="color:#1d1711;"><b>' + escHtml(name) + '</b>' + (color ? ' — ' + escHtml(color) : '') + (desc ? ' · ' + escHtml(desc) : '') + '</span></div>';
        }
        h += '</div>';
      }
      h += '</div></div>';
      out.push(h); continue;
    }
    // ── v2 content blocks (regular Q&A + Top-10 upgrade). All backward-compatible:
    // entries that don't use these fences are unaffected.
    // ```answer -> boxed "Quick Answer" card at the top of a regular Q&A.
    if (/^```answer\b/i.test(t)) {
      flush(); i++; const blk = [];
      while (i < lines.length && !/^```/.test(lines[i].trim())) { blk.push(lines[i]); i++; } i++;
      const txt = blk.join(' ').trim();
      if (txt) out.push('<div class="v2-answer" style="margin:0 0 20px;padding:16px 18px;border-left:4px solid #C8821E;border-radius:10px;background:#FBF3E4;"><div style="font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:#C8821E;font-weight:800;margin-bottom:6px;">Quick Answer</div><div style="font-size:1.08rem;line-height:1.6;color:#1d1711;">' + renderInline(escHtml(txt)) + '</div></div>');
      continue;
    }
    // ```steps -> numbered step cards. `title:` optional; each "- step | detail".
    if (/^```steps\b/i.test(t)) {
      flush(); i++; const blk = [];
      while (i < lines.length && !/^```/.test(lines[i].trim())) { blk.push(lines[i].trim()); i++; } i++;
      let title = ''; const steps = [];
      for (const s of blk) { if (!s) continue; const m = s.match(/^title:\s*(.+)$/i); if (m) { title = m[1]; continue; } const it = s.replace(/^[-•*]\s*|^\d+\.\s*/, '').split('|').map(x => x.trim()); if (it[0]) steps.push(it); }
      let h = '<div class="v2-steps" style="margin:18px 0;">';
      if (title) h += '<div style="font-family:Fraunces,Georgia,serif;font-weight:800;font-size:1.1rem;color:#1d1711;margin-bottom:12px;">' + escHtml(title) + '</div>';
      steps.forEach((it, idx) => { h += '<div style="display:flex;gap:14px;align-items:flex-start;margin-bottom:10px;"><span style="flex:0 0 auto;width:30px;height:30px;border-radius:50%;background:#C8821E;color:#fff;font-weight:800;display:flex;align-items:center;justify-content:center;font-size:.95rem;">' + (idx + 1) + '</span><div style="flex:1;"><div style="font-weight:700;color:#1d1711;">' + renderInline(escHtml(it[0])) + '</div>' + (it[1] ? '<div style="color:#6b5d49;font-size:.92rem;margin-top:2px;">' + renderInline(escHtml(it[1])) + '</div>' : '') + '</div></div>'; });
      h += '</div>'; out.push(h); continue;
    }
    // ```compare -> two-option comparison table. `a:`/`b:` headers; "- row | A | B".
    if (/^```compare\b/i.test(t)) {
      flush(); i++; const blk = [];
      while (i < lines.length && !/^```/.test(lines[i].trim())) { blk.push(lines[i].trim()); i++; } i++;
      let a = 'Option A', b = 'Option B'; const rows = [];
      for (const s of blk) { if (!s) continue; const ma = s.match(/^a:\s*(.+)$/i); if (ma) { a = ma[1]; continue; } const mb = s.match(/^b:\s*(.+)$/i); if (mb) { b = mb[1]; continue; } const it = s.replace(/^[-•*]\s*/, '').split('|').map(x => x.trim()); if (it.length >= 3) rows.push(it); }
      let h = '<div class="v2-compare" style="margin:18px 0;border:1px solid rgba(29,23,17,.14);border-radius:14px;overflow:hidden;">';
      h += '<div style="display:grid;grid-template-columns:1.2fr 1fr 1fr;background:#1d1711;color:#fff;font-weight:800;"><div style="padding:11px 14px;"></div><div style="padding:11px 14px;border-left:1px solid rgba(255,255,255,.15);">' + escHtml(a) + '</div><div style="padding:11px 14px;border-left:1px solid rgba(255,255,255,.15);">' + escHtml(b) + '</div></div>';
      rows.forEach((it, idx) => { const bg = idx % 2 ? '#FBF8F1' : '#fff'; h += '<div style="display:grid;grid-template-columns:1.2fr 1fr 1fr;background:' + bg + ';"><div style="padding:11px 14px;font-weight:700;color:#1d1711;">' + escHtml(it[0]) + '</div><div style="padding:11px 14px;color:#1d1711;border-left:1px solid rgba(29,23,17,.08);">' + renderInline(escHtml(it[1])) + '</div><div style="padding:11px 14px;color:#1d1711;border-left:1px solid rgba(29,23,17,.08);">' + renderInline(escHtml(it[2])) + '</div></div>'; });
      h += '</div>'; out.push(h); continue;
    }
    // ```callout -> colored tip/warning/key box. `type: tip|warning|key`.
    if (/^```callout\b/i.test(t)) {
      flush(); i++; const blk = [];
      while (i < lines.length && !/^```/.test(lines[i].trim())) { blk.push(lines[i]); i++; } i++;
      let type = 'tip'; const body = [];
      for (const s of blk) { const m = s.trim().match(/^type:\s*(\w+)/i); if (m) { type = m[1].toLowerCase(); continue; } body.push(s); }
      const txt = body.join(' ').trim();
      const cfg = ({ tip: ['#1E8E5A', '#E8F6EE', '💡 Tip'], warning: ['#C0392B', '#FBEBE9', '⚠️ Watch out'], key: ['#C8821E', '#FBF3E4', '★ Key point'] })[type] || ['#C8821E', '#FBF3E4', '★ Note'];
      if (txt) out.push('<div class="v2-callout" style="margin:16px 0;padding:13px 16px;border-left:4px solid ' + cfg[0] + ';border-radius:10px;background:' + cfg[1] + ';"><div style="font-weight:800;color:' + cfg[0] + ';font-size:.82rem;margin-bottom:4px;">' + cfg[2] + '</div><div style="color:#1d1711;line-height:1.55;">' + renderInline(escHtml(txt)) + '</div></div>');
      continue;
    }
    // ```pick -> Top-10 v2 product/pick card (rank badge, image, verdict, best-for +
    // price chips, pros/cons, CTA). Keys: rank,name,img,site,verdict,bestfor,price,pros,cons.
    if (/^```pick\b/i.test(t)) {
      flush(); i++; const blk = [];
      while (i < lines.length && !/^```/.test(lines[i].trim())) { blk.push(lines[i].trim()); i++; } i++;
      const m = {}; for (const s of blk) { const kv = s.match(/^(rank|name|img|site|verdict|bestfor|price|pros|cons):\s*(.+)$/i); if (kv) m[kv[1].toLowerCase()] = kv[2]; }
      const pros = (m.pros || '').split(';').map(x => x.trim()).filter(Boolean);
      const cons = (m.cons || '').split(';').map(x => x.trim()).filter(Boolean);
      let h = '<div class="v2-pick" style="margin:20px 0;border:1px solid rgba(29,23,17,.14);border-radius:16px;overflow:hidden;background:#FBF8F1;"><div style="position:relative;">';
      if (m.img) h += '<a href="' + escAttr(m.site || m.img) + '" target="_blank" rel="noopener"><img' + entryImgAttrs(m.img, m.name || '', { width: 760, height: 360 }) + ' style="display:block;width:100%;height:auto;max-height:360px;object-fit:contain;background:#fff;"></a>';
      if (m.rank) h += '<span style="position:absolute;top:12px;left:12px;background:#C8821E;color:#fff;font-weight:800;border-radius:8px;padding:4px 11px;font-size:.9rem;">#' + escHtml(m.rank) + '</span>';
      h += '</div><div style="padding:15px 18px;">';
      if (m.name) h += '<a href="' + escAttr(m.site || '#') + '" target="_blank" rel="noopener" style="font-family:Fraunces,Georgia,serif;font-weight:800;font-size:1.18rem;color:#1d1711;text-decoration:none;display:block;">' + escHtml(m.name) + '</a>';
      const chips = []; if (m.bestfor) chips.push('<span style="background:#FBF3E4;color:#C8821E;border:1px solid rgba(200,130,30,.3);border-radius:99px;padding:3px 10px;font-size:.78rem;font-weight:700;">Best for: ' + escHtml(m.bestfor) + '</span>'); if (m.price) chips.push('<span style="background:#Eef6f0;color:#1E8E5A;border:1px solid rgba(30,142,90,.25);border-radius:99px;padding:3px 10px;font-size:.78rem;font-weight:700;">' + escHtml(m.price) + '</span>');
      if (chips.length) h += '<div style="display:flex;gap:8px;flex-wrap:wrap;margin:8px 0;">' + chips.join('') + '</div>';
      if (m.verdict) h += '<div style="color:#1d1711;line-height:1.55;margin:6px 0;">' + renderInline(escHtml(m.verdict)) + '</div>';
      if (pros.length || cons.length) { h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:10px;">'; h += '<div>' + (pros.length ? '<div style="font-weight:800;color:#1E8E5A;font-size:.8rem;margin-bottom:4px;">Pros</div>' + pros.map(p => '<div style="font-size:.9rem;color:#1d1711;">+ ' + escHtml(p) + '</div>').join('') : '') + '</div>'; h += '<div>' + (cons.length ? '<div style="font-weight:800;color:#C0392B;font-size:.8rem;margin-bottom:4px;">Cons</div>' + cons.map(p => '<div style="font-size:.9rem;color:#1d1711;">– ' + escHtml(p) + '</div>').join('') : '') + '</div>'; h += '</div>'; }
      if (m.site) h += '<a href="' + escAttr(m.site) + '" target="_blank" rel="noopener" style="display:inline-block;margin-top:12px;background:#1d1711;color:#fff;font-weight:700;border-radius:10px;padding:9px 16px;text-decoration:none;font-size:.9rem;">View ' + escHtml(m.name || 'pick') + ' →</a>';
      h += '</div></div>'; out.push(h); continue;
    }
    // Any other ``` fence: drop the markers and let the inner content render as
    // normal markdown (the library has no real code blocks besides mermaid).
    if (/^```/.test(t)) { i++; continue; }
    if (!t) { flush(); i++; continue; }
    // Whole-line markdown image -> rendered <figure><img>. (renderMd historically
    // had NO image support, so a leading `![cover](url)` rendered as a broken
    // `!`+text-link. Writers + the cover lane prepend a cover image as body line 1.)
    {
      // Capture the URL GREEDILY to the final ) so image-host URLs that contain
      // literal parens (e.g. filters:no_upscale(), max_bytes(150000), strip_icc(),
      // or Squarespace "(1)" suffixes) don't break — they were rendering as a
      // stray "!" + leaked raw URL text with no image. Strip an optional "title".
      const imgM = t.match(/^!\[([^\]]*)\]\((.+)\)\s*$/);
      if (imgM) {
        flush();
        if (ANSWER_CONTENT_IMAGES_OFF) {
          if (!coverImgDone) coverImgDone = true;
          i++; continue;
        }
        let url = imgM[2].trim();
        const tm = url.match(/^(.*?)\s+"[^"]*"$/); if (tm) url = tm[1].trim();
        if (!coverImgDone) {
          if (skipFirstCover) {
            coverImgDone = true;
            out.push('<figure class="entry-section" style="margin:0 0 18px;"><img' + entryImgAttrs(url, imgM[1], { width: 760, height: 428 }) + ' style="width:100%;aspect-ratio:16/9;object-fit:cover;object-position:center 30%;border-radius:14px;display:block;max-height:480px;background:#ECE3D2;"></figure>');
          } else {
            out.push(entryCoverFigureHtml(imgM[1], url));
            coverImgDone = true;
          }
        } else {
          out.push('<figure class="entry-section" style="margin:0 0 18px;"><img' + entryImgAttrs(url, imgM[1], { width: 760, height: 428 }) + ' style="width:100%;aspect-ratio:16/9;object-fit:cover;object-position:center 30%;border-radius:14px;display:block;max-height:480px;background:#ECE3D2;"></figure>');
        }
        i++; continue;
      }
    }
    // Top-10 product directive: @@PRODUCT name="..." img="..." site="..."
    // -> a card with a decent-sized item image + linked name. (This was a
    // live-only renderer feature lost in the clean rebuild, so Top-10s showed
    // raw "@@PRODUCT ..." text with no images. Reconstructed here.)
    if (/^@@PRODUCT\b/.test(t)) {
      flush();
      const nm = (t.match(/name="([^"]*)"/) || [])[1] || '';
      const im = (t.match(/img="([^"]*)"/) || [])[1] || '';
      const st = (t.match(/site="([^"]*)"/) || [])[1] || '';
      const link = st || (im ? im : '#');
      // Movie posters (mv pillar) are portrait 2:3 — render in an aspect-ratio container so they never
      // collapse or stretch on mobile (no fixed px width). Other pillars keep contain-fit product photos.
      const isPoster = /\/assets\/qa\/mv\d/i.test(im) || /m\.media-amazon\.com/i.test(im);
      let card = '<div class="product-card" style="margin:18px 0;border:1px solid rgba(29,23,17,.14);border-radius:14px;overflow:hidden;background:#FBF8F1;">';
      // @@PRODUCT posters are curated Top-10 images — always render them (exempt from the Q&A body-image purge).
      if (im) {
        const imgStyle = isPoster
          ? 'display:block;width:100%;height:auto;aspect-ratio:2/3;max-width:340px;margin:0 auto;object-fit:cover;background:#0a0c11;'
          : 'display:block;width:100%;height:auto;max-height:460px;object-fit:contain;background:#fff;';
        const dims = isPoster ? { width: 800, height: 1200 } : { width: 760, height: 460 };
        card += '<a href="' + escAttr(link) + '" target="_blank" rel="noopener"><img' + entryImgAttrs(im, nm, dims) + ' style="' + imgStyle + '"></a>';
      }
      if (nm) card += '<div class="product-name" style="display:block;padding:13px 16px;font-weight:800;color:#1d1711;font-size:1.06rem;line-height:1.35;">' + escHtml(nm) + '</div>';
      card += '</div>';
      out.push(card);
      i++; continue;
    }
    // Whole-line LINKED image: [![alt](img)](link) -> clickable figure. renderMd
    // didn't handle the nested syntax, so it leaked raw on every Graphics (gb)
    // entry (the SVG download line) and anywhere else linked images are used.
    {
      const li = t.match(/^\[!\[([^\]]*)\]\(([^)]+)\)\]\((.+)\)\s*$/);
      if (li) {
        flush();
        if (!ANSWER_CONTENT_IMAGES_OFF) {
          out.push('<figure class="entry-graphic" style="margin:0 0 18px;"><a href="' + escAttr(li[3].trim()) + '" target="_blank" rel="noopener"><img' + entryImgAttrs(li[2].trim(), li[1], { width: 760, height: 428 }) + ' style="width:100%;height:auto;border-radius:14px;display:block;"></a></figure>');
        }
        i++; continue;
      }
    }
    // A single-# H1 duplicates the page title (<h1 class="q">) -> drop it so the
    // question isn't shown twice and no raw `# ...` leaks. (## … ###### render.)
    if (/^#\s+\S/.test(t)) { flush(); i++; continue; }
    if (/^#{2,6}\s+/.test(t)) {
      flush();
      const lvl = t.match(/^(#{2,6})/)[1].length;
      const c = t.replace(/^#{2,6}\s+/, '');
      if (/^direct answer$/i.test(c.trim())) {
        closeDirectAnswer();
        out.push(DIRECT_ANSWER_BOX_OPEN);
        directAnswerOpen = true;
        i++; continue;
      }
      // Close gold box only on the next ## h2 — h3+ (tips, notes) stay inside Direct Answer.
      if (directAnswerOpen && lvl === 2) closeDirectAnswer();
      out.push('<h' + lvl + '>' + renderInline(escHtml(c)) + '</h' + lvl + '>');
      // Style pillar: an inclusive note under the For Men / For Women section heads —
      // these looks aren't gated by gender, only by how you present.
      if (styleIncl && lvl === 2) {
        const cl = c.trim().toLowerCase().replace(/[\s:.!]+$/, '');
        const note = cl === 'for men' ? 'Masculine-presenting women — these looks work for you too.'
          : cl === 'for women' ? 'Feminine-presenting men — these looks work for you too.' : '';
        if (note) out.push('<p class="incl-note" style="margin:-10px 0 16px;font-size:.82rem;font-style:italic;color:#6b5d49;">' + note + '</p>');
      }
      i++; continue;
    }
    if (/^\|.*\|/.test(t) && i + 1 < lines.length && /^\|[\s:|-]+\|/.test(lines[i+1].trim())) {
      flush(); const tbl = [];
      while (i < lines.length && /^\|.*\|/.test(lines[i].trim())) { tbl.push(lines[i].trim()); i++; }
      out.push(renderTable(tbl)); continue;
    }
    if (/^[-•*]\s+/.test(t)) {
      flush(); const items = [];
      while (i < lines.length && /^[-•*]\s+/.test(lines[i].trim())) { items.push(lines[i].trim().replace(/^[-•*]\s+/, '')); i++; }
      out.push('<ul>' + items.map(x => '<li>' + renderInline(escHtml(x)) + '</li>').join('') + '</ul>'); continue;
    }
    if (/^\d+\.\s+/.test(t)) {
      flush(); const nums = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) { nums.push(lines[i].trim().replace(/^\d+\.\s+/, '')); i++; }
      out.push('<ol>' + nums.map(x => '<li>' + renderInline(escHtml(x)) + '</li>').join('') + '</ol>'); continue;
    }
    paraBuf.push(t); i++;
  }
  flush(); closeDirectAnswer();
  return out.join('');
}

// ── CRO Syndicate card (v2). Operates on the ALREADY-RENDERED answer HTML, so
// body HTML-escaping does not apply. Reading order: hero image → Direct Answer
// section → Kory White CRO card → rest of article. Top-10 falls back to before
// item #4 only when no Direct Answer heading exists.
// Click targets (owner spec): "See Kory on LinkedIn" + photo -> LinkedIn;
// "Quick Call?" button -> Calendly; "CRO Syndicate" logo -> crosyndicate.com.
function h2PlainText(inner) {
  return String(inner).replace(/<[^>]+>/g, '').trim().toLowerCase();
}
function isDirectAnswerH2(inner) {
  const t = h2PlainText(inner);
  return t === 'direct answer' || /^direct answer\b/.test(t);
}
/** End index of the outer direct-answer-box (depth-counted — label div must not truncate). */
function directAnswerBoxEndPos(html) {
  if (!html) return -1;
  const start = html.search(/<div\b[^>]*class="direct-answer-box"/i);
  if (start === -1) return -1;
  const tagRe = /<\/?div\b[^>]*>/gi;
  tagRe.lastIndex = start;
  let depth = 0;
  let m;
  while ((m = tagRe.exec(html)) !== null) {
    if (m[0].charAt(1) === '/') depth--;
    else depth++;
    if (depth === 0) return tagRe.lastIndex;
  }
  return -1;
}

// Index where the CRO card should be inserted — immediately after the Direct Answer section.
function afterDirectAnswerPos(html) {
  if (!html) return -1;
  const boxEnd = directAnswerBoxEndPos(html);
  if (boxEnd !== -1) return boxEnd;
  // Gold box open but depth parse failed — never fall through to </p> inside the box.
  const boxStart = html.search(/<div\b[^>]*class="direct-answer-box"/i);
  if (boxStart !== -1) {
    const afterLabel = html.indexOf('</div>', boxStart);
    if (afterLabel !== -1) {
      const rest = html.slice(afterLabel + 6);
      const nextH2 = rest.search(/<h2\b/i);
      if (nextH2 !== -1) return afterLabel + 6 + nextH2;
    }
  }
  const re = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    if (isDirectAnswerH2(m[1])) {
      const afterH2 = m.index + m[0].length;
      const rest = html.slice(afterH2);
      const nextH2 = rest.search(/<h2\b/i);
      return nextH2 !== -1 ? afterH2 + nextH2 : html.length;
    }
  }
  return -1;
}

/** Q&A essay: CRO after first content image + the text block that follows it (owner 2026-07-06). */
function afterQaEssayCroPos(html) {
  const boxEnd = directAnswerBoxEndPos(html);
  if (boxEnd === -1) return -1;
  const tail = html.slice(boxEnd);
  const figIdx = tail.search(/<figure\b/i);
  if (figIdx === -1) return -1;
  const figClose = tail.indexOf('</figure>', figIdx);
  if (figClose === -1) return -1;
  const afterFig = boxEnd + figClose + '</figure>'.length;
  const rest = html.slice(afterFig);
  const pEnd = rest.search(/<\/p>/i);
  if (pEnd === -1) return afterFig;
  return afterFig + pEnd + 4;
}
// Top-10: CRO card BETWEEN entry #3 and #4 — never inside an entry's content block (owner 2026-07-07 C18).
function afterTop10Item3Card(html) {
  const isTop10 = /<h2[^>]*>\s*10\.\s/.test(html) || /🏆|BEST OVERALL/i.test(html);
  if (!isTop10) return -1;
  // Insert BETWEEN entry #3 and #4 — immediately before the ## 4 heading.
  // Never after the #3 product-card (that lands inside #3's body, between caption and Director:).
  const m4 = html.match(/<h2[^>]*>\s*4\.\s/i);
  if (m4) return m4.index;
  return -1;
}
function croInsertPos(html) {
  const top10pos = afterTop10Item3Card(html);
  if (top10pos !== -1) return top10pos;
  if (/<div\b[^>]*class="direct-answer-box"/i.test(html) && !/<h2[^>]*>\s*10\.\s/.test(html) && !/🏆|BEST OVERALL/i.test(html)) {
    const qaPos = afterQaEssayCroPos(html);
    if (qaPos !== -1) return qaPos;
  }
  const da = afterDirectAnswerPos(html);
  if (da !== -1) return da;
  // Direct Answer gold box present — do not use </p>/</figure> fallbacks (they land inside the box).
  if (/<div\b[^>]*class="direct-answer-box"/i.test(html)) {
    const boxEnd = directAnswerBoxEndPos(html);
    if (boxEnd !== -1) return boxEnd;
    const h2 = html.search(/<div\b[^>]*class="direct-answer-box"[\s\S]*?<\/div>\s*<h2\b/i);
    if (h2 !== -1) {
      const rel = html.slice(h2).search(/<h2\b/i);
      if (rel !== -1) return h2 + rel;
    }
  }
  const isTop10 = /<h2>\s*10\.\s/.test(html) || /🏆|BEST OVERALL/i.test(html);
  if (isTop10) {
    const m = html.match(/<h2>\s*4\.\s/);
    if (m) return m.index;
  }
  const fig1 = html.indexOf('</figure>');
  if (fig1 !== -1) {
    const after = fig1 + 9;
    const pEnd = html.indexOf('</p>', after);
    const fig2 = html.indexOf('<figure', after);
    if (pEnd !== -1 && (fig2 === -1 || pEnd < fig2)) return pEnd + 4;
    if (fig2 !== -1) return fig2;
    return after;
  }
  const p0 = html.indexOf('</p>');
  if (p0 !== -1) return p0 + 4;
  return html.length;
}
function croAdCard() {
  // The owner-designed CRO Syndicate card (PNG). The body renderer can't show an
  // image, but this runs on already-rendered HTML so the <img> survives.
  // Click targets via transparent hotspots layered over the image:
  //   base (whole image / "Quick Call?") -> Calendly · logo -> crosyndicate.com ·
  //   photo + "See Kory on LinkedIn" -> LinkedIn.
  const LI   = 'https://www.linkedin.com/in/korywhite';
  const CAL  = 'https://calendly.com/korywhiterevops?utm_source=pulserevops.com&utm_medium=referral&utm_campaign=cro-widget';
  const SYND = 'https://crosyndicate.com/?utm_source=pulserevops.com&utm_medium=referral&utm_campaign=cro-widget';
  const RESUME = '/assets/kory-white-cro-1page.pdf';
  const IMG  = '/assets/cro-syndicate-card.png';
  const btn  = 'display:block;text-align:center;text-decoration:none;font-weight:800;font-size:.82rem;padding:8px 10px;border-radius:9px;margin-top:7px;';
  const btnO = 'background:#fff;border:1px solid rgba(156,94,18,.4);color:#9c5e12;';   // outline button
  // HANGING widget — a little sign that hangs top-right from a cord + peg, sways gently, and stays
  // as you scroll. × drops it off the string. On screens too narrow to sit beside the article it
  // hides (see .cro-ad-root CSS + the article right-gutter) so it NEVER covers the text.
  const KORY = '/assets/kory-white.jpg';
  return '';   // swinging card removed — CRO card is now the page header (owner 2026-07-07)
  return '<div class="cro-ad cro-ad-card cro-ad-root" id="croFixed" aria-label="Sponsored — Kory White, Fractional CRO">' +
    '<div class="cro-swing">' +
      '<div class="cro-cord"></div><div class="cro-peg"></div>' +
      '<div class="cro-card">' +
        '<div class="cro-spine"></div>' +
        '<button type="button" class="cro-close cro-x" aria-label="Dismiss">×</button>' +
        '<div class="cro-top"><div class="cro-logo">CRO <em>SYNDICATE</em></div><span class="cro-sponsored">SPONSORED</span></div>' +
        '<div class="cro-hero"><span class="cro-photo"><img src="' + KORY + '" alt="Kory White, Fractional CRO" width="64" height="64" loading="lazy" decoding="async"></span>' +
          '<span><span class="cro-name">Kory White</span><span class="cro-role">Fractional Chief Revenue Officer · 25 yrs · $0→$200M</span></span></div>' +
        '<p class="cro-eyebrow">Hire a Fractional CRO</p>' +
        '<div class="cro-head">Need a fractional Chief Revenue Officer?</div>' +
        '<div class="cro-pills"><span>Chief Revenue Officer</span><span>Revenue Leader</span><span>VP of Sales</span><span>Sales Leader</span></div>' +
        '<p class="cro-body">CRO Syndicate connects you with vetted fractional &amp; interim revenue leaders — nationwide and across <b>Maryland &amp; DC</b>.</p>' +
        '<a class="cro-btn" href="' + CAL + '" target="_blank" rel="noopener" data-pulse-click="hire-cro">Book a Call <span aria-hidden="true">→</span></a>' +
        '<div class="cro-links">' +
          '<a href="' + LI + '" target="_blank" rel="noopener" data-pulse-click="curator">Kory White LinkedIn <span aria-hidden="true">→</span></a>' +
          '<a href="' + SYND + '" target="_blank" rel="noopener" data-pulse-click="cro-syndicate">CRO Syndicate <span aria-hidden="true">→</span></a>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</div>' +
    '<script>(function(){var c=document.getElementById("croFixed");if(!c)return;' +
      'try{if(sessionStorage.getItem("croX")==="1"){c.style.display="none";document.body.classList.add("cro-dismissed");return;}}catch(e){}' +
      'function b(k){try{if(sessionStorage.getItem("pclk_"+k))return;sessionStorage.setItem("pclk_"+k,"1");}catch(e){}' +
        'try{var p=JSON.stringify({kind:k,label:"CRO card",page:location.pathname+location.search,url:location.href,title:document.title});' +
          'if(navigator.sendBeacon)navigator.sendBeacon("/.netlify/functions/pulse-click-notify",new Blob([p],{type:"application/json"}));' +
          'else fetch("/.netlify/functions/pulse-click-notify",{method:"POST",headers:{"Content-Type":"application/json"},body:p,keepalive:true});}catch(e){}}' +
      'var x=c.querySelector(".cro-close");if(x)x.addEventListener("click",function(){b("cro-card-dismiss");c.classList.add("cro-drop");document.body.classList.add("cro-dismissed");try{sessionStorage.setItem("croX","1")}catch(e){}setTimeout(function(){c.style.display="none";},780);});' +
      'c.addEventListener("click",function(e){if(e.target&&e.target.closest&&e.target.closest(".cro-close"))return;b("cro-card-click");},true);' +
      'c.addEventListener("mouseenter",function(){b("cro-card-hover");});' +
    '})();</script>';
}

// MOBILE-ONLY inline CRO card: the whole CRO Syndicate card as a full-width image that
// sits inline among the content photos (same size, border-radius:14px) so at first it reads
// like just another picture — then gently swings. Whole image links to the Calendly call;
// × dismisses it (remembered per session). Hidden on desktop (desktop keeps the hanging card).
// MOBILE inline CRO card — same Kory card as desktop, placed inline after Direct Answer. × dismisses it.
function croMobileCard() {
  const CAL = 'https://calendly.com/korywhiterevops?utm_source=pulserevops.com&utm_medium=referral&utm_campaign=cro-widget';
  const LI = 'https://www.linkedin.com/in/korywhite';
  const SYND = 'https://crosyndicate.com/?utm_source=pulserevops.com&utm_medium=referral&utm_campaign=cro-widget';
  const KORY = '/assets/kory-white.jpg';
  return '';   // mobile swinging card removed — CRO card is now the page header (owner 2026-07-07)
  return '<div class="cro-mob-card" id="croMobCard" aria-label="Sponsored — Kory White, Fractional CRO">' +
    '<div class="cro-swing">' +
      '<div class="cro-cord"></div><div class="cro-peg"></div>' +
      '<div class="cro-card">' +
        '<div class="cro-spine"></div>' +
        '<button type="button" class="cro-close" aria-label="Dismiss">×</button>' +
        '<div class="cro-top"><div class="cro-logo">CRO <em>SYNDICATE</em></div><span class="cro-sponsored">SPONSORED</span></div>' +
        '<div class="cro-hero"><span class="cro-photo"><img src="' + KORY + '" alt="Kory White, Fractional CRO" width="64" height="64" loading="lazy" decoding="async"></span>' +
          '<span><span class="cro-name">Kory White</span><span class="cro-role">Fractional Chief Revenue Officer · 25 yrs · $0→$200M</span></span></div>' +
        '<p class="cro-eyebrow">Hire a Fractional CRO</p>' +
        '<div class="cro-head">Need a fractional Chief Revenue Officer?</div>' +
        '<div class="cro-pills"><span>Chief Revenue Officer</span><span>Revenue Leader</span><span>VP of Sales</span><span>Sales Leader</span></div>' +
        '<p class="cro-body">CRO Syndicate connects you with vetted fractional &amp; interim revenue leaders — nationwide and across <b>Maryland &amp; DC</b>.</p>' +
        '<a class="cro-btn" href="' + CAL + '" target="_blank" rel="noopener" data-pulse-click="hire-cro">Book a Call <span aria-hidden="true">→</span></a>' +
        '<div class="cro-links">' +
          '<a href="' + LI + '" target="_blank" rel="noopener" data-pulse-click="curator">Kory White LinkedIn <span aria-hidden="true">→</span></a>' +
          '<a href="' + SYND + '" target="_blank" rel="noopener" data-pulse-click="cro-syndicate">CRO Syndicate <span aria-hidden="true">→</span></a>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</div>' +
  '<script>(function(){var c=document.getElementById("croMobCard");if(!c)return;' +
    'try{if(sessionStorage.getItem("croMobX")==="1"){c.parentNode&&c.parentNode.removeChild(c);return;}}catch(e){}' +
    'function b(k){try{if(sessionStorage.getItem("pclk_"+k))return;sessionStorage.setItem("pclk_"+k,"1");}catch(e){}' +
      'try{var p=JSON.stringify({kind:k,label:"CRO card (mobile)",page:location.pathname+location.search,url:location.href,title:document.title});' +
        'if(navigator.sendBeacon)navigator.sendBeacon("/.netlify/functions/pulse-click-notify",new Blob([p],{type:"application/json"}));' +
        'else fetch("/.netlify/functions/pulse-click-notify",{method:"POST",headers:{"Content-Type":"application/json"},body:p,keepalive:true});}catch(e){}}' +
    'var x=c.querySelector(".cro-close");if(x)x.addEventListener("click",function(e){e.preventDefault();e.stopPropagation();b("cro-card-dismiss");c.style.transition="opacity .4s,transform .4s";c.style.opacity="0";c.style.transform="scale(.96)";try{sessionStorage.setItem("croMobX","1")}catch(_){}setTimeout(function(){c.parentNode&&c.parentNode.removeChild(c);},420);});' +
    'c.addEventListener("click",function(e){if(e.target&&e.target.closest&&e.target.closest(".cro-close"))return;b("cro-card-click");},true);' +
  '})();</script>';
}

function stripBlobCro(body) {
  if (!body) return body;
  let b = String(body).replace(/\n*<aside class=["']cro-ad[\s\S]*?<\/aside>\n*/gi, '\n\n');
  b = b.split('\n').filter(l => {
    const s = l.trim();
    if (!s) return true;
    if (/!\[[^\]]*\]\([^)]*(?:catbox\.moe|wsrv\.nl|usgv65|files\.catbox|cro-syndicate|kory-white)[^)]*\)/i.test(s)) return false;
    if (/Reach Kory White, Fractional CRO/i.test(s)) return false;
    if (/calendly\.com\/korywhiterevops|linkedin\.com\/in\/korywhite|crosyndicate\.com/i.test(s) && /Book a Quick Call|Kory on LinkedIn|CRO Syndicate|Quick Call/i.test(s)) return false;
    if (/💼.*CRO Syndicate · Fractional CRO/.test(s)) return false;
    return true;
  }).join('\n');
  return b.replace(/\n{3,}/g, '\n\n');
}

function stripRenderedCro(html) {
  if (!html) return html;
  let h = String(html);
  h = h.replace(/\n*<aside class=["']cro-ad[\s\S]*?<\/aside>\n*/gi, '\n');
  h = h.replace(/\n*<figure class=["']entry-graphic["'][\s\S]*?(?:calendly\.com\/korywhiterevops|cro-syndicate-card|kory-white\.jpg|usgv65|files\.catbox)[\s\S]*?<\/figure>\n*/gi, '\n');
  h = h.replace(/\n*<p>\s*(?:<strong>\s*)?Reach Kory White, Fractional CRO[\s\S]*?<\/p>\n*/gi, '\n');
  h = h.replace(/\n*<p>\s*💼[\s\S]*?<\/p>\n*/gi, '\n');
  return h.replace(/\n{3,}/g, '\n\n');
}

/** Strip stray content images from rendered article HTML (CRO header is outside .body).
 *  preserveProducts=true (ranking lists / Top-10): KEEP the @@PRODUCT + v2-pick poster images —
 *  those ARE the ranking content — and only remove stray section/graphic/cover figures. */
function stripAnswerContentImages(html, preserveProducts) {
  if (!html || !ANSWER_CONTENT_IMAGES_OFF) return html;
  let h = String(html);
  if (preserveProducts) {
    // Protect Top-10 product-card + v2-pick blocks, strip the rest, then restore them.
    const keep = [];
    h = h.replace(/<div class="(?:product-card|v2-pick)"[\s\S]*?<div class="product-name"[\s\S]*?<\/div>\s*<\/div>/gi, m => { keep.push(m); return '@@KEEPIMG' + (keep.length - 1) + '@@'; });
    h = h.replace(/<figure\b[^>]*class="entry-(?:section|graphic|cover)"[^>]*>[\s\S]*?<\/figure>/gi, '');
    h = h.replace(/<a\b[^>]*>\s*<img\b[^>]*\/?>\s*<\/a>/gi, '');
    h = h.replace(/<img\b[^>]*\/?>/gi, '');
    h = h.replace(/<figure\b[^>]*>\s*<\/figure>/gi, '');
    h = h.replace(/@@KEEPIMG(\d+)@@/g, (m, i) => keep[+i] || '');
    return h.replace(/\n{3,}/g, '\n\n');
  }
  h = h.replace(/<figure\b[^>]*class="entry-(?:section|graphic|cover)"[^>]*>[\s\S]*?<\/figure>/gi, '');
  h = h.replace(/<a\b[^>]*>\s*<img\b[^>]*\/?>\s*<\/a>/gi, '');
  h = h.replace(/<img\b[^>]*\/?>/gi, '');
  h = h.replace(/<figure\b[^>]*>\s*<\/figure>/gi, '');
  return h.replace(/\n{3,}/g, '\n\n');
}

// Move all mermaid diagrams out of the middle of the prose to the BOTTOM of the answer
// (just above "Related on PULSE", or the very end if there's none) — owner 2026-07-02.
// Never strip mermaid from inside the Direct Answer gold box (would leave an empty box).
function moveMermaidToBottom(html) {
  if (!html) return html;
  const blocks = [];
  const daStart = html.search(/<div\b[^>]*class="direct-answer-box"/i);
  const daEnd = directAnswerBoxEndPos(html);
  html = html.replace(/<div class="mermaid-wrap"><div class="mermaid">[\s\S]*?<\/div><\/div>/g, (m, offset) => {
    if (daStart !== -1 && daEnd !== -1 && offset > daStart && offset < daEnd) return m;
    blocks.push(m);
    return '';
  });
  if (!blocks.length) return html;
  const cluster = '\n' + blocks.join('\n') + '\n';
  const rel = html.search(/<h2[^>]*>\s*Related on PULSE/i);
  if (rel !== -1) return html.slice(0, rel) + cluster + html.slice(rel);
  return html + cluster;
}

function insertCroAd(html, id) {
  if (!html) return html;
  // Desktop hanging card + mobile inline card (each hidden on the other's viewport via CSS).
  let out = insertCroAdDesktop(html, id);
  const mob = '\n' + croMobileCard() + '\n';
  out = out.replace(/<div class="cro-mob-card[\s\S]*?<\/script>\s*/g, '');
  // Mobile uses the same Top-10 slot (#3 product) as desktop — NOT right after Direct Answer.
  const pos = croInsertPos(out);
  return out.slice(0, pos) + mob + out.slice(pos);
}

function insertCroAdDesktop(html, id) {
  if (!html) return html;
  html = stripRenderedCro(html);
  if (/class="cro-ad-card/.test(html)) {
    const first = html.match(/<div class="cro-ad cro-ad-card[\s\S]*?<\/script>/);
    if (first) {
      html = html.replace(/<div class="cro-ad cro-ad-card[\s\S]*?<\/script>\s*/g, '');
      const at = croInsertPos(html);
      return html.slice(0, at) + '\n' + first[0] + '\n' + html.slice(at);
    }
    return html;
  }
  const card = croAdCard();
  const mdAd = html.match(/<p>\s*💼[\s\S]*?<\/p>/);
  if (mdAd) html = html.slice(0, mdAd.index) + html.slice(mdAd.index + mdAd[0].length);
  const ad = '\n' + card + '\n';
  const at = croInsertPos(html);
  return html.slice(0, at) + ad + html.slice(at);
}

function findRelated(entry, allEntries, n) {
  n = n || 3;
  const myTagsArr = Array.isArray(entry.tags) ? entry.tags : [];
  const myTags = new Set(myTagsArr);
  if (!myTags.size) return [];
  return allEntries
    .filter(e => e.id !== entry.id)
    .map(e => {
      let overlap = 0;
      const tagsArr = Array.isArray(e.tags) ? e.tags : [];
      tagsArr.forEach(t => { if (myTags.has(t)) overlap++; });
      return { e, score: overlap };
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score || b.e.ts - a.e.ts)
    .slice(0, n)
    .map(x => x.e);
}

// AEO snippet-bait excerpt for meta description / OG / Twitter cards.
// The Machine's answers follow this structure:
//   ## Heading\n\n**40-50 word answer paragraph**\n\n---\n\n### THE DETAIL...
// We want the bold answer paragraph (snippet-bait), not the heading.
// Walk paragraphs in order, skip any that are pure headings or rules,
// and use the first real prose block. Strip markdown so the snippet
// renders cleanly in Google search results.
function stripMd(s) {
  return String(s || '')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')           // images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')        // links → text
    .replace(/`([^`]+)`/g, '$1')                    // inline code
    .replace(/\*\*([^*]+)\*\*/g, '$1')              // bold
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '$1')     // italic
    .replace(/^#{1,6}\s+/gm, '')                    // heading markers
    .replace(/^\s*[-*+]\s+/gm, '')                  // list bullets
    .replace(/^\s*\d+\.\s+/gm, '')                  // numbered list
    .replace(/^\s*>\s*/gm, '')                      // blockquote
    .replace(/\s+/g, ' ')
    .trim();
}
function descExcerpt(answer) {
  if (!answer) return '';
  const blocks = String(answer).split(/\n\s*\n/);
  for (const b of blocks) {
    const t = b.trim();
    if (!t) continue;
    if (/^#{1,6}\s/.test(t)) continue;             // skip pure heading
    if (/^[-=*_]{3,}\s*$/.test(t)) continue;       // skip horizontal rule
    if (/^```/.test(t)) continue;                  // skip code fence
    if (/^\|/.test(t)) continue;                   // skip table
    const cleaned = stripMd(t);
    if (cleaned.length < 40) continue;             // skip tiny fragments
    return clipMeta(cleaned);
  }
  return clipMeta(stripMd(answer));
}
// Keep the meta description <=160 chars (word boundary) so it's never flagged "long meta".
// PREEMPTIVE long-meta fix: every rendered page clips here, so the spider never sees >160.
function clipMeta(s) {
  s = String(s || '').trim(); const MAX = 158;
  if (s.length <= MAX) return s;
  let t = s.slice(0, MAX); const sp = t.lastIndexOf(' ');
  if (sp > 100) t = t.slice(0, sp);
  return t.replace(/[\s,;:.–\-]+$/, '') + '…';
}
// PREEMPTIVE meta-keywords fix (owner 4444 2026-06-29): default EVERY URL to the top ~50 best
// keyword phrases for THAT page, derived from its question + tags + stored cluster + n-gram
// phrases + standard SEO modifiers. Deduped, length-bounded, capped at 50.
const KW_STOP = new Set('a,an,the,to,of,for,in,on,at,by,and,or,with,your,you,is,are,was,were,do,does,did,can,could,should,would,what,how,where,when,why,who,whom,which,it,its,as,that,this,these,those,from,be,been,being,about,into,than,then,so,if,but,not,no,my,our,their,his,her'.split(','));
function metaKeywords(entry) {
  const out = []; const seen = new Set();
  const push = k => { k = String(k || '').trim().replace(/\s+/g, ' ').replace(/[?!.,;:]+$/, ''); const lk = k.toLowerCase(); if (k.length > 2 && k.length <= 60 && !seen.has(lk)) { seen.add(lk); out.push(k); } };
  const q = (entry.question || '').replace(/[?.!]+$/, '').trim();
  (entry.tags || []).forEach(push);
  (entry.keywords || []).forEach(push);
  (entry.keyword_cluster || []).forEach(push);
  (entry.kw_cluster || []).forEach(push);
  const core = q.replace(/^(what|how|where|when|why|who|which|is|are|do|does|can|could|should|would)\b\s*/i, '')
                .replace(/\bin\s+20\d\d\b/i, '').replace(/[?]/g, '').replace(/\s+/g, ' ').trim();
  push(core); push(q);
  const words = core.toLowerCase().split(/[^a-z0-9]+/).filter(w => w && !KW_STOP.has(w));
  for (let n = 2; n <= 4; n++) for (let i = 0; i + n <= words.length; i++) push(words.slice(i, i + n).join(' '));
  words.forEach(push);
  if (core) { [core + ' 2027', 'best ' + core, core + ' guide', core + ' tips', core + ' near me', core + ' explained'].forEach(push); }
  return out.slice(0, 50);
}

exports.handler = async (event) => {
  // Extract id from path: /knowledge/<id> OR ?id=<id>
  let id = null;
  const params = event.queryStringParameters || {};
  if (params.id) id = String(params.id).replace(/[^\w-]/g, '');
  if (!id && event.path) {
    // /knowledge/<id> OR any pretty pillar path /<pillar>/<id> (e.g. /cars/ca0977,
    // /sales-trainings/st0001). Netlify's ?id=:id query substitution doesn't populate
    // for the pillar rewrites, so fall back to the last id-shaped path segment
    // (1-4 letters + a digit, e.g. q11133, tl9398, bs0136). The index lookup below
    // 404s anything that isn't a real entry id.
    const m = event.path.match(/\/knowledge\/([\w-]+)/) ||
              event.path.replace(/\/+$/, '').match(/\/([A-Za-z]{1,4}\d[\w-]*)$/);
    if (m) id = m[1].replace(/[^\w-]/g, '');
  }
  if (!id) return { statusCode: 404, headers: { 'Content-Type': 'text/html' }, body: '<h1>404</h1><p>No entry id provided.</p>' };

  const store = initStore();
  if (!store) return { statusCode: 503, headers: { 'Content-Type': 'text/html' }, body: '<h1>503</h1><p>Library not available.</p>' };

  let entry, idx;
  let idxEntry = null;
  try {
    // Entry blob is small (per-page). The full _index.json is multi-MB (35k entries) and only needed for
    // related-link lookup — cache it in warm memory for 5 min so most renders skip the big fetch/parse (owner 2026-07-06 speed).
    entry = await store.get('answers/' + id + '.json', { type: 'json' });
    if (globalThis.__PULSE_IDX_CACHE && (Date.now() - globalThis.__PULSE_IDX_AT) < 300000) {
      idx = globalThis.__PULSE_IDX_CACHE;
    } else {
      idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
      globalThis.__PULSE_IDX_CACHE = idx; globalThis.__PULSE_IDX_AT = Date.now();
    }
  } catch (e) {
    return { statusCode: 500, headers: { 'Content-Type': 'text/html' }, body: '<h1>500</h1><p>Error reading library.</p>' };
  }
  // Index is source of truth for quality_score and polished_at — per-entry
  // blobs may carry stale values from before the score-system rebuild.
  if (entry && idx && Array.isArray(idx.entries)) {
    idxEntry = idx.entries.find(e => e && e.id === id) || null;
    if (idxEntry) {
      if (typeof idxEntry.quality_score === 'number') entry.quality_score = idxEntry.quality_score;
      entry.polished_at = idxEntry.polished_at || null;
    }
  }
  if (!entry) {
    return {
      statusCode: 404,
      headers: { 'Content-Type': 'text/html' },
      body: '<!doctype html><html><head><title>Not found · Pulse Library</title><meta name="robots" content="noindex"></head><body style="background:#070a0f;color:#EDE5D8;font-family:sans-serif;padding:40px;"><h1>Entry not found</h1><p>This library entry doesn\'t exist or has been removed.</p><p><a href="/knowledge.html" style="color:#FF8C1A;">Back to the library</a></p></body></html>',
    };
  }

  const url       = SITE + '/knowledge/' + id;
  const title     = (entry.question || '').slice(0, 70);
  const desc      = descExcerpt(entry.answer);
  // SEO <title> kept <=65 chars (fixes "long titles") — the full question stays as the H1.
  const shortTitle = (() => {
    const q = (entry.question || '').trim(); const SUF = ' | Pulse News'; const max = 65 - SUF.length;
    if (q.length <= max) return q + SUF;
    let t = q.slice(0, max); const sp = t.lastIndexOf(' ');
    if (sp > 24) t = t.slice(0, sp);
    return t.replace(/[\s,;:.–-]+$/, '') + '…' + SUF;
  })();
  const tagsList  = entry.tags || [];
  const sourcesArr= entry.sources || [];
  const entryPillar = (String(id).match(/^[a-z]+/) || [''])[0];
  const related   = findRelated({ id, tags: tagsList }, idx.entries || [], 10);

  // Prev/Next neighbors by q-ID numeric order — gives Google explicit
  // sequential crawl pathing via <link rel="prev">/<link rel="next">.
  // Also rendered as a nav at the bottom of the page for human users.
  function qNum(qid) {
    const m = /^q0*(\d+)$/.exec(qid || '');
    return m ? parseInt(m[1], 10) : null;
  }
  const allQEntries = (idx.entries || []).filter(e => e && /^q\d+$/.test(e.id || '')).map(e => ({ id: e.id, n: qNum(e.id), question: e.question || '' })).filter(e => e.n !== null).sort((a, b) => a.n - b.n);
  const myIdx = allQEntries.findIndex(e => e.id === id);
  const prevQ = myIdx > 0 ? allQEntries[myIdx - 1] : null;
  const nextQ = myIdx >= 0 && myIdx < allQEntries.length - 1 ? allQEntries[myIdx + 1] : null;
  const prevUrl = prevQ ? (SITE + '/knowledge/' + prevQ.id) : '';
  const nextUrl = nextQ ? (SITE + '/knowledge/' + nextQ.id) : '';
  const seqNavLinks = (prevQ ? '<link rel="prev" href="' + prevUrl + '">' : '') + (nextQ ? '<link rel="next" href="' + nextUrl + '">' : '');
  // Crawl-flow boost: 15 random recent entries (last 200 pool) for Google to follow.
  // "Discovered - not indexed" is the dominant GSC reason; more in-page links to
  // not-yet-crawled URLs gives Google fresh discovery paths from indexed pages.
  const recentPool = (idx.entries || []).filter(e => e && e.id && e.id !== id).slice(0, 200);
  const moreLinks = [];
  const usedIds = new Set([id, ...related.map(r => r.id)]);
  for (let i = 0; i < 15 && recentPool.length; i++) {
    const pick = recentPool[Math.floor(Math.random() * recentPool.length)];
    if (pick && !usedIds.has(pick.id)) { moreLinks.push(pick); usedIds.add(pick.id); }
  }
  const datePub   = new Date(entry.ts || Date.now()).toISOString();

  // JSON-LD: QAPage + TechArticle. Author attribution names BOTH the Machine
  // (the AI agent that researched the answer) AND Kory White as editor — the
  // human operator whose 22-year revenue expertise stands behind the curation.
  // Strengthens E-E-A-T signal for Google + AI Overviews.
  const machineAuthor = {
    "@type": "Organization",
    "@id": SITE + "/#themachine",
    "name": "Pulse",
    "url": SITE + "/themachine",
    "description": "Autonomous AI knowledge engine for Sales RevOps. Researches one operator question every 30 minutes with Claude Sonnet 4.6 + live web search."
  };
  const koryEditor = {
    "@type": "Person",
    "@id": SITE + "/#korywhite",
    "name": "Kory White",
    "jobTitle": ["Fractional CRO", "Fractional Chief Revenue Officer"],
    "description": "Fractional CRO — Fractional Chief Revenue Officer with 25 years in revenue leadership; has driven $0→$200M in revenue. Available for fractional / interim / part-time Fractional Chief Revenue Officer engagements via CRO Syndicate.",
    "url": SITE + "/resume",
    "image": SITE + "/assets/kory-white.jpg",
    "knowsAbout": ["Fractional CRO", "Fractional Chief Revenue Officer", "Chief Revenue Officer", "Revenue Operations (RevOps)", "Go-to-Market strategy", "Sales leadership", "Revenue architecture", "Pipeline and forecasting"],
    "worksFor": { "@type": "Organization", "@id": "https://crosyndicate.com/#org", "name": "CRO Syndicate", "url": "https://crosyndicate.com/?utm_source=pulserevops.com&utm_medium=referral&utm_campaign=cro-schema" },
    "sameAs": [
      "https://www.linkedin.com/in/korywhite",
      "https://crosyndicate.com/?utm_source=pulserevops.com&utm_medium=referral&utm_campaign=cro-schema",
      "https://theexecutivereview.org/kory-white.html",
      SITE + "/resume"
    ]
  };
  // Fractional-CRO SERVICE entity — so Google associates the "hire a fractional CRO" intent
  // with Kory / CRO Syndicate (service-search lever, owner lead-gen pivot 2026-07-08).
  const croService = {
    "@type": "Service",
    "@id": SITE + "/#fractional-cro-service",
    "serviceType": "Fractional CRO — Fractional Chief Revenue Officer",
    "name": "Fractional CRO (Fractional Chief Revenue Officer)",
    "alternateName": ["Fractional CRO", "Fractional Chief Revenue Officer"],
    "provider": { "@type": "ProfessionalService", "name": "CRO Syndicate", "url": "https://crosyndicate.com/?utm_source=pulserevops.com&utm_medium=referral&utm_campaign=cro-schema", "founder": { "@id": SITE + "/#korywhite" } },
    "areaServed": "US",
    "description": "Fractional, interim, and part-time Chief Revenue Officer engagements — revenue operations, GTM, pipeline, and forecasting leadership."
  };
  const publisherOrg = {
    "@type": "Organization",
    "@id": SITE + "/#organization",
    "name": "Pulse News",
    "url": SITE,
    "founder": koryEditor,
    "logo": pulseOrgLogoImageObject()
  };

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      koryEditor,
      croService,
      {
        "@type": "QAPage",
        "url": url,
        "mainEntity": {
          "@type": "Question",
          "name": entry.question,
          "answerCount": 1,
          "datePublished": datePub,
          "author": machineAuthor,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": String(entry.answer || '').slice(0, 5000),
            "url": url,
            "datePublished": datePub,
            "author": machineAuthor
          }
        }
      },
      {
        "@type": "TechArticle",
        "headline": entry.question,
        "url": url,
        "datePublished": datePub,
        "dateModified": (entry.polished_at ? new Date(entry.polished_at).toISOString() : datePub),
        "keywords": tagsList.join(', '),
        "author":    machineAuthor,
        "editor":    koryEditor,
        "publisher": publisherOrg,
        "mainEntityOfPage": { "@type": "WebPage", "@id": url },
        "description": desc
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home",      "item": SITE + "/" },
          { "@type": "ListItem", "position": 2, "name": "Knowledge Library", "item": SITE + "/knowledge.html" },
          { "@type": "ListItem", "position": 3, "name": entry.question, "item": url }
        ]
      }
    ]
  };

  // Always render the original Operator voice (entry.answer) for uniform UX
  // across the entire library. The In-Between bake was disabled 2026-05-04;
  // any partial-baked answer_between fields are ignored.
  // CRO card is injected at RENDER time (insertCroAd) — strip any in-blob card so pages never double.
  const croStripped = stripBlobCro(entry.answer || '');
  const rankingList = RANKING_LIST_NO_TOP_HERO && isRankingListBody(croStripped, entry.question || entry.h1);
  const qaEssay = appliesQaGold(id, croStripped, { title: entry.question || entry.h1 });
  const noTopHero = rankingList || qaEssay;
  const coverLead = leadingCoverFromBody(croStripped);
  const heroUrl = pickHeroUrl(croStripped, idxEntry && idxEntry.img, id, noTopHero);
  const heroFallback = firstProductImg(croStripped);
  const heroAlt = entry.question || (coverLead && coverLead.alt) || id;
  const heroHtml = (heroUrl ? entryCoverFigureHtmlWithFallback(heroAlt, heroUrl, heroFallback && heroFallback !== heroUrl ? heroFallback : '') : '');
  let bodyForMd = noTopHero ? stripLeadingCoverMarkdown(croStripped) : croStripped;
  bodyForMd = bodyForMd.replace(/<!--pillar-weave-->|<!--cro-weave-->/g, '');
  if (heroHtml) bodyForMd = stripLeadingCoverMarkdown(bodyForMd);
  let renderedAnswer = stripAnswerContentImages(wrapDirectAnswerGold(renderMd(bodyForMd, /^sy\d+$/i.test(id), noTopHero || !!heroHtml)), rankingList);

  // Word count for the meta row — strip markdown noise (code fences, URLs,
  // table pipes, heading hashes) so the count reflects readable prose.
  const wordCount = (() => {
    const raw = String(entry.answer || '');
    const cleaned = raw
      .replace(/```[\s\S]*?```/g, ' ')        // fenced code blocks (mermaid, etc.)
      .replace(/https?:\/\/\S+/g, ' ')         // URLs
      .replace(/[#>*_`~|\-=]/g, ' ')           // markdown punctuation
      .replace(/\s+/g, ' ')
      .trim();
    return cleaned ? cleaned.split(' ').filter(Boolean).length : 0;
  })();
  const wordCountFmt = wordCount.toLocaleString('en-US');

  // Normalize sources — entries store them as either string URLs OR {url, title} objects
  const normalizedSources = sourcesArr
    .map(s => typeof s === 'string' ? { url: s, title: '' } : s)
    .filter(s => s && s.url);
  const sourcesHtml = normalizedSources.length
    ? '<div class="entry-sources"><div class="entry-sources-label">Sources cited</div>'
      + normalizedSources.map(s => '<a class="entry-source" href="' + escAttr(s.url) + '" target="_blank" rel="noopener noreferrer">'
          + '<span class="es-host">' + escHtml(hostOf(s.url)) + '</span>'
          + '<span class="es-title">' + escHtml(s.title || s.url) + '</span></a>').join('')
      + '</div>' : '';

  const relatedHtml = related.length
    ? '<div class="entry-sources" style="margin-top:18px;"><div class="entry-sources-label">Deep dive · related in the library</div>'
      + related.map(r => '<a class="entry-source" href="/knowledge/' + escAttr(r.id) + '">'
          + '<span class="es-host">' + escHtml((r.tags || []).slice(0, 2).join(' · ') || '·') + '</span>'
          + '<span class="es-title">' + escHtml(r.question) + '</span></a>').join('')
      + '</div>' : '';
  const moreHtml = moreLinks.length
    ? '<div class="entry-sources" style="margin-top:18px;"><div class="entry-sources-label">More from the library</div>'
      + moreLinks.map(r => '<a class="entry-source" href="/knowledge/' + escAttr(r.id) + '">'
          + '<span class="es-host">' + escHtml((r.tags || []).slice(0, 2).join(' · ') || '·') + '</span>'
          + '<span class="es-title">' + escHtml(r.question || r.id) + '</span></a>').join('')
      + '</div>' : '';

  // ── Apply-this-in-PULSE — dynamic operator-tools section based on tags.
  // Cross-link from library entries into the free CRM / pillar pages so
  // the library compounds value out instead of dead-ending on read.
  const tagSet = new Set((tagsList || []).map(t => String(t).toLowerCase()));
  const tagText = (entry.question + ' ' + (entry.answer || '').slice(0, 400)).toLowerCase();
  function matchAny(words) {
    return words.some(w => tagSet.has(w) || tagText.includes(w));
  }
  const tools = [];
  if (matchAny(['discount', 'discount-governance', 'deal-desk', 'pricing-authority', 'pricing-discipline', 'shadow-pricing', 'cpq']))
    tools.push({ href: '/pillars/deal-desk-architecture-scaled-governance', title: 'Pillar · Deal Desk Architecture', sub: 'From founder override to scaled governance' });
  if (matchAny(['founder', 'founder-led', 'early-stage', 'series-a', 'series-b', 'pmf', 'product-market-fit']))
    tools.push({ href: '/pillars/founder-led-sales-governance-stack', title: 'Pillar · Founder-Led Sales Governance', sub: 'The governance stack that scales' });
  if (matchAny(['crm', 'salesforce', 'hubspot', 'data-hygiene', 'pipeline-hygiene', 'cro-strategy', 'cro-playbook']))
    tools.push({ href: '/dashboard.html#rev-intel-section', title: 'Free CRM · Revenue Intelligence', sub: 'Audit pipeline, score reps, ship the fix' });
  if (matchAny(['pulse-check', 'rep-scoring', 'coaching', 'performance', 'attainment']))
    tools.push({ href: '/dashboard.html#inline-matrix', title: 'Pulse Check', sub: 'Score reps on the metrics that matter' });
  if (matchAny(['comp', 'ote', 'compensation', 'accelerators', 'quota', 'gross-profit']))
    tools.push({ href: '/dashboard.html#profit-calc-section', title: 'Gross Profit Calculator', sub: 'Model margin per deal, per rep, per territory' });
  if (matchAny(['hiring', 'recruiting', 'headcount', 'ramp']))
    tools.push({ href: '/dashboard.html#recruiting-calc-section', title: 'Recruiting Calculator', sub: 'How many reps you need before you hire' });
  if (matchAny(['scheduling', 'shift', 'capacity', 'territory']))
    tools.push({ href: '/dashboard.html#sched-matrix-section', title: 'Rep Scheduling Matrix', sub: 'Protect high-value selling time' });
  if (matchAny(['saas', 'arr', 'nrr', 'churn']))
    tools.push({ href: '/how-tos/saas.html#silent-killer', title: 'How-To · SaaS Churn', sub: 'Silent revenue killer playbook' });
  if (matchAny(['hvac', 'home-services', 'service-fleet']))
    tools.push({ href: '/how-tos/hvac.html#million-ceiling', title: 'How-To · The $1M HVAC Ceiling', sub: 'Capacity, routing, maintenance density' });

  const toolsHtml = tools.length
    ? '<div class="entry-sources" style="margin-top:18px;border-color:rgba(232,113,10,0.35);"><div class="entry-sources-label" style="color:#FF8C1A;">⌬ Apply this in PULSE</div>'
      + tools.slice(0, 3).map(t => '<a class="entry-source" href="' + escAttr(t.href) + '" style="border-color:rgba(232,113,10,0.25);">'
          + '<span class="es-host" style="color:rgba(255,140,26,0.7);">' + escHtml(t.title) + '</span>'
          + '<span class="es-title">' + escHtml(t.sub) + '</span></a>').join('')
      + '</div>' : '';

  const tagsHtml = tagsList.map(t => {
    const slug = String(t).toLowerCase().replace(/[^a-z0-9-]/g, '');
    return '<a class="entry-tag" href="/knowledge/tag/' + escAttr(slug) + '">' + escHtml(t) + '</a>';
  }).join('');

  // Share row — always visible at bottom of every knowledge entry
  const shareText  = encodeURIComponent(entry.question + ' — Pulse Knowledge Library');
  const shareUrl   = encodeURIComponent(url);
  const linkedInUrl = 'https://www.linkedin.com/sharing/share-offsite/?url=' + shareUrl;
  const xUrl        = 'https://twitter.com/intent/tweet?text=' + shareText + '&url=' + shareUrl + '&via=coachkorywhite';
  const facebookUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + shareUrl;
  const emailUrl    = 'mailto:?subject=' + shareText + '&body=' + encodeURIComponent('From the Pulse Knowledge Library:\n\n' + entry.question + '\n\n' + url);
  const shareImg    = SITE + '/og-preview.jpg';
  const shareHtml = '<div class="share-row entry-share" aria-label="Share this answer" style="display:flex !important;visibility:visible !important;opacity:1 !important;">'
    + '<span class="share-label">Share:</span>'
    + '<a class="share-btn" href="' + linkedInUrl + '" target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">LinkedIn</a>'
    + '<a class="share-btn" href="' + xUrl + '" target="_blank" rel="noopener noreferrer" aria-label="Share on X">X</a>'
    + '<a class="share-btn" href="' + facebookUrl + '" target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">Facebook</a>'
    + '<a class="share-btn" href="' + emailUrl + '" aria-label="Share via email">Email</a>'
    + '<button class="share-btn share-copy copy-link" type="button" data-url="' + escAttr(url) + '" aria-label="Copy link">'
    + '<span class="share-copy-lbl">Copy link</span></button>'
    + '</div>';

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escHtml(shortTitle)}</title>
  <meta name="description" content="${escAttr(desc)}">
  <meta name="keywords" content="${escAttr(metaKeywords(entry).join(', '))}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
  <link rel="canonical" href="${url}">
  ${seqNavLinks}
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escAttr(title)}">
  <meta property="og:description" content="${escAttr(desc)}">
  <meta property="og:url" content="${url}">
  <meta property="og:site_name" content="Pulse News">
  <meta property="og:image" content="${shareImg}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escAttr(title)}">
  <meta name="twitter:description" content="${escAttr(desc)}">
  <meta name="twitter:image" content="${shareImg}">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png">
  <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <script type="application/ld+json">${JSON.stringify(ld)}</script>
  <script>
    /* LAZY mermaid (owner 2026-07-06 speed): never render-blocking. Skip the ~1MB lib entirely on pages
       with no diagrams; otherwise load it AFTER first paint so the answer text shows instantly. */
    (function(){
      function loadMermaid(){
        if(!document.querySelector('.mermaid')) return;   // no diagram → don't fetch mermaid at all
        var s=document.createElement('script');
        s.src='https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
        s.async=true;
        s.onload=function(){ try{ window.mermaid.initialize({ startOnLoad:false, theme:'dark', securityLevel:'loose',
          themeVariables:{ fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
            primaryColor:'#1a1f29', primaryTextColor:'#EDE5D8', primaryBorderColor:'#E8710A',
            lineColor:'rgba(232,113,10,0.65)', mainBkg:'#1a1f29', textColor:'#EDE5D8' } });
          if(window.mermaid.run) window.mermaid.run(); }catch(e){} };
        document.body.appendChild(s);
      }
      if(document.readyState==='loading') window.addEventListener('DOMContentLoaded', function(){ setTimeout(loadMermaid,0); });
      else setTimeout(loadMermaid,0);
    })();
  </script>
  <style>
    :root { --orange:#E8710A; --orange-bright:#FF8C1A; --ink:#EDE5D8; --bg:#070a0f; --muted:rgba(237,229,216,0.5); }
    *{box-sizing:border-box;}
    /* site-wide brightness bump (owner 2026-07-06): brighten all in-body + cover images */
    article img, .body img, .entry-hero img, figure img { filter: brightness(1.22) saturate(1.04); }
    ${ANSWER_CONTENT_IMAGES_OFF ? '.body img,.body figure.entry-section,.body figure.entry-graphic,.body figure.entry-cover{display:none!important;}.body .product-card>a,.body .product-card>a img,.body .product-card img,.body .v2-pick>div>a,.body .v2-pick>div>a img,.body .v2-pick img{display:block!important;}' : ''}
    html,body{margin:0;padding:0;background:var(--bg);color:var(--ink);font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.7;}
    a{color:var(--orange-bright);text-decoration:none;}
    a:hover{text-decoration:underline;}
    .top{padding:18px clamp(20px,5vw,56px);display:flex;justify-content:space-between;align-items:center;font-size:0.7rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(237,229,216,0.65);border-bottom:1px solid rgba(255,255,255,0.05);}
    .top a{color:var(--orange-bright);}
    .top .brand{display:flex;align-items:center;}
    .top .brand:hover{text-decoration:none;}
    .top .brandlogo{height:46px;width:auto;display:block;}
    @media(max-width:600px){.top .brandlogo{height:38px;}}
    /* ── DARK MASTHEAD (owner 2026-07-02): the gold Pulse News logo on a black band with a thin
       gold pulse-hairline along the bottom edge. Higher specificity (body .top) + !important beats
       the sitewide tan sheet's cream .top so the gold logo pops instead of washing out on cream. ── */
    body .top{background:linear-gradient(90deg,#0a0c11 0%,#171b23 52%,#0a0c11 100%) !important;border-bottom:none !important;position:relative !important;padding:16px clamp(20px,5vw,56px) !important;box-shadow:0 2px 18px rgba(0,0,0,0.25);}
    body .top a{color:#e7d4a1 !important;}
    body .top a:hover{color:#ffe9b0 !important;text-decoration:none;}
    body .top::after{content:"" !important;position:absolute;left:0;right:0;bottom:0;height:2px;background:linear-gradient(90deg,rgba(200,130,30,0) 0%,#C8821E 18%,#f2d987 50%,#C8821E 82%,rgba(200,130,30,0) 100%) !important;box-shadow:0 0 10px rgba(242,217,135,0.55);}
    article{max-width:880px;margin:0 auto;padding:36px clamp(20px,5vw,40px) 64px;}
    .crumb{font-size:0.66rem;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:var(--muted);margin-bottom:14px;}
    .crumb a{color:var(--muted);}
    h1.q{font-family:Fraunces,Georgia,'Times New Roman',serif;font-size:clamp(2.7rem,5.6vw,4.1rem);font-weight:900;letter-spacing:-0.015em;line-height:1.1;margin:0 0 22px;}
    .meta-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center;font-size:0.66rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(237,229,216,0.45);margin-bottom:28px;}
    .entry-tag{display:inline-block;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08);color:rgba(237,229,216,0.7);padding:3px 9px;border-radius:99px;font-size:0.6rem;text-decoration:none;transition:all 0.12s;}
    a.entry-tag:hover{background:rgba(232,113,10,0.12);border-color:rgba(232,113,10,0.4);color:rgba(255,180,90,0.9);text-decoration:none;}
    .body p{margin:0 0 16px;color:rgba(237,229,216,0.94);font-size:1.15rem;}
    .body .direct-answer-box{margin:0 0 22px !important;padding:18px 20px !important;border:2px solid #C8821E !important;border-radius:14px !important;background:#FBF3E4 !important;box-shadow:0 0 0 1px rgba(200,130,30,.18), inset 0 0 0 1px rgba(200,130,30,.08) !important;}
    .body .direct-answer-box p,.body .direct-answer-box li{color:#1d1711 !important;}
    .body .direct-answer-box strong,.body .direct-answer-box b{color:#1d1711 !important;}
    @media(max-width:640px){
      .body,.body p,.body li{font-size:1.2rem !important;line-height:1.72 !important;}
      .body .direct-answer-box p{font-size:1.18rem !important;}
    }
    /* CRO hanging widget — a little sign that hangs top-right from a cord+peg, sways, stays on scroll */
    .cro-ad-root{position:fixed;top:0;right:28px;width:322px;z-index:2147483000;font-family:'Plus Jakarta Sans',-apple-system,'Segoe UI',system-ui,sans-serif;pointer-events:none;text-align:left;}
    .cro-ad-root *{box-sizing:border-box;}
    .cro-swing{position:relative;padding-top:44px;transform-origin:50% 0;animation:cro-sway 5.5s ease-in-out infinite;pointer-events:auto;}
    .cro-cord{position:absolute;top:0;left:50%;width:3px;height:46px;margin-left:-1.5px;background:linear-gradient(#d7c19f,#c6ab80);border-radius:2px;box-shadow:0 0 0 .5px rgba(120,92,52,.35);}
    .cro-cord::before{content:"";position:absolute;top:-4px;left:50%;width:9px;height:9px;margin-left:-4.5px;border-radius:50%;background:#b89a6c;box-shadow:0 1px 2px rgba(0,0,0,.3);}
    .cro-peg{position:absolute;top:34px;left:50%;width:40px;height:20px;margin-left:-20px;background:linear-gradient(180deg,#e4c489,#caa15f);border-radius:5px;box-shadow:0 2px 4px rgba(0,0,0,.28),inset 0 -2px 3px rgba(120,80,30,.35);z-index:3;}
    .cro-peg::before{content:"";position:absolute;left:50%;top:2px;width:2px;height:16px;margin-left:-1px;background:rgba(120,80,30,.4);}
    .cro-peg::after{content:"";position:absolute;left:6px;right:6px;top:8px;height:4px;border-radius:2px;background:linear-gradient(#c9c9cf,#8f8f97);box-shadow:0 1px 1px rgba(0,0,0,.25);}
    .cro-card{position:relative;margin-top:6px;border-radius:16px;overflow:hidden;padding:16px 18px 18px 22px;background:linear-gradient(155deg,#fff 0%,#fdf1f0 60%,#fbe9e8 100%);border:1px solid #f0d3d2;box-shadow:0 18px 40px -12px rgba(90,10,10,.45),0 4px 12px rgba(0,0,0,.12);}
    .cro-spine{position:absolute;left:0;top:0;bottom:0;width:7px;background:linear-gradient(#a71c1c,#8b0202);}
    .cro-close{position:absolute;top:9px;right:9px;width:26px;height:26px;border:none;cursor:pointer;border-radius:50%;background:#fff;color:#a71c1c;font-size:19px;line-height:1;box-shadow:0 1px 4px rgba(0,0,0,.22);transition:background .15s,color .15s,transform .15s;padding:0;}
    .cro-close:hover{background:#a71c1c;color:#fff;transform:scale(1.06);}
    .cro-top{display:flex;align-items:center;justify-content:space-between;}
    .cro-logo{font-weight:900;font-size:15px;letter-spacing:.4px;color:#8b0202;}.cro-logo em{font-style:normal;color:#232327;}
    .cro-sponsored{font-size:9px;font-weight:700;letter-spacing:1.3px;color:#9a6b6b;background:#f4dedd;border-radius:20px;padding:3px 9px;margin-right:26px;}
    .cro-hero{display:flex;align-items:center;gap:12px;margin:12px 0 6px;}
    .cro-photo{flex:0 0 auto;width:70px;height:70px;border-radius:50%;padding:3px;background:#fff;box-shadow:0 0 0 2.5px #8b0202;}
    .cro-photo img{width:100%;height:100%;border-radius:50%;display:block;object-fit:cover;}
    .cro-name{display:block;font-size:22px;font-weight:800;color:#a71c1c;line-height:1;}
    .cro-role{display:block;font-size:12px;font-weight:600;color:#3f3f45;margin-top:4px;}
    .cro-eyebrow{margin:6px 0 0;font-size:9.5px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:#a71c1c;}
    .cro-head{margin:4px 0 0;font-size:19px;line-height:1.12;font-weight:800;color:#232327;padding-bottom:7px;border-bottom:3px solid #a71c1c;display:inline-block;}
    .cro-pills{display:flex;flex-wrap:wrap;gap:6px;margin:11px 0 0;}
    .cro-pills span{font-size:10.5px;font-weight:700;color:#8b0202;border:1.4px solid #e6b7b6;background:rgba(255,255,255,.6);border-radius:20px;padding:4px 10px;}
    .cro-body{margin:11px 0 13px !important;font-size:12px !important;line-height:1.42 !important;color:#45454b !important;}.cro-body b{color:#8b0202;}
    .cro-btn{display:block;text-align:center;text-decoration:none;font-size:14px;font-weight:800;color:#fff;background:linear-gradient(180deg,#b81f1f,#8b0202);border-radius:30px;padding:11px 14px;box-shadow:0 6px 14px -4px rgba(139,2,2,.6);transition:transform .12s,box-shadow .12s;}
    .cro-btn:hover{transform:translateY(-1px);box-shadow:0 9px 18px -5px rgba(139,2,2,.7);text-decoration:none;}
    .cro-links{display:flex;justify-content:space-between;gap:8px;margin-top:11px;}
    .cro-links a{font-size:11.5px;font-weight:700;color:#a71c1c;text-decoration:none;border-bottom:2px solid rgba(167,28,28,.35);padding-bottom:1px;}
    .cro-links a:hover{color:#8b0202;border-color:#8b0202;text-decoration:none;}
    @keyframes cro-sway{0%,100%{transform:rotate(-1.5deg);}50%{transform:rotate(1.5deg);}}
    .cro-ad-root.cro-drop .cro-swing{animation:none;transition:transform .7s cubic-bezier(.4,0,.6,1),opacity .7s ease;transform:rotate(11deg) translateY(130vh);opacity:0;}
    @media(prefers-reduced-motion:reduce){.cro-swing{animation:none;transform:rotate(-1deg);}}
    /* NO-OVERLAP: on wide screens shift the WHOLE page left, leaving a clean right column for the
       hanging widget (article stays balanced/centered in the left region, not shoved right). When the
       user × dismisses it, body.cro-dismissed removes the shift and everything re-centers. Below the
       threshold the widget hides so it never covers text. */
    @media(min-width:1200px){ body{padding-right:352px;transition:padding-right .5s ease;} body.cro-dismissed{padding-right:0;} article{max-width:1240px;} body.cro-dismissed article{max-width:880px;} }
    /* MOBILE / narrow: HIDE the CRO card entirely (owner 2026-07-01). Phones get the same clean,
       full-width reading page as desktop — no bottom dock, no content shift. Card is desktop-only. */
    @media(max-width:1199px){
      .cro-ad-root{display:none!important;}
      body{padding-right:0!important;}
    }
    /* MOBILE inline CRO card — IDENTICAL to the desktop hanging card (reuses .cro-swing/.cro-card),
       just inline instead of fixed. Hidden on desktop (desktop keeps the fixed hanging card). */
    .cro-mob-card{display:none;}
    @media(max-width:1199px){
      /* full-width image-sized slot; the exact desktop card centered inside (dead space on sides is fine) */
      .cro-mob-card{display:flex;justify-content:center;width:100%;margin:28px 0 24px;padding:8px 0 12px;background:rgba(236,227,210,.55);border-radius:14px;border:1px solid rgba(29,23,17,.08);}
      .cro-mob-card .cro-swing{width:min(322px,88vw);}
    }
    .body strong{color:#fff;}
    .body h2,.body h3{font-size:0.82rem;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:var(--orange-bright);margin:22px 0 10px;}
    .body ul,.body ol{margin:8px 0 16px;padding-left:24px;}
    .body li{margin-bottom:7px;font-size:1.1rem;}
    .body table{width:100%;border-collapse:collapse;margin:14px 0 18px;font-size:0.92rem;}
    .body th,.body td{padding:8px 12px;text-align:left;border-bottom:1px solid rgba(255,255,255,0.08);}
    .body th{color:var(--orange-bright);font-weight:800;letter-spacing:0.04em;text-transform:uppercase;font-size:0.72rem;}
    .body code{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08);padding:1px 6px;border-radius:4px;font-family:'JetBrains Mono','SF Mono',monospace;font-size:0.85em;color:#FFD740;}
    .body .mermaid-wrap{margin:14px 0;padding:18px;background:rgba(0,0,0,0.4);border:1px solid rgba(232,113,10,0.18);border-radius:10px;overflow-x:auto;text-align:center;position:relative;}
    .body .mermaid-wrap svg{max-width:100% !important;height:auto !important;cursor:zoom-in;transition:transform 0.15s;}
    .body .mermaid-wrap svg:hover{transform:scale(1.01);}
    .body .mermaid-wrap::after{content:"⛶ click to zoom";position:absolute;top:8px;right:12px;font-size:0.6rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,140,26,0.55);pointer-events:none;}
    .viz-lightbox{position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:9999;display:none;align-items:center;justify-content:center;padding:24px;cursor:zoom-out;}
    .viz-lightbox.show{display:flex;}
    .viz-lightbox-inner{width:96vw;height:92vh;max-width:1600px;background:#0e1218;border:1px solid rgba(232,113,10,0.4);border-radius:14px;padding:24px;overflow:auto;display:flex;align-items:center;justify-content:center;}
    .viz-lightbox-inner svg{width:100%;height:auto;max-height:88vh;display:block;}
    .viz-lightbox-close{position:absolute;top:18px;right:22px;background:rgba(232,113,10,0.18);border:1px solid rgba(232,113,10,0.55);color:#FFD7A8;font-size:1.4rem;width:42px;height:42px;border-radius:50%;cursor:pointer;font-weight:900;line-height:1;display:flex;align-items:center;justify-content:center;}
    .viz-lightbox-close:hover{background:rgba(232,113,10,0.35);}
    .dl-btn{display:inline-flex;align-items:center;gap:6px;background:rgba(232,113,10,0.1);border:1px solid rgba(232,113,10,0.4);color:#FFB46A;padding:6px 12px;border-radius:8px;font-family:inherit;font-size:0.7rem;font-weight:700;letter-spacing:0.06em;cursor:pointer;text-decoration:none;transition:all 0.15s;}
    .dl-btn:hover{background:rgba(232,113,10,0.22);border-color:rgba(232,113,10,0.7);color:#FFD7A8;text-decoration:none;}
    .dl-row{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0 4px;padding-top:14px;border-top:1px solid rgba(255,255,255,0.06);}
    .dl-label{font-size:0.6rem;font-weight:800;letter-spacing:0.22em;text-transform:uppercase;color:rgba(237,229,216,0.45);margin-right:4px;align-self:center;}
    .entry-sources{margin-top:22px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.08);}
    .entry-sources-label{font-size:0.6rem;font-weight:800;letter-spacing:0.22em;text-transform:uppercase;color:rgba(237,229,216,0.45);margin-bottom:8px;}
    .entry-source{display:flex;gap:12px;padding:10px 14px;margin:6px 0;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:8px;align-items:center;text-decoration:none;color:rgba(237,229,216,0.85);}
    .entry-source:hover{background:rgba(232,113,10,0.06);border-color:rgba(232,113,10,0.45);text-decoration:none;}
    .entry-source .es-host{font-size:0.62rem;color:rgba(237,229,216,0.45);letter-spacing:0.08em;text-transform:uppercase;flex-shrink:0;}
    .entry-source .es-title{font-size:0.92rem;color:rgba(237,229,216,0.9);flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
    .footer-note{padding:24px;text-align:center;color:rgba(237,229,216,0.35);font-size:0.66rem;letter-spacing:0.16em;}
    .share-row,.entry-share{display:flex !important;visibility:visible !important;opacity:1 !important;align-items:center;flex-wrap:wrap;gap:8px;margin:28px 0 8px;padding:16px 0;border-top:1px solid rgba(255,255,255,0.12);}
    .share-label{font-size:0.65rem;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:rgba(237,229,216,0.55);margin-right:6px;}
    .share-btn{display:inline-flex;align-items:center;justify-content:center;gap:4px;min-height:36px;padding:0 12px;border-radius:8px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.14);color:rgba(237,229,216,0.85);font-family:inherit;font-size:0.72rem;font-weight:700;letter-spacing:0.03em;cursor:pointer;text-decoration:none;transition:all 0.15s;}
    .share-btn.share-copy{padding:0 14px;}
    .share-copy-lbl{font-size:0.72rem;font-weight:700;}
    .share-btn:hover{border-color:rgba(232,113,10,0.55);color:var(--orange-bright);background:rgba(232,113,10,0.08);text-decoration:none;}
    .share-btn.copied{color:var(--green,#22c55e);border-color:rgba(34,197,94,0.5);}
    .share-btn.copied .share-copy-lbl::after{content:' ✓';}
    .layman-hero{margin:0 0 22px;padding:18px 22px;background:linear-gradient(135deg,rgba(255,140,26,0.18),rgba(232,113,10,0.1));border:2px solid rgba(255,140,26,0.55);border-radius:14px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;box-shadow:0 4px 14px rgba(232,113,10,0.15);}
    .layman-hero-text{flex:1;min-width:200px;}
    .layman-hero-title{font-size:0.96rem;font-weight:900;color:#FFD7A8;letter-spacing:0.01em;line-height:1.3;margin-bottom:3px;}
    .layman-hero-sub{font-size:0.78rem;color:rgba(237,229,216,0.7);line-height:1.4;}
    .layman-row{margin:18px 0 4px;}
    .layman-btn{display:inline-flex;align-items:center;gap:10px;background:linear-gradient(180deg,#FF8C1A,#E8710A);border:none;color:#0a0a0a;padding:14px 22px;border-radius:12px;font-family:inherit;font-size:0.92rem;font-weight:900;letter-spacing:0.04em;cursor:pointer;transition:all 0.15s;box-shadow:0 3px 10px rgba(232,113,10,0.4);white-space:nowrap;}
    .layman-btn:hover:not([disabled]){transform:translateY(-1px);box-shadow:0 5px 16px rgba(232,113,10,0.55);background:linear-gradient(180deg,#FFA640,#FF8C1A);}
    .layman-btn[disabled]{opacity:0.65;cursor:wait;}
    .voice-btn{padding:10px 14px;font-size:0.82rem;letter-spacing:0.02em;}
    .voice-btn .lb-icon{font-size:1rem;}
    .voice-btn:not(.voice-active){background:rgba(255,140,26,0.08);color:rgba(255,215,168,0.85);box-shadow:none;border:1px solid rgba(255,140,26,0.35);}
    .voice-btn:not(.voice-active):hover{background:rgba(255,140,26,0.15);color:#FFD7A8;}
    .voice-btn.voice-active{background:linear-gradient(180deg,#FF8C1A,#E8710A);color:#0a0a0a;box-shadow:0 3px 10px rgba(232,113,10,0.4);border:none;}
    .layman-btn .lb-icon{font-size:1.2rem;}
    .layman-hero .layman-btn{margin:0;}
    .layman-panel{margin-top:14px;padding:18px 20px;background:rgba(255,140,26,0.05);border:1px dashed rgba(255,140,26,0.4);border-radius:10px;color:rgba(237,229,216,0.95);font-size:1rem;line-height:1.65;display:none;}
    .layman-panel.show{display:block;animation:layfade 0.35s ease-out;}
    .layman-panel .lp-label{font-size:0.6rem;font-weight:800;letter-spacing:0.22em;text-transform:uppercase;color:#FF8C1A;margin-bottom:10px;display:block;}
    .layman-panel p{margin:0 0 10px;}
    .layman-panel em{color:rgba(255,203,128,0.9);font-style:italic;}
    .layman-panel ul,.layman-panel ol{margin:8px 0 10px 22px;padding:0;}
    @keyframes layfade{from{opacity:0;transform:translateY(-4px);}to{opacity:1;transform:translateY(0);}}
    @media print {
      html,body{background:#fff !important;color:#111 !important;}
      .top,.dl-row,.share-row,.viz-dl-bar,#social-panel,#voice-switcher,.viz-lightbox,.entry-tools,.related-list,#feedback-row,#read-progress,#scroll-top{display:none !important;}
      a{color:#111 !important;text-decoration:none !important;}
      article{max-width:none !important;padding:0 !important;}
      .body{color:#111 !important;}
      .body h1,.body h2,.body h3{color:#111 !important;page-break-after:avoid;}
      .body p,.body li,.body td,.body th{color:#111 !important;}
      .body .mermaid-wrap{background:#fff !important;border:1px solid #ccc !important;page-break-inside:avoid;}
      .body table{page-break-inside:avoid;}
      .footer-note{color:#666 !important;border-top:1px solid #ccc;padding-top:12px;margin-top:24px;font-size:9pt;}
    }
  /* GOLD 13/13 trim — entries personally audited + signed off by Claude Code */
  article.cc-gold{position:relative;outline:5px solid #FFD740;outline-offset:10px;border-radius:18px;box-shadow:0 0 60px rgba(255,215,64,0.55),inset 0 0 0 2px rgba(255,215,64,0.35);}
  @keyframes ccGoldPulse{0%{box-shadow:0 0 40px rgba(255,215,64,0.42),inset 0 0 0 2px rgba(255,215,64,0.30)}50%{box-shadow:0 0 72px rgba(255,215,64,0.72),inset 0 0 0 2px rgba(255,215,64,0.45)}100%{box-shadow:0 0 40px rgba(255,215,64,0.42),inset 0 0 0 2px rgba(255,215,64,0.30)}}
  article.cc-gold{animation:ccGoldPulse 3.4s ease-in-out infinite;}
  /* diagonal CERTIFIED corner ribbon */
  article.cc-gold::after{content:"✓ CERTIFIED";position:absolute;top:22px;right:-54px;transform:rotate(45deg);background:linear-gradient(135deg,#FFE34F,#E89F0A);color:#1a1208;font-size:0.72rem;font-weight:900;letter-spacing:0.14em;padding:8px 62px;box-shadow:0 4px 14px rgba(0,0,0,0.28),0 0 18px rgba(255,215,64,0.6);z-index:5;pointer-events:none;}
  .cc-gold-badge{display:inline-block;background:linear-gradient(135deg,#FFE34F,#E89F0A);color:#1a1208;padding:9px 20px;border-radius:99px;font-size:0.9rem;font-weight:900;letter-spacing:0.12em;text-transform:uppercase;border:2px solid #FFF3B0;box-shadow:0 0 22px rgba(255,215,64,0.75),0 2px 8px rgba(0,0,0,0.2);vertical-align:middle;margin-right:4px;}
  @media print{article.cc-gold::after{display:none}}
  </style>
  <link rel="stylesheet" href="/assets/pulse-tan.css">
</head>
<body>
  <style>.crohdr{max-width:1000px;margin:10px auto 6px;padding:0 14px}.cro-card{display:flex;align-items:stretch;text-decoration:none;border:3px solid #EAC15C;border-radius:14px;overflow:hidden;background:linear-gradient(100deg,#180a10,#0f0a0c 60%);box-shadow:0 6px 26px rgba(0,0,0,.5),0 0 0 1px rgba(234,193,92,.35)}.cro-card__img{flex:0 0 32%;background-size:cover;background-position:center 30%;min-height:210px;border-right:1px solid rgba(234,193,92,.28)}.cro-card__body{flex:1;padding:24px 28px;display:flex;flex-direction:column;justify-content:center;gap:5px}.cro-card__eyebrow{font:800 .6rem/1.3 system-ui;letter-spacing:.13em;color:#FFB81C}.cro-card__title{margin:0;font-family:Georgia,serif;font-weight:800;font-size:clamp(1.7rem,3.7vw,2.6rem);line-height:1.05;color:#F6C445!important;text-shadow:0 1px 6px rgba(0,0,0,.5)}.cro-card__eyebrow{color:#FFB81C!important}.cro-card__role{color:#EAC15C!important}.cro-card__role{margin:0;color:#EAC15C;font-weight:700;font-size:.9rem}.cro-card__sub{margin:2px 0 0;color:#b9b1a6;font-size:.88rem;max-width:52ch}.cro-card__rail{flex:0 0 auto;display:flex;flex-direction:column;justify-content:space-between;align-items:flex-end;gap:12px;padding:16px 20px;background:linear-gradient(180deg,rgba(234,193,92,.06),transparent);border-left:1px solid rgba(234,193,92,.16);min-width:190px}.cro-card__badge{display:inline-flex;align-items:center;gap:7px;font:800 .58rem/1 system-ui;letter-spacing:.1em;text-transform:uppercase;color:#cfe8c6;background:rgba(40,90,50,.28);border:1px solid rgba(120,200,130,.35);padding:5px 10px;border-radius:999px;white-space:nowrap}.cro-card__badge i{width:8px;height:8px;border-radius:50%;background:#48d16a;box-shadow:0 0 8px #48d16a}.cro-card__railcta{display:flex;flex-direction:column;align-items:flex-end;gap:8px}.cro-card__cta{background:linear-gradient(180deg,#EAC15C,#cf9f2e);color:#1a0a00;font-weight:900;font-size:.95rem;padding:11px 20px;border-radius:10px;white-space:nowrap}.cro-card__resume{color:#EAC15C;font-weight:700;font-size:.82rem;text-decoration:underline;text-underline-offset:3px}.cro-card:hover{border-color:#EAC15C}.cro-bar{display:grid;grid-template-columns:repeat(4,1fr);margin:-2px 0 4px;border:1px solid rgba(234,193,92,.4);border-top:none;border-radius:0 0 14px 14px;overflow:hidden}.cro-bar a{text-align:center;padding:11px 8px;color:#EAC15C;font-weight:800;font-size:.9rem;text-decoration:none;background:#130a10;border-right:1px solid rgba(234,193,92,.22)}.cro-bar a:last-child{border-right:none}.cro-bar a:hover{background:#1d1017;color:#fff}@media(max-width:640px){.cro-bar{grid-template-columns:repeat(2,1fr)}.cro-bar a:nth-child(2){border-right:none}.cro-card{flex-direction:column}.cro-card__img{flex:none;width:100%;min-height:120px;border-right:none;border-bottom:1px solid rgba(234,193,92,.28)}.cro-card__rail{flex-direction:row;align-items:center;justify-content:space-between;width:100%;min-width:0;border-left:none;border-top:1px solid rgba(234,193,92,.16);padding:11px 14px}.cro-card__railcta{flex-direction:row;align-items:center;gap:12px}}</style>
  <div class="crohdr"><a class="cro-card" href="https://calendly.com/korywhiterevops?utm_source=pulserevops.com&utm_medium=referral&utm_campaign=cro-widget" target="_blank" rel="noopener" data-pulse-click="hire-cro" aria-label="Book a call with Kory White, Fractional CRO"><div class="cro-card__img" style="background-image:url('/assets/kory-white.jpg')"></div><div class="cro-card__body"><span class="cro-card__eyebrow">FRACTIONAL CHIEF REVENUE OFFICER · 25 YRS · $0→$200M</span><h2 class="cro-card__title">Kory White</h2><p class="cro-card__role">RevOps &amp; Revenue Leadership</p><p class="cro-card__sub">25 years scaling revenue teams from $0 to $200M. Fractional leadership, full-time impact.</p></div></a>
  <div class="cro-bar"><a href="/fractional-cro" data-pulse-click="fractional-cro-hub">Hire a Fractional CRO</a><a href="https://www.linkedin.com/in/korywhite" target="_blank" rel="noopener" data-pulse-click="curator">LinkedIn</a><a href="/assets/kory-white-cro-resume.pdf" target="_blank" rel="noopener">Résumé</a><a href="https://crosyndicate.com/?utm_source=pulserevops.com&utm_medium=referral&utm_campaign=cro-widget" target="_blank" rel="noopener" data-pulse-click="cro-syndicate">CRO Syndicate</a></div></div>
  <button id="scroll-top" type="button" aria-label="Scroll to top" style="position:fixed;bottom:24px;right:24px;width:42px;height:42px;border-radius:50%;background:rgba(232,113,10,0.92);border:1px solid rgba(255,255,255,0.18);color:#fff;font-size:1.1rem;font-weight:900;cursor:pointer;z-index:9000;opacity:0;pointer-events:none;transition:opacity 0.2s, transform 0.15s;box-shadow:0 6px 20px rgba(232,113,10,0.4);font-family:inherit;">↑</button>
  <div class="top">
    <a href="/" class="brand" aria-label="Pulse News — Value Added"><img class="brandlogo" src="/pulse-news-logo.png" alt="Pulse News — Value Added" width="164" height="46"></a>
    <span><a href="/knowledge.html">← Library</a></span>
  </div>
  <article${entry.cc_signed ? ' class="cc-gold"' : ''}>
    <div class="crumb"><a href="/knowledge.html">Knowledge Library</a> · ${escHtml(tagsList[0] || 'Sales')}</div>
    ${entry.cc_signed ? '<div style="margin:0 0 10px;"><span class="cc-gold-badge">🏆 ' + (entry.quality || '13/13') + ' · Claude Code Audited</span></div>' : ''}
    <div style="margin:0 0 12px;">
      ${(() => {
        const sc = typeof entry.quality_score === 'number' ? entry.quality_score : 5;
        const isPolishing = sc > 5 && sc < 10;
        let bg, bd, tx, sh, lbl, labelText = 'Current Quality';
        if (sc >= 10) {
          bg = 'linear-gradient(135deg,#FFD740,#E89F0A)'; bd = '#FFD740'; tx = '#1a1208';
          sh = '0 0 12px rgba(255,215,64,0.7)'; lbl = '10/10'; labelText = '✓ Machine Certified';
        } else if (isPolishing) {
          bg = 'linear-gradient(135deg,#39FF14,#00C030)'; bd = '#39FF14'; tx = '#001405';
          sh = '0 0 12px rgba(57,255,20,0.75)'; lbl = sc + '/10';
        } else {
          bg = 'rgba(0,40,18,0.72)'; bd = 'rgba(57,255,20,0.45)'; tx = '#7BFF8F';
          sh = '0 0 6px rgba(57,255,20,0.18)'; lbl = sc + '/10';
        }
        const labelBg = isPolishing ? 'rgba(0,40,18,0.85)' : (sc >= 10 ? 'linear-gradient(135deg,#FFE34F,#FFB347)' : 'rgba(0,30,12,0.75)');
        const labelTx = isPolishing ? '#39FF14' : (sc >= 10 ? '#1a1208' : '#7BFF8F');
        const labelBd = isPolishing ? '#39FF14' : (sc >= 10 ? '#FFE34F' : 'rgba(57,255,20,0.4)');
        const labelSh = isPolishing ? 'box-shadow:0 0 8px rgba(57,255,20,0.5);' : (sc >= 10 ? 'box-shadow:0 0 8px rgba(255,227,79,0.5);' : '');
        const polishingPill = isPolishing
          ? `<span style="display:inline-block;background:linear-gradient(135deg,#00ff41,#00b830);color:#001405;padding:5px 12px;border-radius:99px;font-size:0.6rem;font-weight:900;letter-spacing:0.16em;text-transform:uppercase;border:1px solid #00ff41;box-shadow:0 0 12px rgba(0,255,65,0.7);vertical-align:middle;margin-right:4px;">◉ Currently Polishing</span>`
          : '';
        return `${polishingPill}<span style="display:inline-block;background:${labelBg};color:${labelTx};padding:5px 12px;border-radius:99px;font-size:0.6rem;font-weight:900;letter-spacing:0.16em;text-transform:uppercase;border:1px solid ${labelBd};${labelSh}vertical-align:middle;margin-right:4px;">${labelText}</span><span style="display:inline-block;background:${bg};color:${tx};padding:5px 12px;border-radius:99px;font-size:0.6rem;font-weight:900;letter-spacing:0.16em;text-transform:uppercase;border:1px solid ${bd};box-shadow:${sh};vertical-align:middle;margin-right:4px;">${lbl}</span><span role="button" tabindex="0" aria-label="How does the score work?" onclick="showIQHelp()" onkeypress="if(event.key===&quot;Enter&quot;){showIQHelp();}" style="display:inline-block;width:18px;height:18px;line-height:16px;text-align:center;background:rgba(57,255,20,0.18);border:1px solid rgba(57,255,20,0.55);color:#39FF14;border-radius:50%;font-size:0.7rem;font-weight:900;cursor:pointer;margin-right:8px;vertical-align:middle;user-select:none;">?</span>`;
      })()}
    </div>
    <h1 class="q">${escHtml(entry.h1 || entry.question)}</h1>
    ${heroHtml}
    <div class="meta-row"><span style="display:inline-flex;align-items:center;gap:6px;padding:3px 10px;background:rgba(255,140,26,0.10);border:1px solid rgba(255,140,26,0.35);border-radius:99px;color:#FFB870;font-size:0.66rem;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;" title="Word count of this answer">📖 ${wordCountFmt} words</span><span style="margin-left:auto;color:rgba(237,229,216,0.82);font-weight:800;white-space:nowrap;">${(()=>{const fmtD=v=>{const d=new Date(v);return isNaN(d.getTime())?'':d.toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'});};const pub=fmtD(entry.ts||entry.was_indexed_at||entry.cc_signed_at||Date.now());const uraw=entry.polished_at||entry.updated_at||entry.cc_signed_at;const upd=uraw?fmtD(uraw):'';return '🗓️ Published '+pub+(upd&&upd!==pub?'  ·  Updated '+upd:'');})()}</span></div>
    <div style="margin:10px 0 18px;">
      <button type="button" id="read-aloud-top" aria-label="Read this answer aloud" style="display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,rgba(57,166,255,0.22),rgba(120,180,255,0.14));border:1px solid rgba(57,166,255,0.6);color:#9ECFFF;font-family:inherit;font-size:0.78rem;font-weight:800;letter-spacing:0.10em;text-transform:uppercase;padding:9px 16px;border-radius:99px;cursor:pointer;box-shadow:0 0 12px rgba(57,166,255,0.25);"><span id="ra-top-icon" style="font-size:1rem;">🔊</span><span id="ra-top-label">Listen to this answer</span></button>
    </div>
<!-- Voice switcher removed 2026-05-03 — single In-Between voice only -->
    <div class="body">${insertCroAd(moveMermaidToBottom(renderedAnswer), id)}</div>
    <div class="dl-row" aria-label="Download options">
      <span class="dl-label">Download:</span>
      <button class="dl-btn" type="button" id="dl-md">⬇ Answer (.md)</button>
      <button class="dl-btn" type="button" id="dl-pdf">⬇ Answer (.pdf)</button>
      <button class="dl-btn" type="button" id="open-social" style="background:linear-gradient(135deg,rgba(232,113,10,0.18),rgba(168,139,250,0.18));border-color:rgba(255,140,26,0.55);color:#FFD7A8;">✨ Social Studio</button>
      <button class="dl-btn" type="button" id="read-aloud-btn" aria-label="Read this answer aloud" style="background:linear-gradient(135deg,rgba(57,166,255,0.18),rgba(120,180,255,0.12));border-color:rgba(57,166,255,0.55);color:#9ECFFF;"><span id="ra-icon">🔊</span> <span id="ra-label">Listen</span></button>
    </div>
    <div id="social-panel" hidden style="margin-top:16px;padding:18px 20px;background:rgba(15,18,22,0.95);border:1px solid rgba(255,140,26,0.4);border-radius:14px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <div style="font-size:0.7rem;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:#FF8C1A;">✨ Social Studio</div>
        <button id="social-close" type="button" style="background:transparent;border:none;color:rgba(237,229,216,0.55);font-size:1.2rem;cursor:pointer;padding:0 6px;">×</button>
      </div>
      <div id="social-status" style="font-size:0.78rem;color:rgba(237,229,216,0.65);margin-bottom:12px;">Click Generate to build a copy-paste-ready X thread, LinkedIn post, and Reddit comment from this entry.</div>
      <button id="social-generate" type="button" style="background:linear-gradient(135deg,#FF8C1A,#E8710A);border:none;color:#0a0a0a;font-family:inherit;font-size:0.84rem;font-weight:800;letter-spacing:0.04em;padding:10px 22px;border-radius:10px;cursor:pointer;">Generate ✨</button>
      <div id="social-results" hidden style="margin-top:14px;display:flex;flex-direction:column;gap:14px;"></div>
    </div>
    <textarea id="raw-md" hidden readonly>${escHtml(entry.answer || '')}</textarea>
    <div id="feedback-row" style="margin-top:18px;padding:14px 18px;background:rgba(0,0,0,0.25);border:1px solid rgba(255,255,255,0.06);border-radius:10px;display:flex;flex-wrap:wrap;align-items:center;gap:14px;">
      <span style="font-size:0.7rem;font-weight:800;letter-spacing:0.16em;text-transform:uppercase;color:rgba(237,229,216,0.7);">Was this helpful?</span>
      <button class="fb-btn" type="button" data-vote="yes" style="background:rgba(34,197,94,0.12);border:1px solid rgba(34,197,94,0.4);color:#6ef0a3;font-family:inherit;font-size:0.75rem;font-weight:700;letter-spacing:0.06em;padding:6px 14px;border-radius:7px;cursor:pointer;">👍 Yes</button>
      <button class="fb-btn" type="button" data-vote="no" style="background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.4);color:#fca5a5;font-family:inherit;font-size:0.75rem;font-weight:700;letter-spacing:0.06em;padding:6px 14px;border-radius:7px;cursor:pointer;">👎 No</button>
      <button id="star-btn" type="button" title="Save to your starred list" style="background:rgba(255,215,64,0.10);border:1px solid rgba(255,215,64,0.4);color:#FFD740;font-family:inherit;font-size:0.75rem;font-weight:700;letter-spacing:0.06em;padding:6px 14px;border-radius:7px;cursor:pointer;"><span id="star-icon">☆</span> <span id="star-label">Star</span></button>
      <span id="fb-tally" style="font-size:0.68rem;color:rgba(237,229,216,0.55);margin-left:auto;">&nbsp;</span>
    </div>
    ${shareHtml}
    ${sourcesHtml}
    ${toolsHtml}
    ${relatedHtml}
    ${moreHtml}
    ${(prevQ || nextQ) ? `<nav class="seq-nav" aria-label="Previous and next library entry" style="display:flex;gap:12px;justify-content:space-between;margin:30px 0 12px;padding:14px 0;border-top:1px solid rgba(255,255,255,0.08);">
      ${prevQ ? `<a rel="prev" href="${prevUrl}" style="flex:1;text-decoration:none;color:rgba(237,229,216,0.85);font-size:0.78rem;line-height:1.4;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:10px 14px;transition:all 0.15s;">
        <span style="display:block;font-size:0.55rem;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:var(--orange-bright);margin-bottom:4px;">← Previous</span>
        ${escHtml(prevQ.question.slice(0, 90))}
      </a>` : '<span style="flex:1"></span>'}
      ${nextQ ? `<a rel="next" href="${nextUrl}" style="flex:1;text-align:right;text-decoration:none;color:rgba(237,229,216,0.85);font-size:0.78rem;line-height:1.4;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:10px 14px;transition:all 0.15s;">
        <span style="display:block;font-size:0.55rem;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:var(--orange-bright);margin-bottom:4px;">Next →</span>
        ${escHtml(nextQ.question.slice(0, 90))}
      </a>` : '<span style="flex:1"></span>'}
    </nav>` : ''}
  </article>
  <div class="viz-lightbox" id="viz-lightbox" role="dialog" aria-label="Visual zoom">
    <button class="viz-lightbox-close" id="viz-lightbox-close" aria-label="Close">×</button>
    <div class="viz-lightbox-inner" id="viz-lightbox-inner"></div>
  </div>
  <link rel="stylesheet" href="/css/pulse-mosaic.css">
  <section class="mag-mosaic" data-pulse-mosaic data-pillar="${escAttr(entryPillar)}" aria-label="More stories in this topic" style="max-width:1080px;margin:0 auto;padding:0 clamp(10px,2vw,24px) 40px;"></section>
  <div class="footer-note">
    Researched autonomously by <a href="/themachine" style="color:rgba(255,140,26,0.7);">The Machine</a> · Claude Sonnet 4.6 + live web search · Cited &amp; dated
    <div style="margin-top:10px;">
      <a href="/about" style="color:inherit;">About</a> · <a href="/contact" style="color:inherit;">Contact</a> · <a href="/privacy" style="color:inherit;">Privacy</a> · <a href="/terms" style="color:inherit;">Terms</a>
    </div>
  </div>
  <!-- Visit-email: Human-Interaction Gate -> /visitor-alert -> emails owner on every
       verified visitor (1/IP/day) via Resend. Replaces the old disabled visit-alert stub
       so ENTRY pages (the bulk of traffic) also report visits. Owner 2026-06-29. -->
  <script src="/js/pulse-face-img.js" defer></script>
  <script src="/js/pulse-home-mosaic.js" defer></script>
  <script src="/js/human-gate.js" defer></script>
  <!-- Click-email tracker: emails owner on any CRO-ad click (Calendly / LinkedIn /
       CRO Syndicate / resume / hire-cro / tools) via pulse-click-notify. Owner 2026-06-27. -->
  <script src="/js/pulse-lead-track.js" defer></script>
  <!-- site-wide low-volume 80s synthwave ambience (The Midnight vibe), owner 2026-07-03 -->
  <script src="/pulse-ambient.js" defer></script>
  <!-- trivia game popup removed per owner 2026-07-03 -->
  <script>
    // Reading progress bar + scroll-to-top button
    (function(){
      var bar = document.getElementById('read-progress');
      var topBtn = document.getElementById('scroll-top');
      if (!bar && !topBtn) return;
      var ticking = false;
      function update() {
        var docH = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - window.innerHeight;
        var y = window.scrollY || window.pageYOffset || 0;
        var pct = docH > 0 ? Math.min(100, Math.max(0, (y / docH) * 100)) : 0;
        if (bar) bar.style.width = pct + '%';
        if (topBtn) {
          if (y > 600) { topBtn.style.opacity = '0.92'; topBtn.style.pointerEvents = 'auto'; }
          else { topBtn.style.opacity = '0'; topBtn.style.pointerEvents = 'none'; }
        }
        ticking = false;
      }
      window.addEventListener('scroll', function(){
        if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
      }, { passive: true });
      if (topBtn) {
        topBtn.addEventListener('click', function(){
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        topBtn.addEventListener('mouseenter', function(){ topBtn.style.transform = 'scale(1.08)'; });
        topBtn.addEventListener('mouseleave', function(){ topBtn.style.transform = ''; });
      }
      update();
    })();

    // Copy-link button — copies entry URL to clipboard (share row + vertical rail)
    document.addEventListener('click', function(e) {
      var btn = e.target.closest('.copy-link');
      if (!btn) return;
      var u = btn.getAttribute('data-url');
      if (!u) return;
      var done = function() {
        btn.classList.add('copied');
        var lbl = btn.querySelector('.share-copy-lbl');
        if (lbl) lbl.textContent = 'Copied';
        setTimeout(function() {
          btn.classList.remove('copied');
          if (lbl) lbl.textContent = 'Copy link';
        }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(u).then(done);
      }
    });

    // 3-voice switcher — translates the whole answer into Operator / In-Between / Layman
    // via /.netlify/functions/voice-translate. Preserves length, tables, mermaid.
    // Cached per-voice in sessionStorage so re-clicks are instant. The "Operator" button
    // restores the original markdown (which is what's rendered server-side by default).
    (function(){
      try {
      var switcher = document.getElementById('voice-switcher');
      var panel = document.getElementById('layman-panel');
      if (!switcher || !panel) { console.warn('[voice] missing switcher or panel'); return; }
      var body = panel.querySelector('.lp-body');
      var panelLabel = document.getElementById('voice-panel-label');
      if (!body || !panelLabel) { console.warn('[voice] missing body or panel label'); return; }
      var voiceBtns = switcher.querySelectorAll('.voice-btn');
      var entryId = switcher.getAttribute('data-id');
      // Render-markdown — handles paragraphs, bullets, headers, tables, mermaid blocks,
      // code blocks, autolinks for URLs and cross-references like (q1604).
      function mdToHtml(md) {
        var src = (md || '').trim();
        // Pull out fenced code blocks first so their content doesn't get
        // mangled by the line-by-line parser
        var blocks = [];
        src = src.replace(/\`\`\`(mermaid|json|js|javascript|bash|sh|html|css|sql|python|py)?\\n?([\\s\\S]*?)\`\`\`/g, function(_, lang, code){
          var idx = blocks.length;
          if ((lang || '').toLowerCase() === 'mermaid') {
            blocks.push('<div class="mermaid-wrap" style="margin:14px 0;background:rgba(255,140,26,0.04);border:1px solid rgba(255,140,26,0.2);border-radius:10px;padding:14px;overflow-x:auto;"><pre class="mermaid" style="background:transparent;border:none;padding:0;margin:0;">' + code.trim() + '</pre></div>');
          } else {
            blocks.push('<pre style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:12px;overflow-x:auto;font-size:0.82rem;line-height:1.45;margin:12px 0;"><code>' + code.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</code></pre>');
          }
          return '\\u0001BLOCK' + idx + '\\u0001';
        });
        var lines = src.split(/\\n/);
        var html = '', inUl = false, tableRows = [];
        function inline(s){
          // Bold + italic
          var out = s.replace(/\\*\\*([^*]+)\\*\\*/g,'<strong>$1</strong>')
                     .replace(/\\*([^*]+)\\*/g,'<em>$1</em>')
                     .replace(/_([^_]+)_/g,'<em>$1</em>');
          // Markdown links [text](url)
          out = out.replace(/\\[([^\\]]+)\\]\\(([^)]+)\\)/g, function(_, txt, url){
            return '<a href="' + url + '" target="_blank" rel="noopener" style="color:var(--orange-bright);">' + txt + '</a>';
          });
          // Bare URLs
          out = out.replace(/(^|[^"'>=])(https?:\\/\\/[^\\s<)\\]"]+)/g, function(_, pre, url){
            return pre + '<a href="' + url + '" target="_blank" rel="noopener" style="color:var(--orange-bright);word-break:break-all;">' + url + '</a>';
          });
          // Cross-link refs like (q1604) → clickable internal link
          out = out.replace(/\\(q(\\d{3,5})\\)/g, function(_, n){
            return '(<a href="/knowledge/q' + n + '" style="color:var(--orange-bright);">q' + n + '</a>)';
          });
          return out;
        }
        function flushTable(){
          if (!tableRows.length) return;
          var t = '<table style="width:100%;border-collapse:collapse;margin:14px 0;font-size:0.9rem;">';
          tableRows.forEach(function(row, idx){
            var tag = idx === 0 ? 'th' : 'td';
            var bg = idx === 0 ? 'background:rgba(255,140,26,0.12);' : '';
            t += '<tr style="' + bg + '">' + row.map(function(c){ return '<' + tag + ' style="padding:8px 12px;border:1px solid rgba(255,140,26,0.25);text-align:left;vertical-align:top;">' + inline(c.trim()) + '</' + tag + '>'; }).join('') + '</tr>';
          });
          t += '</table>';
          html += t;
          tableRows = [];
        }
        for (var i=0;i<lines.length;i++){
          var l = lines[i];
          // Block placeholder line (mermaid/code) — emit as-is
          if (/^\\u0001BLOCK\\d+\\u0001\\s*$/.test(l)) {
            if (inUl){ html += '</ul>'; inUl = false; }
            if (tableRows.length) flushTable();
            html += l;
            continue;
          }
          if (/^\\|.*\\|\\s*$/.test(l)) {
            if (/^\\|[\\s\\-:|]+\\|\\s*$/.test(l)) continue;
            tableRows.push(l.replace(/^\\||\\|$/g,'').split('|'));
            continue;
          } else if (tableRows.length) { flushTable(); }
          if (/^#{1,3}\\s+/.test(l)) {
            if (inUl){ html += '</ul>'; inUl = false; }
            var lvl = l.match(/^#+/)[0].length;
            html += '<h' + (lvl+1) + ' style="color:#FFD7A8;margin:16px 0 8px;font-size:' + (1.15 - lvl*0.06) + 'rem;font-weight:800;">' + inline(l.replace(/^#+\\s+/,'')) + '</h' + (lvl+1) + '>';
          } else if (/^\\s*[-•]\\s+/.test(l)) {
            if (!inUl){ html += '<ul style="margin:8px 0 12px 22px;padding:0;">'; inUl = true; }
            html += '<li style="margin:4px 0;">' + inline(l.replace(/^\\s*[-•]\\s+/,'')) + '</li>';
          } else if (!l.trim()) {
            if (inUl){ html += '</ul>'; inUl = false; }
          } else {
            if (inUl){ html += '</ul>'; inUl = false; }
            html += '<p style="margin:8px 0;line-height:1.6;">' + inline(l) + '</p>';
          }
        }
        if (inUl) html += '</ul>';
        if (tableRows.length) flushTable();
        // Restore the code/mermaid blocks
        html = html.replace(/\\u0001BLOCK(\\d+)\\u0001/g, function(_, idx){ return blocks[+idx] || ''; });
        return html;
      }
      var denseBody = document.querySelector('.body');
      var VOICE_LABELS = {
        operator: 'Operator-Grade',
        between: 'In-Between',
        layman: 'Plain English',
      };
      function setActive(voice){
        voiceBtns.forEach(function(b){
          if (b.getAttribute('data-voice') === voice) b.classList.add('voice-active');
          else b.classList.remove('voice-active');
        });
      }
      function showOriginal(){
        // Operator voice = the original markdown, which is already rendered in .body server-side
        panel.classList.remove('show');
        if (denseBody) denseBody.style.display = '';
        setActive('operator');
      }
      function showTranslated(voice, text){
        body.innerHTML = mdToHtml(text);
        panelLabel.textContent = VOICE_LABELS[voice] || voice;
        panel.classList.add('show');
        if (denseBody) denseBody.style.display = 'none';
        setActive(voice);
        // Re-run mermaid on any newly-injected diagrams in the translated panel
        try {
          if (window.mermaid && typeof window.mermaid.run === 'function') {
            var freshNodes = body.querySelectorAll('.mermaid:not([data-processed="true"])');
            if (freshNodes.length) window.mermaid.run({ nodes: freshNodes });
          }
        } catch (e) { console.warn('[voice] mermaid re-run failed', e); }
      }
      voiceBtns.forEach(function(btn){
        btn.addEventListener('click', function(){
          var voice = btn.getAttribute('data-voice');
          if (voice === 'operator') { showOriginal(); return; }
          var cacheKey = 'voice:v1:' + voice + ':' + entryId;
          var cached = null;
          try { cached = sessionStorage.getItem(cacheKey); } catch(e){}
          if (cached && cached.length > 50) { showTranslated(voice, cached); return; }
          var origLabel = btn.querySelector('.lb-label').textContent;
          btn.disabled = true;
          btn.querySelector('.lb-label').textContent = 'Translating...';
          fetch('/.netlify/functions/voice-translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: entryId, target_voice: voice }),
          }).then(function(r){ return r.json(); }).then(function(j){
            btn.disabled = false;
            btn.querySelector('.lb-label').textContent = origLabel;
            if (j && j.ok && j.answer) {
              try { sessionStorage.setItem(cacheKey, j.answer); } catch(e){}
              showTranslated(voice, j.answer);
            } else {
              body.innerHTML = '<p>Could not translate. Reason: ' + ((j && j.reason) || 'unknown') + '. Try again in a moment.</p>';
              panel.classList.add('show');
            }
          }).catch(function(err){
            console.error('[voice] fetch error', err);
            btn.disabled = false;
            btn.querySelector('.lb-label').textContent = origLabel;
            body.innerHTML = '<p>Network hiccup: ' + (err && err.message || 'unknown') + '. Try again.</p>';
            panel.classList.add('show');
          });
        });
      });
      } catch (err) {
        console.error('[layman] init error', err);
      }
    })();

    // Visual lightbox + downloads
    (function(){
      try {
      var lb = document.getElementById('viz-lightbox');
      var lbInner = document.getElementById('viz-lightbox-inner');
      var lbClose = document.getElementById('viz-lightbox-close');
      function openLightbox(svg){
        if (!svg || !lb || !lbInner) return;
        var clone = svg.cloneNode(true);
        // Strip mermaid-set attributes that constrain size, force responsive
        clone.removeAttribute('style');
        clone.removeAttribute('width');
        clone.removeAttribute('height');
        clone.style.width = '100%';
        clone.style.height = 'auto';
        clone.style.maxHeight = '88vh';
        clone.style.display = 'block';
        // Ensure preserveAspectRatio scales properly
        clone.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        lbInner.innerHTML = '';
        lbInner.appendChild(clone);
        lb.classList.add('show');
        document.body.style.overflow = 'hidden';
      }
      function closeLightbox(){
        if (!lb) return;
        lb.classList.remove('show');
        document.body.style.overflow = '';
      }
      // Event delegation — works regardless of when mermaid SVG renders.
      // Catches clicks on any SVG inside .mermaid-wrap forever, including
      // SVGs added by post-render mermaid.run() or voice-translate panel.
      document.addEventListener('click', function(e){
        var svg = e.target.closest('.mermaid-wrap svg, .mermaid-wrap');
        if (!svg) return;
        // If user clicked the wrap itself (not inside an SVG), find the inner SVG
        if (svg.classList && svg.classList.contains('mermaid-wrap')) {
          var inner = svg.querySelector('svg');
          if (!inner) return;
          svg = inner;
        }
        e.preventDefault();
        openLightbox(svg);
      });
      if (lbClose) lbClose.addEventListener('click', closeLightbox);
      if (lb) lb.addEventListener('click', function(e){ if (e.target === lb) closeLightbox(); });
      document.addEventListener('keydown', function(e){ if (e.key === 'Escape') closeLightbox(); });

      // Download helpers
      function downloadBlob(blob, filename){
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url; a.download = filename;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function(){ URL.revokeObjectURL(url); }, 1000);
      }
      function getFirstSvg(){
        return document.querySelector('.mermaid-wrap svg');
      }
      function svgString(svg){
        var clone = svg.cloneNode(true);
        if (!clone.getAttribute('xmlns')) clone.setAttribute('xmlns','http://www.w3.org/2000/svg');
        return new XMLSerializer().serializeToString(clone);
      }
      var entryId = ${JSON.stringify(entry.id)};
      var entryQ = ${JSON.stringify(entry.question || '')};

      var dlMd = document.getElementById('dl-md');
      if (dlMd) dlMd.addEventListener('click', function(){
        var ta = document.getElementById('raw-md');
        var md = ta ? (ta.value || ta.textContent || '') : '';
        var header = '# ' + entryQ + '\\n\\nSource: https://pulserevops.com/knowledge/' + entryId + '\\n\\n---\\n\\n';
        var blob = new Blob([header + md], { type: 'text/markdown;charset=utf-8' });
        downloadBlob(blob, entryId + '.md');
      });

      // PDF download — uses browser print to PDF (clean, no extra dependencies)
      var dlPdf = document.getElementById('dl-pdf');
      if (dlPdf) dlPdf.addEventListener('click', function(){
        window.print();
      });

      // Read Aloud — uses the browser-native Web Speech API (free, client-side,
      // no API cost). Reads the question + the rendered answer body. Toggles
      // between Listen / Stop on BOTH the top-of-page button and the bottom
      // download-row button, keeping their states in sync. Falls back to
      // disabled if unsupported.
      (function(){
        var btn = document.getElementById('read-aloud-btn');
        var topBtn = document.getElementById('read-aloud-top');
        if (!btn && !topBtn) return;
        var icon = document.getElementById('ra-icon');
        var label = document.getElementById('ra-label');
        var topIcon = document.getElementById('ra-top-icon');
        var topLabel = document.getElementById('ra-top-label');
        if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
          [btn, topBtn].forEach(function(b){
            if (!b) return;
            b.disabled = true;
            b.style.opacity = '0.45';
            b.style.cursor = 'not-allowed';
            b.title = 'Your browser does not support speech synthesis';
          });
          return;
        }
        var synth = window.speechSynthesis;
        var speaking = false;

        function getReadableText(){
          // Strip markdown/HTML noise. Pull the visible text out of .body and
          // de-noise tables, code blocks, and image captions so the voice
          // reads the narrative content. Returns the FULL answer text — chunking
          // for browser TTS limits happens in handleClick via chunkForSpeech.
          var body = document.querySelector('article .body');
          var raw = body ? body.innerText : '';
          // Remove mermaid blocks, source URLs, and excessive whitespace.
          raw = raw.replace(/https?:\\/\\/\\S+/g, '');
          raw = raw.replace(/\\|[^\\n]*\\|/g, '');
          raw = raw.replace(/[-=]{3,}/g, '');
          raw = raw.replace(/\\n{3,}/g, '\\n\\n');
          return entryQ + '. ' + raw;
        }
        function chunkForSpeech(text, maxLen){
          // Browsers throttle/truncate utterances >~32KB and Chrome sometimes
          // stalls beyond ~15s of speech per utterance. Split at sentence
          // boundaries into chunks ≤ maxLen chars so we can queue them
          // sequentially via onend chaining.
          maxLen = maxLen || 3000;
          var chunks = [];
          var i = 0;
          while (i < text.length){
            var end = Math.min(i + maxLen, text.length);
            if (end < text.length){
              var lastPeriod = text.lastIndexOf('. ', end);
              var lastBang   = text.lastIndexOf('! ', end);
              var lastQ      = text.lastIndexOf('? ', end);
              var lastNL     = text.lastIndexOf('\\n', end);
              var boundary = Math.max(lastPeriod, lastBang, lastQ, lastNL);
              if (boundary > i + Math.floor(maxLen / 2)) end = boundary + 1;
            }
            var slice = text.substring(i, end).trim();
            if (slice) chunks.push(slice);
            i = end;
          }
          return chunks;
        }

        function pickVoice(){
          var voices = synth.getVoices() || [];
          if (!voices.length) return null;
          var en = voices.filter(function(v){ return /^en(-|_|$)/i.test(v.lang) || /english/i.test(v.name); });
          var pool = en.length ? en : voices;
          // Ranked preference — warmest, most NATURAL (neural) human voices first.
          // Edge/Chrome ship "…Online (Natural)" neural voices that sound real; Apple
          // ships Samantha/Ava (Enhanced). Fall back gracefully to any English voice.
          var PREF = [
            /Aria.*Natural|Aria.*Online/i, /Jenny.*Natural|Jenny.*Online/i,
            /Ava.*Natural|Ava.*Online|Ava \((?:Premium|Enhanced)\)/i, /Emma.*Natural/i,
            /Michelle.*Natural/i, /Sonia.*Natural/i, /Libby.*Natural/i, /Aria/i, /Jenny/i,
            /\(Natural\)/i, /Online \(Natural\)/i, /Neural/i,
            /Samantha/i, /Allison/i, /Ava\b/i, /Zoe/i, /Serena/i, /Nicky/i,
            /Google US English/i, /Google UK English Female/i,
            /Microsoft .*Online/i, /\bfemale\b/i
          ];
          for (var i = 0; i < PREF.length; i++) {
            var hit = pool.find(function(v){ return PREF[i].test(v.name); });
            if (hit) return hit;
          }
          return pool.find(function(v){ return /en-US/i.test(v.lang); }) || pool[0];
        }

        function setIdle(){
          speaking = false;
          if (icon) icon.textContent = '🔊';
          if (label) label.textContent = 'Listen';
          if (topIcon) topIcon.textContent = '🔊';
          if (topLabel) topLabel.textContent = 'Listen to this answer';
        }
        function setPlaying(){
          speaking = true;
          if (icon) icon.textContent = '⏹';
          if (label) label.textContent = 'Stop';
          if (topIcon) topIcon.textContent = '⏹';
          if (topLabel) topLabel.textContent = 'Stop reading';
        }

        function handleClick(){
          if (speaking) { synth.cancel(); setIdle(); return; }
          var text = getReadableText();
          if (!text) return;
          synth.cancel();
          var chunks = chunkForSpeech(text, 3000);
          if (!chunks.length) return;
          var v = pickVoice();
          var idx = 0;
          function speakNext(){
            if (!speaking) return; // user pressed Stop
            if (idx >= chunks.length){ setIdle(); return; }
            var u = new SpeechSynthesisUtterance(chunks[idx]);
            if (v) u.voice = v;
            u.rate = 0.95;   // a touch slower = calmer, more natural, easier to listen to
            u.pitch = 1.02;  // very slightly lifted = warmer, less flat/robotic
            u.volume = 1.0;
            u.onend = function(){ idx++; speakNext(); };
            u.onerror = function(){ setIdle(); };
            synth.speak(u);
          }
          setPlaying();
          speakNext();
        }

        if (btn) btn.addEventListener('click', handleClick);
        if (topBtn) topBtn.addEventListener('click', handleClick);
        if (synth.onvoiceschanged !== undefined) synth.onvoiceschanged = function(){};
        window.addEventListener('beforeunload', function(){ try { synth.cancel(); } catch(e){} });
      })();

      // Fire-and-forget view ping — increments per-entry view counter for trending.
      // Once-per-session debounce so reload-spamming doesn't inflate counts.
      (function(){
        try {
          var sessKey = 'pulse-viewed-' + entryId;
          if (sessionStorage.getItem(sessKey)) return;
          sessionStorage.setItem(sessKey, '1');
          fetch('/.netlify/functions/entry-view', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: entryId }),
            keepalive: true,
          }).catch(function(){});
        } catch(e) {}
      })();

      // ★ Star — saves entry id to localStorage 'pulse-stars-v1'. Toggleable.
      // Surfaces on /knowledge.html via a "★ Starred" filter pill.
      (function(){
        var btn = document.getElementById('star-btn');
        if (!btn) return;
        var icon = document.getElementById('star-icon');
        var label = document.getElementById('star-label');
        var KEY = 'pulse-stars-v1';
        function getStars() {
          try { return JSON.parse(localStorage.getItem(KEY) || '[]') || []; } catch(e){ return []; }
        }
        function setStars(arr) { try { localStorage.setItem(KEY, JSON.stringify(arr)); } catch(e){} }
        function paint() {
          var stars = getStars();
          var on = stars.indexOf(entryId) !== -1;
          if (icon) icon.textContent = on ? '★' : '☆';
          if (label) label.textContent = on ? 'Starred' : 'Star';
          btn.style.background = on ? 'rgba(255,215,64,0.22)' : 'rgba(255,215,64,0.10)';
        }
        paint();
        btn.addEventListener('click', function(){
          var stars = getStars();
          var idx = stars.indexOf(entryId);
          if (idx !== -1) stars.splice(idx, 1);
          else stars.unshift(entryId);
          setStars(stars);
          paint();
        });
      })();

      // "Was this helpful?" feedback — Y/N votes logged to entry-feedback blob.
      // Persists vote in localStorage so a single user can't double-vote on
      // the same entry from the same browser.
      (function(){
        var row = document.getElementById('feedback-row');
        if (!row) return;
        var tallyEl = document.getElementById('fb-tally');
        var voteKey = 'pulse-fb-' + entryId;
        var existingVote = null;
        try { existingVote = localStorage.getItem(voteKey); } catch(e){}
        function paintTally(yes, no, myVote) {
          var total = (yes || 0) + (no || 0);
          var pct = total ? Math.round((yes / total) * 100) : null;
          var lbl = total === 0 ? 'Be the first.' :
                    (myVote ? 'Thanks — you voted ' + (myVote === 'yes' ? '👍' : '👎') + '. ' : '') +
                    (pct !== null ? pct + '% found this helpful · ' + total + ' vote' + (total === 1 ? '' : 's') : '');
          if (tallyEl) tallyEl.textContent = lbl;
        }
        function setVotedState(vote) {
          row.querySelectorAll('.fb-btn').forEach(function(btn){
            btn.disabled = true;
            btn.style.cursor = 'default';
            btn.style.opacity = btn.dataset.vote === vote ? '1' : '0.4';
          });
        }
        // Fetch initial tally
        fetch('/.netlify/functions/entry-feedback?id=' + encodeURIComponent(entryId))
          .then(function(r){ return r.ok ? r.json() : null; })
          .then(function(j){
            if (j && j.ok) paintTally(j.yes, j.no, existingVote);
          }).catch(function(){});
        if (existingVote) setVotedState(existingVote);
        row.querySelectorAll('.fb-btn').forEach(function(btn){
          btn.addEventListener('click', function(){
            if (existingVote) return;
            var vote = btn.dataset.vote;
            setVotedState(vote);
            try { localStorage.setItem(voteKey, vote); } catch(e){}
            existingVote = vote;
            fetch('/.netlify/functions/entry-feedback', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: entryId, vote: vote }),
            }).then(function(r){ return r.json(); }).then(function(j){
              if (j && j.ok) paintTally(j.yes, j.no, vote);
            }).catch(function(){});
          });
        });
      })();

      // Per-mermaid SVG/PNG download — exports the SPECIFIC diagram clicked,
      // with a "pulserevops.com/knowledge/qXXXX" watermark baked into PNG.
      function downloadMermaidSvg(svg, idx){
        if (!svg) return;
        var s = svgString(svg);
        var blob = new Blob([s], { type: 'image/svg+xml;charset=utf-8' });
        downloadBlob(blob, entryId + '-viz' + (idx > 0 ? ('-' + (idx + 1)) : '') + '.svg');
      }
      function downloadMermaidPng(svg, idx){
        if (!svg) return;
        var s = svgString(svg);
        var img = new Image();
        var w = svg.viewBox && svg.viewBox.baseVal && svg.viewBox.baseVal.width || svg.clientWidth || 1200;
        var h = svg.viewBox && svg.viewBox.baseVal && svg.viewBox.baseVal.height || svg.clientHeight || 630;
        var scale = 2;
        img.onload = function(){
          var c = document.createElement('canvas');
          c.width = w * scale; c.height = h * scale;
          var ctx = c.getContext('2d');
          ctx.fillStyle = '#0e1218';
          ctx.fillRect(0,0,c.width,c.height);
          ctx.drawImage(img, 0, 0, c.width, c.height);
          // Watermark — bottom-right, branded
          ctx.fillStyle = 'rgba(232,113,10,0.85)';
          ctx.font = 'bold ' + Math.round(14 * scale) + 'px Inter, Segoe UI, sans-serif';
          ctx.textAlign = 'right';
          ctx.textBaseline = 'bottom';
          ctx.fillText('pulserevops.com/knowledge/' + entryId, c.width - 16 * scale, c.height - 12 * scale);
          c.toBlob(function(blob){
            if (blob) downloadBlob(blob, entryId + '-viz' + (idx > 0 ? ('-' + (idx + 1)) : '') + '.png');
            else alert('PNG export failed (your browser may block SVG→canvas).');
          }, 'image/png');
        };
        img.onerror = function(){ alert('Could not render PNG.'); };
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(s)));
      }
      function injectPerMermaidButtons(){
        var wraps = document.querySelectorAll('.mermaid-wrap');
        wraps.forEach(function(wrap, idx){
          if (wrap.querySelector('.viz-dl-bar')) return; // already injected
          var svg = wrap.querySelector('svg');
          if (!svg) return; // mermaid hasn't rendered yet
          var bar = document.createElement('div');
          bar.className = 'viz-dl-bar';
          bar.style.cssText = 'position:absolute;top:8px;left:12px;display:flex;gap:6px;z-index:5;';
          var svgBtn = document.createElement('button');
          svgBtn.type = 'button';
          svgBtn.textContent = '⬇ SVG';
          svgBtn.title = 'Download this diagram as SVG';
          svgBtn.style.cssText = 'background:rgba(0,0,0,0.55);border:1px solid rgba(255,140,26,0.4);color:#FFD7A8;font-family:inherit;font-size:0.6rem;font-weight:700;letter-spacing:0.08em;padding:4px 9px;border-radius:5px;cursor:pointer;';
          svgBtn.addEventListener('click', function(e){ e.stopPropagation(); downloadMermaidSvg(svg, idx); });
          var pngBtn = document.createElement('button');
          pngBtn.type = 'button';
          pngBtn.textContent = '⬇ PNG';
          pngBtn.title = 'Download this diagram as PNG (watermarked)';
          pngBtn.style.cssText = svgBtn.style.cssText;
          pngBtn.addEventListener('click', function(e){ e.stopPropagation(); downloadMermaidPng(svg, idx); });
          bar.appendChild(svgBtn);
          bar.appendChild(pngBtn);
          wrap.appendChild(bar);
        });
      }
      // Run on load + observe for late-rendered mermaid SVGs
      injectPerMermaidButtons();
      var injectInterval = setInterval(injectPerMermaidButtons, 600);
      setTimeout(function(){ clearInterval(injectInterval); injectPerMermaidButtons(); }, 8000);
      } catch(err){ console.error('[viz] init error', err); }
    })();

    // ✨ Social Studio — generates copy-paste X thread + LinkedIn post + Reddit comment
    (function(){
      try {
      var openBtn = document.getElementById('open-social');
      var panel = document.getElementById('social-panel');
      var closeBtn = document.getElementById('social-close');
      var genBtn = document.getElementById('social-generate');
      var status = document.getElementById('social-status');
      var results = document.getElementById('social-results');
      if (!openBtn || !panel) return;

      openBtn.addEventListener('click', function(){ panel.hidden = false; openBtn.scrollIntoView({behavior:'smooth',block:'center'}); });
      if (closeBtn) closeBtn.addEventListener('click', function(){ panel.hidden = true; });

      function makeCopyBlock(label, text) {
        var wrap = document.createElement('div');
        wrap.style.cssText = 'background:rgba(0,0,0,0.4);border:1px solid rgba(255,140,26,0.25);border-radius:10px;padding:14px;';
        var header = document.createElement('div');
        header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;';
        var lbl = document.createElement('span');
        lbl.style.cssText = 'font-size:0.62rem;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:#FF8C1A;';
        lbl.textContent = label;
        var copyBtn = document.createElement('button');
        copyBtn.type = 'button';
        copyBtn.style.cssText = 'background:rgba(255,140,26,0.15);border:1px solid rgba(255,140,26,0.4);color:#FFD7A8;font-family:inherit;font-size:0.66rem;font-weight:700;letter-spacing:0.04em;padding:5px 11px;border-radius:6px;cursor:pointer;';
        copyBtn.textContent = '⎘ Copy';
        copyBtn.addEventListener('click', function(){
          if (navigator.clipboard) navigator.clipboard.writeText(text).then(function(){
            copyBtn.textContent = '✓ Copied'; setTimeout(function(){ copyBtn.textContent = '⎘ Copy'; }, 1400);
          });
        });
        header.appendChild(lbl); header.appendChild(copyBtn);
        var pre = document.createElement('pre');
        pre.style.cssText = 'white-space:pre-wrap;word-break:break-word;font-family:Inter,system-ui,sans-serif;font-size:0.88rem;line-height:1.55;color:#EDE5D8;margin:0;max-height:280px;overflow-y:auto;';
        pre.textContent = text;
        wrap.appendChild(header); wrap.appendChild(pre);
        return wrap;
      }

      genBtn.addEventListener('click', function(){
        var id = ${JSON.stringify(entry.id)};
        genBtn.disabled = true; genBtn.textContent = 'Generating ✨';
        status.textContent = 'Building X / LinkedIn / Reddit cuts...';
        results.hidden = true; results.innerHTML = '';
        fetch('/.netlify/functions/social-cut', {
          method: 'POST',
          headers: { 'Content-Type':'application/json' },
          body: JSON.stringify({ id: id }),
        }).then(function(r){ return r.ok ? r.json() : Promise.reject(new Error('http ' + r.status)); })
          .then(function(j){
            genBtn.disabled = false; genBtn.textContent = 'Regenerate ✨';
            if (!j.ok) { status.textContent = '⚠ ' + (j.reason || 'unknown error'); return; }
            status.textContent = '✓ Ready — copy each block and post.';
            results.innerHTML = '';
            if (Array.isArray(j.x_thread)) {
              var threadText = j.x_thread.map(function(t,i){ return (i+1)+'/ '+t; }).join('\\n\\n');
              results.appendChild(makeCopyBlock('𝕏 Thread (' + j.x_thread.length + ' tweets)', threadText));
            }
            if (j.linkedin_post) results.appendChild(makeCopyBlock('LinkedIn Post', j.linkedin_post));
            if (j.reddit_comment) results.appendChild(makeCopyBlock('Reddit Comment', j.reddit_comment));
            results.hidden = false;
          })
          .catch(function(err){
            genBtn.disabled = false; genBtn.textContent = 'Generate ✨';
            status.textContent = '⚠ ' + (err.message || 'network error');
          });
      });
      } catch (err) { console.error('[social] init error', err); }
    })();
  </script>

  <!-- ── 10/10 RevOps IQ Verified explanation modal — global, click-to-open ── -->
  <div id="iq-help-modal" style="display:none;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.78);backdrop-filter:blur(4px);align-items:center;justify-content:center;padding:24px;" onclick="if(event.target===this)hideIQHelp();">
    <div style="background:linear-gradient(180deg,#1a0e08,#0a0604);border:1px solid rgba(232,113,10,0.45);border-radius:14px;max-width:540px;width:100%;padding:28px 30px 26px;box-shadow:0 20px 60px rgba(0,0,0,0.6),0 0 30px rgba(192,78,0,0.18);font-family:Inter,system-ui,sans-serif;color:rgba(237,229,216,0.95);">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
        <span style="display:inline-block;background:linear-gradient(135deg,#FFD740,#E89F0A);color:#1a1208;padding:5px 12px;border-radius:99px;font-size:0.6rem;font-weight:900;letter-spacing:0.16em;text-transform:uppercase;border:1px solid #FFD740;box-shadow:0 0 10px rgba(255,215,64,0.55);">RevOps IQ Score</span>
        <button type="button" aria-label="Close" onclick="hideIQHelp()" style="background:none;border:none;color:rgba(237,229,216,0.55);font-size:1.5rem;line-height:1;cursor:pointer;padding:0 4px;">×</button>
      </div>
      <h3 style="margin:0 0 12px;font-size:1.1rem;font-weight:700;letter-spacing:0.01em;color:#FFE34F;">What does the score mean?</h3>
      <p style="margin:0 0 14px;font-size:0.85rem;line-height:1.55;color:rgba(237,229,216,0.85);">Every entry shows a live, honest <strong>x/10</strong> score. Fresh entries start at <strong>5/10</strong> &mdash; schema-complete with an opinionated framework. They climb as the AI does real research and verification work between posts.</p>
      <ul style="margin:0 0 16px;padding-left:18px;font-size:0.82rem;line-height:1.6;color:rgba(237,229,216,0.78);">
        <li><strong>5/10</strong> &mdash; fresh write. Structured argument, named vendors, illustrative numbers (not yet fact-checked).</li>
        <li><strong>6/10</strong> &mdash; every claim resolves to a public source URL.</li>
        <li><strong>7/10</strong> &mdash; illustrative numbers replaced with current verified figures from primary sources (10-Qs, press releases, Gartner/Forrester).</li>
        <li><strong>8/10</strong> &mdash; adversarial counter-argument section added; alternative views represented honestly.</li>
        <li><strong>9/10</strong> &mdash; cross-links to 4+ topically related entries in the library; no internal contradictions.</li>
        <li><strong>10/10</strong> &mdash; comprehensive fact-check passed. The answer would survive expert review and is the best response we can produce regardless of where you shopped it.</li>
      </ul>
      <p style="margin:0;font-size:0.72rem;color:rgba(237,229,216,0.55);font-style:italic;">Score is dynamic &mdash; entries improve over hours/days/weeks as the polish loop earns each step. Nothing claims 10/10 unless it actually passes every check.</p>
    </div>
  </div>
  <script>
    window.showIQHelp = function() {
      var m = document.getElementById('iq-help-modal');
      if (m) { m.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
    };
    window.hideIQHelp = function() {
      var m = document.getElementById('iq-help-modal');
      if (m) { m.style.display = 'none'; document.body.style.overflow = ''; }
    };
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape') window.hideIQHelp();
    });
  </script>

</body>
</html>`;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=600', // 5min browser, 10min CDN
    },
    body: html,
  };
};
