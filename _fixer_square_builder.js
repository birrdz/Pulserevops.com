'use strict';
/**
 * Fixer Square Builder + Internal Builder
 * Black square + title OVER image (CSS) · Pexels click · face+top overwrite ·
 * skeleton slots (Top10 named products / Q&A secs / Style outfits) · Save → green → back of line
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');

const WD = __dirname;
const SIM = path.join(WD, 'sim');
const STATE_F = path.join(SIM, 'square_builder.json');
const QA = path.join(WD, 'assets', 'qa');

try {
  for (const l of fs.readFileSync(path.join(WD, '.env.local'), 'utf8').split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] == null) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}

const PNAMES = {
  tl: 'Pulse Tools', ca: 'Cars', bt: 'Boats', aq: 'Aquariums', ik: 'Industry KPIs',
  tk: 'Tech Stacks', bs: 'Book Summaries', st: 'Sales Trainings', fr: 'Franchises',
  co: 'Collectibles', ai: 'AI Infra', gb: 'Graphics', bo: 'Buildouts', sy: 'Style',
  gp: 'GTM Playbooks', ra: 'Rev Architecture', pt: 'Pets', es: 'Espresso', tv: 'TVs',
  rs: 'Resorts', cl: 'Cologne', lv: 'Lux Vacations', ev: 'Events', ga: 'Gatherings',
  gm: 'Gaming', mv: 'Movies', wl: 'Wellness', dn: 'Dining', nl: 'Nightlife', tn: 'Towns',
  sc: 'Schools', tc: 'Telco', er: 'Electronics', q: 'Q&A', hf: 'Home & Family',
  sw: 'Software', sk: 'Skill Drills', sp: 'Sports', dr: 'Drills', ce: 'Current Events', ed: 'Advice',
};

function readJSON(f, d) {
  try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; }
}
function writeJSON(f, o) {
  fs.writeFileSync(f, JSON.stringify(o, null, 2));
}
function pillarOf(id) {
  const m = String(id || '').match(/^([a-z]+)/i);
  return m ? m[1].toLowerCase() : '';
}
function httpsGet(url, headers) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: headers || {}, timeout: 45000 }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks), ct: res.headers['content-type'] || '' }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}
function json(res, code, obj) {
  res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(obj));
}
function readBody(req) {
  return new Promise((resolve) => {
    let b = '';
    req.on('data', (c) => (b += c));
    req.on('end', () => {
      try { resolve(JSON.parse(b || '{}')); } catch (e) { resolve({}); }
    });
  });
}

function defaultState() {
  return { at: null, current: null, source: 'next30', pillar: null, items: [], drafts: {} };
}
function loadState() {
  const s = readJSON(STATE_F, null) || defaultState();
  if (!Array.isArray(s.items)) s.items = [];
  if (!s.drafts || typeof s.drafts !== 'object') s.drafts = {};
  return s;
}
function saveState(s) {
  s.at = new Date().toISOString();
  writeJSON(STATE_F, s);
}
function firstOpen(s) {
  return (s.items || []).find((x) => !x.done) || null;
}

async function fetchTitle(store, id) {
  try {
    const b = await store.get('answers/' + id + '.json', { type: 'json' });
    return String((b && (b.question || b.h1 || b.title)) || id);
  } catch (e) {
    return id;
  }
}

async function idsFromPillar(store, pillar) {
  const p = String(pillar || '').toLowerCase();
  const idx = await store.get('_index.json', { type: 'json' });
  const ents = ((idx && idx.entries) || []).filter((e) => e && e.id && pillarOf(e.id) === p);
  ents.sort((a, b) => String(a.id).localeCompare(String(b.id), undefined, { numeric: true }));
  return ents.slice(0, 80).map((e) => String(e.id).toLowerCase());
}

function idsFromNext30() {
  const n30 = readJSON(path.join(SIM, 'next30.json'), {});
  if (Array.isArray(n30.ids) && n30.ids.length) return n30.ids.map((x) => String(x).toLowerCase());
  const pri = readJSON(path.join(SIM, 'fix_priority_front.json'), {});
  if (Array.isArray(pri.ids) && pri.ids.length) return pri.ids.map((x) => String(x).toLowerCase());
  return [];
}

function stripEmoji(s) {
  return String(s || '')
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
    .replace(/\bBEST OVERALL\b|\bBEST VALUE\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseTop10Names(body) {
  const names = {};
  const lines = String(body || '').split('\n');
  for (let i = 0; i < lines.length; i++) {
    const hm = lines[i].match(/^##\s+(\d+)\.\s+(.+)$/);
    if (!hm) continue;
    const rank = hm[1];
    let name = stripEmoji(hm[2]);
    for (let j = i + 1; j < lines.length && j <= i + 5; j++) {
      const pm = lines[j].match(/^@@PRODUCT\s+name="([^"]*)"/);
      if (pm && pm[1].trim()) {
        name = stripEmoji(pm[1]);
        break;
      }
      if (/^##\s+\d+\./.test(lines[j])) break;
    }
    names[rank] = name || ('Rank ' + rank);
  }
  return names;
}

function parseOutfitLabels(body) {
  const labels = [];
  const re = /```outfit\r?\n([\s\S]*?)```/g;
  let m;
  let i = 0;
  while ((m = re.exec(String(body || '')))) {
    const inner = m[1] || '';
    const gender = (inner.match(/^gender:\s*(.*)$/im) || [])[1] || '';
    const age = (inner.match(/^age:\s*(.*)$/im) || [])[1] || '';
    const title = (inner.match(/^title:\s*(.*)$/im) || [])[1] || ('Outfit ' + (i + 1));
    labels.push(stripEmoji([gender, age, title].filter(Boolean).join(' · ') || ('Outfit ' + (i + 1))));
    i++;
  }
  while (labels.length < 6) labels.push('Outfit ' + (labels.length + 1));
  return labels.slice(0, 6);
}

function skeletonFor(route, body) {
  const t = (route && route.template) || 'qa';
  if (t === 'top10') {
    const names = parseTop10Names(body);
    const slots = [];
    for (let i = 1; i <= 10; i++) {
      const nm = names[String(i)] || ('#' + i + ' product');
      slots.push({ key: 'rank' + i, label: '#' + i + ' · ' + nm, hint: nm, kind: 'rank' });
    }
    return {
      kind: 'top10',
      label: 'Answer page skeleton · TOP 10',
      slots,
      note: 'Top hero already done (same as face). Grid below = blanks. Click a blank → Pexels → click photo → fills that #.',
    };
  }
  if (t === 'style') {
    const labs = parseOutfitLabels(body);
    const slots = labs.map((lab, i) => ({
      key: 'outfit' + i,
      label: lab,
      hint: lab,
      kind: 'outfit',
    }));
    return {
      kind: 'style',
      label: 'Answer page skeleton · STYLE',
      slots,
      note: 'Top/cover already done (same as face). Outfit blanks below — click → search → fill.',
    };
  }
  return {
    kind: 'qa',
    label: 'Answer page skeleton · Q&A',
    slots: [
      { key: 'sec1', label: 'Section image 1', hint: 'section photo', kind: 'sec' },
      { key: 'sec2', label: 'Section image 2', hint: 'section photo', kind: 'sec' },
    ],
    note: 'Top internal already done (same as face). Two section blanks below — click → search → fill.',
  };
}

async function pexelsSearch(q) {
  const key = process.env.PEXELS_API_KEY || '';
  if (!key) throw new Error('PEXELS_API_KEY missing');
  const query = String(q || '').trim().slice(0, 120) || 'professional photo';
  const { pexelsRequest } = require('./netlify/functions/lib/pexels-throttle');
  const url =
    'https://api.pexels.com/v1/search?per_page=24&orientation=landscape&query=' + encodeURIComponent(query);
  const r = await pexelsRequest(() =>
    httpsGet(url, { Authorization: key, 'User-Agent': 'pulse-square-builder/1.0' })
  );
  if (r.status !== 200) throw new Error('pexels ' + r.status);
  const j = JSON.parse(r.body.toString('utf8'));
  return (j.photos || [])
    .map((p) => ({
      id: String(p.id),
      thumb: p.src && (p.src.medium || p.src.small),
      src: p.src && (p.src.large2x || p.src.large || p.src.original),
      alt: p.alt || query,
      photographer: p.photographer || '',
    }))
    .filter((p) => p.src && p.thumb);
}

async function downloadUrl(url) {
  const r = await httpsGet(url, { 'User-Agent': 'pulse-square-builder/1.0' });
  if (r.status !== 200 || !/^image\//i.test(r.ct)) throw new Error('download fail');
  if (!r.body || r.body.length < 8000) throw new Error('tiny image');
  return r.body;
}

async function writeFaceFiles(id, buf) {
  const { putQaAsset } = require('./_live_qa_asset');
  const faceBuf = await sharp(buf)
    .rotate()
    .resize(1200, 1200, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 86, mozjpeg: true })
    .toBuffer();
  const sqBuf = await sharp(buf)
    .rotate()
    .resize(760, 760, { fit: 'cover', position: 'north' })
    .jpeg({ quality: 86, mozjpeg: true })
    .toBuffer();
  await putQaAsset(String(id) + '.jpg', faceBuf);
  await putQaAsset(String(id) + '.sq.jpg', sqBuf);
  try {
    fs.mkdirSync(QA, { recursive: true });
    fs.writeFileSync(path.join(QA, id + '.jpg'), faceBuf);
    fs.writeFileSync(path.join(QA, id + '.sq.jpg'), sqBuf);
  } catch (e) {}
  return { face: '/assets/qa/' + id + '.jpg', sq: '/assets/qa/' + id + '.sq.jpg' };
}

async function writeSlotFile(id, slotKey, buf) {
  const { putQaAsset } = require('./_live_qa_asset');
  const name = String(id) + '-' + String(slotKey) + '.jpg';
  const jpg = await sharp(buf)
    .rotate()
    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 86, mozjpeg: true })
    .toBuffer();
  await putQaAsset(name, jpg);
  try {
    fs.mkdirSync(QA, { recursive: true });
    fs.writeFileSync(path.join(QA, name), jpg);
  } catch (e) {}
  return '/assets/qa/' + name;
}

function setTopHero(body, title, url) {
  const alt = String(title || '').replace(/[\[\]]/g, '').slice(0, 120) || 'photo';
  const hero = '![' + alt + '](' + url + ')\n\n';
  let s = String(body || '');
  s = s.replace(/^﻿?\s*!\[[^\]]*\]\([^)]+\)\s*\n+/m, '');
  return hero + s;
}

function applySecImage(body, slotIndex, url, label) {
  const lines = String(body || '').split('\n');
  const heads = [];
  for (let i = 0; i < lines.length; i++) {
    if (/^##\s+/.test(lines[i]) && !/^##\s+Direct Answer\b/i.test(lines[i])) heads.push(i);
  }
  const hi = heads[slotIndex - 1];
  const line = '![' + String(label || 'photo').replace(/[\[\]]/g, '').slice(0, 80) + '](' + url + ')';
  if (hi == null) return String(body || '') + '\n\n' + line + '\n';
  let imgLine = -1;
  for (let j = hi + 1; j < lines.length; j++) {
    if (/^##\s+/.test(lines[j])) break;
    if (/^!\[[^\]]*\]\([^)]+\)/.test(lines[j])) {
      imgLine = j;
      break;
    }
  }
  if (imgLine >= 0) lines[imgLine] = line;
  else lines.splice(hi + 1, 0, '', line, '');
  return lines.join('\n').replace(/\n{3,}/g, '\n\n');
}

function applyRankProduct(body, rank, url) {
  const lines = String(body || '').split('\n');
  const re = new RegExp('^##\\s+' + rank + '\\.\\s+', 'i');
  for (let i = 0; i < lines.length; i++) {
    if (!re.test(lines[i])) continue;
    let prod = -1;
    for (let j = i + 1; j < lines.length && j <= i + 6; j++) {
      if (/^@@PRODUCT\b/.test(lines[j])) {
        prod = j;
        break;
      }
      if (/^##\s+\d+\./.test(lines[j])) break;
    }
    if (prod >= 0) {
      const pm = lines[prod].match(/^@@PRODUCT\s+name="([^"]*)"(?:\s+img="[^"]*")?(?:\s+site="([^"]*)")?/);
      const keepName = (pm && pm[1]) || ('Rank ' + rank);
      const keepSite = (pm && pm[2]) || '';
      lines[prod] =
        '@@PRODUCT name="' +
        keepName.replace(/"/g, '') +
        '" img="' +
        url.replace(/"/g, '') +
        '" site="' +
        keepSite.replace(/"/g, '') +
        '"';
    } else {
      lines.splice(i + 1, 0, '@@PRODUCT name="Rank ' + rank + '" img="' + url.replace(/"/g, '') + '" site=""');
    }
    return lines.join('\n');
  }
  return String(body || '') + '\n\n@@PRODUCT name="Rank ' + rank + '" img="' + url.replace(/"/g, '') + '" site=""\n';
}

function applyOutfitImg(body, outfitIndex, url) {
  const blocks = [];
  const re = /```outfit\r?\n([\s\S]*?)```/g;
  let m;
  const s = String(body || '');
  while ((m = re.exec(s))) blocks.push({ start: m.index, end: m.index + m[0].length, inner: m[1] });
  if (!blocks[outfitIndex]) return s;
  let inner = blocks[outfitIndex].inner;
  if (/^img:\s*/m.test(inner)) inner = inner.replace(/^img:\s*.*$/m, 'img: ' + url);
  else inner = 'img: ' + url + '\n' + inner;
  return s.slice(0, blocks[outfitIndex].start) + '```outfit\n' + inner + '```' + s.slice(blocks[outfitIndex].end);
}

