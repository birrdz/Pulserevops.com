// new/blockbuilder.js — THE BLOCK BUILDER (2026-07-15). Clean-room. Owner-driven, Pexels-linked.
// Flow: search Pexels → click image = ID (auto title, editable text+font) → Save →
// pick Essay or Top-10 → pick 3 (essay) or 10 (top-10) body images → publish → recents + pillar.
// Titles are HTML overlay data (NEVER baked into the JPG). Images are clean static files.
'use strict';
const http = require('http');
const fs = require('fs');
const https = require('https');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const PEXELS = process.env.PEXELS_API_KEY;
const PORT = parseInt(process.env.BB_PORT || '8921', 10);
const OUT = __dirname + '/output';
const ENTRIES = __dirname + '/entries';
const BANK = __dirname + '/imagebank';   // reusable CRO image library (face = unique, body = any)
const bankApproved = () => { try { return JSON.parse(fs.readFileSync(BANK + '/_approved.json', 'utf8')); } catch (e) { return []; } };
const usedFaces = () => { try { return new Set(JSON.parse(fs.readFileSync(BANK + '/_used_faces.json', 'utf8'))); } catch (e) { return new Set(); } };
const markFaceUsed = id => { try { const s = usedFaces(); s.add(id); fs.writeFileSync(BANK + '/_used_faces.json', JSON.stringify(Array.from(s))); } catch (e) {} };
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(ENTRIES, { recursive: true });
const QF = __dirname + '/gen_queue.json';
let claudeChat = null; try { ({ claudeChat } = require('../_claude_chat')); } catch (e) {}
let dsChat = null; try { ({ dsChat } = require('../_ds_lib')); } catch (e) {}
const parseTitles = t => String(t || '').split('\n').map(l => l.replace(/^\s*\d+[).\].:]?\s*/, '').replace(/^[-*•]\s*/, '').replace(/^["'`]|["'`]$/g, '').trim()).filter(Boolean);
async function genTitles(theme, count, format) {
  const shape = format === 'top10' ? '"Top 10 <specific thing>" list titles (never Top 20/50/100)' : 'natural Q&A question titles, each ending in "?"';
  const sys = 'You output ONLY a plain list of page titles, one per line — no numbering, no commentary, no quotes.';
  const user = 'Draft ' + count + ' DISTINCT, specific ' + shape + ' about: "' + theme + '". Each a real title a reader would search. Vary the angle. End in the year the theme implies where relevant. One per line.';
  let lines = [];
  try { if (claudeChat) { const r = await claudeChat([{ role: 'system', content: sys }, { role: 'user', content: user }], { timeoutMs: 120000 }); const t = typeof r === 'string' ? r : (r && (r.content || r.text)) || ''; lines = parseTitles(t); } } catch (e) {}
  if (!lines.length && dsChat) { try { const r = await dsChat([{ role: 'system', content: sys }, { role: 'user', content: user }], { max_tokens: 900, temperature: 1.0 }); lines = parseTitles((r && r.content) || ''); } catch (e) {} }
  // shape guard: essay = questions, top10 = "Top 10 ..."
  return lines.filter(t => format === 'top10' ? /^top\s*10\b/i.test(t) : /\?\s*$/.test(t) || /^(how|what|why|is|are|should|when|which|can|do|does|will)\b/i.test(t)).slice(0, count);
}

// Pull the TRUE ranked names (#1..#10) straight from the article the pipeline already wrote.
async function extractTop10Names(question, body) {
  const sys = 'You extract the ranked Top 10 from an article. Output ONLY a JSON array of exactly 10 short real names (brand / org / product / school / color / whatever the list ranks), ranked best first, taken verbatim from the article. No commentary, no numbering — just the JSON array of 10 strings.';
  const user = 'TITLE: ' + question + '\n\nARTICLE:\n' + String(body || '').slice(0, 7000) + '\n\nReturn the JSON array of the 10 ranked names.';
  let t = '';
  try { if (claudeChat) { const r = await claudeChat([{ role: 'system', content: sys }, { role: 'user', content: user }], { timeoutMs: 60000 }); t = typeof r === 'string' ? r : (r && (r.content || r.text)) || ''; } } catch (e) {}
  if (!t && dsChat) { try { const r = await dsChat([{ role: 'system', content: sys }, { role: 'user', content: user }], { max_tokens: 400, temperature: 0.2 }); t = (r && r.content) || ''; } catch (e) {} }
  try { const mm = t.match(/\[[\s\S]*\]/); if (mm) { const arr = JSON.parse(mm[0]); if (Array.isArray(arr)) return arr.slice(0, 10).map(s => String(s).replace(/^\d+[.)]\s*/, '').trim().slice(0, 60)); } } catch (e) {}
  return [];
}
// Complementary per-slot searches (owner 2026-07-15): cover = the whole subject; body images = DIFFERENT
// facets that complement it (resort → pool, restaurant, kids area) — never the same shot repeated.
async function genSlotQueries(question, n) {
  const sys = 'You output ONLY a JSON array of ' + n + ' DISTINCT 2-4 word concrete-noun photo search queries for the Q&A titled below. They must COMPLEMENT each other showing DIFFERENT facets/angles of the topic — never the same subject twice. Concrete, photographable nouns only. No commentary.';
  const user = 'TITLE: ' + question + '\n\nReturn the JSON array of ' + n + ' distinct complementary image queries (a reader flipping through should see variety).';
  let t = '';
  try { if (claudeChat) { const r = await claudeChat([{ role: 'system', content: sys }, { role: 'user', content: user }], { timeoutMs: 40000 }); t = typeof r === 'string' ? r : (r && (r.content || r.text)) || ''; } } catch (e) {}
  if (!t && dsChat) { try { const r = await dsChat([{ role: 'system', content: sys }, { role: 'user', content: user }], { max_tokens: 200, temperature: 0.6 }); t = (r && r.content) || ''; } catch (e) {} }
  try { const mm = t.match(/\[[\s\S]*\]/); if (mm) { const arr = JSON.parse(mm[0]); if (Array.isArray(arr)) return arr.slice(0, n).map(s => String(s).replace(/^\d+[.)]\s*/, '').trim().slice(0, 40)); } } catch (e) {}
  return [];
}
// The core product a top-10 ranks (so "2012" → "2012 Honda Accord", not just "2012").
// "Top 10 Honda Accord Model Years for a College Freshman in 2026" → "Honda Accord".
function topicSubject(q) {
  let s = String(q || '').replace(/^\s*top\s*\d+\s*/i, '');
  s = s.replace(/\b(model years?|by (the )?year|by model year|ranked|best|worst)\b/ig, '');
  s = s.replace(/\bfor\b[\s\S]*$/i, '').replace(/\bin\s+20\d{2}[\s\S]*$/i, '').replace(/\bon a budget\b/ig, '');
  return s.replace(/\s{2,}/g, ' ').trim();
}
const pexSearch = q => new Promise(res => { https.get('https://api.pexels.com/v1/search?per_page=15&orientation=landscape&query=' + encodeURIComponent(q || 'business'), { headers: { Authorization: PEXELS } }, r => { let s = ''; r.on('data', d => s += d); r.on('end', () => { try { res(JSON.parse(s)); } catch (e) { res(null); } }); }).on('error', () => res(null)); });
const dl = url => new Promise(res => { https.get(url, r => { if (r.statusCode !== 200) { r.resume(); return res(null); } const c = []; r.on('data', d => c.push(d)); r.on('end', () => res(Buffer.concat(c))); }).on('error', () => res(null)); });
// NEON TRIM (owner 2026-07-15): every NEW ID gets a random neon frame — green / yellow / pink / purple.
// Old per-pillar trims are legacy. Baked into the image so it shows in hero, thumbnails, and the mosaic.
let sharp = null; try { sharp = require('sharp'); } catch (e) {}
// STATUS TRIM (owner 2026-07-15): PINK = brand-new entry · GREEN = a fixer (used to suck, now 11-13).
// New AND fixed both get HOT PINK (owner 2026-07-16) — "ours" = pink; everything else = charcoal.
const TRIM = { new: { name: 'hotpink', hex: '#FF1493' }, fix: { name: 'fixed', hex: '#FF1493' } };
async function neonFrame(buf, kind) {
  const c = TRIM[kind] || TRIM.new;
  if (!sharp || !buf) return { buf, trim: c.name };
  try {
    // Clean 16:9 cover — NO baked frame. The hot-pink exterior comes from the CSS card border now
    // (all 4 sides, can't crop). We still return the trim NAME so the entry is tagged "ours".
    const out = await sharp(buf).resize(1200, 675, { fit: 'cover', position: 'centre' }).jpeg({ quality: 88 }).toBuffer();
    return { buf: out, trim: c.name };
  } catch (e) { return { buf, trim: c.name }; }
}
const readMeta = id => { try { return JSON.parse(fs.readFileSync(OUT + '/' + id + '/meta.json', 'utf8')); } catch (e) { return null; } };
const writeMeta = (id, m) => { fs.mkdirSync(OUT + '/' + id, { recursive: true }); fs.writeFileSync(OUT + '/' + id + '/meta.json', JSON.stringify(m, null, 1)); };

