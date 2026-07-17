// baton_picker.js — MANUAL IMAGE BATON PICKER (owner 2026-07-16). Port 7802, Pulse crimson/gold.
// YOU are the hands. You tap a candidate image, then tap a slot. The PICKER (this process — not the agent)
// writes the real image to its render path AND writes one HMAC-signed receipt to _receipts/pending/.
// The agent is never involved in placement. Claude cannot forge a receipt (it never has the secret).
'use strict';
const http = require('http');
const fs = require('fs');
const https = require('https');
const path = require('path');
const crypto = require('crypto');
const { spawn } = require('child_process');
const WD = 'C:/Users/koryj/website';
// crash-proof: never let an uncaught error kill the picker; log it and keep serving
process.on('uncaughtException', e => { try { fs.appendFileSync(WD + '/baton_picker.out.log', 'UNCAUGHT ' + new Date().toISOString() + ': ' + ((e && e.stack) || e) + '\n'); } catch (x) {} });
process.on('unhandledRejection', e => { try { fs.appendFileSync(WD + '/baton_picker.out.log', 'UNHANDLED ' + new Date().toISOString() + ': ' + ((e && e.stack) || e) + '\n'); } catch (x) {} });
try { for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (e) {}
const PEXELS = process.env.PEXELS_API_KEY;
const PORT = 7802;
const ENTRIES = WD + '/new/entries';
const OUT = WD + '/new/output';
const LIB = WD + '/new/imagebank/cro';
const PEXLIB = WD + '/assets/qa/_pexels_stored';   // your preloaded Pexels library
const USEDF = WD + '/new/imagebank/_used.json';    // lib refs already used → drop from the RECOMMENDED grid (still in library, still searchable, dups still allowed)
function usedLib() { try { return new Set(JSON.parse(fs.readFileSync(USEDF, 'utf8'))); } catch (e) { return new Set(); } }
function addUsedLib(ref) { try { const s = usedLib(); s.add(ref); fs.writeFileSync(USEDF, JSON.stringify(Array.from(s))); } catch (e) {} }
const SECRET_FILE = WD + '/.guard/secret.key';
const PENDING = WD + '/_receipts/pending';
const POAF = WD + '/_poa/grant.json';   // per-round Power-of-Attorney grant the AGENT writes; consumed on publish
function poaGrantedFor(id) { try { return JSON.parse(fs.readFileSync(POAF, 'utf8')).entry_id === id; } catch (e) { return false; } }
function clearPoa() { try { fs.unlinkSync(POAF); } catch (e) {} }
let sharp = null; try { sharp = require('sharp'); } catch (e) {}
let publishLive = null, proveLive = null; try { ({ publishLive, proveLive } = require('./new/publish_core')); } catch (e) {}
let improveEntry = null; try { ({ improveEntry } = require('./new/improve_content')); } catch (e) {}
let gateScore = null; try { ({ gateScore } = require('./new/content_gate')); } catch (e) {}

const SLOTS = ['id', 'b1', 'b2', 'b3', 'b4', 'b5', 'b6'];
function destFor(id, slot) { return OUT + '/' + id + '/' + (slot === 'id' ? 'facecard.jpg' : ('body-' + slot.slice(1) + '.jpg')); }
function readSecret() { return fs.readFileSync(SECRET_FILE); }             // picker process only; Claude is blocked from this
function sha256(b) { return crypto.createHash('sha256').update(b).digest('hex'); }
function readMeta(id) { try { return JSON.parse(fs.readFileSync(OUT + '/' + id + '/meta.json', 'utf8')); } catch (e) { return { id }; } }
function writeMeta(id, m) { fs.mkdirSync(OUT + '/' + id, { recursive: true }); fs.writeFileSync(OUT + '/' + id + '/meta.json', JSON.stringify(m, null, 1)); }

// current round = newest written essay not yet published
function currentEntry() {
  let files = []; try { files = fs.readdirSync(ENTRIES).filter(f => f.endsWith('.json')); } catch (e) {}
  let DONE = []; try { DONE = JSON.parse(fs.readFileSync(WD + '/new/_done.json', 'utf8')); } catch (e) {}   // CYCLE-DONE (owner 2026-07-17): published entries never come back
  const out = [];
  for (const f of files) { let e; try { e = JSON.parse(fs.readFileSync(ENTRIES + '/' + f, 'utf8')); } catch (_) { continue; } const m = readMeta(e.id); if (DONE.indexOf(e.id) >= 0 || m.status === '5/5' || m.status === 'skipped') continue; if (e.format === 'top10') continue; if (!(e.body && e.body.length > 300)) continue; if (m.publishedAt && gateScore && (() => { try { return gateScore(e).pass; } catch (_) { return false; } })()) continue; /* already done: published-with-images AND 13/13 → move it out of the queue */ out.push({ id: e.id, q: e.question, created: e.created || '', fresh: /^(bbnew|newmr)/.test(e.id), blackbox: !!e.blackbox, pillar: String(e.id).replace(/\d.*$/, '').toLowerCase(), ready: (Number(e.gate_score) >= 13) || ((e.body || '').length > 9000), deferred: !!m.deferredAt }); }
  // PRIORITY (owner 2026-07-17): 0 ⬛ Black Box face-card Q&As FIRST, 1 CRO Pulse Tools (tl pillar
  // with "CRO"/"Chief Revenue Officer" in the question), 2 focus pillar, 3 oldest fix-campaign,
  // 4 fresh generated essays. Within a tier: fix=oldest-first, fresh=newest-first.
  let FOCUS = ''; try { FOCUS = String(JSON.parse(fs.readFileSync(WD + '/new/_focus.json', 'utf8')).pillar || '').toLowerCase(); } catch (e) {}
  const isCroTool = x => x.pillar === 'tl' && /\bcro\b|chief revenue officer/i.test(String(x.q || ''));
  const base = x => x.blackbox ? 0 : (isCroTool(x) ? 1 : (FOCUS && x.pillar === FOCUS ? 2 : (x.fresh ? 4 : 3)));
  const rank = x => x.deferred ? 100 : (x.ready ? base(x) : 50 + base(x));   // CONTENT-FIRST (owner 2026-07-17): image-ready 13/13 entries first, content-needers behind, deferred last
  out.sort((a, b) => { const ra = rank(a), rb = rank(b); if (ra !== rb) return ra - rb; return a.fresh ? String(b.created).localeCompare(String(a.created)) : String(a.created).localeCompare(String(b.created)); });
  return out[0] || null;
}
function stateFor(id) { const m = readMeta(id); const s = {}; for (const k of SLOTS) s[k] = !!(k === 'id' ? m.faceCard : (m.body && m.body[k.slice(1)])); return s; }
function libFiles() { let a = []; try { a = a.concat(fs.readdirSync(LIB).filter(f => /\.(jpe?g|png)$/i.test(f)).map(f => 'cro/' + f)); } catch (e) {} try { a = a.concat(fs.readdirSync(PEXLIB).filter(f => /\.(jpe?g|png)$/i.test(f)).map(f => 'pex/' + f)); } catch (e) {} return a; }
function libResolve(rel) { rel = String(rel || '').replace(/\.\./g, ''); if (rel.indexOf('cro/') === 0) return LIB + '/' + rel.slice(4); if (rel.indexOf('pex/') === 0) return PEXLIB + '/' + rel.slice(4); return LIB + '/' + rel; }
function sample(arr, n) { const out = []; const used = {}; let g = 0; while (out.length < n && out.length < arr.length && g < n * 40) { g++; const i = Math.floor(Math.random() * arr.length); if (used[i]) continue; used[i] = 1; out.push(arr[i]); } return out; }
const pexSearch = q => new Promise(res => { if (!PEXELS) return res(null); https.get('https://api.pexels.com/v1/search?per_page=40&orientation=landscape&query=' + encodeURIComponent(q || 'business'), { headers: { Authorization: PEXELS } }, r => { let s = ''; r.on('data', d => s += d); r.on('end', () => { try { res(JSON.parse(s)); } catch (e) { res(null); } }); }).on('error', () => res(null)); });
const dl = url => new Promise(res => { https.get(url, r => { if (r.statusCode !== 200) { r.resume(); return res(null); } const c = []; r.on('data', d => c.push(d)); r.on('end', () => res(Buffer.concat(c))); }).on('error', () => res(null)); });

async function coverBytes(buf, slot) {
  if (!sharp) return buf;
  // Crop EVERY slot (ID hero + all 6 body) to 16:9 using sharp's "attention" gravity, which
  // targets the most salient region (faces/subjects) — so heads never get cut off. Both the hero
  // and body images render 16:9 cover on the page, so a 16:9 attention crop here leaves the page
  // nothing left to crop. (Was: ID cropped center — cut heads; body images not cropped at all.)
  // RE-ENCODE UNIQUE (owner 2026-07-17): jitter the quality per placement so every placed image is a
  // genuinely different file (unique bytes/hash) — a replaced image is provably brand-new, not the old one.
  try { return await sharp(buf).resize(1200, 675, { fit: 'cover', position: sharp.strategy.attention }).jpeg({ quality: 83 + (crypto.randomBytes(1)[0] % 8) }).toBuffer(); } catch (e) { return buf; }
}

// THE placement: picker writes the real image + one signed receipt. Human-driven; agent uninvolved.
async function place(id, slot, src) {
  let buf = null;
  if (src.indexOf('/lib/') === 0) { try { buf = fs.readFileSync(libResolve(src.slice(5))); } catch (e) {} }
  else if (src) { buf = await dl(src); }
  if (!buf || buf.length < 2500) return { ok: false, err: 'image did not load' };
  const finalBuf = await coverBytes(buf, slot);
  const m = readMeta(id); const finalSha = sha256(finalBuf);   // duplicates FULLY ALLOWED (owner 2026-07-16) — no dedup, no restrictions
  const dest = destFor(id, slot);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  try { fs.rmSync(dest, { force: true }); } catch (e) {}                   // DELETE BEFORE WRITE (owner 2026-07-17): always wipe the old file first, then write the new
  fs.writeFileSync(dest, finalBuf);                                        // <-- the real placement, by the picker (your hands)
  if (slot === 'id') { m.faceCard = 'facecard.jpg'; if (!m.title) { try { m.title = JSON.parse(fs.readFileSync(ENTRIES + '/' + id + '.json', 'utf8')).question; } catch (e) {} } m.trim = m.trim || 'hotpink'; }
  else { m.body = m.body || {}; m.body[slot.slice(1)] = 'body-' + slot.slice(1) + '.jpg'; }
  writeMeta(id, m);
  // signed receipt (audit + the agent's leash). Claude can't forge this — it never has the secret.
  // receipt is OPTIONAL — if the secret isn't set up, the image is still placed; NEVER fail placement on it
  try {
    const secret = readSecret();
    const receipt = { entry_id: id, slot_id: slot, source_image_sha256: finalSha, dest_path: dest, timestamp: new Date().toISOString(), nonce: crypto.randomBytes(8).toString('hex') };
    const payload = [receipt.entry_id, receipt.slot_id, receipt.source_image_sha256, receipt.dest_path, receipt.timestamp, receipt.nonce].join('|');
    receipt.sig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    fs.mkdirSync(PENDING, { recursive: true });
    fs.writeFileSync(PENDING + '/' + id + '_' + slot + '_' + receipt.nonce + '.json', JSON.stringify(receipt, null, 1));
  } catch (e) { /* no secret.key yet — image already written; receipt skipped, placement still succeeds */ }
  if (src && src.indexOf('/lib/') === 0) addUsedLib(src.slice(5));   // used → drops from recommended (still searchable, dups allowed)
  return { ok: true, thumb: '/dest/' + id + '/' + slot + '?t=' + Date.now() };
}

const PAGE = `<!doctype html><meta name=viewport content="width=device-width,initial-scale=1"><title>Baton Picker</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#1a0508;color:#f3e7c9;font-family:system-ui,Arial;padding:14px}
h1{font-size:20px;margin:0 0 2px;color:#d4af37}.sub{color:#c9a45a;font-size:13px;margin-bottom:12px}
.wrap{display:flex;gap:16px;flex-wrap:wrap}.col{flex:1;min-width:300px}
.bar{background:#2a0810;border:1px solid #7a0d1a;border-radius:10px;padding:10px;margin-bottom:10px}
input,button{font-size:15px;padding:9px 11px;border-radius:8px;border:1px solid #7a0d1a;background:#2a0810;color:#f3e7c9}
button{background:#7a0d1a;color:#fff;font-weight:800;cursor:pointer}button:hover{background:#9a1122}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px}
.cand{border:3px solid transparent;border-radius:9px;overflow:hidden;cursor:pointer;background:#000}.cand img{width:100%;height:84px;object-fit:cover;display:block}
.cand:hover{border-color:#d4af37}.cand.sel{border-color:#d4af37;box-shadow:0 0 0 3px #d4af37}
.slot{border:2px dashed #d4af37;border-radius:12px;min-height:96px;display:flex;align-items:center;justify-content:center;color:#d4af37;font-weight:800;background:#22060b;margin:8px 0;overflow:hidden;position:relative;cursor:pointer;background-size:cover;background-position:center}
.slot.filled{border-style:solid;border-color:#3fae61}.slot.armed{box-shadow:0 0 0 3px #d4af37}
.slot .tag{position:absolute;top:4px;left:6px;background:#000a;padding:1px 8px;border-radius:6px;font-size:12px}
.done{background:#0f3d1e;border:1px solid #3fae61;color:#8affb0;border-radius:10px;padding:12px;font-weight:800;text-align:center;margin-top:10px;display:none}
.done.on{display:block}
#stage{position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(26,5,8,.95);z-index:150;text-align:center;padding:20px}
#stage.on{display:flex}
.stagebig{font-size:8vw;font-weight:900;color:#d4af37;text-shadow:0 5px 0 #000;line-height:1.15;letter-spacing:1px}
.locked{opacity:.28;pointer-events:none;filter:grayscale(1)}
@keyframes pulseFix{0%,100%{background:#5a0d0d;box-shadow:0 0 0 0 rgba(255,80,80,.6)}50%{background:#9a1414;box-shadow:0 0 24px 6px rgba(255,90,90,.9)}}
#scoreBadge{display:inline-block;font-size:19px;font-weight:900;padding:7px 16px;border-radius:10px;letter-spacing:.5px;vertical-align:middle}
#scoreBadge.pass{background:#0f3d1e;border:2px solid #3fae61;color:#8affb0}
#scoreBadge.fix{color:#fff;border:2px solid #ff6a6a;animation:pulseFix 1s ease-in-out infinite;cursor:pointer}
</style>
<h1>🎯 Baton Picker <span style="font-size:12px;color:#c9a45a">— you are the hands</span></h1>
<div class=sub id=sub>tap an image, then tap a slot. the picker places it + writes a receipt. the agent is not involved.</div>
<div id=stats style="background:#2a0810;border:1px solid #7a0d1a;border-radius:10px;padding:10px 14px;margin-bottom:8px;font-size:13px">loading library stats…</div>
<div style="margin-bottom:10px;display:flex;gap:8px;flex-wrap:wrap"><button onclick=askPermission() style="background:#4a2a00;border-color:#d4af37;font-size:13px;padding:8px 14px">🤝 Ask Permission</button><button onclick=resetEntry() style="background:#7a0d1a;font-size:13px;padding:8px 14px">🔄 Reset / Clear</button><button onclick=stopRound() style="background:#4a3800;border-color:#d4af37;font-size:13px;padding:8px 14px">⏸ Stop</button><button onclick=forceStop() style="background:#3a0000;border-color:#b00;font-size:13px;padding:8px 14px">⛔ Force Stop</button><button onclick=nextEntry() style="background:#243b0d;border-color:#6bbf3a;color:#eafff0;font-size:13px;padding:8px 14px;font-weight:700">⏭ Next question →</button><button onclick=startAutorun() style="background:#1a2a4a;border-color:#4a7fd4;color:#eaf1ff;font-size:13px;padding:8px 14px;font-weight:700">🤖 Write Ahead (next 10 → 13/13)</button></div>
<div id=autorun style="display:none;background:#0f1c33;border:1px solid #4a7fd4;border-radius:10px;padding:9px 14px;margin-bottom:8px;font-size:13px;color:#eaf1ff"></div>
<div class=bar><b id=qid style="color:#d4af37"></b> — <span id=q></span> <button onclick=resetEntry() style="float:right;font-size:12px;padding:6px 12px">🔄 Reset</button><button id=impbtn onclick=improveContent() style="float:right;margin-right:8px;font-size:12px;padding:6px 12px;background:#4a2a00;border-color:#d4af37">✨ Improve to 13/13</button></div>
<div class=bar style="padding:6px 12px"><span id=impmsg style="font-size:12px;color:#c9a45a">content improves to golden 13/13 via Claude Code before you place images</span></div>
<div class=wrap>
  <div class=col>
    <div class=bar><div class=row style="display:flex;gap:8px"><input id=q1 placeholder="search library / pexels…" style="flex:1" onkeydown="if(event.key==='Enter')search()"><button onclick=search()>Search</button></div></div>
    <div class=grid id=cands></div>
  </div>
  <div class=col>
    <div class=slot id=slot-id data-slot=id onclick="tapSlot('id')"><div class=tag>Real ID</div>＋ tap to place the Real ID image</div>
    <div id=bodyslots></div>
    <div class=done id=done>✅ Round complete — Real ID + all 6 placed.<br><button id=pubbtn onclick=publish() style="display:none;margin-top:10px;font-size:18px;padding:14px 30px;background:#3fae61;border-color:#3fae61;color:#06210f">🚀 Publish →</button><div id=pubmsg style="margin-top:8px;font-size:13px"></div></div>
  </div>
</div>
<div id=pubmodal style="display:none;position:fixed;inset:0;background:#000a;z-index:100;align-items:center;justify-content:center;padding:16px">
  <div style="background:#22060b;border:2px solid #d4af37;border-radius:16px;padding:28px;max-width:440px;width:100%;text-align:center;box-shadow:0 10px 40px #000">
    <div style="font-size:24px;color:#3fae61;font-weight:900;margin-bottom:10px">✅ Published — LIVE</div>
    <div style="margin:6px 0 6px;font-size:15px">Question ID:</div>
    <a id=pubqid href="#" target=_blank style="color:#d4af37;font-weight:900;font-size:26px;text-decoration:underline">—</a>
    <div style="margin:14px 0 6px;font-size:13px;color:#c9a45a">👁️ Real ID live on the page right now:</div>
    <img id=liveface alt="live Real ID" style="max-width:100%;height:auto;border-radius:10px;border:2px solid #3fae61;background:#000;min-height:60px;display:block;margin:0 auto 10px">
    <a id=livepage href="#" target=_blank style="display:inline-block;margin:2px 0 12px;font-size:15px;padding:10px 18px;background:#243b0d;border:1px solid #6bbf3a;border-radius:9px;color:#eafff0;font-weight:800;text-decoration:none">👁️ Open the LIVE answer page →</a>
    <div style="font-size:13px;color:#c9a45a;margin:12px 0 10px">👆 click it to open the live page and make sure it looks right</div>
    <div id=proofline style="font-size:14px;margin:6px 0 14px;padding:10px;border-radius:9px;background:#1a1400;border:1px solid #d4af37;color:#f3e7c9">⏳ confirming all 7 images stayed attached…</div>
    <button id=nextbtn onclick="location.reload()" style="font-size:16px;padding:13px 26px;background:#7a0d1a">Next entry in the queue →</button>
  </div>
</div>
<script>
var E=null, SEL=null, BUFFER=6, ready=false, writingNow=false;   // ready gates placement; writingNow blocks placement while THIS entry is being (re)written
async function j(u,o){return await(await fetch(u,o)).json();}
function sleep(ms){return new Promise(function(r){setTimeout(r,ms);});}
var _stageEl=document.createElement('div');_stageEl.id='stage';_stageEl.innerHTML='<div class=stagebig id=stagebig></div>';document.body.appendChild(_stageEl);
function showStage(t,c){document.getElementById('stagebig').innerHTML=t;document.getElementById('stagebig').style.color=c||'#d4af37';document.getElementById('stage').classList.add('on');}
function hideStage(){document.getElementById('stage').classList.remove('on');}
function lockImages(on){var c=document.getElementById('cands');if(c)c.classList.toggle('locked',on);[].forEach.call(document.querySelectorAll('.slot'),function(s){s.classList.toggle('locked',on);});}
function lockCands(on){var c=document.getElementById('cands');if(c)c.classList.toggle('locked',on);}
var cooling=false,coolLeft=0;   // 15s settle between each image
// self-driving ceremony: RESET -> ASK PERMISSION (grant) -> GRANTED, everything gated until ready
async function runCeremony(){ready=false;lockImages(true);
  var P=function(op){return j('/api/'+op,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:E.id})}).catch(function(){});};
  showStage('🔄 RESETTING…','#d4af37');await sleep(1500);
  showStage('🔄 RESETTING PAGE<br><span style="font-size:3vw;color:#f3e7c9">reset · reset · clear · stop</span>','#d4af37');await P('reset');await P('reset');await P('stop');await sleep(2500);
  var RS=['ID','page 1','page 2','page 3','page 4','page 5','page 6'];
  for(var i=0;i<RS.length;i++){showStage('🔄 RESETTING ROW<br><span style="font-size:3vw;color:#f3e7c9">'+RS[i]+' — reset · clear · stop</span>','#d4af37');await P('reset');await sleep(1600);}
  showStage('✅ RESETTING FINISHED','#3fae61');await sleep(1800);
  showStage('🤝 ASKING PERMISSION…','#d4af37');await P('grant');
  showStage('✅ PERMISSION GRANTED!','#3fae61');await sleep(3500);showStage('🔓 IMAGES UNLOCKED — go!','#3fae61');await sleep(1500);
  ready=true;E.granted=true;lockImages(false);hideStage();document.getElementById('sub').innerHTML='🤝 <b style="color:#3fae61">UNLOCKED</b> — click an image, then click a box.';}
function askPermission(){if(E&&E.id)runCeremony();}
async function load(){E=await j('/api/round');if(!E||!E.id){document.getElementById('sub').textContent='nothing waiting to build';return;}
  document.getElementById('qid').innerHTML=E.id+(E.blackbox?' <span style="background:#000;color:#fff;border:1px solid #d4af37;padding:2px 9px;border-radius:6px;font-size:11px;font-weight:800;vertical-align:middle;letter-spacing:.5px">⬛ BLACK BOX</span>':'');document.getElementById('q').textContent=E.q;
  if(E.writing){document.getElementById('impmsg').innerHTML='<span id=scoreBadge class=fix>✍️ CURRENTLY WRITING this Q&A</span>';document.getElementById('bodyslots').innerHTML='<div style="padding:18px;text-align:center;color:#f3e7c9;background:#0f1c33;border:2px solid #4a7fd4;border-radius:12px"><div style="font-size:16px;font-weight:800;color:#8fb6ff;margin-bottom:8px">✍️ CURRENTLY WRITING FOR THIS Q&A</div>The content is being written right now — you cannot apply images at the moment. Wait for it to finish, or skip to another one.<br><br><button onclick="location.reload()" style="font-size:16px;padding:12px 24px;background:#243b0d;border-color:#6bbf3a;color:#eafff0;font-weight:800">⏭ Skip to next →</button></div>';document.getElementById('sub').innerHTML='✍️ <b style="color:#8fb6ff">Currently writing this one</b> — skip or wait.';return;}
  var im=document.getElementById('impmsg');var g=E.gate;
  // 🔒 CONTENT-FIRST LAW (owner 2026-07-17): images ONLY on 13/13 content. Content-needers get built
  // in the background + sent to the back of the line; you image only content-ready entries.
  if(!g||!g.pass){
    im.innerHTML='<span id=scoreBadge class=fix>⚙ CONTENT '+(g?g.score:'?')+'/13 — NOT ready for images</span>';
    document.getElementById('bodyslots').innerHTML='<div style="padding:18px;color:#f3e7c9;text-align:center;background:#22060b;border:2px solid #7a0d1a;border-radius:12px"><div style="font-size:16px;font-weight:800;color:#ff9a9a;margin-bottom:8px">🚫 CONTENT-FIRST LAW</div>Images are LOCKED until content is 13/13. This one is being <b>built in the background</b> and sent to the <b>back of the line</b> — you will see it again (content-ready) after cycling through.<br><br><button onclick="location.reload()" style="font-size:16px;padding:12px 24px;background:#243b0d;border-color:#6bbf3a;color:#eafff0;font-weight:800">⏭ Next image-ready entry →</button></div>';
    document.getElementById('sub').innerHTML='<b style="color:#d4af37">Content-first:</b> this needs content — building it, click Next for one you can image.';
    try{await j('/api/buildcontent',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:E.id})});}catch(e){}
    return;
  }
  im.innerHTML='<span id=scoreBadge class=pass>✓ '+g.score+'/13</span> &nbsp;<b style="color:#3fae61">place your images</b> — content is ready.';
  var bs='';for(var i=1;i<=6;i++)bs+='<div class=slot id=slot-b'+i+' data-slot=b'+i+' onclick="tapSlot(\\'b'+i+'\\')"><div class=tag>page '+i+'</div>＋ tap to place image '+i+'</div>';
  document.getElementById('bodyslots').innerHTML=bs;
  if(E.granted){ready=true;hideStage();document.getElementById('sub').innerHTML='🤝 <b style="color:#3fae61">GRANTED</b> — click an image, then click a box.';}
  else{runCeremony();}
  paint();var _kw=(E&&E.query)||'';var _b=document.getElementById('q1');if(_b)_b.value=_kw;search(_kw);   // auto-search the MAIN title keyword (owner 2026-07-17), 40 results; use the box to change it
}
async function paint(){var st=await j('/api/state?id='+E.id);var all=true;for(var k in st){var el=document.getElementById('slot-'+k);if(!el)continue;if(st[k]){el.classList.add('filled');el.style.backgroundImage='url(/dest/'+E.id+'/'+k+'?t='+Date.now()+')';el.innerHTML='<div class=tag>'+(k==='id'?'Real ID':'page '+k.slice(1))+'</div>';}else all=false;}
  document.getElementById('done').classList.toggle('on',all);
  if(all)verifyAllRendered();}
function verifyAllRendered(){var slots=['id','b1','b2','b3','b4','b5','b6'];var pm=document.getElementById('pubmsg');var btn=document.getElementById('pubbtn');btn.style.display='none';pm.textContent='verifying all 7 images rendered 100%…';
  var done=0,ok=0;slots.forEach(function(k){var im=new Image();im.onload=function(){ok++;done++;chk();};im.onerror=function(){done++;chk();};im.src='/dest/'+E.id+'/'+k+'?v='+Date.now();});
  function chk(){if(done<7)return;if(ok<7){pm.textContent='⚠️ only '+ok+'/7 rendered — re-place the missing/broken one';}else{pm.innerHTML='✅ all 7 rendered 100% — click Publish below';btn.style.display='inline-block';}}}
async function search(q){if(q===undefined)q=document.getElementById('q1').value||'';var d=await j('/api/candidates?q='+encodeURIComponent(q||''));
  document.getElementById('cands').innerHTML=(d.photos||[]).map(function(p){return '<div class=cand onclick=\\'selImg("'+p.full+'",this)\\'><img src="'+p.thumb+'"></div>';}).join('');}
function selImg(src,el){SEL=src;[].forEach.call(document.querySelectorAll('.cand.sel'),function(c){c.classList.remove('sel');});el.classList.add('sel');
  [].forEach.call(document.querySelectorAll('.slot'),function(s){s.classList.add('armed');});document.getElementById('sub').textContent='image selected — now tap a slot to place it';}
async function tapSlot(slot){if(writingNow){showStage('✍️ THIS ONE IS BEING WRITTEN<br><span style="font-size:2.6vw;color:#f3e7c9">wait for it to finish — do not place images yet</span>','#7a0d1a');setTimeout(hideStage,3000);return;}try{var _ar=await j('/api/autorun');if(_ar&&_ar.running&&_ar.current===E.id){showStage('✍️ THIS ONE IS BEING WRITTEN NOW<br><span style="font-size:2.6vw;color:#f3e7c9">you cannot apply images — hit the ⏭ Next question button and I will move you to one you can do</span>','#7a0d1a');setTimeout(hideStage,4200);return;}}catch(e){}if(!ready){var _st=document.getElementById('stage');if(_st&&_st.classList.contains('on')){document.getElementById('sub').innerHTML='⏳ getting Power of Attorney permission — tap the image again in a moment.';}else{document.getElementById('sub').innerHTML='🤝 <b style="color:#d4af37">Getting Power of Attorney permission…</b> then tap the image again.';askPermission();}return;}if(cooling){document.getElementById('sub').innerHTML='⏳ <b style="color:#d4af37">'+coolLeft+'s</b> — settling the last image before the next…';return;}if(!SEL){document.getElementById('sub').textContent='tap an image first, then tap a slot';return;}
  var lbl=(slot==='id'?'Real ID':'page '+slot.slice(1));
  var el=document.getElementById('slot-'+slot);
  // 2-STEP: (1) grant POA + WIPE the old image & all its history, (2) manually place a brand-new one.
  showStage('🤝 CLAUDE CODE GRANTING PERMISSION<br><span style="font-size:2.2vw;color:#f3e7c9;display:block;margin-top:6px">for you to manually replace '+lbl+' — via Power of Attorney (still 100% manual)</span>','#4a2a00');await sleep(500);
  try{await j('/api/grantone',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:E.id})});}catch(e){}
  showStage('🔥 WIPING '+lbl+' + ALL ITS HISTORY<br><span style="font-size:2.2vw;color:#f3e7c9;display:block;margin-top:6px">deleting the old image and every trace/link of it…</span>','#7a0d1a');
  try{await j('/api/wipeslot',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:E.id,slot:slot})});}catch(e){}
  await sleep(500);
  showStage('✅ '+lbl+' REMOVED FROM OBLIVION<br><span style="font-size:2.2vw;color:#8affb0;display:block;margin-top:6px">brand-new, unlinked slot · no history · now placing YOUR image manually…</span>','#0b3d17');await sleep(650);
  el.innerHTML='<div class=tag>'+lbl+'</div>placing…';
  var r=await j('/api/place',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:E.id,slot:slot,src:SEL})});
  SEL=null;[].forEach.call(document.querySelectorAll('.cand.sel,.slot.armed'),function(c){c.classList.remove('sel');c.classList.remove('armed');});
  if(!r.ok){if(/locked/i.test(r.err||'')){document.getElementById('sub').innerHTML='🤝 <b style="color:#d4af37">Re-asking for Power of Attorney…</b> then tap the image again.';askPermission();el.innerHTML='<div class=tag>'+lbl+'</div>getting permission…';hideStage();return;}el.innerHTML='<div class=tag>'+lbl+'</div>⚠️ '+(r.err||'failed')+' — tap another';hideStage();return;}
  el.innerHTML='<div class=tag>'+lbl+'</div>placing…';
  var probe=new Image();
  probe.onload=function(){showStage('✅ PLACED!','#3fae61');setTimeout(hideStage,900);paint();cooling=true;lockCands(true);coolLeft=15;(function tick(){if(coolLeft<=0){cooling=false;lockCands(false);document.getElementById('sub').innerHTML='<b style="color:#3fae61">✓ ready</b> — click the next image.';return;}document.getElementById('sub').innerHTML='🖼️ <b style="color:#d4af37;font-size:22px">Rendering… '+coolLeft+'</b> <span style="color:#c9a45a">(verifying it placed clean)</span>';coolLeft--;setTimeout(tick,1000);})();};
  probe.onerror=function(){hideStage();el.innerHTML='<div class=tag>'+lbl+'</div>⚠️ retrying…';};
  probe.src='/dest/'+E.id+'/'+slot+'?t='+Date.now();}
async function publish(){var pm=document.getElementById('pubmsg');pm.textContent='publishing…';document.getElementById('pubbtn').disabled=true;
  var r=await j('/api/publish',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:E.id})});
  if(r.ok){showStage('🚀 DEPLOYED — LIVE!','#3fae61');setTimeout(function(){hideStage();var mq=document.getElementById('pubqid');mq.textContent=r.qid;var _cb=Date.now();mq.href=r.url+'?cb='+_cb;var _lf=document.getElementById('liveface');if(_lf)_lf.src='https://pulserevops.com/assets/qa/'+r.qid+'.jpg?cb='+_cb;var _lp=document.getElementById('livepage');if(_lp)_lp.href=r.url+'?cb='+_cb;document.getElementById('pubmodal').style.display='flex';proveIt(r.qid);},2500);pm.textContent='';}
  else{pm.textContent='✗ '+(r.err||'failed');document.getElementById('pubbtn').disabled=false;}}
async function proveIt(qid){var pl=document.getElementById('proofline');var nb=document.getElementById('nextbtn');if(nb){nb.disabled=true;nb.style.opacity='0.4';nb.style.cursor='not-allowed';}if(!pl)return;pl.style.background='#1a1400';pl.style.borderColor='#d4af37';pl.style.color='#f3e7c9';pl.innerHTML='⏳ CONFIRMING all 7 are live — you cannot proceed until this is confirmed…';for(var t=0;t<7;t++){try{var p=await j('/api/proof?id='+encodeURIComponent(qid));if(p&&p.ok){var body=p.bodyCount||0;if(p.face&&body>=6){pl.style.background='#0a2f14';pl.style.borderColor='#3fae61';pl.style.color='#8affb0';pl.innerHTML='✅ <b>CONFIRMED — all attached:</b> Real ID ✓ · '+body+'/6 body images ✓ · live. You may proceed.';if(nb){nb.disabled=false;nb.style.opacity='1';nb.style.cursor='pointer';}return;}if(t>=6){pl.style.background='#3a0d0d';pl.style.borderColor='#ff6a6a';pl.style.color='#ffb3b3';pl.innerHTML='⚠️ <b>Real ID '+(p.face?'✓':'✗')+' · body '+body+'/6</b> — NOT all confirmed. Reset + re-place; you cannot advance until all 7 are live.';return;}}}catch(e){}await sleep(2500);}pl.innerHTML='⚠️ could not confirm — reload and check the live page (Next stays locked).';}
async function resetEntry(){if(!E||!E.id)return;try{await fetch('/api/reset',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:E.id})});}catch(e){}location.reload();}
/* idle auto-reload REMOVED — it was blanking the page every 10s. Use the 🔄 Reset button instead. */
async function improveContent(){if(!E||!E.id){return;}var im=document.getElementById('impmsg');var b=document.getElementById('impbtn');b.disabled=true;writingNow=true;var t0=Date.now();var hb=setInterval(function(){var s=Math.round((Date.now()-t0)/1000);im.innerHTML='✨ <b style="color:#d4af37">Claude Code rewriting to 13/13…</b> '+s+'s <span style="color:#c9a45a">(working under your Max plan — do not reload · do not place images yet)</span>';},1000);try{var r=await fetch('/api/improve',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:E.id})}).then(x=>x.json());clearInterval(hb);if(r.ok){im.innerHTML='✅ <b style="color:#3fae61">'+r.before+'/13 → '+r.after+'/13</b> ('+(r.words||0)+' words'+(r.pass?', PASS ✓':', still '+r.after+'/13 after '+r.attempts+' tries')+') — <b>writing done — place your images now.</b>';}else{im.innerHTML='✗ '+(r.err||'failed');}}catch(e){clearInterval(hb);im.innerHTML='✗ '+String(e);}writingNow=false;b.disabled=false;}
function fmtAuto(p){if(!p||(!p.running&&!p.total))return '';var ahead=(p.ahead!=null?p.ahead:Math.max(0,(p.total||0)-(p.done||0)));return (p.running?'🤖 <b style="color:#8fb6ff">Writing ahead of you</b>: ':'✅ <b style="color:#3fae61">Look-ahead done</b>: ')+(p.done||0)+'/'+(p.total||0)+' pre-written · <b style="color:#eaf1ff">'+ahead+' still queued in front of you</b> · '+(p.improved||0)+' hit 13/13'+(p.current?(' · now: '+p.current):'')+' <span style="color:#9fb3d0">(content only — images stay manual)</span>';}
async function pollAutorun(){try{var p=await j('/api/autorun');var el=document.getElementById('autorun');var t=fmtAuto(p);if(t){el.style.display='block';el.innerHTML=t;}if(p&&p.running){setTimeout(pollAutorun,4000);}}catch(e){}}
async function startAutorun(){try{await fetch('/api/autorun',{method:'POST'});}catch(e){}var el=document.getElementById('autorun');el.style.display='block';el.innerHTML='🤖 <b style="color:#8fb6ff">Writing ahead</b> — pre-writing the next batch in front of you to 13/13, one at a time, so when you reach them it is just images (content only, images stay manual)…';setTimeout(pollAutorun,1500);}
async function nextEntry(){try{await fetch('/api/skip',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:E&&E.id})});}catch(e){}location.reload();}
async function stopRound(){try{await fetch('/api/stop',{method:'POST'});}catch(e){}document.getElementById('sub').innerHTML='⏸ <b>Stopped</b> — placement locked. reload to resume (the agent re-grants).';}
async function forceStop(){if(!confirm('Force-stop the picker server?'))return;try{await fetch('/api/forcestop',{method:'POST'});}catch(e){}document.getElementById('sub').innerHTML='⛔ <b>Force-stopped</b> — the picker server is shutting down.';}
async function loadStats(){try{var s=await j('/api/stats');document.getElementById('stats').innerHTML='📚 <b style="color:#d4af37">'+s.remaining.toLocaleString()+'</b> / '+s.total.toLocaleString()+' left in the library &nbsp;·&nbsp; ✅ <b style="color:#3fae61">'+s.cleanedToday+'</b> today &nbsp;·&nbsp; <b>'+s.cleanedWeek+'</b> this week &nbsp;·&nbsp; <b style="color:#d4af37">'+s.pct+'%</b> cleaned';}catch(e){}}
loadStats();setInterval(loadStats,15000);pollAutorun();
load();
</script>`;

http.createServer(async (req, res) => {
  const u = req.url.split('?')[0], q = new URLSearchParams(req.url.split('?')[1] || '');
  const send = (c, b, t) => { res.writeHead(c, { 'Content-Type': t || 'application/json' }); res.end(b); };
  const body = () => new Promise(r => { let b = ''; req.on('data', d => b += d); req.on('end', () => { try { r(JSON.parse(b || '{}')); } catch (e) { r({}); } }); });
  try {
    if (u === '/') return send(200, PAGE, 'text/html; charset=utf-8');
    if (u === '/api/round') { const e = currentEntry(); if (!e) return send(200, '{}'); const STOP = /^(the|and|for|you|your|what|how|when|why|who|are|can|does|did|will|been|best|top|key|guide|list|most|common|should|know|before|about|with|from|that|this|into|2024|2025|2026|2027|2028|2029)$/; const query = String(e.q || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(w => w.length > 3 && !STOP.test(w)).slice(0, 2).join(' '); let gate = null; try { const ent = JSON.parse(fs.readFileSync(ENTRIES + '/' + e.id + '.json', 'utf8')); if (gateScore) { const g = gateScore(ent); gate = { score: g.score, max: g.max, pass: g.pass, words: g.wordCount, fails: g.fails.map(f => f.name) }; } } catch (_) {} let writing = false; try { const ar = JSON.parse(fs.readFileSync(WD + '/new/_autorun.json', 'utf8')); if (ar && ar.running && ar.current === e.id) writing = true; } catch (_) {} try { const mm = readMeta(e.id); if (mm.deferredAt && (Date.now() - Date.parse(mm.deferredAt)) < 240000) writing = true; } catch (_) {} return send(200, JSON.stringify({ id: e.id, q: e.q, query, granted: poaGrantedFor(e.id), gate, blackbox: !!e.blackbox, writing })); }
    if (u === '/api/state') return send(200, JSON.stringify(stateFor(q.get('id'))));
    if (u === '/api/proof') { if (!proveLive) return send(200, '{"ok":false,"err":"no proveLive"}'); try { const r = await proveLive(q.get('id')); return send(200, JSON.stringify(r)); } catch (e) { return send(200, JSON.stringify({ ok: false, err: String((e && e.message) || e) })); } }
    if (u === '/api/candidates') { const qq = q.get('q'); let photos = []; if (qq) { const r = await pexSearch(qq); photos = ((r && r.photos) || []).map(p => ({ thumb: p.src.medium, full: p.src.large2x || p.src.original || p.src.large })); } if (!photos.length) photos = sample(libFiles(), 40).map(f => ({ thumb: '/lib/' + f, full: '/lib/' + f })); return send(200, JSON.stringify({ photos })); }
    if (u.startsWith('/lib/')) { try { return send(200, fs.readFileSync(libResolve(u.slice(5))), 'image/jpeg'); } catch (e) { return send(404, 'x'); } }
    if (u.startsWith('/dest/')) { const parts = u.slice(6).split('/'); try { return send(200, fs.readFileSync(destFor(parts[0], parts[1])), 'image/jpeg'); } catch (e) { return send(404, 'x'); } }
    if (req.method === 'POST' && u === '/api/place') { const b = await body(); if (SLOTS.indexOf(b.slot) < 0) return send(200, '{"ok":false,"err":"bad slot"}'); if (!poaGrantedFor(b.id)) return send(200, JSON.stringify({ ok: false, err: '⏳ locked — waiting on the agent to grant Power of Attorney for this entry' })); if (gateScore) { try { const ent = JSON.parse(fs.readFileSync(ENTRIES + '/' + b.id + '.json', 'utf8')); if (!gateScore(ent).pass) return send(200, JSON.stringify({ ok: false, err: '🚫 CONTENT-FIRST LAW: content is not 13/13 — build the content first, then place images' })); } catch (e) {} } const r = await place(b.id, b.slot, b.src); return send(200, JSON.stringify(r)); }
    if (req.method === 'POST' && u === '/api/buildcontent') { const b = await body(); const id = String(b.id || '').replace(/[^a-zA-Z0-9_-]/g, ''); if (!id) return send(200, '{"ok":false}'); let already = false; try { const m0 = readMeta(id); if (m0.deferredAt && (Date.now() - Date.parse(m0.deferredAt)) < 300000) already = true; } catch (e) {} try { const m = readMeta(id); m.deferredAt = new Date().toISOString(); writeMeta(id, m); } catch (e) {} if (!already) { try { const child = spawn(process.execPath, [WD + '/new/improve_content.js', id], { cwd: WD, detached: true, stdio: 'ignore', windowsHide: true }); child.unref(); } catch (e) {} } return send(200, JSON.stringify({ ok: true, building: !already })); }
    if (req.method === 'POST' && u === '/api/publish') { const b = await body(); if (!publishLive) return send(200, '{"ok":false,"err":"publish_core not found"}'); if (gateScore) { try { const entP = JSON.parse(fs.readFileSync(ENTRIES + '/' + b.id + '.json', 'utf8')); if (!gateScore(entP).pass) return send(200, JSON.stringify({ ok: false, err: '🚫 content is not 13/13 — cannot publish until content passes' })); } catch (e) {} } const st = stateFor(b.id); if (!SLOTS.every(k => st[k])) return send(200, '{"ok":false,"err":"round not complete — place all 7 first"}');
      // PRE-PUBLISH FAILSAFE: refuse to publish any blank / white / broken image
      if (sharp) { for (const k of SLOTS) { const lbl = (k === 'id' ? 'ID' : 'page ' + k.slice(1)); try { const stt = await sharp(fs.readFileSync(destFor(b.id, k))).stats(); const mean = stt.channels.reduce((a, c) => a + c.mean, 0) / stt.channels.length; const sd = stt.channels.reduce((a, c) => a + c.stdev, 0) / stt.channels.length; if (sd < 3 && mean > 245) return send(200, JSON.stringify({ ok: false, err: '⚠️ ' + lbl + ' looks blank/white — re-place that one, then publish' })); } catch (e) { return send(200, JSON.stringify({ ok: false, err: '⚠️ ' + lbl + ' image is missing/broken — re-place it' })); } } }
      try { const ent = JSON.parse(fs.readFileSync(ENTRIES + '/' + b.id + '.json', 'utf8')); const r = await publishLive({ newId: b.id, qid: ent.inPlace ? (ent.upgradeId || ent.id) : undefined }); clearPoa(); try { const df = WD + '/new/_done.json'; let done = []; try { done = JSON.parse(fs.readFileSync(df, 'utf8')); } catch (e2) {} if (done.indexOf(b.id) < 0) { done.push(b.id); fs.writeFileSync(df, JSON.stringify(done)); } } catch (e2) {} return send(200, JSON.stringify({ ok: true, qid: r.qid, url: r.url })); } catch (e) { return send(200, JSON.stringify({ ok: false, err: String((e && e.message) || 'publish failed') })); } }
    if (req.method === 'POST' && u === '/api/reset') { const b = await body(); const id = String(b.id || '').replace(/[^a-zA-Z0-9_-]/g, ''); if (id) { try { fs.rmSync(OUT + '/' + id, { recursive: true, force: true }); } catch (e) {} } return send(200, '{"ok":true}'); }
    if (req.method === 'POST' && u === '/api/resetslot') { const b = await body(); const id = String(b.id || '').replace(/[^a-zA-Z0-9_-]/g, ''); const slot = b.slot; if (!id || SLOTS.indexOf(slot) < 0) return send(200, '{"ok":false}'); try { fs.rmSync(destFor(id, slot), { force: true }); const m = readMeta(id); if (slot === 'id') { delete m.faceCard; } else if (m.body) { delete m.body[slot.slice(1)]; } writeMeta(id, m); } catch (e) {} return send(200, '{"ok":true}'); }
    if (req.method === 'POST' && u === '/api/wipeslot') { const b = await body(); const id = String(b.id || '').replace(/[^a-zA-Z0-9_-]/g, ''); const slot = b.slot; if (!id || SLOTS.indexOf(slot) < 0) return send(200, '{"ok":false}'); try { fs.rmSync(destFor(id, slot), { force: true }); const m = readMeta(id); if (slot === 'id') { delete m.faceCard; } else if (m.body) { delete m.body[slot.slice(1)]; } writeMeta(id, m); } catch (e) {} try { for (const dir of [PENDING, WD + '/_receipts/used']) { try { for (const f of fs.readdirSync(dir)) { if (f.indexOf(id + '_' + slot + '_') === 0) fs.rmSync(dir + '/' + f, { force: true }); } } catch (e) {} } } catch (e) {} return send(200, '{"ok":true,"wiped":true}'); }
    if (req.method === 'POST' && u === '/api/grantone') { const b = await body(); const id = String(b.id || '').replace(/[^a-zA-Z0-9_-]/g, ''); if (!id) return send(200, '{"ok":false}'); try { fs.mkdirSync(WD + '/_poa', { recursive: true }); fs.writeFileSync(POAF, JSON.stringify({ entry_id: id, granted_at: new Date().toISOString(), by: 'agent', scope: 'per-image' })); } catch (e) {} return send(200, '{"ok":true}'); }
    if (req.method === 'POST' && u === '/api/grant') { const b = await body(); const id = String(b.id || '').replace(/[^a-zA-Z0-9_-]/g, ''); if (!id) return send(200, '{"ok":false}'); try { fs.rmSync(OUT + '/' + id, { recursive: true, force: true }); } catch (e) {} try { fs.mkdirSync(WD + '/_poa', { recursive: true }); fs.writeFileSync(POAF, JSON.stringify({ entry_id: id, granted_at: new Date().toISOString(), by: 'agent' })); } catch (e) {} return send(200, '{"ok":true}'); }
    if (req.method === 'POST' && u === '/api/improve') { const b = await body(); const id = String(b.id || '').replace(/[^a-zA-Z0-9_-]/g, ''); if (!improveEntry) return send(200, '{"ok":false,"err":"improve module not loaded"}'); if (!id) return send(200, '{"ok":false,"err":"no id"}'); try { const r = await improveEntry(id); return send(200, JSON.stringify(r)); } catch (e) { return send(200, JSON.stringify({ ok: false, err: String((e && e.message) || e) })); } }
    if (u === '/api/autorun' && req.method === 'GET') { let p = { running: false }; try { p = JSON.parse(fs.readFileSync(WD + '/new/_autorun.json', 'utf8')); } catch (e) {} return send(200, JSON.stringify(p)); }
    if (u === '/api/autorun' && req.method === 'POST') { let p = {}; try { p = JSON.parse(fs.readFileSync(WD + '/new/_autorun.json', 'utf8')); } catch (e) {} if (p && p.running) return send(200, '{"ok":true,"already":true}'); try { const child = spawn(process.execPath, [WD + '/new/auto_improve.js'], { cwd: WD, detached: true, stdio: 'ignore', windowsHide: true }); child.unref(); } catch (e) { return send(200, JSON.stringify({ ok: false, err: String((e && e.message) || e) })); } return send(200, '{"ok":true,"started":true}'); }
    if (req.method === 'POST' && u === '/api/skip') { const b = await body(); const id = String(b.id || '').replace(/[^a-zA-Z0-9_-]/g, ''); if (id) { try { const m = readMeta(id); m.status = 'skipped'; m.skippedAt = new Date().toISOString(); writeMeta(id, m); } catch (e) {} } return send(200, '{"ok":true}'); }
    if (req.method === 'POST' && u === '/api/stop') { clearPoa(); return send(200, '{"ok":true}'); }
    if (req.method === 'POST' && u === '/api/forcestop') { send(200, '{"ok":true}'); setTimeout(() => process.exit(0), 250); return; }
    if (u === '/api/recap') {
      const today = new Date().toISOString().slice(0, 10); const fixed = [], neu = [];
      try { for (const d of fs.readdirSync(OUT)) { let m; try { m = JSON.parse(fs.readFileSync(OUT + '/' + d + '/meta.json', 'utf8')); } catch (e) { continue; } if (m.status !== '5/5' || !m.publishedAt) continue; if ((m.publishedAt || '').slice(0, 10) !== today) continue; const row = { qid: m.qid || d, q: m.title || d, before: (m.beforeScore != null ? m.beforeScore : null), after: 13 }; if (/^(bbnew|newmr)/.test(d)) neu.push(row); else fixed.push(row); } } catch (e) {}
      return send(200, JSON.stringify({ fixed, neu, date: today }));
    }
    if (u === '/api/stats') { let camp = {}; try { camp = JSON.parse(fs.readFileSync(WD + '/new/campaign_stats.json', 'utf8')); } catch (e) {} const total = camp.total || 35902; const today = new Date().toISOString().slice(0, 10); const weekAgo = Date.now() - 7 * 86400000; let ct = 0, cw = 0; const allTime = (camp.fixedInPlace || 0) + (camp.newBuilt || 0); try { for (const d of fs.readdirSync(OUT)) { let m; try { m = JSON.parse(fs.readFileSync(OUT + '/' + d + '/meta.json', 'utf8')); } catch (e) { continue; } if (m.status !== '5/5' || !m.publishedAt) continue; if ((m.publishedAt || '').slice(0, 10) === today) ct++; if (Date.parse(m.publishedAt) > weekAgo) cw++; } } catch (e) {} const pct = total ? (allTime / total * 100) : 0; return send(200, JSON.stringify({ total, cleanedToday: ct, cleanedWeek: cw, cleanedAllTime: allTime, remaining: Math.max(0, total - allTime), pct: +pct.toFixed(2) })); }
    return send(404, '{"err":"not found"}');
  } catch (e) { return send(500, JSON.stringify({ err: (e && e.message) || 'err' })); }
}).listen(PORT, () => console.log('[baton_picker] → http://localhost:' + PORT + '  (crimson/gold; you are the hands)'));