async function buildEntryView(store, s, id) {
  const item = (s.items || []).find((x) => x.id === id);
  if (!item) return null;
  let blob = null;
  try {
    blob = await store.get('answers/' + id + '.json', { type: 'json' });
  } catch (e) {}
  const title = String(item.title || (blob && (blob.question || blob.h1)) || id);
  const body = String((s.drafts[id] && s.drafts[id].body != null)
    ? s.drafts[id].body
    : (blob && (blob.answer || blob.body)) || '');
  let route = { template: 'qa', reason: 'default' };
  try {
    route = require('./_pulse_gold_template_router').pickGoldTemplate(id, body, title);
  } catch (e) {}
  if (!route.template) route.template = 'qa';
  const skel = skeletonFor(route, body);
  const draft = s.drafts[id] || { faceUrl: null, sqUrl: null, slots: {}, body: null };
  return {
    id,
    title,
    pillar: item.pillar,
    done: !!item.done,
    template: route.template,
    reason: route.reason,
    skeleton: skel,
    draft,
    liveFace: (blob && blob.img) || null,
  };
}

async function surfacePillar(store, id, title, img, imgSq) {
  try {
    const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
    if (!idx || !Array.isArray(idx.entries)) return;
    let ent = idx.entries.find((x) => x && String(x.id).toLowerCase() === String(id).toLowerCase());
    if (!ent) {
      ent = { id, has_answer: true };
      idx.entries.unshift(ent);
    }
    ent.question = title;
    ent.img = img;
    ent.imgSq = imgSq || img;
    ent.has_answer = true;
    const tags = Array.isArray(ent.tags) ? ent.tags.slice() : [];
    if (!tags.includes('pulse-recent')) tags.push('pulse-recent');
    ent.tags = tags;
    ent.ts = Date.now();
    await store.setJSON('_index.json', idx);
  } catch (e) {}
  try {
    const p = pillarOf(id);
    const mf = path.join(WD, 'mosaic-pool-' + p + '.json');
    let pool = [];
    try {
      pool = JSON.parse(fs.readFileSync(mf, 'utf8'));
    } catch (e2) {
      pool = [];
    }
    if (!Array.isArray(pool)) pool = [];
    pool = pool.filter((x) => String((x && x.id) || x).toLowerCase() !== String(id).toLowerCase());
    pool.unshift({ id, img: imgSq || img, imgSq: imgSq || img, question: title });
    fs.writeFileSync(mf, JSON.stringify(pool.slice(0, 400), null, 2));
  } catch (e) {}
}

