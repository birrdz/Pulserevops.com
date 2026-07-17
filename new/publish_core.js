// new/publish_core.js — shared "publish a finished 5/5 entry LIVE via blob (NO deploy)".
// Used by both the CLI (publish_live.js) and the Block Builder's Publish button (/api/publish).
// Writes face + body images to qa-bin/, embeds body images in block-block-image rhythm,
// writes answers/<qid>.json, upserts _index.json (pulse-recent + pillar tag, fresh ts).
'use strict';
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
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
function embedImages(body, qid, imgs) {
  // 🔒 RE-PUBLISH DEDUP (2026-07-16): strip any body images already embedded for
  // THIS qid on a prior publish, so a second pass REPLACES the set instead of
  // appending a duplicate of every slot. This was the root cause of the stacked /
  // "mirrored" images (b1/b2/b3 rendered twice while b4-b6 rendered once).
  const qesc = String(qid).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const dupRe = new RegExp('^!\\[[^\\]]*\\]\\(/assets/qa/' + qesc + '-b\\d+\\.jpg\\)\\s*$');
  body = String(body || '').split('\n').filter(l => !dupRe.test(l.trim())).join('\n');
  if (!imgs.length) return body;
  const lines = body.split('\n');
  const picks = imageSlotIndices(lines, imgs.length);
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
  try { const lst = await store.list({ prefix: 'qa-bin/' + qid + '-b' }); bodyN = (lst.blobs || []).filter(x => /-b\d\.jpg$/i.test(x.key)).length; } catch (e) {}
  const imgs = []; for (let i = 1; i <= Math.min(6, bodyN); i++) imgs.push({ alt: question.replace(/\?+$/, '') + ' — figure ' + i });
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
  let bodyN = 0; try { const lst = await store.list({ prefix: 'qa-bin/' + qid + '-b' }); bodyN = (lst.blobs || []).filter(x => /-b\d\.jpg$/i.test(x.key)).length; } catch (e) {}
  const imgs = []; for (let i = 1; i <= Math.min(6, bodyN); i++) imgs.push({ alt: question.replace(/\?+$/, '') + ' — figure ' + i });
  const answer = (entry.format === 'top10') ? entry.body : embedImages(entry.body, qid, imgs);
  let blob = null; try { blob = await store.get('answers/' + qid + '.json', { type: 'json', consistency: 'strong' }); } catch (e) {}
  if (!blob) blob = { id: qid, tags: ['revops', 'revops-500', 'pulse-recent'], sources: [], ts: now, model: 'claude-opus-4-8', format_v: '2026-07', cover_src: 'blockbuilder', gold_format: true, gk_verified: true, built_by: 'block-builder', built_from: id };
  blob.question = question; blob.h1 = question; blob.answer = answer; blob.img = '/assets/qa/' + qid + ver + '.jpg'; blob.polished_at = now; blob.gate_score = 13; blob.quality_score = 10; blob.pending = false; blob.updated_at = new Date(now).toISOString();
  await store.setJSON('answers/' + qid + '.json', blob);
  // UPDATE the index entry's img to the versioned URL (existing entry) or INSERT it (new) — the renderer + mosaic read idxEntry.img.
  try { const idx = (await store.get('_index.json', { type: 'json', consistency: 'strong' })) || { entries: [] }; idx.entries = idx.entries || []; const ex = idx.entries.find(e => e && e.id === qid); if (ex) { ex.img = blob.img; ex.polished_at = now; ex.pending = false; if (!ex.ts) ex.ts = now; if (!ex.title) ex.title = question; } else { idx.entries.unshift({ id: qid, question, tags: blob.tags, quality_score: 10, gate_score: 13, format_v: '2026-07', pending: false, ts: now, polished_at: now, img: blob.img, was_indexed_at: now, title: question }); } await store.setJSON('_index.json', idx); } catch (e) {}
  return { qid, url: 'https://pulserevops.com/knowledge/' + qid };
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
  // repoint the answers blob img ONLY — preserve the entire body/answer untouched.
  let blob = null; try { blob = await store.get('answers/' + id + '.json', { type: 'json', consistency: 'strong' }); } catch (e) {}
  if (blob) { blob.img = img; blob.updated_at = new Date(now).toISOString(); await store.setJSON('answers/' + id + '.json', blob); }
  // update the index entry img (create-or-update) so the renderer + homepage tile read the versioned URL.
  try {
    const idx = (await store.get('_index.json', { type: 'json', consistency: 'strong' })) || { entries: [] };
    idx.entries = idx.entries || [];
    const ex = idx.entries.find(e => e && e.id === id);
    const question = (blob && (blob.question || blob.h1)) || meta.title || (ex && ex.title) || id;
    if (ex) { ex.img = img; ex.polished_at = now; if (!ex.ts) ex.ts = now; if (!ex.title) ex.title = question; }
    else { idx.entries.unshift({ id, question, img, ts: now, polished_at: now, title: question, pending: false }); }
    await store.setJSON('_index.json', idx);
  } catch (e) {}
  return { qid: id, url: 'https://pulserevops.com/knowledge/' + id };
}

module.exports = { publishLive, embedImages, nextQid, previewHtml, imageSlotIndices, proveLive, publishContentOnly, publishFaceOnly, publishFaceImageOnly };