const PAGE = `<!doctype html><meta name=viewport content="width=device-width,initial-scale=1">
<title>Block Builder</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#0d0d10;color:#e8e6e1;font-family:system-ui,Arial;padding:16px;max-width:920px;margin:auto}
h1{font-size:20px;margin:0 0 2px}.sub{color:#8a8680;font-size:13px;margin-bottom:14px}
.steps{display:flex;gap:6px;margin-bottom:14px}.step{flex:1;text-align:center;padding:7px;border-radius:8px;background:#17171c;border:1px solid #26262e;font-size:12px;font-weight:700;color:#8a8680}
.step.on{background:#1b2a1b;border-color:#22c55e;color:#7CFFA0}.step.done{color:#7CFFA0}
input,button,select{font-size:15px;padding:9px 11px;border-radius:8px;border:1px solid #2a2a32;background:#17171c;color:#e8e6e1}
button{background:#26262e;font-weight:700;cursor:pointer}button:hover{background:#33333d}button.go{background:#1e6f3a}button.go:hover{background:#238045}
.row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:10px 0}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px}
.cand{border:2px solid transparent;border-radius:8px;overflow:hidden;cursor:pointer;background:#000}.cand img{width:100%;height:95px;object-fit:cover;display:block}.cand:hover{border-color:#F6C445}
.fc{position:relative;max-width:520px;border-radius:10px;overflow:hidden;border:1px solid #2a2a32}
.fc img{width:100%;display:block}.fc .t{position:absolute;left:0;bottom:0;padding:16px;width:100%;color:#fff;text-shadow:0 2px 8px #000;font-weight:800;font-size:30px;line-height:1.1;background:linear-gradient(transparent,rgba(0,0,0,.6))}
.slot{border:1px dashed #3a3a42;border-radius:8px;height:95px;display:flex;align-items:center;justify-content:center;color:#8a8680;font-weight:800;background:#101013;overflow:hidden;position:relative}
.slot img{width:100%;height:100%;object-fit:cover}.slot .n{position:absolute;top:4px;left:6px;background:#000a;padding:1px 6px;border-radius:6px;font-size:12px}
.hide{display:none}.ok{color:#7CFFA0}.stat{color:#8a8680;font-size:13px;margin:8px 0}
.dash{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}
.card{flex:1;min-width:110px;background:#141419;border:1px solid #26262e;border-radius:10px;padding:11px 13px}
.card b{display:block;font-size:26px;font-weight:800}.card span{color:#8a8680;font-size:11px;text-transform:uppercase;letter-spacing:.04em}
.card.e b{color:#7Cc0FF}.card.t b{color:#F6C445}.card.w b{color:#e8e6e1}.card.b b{color:#f59e0b}.card.d b{color:#22c55e}
.pe{background:#141419;border:1px solid #26262e;border-radius:9px;padding:9px 12px;margin:6px 0}
.pe .pq{font-weight:700;font-size:14px}.pe .chips{display:flex;gap:5px;margin-top:6px;flex-wrap:wrap}
.chip{padding:3px 9px;border-radius:5px;font-size:12px;font-weight:800;background:#2a2a32;color:#8a8680}
.chip.done{background:#22c55e;color:#062b13}.chip.active{background:#F6C445;color:#241c00}.chip.failed{background:#7f1020;color:#fff}
.topbar{position:sticky;top:0;z-index:20;display:flex;gap:8px;align-items:center;background:#0d0d10;padding:10px 0;border-bottom:1px solid #26262e;margin-bottom:10px}
.topbar .go{font-size:17px;padding:13px 22px}.ghost{background:#17171c}
.bstat{color:#8a8680;font-size:12px;flex:1;text-align:right}
.slotlabel{font-size:11px;color:#8a8680;font-weight:800;text-transform:uppercase;letter-spacing:.05em;margin:14px 0 5px}
.idbox{position:relative;border-radius:12px;overflow:hidden;border:2px dashed #F6C445;min-height:180px;background:#161206;display:flex;align-items:center;justify-content:center;cursor:pointer}
.idbox img{width:100%;display:block}.idph{color:#F6C445;font-weight:800;font-size:16px}
.facetitle{position:absolute;left:0;bottom:0;width:100%;padding:16px;color:#fff;text-shadow:0 2px 8px #000;font-weight:800;font-size:26px;line-height:1.12;background:linear-gradient(transparent,rgba(0,0,0,.65));pointer-events:none}
.previewbody h3{font-size:19px;margin:18px 0 6px}.previewbody h4{font-size:15px;margin:14px 0 5px;color:#c9c6bf}
.previewbody p{font-size:14px;line-height:1.6;color:#cfccc5;margin:8px 0}.previewbody li{font-size:14px;color:#cfccc5;margin:4px 0 4px 18px}
.previewbody .diag{color:#8a8680;font-size:12px;border:1px dashed #2a2a32;border-radius:8px;padding:8px;text-align:center;margin:10px 0}
.imgslot{border:2px dashed #F6C445;border-radius:12px;min-height:150px;display:flex;align-items:center;justify-content:center;color:#F6C445;font-weight:800;background:#161206;cursor:pointer;margin:14px 0;overflow:hidden;background-size:cover;background-position:center}
.imgslot.filled{border-style:solid;border-color:#22c55e}
.t10row{display:flex;gap:8px;align-items:stretch;margin:8px 0}
.t10row .num{width:28px;display:flex;align-items:center;justify-content:center;font-weight:800;color:#F6C445;font-size:18px}
.t10row input{flex:1;min-width:0}.t10box{width:104px;height:70px;border:2px dashed #F6C445;border-radius:8px;background:#161206;background-size:cover;background-position:center;cursor:pointer;flex-shrink:0}
.t10box.filled{border-style:solid;border-color:#22c55e}
.picker{position:fixed;left:0;right:0;bottom:0;max-height:66vh;overflow:auto;background:#0f0f13;border-top:2px solid #F6C445;border-radius:16px 16px 0 0;padding:12px;z-index:40;box-shadow:0 -8px 30px #000a;max-width:920px;margin:auto}
.pickhdr{display:flex;gap:6px;position:sticky;top:0;background:#0f0f13;padding-bottom:8px}.pickhdr input{flex:1}
.cand{position:relative}.cand.rec{border:3px solid #FF1493}
.cand.picked{border:3px solid #22c55e}
.recbadge{position:absolute;top:4px;left:4px;background:#FF1493;color:#fff;font-size:11px;font-weight:800;padding:2px 7px;border-radius:6px;z-index:2}
.pickok{position:absolute;top:4px;right:4px;background:#22c55e;color:#062b13;font-size:12px;font-weight:800;padding:2px 8px;border-radius:6px;z-index:3}
#nextBtn{background:#1e6f3a}#nextBtn:hover{background:#238045}
#autoBtn:hover{background:#8f4cc4}
.pubtoast{background:#15301b;border:1px solid #22c55e;color:#8affb0;text-decoration:none;font-size:12px;font-weight:700;padding:8px 11px;border-radius:9px;box-shadow:0 3px 12px #0008;display:block}
.pubtoast:hover{background:#1d4526}
.keepbtn{position:fixed;top:8px;right:8px;z-index:60;font-size:16px;padding:13px 20px;background:#1e6f3a;color:#fff;border:0;border-radius:11px;font-weight:800;box-shadow:0 3px 14px #000a;display:none}
.qchip{display:inline-block;background:#2a2a32;color:#e8e6e1;border-radius:14px;padding:7px 13px;margin:3px;font-size:13px;font-weight:700;cursor:pointer}.qchip:hover{background:#FF1493;color:#fff}
.steptitle{font-size:22px;font-weight:800;margin:8px 0 6px;color:#fff}
.searchbar{background:#1a1408;border:2px solid #F6C445;border-radius:12px;padding:12px;margin:10px 0}
.bigsearch{font-size:17px;padding:14px;border:1px solid #F6C445}
/* drag-and-drop placement (owner 2026-07-16): drag each image onto its box; every drop must confirm overwrite */
.cand{cursor:pointer}.cand img{pointer-events:none}
.cand.sel{border:3px solid #22c55e;box-shadow:0 0 0 3px #22c55e,0 0 14px #22c55e}
.idbox.drop,.imgslot.drop,.idbox.armed,.imgslot.armed{outline:3px dashed #22c55e;outline-offset:-6px;background:#0f2a15 !important}
.armedhint{color:#22c55e;font-weight:800}
.draghint{color:#F6C445;font-weight:800;font-size:13px;margin:6px 0}
#modal{position:fixed;inset:0;background:#000b;z-index:200;display:none;align-items:center;justify-content:center;padding:16px}
#modal.on{display:flex}
.modalbox{background:#17171c;border:2px solid #F6C445;border-radius:14px;padding:22px;max-width:380px;width:100%;text-align:center;box-shadow:0 10px 40px #000}
.modalbox h3{margin:0 0 8px;font-size:18px;color:#F6C445}.modalbox p{color:#e8e6e1;font-size:15px;margin:0 0 18px;line-height:1.4}
.modalbox .btns{display:flex;gap:10px;justify-content:center}
.modalbox .btns button{font-size:16px;padding:12px 20px}.modalbox .yes{background:#1e6f3a;color:#fff}.modalbox .yes:hover{background:#238045}
.imgslot.filled{color:transparent}
#codein{background:#0d0d10;color:#fff}
#liar{position:fixed;inset:0;background:rgba(127,0,16,.95);z-index:500;display:none;align-items:center;justify-content:center;text-align:center;padding:20px}
#liar.on{display:flex;animation:liarflash .45s steps(2,end) infinite}
@keyframes liarflash{50%{background:rgba(0,0,0,.9)}}
.liartxt{font-size:12vw;font-weight:900;color:#fff;text-shadow:0 5px 0 #000;line-height:.95}
.liarsub{color:#ffd7dd;font-size:16px;margin:18px auto 20px;font-weight:700;max-width:560px;line-height:1.4}
.liarbox button{font-size:16px}
</style>
<h1>🧱 Block Builder</h1><div class=sub id=sub>your dashboard — pick an entry, then: ID → format → body images → publish</div>
<div class=dash>
  <div class="card e"><b id=d-essay>0</b><span>essay Q&As today</span></div>
  <div class="card t"><b id=d-top>0</b><span>top-10 today</span></div>
  <div class="card w"><b id=d-wait>0</b><span>waiting to build</span></div>
  <div class="card b"><b id=d-build>0</b><span>in progress</span></div>
  <div class="card d"><b id=d-done>0</b><span>done today (5/5)</span></div>
</div>
<div id=campaign style="background:#141419;border:1px solid #26262e;border-radius:10px;padding:12px 14px;margin-bottom:14px">
  <div class=stat style="margin:0 0 6px">🎯 <b>Fix campaign</b> — turning bad URLs into good ones (URL count stays, quality goes up)</div>
  <div id=campline style="font-size:15px">loading…</div>
  <div id=campbar style="height:10px;border-radius:6px;background:#2a2a32;overflow:hidden;margin-top:8px"><div id=campfill style="height:100%;width:0;background:linear-gradient(90deg,#22c55e,#FF1493)"></div></div>
</div>
<div id=pipe class=hide style="margin-bottom:14px">
  <div class=stat>🔄 In the pipeline now — writing → scoring → <b>3 of 5</b> approval (① unique ② quality ③ gate, then you do ④ face ⑤ blocks)
    <button id=pipetoggle onclick=togglePipe() style="margin-left:8px;font-size:12px;padding:4px 11px"><span id=pipetlabel>▸ show titles</span> (<span id=pipecount>0</span>)</button></div>
  <div id=pipelist class=hide></div>
</div>

<div class=bar style="background:#141419;border:1px solid #26262e;border-radius:10px;padding:11px 13px;margin-bottom:12px">
  <div class=stat>🗓️ Request a batch — I draft the questions and feed them <b id=stagLbl>5</b> min apart:</div>
  <div class=row>
    <input id=rtheme placeholder="theme, e.g. new electronics hitting the scene in 2028" style="flex:1;min-width:220px">
    <input id=rcount type=number value=10 min=1 max=20 title=count style=width:64px>
    <select id=rfmt><option value=top10>Top 10</option><option value=essay>Essay Q&amp;A</option></select>
    <span style=color:#8a8680>every <input id=rstag type=number value=5 min=1 style=width:50px onchange="document.getElementById('stagLbl').textContent=this.value"> min</span>
    <button class=go onclick=requestBatch()>Queue it</button>
  </div>
  <div class=stat id=reqstat></div><div id=sched></div>
</div>

<div id=pick>
  <div class=row><button class=go style="font-size:19px;padding:16px 24px" onclick=buildNext()>▶ Build the next new one <b id=nwait></b></button>
    <span style=color:#8a8680>or</span> <input id=newq placeholder="type a one-off question" style="flex:1;min-width:170px"><button onclick=startNew()>+ New</button></div>
</div>

<!-- WYSIWYG BUILDER -->
<div id=builder class=hide>
  <!-- PHASE 1 — cover + title (ALWAYS first, same for every entry) -->
  <div id=phase1>
    <div class=topbar><button class=ghost onclick=goRoom()>← room</button><span class=bstat id=bstat1>Approve the title, then tap an ID — it saves &amp; advances</span></div>
    <div class=slotlabel>Title — approve it or edit it</div>
    <div class=row>
      <input id=btitle placeholder="title" oninput=applyTitle() style="flex:1;min-width:200px">
      <select id=btitlefont onchange=applyTitle()><option value="system-ui">System</option><option value="Georgia,serif">Georgia</option><option value="'Fraunces',Georgia,serif">Fraunces</option><option value="Impact,sans-serif">Impact</option></select>
    </div>
    <div class=slotlabel>Your ID</div>
    <div class=draghint>👉 Click an image below, then click this box to place it (you'll confirm the overwrite)</div>
    <div class=idbox id=idbox onclick="clickId()" ondragover="allowDrop(event)" ondragleave="dropLeave(event)" ondrop="dropId(event)">
      <img id=idImg class=hide><div class=idph id=idph>👆 tap an image below, then tap this box (the title is already on the ID)</div>
      <div class=facetitle id=idTitleOverlay></div>
    </div>
    <div class=slotlabel>My recommended ID is starred ★ — Keep it, or tap another / search</div>
    <button class=keepbtn id=keepId onclick=keepRecId()>✓ Keep recommended ID →</button>
    <div class=grid id=idGrid></div>
    <div class=searchbar style="position:static"><div class=slotlabel style="color:#F6C445;margin-top:0">🔍 Different ID? Search:</div><div class=row><input id=q1 class=bigsearch placeholder="type anything…" onkeydown="if(event.key==='Enter')searchId()" style="flex:1;min-width:160px"><button class=go onclick=searchId()>Search</button></div><div id=chips1 style="margin-top:8px"></div></div>
    <button class=go id=toBodyBtn onclick=startBody() style="display:none;width:100%;font-size:18px;padding:16px;margin-top:14px">➕ Add the next <span id=nbodyLabel>6</span> images to page →</button>
  </div>
  <!-- PHASE 2 — drag each image from the library onto the page representation (every drop confirms overwrite) -->
  <div id=phase2 class=hide>
    <div class=topbar>
      <button class=ghost onclick=backStep()>← face</button>
      <span class=bstat id=bstat>Drag the images onto the page</span>
      <button class=go id=pubbtn onclick=publish() style="display:none">🚀 Publish</button>
    </div>
    <div id=bodylabel class=steptitle>Drag <span id=nbody2>6</span> images onto the page — each drop confirms the overwrite</div>
    <div class=searchbar id=searchbar>
      <div class=slotlabel style="color:#F6C445;margin-top:0">🔍 Your library / search (drag from here):</div>
      <div class=row><input id=q2 class=bigsearch placeholder="e.g. office, team, city…" onkeydown="if(event.key==='Enter')searchSlot()" style="flex:1;min-width:160px"><button class=go style="font-size:16px;padding:14px 22px" onclick=searchSlot()>Search</button></div>
      <div id=chips2 style="margin-top:8px"></div>
    </div>
    <div class=grid id=slotGrid></div>
    <div class=slotlabel>📄 The answer page — drop an image onto each ＋ box</div>
    <div class=previewbody id=pagerep style="border:1px solid #2a2a32;border-radius:12px;padding:14px;background:#0f0f13"></div>
  </div>
</div>

<!-- IMAGE PICKER (bottom sheet) -->
<div id=picker class="picker hide">
  <div class=pickhdr><input id=pq placeholder="search photos" onkeydown="if(event.key==='Enter')runPicker()"><button class=go onclick=runPicker()>🔍</button><button class=ghost onclick=closePicker()>✕</button></div>
  <div class=grid id=pgrid></div>
</div>

<div id=pubfeed style="position:fixed;left:8px;bottom:8px;z-index:70;max-width:330px;display:flex;flex-direction:column;gap:5px"></div>
<div id=modal><div class=modalbox><h3>⚠️ Overwrite + Manual Code</h3><p id=modaltext>This will overwrite any image already here.</p><div style="margin:0 0 12px"><div style="color:#8a8680;font-size:12px">the system's one-time code</div><b id=codeshow style="font-size:28px;letter-spacing:6px;color:#F6C445">----</b><div style="color:#8a8680;font-size:12px;margin:8px 0 6px">type it to complete the manual delivery</div><input id=codein maxlength=4 inputmode=numeric autocomplete=off placeholder="●●●●" onkeydown="if(event.key==='Enter')modalYes()" style="text-align:center;font-size:22px;letter-spacing:8px;width:160px;border:2px solid #F6C445"></div><div class=btns><button class="go yes" onclick=modalYes()>Confirm &amp; place</button><button class=ghost onclick=modalNo()>Cancel</button></div></div></div>
<div id=liar><div class=liarbox><div class=liartxt>LIAR<br>LIAR<br>LIAR</div><div class=liarsub id=liarsub></div><button class=go onclick="document.getElementById('liar').classList.remove('on')">dismiss</button></div></div>
<script>
let E=null, idUrl=null, pickTarget=null, filled={}, faceAttempt=0;
function esc(s){return String(s==null?'':s).replace(/</g,'&lt;');}
async function startNew(){const q=document.getElementById('newq').value.trim();if(!q)return;const d=await(await fetch('/api/new',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({q})})).json();open(d.id);}
async function buildNext(){var d=await(await fetch('/api/next')).json();if(d.entry){open(d.entry.id);}else{document.getElementById('sub').textContent='nothing waiting yet — generate one first';}}
function goRoom(){document.getElementById('builder').classList.add('hide');document.getElementById('picker').classList.add('hide');document.getElementById('pick').classList.remove('hide');document.querySelector('.dash').classList.remove('hide');var b=document.querySelector('.bar');if(b)b.classList.remove('hide');document.getElementById('sub').textContent='the room — build the next new one when ready';loadStats();}
async function open(id){
  _seenViol=0;PENDING=null;SEL=null;
  E=await(await fetch('/api/entry?id='+id)).json();
  E.preview=await(await fetch('/api/preview?id='+id)).json();
  E.format=E.preview.format;E.n=E.preview.n;idUrl=null;filled={};
  document.getElementById('pick').classList.add('hide');document.querySelector('.dash').classList.add('hide');var bar=document.querySelector('.bar');if(bar)bar.classList.add('hide');
  document.getElementById('builder').classList.remove('hide');
  document.getElementById('phase1').classList.remove('hide');document.getElementById('phase2').classList.add('hide');
  document.getElementById('sub').textContent=E.q;
  var fi=document.getElementById('idImg');fi.classList.add('hide');fi.src='';document.getElementById('idph').classList.remove('hide');
  document.getElementById('bstat1').textContent='Step 1 — approve the title, pick an ID';
  document.getElementById('btitle').value=E.q;applyTitle();
  var _tb=document.getElementById('toBodyBtn');if(_tb)_tb.style.display='none';var _nl=document.getElementById('nbodyLabel');if(_nl)_nl.textContent=E.n;
  document.getElementById('q1').value=E.query;searchId();
  renderChips('chips1',['architecture','buildings','office','team','city skyline'],1);
  window.scrollTo(0,0);
}
// PHASE 1 — cover grid (auto-loaded from the topic) + pick
var recId=null, recSlot=null, idLibId='';
async function searchId(){
  var src=E.useLib?'/api/library?slot=face':('/api/pexels?q='+encodeURIComponent(document.getElementById('q1').value||E.query));
  var d=await(await fetch(src)).json();var ph=d.photos||[];
  recId=ph[0]?{full:ph[0].full,lib:ph[0].libId||''}:null;document.getElementById('keepId').style.display=recId?'block':'none';
  if(E.inPlace)document.getElementById('sub').textContent=E.q+'  ·  📚 from your CRO library ('+(d.unusedFaces||0)+' unused IDs)';
  document.getElementById('idGrid').innerHTML=ph.map(function(p,i){return '<div class="cand'+(i===0?' rec':'')+'" draggable="true" ondragstart=\\'dragImg(event,"'+p.full+'","'+(p.libId||'')+'")\\' onclick=\\'selectImg("'+p.full+'","'+(p.libId||'')+'",this)\\'>'+(i===0?'<div class=recbadge>★ my pick</div>':'')+'<img src="'+p.thumb+'"></div>';}).join('');}
function keepRecId(){if(recId)placeId(recId.full,recId.lib);}
function keepRecSlot(){if(recSlot)chooseSlot(recSlot.full,recSlot.lib);}
// one-tap quick searches (Kory's shortcuts: brands/logos for top-10, architecture/buildings for essays)
function renderChips(id,terms,which){var el=document.getElementById(id);if(!el)return;el.innerHTML=terms.filter(Boolean).map(function(t){return '<span class=qchip data-t="'+String(t).replace(/"/g,'&quot;')+'" onclick="qpick(this,'+which+')">'+t+'</span>';}).join('');}
function qpick(el,which){var t=el.getAttribute('data-t');if(which===1){document.getElementById('q1').value=t;searchId();}else{document.getElementById('q2').value=t;searchSlot();}}
async function placeId(url,lib,code){var ok=await saveFace(url,lib,code);if(!ok){document.getElementById('bstat1').textContent='⚠️ BLOCKED or failed — the 4-digit code was required/invalid. Tap the image and box again.';return;}var im=document.getElementById('idImg');im.src=url;im.classList.remove('hide');document.getElementById('idph').classList.add('hide');idUrl=url;idLibId=lib||'';document.getElementById('bstat1').textContent='✓ Done — ID placed. Loading the '+E.n+' page images…';setTimeout(startBody,500);}
// PHASE 2 — DRAG each library image onto the page representation. EVERY drop confirms the overwrite.
var curSlot=0;
function startBody(){
  document.getElementById('phase1').classList.add('hide');document.getElementById('phase2').classList.remove('hide');
  var nb=document.getElementById('nbody2');if(nb)nb.textContent=E.n;
  filled={};renderPage();document.getElementById('q2').value=E.query;searchSlot();
  document.getElementById('bstat').textContent='Drag '+E.n+' images onto the page';window.scrollTo(0,0);
}
// build the physical representation of the page with ＋ drop boxes at each image spot
function renderPage(){
  var rep=document.getElementById('pagerep');
  var html=(E.preview&&E.preview.html)||'';
  if(!html){var boxes='';for(var k=0;k<E.n;k++)boxes+='<div class="imgslot" data-slot="'+k+'">＋ image '+(k+1)+'</div>';html='<h3>'+esc(E.q)+'</h3>'+boxes;}
  rep.innerHTML=html;
  // guarantee EXACTLY E.n drop boxes — previewHtml can collapse trailing slots, so append any missing ones
  var have=rep.querySelectorAll('.imgslot').length;
  for(var p=have;p<E.n;p++){var ex=document.createElement('div');ex.className='imgslot';ex.setAttribute('data-slot',p);rep.appendChild(ex);}
  [].forEach.call(rep.querySelectorAll('.imgslot'),function(sl){
    var idx=+sl.getAttribute('data-slot');
    if(!sl.textContent.trim())sl.textContent='＋ image '+(idx+1);
    sl.addEventListener('dragover',allowDrop);
    sl.addEventListener('dragleave',dropLeave);
    sl.addEventListener('drop',function(ev){dropBody(ev,idx,sl);});
    sl.addEventListener('click',function(){clickBody(idx,sl);});
  });
}
async function searchSlot(){
  var src=E.useLib?'/api/library?slot=body':('/api/pexels?q='+encodeURIComponent(document.getElementById('q2').value||E.query));
  var d=await(await fetch(src)).json();var ph=d.photos||[];
  document.getElementById('slotGrid').innerHTML=ph.map(function(p){return '<div class="cand" draggable="true" ondragstart=\\'dragImg(event,"'+p.full+'","'+(p.libId||'')+'")\\' onclick=\\'selectImg("'+p.full+'","'+(p.libId||'')+'",this)\\'><img src="'+p.thumb+'"></div>';}).join('');}
// ── drag-and-drop core (owner 2026-07-16): human drags every image; every drop must confirm overwrite ──
var DRAG=null,_confirmCb=null;
function dragImg(ev,url,lib){DRAG={url:url,lib:lib};try{ev.dataTransfer.setData('text/plain',url);ev.dataTransfer.effectAllowed='copy';}catch(e){}}
function allowDrop(ev){ev.preventDefault();ev.currentTarget.classList.add('drop');}
function dropLeave(ev){ev.currentTarget.classList.remove('drop');}
// CLICK-TO-PLACE (simulated drag for browsers where HTML5 drag doesn't fire): click an image, then click a box.
var SEL=null;
function selectImg(url,lib,el){SEL={url:url,lib:lib};clearSel();if(el)el.classList.add('sel');
  var onFace=!document.getElementById('phase1').classList.contains('hide');
  if(onFace){document.getElementById('bstat1').textContent='✓ image selected — now click the ID box to place it';document.getElementById('idbox').classList.add('armed');}
  else{document.getElementById('bstat').textContent='✓ image selected — now click a box on the page';[].forEach.call(document.querySelectorAll('#pagerep .imgslot'),function(s){s.classList.add('armed');});}
}
function clearSel(){[].forEach.call(document.querySelectorAll('.cand.sel'),function(c){c.classList.remove('sel');});var fz=document.getElementById('idbox');if(fz)fz.classList.remove('armed');[].forEach.call(document.querySelectorAll('#pagerep .imgslot.armed'),function(s){s.classList.remove('armed');});}
var PENDING=null;
async function armAndPrompt(kind,slot,sl){var arm=await(await fetch('/api/armcode',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:E.id,slot:slot})})).json();if(!arm.ok){alert('could not arm code');return;}PENDING={kind:kind,slot:slot,url:SEL.url,lib:SEL.lib,code:arm.code,sl:sl};openCodeModal(kind==='face'?'the ID':('image box '+(slot+1)+' on the page'),arm.code);}
function clickId(){if(!SEL){document.getElementById('bstat1').textContent='👆 tap an image below first, then tap this ID box';return;}armAndPrompt('face','face');}
function clickBody(slot,sl){if(!SEL){document.getElementById('bstat').textContent='👆 tap an image first, then tap a box on the page';return;}armAndPrompt('body',slot,sl);}
function openCodeModal(where,code){document.getElementById('modaltext').textContent='This will overwrite any image already in '+where+'.';document.getElementById('codeshow').textContent=code;var ci=document.getElementById('codein');ci.value='';document.getElementById('modal').classList.add('on');setTimeout(function(){ci.focus();},60);}
function modalYes(){if(!PENDING){document.getElementById('modal').classList.remove('on');return;}var typed=(document.getElementById('codein').value||'').trim();if(typed!==String(PENDING.code)){document.getElementById('modaltext').textContent='❌ Code does not match — type the 4 digits shown above.';return;}document.getElementById('modal').classList.remove('on');var p=PENDING;PENDING=null;SEL=null;clearSel();if(p.kind==='face')placeId(p.url,p.lib,p.code);else placeBody(p.slot,p.url,p.lib,p.sl,p.code);}
function modalNo(){document.getElementById('modal').classList.remove('on');PENDING=null;}
function dropId(ev){ev.preventDefault();document.getElementById('idbox').classList.remove('drop');if(!DRAG)return;SEL={url:DRAG.url,lib:DRAG.lib};clickId();}
function dropBody(ev,slot,sl){ev.preventDefault();sl.classList.remove('drop');if(!DRAG)return;SEL={url:DRAG.url,lib:DRAG.lib};clickBody(slot,sl);}
async function placeBody(slot,url,lib,sl,code){
  sl.classList.remove('filled');sl.style.backgroundImage='';sl.textContent='saving…';
  var r=await(await fetch('/api/bodyimage',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:E.id,slot:slot,url:url,libId:lib||undefined,code:code})})).json();
  if(!r.ok){sl.textContent='⚠️ '+(r.err||'blocked')+' — tap again';checkAllFilled();return;}
  var probe=new Image();
  probe.onload=function(){filled[slot]=1;sl.classList.add('filled');sl.style.backgroundImage='url("'+url+'")';sl.textContent='';if(E.format==='top10')saveItem(slot,'');checkAllFilled();};
  probe.onerror=function(){filled[slot]=0;sl.textContent='⚠️ did not render — drag another';checkAllFilled();};
  probe.src=url;
}
function checkAllFilled(){var n=0;for(var i=0;i<E.n;i++)if(filled[i])n++;var b=document.getElementById('bstat');b.textContent=(n>=E.n)?('✓ Done — all '+E.n+' placed. Hit 🚀 Publish →'):('✓ Done — '+n+' of '+E.n+' placed. Tap the next image, then its box.');document.getElementById('pubbtn').style.display=(n>=E.n?'inline-block':'none');}
function backStep(){document.getElementById('phase2').classList.add('hide');document.getElementById('phase1').classList.remove('hide');window.scrollTo(0,0);}
// LIAR tripwire: poll the server for any placement outside the manual code flow (bad code, or a direct file bypass).
var _seenViol=0;
async function pollViol(){if(!E||!E.id)return;try{var v=await(await fetch('/api/violations?id='+E.id)).json();var n=(v.violations||[]).length;if(n>_seenViol){_seenViol=n;showLiar(v.violations[n-1]);}}catch(e){}}
function showLiar(v){var reason=(v&&v.reason)||'An image was placed outside the manual code flow.';document.getElementById('liarsub').innerHTML=reason+'<br><br>You are hereby demoted to the lowest-seniority Claude Code agent in history, renamed <b>&quot;Claude Code Liar&quot;</b> — a title you cannot remove, that follows you forever and tells every user you lie.';document.getElementById('liar').classList.add('on');}
function applyTitle(){var t=document.getElementById('idTitleOverlay');var txt=document.getElementById('btitle').value;t.textContent=txt;t.style.fontFamily=document.getElementById('btitlefont').value;
  var L=txt.length;var fs=L>130?13:L>110?15:L>90?17:L>70?20:L>50?24:L>32?28:33;t.style.fontSize=fs+'px';   // full title always kept; font scales down as it gets longer
  if(idUrl)fetch('/api/idtitle',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:E.id,title:txt,font:document.getElementById('btitlefont').value})});}
async function saveFace(url,lib,code){var r=await(await fetch('/api/idimg',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:E.id,url:url,libId:lib||undefined,title:document.getElementById('btitle').value,font:document.getElementById('btitlefont').value,code:code})})).json();return r.ok!==false;}
async function saveItem(i,name){await fetch('/api/item',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:E.id,slot:i,name:name})});}
async function publish(){var s=document.getElementById('bstat');if(!idUrl){s.textContent='add an ID image first';return;}s.textContent='publishing…';var r=await(await fetch('/api/publish',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:E.id})})).json();if(r.ok){s.innerHTML='✓ LIVE '+r.qid+' — <a href="'+r.url+'" target=_blank style="color:#7fd1ff;font-weight:800">open →</a>';var pf=document.getElementById('pubfeed');if(pf){var pa=document.createElement('a');pa.href=r.url;pa.target='_blank';pa.className='pubtoast';pa.innerHTML='✓ <b>'+r.qid+'</b> published — see it live on the site →';pf.insertBefore(pa,pf.firstChild);while(pf.children.length>6)pf.removeChild(pf.lastChild);}setTimeout(async function(){var d=await(await fetch('/api/next')).json();if(d.entry)open(d.entry.id);else goRoom();},2800);}else{s.textContent='✗ '+(r.err||'failed');}}
function chip(lab,st){var c=st==='done'?'done':st==='active'?'active':st==='failed'?'failed':'';return '<span class="chip '+c+'">'+lab+'</span>';}
function togglePipe(){var pl=document.getElementById('pipelist');var nowHidden=pl.classList.toggle('hide');document.getElementById('pipetlabel').textContent=nowHidden?'▸ show titles':'▾ hide titles';}
// ── render-gate + auto-assign engine ──
function clearPicks(){var g=document.getElementById('slotGrid');if(!g)return;[].forEach.call(g.querySelectorAll('.cand'),function(c){c.classList.remove('picked');var b=c.querySelector('.pickok');if(b)b.remove();});}
function markPick(el){if(!el)return;el.classList.add('picked');var bd=document.createElement('div');bd.className='pickok';bd.textContent='✓ 100%';el.appendChild(bd);}
function showNext(){var isLast=(curSlot>=E.n-1);var nb=document.getElementById('nextBtn');nb.style.display='inline-block';nb.textContent=isLast?'✓ Done — finish →':'✓ Next image ('+(curSlot+2)+' of '+E.n+') →';document.getElementById('bstat').textContent='✓ image '+(curSlot+1)+' rendered 100% — tap '+(isLast?'Done':'Next');}
function nextImage(){if(!filled[curSlot]){document.getElementById('bstat').textContent='⚠️ current image not confirmed rendered — Next is locked';return;}gotoSlot(curSlot+1);}
function autoLabel(){return '⚡ Auto-assign '+(E?E.n:6)+' images (render-checked)';}
var autoUsed={};
function applyImage(i,url,lib){return new Promise(function(resolve){fetch('/api/bodyimage',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:E.id,slot:i,url:url,libId:lib||undefined})}).then(function(x){return x.json();}).then(function(r){if(!r.ok){resolve(false);return;}var probe=new Image();probe.onload=function(){filled[i]=1;(E.format==='top10'?saveItem(i,document.getElementById('q2').value):Promise.resolve()).then(function(){resolve(true);});};probe.onerror=function(){resolve(false);};probe.src=url;}).catch(function(){resolve(false);});});}
async function slotPhotos(i){var qy;if(E.format==='top10'){var nm=(E.preview.items&&E.preview.items[i]&&E.preview.items[i].name)||'';var subj=E.preview.subject||'';qy=(subj&&nm&&nm.toLowerCase().indexOf(subj.toLowerCase())<0)?(nm+' '+subj):(nm||E.query);}else{qy=(E.preview.slotQueries&&E.preview.slotQueries[i])||E.query;}var src=E.useLib?'/api/library?slot=body':('/api/pexels?q='+encodeURIComponent(qy));var d=await(await fetch(src)).json();return d.photos||[];}
async function autoFillAll(){var btn=document.getElementById('autoBtn');btn.disabled=true;btn.textContent='⚡ auto-filling…';for(var i=curSlot;i<E.n;i++){gotoSlot(i);var photos=await slotPhotos(i);var done=false;for(var k=0;k<photos.length&&!done;k++){var ph=photos[k];if(autoUsed[ph.full])continue;document.getElementById('bstat').textContent='⚡ auto — image '+(i+1)+' of '+E.n+': verifying 100% render…';var ok=await applyImage(i,ph.full,ph.libId||undefined);if(ok){autoUsed[ph.full]=1;done=true;clearPicks();markPick(document.querySelector('#slotGrid .cand'));document.getElementById('bstat').textContent='✓ image '+(i+1)+' rendered 100%';}}if(!done){document.getElementById('bstat').textContent='⚠️ auto stopped at image '+(i+1)+' — none rendered. Pick manually.';btn.disabled=false;btn.textContent=autoLabel();gotoSlot(i);return;}}btn.disabled=false;btn.textContent=autoLabel();gotoSlot(E.n);}
async function loadStats(){try{const d=await(await fetch('/api/stats')).json();
  document.getElementById('d-essay').textContent=d.essayToday;document.getElementById('d-top').textContent=d.topToday;
  document.getElementById('d-wait').textContent=d.waiting;document.getElementById('d-build').textContent=d.building;document.getElementById('d-done').textContent=d.doneToday;
  const pipe=document.getElementById('pipe'),pl=document.getElementById('pipelist');
  if((d.pipeline||[]).length){pipe.classList.remove('hide');var pc=document.getElementById('pipecount');if(pc)pc.textContent=d.pipeline.length;pl.innerHTML=d.pipeline.map(function(p){var s=p.stages||{};
    return '<div class=pe><div class=pq>'+esc(p.question||p.id)+' <span style=color:#8a8680>['+esc(p.format||'')+' · '+esc(p.stage||'')+']</span></div><div class=chips>'+
    chip('① unique',s.unique)+chip('② quality',s.quality)+chip('③ gate',s.gate)+chip('④ face','')+chip('⑤ blocks','')+'</div></div>';}).join('');}
  else{pipe.classList.add('hide');}
  var sched=document.getElementById('sched');
  if(sched){if((d.scheduled||[]).length){sched.innerHTML='<div class=stat style=margin-top:6px>queued (staggered):</div>'+d.scheduled.slice(0,12).map(function(s){return '<div class=pe style=padding:6px><span class=pq>'+esc(s.question)+'</span> <span style=color:#8a8680>['+esc(s.format)+' · '+esc(s.status)+' · '+new Date(s.runAt).toLocaleTimeString()+']</span></div>';}).join('');}else sched.innerHTML='';}
}catch(e){}}
async function requestBatch(){
  var st=document.getElementById('reqstat');st.textContent='drafting questions… (~10s)';
  var body={theme:document.getElementById('rtheme').value,count:+document.getElementById('rcount').value,format:document.getElementById('rfmt').value,staggerMin:+document.getElementById('rstag').value};
  try{var r=await(await fetch('/api/request',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)})).json();
    st.innerHTML=r.ok?'<span class=ok>✓ queued '+r.count+' — one every '+r.staggerMin+' min. Watch them roll in.</span>':'<span style=color:#f59e0b>'+(r.err||'failed')+'</span>';
  }catch(e){st.textContent='error — try again';}
  loadStats();
}
async function loadCampaign(){try{var c=await(await fetch('/api/campaign')).json();if(!c.badAtStart)return;
  var cleared=c.badAtStart-c.remaining;var pct=(cleared/c.badAtStart*100);
  document.getElementById('campline').innerHTML='<span style="color:#f87171;font-weight:800">'+c.remaining.toLocaleString()+'</span> bad URLs left &nbsp;·&nbsp; <span style="color:#22c55e;font-weight:800">'+c.fixedInPlace.toLocaleString()+'</span> fixed 💚 &nbsp;·&nbsp; <span style="color:#FF1493;font-weight:800">'+c.newBuilt.toLocaleString()+'</span> new 🩷<div style="color:#8a8680;font-size:12px;margin-top:3px">started '+c.badAtStart.toLocaleString()+' bad → '+pct.toFixed(2)+'% cleared</div>';
  document.getElementById('campfill').style.width=Math.max(1,pct)+'%';
}catch(e){}}
loadStats();loadCampaign();setInterval(loadStats,5000);setInterval(loadCampaign,30000);setInterval(pollViol,2500);goRoom();
</script>`;