function htmlPage() {
  return `<!doctype html><html><head><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1">
<title>Square Builder · Fixer</title>
<style>
*{box-sizing:border-box}
body{margin:0;font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,sans-serif;background:#0e0d0b;color:#f2efe8}
a{color:#F6C445;text-decoration:none}
.wrap{max-width:1180px;margin:0 auto;padding:14px}
.top{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:10px}
.btn{background:#1a1916;border:1px solid #3a3630;color:#f2efe8;border-radius:10px;padding:10px 12px;font-weight:700;cursor:pointer}
.btn.gold{background:#F6C445;color:#111;border-color:#F6C445}
.btn:disabled{opacity:.35;cursor:not-allowed}
select,input{background:#1a1916;border:1px solid #3a3630;border-radius:10px;color:#fff;padding:10px 12px;font-size:14px}
.row{display:flex;gap:8px;overflow-x:auto;padding:8px 0 12px}
.pill{flex:0 0 auto;width:74px;height:74px;border-radius:12px;border:2px solid #333;background:#050505;position:relative;cursor:pointer;overflow:hidden}
.pill.green{background:#0d2a18;border-color:#1a7f4b}
.pill.cur{outline:2px solid #F6C445;outline-offset:2px}
.pill img{width:100%;height:100%;object-fit:cover;opacity:.9}
.pill .t{position:absolute;left:3px;right:3px;bottom:3px;font-size:8px;color:#F6C445;text-shadow:0 1px 2px #000;overflow:hidden;max-height:26px}
.grid{display:grid;grid-template-columns:minmax(240px,340px) 1fr;gap:16px}
@media(max-width:900px){.grid{grid-template-columns:1fr}}
.sq{aspect-ratio:1/1;background:#000;border-radius:16px;position:relative;overflow:hidden;border:1px solid #2a2824}
.sq img.face{width:100%;height:100%;object-fit:cover;display:block}
.sq .scrim{position:absolute;inset:0;background:linear-gradient(transparent 42%,rgba(0,0,0,.85));pointer-events:none}
.sq .chip{position:absolute;top:10px;left:10px;z-index:2;background:rgba(0,0,0,.55);border:1px solid rgba(246,196,69,.5);color:#F6C445;font-size:10px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;padding:4px 8px;border-radius:999px}
.sq .ttl{position:absolute;left:12px;right:12px;bottom:12px;z-index:2;color:#F6C445;font-weight:800;font-size:15px;line-height:1.25;text-shadow:0 2px 10px #000}
.search{display:flex;gap:8px;margin:0 0 10px;flex-wrap:wrap;align-items:center}
.search input{flex:1;min-width:160px}
.zoom{display:flex;gap:6px;align-items:center}
.photos{display:grid;grid-template-columns:repeat(auto-fill,minmax(var(--ph),1fr));gap:8px;max-height:380px;overflow:auto;--ph:120px}
.photos img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:10px;cursor:pointer;border:2px solid transparent}
.photos img:hover{border-color:#F6C445}
.skel{margin-top:16px;padding:14px;border:1px solid #2a2824;border-radius:14px;background:#141310}
.skel h3{margin:0 0 4px;color:#F6C445}
.skel .note{color:#8a8680;font-size:12px;margin-bottom:10px}
.slots{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
.slot{background:#0a0908;border:1px dashed #3a3630;border-radius:12px;min-height:130px;padding:8px;cursor:pointer}
.slot.on{border-style:solid;border-color:#F6C445}
.slot.filled{border-style:solid;border-color:#1a7f4b}
.slot img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:8px}
.panel{display:none;margin-top:14px;padding:14px;border:1px solid #2a2824;border-radius:14px;background:#141310}
.panel.on{display:block}
.panel h3{margin:0 0 8px;color:#F6C445}
.titleBox{width:100%;min-height:70px;background:#0a0908;border:1px solid #3a3630;border-radius:10px;color:#F6C445;font-weight:700;font-size:16px;padding:12px;resize:vertical}
.heroPrev{display:flex;gap:12px;align-items:flex-start;margin-bottom:12px}
.heroPrev img{width:120px;height:120px;object-fit:cover;border-radius:12px;border:1px solid #333}
.steps{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0 12px}
.step{padding:6px 10px;border-radius:999px;border:1px solid #333;font-size:12px;color:#8a8680}
.step.on{border-color:#F6C445;color:#F6C445;font-weight:800}
.step.ok{border-color:#1a7f4b;color:#7dffb0}
.slot .lab{margin-top:6px;font-size:12px;color:#F6C445;font-weight:700;line-height:1.25}
.slot .blankish{aspect-ratio:1;background:#050505;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#555;font-size:13px;font-weight:700;border:1px dashed #333}
.topDone{display:flex;gap:12px;align-items:center;padding:10px;border:1px solid #1a7f4b;border-radius:12px;background:#0d2a18;margin-bottom:12px}
.topDone img{width:88px;height:88px;object-fit:cover;border-radius:10px}
.topDone b{color:#7dffb0}
</style></head><body><div class=wrap>
<div class=top>
  <a class=btn href="/">← Fixer</a>
  <select id=src>
    <option value="next30">NEXT 30 batch</option>
    <option value="pillar">Pillar topic row</option>
  </select>
  <select id=pillar></select>
  <button class="btn gold" id=btnLoad>LOAD ROW</button>
  <button class="btn gold" id=btnSave disabled>SAVE · green → back</button>
  <span id=meta class=status></span>
</div>
<div class=row id=row></div>
<div class=steps>
  <div class=step id=stFace>1 · Face (→ top auto)</div>
  <div class=step id=stTitle>2 · Title YES</div>
  <div class=step id=stInt>3 · Answer skeleton</div>
</div>
<div class=grid>
  <div>
    <div class=sq id=sq>
      <div class=scrim></div>
      <div class=chip id=chip>PILLAR</div>
      <div class=ttl id=ttl>Load a row</div>
    </div>
    <div class=status id=faceHint>Search Pexels → click photo → face + top (same URL).</div>
  </div>
  <div>
    <div class=search>
      <input id=q placeholder="Pexels search…" />
      <button class="btn gold" id=btnPex>PEXELS</button>
      <div class=zoom>
        <button class=btn id=zOut>−</button>
        <button class=btn id=zIn>+</button>
      </div>
    </div>
    <div class=photos id=photos></div>
    <div class=status id=searchStatus></div>
  </div>
</div>

<div class="panel" id=titlePanel>
  <h3>Title screen</h3>
  <div class=note style="color:#8a8680;font-size:12px;margin-bottom:8px">Title auto-populates · sits OVER the photo (not baked in). Hit YES to continue.</div>
  <textarea class=titleBox id=titleEdit readonly></textarea>
  <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap">
    <button class="btn gold" id=btnYesTitle>YES · title looks good</button>
  </div>
</div>

<div class="panel" id=skel>
  <h3 id=skelTitle>Internal answer screen</h3>
  <div class=note id=skelNote style="color:#8a8680;font-size:12px;margin-bottom:10px"></div>
  <div class=heroPrev id=heroPrev></div>
  <div class=slots id=slots></div>
</div>
<div class=err id=err></div>
</div>
<script>
const PNAMES=${JSON.stringify(PNAMES)};
let state=null,view=null,phase='face',activeSlot='face',photos=[],ph=120;
function esc(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
async function api(url,opts){const r=await fetch(url,opts);const j=await r.json().catch(()=>({}));if(!r.ok||j.ok===false)throw new Error(j.error||('HTTP '+r.status));return j;}
function draftPhase(){
  const d=view&&view.draft;
  if(!d||!d.faceUrl) return 'face';
  if(!d.titleOk) return 'title';
  return 'internal';
}
function fillPillars(){
  const sel=document.getElementById('pillar');
  const keys=Object.keys(PNAMES).sort((a,b)=>PNAMES[a].localeCompare(PNAMES[b]));
  sel.innerHTML=keys.map(k=>'<option value="'+k+'">'+esc(PNAMES[k])+' ('+k+')</option>').join('');
}
function syncSrc(){document.getElementById('pillar').disabled=document.getElementById('src').value!=='pillar';}
function setSteps(){
  phase=draftPhase();
  [['stFace','face'],['stTitle','title'],['stInt','internal']].forEach(([id,p])=>{
    const el=document.getElementById(id);
    el.className='step'+(phase===p?' on':'')+((p==='face'&&view&&view.draft&&view.draft.faceUrl)||(p==='title'&&view&&view.draft&&view.draft.titleOk)||(p==='internal'&&view&&view.draft&&view.draft.titleOk)?' ok':'');
  });
  document.getElementById('titlePanel').className='panel'+(phase==='title'?' on':'');
  document.getElementById('skel').className='panel'+(phase==='internal'?' on':'');
  const searchOn=phase==='face'||phase==='internal';
  document.getElementById('q').disabled=!searchOn;
  document.getElementById('btnPex').disabled=!searchOn;
  document.getElementById('faceHint').textContent=phase==='face'
    ?'Search Pexels → click → face card. Top internal auto-uses the same photo.'
    :(phase==='title'?'Title sits OVER the photo (not baked in). Hit YES → answer skeleton.'
      :'Skeleton blanks only. Top already done. Click a blank → search → click photo → fills it.');
  if(phase==='internal'){
    const empty=(view.skeleton&&view.skeleton.slots||[]).find(s=>!(view.draft&&view.draft.slots&&view.draft.slots[s.key]));
    activeSlot=(empty&&empty.key)||(view.skeleton&&view.skeleton.slots[0]&&view.skeleton.slots[0].key)||activeSlot;
  } else if(phase==='face') activeSlot='face';
}
function renderRow(){
  const row=document.getElementById('row');
  if(!state||!state.items){row.innerHTML='';return;}
  row.innerHTML=state.items.map(it=>{
    const cls='pill '+(it.done?'green':'black')+(state.current===it.id?' cur':'');
    const face=(state.drafts&&state.drafts[it.id]&&state.drafts[it.id].faceUrl)||'';
    return '<div class="'+cls+'" data-id="'+esc(it.id)+'" title="'+esc(it.title)+'">'+(face?'<img src="'+esc(face)+'?t='+Date.now()+'" alt="">':'')+'<div class=t>'+esc(it.id)+'</div></div>';
  }).join('');
  row.querySelectorAll('.pill').forEach(el=>el.onclick=()=>selectId(el.dataset.id));
}
function paintSquare(){
  const sq=document.getElementById('sq');
  const draft=view&&view.draft;
  const face=(draft&&draft.faceUrl)||(view&&view.liveFace)||'';
  const pillar=(view&&view.pillar)||'';
  const title=(draft&&draft.title)||(view&&view.title)||'—';
  document.getElementById('chip').textContent=(PNAMES[pillar]||pillar||'PILLAR').toUpperCase();
  document.getElementById('ttl').textContent=title;
  document.getElementById('titleEdit').value=title;
  let img=sq.querySelector('img.face');
  if(face){if(!img){img=document.createElement('img');img.className='face';sq.insertBefore(img,sq.firstChild);}img.src=face+'?t='+Date.now();}
  else if(img) img.remove();
  document.getElementById('meta').textContent=view?(view.id+' · '+String(view.template).toUpperCase()+(view.done?' · DONE':'')):'';
  document.getElementById('btnSave').disabled=!(view&&draft&&draft.faceUrl&&draft.titleOk&&!view.done);
  const hp=document.getElementById('heroPrev');
  if(face) hp.innerHTML='<div class=topDone><img src="'+esc(face)+'?t='+Date.now()+'" alt="top"><div><b>✓ Top internal DONE</b><div class=status>Copied from face card (same URL). You only fill the blanks below.</div></div></div>';
  else hp.innerHTML='';
  setSteps();
  renderSkeleton();
}
function renderSkeleton(){
  if(phase!=='internal'||!view||!view.skeleton){document.getElementById('slots').innerHTML='';return;}
  document.getElementById('skelTitle').textContent=view.skeleton.label||'Answer page skeleton';
  document.getElementById('skelNote').textContent=view.skeleton.note||'';
  const draft=view.draft||{slots:{}};
  document.getElementById('slots').innerHTML=(view.skeleton.slots||[]).map(s=>{
    const u=(draft.slots&&draft.slots[s.key])||'';
    const cls='slot'+(activeSlot===s.key?' on':'')+(u?' filled':'');
    return '<div class="'+cls+'" data-slot="'+esc(s.key)+'" data-hint="'+esc(s.hint||s.label)+'">'+(u?'<img src="'+esc(u)+'?t='+Date.now()+'" alt="">':'<div class=blankish>blank</div>')+'<div class=lab>'+esc(s.label)+'</div></div>';
  }).join('');
  document.querySelectorAll('.slot').forEach(el=>{
    el.onclick=()=>{
      activeSlot=el.dataset.slot;
      document.getElementById('q').value=el.dataset.hint||'';
      renderSkeleton();
      document.getElementById('searchStatus').textContent='Filling '+el.querySelector('.lab').textContent;
    };
  });
}
async function refresh(){const j=await api('/api/square/state');state=j.state;view=j.view;renderRow();paintSquare();}
async function selectId(id){const j=await api('/api/square/select',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})});state=j.state;view=j.view;activeSlot='face';renderRow();paintSquare();}
async function loadQueue(){
  document.getElementById('err').textContent='';
  try{
    const j=await api('/api/square/load',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({force:true,source:document.getElementById('src').value,pillar:document.getElementById('pillar').value})});
    state=j.state;view=j.view;activeSlot='face';renderRow();paintSquare();
  }catch(e){document.getElementById('err').textContent=e.message;}
}
function setZoom(d){ph=Math.max(72,Math.min(220,ph+d));document.getElementById('photos').style.setProperty('--ph',ph+'px');}
async function search(){
  if(phase!=='face'&&phase!=='internal'){document.getElementById('searchStatus').textContent='Hit YES on title first.';return;}
  document.getElementById('err').textContent='';
  const q=document.getElementById('q').value.trim();
  if(!q){document.getElementById('searchStatus').textContent='Type a search.';return;}
  document.getElementById('searchStatus').textContent='Searching Pexels…';
  try{
    const j=await api('/api/square/pexels?q='+encodeURIComponent(q));
    photos=j.photos||[];
    document.getElementById('photos').innerHTML=photos.map((p,i)=>'<img data-i="'+i+'" src="'+esc(p.thumb)+'" alt="">').join('');
    document.getElementById('searchStatus').textContent=photos.length+' · click → '+(phase==='face'?'face+top':activeSlot);
    document.querySelectorAll('#photos img').forEach(img=>{img.onclick=()=>applyPhoto(photos[+img.dataset.i]);});
  }catch(e){document.getElementById('err').textContent=e.message;}
}
async function applyPhoto(p){
  if(!view||!p)return;
  if(phase==='title'){document.getElementById('searchStatus').textContent='Title screen — hit YES';return;}
  const slot=phase==='face'?'face':(activeSlot||'face');
  document.getElementById('searchStatus').textContent='Writing /assets/qa …';
  try{
    const j=await api('/api/square/apply',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:view.id,slot,src:p.src})});
    state=j.state;view=j.view;
    if(slot==='face') activeSlot='face';
    renderRow();paintSquare();
    document.getElementById('searchStatus').textContent=slot==='face'?'Face + top set · title screen next':'Applied to '+slot;
    document.getElementById('photos').innerHTML='';
  }catch(e){document.getElementById('err').textContent=e.message;}
}
async function yesTitle(){
  if(!view)return;
  try{
    const j=await api('/api/square/title-yes',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:view.id,title:document.getElementById('titleEdit').value})});
    state=j.state;view=j.view;
    if(view.skeleton&&view.skeleton.slots[0]) activeSlot=view.skeleton.slots[0].key;
    renderRow();paintSquare();
    document.getElementById('searchStatus').textContent='Internal skeleton — fill blanks';
  }catch(e){document.getElementById('err').textContent=e.message;}
}
async function save(){
  try{
    const j=await api('/api/square/save',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:view.id})});
    state=j.state;view=j.view;activeSlot='face';renderRow();paintSquare();
    document.getElementById('searchStatus').textContent='Saved green · next square';
  }catch(e){document.getElementById('err').textContent=e.message;}
}
fillPillars();syncSrc();
document.getElementById('src').onchange=syncSrc;
document.getElementById('btnLoad').onclick=loadQueue;
document.getElementById('btnPex').onclick=search;
document.getElementById('btnSave').onclick=save;
document.getElementById('btnYesTitle').onclick=yesTitle;
document.getElementById('zIn').onclick=()=>setZoom(20);
document.getElementById('zOut').onclick=()=>setZoom(-20);
document.getElementById('q').addEventListener('keydown',e=>{if(e.key==='Enter')search();});
refresh().catch(e=>{document.getElementById('err').textContent=e.message;});
</script></body></html>`;
}

