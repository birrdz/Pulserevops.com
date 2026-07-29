// new/publish_core.js — shared "publish a finished 5/5 entry LIVE via blob (NO deploy)".
// Used by both the CLI (publish_live.js) and the Block Builder's Publish button (/api/publish).
// Writes face + body images to qa-bin/, embeds body images in block-block-image rhythm,
// writes answers/<qid>.json, upserts _index.json (pulse-recent + pillar tag, fresh ts).
'use strict';
require('../_index_guard'); // INDEXING LOCK LAW 4444 — see INDEXING_LOCK_LAW.md
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
// 🖼 Body-image slot cap (owner 2026-07-28: "1 image for every paragraph"). Was hard-coded 6 in
// five places, which capped every entry at six images no matter how long the article was.
// imageSlotIndices() already distributes N images across the body's PARAGRAPHS, so it scales —
// only these ceilings were in the way. Raising it is backward-compatible: existing entries have
// six or fewer and are unaffected. Override with PULSE_MAX_BODY_IMAGES.
const MAX_BODY_IMAGES = Math.max(1, parseInt(process.env.PULSE_MAX_BODY_IMAGES || '10', 10));
// ── per-entry blob lock (owner 2026-07-21): only ONE image machine writes a given page's blob at a time,
// so parallel machines (face/hero/body all on one entry) never clobber each other's update. mkdir is atomic;
// a lock older than 30s (crashed holder) is broken. Local-host only (all machines run on this box).
const _LOCKDIR = WD + '/new/imagebank/_locks';
try { require('fs').mkdirSync(_LOCKDIR, { recursive: true }); } catch (e) {}
async function withEntryLock(id, fn) {
  const lp = _LOCKDIR + '/' + String(id).replace(/[^a-zA-Z0-9_-]/g, '') + '.lock';
  let held = false;
  for (let i = 0; i < 300; i++) {
    try { require('fs').mkdirSync(lp); held = true; break; }
    catch (e) { try { const st = require('fs').statSync(lp); if (Date.now() - st.mtimeMs > 30000) { require('fs').rmdirSync(lp); continue; } } catch (e2) {} await new Promise(r => setTimeout(r, 50)); }
  }
  try { return await fn(); } finally { if (held) { try { require('fs').rmdirSync(lp); } catch (e) {} } }
}
try { for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (e) {}
const { getStore } = require('@netlify/blobs');
function theStore() {
  return getStore({ name: 'pulse-machine-library', siteID: process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN });
}

function slugify(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 36); }
// Guard against white/blank/broken images ever going live: the buffer must be a real, decodable
// image of sensible size. Blocks publish if a download failed or came back empty/corrupt.
async function validImg(buf) {
  try {
    if (!buf || buf.length < 1000) return false;                 // 0-byte / error-page / truncated download
    const md = await require('sharp')(buf).metadata();            // must actually DECODE as an image
    return !!md.format && (md.width || 0) >= 80 && (md.height || 0) >= 80;
  } catch (e) { return false; }
}