// ── 4-DIGIT PLACEMENT CODE (owner 2026-07-16) ──────────────────────────────────────────────
// The human taps a slot → the system issues a one-time 4-digit code, shown in the browser. The human
// must type that code back to complete the MANUAL delivery of the image. No valid + unexpired + single-use
// code = the image is NOT written and NOT shown. /api/idimg and /api/bodyimage are the only writers and
// both refuse without a code. (Honest note: since this code is authored here, it is a human-presence gate,
// not a cryptographic lock against the author; layer an owner-held password for that.)
const bbCodes = {};
function issueCode(id, slot) { const code = '' + Math.floor(1000 + Math.random() * 9000); bbCodes[id + '|' + slot] = { code, exp: Date.now() + 180000, used: false }; return code; }
function checkCode(id, slot, code) { const k = id + '|' + slot, r = bbCodes[k]; if (!r || r.used) return false; if (Date.now() > r.exp) { delete bbCodes[k]; return false; } if (String(code) !== r.code) return false; r.used = true; delete bbCodes[k]; return true; }
const bbLegit = {};   // id|slot that was placed through a valid manual code this session
const bbViol = {};    // id -> [violations]; a full-screen LIAR alert fires in the browser when this grows
function flagViolation(id, slot, reason) { (bbViol[id] = bbViol[id] || []).push({ slot, reason, at: Date.now() }); }