async function handleSquareRoutes(req, res, u, store) {
  const p = u.pathname;
  if (p === '/square' || p === '/square/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(htmlPage());
    return true;
  }
  if (p === '/api/square/state') {
    const s = loadState();
    if (!s.items.length) {
      const ids = idsFromNext30();
      for (const id of ids) {
        s.items.push({ id, title: await fetchTitle(store, id), pillar: pillarOf(id), done: false });
      }
      s.source = 'next30';
      s.current = firstOpen(s)?.id || null;
      saveState(s);
    }
    const cur = s.current || firstOpen(s)?.id;
    json(res, 200, { ok: true, state: s, view: cur ? await buildEntryView(store, s, cur) : null, pillars: PNAMES });
    return true;
  }
  if (p === '/api/square/load' && req.method === 'POST') {
    const body = await readBody(req);
    const s = defaultState();
    s.source = body.source === 'pillar' ? 'pillar' : 'next30';
    s.pillar = body.pillar ? String(body.pillar).toLowerCase() : null;
    let ids = [];
    if (s.source === 'pillar' && s.pillar) ids = await idsFromPillar(store, s.pillar);
    else ids = idsFromNext30();
    for (const id of ids) {
      s.items.push({ id, title: await fetchTitle(store, id), pillar: pillarOf(id), done: false });
    }
    s.current = firstOpen(s)?.id || null;
    saveState(s);
    json(res, 200, { ok: true, state: s, view: s.current ? await buildEntryView(store, s, s.current) : null });
    return true;
  }
  if (p === '/api/square/select' && req.method === 'POST') {
    const body = await readBody(req);
    const s = loadState();
    const id = String(body.id || '').toLowerCase();
    if (!(s.items || []).some((x) => x.id === id)) return json(res, 400, { ok: false, error: 'id not in row' }), true;
    s.current = id;
    saveState(s);
    json(res, 200, { ok: true, state: s, view: await buildEntryView(store, s, id) });
    return true;
  }
  if (p === '/api/square/pexels') {
    try {
      json(res, 200, { ok: true, photos: await pexelsSearch(u.searchParams.get('q') || '') });
    } catch (e) {
      json(res, 500, { ok: false, error: String(e.message || e) });
    }
    return true;
  }
  if (p === '/api/square/apply' && req.method === 'POST') {
    try {
      const body = await readBody(req);
      const id = String(body.id || '').toLowerCase();
      const slot = String(body.slot || 'face');
      const src = String(body.src || '');
      if (!id || !src) return json(res, 400, { ok: false, error: 'id+src required' }), true;
      const s = loadState();
      const item = (s.items || []).find((x) => x.id === id);
      if (!item) return json(res, 400, { ok: false, error: 'id not in row' }), true;
      const buf = await downloadUrl(src);
      if (!s.drafts[id]) s.drafts[id] = { faceUrl: null, sqUrl: null, slots: {}, body: null };
      const draft = s.drafts[id];
      let blob = (await store.get('answers/' + id + '.json', { type: 'json' })) || { id, question: item.title, answer: '' };
      let docBody = draft.body != null ? draft.body : String(blob.answer || blob.body || '');
      const title = item.title;
      if (slot === 'face') {
        const wrote = await writeFaceFiles(id, buf);
        draft.faceUrl = wrote.face;
        draft.sqUrl = wrote.sq;
        // LAW: face card → top internal same URL on EVERY page (Q&A / Top10 / Style)
        docBody = setTopHero(docBody, title, wrote.face);
        draft.body = docBody;
      } else if (/^sec\d+$/.test(slot)) {
        const n = parseInt(slot.replace('sec', ''), 10) || 1;
        const url = await writeSlotFile(id, slot, buf);
        draft.slots[slot] = url;
        draft.body = applySecImage(docBody, n, url, title);
      } else if (/^rank\d+$/.test(slot)) {
        const n = parseInt(slot.replace('rank', ''), 10) || 1;
        const url = await writeSlotFile(id, slot, buf);
        draft.slots[slot] = url;
        draft.body = applyRankProduct(docBody, n, url);
      } else if (/^outfit\d+$/.test(slot)) {
        const n = parseInt(slot.replace('outfit', ''), 10) || 0;
        const url = await writeSlotFile(id, slot, buf);
        draft.slots[slot] = url;
        draft.body = applyOutfitImg(docBody, n, url);
      } else return json(res, 400, { ok: false, error: 'bad slot' }), true;
      s.drafts[id] = draft;
      s.current = id;
      saveState(s);
      json(res, 200, { ok: true, applied: slot, state: s, view: await buildEntryView(store, s, id) });
    } catch (e) {
      json(res, 500, { ok: false, error: String(e.message || e) });
    }
    return true;
  }
  if (p === '/api/square/title-yes' && req.method === 'POST') {
    try {
      const body = await readBody(req);
      const id = String(body.id || '').toLowerCase();
      const s = loadState();
      const item = (s.items || []).find((x) => x.id === id);
      if (!item) return json(res, 400, { ok: false, error: 'id not in row' }), true;
      if (!s.drafts[id]) s.drafts[id] = { faceUrl: null, sqUrl: null, slots: {}, body: null };
      const draft = s.drafts[id];
      if (!draft.faceUrl) return json(res, 400, { ok: false, error: 'set face first' }), true;
      if (body.title) {
        const t = String(body.title).trim();
        if (t) {
          item.title = t;
          draft.title = t;
        }
      }
      draft.titleOk = true;
      let docBody = draft.body != null ? draft.body : '';
      if (!docBody) {
        try {
          const blob = await store.get('answers/' + id + '.json', { type: 'json' });
          docBody = String((blob && (blob.answer || blob.body)) || '');
        } catch (e) {}
      }
      docBody = setTopHero(docBody, item.title || id, draft.faceUrl);
      draft.body = docBody;
      s.drafts[id] = draft;
      s.current = id;
      saveState(s);
      json(res, 200, { ok: true, state: s, view: await buildEntryView(store, s, id) });
    } catch (e) {
      json(res, 500, { ok: false, error: String(e.message || e) });
    }
    return true;
  }
  if (p === '/api/square/save' && req.method === 'POST') {
    try {
      const body = await readBody(req);
      const id = String(body.id || '').toLowerCase();
      const s = loadState();
      const item = (s.items || []).find((x) => x.id === id);
      const draft = s.drafts[id];
      if (!item || !draft || !draft.faceUrl) return json(res, 400, { ok: false, error: 'need face before save' }), true;
      let blob = (await store.get('answers/' + id + '.json', { type: 'json' })) || { id };
      const title = draft.title || item.title || blob.question || id;
      let answer = draft.body != null ? draft.body : blob.answer || blob.body || '';
      const img = draft.faceUrl;
      const imgSq = draft.sqUrl || draft.faceUrl;
      answer = setTopHero(answer, title, img);
      await store.setJSON('answers/' + id + '.json', Object.assign({}, blob, {
        question: title,
        h1: blob.h1 || title,
        answer,
        img,
        imgSq,
        face_title_baked: false,
        square_builder_lock: true,
        updated_at: new Date().toISOString(),
        square_builder_at: new Date().toISOString(),
      }));
      await surfacePillar(store, id, title, img, imgSq);
      try {
        require('./_fixer_workshop').markWorkshopSaved(id, { kind: 'square', score: null });
      } catch (e) {}
      item.done = true;
      s.items = (s.items || []).filter((x) => x.id !== id).concat([item]);
      const next = firstOpen(s);
      s.current = next ? next.id : item.id;
      saveState(s);
      json(res, 200, { ok: true, state: s, view: s.current ? await buildEntryView(store, s, s.current) : null });
    } catch (e) {
      json(res, 500, { ok: false, error: String(e.message || e) });
    }
    return true;
  }
  return false;
}

module.exports = { handleSquareRoutes };