// Shared placement: the line indices (after which) images go — block, block, IMAGE rhythm,
// never inside Direct Answer or the Related/FAQ/Sources wrap-up. Preview + publish use the SAME.
function imageSlotIndices(lines, n) {
  let stop = lines.length;
  for (let i = 0; i < lines.length; i++) if (/^##\s+(Related questions|FAQ|Sources|Related on PULSE)/i.test(lines[i].trim())) { stop = i; break; }
  let start = 0;
  for (let i = 0; i < stop; i++) { const tt = lines[i].trim(); if (/^##\s/.test(tt) && !/Direct Answer/i.test(tt)) { start = i + 1; break; } }
  const isBreak = l => l.trim() === '' || /^#{1,6}\s/.test(l.trim()) || /^```/.test(l.trim()) || /^!\[/.test(l.trim());
  const paraEnds = []; let inPara = false;
  for (let i = start; i < stop; i++) { const brk = isBreak(lines[i]); if (!brk) inPara = true; else if (inPara) { paraEnds.push(i - 1); inPara = false; } }
  if (inPara) paraEnds.push(stop - 1);
  // EVEN SPREAD (2026-07-16): distribute the n images uniformly across the body's
  // paragraphs instead of clustering them every-other-paragraph. Image i lands after
  // the paragraph at fractional position (i+1)/(n+1) through the essay, so 6 images
  // sit at roughly 1/7, 2/7 … 6/7 of the way down. Nudge apart any collisions so two
  // images never stack after the same paragraph.
  const P = paraEnds.length;
  const picks = [];
  if (!P || n <= 0) return picks;
  for (let i = 0; i < n; i++) {
    let idx = Math.round(P * (i + 1) / (n + 1)) - 1;
    if (idx < 0) idx = 0; if (idx >= P) idx = P - 1;
    picks.push(paraEnds[idx]);
  }
  for (let i = 1; i < picks.length; i++) {
    if (picks[i] <= picks[i - 1]) { const ni = paraEnds.indexOf(picks[i - 1]); picks[i] = paraEnds[Math.min(ni + 1, P - 1)]; }
  }
  return picks;
}

// Golden essay rhythm: block, block, IMAGE ×3, then Related/FAQ/Sources underneath image-free.
// 🔒 TOP_LIST v2.2 IMAGE FILL (2026-07-29). A v2.2 body is HTML and ALREADY CARRIES its
// image slots: one <img> in figure.g-hero, then one inside each figure.g-img under
// <h2>#N: …>. So the drip must FILL those slots, never splice markdown in.
//
// This matters: the markdown rank regex below (/^#{2,3}\s*\d+[.)]/) cannot match an HTML
// <h2>, so a v2.2 page would fall through to paragraph-spreading — the exact drift that
// put the Corvette photo under the Mustang. Here slot N is structurally item N; the
// anchoring cannot drift because it isn't computed, it's the DOM position.
function embedImagesV2(body, qid, imgs) {
  const b = String(body || '');
  let heroDone = false;
  let item = 0;
  return b.replace(/<figure[^>]*class=["']([^"']*)["'][^>]*>\s*<img\b([^>]*)>/gi, (whole, cls, attrs) => {
    // The FACE CARD is not one of the 11 body images — skip it, or it steals item slot 1
    // and shifts every ranked image down one (heading #1 would show item #2's photo).
    if (/\bg-facecard\b/.test(cls)) return whole;
    const isHero = /\bg-hero\b/.test(cls);
    let slot;                       // 1 = hero, 2..11 = ranked items in document order
    if (isHero && !heroDone) { heroDone = true; slot = 1; }
    else if (!isHero) { item++; slot = item + 1; }
    else return whole;
    const meta = imgs[slot - 1];
    if (!meta) return whole;        // no image supplied for this slot → leave it alone
    const url = '/assets/qa/' + qid + '-b' + slot + '.jpg';
    const alt = String((meta && meta.alt) || '').replace(/"/g, '&quot;');
    const kept = attrs
      .replace(/\s*\bsrc=["'][^"']*["']/i, '')
      .replace(/\s*\balt=["'][^"']*["']/i, '')
      .trim();
    return whole.slice(0, whole.indexOf('<img')) +
      '<img src="' + url + '" alt="' + alt + '"' + (kept ? ' ' + kept : '') + '>';
  });
}

function embedImages(body, qid, imgs) {
  // v2.2 TOP_LIST bodies fill existing slots instead of splicing markdown.
  if (/data-template=["']TOP_LIST["']/.test(String(body || '')) &&
      /data-version=["']v2["']/.test(String(body || ''))) {
    return embedImagesV2(body, qid, imgs || []);
  }
  // 🔒 RE-PUBLISH DEDUP (2026-07-16): strip any body images already embedded for
  // THIS qid on a prior publish, so a second pass REPLACES the set instead of
  // appending a duplicate of every slot. This was the root cause of the stacked /
  // "mirrored" images (b1/b2/b3 rendered twice while b4-b6 rendered once).
  // strip EVERY image-only line (ANY url) so a re-pass REPLACES the whole image set — never stacks old + new.
  // (Was: only stripped /assets/qa/<qid>-bN.jpg, so old embeds with other urls survived and images piled up.)
  body = String(body || '').split('\n').filter(l => !/^!\[[^\]]*\]\([^)]*\)$/.test(l.trim())).join('\n');
  if (!imgs.length) return body;
  const lines = body.split('\n');
  // 🏆 RANKED PAGES: ONE IMAGE PER RANKED ITEM, ANCHORED TO ITS HEADING (owner 2026-07-29:
  // "it needs to attach the image to the # ranking … if it's talking about this model this year, it needs to
  // have one image for all of that text").
  //
  // The generic slot picker spreads images by PARAGRAPH COUNT, so a long write-up receives two images and every
  // later one shifts down a slot. On ca0487 that put the Corvette photo under the Mustang: rank 1 got b1 AND
  // b2, then rank 2 got b3, and so on all the way down. The image content was sourced per-rank correctly — it
  // was the placement that drifted.
  //
  // On a ranked page each numbered heading now takes exactly one image, however many paragraphs sit under it,
  // so slot N is always the item the reader is looking at.
  const rankAt = [];
  for (let i = 0; i < lines.length; i++) {
    if (/^#{2,3}\s*(?:\d+[.)]|#\d+)\s*\S/.test(lines[i])) rankAt.push(i);
  }
  const picks = (rankAt.length >= 2 && rankAt.length >= imgs.length)
    ? rankAt.slice(0, imgs.length)
    : imageSlotIndices(lines, imgs.length);
  const ins = imgs.map((n, i) => ({ at: picks[i], md: '\n![' + n.alt + '](/assets/qa/' + qid + '-b' + (i + 1) + '.jpg)\n' })).filter(x => x.at != null).sort((a, b) => b.at - a.at);
  for (const x of ins) lines.splice(x.at + 1, 0, x.md);
  return lines.join('\n');
}

// Render the answer body to lightweight HTML with N clickable image-slot placeholders
// dropped at the EXACT spots the real images will land — the builder's WYSIWYG preview.
function previewHtml(body, n) {
  const lines = String(body || '').split('\n');
  const picks = imageSlotIndices(lines, n);
  const slotAt = {}; picks.forEach((idx, k) => { slotAt[idx] = k; });
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const inline = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
  const out = []; let para = [];
  const flush = () => { if (para.length) { out.push('<p>' + inline(para.join(' ')) + '</p>'); para = []; } };
  let i = 0;
  while (i < lines.length) {
    const t = lines[i].trim();
    if (/^```mermaid/i.test(t)) { flush(); i++; while (i < lines.length && !/^```/.test(lines[i].trim())) i++; out.push('<div class="diag">▦ diagram</div>'); if (slotAt[i] != null) out.push('<div class="imgslot" data-slot="' + slotAt[i] + '">＋ image ' + (slotAt[i] + 1) + '</div>'); i++; continue; }
    if (/^```/.test(t)) { i++; continue; }
    if (!t) flush();
    else if (/^###\s/.test(t)) { flush(); out.push('<h4>' + inline(t.replace(/^###\s/, '')) + '</h4>'); }
    else if (/^##\s/.test(t)) { flush(); out.push('<h3>' + inline(t.replace(/^##\s/, '')) + '</h3>'); }
    else if (/^[-*]\s/.test(t)) { flush(); out.push('<li>' + inline(t.replace(/^[-*]\s/, '')) + '</li>'); }
    else if (/^!\[/.test(t)) { /* skip any existing image line */ }
    else para.push(t);
    if (slotAt[i] != null) { flush(); const k = slotAt[i]; out.push('<div class="imgslot" data-slot="' + k + '">＋ image ' + (k + 1) + '</div>'); }
    i++;
  }
  flush();
  return out.join('\n');
}

async function nextQid(store) {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  let max = 19000;
  for (const e of idx.entries) { const m = /^q(\d+)$/.exec(e.id || ''); if (m) { const n = +m[1]; if (n > max) max = n; } }
  return { qid: 'q' + (max + 1), idx };
}

// publishLive({ newId, qid? }) -> { qid, url, words }
async function publishLive(opts) {
  const newId = opts.newId;
  const ENTRY = WD + '/new/entries/' + newId + '.json';
  const OUT = WD + '/new/output/' + newId;
  const entry = JSON.parse(fs.readFileSync(ENTRY, 'utf8'));
  const meta = JSON.parse(fs.readFileSync(OUT + '/meta.json', 'utf8'));
  const store = theStore();
  let qid = opts.qid, idx;
  if (qid) { idx = await store.get('_index.json', { type: 'json', consistency: 'strong' }); }
  else { const a = await nextQid(store); qid = a.qid; idx = a.idx; }
  const question = meta.title || entry.question;
  const now = Date.now();

  // face card → qa-bin/<qid>.jpg (framed, for the answer-page hero).
  // .sq thumbnail = same cover with the baked frame CROPPED OFF (34px), so the Recents card shows a
  // clean image inside its single bold pink/green CSS border — one frame, all 4 sides, no double box.
  const face = fs.readFileSync(OUT + '/' + (meta.faceCard || 'facecard.jpg'));
  if (!(await validImg(face))) throw new Error('Cover image did not load — re-pick the cover, then publish again.');
  await store.set('qa-bin/' + qid + '.jpg', face, { metadata: { src: 'blockbuilder' } });
  let sqBuf = face;
  try { const sharp = require('sharp'); const bw = 34; const md = await sharp(face).metadata(); sqBuf = await sharp(face).extract({ left: bw, top: bw, width: (md.width || 1200) - 2 * bw, height: (md.height || 675) - 2 * bw }).jpeg({ quality: 86 }).toBuffer(); } catch (e) {}
  await store.set('qa-bin/' + qid + '.sq.jpg', sqBuf, { metadata: { src: 'blockbuilder' } });

  // body images → qa-bin/<qid>-bN.jpg
  const imgs = [];
  const bodyKeys = Object.keys(meta.body || {}).sort((a, b) => (+a) - (+b));
  for (let i = 0; i < bodyKeys.length; i++) {
    const buf = fs.readFileSync(OUT + '/' + meta.body[bodyKeys[i]]);
    if (!(await validImg(buf))) throw new Error('Image ' + (i + 1) + ' did not load — re-pick image ' + (i + 1) + ', then publish again.');
    await store.set('qa-bin/' + qid + '-b' + (i + 1) + '.jpg', buf, { metadata: { src: 'blockbuilder' } });
    imgs.push({ alt: question.replace(/\?+$/, '') + ' — figure ' + (i + 1) });
  }

  const fmt = meta.format || entry.format;
  let answer;
  if (fmt === 'top10') {
    // OWNER LAYOUT (2026-07-15): each item gets its OWN block — image card + a write-up under it.
    // "#1 Chief — image — Chief is …", "#2 Ellevate — image — Ellevate is …" — NOT 10 images stacked bare.
    const names = meta.items || {};
    const descs = meta.itemDesc || {};
    let lines = entry.body.split('\n');
    const hdr = lines.findIndex(l => /^##\s+The Top 10\b/i.test(l.trim()));
    // parse each item's write-up from the numbered list "N. **Name** — description"
    const parsedDesc = {};
    if (hdr >= 0) {
      let end = hdr + 1; while (end < lines.length && !/^##\s/.test(lines[end].trim())) end++;
      for (let i = hdr + 1; i < end; i++) { const mm = lines[i].trim().match(/^(\d{1,2})[.)]\s+(.+)$/); if (mm) { const num = +mm[1]; const parts = mm[2].split(/\s+[—–-]\s+|:\s+/); parsedDesc[num - 1] = (parts.length > 1 ? parts.slice(1).join(' — ') : '').replace(/\*\*/g, '').trim(); } }
    }
    const blocks = [];
    for (let i = 0; i < bodyKeys.length; i++) {
      const nm = (names[i] || names[String(i)] || ('#' + (i + 1))).replace(/"/g, '');
      const d = descs[i] || descs[String(i)] || parsedDesc[i] || '';
      blocks.push('@@PRODUCT name="' + (i + 1) + '. ' + nm + '" img="/assets/qa/' + qid + '-b' + (i + 1) + '.jpg"');
      if (d) blocks.push('', '**' + (i + 1) + '. ' + nm + '** — ' + d, '');
      else blocks.push('');
    }
    const block = blocks.join('\n');
    if (hdr >= 0) {
      let end = hdr + 1; while (end < lines.length && !/^##\s/.test(lines[end].trim())) end++;
      const kept = []; for (let i = hdr + 1; i < end; i++) { if (!/^\s*\d{1,2}[.)]\s+/.test(lines[i])) kept.push(lines[i]); }  // drop the raw numbered list, keep any prose
      lines = lines.slice(0, hdr + 1).concat(['', block], kept, lines.slice(end));
    } else {
      let at = lines.length;
      for (let i = 0; i < lines.length; i++) { const tt = lines[i].trim(); if (/^##\s/.test(tt) && !/Direct Answer|How we chose/i.test(tt)) { at = i; break; } }
      lines.splice(at, 0, '\n## The Top 10\n\n' + block + '\n');
    }
    answer = lines.join('\n');
  } else {
    answer = embedImages(entry.body, qid, imgs);
  }
  const slug = slugify(question);
  // In-place upgrade of an existing entry (tl####, etc.): KEEP its pillar tags so it stays in the right pillar.
  let existingTags = null;
  try { const cur = await store.get('answers/' + qid + '.json', { type: 'json' }); if (cur && Array.isArray(cur.tags) && cur.tags.length) existingTags = cur.tags.slice(); } catch (e) {}
  const tags = existingTags
    ? (existingTags.indexOf('pulse-recent') >= 0 ? existingTags : existingTags.concat(['pulse-recent']))
    : ['revops', 'revops-500', slug, 'fractional-cro', 'cro-syndicate', 'pulse-recent'];

  const blob = {
    id: qid, question, answer, tags, sources: [],
    ts: now, model: 'claude-opus-4-8', polished_at: now, quality_score: 10, gate_score: 13,
    was_indexed_at: now, format_v: '2026-07', pending: false,
    img: '/assets/qa/' + qid + '.jpg', cover_src: 'blockbuilder', face_title_baked: false,
    h1: question, updated_at: new Date(now).toISOString(), gold_format: true, gk_verified: true,
    built_by: 'block-builder', built_from: newId,
  };
  await store.setJSON('answers/' + qid + '.json', blob);

  const row = { id: qid, question, tags, quality_score: 10, gate_score: 13, format_v: '2026-07', pending: false, ts: now, polished_at: now, img: '/assets/qa/' + qid + '.jpg', cover_src: 'blockbuilder', was_indexed_at: now, title: question, bb: 1, trim: meta.trim || 'hotpink' };
  idx.entries = idx.entries.filter(e => e && e.id !== qid);
  idx.entries.unshift(row);
  idx.entries.sort((a, b) => (Number(b.ts) || 0) - (Number(a.ts) || 0));
  await store.setJSON('_index.json', idx);

  meta.qid = qid; meta.live = true; meta.liveAt = new Date(now).toISOString(); meta.status = '5/5'; meta.publishedAt = meta.liveAt; meta.recent = true;
  fs.writeFileSync(OUT + '/meta.json', JSON.stringify(meta, null, 1));

  // Fact-drip main fixer: brand-new Q&A jumps the priority line
  try { require('../_fact_priority_push').pushFactPriority(qid); } catch (e) {}

  return { qid, url: 'https://pulserevops.com/knowledge/' + qid, words: entry.words };
}

// proveLive(qid) — read the PUBLISHED blob and confirm the face card + body images actually
// landed in the live answer. Returns counts so the picker can show PROOF before advancing.
async function proveLive(qid) {
  const store = theStore();
  let blob = null;
  try { blob = await store.get('answers/' + qid + '.json', { type: 'json', consistency: 'strong' }); } catch (e) {}
  if (!blob) return { ok: false, err: 'not published yet' };
  const ans = String(blob.answer || '');
  const esc = String(qid).replace(/[^a-z0-9]/gi, '');
  const bodyCount = (ans.match(new RegExp('/assets/qa/' + esc + '-b\\d\\.jpg', 'g')) || []).length;
  const face = !!(blob.img && String(blob.img).indexOf(esc + '.jpg') >= 0);
  return { ok: true, qid, face, bodyCount, blockBuilder: blob.built_by === 'block-builder', url: 'https://pulserevops.com/knowledge/' + qid };
}

// publishContentOnly(id) — CONTENT MODE ship (owner 2026-07-17): replace ONLY the answer text of an
// entry with the freshly-improved 13/13 content, re-embedding whatever body images already exist in
// qa-bin. Keeps the face card + everything else. Images can be added later. Fixes bad/garbage content live.
async function publishContentOnly(id) {
  const entry = JSON.parse(fs.readFileSync(WD + '/new/entries/' + id + '.json', 'utf8'));
  const store = theStore();
  const qid = entry.inPlace ? (entry.upgradeId || entry.id) : entry.id;
  const now = Date.now();
  const question = entry.question || '';
  let bodyN = 0;
  try { const lst = await store.list({ prefix: 'qa-bin/' + qid + '-b' }); bodyN = (lst.blobs || []).filter(x => /-b\d+\.jpg$/i.test(x.key)).length; } catch (e) {}
  const imgs = []; for (let i = 1; i <= Math.min(MAX_BODY_IMAGES, bodyN); i++) imgs.push({ alt: question.replace(/\?+$/, '') + ' — figure ' + i });
  const answer = (entry.format === 'top10') ? entry.body : embedImages(entry.body, qid, imgs);
  let blob = null; try { blob = await store.get('answers/' + qid + '.json', { type: 'json', consistency: 'strong' }); } catch (e) {}
  if (!blob) {
    const idx = (await store.get('_index.json', { type: 'json', consistency: 'strong' })) || { entries: [] };
    blob = { id: qid, question, answer, tags: ['revops', 'revops-500', 'pulse-recent'], sources: [], ts: now, model: 'claude-opus-4-8', polished_at: now, quality_score: 10, gate_score: 13, was_indexed_at: now, format_v: '2026-07', pending: false, img: '/assets/qa/' + qid + '.jpg', cover_src: 'blockbuilder', h1: question, updated_at: new Date(now).toISOString(), gold_format: true, gk_verified: true, built_by: 'block-builder', built_from: id };
    idx.entries = (idx.entries || []).filter(e => e && e.id !== qid); idx.entries.unshift({ id: qid, question, tags: blob.tags, quality_score: 10, gate_score: 13, format_v: '2026-07', pending: false, ts: now, polished_at: now, img: blob.img, was_indexed_at: now, title: question });
    await store.setJSON('_index.json', idx);
  } else {
    blob.answer = answer; if (question) { blob.question = question; blob.h1 = question; } blob.polished_at = now; blob.gate_score = 13; blob.quality_score = 10; blob.pending = false; blob.updated_at = new Date(now).toISOString(); blob.gk_verified = true;
  }
  await store.setJSON('answers/' + qid + '.json', blob);
  return { qid, url: 'https://pulserevops.com/knowledge/' + qid, bodyImages: imgs.length };
}

// publishFaceOnly(id) — FACE-CARD-FIRST ship (owner 2026-07-17): publish JUST the face card + the
// 13/13 content (re-embedding any body images already in qa-bin). Does NOT require all 6 body images —
// so you can deploy the face card, verify it took, then come back and do the body images.
async function publishFaceOnly(id) {
  const entry = JSON.parse(fs.readFileSync(WD + '/new/entries/' + id + '.json', 'utf8'));
  const OUT = WD + '/new/output/' + id;
  const meta = JSON.parse(fs.readFileSync(OUT + '/meta.json', 'utf8'));
  const store = theStore();
  const qid = entry.inPlace ? (entry.upgradeId || entry.id) : entry.id;
  const now = Date.now();
  const question = meta.title || entry.question || '';
  const face = fs.readFileSync(OUT + '/' + (meta.faceCard || 'facecard.jpg'));
  if (!(await validImg(face))) throw new Error('Face card image did not load — re-pick it, then deploy again.');
  await store.set('qa-bin/' + qid + '.jpg', face, { metadata: { src: 'blockbuilder' } });
  let sqBuf = face;
  try { const sharp = require('sharp'); const bw = 34; const md = await sharp(face).metadata(); sqBuf = await sharp(face).extract({ left: bw, top: bw, width: (md.width || 1200) - 2 * bw, height: (md.height || 675) - 2 * bw }).jpeg({ quality: 86 }).toBuffer(); } catch (e) {}
  await store.set('qa-bin/' + qid + '.sq.jpg', sqBuf, { metadata: { src: 'blockbuilder' } });
  // VERSIONED copies — a NEW filename each seal defeats CDN/browser cache AND the baked-static-wins bug.
  const ver = '-v' + now;
  await store.set('qa-bin/' + qid + ver + '.jpg', face, { metadata: { src: 'blockbuilder' } });
  await store.set('qa-bin/' + qid + ver + '.sq.jpg', sqBuf, { metadata: { src: 'blockbuilder' } });
  let bodyN = 0; try { const lst = await store.list({ prefix: 'qa-bin/' + qid + '-b' }); bodyN = (lst.blobs || []).filter(x => /-b\d+\.jpg$/i.test(x.key)).length; } catch (e) {}
  const imgs = []; for (let i = 1; i <= Math.min(MAX_BODY_IMAGES, bodyN); i++) imgs.push({ alt: question.replace(/\?+$/, '') + ' — figure ' + i });
  const answer = (entry.format === 'top10') ? entry.body : embedImages(entry.body, qid, imgs);
  let blob = null; try { blob = await store.get('answers/' + qid + '.json', { type: 'json', consistency: 'strong' }); } catch (e) {}
  if (!blob) blob = { id: qid, tags: ['revops', 'revops-500', 'pulse-recent'], sources: [], ts: now, model: 'claude-opus-4-8', format_v: '2026-07', cover_src: 'blockbuilder', gold_format: true, gk_verified: true, built_by: 'block-builder', built_from: id };
  blob.question = question; blob.h1 = question; blob.answer = answer; blob.img = '/assets/qa/' + qid + ver + '.jpg'; blob.polished_at = now; blob.gate_score = 13; blob.quality_score = 10; blob.pending = false; blob.updated_at = new Date(now).toISOString();
  await store.setJSON('answers/' + qid + '.json', blob);
  // UPDATE the index entry's img to the versioned URL (existing entry) or INSERT it (new) — the renderer + mosaic read idxEntry.img.
  try { const idx = (await store.get('_index.json', { type: 'json', consistency: 'strong' })) || { entries: [] }; idx.entries = idx.entries || []; const ex = idx.entries.find(e => e && e.id === qid); if (ex) { ex.img = blob.img; ex.polished_at = now; ex.pending = false; if (!ex.ts) ex.ts = now; if (!ex.title) ex.title = question; } else { idx.entries.unshift({ id: qid, question, tags: blob.tags, quality_score: 10, gate_score: 13, format_v: '2026-07', pending: false, ts: now, polished_at: now, img: blob.img, was_indexed_at: now, title: question }); } await store.setJSON('_index.json', idx); } catch (e) {}
  return { qid, url: 'https://pulserevops.com/knowledge/' + qid };
}

// markRecent — bump into RECENTS (ts + pulse-recent + hotpink trim) on ANY new/edit.
// while it stays in its pillar (id/URL unchanged). Called by every publisher below.
function markRecent(o, now) {
  if (!o) return;
  const t = now != null ? now : Date.now();
  o.ts = t;
  if (!o.polished_at || o.polished_at < t) o.polished_at = t;
  o.trim = 'hotpink';
  if (!Array.isArray(o.tags)) o.tags = o.tags ? [o.tags] : [];
  if (o.tags.indexOf('pulse-recent') < 0) o.tags.push('pulse-recent');
}

// publishFaceImageOnly(id) — ADVERTISING CARD ship (owner 2026-07-17): writes ONLY the face image,
// versioned (cache-proof), and repoints img. Works for BLOB-ONLY entries (no local new/entries file needed)
// and NEVER touches the answer body — image only, per the advertising-card law.
async function publishFaceImageOnly(id) {
  const store = theStore();
  const OUT = WD + '/new/output/' + id;
  const meta = JSON.parse(fs.readFileSync(OUT + '/meta.json', 'utf8'));
  const face = fs.readFileSync(OUT + '/' + (meta.faceCard || 'facecard.jpg'));
  if (!(await validImg(face))) throw new Error('Face card image did not load — re-pick it, then seal again.');
  const now = Date.now();
  const ver = '-v' + now;
  await store.set('qa-bin/' + id + '.jpg', face, { metadata: { src: 'adcard' } });
  let sqBuf = face;
  try { const sharp = require('sharp'); const bw = 34; const md = await sharp(face).metadata(); sqBuf = await sharp(face).extract({ left: bw, top: bw, width: (md.width || 1200) - 2 * bw, height: (md.height || 675) - 2 * bw }).jpeg({ quality: 86 }).toBuffer(); } catch (e) {}
  await store.set('qa-bin/' + id + '.sq.jpg', sqBuf, { metadata: { src: 'adcard' } });
  await store.set('qa-bin/' + id + ver + '.jpg', face, { metadata: { src: 'adcard' } });
  await store.set('qa-bin/' + id + ver + '.sq.jpg', sqBuf, { metadata: { src: 'adcard' } });
  const img = '/assets/qa/' + id + ver + '.jpg';
  // repoint the answers blob img ONLY — preserve the entire body/answer untouched. Under the per-page lock
  // so a concurrent body-image write on the same entry can't clobber it (one machine per page at a time).
  await withEntryLock(id, async () => {
    let blob = null; try { blob = await store.get('answers/' + id + '.json', { type: 'json', consistency: 'strong' }); } catch (e) {}
    if (blob) { blob.img = img; blob.updated_at = new Date(now).toISOString(); markRecent(blob, now); await store.setJSON('answers/' + id + '.json', blob); }
  });
  // update the index entry img (create-or-update) so the renderer + homepage tile read the versioned URL.
  try {
    const idx = (await store.get('_index.json', { type: 'json', consistency: 'strong' })) || { entries: [] };
    idx.entries = idx.entries || [];
    const ex = idx.entries.find(e => e && e.id === id);
    const question = (blob && (blob.question || blob.h1)) || meta.title || (ex && ex.title) || id;
    if (ex) { ex.img = img; ex.polished_at = now; markRecent(ex, now); if (!ex.title) ex.title = question; }
    else { idx.entries.unshift({ id, question, img, ts: now, polished_at: now, title: question, pending: false }); }
    await store.setJSON('_index.json', idx);
  } catch (e) {}
  return { qid: id, url: 'https://pulserevops.com/knowledge/' + id };
}

// publishDressingOnly(id, newTitle) — DRESSING MAKER (owner 2026-07-17): update ONLY the title/H1 ("dressing").
// The renderer reads entry.question for H1, <title>, and all JSON-LD/SEO, so we set question/h1/title on the
// answers blob AND the _index.json entry. KEEPS the id/URL, the body (.answer), and the image (.img) untouched.
// Saves the previous title in .dressing_prev for easy revert.
async function publishDressingOnly(id, newTitle) {
  const store = theStore();
  const t = String(newTitle || '').replace(/\s+/g, ' ').trim();
  if (t.length < 8) throw new Error('dressing too short (min 8 chars)');
  const now = Date.now();
  let blob = null; try { blob = await store.get('answers/' + id + '.json', { type: 'json', consistency: 'strong' }); } catch (e) {}
  if (!blob) throw new Error('entry not found in blob (' + id + ')');
  const prev = blob.question || blob.h1 || '';
  blob.dressing_prev = prev; blob.question = t; blob.h1 = t; if ('title' in blob) blob.title = t; blob.updated_at = new Date(now).toISOString(); markRecent(blob, now);
  await store.setJSON('answers/' + id + '.json', blob);
  try {
    const idx = (await store.get('_index.json', { type: 'json', consistency: 'strong' })) || { entries: [] };
    const ex = (idx.entries || []).find(e => e && e.id === id);
    if (ex) { ex.question = t; ex.title = t; ex.polished_at = now; markRecent(ex, now); await store.setJSON('_index.json', idx); }
  } catch (e) {}
  return { qid: id, url: 'https://pulserevops.com/knowledge/' + id, prev, title: t };
}

// publishContentBody(id, body) — CONTENT BUILDER (owner 2026-07-17): replace ONLY the answer body with a
// human-approved 13/13 rebuild passed as an ARG. Blob-based (no local file). KEEPS title (question/h1) + image
// (img) + re-embeds existing body images. Saves the previous body in .content_prev for revert.
async function publishContentBody(id, body) {
  const store = theStore();
  const t = String(body || '');
  if (t.trim().length < 500) throw new Error('rebuilt body too short');
  const now = Date.now();
  let blob = null; try { blob = await store.get('answers/' + id + '.json', { type: 'json', consistency: 'strong' }); } catch (e) {}
  if (!blob) throw new Error('entry not found in blob (' + id + ')');
  const question = blob.question || blob.h1 || '';
  let bodyN = 0; try { const lst = await store.list({ prefix: 'qa-bin/' + id + '-b' }); bodyN = (lst.blobs || []).filter(x => /-b\d+\.jpg$/i.test(x.key)).length; } catch (e) {}
  const imgs = []; for (let i = 1; i <= Math.min(MAX_BODY_IMAGES, bodyN); i++) imgs.push({ alt: question.replace(/\?+$/, '') + ' — figure ' + i });
  const answer = embedImages(t, id, imgs);   // re-embed existing body images; keeps title + face image untouched
  blob.content_prev = blob.answer || ''; blob.answer = answer;
  // Honest scores (owner 2026-07-26): health LOW-VALUE uses quality_score — must rise with real gate (≥12 leaves the pile).
  let gate = 13;
  try { const { gateScore } = require('./content_gate.js'); gate = (gateScore({ body: answer, question }).score) || 13; } catch (e) {}
  blob.polished_at = now; blob.gate_score = gate; blob.quality_score = gate; blob.pending = false; blob.updated_at = new Date(now).toISOString(); blob.gk_verified = gate >= 12; markRecent(blob, now);
  await store.setJSON('answers/' + id + '.json', blob);
  try { const idx = (await store.get('_index.json', { type: 'json', consistency: 'strong' })) || { entries: [] }; const ex = (idx.entries || []).find(e => e && e.id === id); if (ex) { ex.gate_score = gate; ex.quality_score = gate; ex.polished_at = now; ex.pending = false; markRecent(ex, now); await store.setJSON('_index.json', idx); } } catch (e) {}
  return { qid: id, url: 'https://pulserevops.com/knowledge/' + id, gate };
}

// publishInternalImages(id, buffers) — INTERNAL CARD tool (owner 2026-07-17): place the BODY/figure images
// inside an answer. Writes qa-bin/<id>-b1..bN.jpg, re-embeds them into the body markdown, and sets
// entry.bb_images=true so the renderer shows them (per-entry, no deploy, no block-builder border).
// KEEPS the face image + title + text. Requires the entry already exist (13/13 content).
async function publishInternalImages(id, buffers) {
  const store = theStore();
  if (!buffers || !buffers.length) throw new Error('no images');
  const now = Date.now();
  let blob = null; try { blob = await store.get('answers/' + id + '.json', { type: 'json', consistency: 'strong' }); } catch (e) {}
  if (!blob) throw new Error('entry not found in blob (' + id + ')');
  const question = blob.question || blob.h1 || '';
  // MIRROR-BLOCK: drop near-identical images (same photoshoot / different frame) via an 8x8 average-hash,
  // so no visual doubles ever land on a page — even when the byte contents differ.
  let sharpL = null; try { sharpL = require('sharp'); } catch (e) {}
  async function aHash(buf) { if (!sharpL) return null; try { const px = await sharpL(buf).resize(8, 8, { fit: 'fill' }).grayscale().raw().toBuffer(); let sum = 0; for (const v of px) sum += v; const avg = sum / px.length; let h = 0n; for (let i = 0; i < px.length; i++) h = (h << 1n) | (px[i] >= avg ? 1n : 0n); return h; } catch (e) { return null; } }
  const ham = (a, b) => { if (a == null || b == null) return 64; let x = a ^ b, c = 0; while (x) { c += Number(x & 1n); x >>= 1n; } return c; };
  const accepted = []; const hashes = [];
  for (const buf of buffers) { if (accepted.length >= 10) break; const h = await aHash(buf); if (h != null && hashes.some(hh => ham(h, hh) <= 6)) continue; hashes.push(h); accepted.push(buf); }
  const imgs = [];
  for (let i = 0; i < accepted.length; i++) {
    await store.set('qa-bin/' + id + '-b' + (i + 1) + '.jpg', accepted[i], { metadata: { src: 'internal' } });
    imgs.push({ alt: question.replace(/\?+$/, '') + ' — figure ' + (i + 1) });
    if (i < accepted.length - 1) await new Promise(r => setTimeout(r, 800));   // small spacing between blob writes; doubles are prevented by the mirror-block above, not by waiting
  }
  for (let i = accepted.length + 1; i <= 10; i++) { try { await store.delete('qa-bin/' + id + '-b' + i + '.jpg'); } catch (e) {} }   // clear stale slots → no leftover dupes
  const answer = embedImages(blob.answer || '', id, imgs);   // embedImages strips old body-image lines then re-inserts
  blob.answer = answer; blob.bb_images = true; blob.updated_at = new Date(now).toISOString(); markRecent(blob, now);
  await store.setJSON('answers/' + id + '.json', blob);
  try { const idx = (await store.get('_index.json', { type: 'json', consistency: 'strong' })) || { entries: [] }; const ex = (idx.entries || []).find(e => e && e.id === id); if (ex) { ex.polished_at = now; markRecent(ex, now); await store.setJSON('_index.json', idx); } } catch (e) {}
  return { qid: id, url: 'https://pulserevops.com/knowledge/' + id, count: imgs.length };
}

// ── KEEP-THE-BEST GUARDED BODY PUBLISH (owner 2026-07-22, post-tl21741) ──────────────────────────
// publishContentBodyIfBetter(id, body) — the ONLY body publisher a fix QUEUE is allowed to call.
// Root cause of the tl21741 damage: publishContentBody publishes every attempt directly, so a worse
// escalated rewrite permanently replaces good content, AND it overwrites .content_prev each call, so
// attempt 2 destroys the only backup of the pre-damage body. This guard fixes both:
//   1. SNAPSHOT-ONCE: the FIRST time this fixer ever touches an entry, the live body + its real score
//      are saved to .content_prev0 — and NEVER overwritten after that. Revert is always possible.
//   2. KEEP-THE-BEST: the candidate is scored against the LIVE body (images stripped, same gate).
//      It publishes ONLY if candidate >= 12/13 AND golden shape AND strictly better than live
//      (score + shape bonus). Worse-or-equal → { published:false }, live page untouched.
//   3. HONEST STAMP: writes the candidate's REAL gate score, never a hard-coded 13.
// opts (all optional): { createIfMissing, question, tags } — createIfMissing is the NEW PIPELINE Q&A
// lane (owner 2026-07-22): a seed with no answers/ blob yet may be CREATED here, but ONLY with a
// candidate that already clears >= 12/13 + golden shape (same gate as everything else). question is
// required to create; tags default to the standard set (pass pillar tags so it lands in its pillar).
async function publishContentBodyIfBetter(id, body, opts) {
  opts = opts || {};
  const { gateScore } = require('./content_gate.js');
  let goldShapeOK = null; try { goldShapeOK = require('./improve_content.js').goldShapeOK; } catch (e) {}
  const store = theStore();
  const t = String(body || '');
  if (t.trim().length < 500) throw new Error('rebuilt body too short');
  const now = Date.now();
  // 🔁 READ RETRY + MISS/ERROR SPLIT (owner 2026-07-22). A single un-retried read threw away a verified 13/13
  // rebuild on tl21741: a transient blip returned nothing, the catch swallowed it, and it was reported as
  // "entry not found". Every other reader here retries 5x, and this is the most consequential read we make —
  // it guards a full ladder run worth ~20 minutes of writer time.
  // Critically we now separate a READ ERROR from a CONFIRMED MISS. createIfMissing must NEVER fire on a blip:
  // doing so would write a fresh blob over a live entry and destroy both the real body AND its content_prev0
  // snapshot — precisely the data loss that guard exists to prevent.
  let blob = null, readErr = null;
  for (let a = 0; a < 5; a++) {
    try {
      blob = await store.get('answers/' + id + '.json', { type: 'json', consistency: 'strong' });
      readErr = null;                    // a clean call: null here means genuinely absent
      if (blob) break;
    } catch (e) { readErr = e; }         // threw → transient/transport problem, NOT proof of absence
    if (a < 4) await new Promise(r => setTimeout(r, 400 * (a + 1)));
  }
  if (!blob && readErr) {
    throw new Error('blob read FAILED for ' + id + ' after 5 attempts (' +
      String((readErr && readErr.message) || readErr).slice(0, 120) +
      ') — refusing to treat a read error as a missing entry');
  }
  if (!blob && !opts.createIfMissing) throw new Error('entry not found in blob (' + id + ')');
  if (!blob) {
    // NEW-ENTRY CREATE (pipeline seeds): nothing live to protect, so keep-the-best is trivially met —
    // but the candidate still faces the full >= 12 + shape gate below before anything is written.
    const q = String(opts.question || '').trim();
    if (q.length < 8) throw new Error('createIfMissing needs a question (>= 8 chars)');
    const candG0 = gateScore({ body: t, question: q });
    const cand0 = candG0.score || 0;
    if (cand0 < 12 || (goldShapeOK && !goldShapeOK(t))) {
      return { qid: id, published: false, reason: 'new-entry candidate under gate (' + cand0 + '/13' + ((goldShapeOK && !goldShapeOK(t)) ? ', shape fail' : '') + ')', live: 0, cand: cand0 };
    }
    const tags = (Array.isArray(opts.tags) && opts.tags.length) ? opts.tags.slice() : ['revops', 'revops-500', slugify(q), 'pulse-recent'];
    if (tags.indexOf('pulse-recent') < 0) tags.push('pulse-recent');
    const nb = { id, question: q, answer: t, tags, sources: [], ts: now, model: 'claude-opus-4-8', polished_at: now,
      quality_score: cand0 >= 13 ? 10 : 9, gate_score: cand0, was_indexed_at: now, format_v: '2026-07', pending: false,
      img: '/assets/qa/' + id + '.jpg', cover_src: 'flux', h1: q, updated_at: new Date(now).toISOString(),
      gold_format: true, gk_verified: cand0 >= 13, built_by: 'lowvalue-guard' };
    await store.setJSON('answers/' + id + '.json', nb);
    try {
      const idx = (await store.get('_index.json', { type: 'json', consistency: 'strong' })) || { entries: [] };
      idx.entries = (idx.entries || []).filter(e => e && e.id !== id);
      idx.entries.unshift({ id, question: q, tags, quality_score: nb.quality_score, gate_score: cand0, format_v: '2026-07', pending: false, ts: now, polished_at: now, img: nb.img, was_indexed_at: now, title: q });
      await store.setJSON('_index.json', idx);
    } catch (e) {}
    return { qid: id, published: true, created: true, url: 'https://pulserevops.com/knowledge/' + id, live: 0, cand: cand0 };
  }
  const question = blob.question || blob.h1 || '';
  const stripImgLines = s => String(s || '').split('\n').filter(l => !/^!\[[^\]]*\]\([^)]*\)$/.test(l.trim())).join('\n');
  const liveBody = stripImgLines(blob.answer || '');
  const liveG = gateScore({ body: liveBody, question });
  const candG = gateScore({ body: t, question });
  const shapeBonus = b => (goldShapeOK && goldShapeOK(b)) ? 0.5 : 0;
  const liveRank = (liveG.score || 0) + shapeBonus(liveBody);
  const candRank = (candG.score || 0) + shapeBonus(t);
  const candScore = candG.score || 0;
  // BELOW-GATE IMPROVEMENT (owner 2026-07-22): the ladder still FIGHTS for 12 — every rung, the plateau escalation
  // and the drift latch are spent before we ever reach here. But when it tops out at, say, 11 on a page that is LIVE
  // at 8, discarding that work leaves the WORSE body public. So an EXISTING entry now publishes on strict improvement
  // alone, and the keep-the-best rank check immediately below is the real guard.
  // NEW entries (createIfMissing, above) still require >=12 + golden shape — we never CREATE sub-gate content; we
  // only ever IMPROVE what is already published. Stamps stay honest: gate_score = the real score, quality_score 9,
  // gk_verified false under 13 — a published 11 is never dressed up as a 13.
  if (candRank <= liveRank) {   // KEEP-THE-BEST: never replace a live body with a worse-or-equal one
    return { qid: id, published: false, reason: 'live body already as good or better (live ' + (liveG.score || 0) + ' vs cand ' + candScore + ')', live: liveG.score || 0, cand: candScore };
  }
  // SNAPSHOT-ONCE — first touch only; later attempts must NEVER clobber the original backup
  if (!blob.content_prev0) blob.content_prev0 = { body: blob.answer || '', gate: liveG.score || 0, savedAt: new Date(now).toISOString() };
  let bodyN = 0; try { const lst = await store.list({ prefix: 'qa-bin/' + id + '-b' }); bodyN = (lst.blobs || []).filter(x => /-b\d+\.jpg$/i.test(x.key)).length; } catch (e) {}
  const imgs = []; for (let i = 1; i <= Math.min(MAX_BODY_IMAGES, bodyN); i++) imgs.push({ alt: question.replace(/\?+$/, '') + ' — figure ' + i });
  const answer = embedImages(t, id, imgs);
  blob.content_prev = blob.answer || ''; blob.answer = answer;
  blob.polished_at = now; blob.gate_score = candScore; blob.quality_score = candScore >= 13 ? 10 : 9; blob.pending = false; blob.updated_at = new Date(now).toISOString(); blob.gk_verified = candScore >= 13; markRecent(blob, now);
  await store.setJSON('answers/' + id + '.json', blob);
  try { const idx = (await store.get('_index.json', { type: 'json', consistency: 'strong' })) || { entries: [] }; const ex = (idx.entries || []).find(e => e && e.id === id); if (ex) { ex.gate_score = candScore; ex.quality_score = blob.quality_score; ex.polished_at = now; ex.pending = false; markRecent(ex, now); await store.setJSON('_index.json', idx); } } catch (e) {}
  return { qid: id, published: true, url: 'https://pulserevops.com/knowledge/' + id, live: liveG.score || 0, cand: candScore, snapshot: 'content_prev0' };
}

// ── TURN-SLOT body image writer (owner 2026-07-21) — multi-pass Last Leg ──────────────────────────
// Writes ONE body image to slot `turn` (qa-bin/<id>-b<turn>.jpg), stamped { turn }. It NEVER writes or
// deletes any other slot, so images from earlier turns are untouchable (turn N owns slot N only). Then
// it re-embeds refs for all filled slots 1..turn into the body (embedImages needs the count, and turns
// are sequential 1,2,3… so slots have no gaps). Unlike publishInternalImages this does NOT overwrite or
// clear the whole set — that is exactly what lets "fill 1 square, come back next turn" accumulate to 6.
async function publishBodySlot(id, buffer, turn) {
 return withEntryLock(id, async () => {   // one machine per page at a time
  const store = theStore();
  if (!buffer || !buffer.length) throw new Error('no image');
  turn = Math.max(1, Math.min(MAX_BODY_IMAGES, parseInt(turn, 10) || 1));
  const now = Date.now();
  let blob = null; try { blob = await store.get('answers/' + id + '.json', { type: 'json', consistency: 'strong' }); } catch (e) {}
  if (!blob) throw new Error('entry not found in blob (' + id + ')');
  const question = blob.question || blob.h1 || '';
  // write ONLY this slot, stamped — prior/other slots are never touched
  await store.set('qa-bin/' + id + '-b' + turn + '.jpg', buffer, { metadata: { src: 'internal', turn } });
  // SLOT-ACCURATE re-embed: scan which slots ACTUALLY exist (1-6) and reference them by their real number,
  // so slot machines can fill out of order / in parallel (b1,b3,b5) without dangling refs. Never sequential-assumes.
  const present = [];
  for (let i = 1; i <= MAX_BODY_IMAGES; i++) { if (i === turn) { present.push(i); continue; } let ex = false; try { const b = await store.get('qa-bin/' + id + '-b' + i + '.jpg', { type: 'arrayBuffer' }); ex = !!(b && b.byteLength > 500); } catch (e) {} if (ex) present.push(i); }
  let stripped = String(blob.answer || '').split('\n').filter(l => !/^!\[[^\]]*\]\([^)]*\)$/.test(l.trim())).join('\n');
  // 🔒 RANKED PAGES: ONE IMAGE PER RANK, AND NO SECOND COPY (owner 2026-07-29 — gm0063 shipped
  // 10 ranks with 16 images). A Top-10 body already references every slot through its own
  // `@@PRODUCT ... img="/assets/qa/<id>-bN.jpg"` line, anchored to the rank it belongs to.
  // Splicing markdown images on top of that duplicates every image AND spreads the copies by
  // PARAGRAPH, so they drift off the item they illustrate. On a ranked page we write the slot
  // file and stop — the @@PRODUCT directive is the placement.
  const isRanked = /^@@PRODUCT\b/m.test(stripped) || (stripped.match(/^##\s+\d+\.\s/gm) || []).length >= 3;
  if (isRanked) {
    blob.answer = stripped;
  } else {
  const lines = stripped.split('\n');
  const picks = imageSlotIndices(lines, present.length);
  const ins = present.map((slot, i) => ({ at: picks[i], md: '\n![' + question.replace(/\?+$/, '') + ' — figure ' + (i + 1) + '](/assets/qa/' + id + '-b' + slot + '.jpg)\n' })).filter(x => x.at != null).sort((a, b) => b.at - a.at);
  for (const x of ins) lines.splice(x.at + 1, 0, x.md);
  blob.answer = lines.join('\n');
  }
  blob.bb_images = true; blob.updated_at = new Date(now).toISOString(); markRecent(blob, now);
  await store.setJSON('answers/' + id + '.json', blob);
  try { const idx = (await store.get('_index.json', { type: 'json', consistency: 'strong' })) || { entries: [] }; const ex = (idx.entries || []).find(e => e && e.id === id); if (ex) { ex.polished_at = now; markRecent(ex, now); await store.setJSON('_index.json', idx); } } catch (e) {}
  return { qid: id, url: 'https://pulserevops.com/knowledge/' + id, turn, count: turn };
 });
}

module.exports = { publishLive, embedImages, nextQid, previewHtml, imageSlotIndices, proveLive, publishContentOnly, publishFaceOnly, publishFaceImageOnly, publishDressingOnly, publishContentBody, publishContentBodyIfBetter, publishInternalImages, publishBodySlot };