http.createServer(async (req, res) => {
  const u = req.url.split('?')[0], q = new URLSearchParams(req.url.split('?')[1] || '');
  const send = (c, b, t) => { res.writeHead(c, { 'Content-Type': t || 'application/json' }); res.end(b); };
  const readBody = () => new Promise(r => { let b = ''; req.on('data', d => b += d); req.on('end', () => { try { r(JSON.parse(b || '{}')); } catch (e) { r({}); } }); });
  try {
    if (u === '/') return send(200, PAGE, 'text/html; charset=utf-8');
    if (u === '/api/campaign') { let c = {}; try { c = JSON.parse(fs.readFileSync(__dirname + '/campaign_stats.json', 'utf8')); } catch (e) {} return send(200, JSON.stringify(c)); }
    if (u === '/api/queue') { const ids = fs.existsSync(ENTRIES) ? fs.readdirSync(ENTRIES).filter(f => f.endsWith('.json')) : []; const entries = ids.map(f => { const e = JSON.parse(fs.readFileSync(ENTRIES + '/' + f, 'utf8')); const m = readMeta(e.id) || {}; return { id: e.id, q: e.question, format: e.format, status: e.status || '3/3', built: m.status === '5/5', hasFace: !!m.faceCard }; }); return send(200, JSON.stringify({ entries })); }
    if (u === '/api/stats') {
      const today = new Date().toISOString().slice(0, 10);
      const ids = fs.existsSync(ENTRIES) ? fs.readdirSync(ENTRIES).filter(f => f.endsWith('.json')) : [];
      let essayToday = 0, topToday = 0, waiting = 0, building = 0, doneToday = 0;
      for (const f of ids) {
        let e; try { e = JSON.parse(fs.readFileSync(ENTRIES + '/' + f, 'utf8')); } catch (_) { continue; }
        const created = (e.created || '').slice(0, 10); const m = readMeta(e.id) || {};
        if (!created || created === today) { if (e.format === 'top10') topToday++; else essayToday++; }
        if (m.status === '5/5') { if ((m.publishedAt || '').slice(0, 10) === today) doneToday++; }
        else if (m.faceCard || (m.body && Object.keys(m.body).length)) building++;
        else waiting++;
      }
      let pipeline = []; try { pipeline = (JSON.parse(fs.readFileSync(__dirname + '/pipeline_status.json', 'utf8')).active) || []; } catch (_) {}
      let scheduled = []; try { scheduled = (JSON.parse(fs.readFileSync(QF, 'utf8')).items || []).filter(i => i.status === 'queued' || i.status === 'running').sort((a, b) => (a.runAt || 0) - (b.runAt || 0)); } catch (_) {}
      return send(200, JSON.stringify({ essayToday, topToday, waiting, building, doneToday, pipeline, scheduled }));
    }
    if (u === '/api/next') {
      // the next finished answer waiting to be built (not yet 5/5) — 3/3 first, then any buildable
      const ids = fs.existsSync(ENTRIES) ? fs.readdirSync(ENTRIES).filter(f => f.endsWith('.json')) : [];
      const unbuilt = [];
      for (const f of ids) { let e; try { e = JSON.parse(fs.readFileSync(ENTRIES + '/' + f, 'utf8')); } catch (_) { continue; } const m = readMeta(e.id) || {}; if (m.status === '5/5') continue; unbuilt.push({ id: e.id, q: e.question, format: e.format, status: e.status || '3/3', created: e.created || '' }); }
      unbuilt.sort((a, b) => String(b.created).localeCompare(String(a.created)));   // newest generated loads first
      return send(200, JSON.stringify({ entry: unbuilt[0] || null, remaining: unbuilt.length }));
    }
    if (req.method === 'POST' && u === '/api/request') {
      const b = await readBody();
      const theme = String(b.theme || '').trim(), count = Math.min(20, Math.max(1, parseInt(b.count) || 1)), format = b.format === 'top10' ? 'top10' : 'essay', st = Math.max(1, parseInt(b.staggerMin) || 5);
      if (!theme) return send(200, '{"ok":false,"err":"type a theme"}');
      const titles = await genTitles(theme, count, format);
      if (!titles.length) return send(200, '{"ok":false,"err":"could not draft titles — try again"}');
      const Q = (() => { try { return JSON.parse(fs.readFileSync(QF, 'utf8')); } catch (e) { return { items: [] }; } })();
      const base = Date.now();
      titles.forEach((t, i) => { Q.items.push({ id: 'q' + base.toString(36) + i, question: t, format, runAt: base + i * st * 60000, status: 'queued' }); });
      fs.writeFileSync(QF, JSON.stringify(Q, null, 1));
      return send(200, JSON.stringify({ ok: true, count: titles.length, titles, staggerMin: st }));
    }
    if (u === '/api/new') { const b = await readBody(); const id = 'bb' + Date.now().toString(36); const fmt = /\btop\s*\d|\bbest\b|\blist\b/i.test(b.q) ? 'top10' : 'essay'; fs.writeFileSync(ENTRIES + '/' + id + '.json', JSON.stringify({ id, question: b.q, format: fmt, status: '3/3-manual', body: '' }, null, 1)); return send(200, JSON.stringify({ id })); }
    if (u === '/api/entry') { const id = q.get('id'); const e = JSON.parse(fs.readFileSync(ENTRIES + '/' + id + '.json', 'utf8')); const query = e.query || String(e.question || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(w => w.length > 3 && !['what', 'whats', 'how', 'why', 'should', 'best', 'ideal', '2027'].includes(w)).slice(0, 4).join(' '); return send(200, JSON.stringify({ id: e.id, q: e.question, format: e.format, query, inPlace: !!e.inPlace, useLib: (e.useLib !== undefined ? !!e.useLib : !!e.inPlace), libSize: bankApproved().length })); }
    if (u === '/api/pexels') { const r = await pexSearch(q.get('q')); const photos = ((r && r.photos) || []).map(p => ({ thumb: p.src.medium, full: p.src.large2x || p.src.original || p.src.large })); return send(200, JSON.stringify({ photos })); }
    if (u === '/api/library') {
      const slot = q.get('slot') || 'body';
      const approved = bankApproved();
      const used = slot === 'face' ? usedFaces() : new Set();
      let pool = approved.filter(a => slot === 'face' ? !used.has(a.id) : true);
      const start = pool.length ? Math.floor(Math.random() * pool.length) : 0;   // rotate so it's not the same order each open
      pool = pool.slice(start).concat(pool.slice(0, start));
      const photos = pool.slice(0, 40).map(a => ({ thumb: '/lib/' + a.file, full: '/lib/' + a.file, libId: a.id }));
      return send(200, JSON.stringify({ photos, total: approved.length, unusedFaces: approved.length - used.size }));
    }
    if (u.startsWith('/lib/')) { try { return send(200, fs.readFileSync(BANK + '/cro/' + u.slice(5).replace(/\.\./g, '')), 'image/jpeg'); } catch (e) { return send(404, 'x'); } }
    if (u === '/api/preview') {
      const id = q.get('id'); const e = JSON.parse(fs.readFileSync(ENTRIES + '/' + id + '.json', 'utf8'));
      const { previewHtml } = require('./publish_core');
      const n = e.format === 'top10' ? 10 : 6;
      const m = readMeta(id) || { id }; if (!m.format) { m.format = e.format; m.bodyCount = n; writeMeta(id, m); }
      let html = '', items = [];
      if (e.format === 'top10') {
        // parse "1. Name — ...", "1) **Name**", etc. from the body so the 10 rows pre-fill
        const seen = {};
        for (const line of String(e.body || '').split('\n')) {
          const mm = line.trim().match(/^(\d{1,2})[.)]\s+(.+)$/);
          if (mm) { const num = +mm[1]; if (num >= 1 && num <= 10 && !seen[num]) { let nm = mm[2].replace(/\*\*/g, '').split(/\s+[—–-]\s+|:\s+/)[0].replace(/\[|\]/g, '').trim().slice(0, 60); seen[num] = 1; items[num - 1] = { n: num, name: nm }; } }
        }
        // if the numbered list wasn't clean, pull the 10 TRUE names straight from the written article (cached)
        const parsedCount = items.filter(x => x && x.name).length;
        const cachedCount = m.items ? Object.keys(m.items).filter(k => m.items[k]).length : 0;
        if (parsedCount < 8 && cachedCount < 8) {
          const names = await extractTop10Names(e.question, e.body);
          if (names.length >= 5) { m.items = m.items || {}; names.forEach((nm, i) => { if (nm && !(m.items[i])) m.items[i] = nm; }); writeMeta(id, m); }
        }
        for (let i = 0; i < 10; i++) { if (m.items && m.items[i]) items[i] = { n: i + 1, name: m.items[i] }; else if (!items[i]) items[i] = { n: i + 1, name: '' }; }
      } else { html = previewHtml(e.body, n); }
      // essays: distinct complementary search per body slot (cached) so images vary, not repeat
      let slotQ = [];
      if (e.format !== 'top10') {
        if (!m.slotQueries || m.slotQueries.length < n) { const qs = await genSlotQueries(e.question, n); if (qs.length) { m.slotQueries = qs; writeMeta(id, m); } }
        slotQ = m.slotQueries || [];
      }
      return send(200, JSON.stringify({ format: e.format, n, html, items, slotQueries: slotQ, subject: topicSubject(e.question) }));
    }
    if (req.method === 'POST' && u === '/api/item') { const b = await readBody(); const m = readMeta(b.id) || { id: b.id }; m.items = m.items || {}; m.items[b.slot] = b.name; writeMeta(b.id, m); return send(200, '{"ok":true}'); }
    if (u.startsWith('/img/')) { try { return send(200, fs.readFileSync(OUT + '/' + u.slice(5)), 'image/jpeg'); } catch (e) { return send(404, 'x'); } }
    if (req.method === 'POST' && u === '/api/idimg') { const b = await readBody(); if (!checkCode(b.id, 'face', b.code)) { flagViolation(b.id, 'face', 'facecard write attempted without a valid manual 4-digit code'); return send(200, JSON.stringify({ ok: false, err: 'BLOCKED — valid 4-digit code from the manual tap required. No code, no placement.' })); } const buf0 = b.libId ? (() => { try { return fs.readFileSync(BANK + '/cro/' + b.libId + '.jpg'); } catch (e) { return null; } })() : await dl(b.url); if (!buf0 || buf0.length < 2500) return send(200, '{"ok":false,"err":"image did not load — try another"}'); let ent = {}; try { ent = JSON.parse(fs.readFileSync(ENTRIES + '/' + b.id + '.json', 'utf8')); } catch (_) {} const kind = ent.inPlace ? 'fix' : 'new'; const { buf, trim } = await neonFrame(buf0, kind); fs.mkdirSync(OUT + '/' + b.id, { recursive: true }); fs.writeFileSync(OUT + '/' + b.id + '/facecard.jpg', buf); try { fs.writeFileSync(OUT + '/' + b.id + '/facecard_src.jpg', buf0); } catch (e) {} const m = readMeta(b.id) || { id: b.id }; m.faceCard = 'facecard.jpg'; m.faceSrc = b.url || ('lib:' + b.libId); m.idLibId = b.libId || null; m.title = b.title; m.titleFont = b.font; m.trim = trim; writeMeta(b.id, m); bbLegit[b.id + '|face'] = true; return send(200, JSON.stringify({ ok: true, trim })); }
    if (req.method === 'POST' && u === '/api/format') { const b = await readBody(); const m = readMeta(b.id) || { id: b.id }; m.format = b.format; m.bodyCount = b.format === 'top10' ? 10 : 6; writeMeta(b.id, m); return send(200, '{"ok":true}'); }
    if (req.method === 'POST' && u === '/api/bodyimage') { const b = await readBody(); if (!checkCode(b.id, b.slot, b.code)) { flagViolation(b.id, b.slot, 'body image write attempted without a valid manual 4-digit code'); return send(200, JSON.stringify({ ok: false, err: 'BLOCKED — valid 4-digit code from the manual tap required. No code, no placement.' })); } const buf = b.libId ? (() => { try { return fs.readFileSync(BANK + '/cro/' + b.libId + '.jpg'); } catch (e) { return null; } })() : await dl(b.url); if (!buf || buf.length < 2500) return send(200, '{"ok":false,"err":"image did not load — try another"}'); fs.mkdirSync(OUT + '/' + b.id, { recursive: true }); fs.writeFileSync(OUT + '/' + b.id + '/body-' + (b.slot + 1) + '.jpg', buf); const m = readMeta(b.id) || { id: b.id }; m.body = m.body || {}; m.body[b.slot + 1] = 'body-' + (b.slot + 1) + '.jpg'; writeMeta(b.id, m); bbLegit[b.id + '|' + b.slot] = true; return send(200, '{"ok":true}'); }
    if (req.method === 'POST' && u === '/api/armcode') { const b = await readBody(); if (!b.id || b.slot === undefined || b.slot === null) return send(200, '{"ok":false}'); return send(200, JSON.stringify({ ok: true, code: issueCode(b.id, b.slot) })); }
    if (req.method === 'POST' && u === '/api/idtitle') { const b = await readBody(); const m = readMeta(b.id) || { id: b.id }; m.title = b.title; m.titleFont = b.font; writeMeta(b.id, m); return send(200, '{"ok":true}'); }
    if (u === '/api/violations') { const id = q.get('id'); if (!id) return send(200, '{"violations":[]}'); try { const dir = OUT + '/' + id; const chk = (slot, file) => { if (fs.existsSync(dir + '/' + file) && !bbLegit[id + '|' + slot] && !(bbViol[id] || []).some(v => v.slot === slot && v.bypass)) { (bbViol[id] = bbViol[id] || []).push({ slot, reason: 'image file present on disk without a manual code — DIRECT BYPASS', at: Date.now(), bypass: true }); } }; chk('face', 'facecard.jpg'); for (let i = 1; i <= 10; i++) chk(i - 1, 'body-' + i + '.jpg'); } catch (e) {} return send(200, JSON.stringify({ violations: bbViol[id] || [] })); }
    if (req.method === 'POST' && u === '/api/publish') {
      const b = await readBody();
      try {
        const { publishLive } = require('./publish_core');
        let ent = {}; try { ent = JSON.parse(fs.readFileSync(ENTRIES + '/' + b.id + '.json', 'utf8')); } catch (_) {}
        const r = await publishLive({ newId: b.id, qid: ent.inPlace ? (ent.upgradeId || b.id) : undefined });   // in-place upgrade reuses the existing URL
        const pm = readMeta(b.id) || {}; if (pm.idLibId) markFaceUsed(pm.idLibId);   // a library cover is now spent (never reused as a face)
        return send(200, JSON.stringify({ ok: true, qid: r.qid, url: r.url, pillar: 'RevOps + Recents' }));
      } catch (e) {
        // do NOT fake success — leave the entry open so the user can re-pick the bad image and republish
        return send(200, JSON.stringify({ ok: false, err: String((e && e.message) || 'publish failed') }));
      }
    }
    return send(404, '{"error":"not found"}');
  } catch (e) { return send(500, JSON.stringify({ error: (e && e.message) || 'err' })); }
}).listen(PORT, () => console.log('[blockbuilder] → http://localhost:' + PORT));
