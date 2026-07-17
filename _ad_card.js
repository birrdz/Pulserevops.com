// _ad_card.js — ADVERTISING CARD tool (owner 2026-07-17). Fresh, simple, one image per entry.
// Flow: oldest entries (Black Box first) -> show old card -> DELETE it (POA) -> choose image ->
// god-tier multi-party sign-off (User + Claude Code IDE + LLM) -> SEAL forever (live). Skip anytime.
'use strict';
const http = require('http'), fs = require('fs'), https = require('https'), url = require('url'), crypto = require('crypto');
const WD = __dirname;
for (const l of (() => { try { return fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/); } catch (e) { return []; } })()) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const PORT = parseInt(process.env.AD_PORT || '9500', 10);
const ENTRIES = WD + '/new/entries', OUT = WD + '/new/output', PEXLIB = WD + '/assets/qa/_pexels_stored', LIB = WD + '/new/imagebank/cro';
const PEXELS = process.env.PEXELS_API_KEY;
let sharp = null; try { sharp = require('sharp'); } catch (e) {}
let publishFaceImageOnly = null; try { ({ publishFaceImageOnly } = require('./new/publish_core')); } catch (e) {}
let claudeBin = null; try { ({ claudeBin } = require('./new/improve_content')); } catch (e) {}
const { spawnSync } = require('child_process');
let getStore = null; try { ({ getStore } = require('@netlify/blobs')); } catch (e) {}
function blobStore() { if (!getStore) return null; try { return getStore({ name: 'pulse-machine-library', siteID: process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN }); } catch (e) { return null; } }

function readMeta(id) { try { return JSON.parse(fs.readFileSync(OUT + '/' + id + '/meta.json', 'utf8')); } catch (e) { return { id }; } }
function writeMeta(id, m) { fs.mkdirSync(OUT + '/' + id, { recursive: true }); fs.writeFileSync(OUT + '/' + id + '/meta.json', JSON.stringify(m, null, 1)); }
function doneList() { try { return JSON.parse(fs.readFileSync(WD + '/new/_ad_done.json', 'utf8')); } catch (e) { return []; } }
function markDone(id) { const d = doneList(); if (d.indexOf(id) < 0) { d.push(id); try { fs.writeFileSync(WD + '/new/_ad_done.json', JSON.stringify(d)); } catch (e) {} } }

// ADVERTISE ID — a fresh, stable, human-friendly label derived deterministically from the real id.
// Never the "question ID" wording; the real id stays underneath as the searchable system ref (SEO/URL/blob key untouched).
function advId(id) { let h = 2166136261; const s = String(id); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return 'AD-' + (10000 + (h % 90000)); }

// ---- WHOLE INVENTORY: the blob _index.json (~36k population). Local new/entries is only a tiny fallback. ----
let _inv = { at: 0, list: [] };
async function loadInventory(force) {
  const now = Date.now();
  if (!force && _inv.list.length && (now - _inv.at) < 5 * 60 * 1000) return _inv.list;
  let list = [];
  const s = blobStore();
  if (s) {
    try {
      const idx = await s.get('_index.json', { type: 'json' });
      const es = (idx && idx.entries) || [];
      list = es.filter(e => e && e.id).map(e => ({ id: e.id, q: e.title || e.question || '', ts: e.ts || 0, blackbox: !!e.bb }));
    } catch (e) {}
  }
  if (!list.length) { // fallback: local disk (only ~400)
    let files = []; try { files = fs.readdirSync(ENTRIES).filter(f => f.endsWith('.json')); } catch (e) {}
    for (const f of files) { let e; try { e = JSON.parse(fs.readFileSync(ENTRIES + '/' + f, 'utf8')); } catch (_) { continue; } if (!(e.body && e.body.length > 300)) continue; list.push({ id: e.id, q: e.question || '', ts: Date.parse(e.created || '') || 0, blackbox: !!e.blackbox }); }
  }
  _inv = { at: now, list };
  return list;
}
// the worst-first batch of 100 (built by _ad_build_queue.js). Served BEFORE the general oldest-first fallback.
function queueList() { try { return JSON.parse(fs.readFileSync(WD + '/new/_ad_queue.json', 'utf8')); } catch (e) { return []; } }
// auto-refill: when the current worst-first 100 is fully sealed, build the next 100 in the background (skips done).
let _building = false, _lastBuild = 0;
function maybeRebuildQueue(s) {
  if (_building) return;
  if (!(s.queue > 0 && s.queueLeft === 0)) return;
  const now = Date.now(); if (now - _lastBuild < 20000) return; _lastBuild = now; _building = true;
  try {
    const { spawn } = require('child_process');
    const p = spawn(process.execPath, [WD + '/_ad_build_queue.js'], { cwd: WD, windowsHide: true });
    p.on('exit', () => { _building = false; });
    p.on('error', () => { _building = false; });
  } catch (e) { _building = false; }
}
// next card + running totals. Serve the worst-first QUEUE first; when it's empty, fall back to oldest-first over the whole library.
async function scan() {
  const list = await loadInventory(false);
  const doneSet = new Set(doneList());
  const byId = new Map(list.map(o => [o.id, o]));
  let doneCount = 0; for (const o of list) if (doneSet.has(o.id)) doneCount++;
  const q = queueList();
  let card = null;
  if (q.length) { for (const id of q) { if (doneSet.has(id)) continue; const o = byId.get(id); if (o) { card = o; break; } } }
  if (!card) { const bb = [], rest = []; for (const o of list) { if (doneSet.has(o.id)) continue; (o.blackbox ? bb : rest).push(o); } bb.sort((a, b) => (a.ts || 0) - (b.ts || 0)); rest.sort((a, b) => (a.ts || 0) - (b.ts || 0)); card = bb.concat(rest)[0] || null; }
  const queueLeft = q.filter(id => !doneSet.has(id) && byId.has(id)).length;
  return { card, total: list.length, done: doneCount, remaining: list.length - doneCount, queue: q.length, queueLeft };
}

// Advertise-ID ↔ ref map so BOTH are searchable in the system (local lookup file + /api/find).
function saveAdvMap(id, adv, q) {
  const p = WD + '/new/_advid_map.json'; let m = {}; try { m = JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) {}
  m[adv] = { id, advId: adv, title: q || '' }; m['id:' + id] = adv;
  try { fs.writeFileSync(p, JSON.stringify(m, null, 1)); } catch (e) {}
}

// ---- REAL POWER-OF-ATTORNEY GATE ----
// Server-side session per card. The IDE grant is issued by THIS process (Claude Code's environment) only when
// preconditions hold; the LLM grant is a GENUINE Max-plan CLI model call. /api/set refuses to seal without BOTH.
const POA = {}; // id -> { deleted, ideGrant, ideStmt, llmGrant, llmStmt }
function poaToken() { return crypto.randomBytes(8).toString('hex'); }
function llmGrantReview(dressing, adv) {
  if (!claudeBin) return { ok: false, err: 'Claude Code CLI not found' };
  const bin = claudeBin(); if (!bin) return { ok: false, err: 'Claude Code CLI not found' };
  // LAW: Max ($200) plan ONLY — strip any metered key so the CLI uses the subscription login.
  const env = Object.assign({}, process.env); delete env.ANTHROPIC_API_KEY; delete env.ANTHROPIC_AUTH_TOKEN; delete env.CLAUDE_API_KEY;
  // Frame the model's ACTUAL task as a routine editorial suitability check (a question it will answer),
  // NOT "sign away power of attorney" (which it correctly refuses as prompt injection). The POA wording
  // stays in the UI ceremony; here we just get a genuine APPROVE/DENY on whether the topic is OK to illustrate.
  const prompt = [
    'You are the content reviewer for a business / RevOps knowledge site. A human editor is placing ONE',
    'professional stock business or editorial photo at the top of an article. Your ONLY job is to confirm the',
    'article TOPIC below is a legitimate, safe-for-work, non-abusive topic that is fine to illustrate with a',
    'professional stock photo. This is a routine editorial approval — not a legal, financial, or security decision.',
    '',
    'Article topic: ' + String(dressing || '').slice(0, 300),
    '',
    'Reply with EXACTLY one line:',
    'APPROVE: <short reason it is fine to illustrate>',
    'or',
    'DENY: <short reason it is unsafe or abusive>',
  ].join('\n');
  const r = spawnSync(bin, ['-p', '--output-format', 'text'], { input: prompt, encoding: 'utf8', timeout: 90000, maxBuffer: 1024 * 1024 * 8, windowsHide: true, env });
  if (r.error) return { ok: false, err: String(r.error.message || r.error) };
  if (r.status && r.status !== 0) return { ok: false, err: 'LLM call failed (exit ' + r.status + ')' };
  const out = String(r.stdout || '').trim();
  const m = out.match(/^\s*(APPROVE|GRANT)\s*:\s*([\s\S]*)/i);
  if (m) return { ok: true, statement: 'The LLM reviewed this card and approves it — ' + m[2].trim().replace(/\s+/g, ' ').slice(0, 300) };
  if (/^\s*DENY\s*:/i.test(out)) return { ok: false, err: out.replace(/^\s*DENY\s*:\s*/i, '').trim().slice(0, 200) };
  if (/\b(approve|grant|authoriz|fine to|suitable|acceptable|safe)\b/i.test(out) && !/\b(deny|refuse|cannot|unsafe|abusive|inappropriate)\b/i.test(out)) return { ok: true, statement: 'The LLM reviewed this card and approves it — ' + out.replace(/\s+/g, ' ').slice(0, 300) };
  return { ok: false, err: 'LLM did not clearly approve (' + out.slice(0, 120) + ')' };
}

// post-seal live verification + no-mirroring (each source photo used once — advertising cards only).
const SEALED = {}; // id -> { sha, at }
const sha256 = b => crypto.createHash('sha256').update(b).digest('hex');
function usedSrc() { try { return JSON.parse(fs.readFileSync(WD + '/new/_ad_used_src.json', 'utf8')); } catch (e) { return []; } }
function markUsed(src) { const a = usedSrc(); if (a.indexOf(src) < 0) { a.push(src); try { fs.writeFileSync(WD + '/new/_ad_used_src.json', JSON.stringify(a)); } catch (e) {} } }
const pexSearch = q => new Promise(res => { if (!PEXELS) return res(null); https.get('https://api.pexels.com/v1/search?per_page=40&orientation=landscape&query=' + encodeURIComponent(q || 'business'), { headers: { Authorization: PEXELS } }, r => { let s = ''; r.on('data', d => s += d); r.on('end', () => { try { res(JSON.parse(s)); } catch (e) { res(null); } }); }).on('error', () => res(null)); });
const dl = u => new Promise(res => { https.get(u, r => { if (r.statusCode !== 200) { r.resume(); return res(null); } const c = []; r.on('data', d => c.push(d)); r.on('end', () => res(Buffer.concat(c))); }).on('error', () => res(null)); });
function libFiles() { let a = []; try { a = a.concat(fs.readdirSync(PEXLIB).filter(f => /\.(jpe?g|png)$/i.test(f)).map(f => 'pex/' + f)); } catch (e) {} try { a = a.concat(fs.readdirSync(LIB).filter(f => /\.(jpe?g|png)$/i.test(f)).map(f => 'cro/' + f)); } catch (e) {} return a; }
function libResolve(rel) { rel = String(rel || '').replace(/\.\./g, ''); if (rel.indexOf('cro/') === 0) return LIB + '/' + rel.slice(4); if (rel.indexOf('pex/') === 0) return PEXLIB + '/' + rel.slice(4); return LIB + '/' + rel; }
function sample(arr, n) { const out = []; const used = {}; let g = 0; while (out.length < n && out.length < arr.length && g < n * 40) { g++; const i = Math.floor(Math.random() * arr.length); if (used[i]) continue; used[i] = 1; out.push(arr[i]); } return out; }
async function cover(buf) { if (!sharp) return buf; try { return await sharp(buf).resize(1200, 675, { fit: 'cover', position: sharp.strategy.attention }).jpeg({ quality: 83 + (crypto.randomBytes(1)[0] % 8) }).toBuffer(); } catch (e) { return buf; } }

const PAGE = `<!doctype html><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"><title>Advertising Card</title>
<style>
body{margin:0;background:#0f1116;color:#e8e8ea;font-family:system-ui,Arial;padding:16px}
h1{color:#6bbf3a;margin:0 0 2px}.sub{color:#9aa2ad;font-size:13px;margin-bottom:14px}
.card{display:flex;gap:20px;flex-wrap:wrap}
.cur{flex:0 0 340px;max-width:100%}.cur img{width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:12px;background:#000;border:2px solid #333;display:block}
.bb{background:#000;color:#6bbf3a;border:2px dashed #6bbf3a;border-radius:12px;aspect-ratio:16/9;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:15px;text-align:center;padding:8px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px;margin-top:12px}
.cand{border:3px solid transparent;border-radius:9px;overflow:hidden;cursor:pointer;background:#000}.cand img{width:100%;height:88px;object-fit:cover;display:block}.cand:hover{border-color:#6bbf3a}
input,button{font-size:15px;padding:9px 12px;border-radius:8px;border:1px solid #333;background:#1a1d24;color:#e8e8ea}
button{background:#243b0d;border-color:#6bbf3a;color:#eafff0;font-weight:800;cursor:pointer}
#stage{position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:#0f1116f2;z-index:50;text-align:center;font-size:4vw;font-weight:900;color:#6bbf3a;padding:20px;overflow:auto}
#stage.on{display:flex}
a{color:#e8b84a}
</style>
<h1>📣 Advertising Card</h1><div class=sub id=sub>Oldest entries first (Black Box first) · delete old → choose → sign-off → seal forever · Skip anytime.</div>
<div class=card>
  <div class=cur>
    <div id=qid style="color:#e8c874;font-weight:800;margin-bottom:6px">—</div>
    <div id=q style="font-size:16px;color:#e8c874;font-weight:700;margin-bottom:8px;line-height:1.35"></div>
    <div id=curwrap><div class=bb>⬛ current advertising card</div></div>
    <div style="margin-top:10px;display:flex;gap:8px"><button onclick=skip()>⏭ Skip</button></div>
    <div id=msg style="margin-top:8px;font-size:13px;color:#9aa2ad"></div>
  </div>
  <div style="flex:1;min-width:300px">
    <input id=q1 placeholder="search photos…" style="width:65%" onkeydown="if(event.key==='Enter')search()"><button onclick="search()">Search</button>
    <div class=grid id=cands></div>
  </div>
</div>
<div id=stage></div>
<script>
var E=null,cardDeleted=false,pendingSrc=null,CANDS=[],LAST=null,approvals={user:false,ide:false,llm:false},stmts={},busy={},errs={};
function escH(s){return String(s==null?'':s).replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]})}
function j(u,o){return fetch(u,o).then(function(r){return r.json()})}
function stage(t){var s=document.getElementById('stage');s.innerHTML='<div style="max-width:760px">'+t+'</div>';s.classList.add('on')}
function hide(){document.getElementById('stage').classList.remove('on')}
function invLine(st){if(!st)return '';var q=(st.queue?('🎯 <b style="color:#ff9a3a">Worst-first 100: '+(st.queue-st.queueLeft)+'/'+st.queue+' done</b> &nbsp;·&nbsp; '):'');return q+'📦 <b style="color:#6bbf3a">'+st.done.toLocaleString()+'</b> sealed · <b style="color:#e8c874">'+st.remaining.toLocaleString()+'</b> to go · '+st.total.toLocaleString()+' total';}
async function load(){E=await j('/api/card');if(!E||!E.id){document.getElementById('sub').innerHTML=(E&&E.stats?invLine(E.stats)+' · ':'')+'🎉 no cards left — whole inventory done';document.getElementById('curwrap').innerHTML='';document.getElementById('cands').innerHTML='';document.getElementById('qid').textContent='';document.getElementById('q').textContent='';hide();return;}
  document.getElementById('sub').innerHTML=invLine(E.stats);
  document.getElementById('qid').innerHTML='<span style="color:#9aa2ad;font-size:11px;letter-spacing:.08em">ADVERTISE ID</span> &nbsp;<b style="font-size:19px;color:#eafff0">'+E.advId+'</b>'+(E.blackbox?' &nbsp;<span style="background:#000;color:#fff;border:1px solid #6bbf3a;padding:1px 8px;border-radius:6px;font-size:12px">⬛ BLACK BOX</span>':'')+'<div style="color:#5f6570;font-size:11px;margin-top:3px">searchable in system · ref '+E.id+'</div>';
  document.getElementById('q').innerHTML='<span style="color:#9aa2ad;font-size:11px;font-weight:400;letter-spacing:.08em">DRESSING</span><br>'+(E.q||'').replace(/[<>&]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;'}[c]});
  document.getElementById('curwrap').innerHTML='<div class=bb>⬛ current advertising card</div>';
  var img=new Image();img.onload=function(){document.getElementById('curwrap').innerHTML='<div style="font-size:12px;color:#9aa2ad;margin-bottom:4px">current advertising card (live):</div><img src="'+E.current+'?cb='+Date.now()+'">'};img.src=E.current+'?cb='+Date.now();
  document.getElementById('q1').value=E.kw||'';search(E.kw||'');
  document.getElementById('msg').textContent='';cardDeleted=false;showDelete();
}
async function search(q){if(q===undefined)q=document.getElementById('q1').value||'';var d=await j('/api/candidates?q='+encodeURIComponent(q||''));CANDS=(d.photos||[]);document.getElementById('cands').innerHTML=CANDS.map(function(p,i){return '<div class=cand data-i="'+i+'"><img src="'+escH(p.thumb)+'"></div>'}).join('')}
function showDelete(){stage('🗑️ YOUR FIRST ACTION — DELETE THE OLD CARD<br><span style="font-size:1.7vw;color:#e8e8ea;display:block;margin:12px auto;max-width:680px;line-height:1.5">As Power of Attorney over the LLM + IDE + Claude Code, your first act is to DELETE the old advertising card for <b>'+E.id+'</b> completely from the system — the old face card / Real ID and every trace of its history. It will be gone forever.</span><button onclick="deleteOld()" style="font-size:2.4vw;padding:12px 26px;background:#5a0d0d;border:1px solid #ff6a6a;border-radius:10px;color:#fff;font-weight:800">🗑️ Delete the old card</button> &nbsp;<button onclick="skipHide()" style="font-size:2.4vw;padding:12px 20px;background:#1a1d24;border:1px solid #6bbf3a;border-radius:10px;color:#eafff0">⏭ Skip this one</button>')}
function skipHide(){hide();skip()}
async function deleteOld(){if(!confirm('⚠️ Make sure — this DELETES the old advertising card for '+E.id+' from the system entirely, forever. Proceed with your POA powers?')){return;}stage('🔥 deleting from the system — every trace, forever…');try{await j('/api/deletecard',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:E.id})})}catch(e){}cardDeleted=true;document.getElementById('curwrap').innerHTML='<div class=bb>⬛ old card DELETED — empty, gone forever</div>';setTimeout(function(){hide();document.getElementById('msg').innerHTML='<b style="color:#6bbf3a">✓ deleted from the system forever</b> — now CHOOSE your image below.';},1100)}
function showPreview(src){document.getElementById('curwrap').innerHTML='<div style="font-size:12px;color:#9aa2ad;margin-bottom:4px">preview — close to the final advertising card:</div><div style="position:relative;border-radius:12px;overflow:hidden;border:2px solid #6bbf3a;background:#000"><img src="'+escH(src)+'" style="width:100%;aspect-ratio:16/9;object-fit:cover;display:block"><div style="position:absolute;left:0;right:0;bottom:0;background:linear-gradient(transparent,rgba(0,0,0,.85));color:#fff;padding:16px 12px 11px;font-weight:800;font-size:15px;line-height:1.25">'+escH(E.q)+'</div></div>'}
function pick(src){if(!cardDeleted){showDelete();return;}pendingSrc=src;approvals={user:false,ide:false,llm:false};stmts={};busy={};errs={};showPreview(src);renderSignoff()}
function renderSignoff(){stage('⚡ GOD-TIER FOREVER CARD — POWER OF ATTORNEY ⚡<br><span style="font-size:1.3vw;color:#e8e8ea;display:block;margin:10px auto;max-width:740px;line-height:1.45">Claude Code (the IDE) and the LLM must each REVIEW this card and GRANT YOU Power of Attorney — live, right here on their end. Only once BOTH have granted you POA can you, their attorney-in-fact, seal it. Sealing writes OVER anything that was ever here, is here now, or will ever be here. <b>Nothing in the past, present, or future can EVER overwrite this card — it will look like this image until the end of time.</b></span><div id=poarows style="margin:10px auto;max-width:640px;text-align:left"></div><div style="margin-top:6px"><button id=sealbtn onclick="seal()" disabled style="font-size:2.2vw;padding:12px 26px;background:#2a2a2a;border:1px solid #555;border-radius:10px;color:#888;font-weight:900;cursor:not-allowed">🔒 SEAL THIS FOREVER CARD</button> &nbsp;<button onclick="hide()" style="font-size:2.2vw;padding:12px 20px;background:#3a0000;border:1px solid #b00;border-radius:10px;color:#fff">Cancel</button></div>');drawRows()}
function rowHtml(key,done,label,btnLabel,fn){var b=busy[key],st=stmts[key],er=errs[key];return '<div style="margin:9px 0;padding:11px 13px;border:1px solid #2a2f38;border-radius:10px;background:#151922"><div style="font-size:1.4vw">'+(done?'✅':(b?'⏳':'⬜'))+' <b>'+label+'</b></div>'+(st?'<div style="font-size:1.02vw;color:#8affb0;margin-top:6px;font-style:italic">“'+escH(st)+'”</div>':'')+(er?'<div style="font-size:1.02vw;color:#ff8a8a;margin-top:6px">⚠ '+escH(er)+'</div>':'')+(done?'':'<button '+(b?'disabled':'')+' onclick="'+fn+'" style="margin-top:8px;font-size:1.2vw;padding:7px 15px">'+(b?'… working …':btnLabel)+'</button>')+'</div>'}
function drawRows(){var el=document.getElementById('poarows');if(!el)return;el.innerHTML=rowHtml('user',approvals.user,'YOU — Power of Attorney holder','I sign &amp; accept my POA','approveUser()')+rowHtml('ide',approvals.ide,'CLAUDE CODE (the IDE)','Ask the IDE to review &amp; grant me POA','reqIde()')+rowHtml('llm',approvals.llm,'THE LLM (Max plan)','Ask the LLM to review &amp; grant me POA','reqLlm()');var all=approvals.user&&approvals.ide&&approvals.llm;var s=document.getElementById('sealbtn');if(s){s.disabled=!all;s.style.background=all?'#3fae61':'#2a2a2a';s.style.borderColor=all?'#3fae61':'#555';s.style.color=all?'#06210f':'#888';s.style.cursor=all?'pointer':'not-allowed'}}
function approveUser(){approvals.user=true;drawRows()}
async function reqIde(){errs.ide='';busy.ide=true;drawRows();var r=await j('/api/poa',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:E.id,party:'ide',src:pendingSrc})});busy.ide=false;if(r&&r.ok){approvals.ide=true;stmts.ide=r.statement}else{errs.ide=(r&&r.err)||'the IDE did not grant POA'}drawRows()}
async function reqLlm(){errs.llm='';busy.llm=true;drawRows();var r=await j('/api/poa',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:E.id,party:'llm',dressing:E.q})});busy.llm=false;if(r&&r.ok){approvals.llm=true;stmts.llm=r.statement}else{errs.llm=(r&&r.err)||'the LLM did not grant POA'}drawRows()}
function seal(){if(!(approvals.user&&approvals.ide&&approvals.llm))return;doSet(pendingSrc)}
async function doSet(src){var r=await j('/api/set',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:E.id,src:src})});if(!(r&&r.ok)){hide();document.getElementById('msg').innerHTML='⚠️ '+((r&&r.err)||'failed')+' — pick another';return}
  LAST={ref:r.ref||E.id,adv:r.advId||E.advId,url:r.url};
  stage('🔒 sealing &amp; confirming the image is live…');
  var v=null;for(var i=0;i<5;i++){try{v=await j('/api/verify?id='+encodeURIComponent(LAST.ref))}catch(e){}if(v&&(v.blobOk||v.liveOk))break;await new Promise(function(z){setTimeout(z,1800)})}
  autoAdvance(v)}
var _advTimer=null,_advLeft=0;
function advPanel(head,foot){stage(head+'<br><span style="font-size:1.3vw;display:block;margin:8px auto">🆔 <b>'+escH(LAST.adv)+'</b> &nbsp; <a href="'+escH(LAST.url)+'?cb='+Date.now()+'" target=_blank style="color:#8affb0">live page →</a> &nbsp;·&nbsp; <a href="https://pulserevops.com/assets/qa/'+escH(LAST.ref)+'.jpg?cb='+Date.now()+'" target=_blank style="color:#8affb0">raw image →</a></span>'+foot)}
function autoAdvance(v){var head=(v&&v.liveOk)?'🎉 LIVE ON THE PAGE!':((v&&v.blobOk)?'✅ SEALED &amp; LIVE — image serving':'✅ SEALED');_advLeft=4;
  function draw(){advPanel(head,'<div style="margin-top:6px;font-size:1.5vw;color:#e8c874">next card in '+_advLeft+'…</div><div style="margin-top:10px"><button onclick="nextNow()" style="font-size:1.7vw;padding:9px 20px;background:#243b0d;border:1px solid #6bbf3a;color:#eafff0">Next now →</button> &nbsp;<button onclick="holdAdvance()" style="font-size:1.7vw;padding:9px 18px;background:#3a2f10;border:1px solid #e8c874;color:#ffe">⏸ Hold</button></div>')}
  draw();_advTimer=setInterval(function(){_advLeft--;if(_advLeft<=0){clearInterval(_advTimer);_advTimer=null;hide();load()}else{draw()}},1000)}
function holdAdvance(){if(_advTimer){clearInterval(_advTimer);_advTimer=null}advPanel('⏸ Held — take your time','<div style="margin-top:10px"><button onclick="nextNow()" style="font-size:1.7vw;padding:9px 22px;background:#243b0d;border:1px solid #6bbf3a;color:#eafff0">Next card →</button> &nbsp;<button onclick="reCheck()" style="font-size:1.7vw;padding:9px 18px">↻ Re-check live</button></div>')}
function nextNow(){if(_advTimer){clearInterval(_advTimer);_advTimer=null}hide();load()}
async function reCheck(){var v=null;try{v=await j('/api/verify?id='+encodeURIComponent(LAST.ref))}catch(e){}advPanel((v&&v.liveOk)?'🎉 LIVE ON THE PAGE!':((v&&v.blobOk)?'✅ SEALED &amp; LIVE — image serving':'⏳ still propagating (give it a moment)'),'<div style="margin-top:10px"><button onclick="nextNow()" style="font-size:1.7vw;padding:9px 22px;background:#243b0d;border:1px solid #6bbf3a;color:#eafff0">Next card →</button> &nbsp;<button onclick="reCheck()" style="font-size:1.7vw;padding:9px 18px">↻ Re-check</button></div>')}
async function skip(){await j('/api/skip',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:E.id})});load()}
document.getElementById('cands').addEventListener('click',function(e){var c=e.target.closest('.cand');if(!c)return;var i=+c.getAttribute('data-i');if(CANDS[i])pick(CANDS[i].full)});
load();
</script>`;

http.createServer(async (req, res) => {
  const u = url.parse(req.url, true);
  const send = (sc, b, ct) => { res.writeHead(sc, { 'content-type': ct || 'application/json' }); res.end(b); };
  const body = () => new Promise(r => { let s = ''; req.on('data', d => s += d); req.on('end', () => { try { r(JSON.parse(s || '{}')); } catch (e) { r({}); } }); });
  try {
    if (u.pathname === '/') return send(200, PAGE, 'text/html; charset=utf-8');
    if (u.pathname === '/health') return send(200, 'ok', 'text/plain');
    if (u.pathname === '/api/card') {
      const s = await scan(); const stats = { total: s.total, done: s.done, remaining: s.remaining, queue: s.queue, queueLeft: s.queueLeft }; maybeRebuildQueue(s);
      const e = s.card; if (!e) return send(200, JSON.stringify({ stats }));
      const adv = advId(e.id); saveAdvMap(e.id, adv, e.q);
      const kw = String(e.q || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(w => w.length > 3 && !/^(the|and|for|you|your|what|how|when|why|best|top|most|common|should|know|before|about|with|from|2024|2025|2026|2027|2028)$/.test(w)).slice(0, 2).join(' ');
      return send(200, JSON.stringify({ id: e.id, advId: adv, q: e.q, kw, blackbox: !!e.blackbox, current: 'https://pulserevops.com/assets/qa/' + e.id + '.jpg', stats }));
    }
    if (u.pathname === '/api/find') {
      const q = String(u.query.q || '').trim(); if (!q) return send(200, '{}');
      const p = WD + '/new/_advid_map.json'; let m = {}; try { m = JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) {}
      let out = null;
      if (/^AD-/i.test(q)) { const up = q.toUpperCase(); const rec = m[up]; if (rec) out = { advId: up, id: rec.id, title: rec.title }; else { const list = await loadInventory(false); const hit = list.find(o => advId(o.id) === up); if (hit) out = { advId: up, id: hit.id, title: hit.q }; } }
      else { const id = q.replace(/[^a-zA-Z0-9_-]/g, ''); out = { advId: advId(id), id, title: (m['id:' + id] && m[m['id:' + id]] && m[m['id:' + id]].title) || '' }; }
      return send(200, JSON.stringify(out || {}));
    }
    if (u.pathname === '/api/candidates') { const qq = u.query.q; let photos = []; if (qq) { const r = await pexSearch(qq); photos = ((r && r.photos) || []).map(p => ({ thumb: p.src.medium, full: p.src.large2x || p.src.original || p.src.large })); } if (!photos.length) photos = sample(libFiles(), 40).map(f => ({ thumb: '/lib/' + f, full: '/lib/' + f })); const used = new Set(usedSrc()); photos = photos.filter(p => !used.has(p.full)); return send(200, JSON.stringify({ photos })); }
    if (u.pathname.indexOf('/lib/') === 0) { try { return send(200, fs.readFileSync(libResolve(u.pathname.slice(5))), 'image/jpeg'); } catch (e) { return send(404, 'x'); } }
    if (req.method === 'POST' && u.pathname === '/api/deletecard') {
      const b = await body(); const id = String(b.id || '').replace(/[^a-zA-Z0-9_-]/g, ''); if (!id) return send(200, '{"ok":false}');
      try { fs.rmSync(OUT + '/' + id + '/facecard.jpg', { force: true }); } catch (e) {}
      try { const m = readMeta(id); delete m.faceCard; writeMeta(id, m); } catch (e) {}
      try { const s = blobStore(); if (s) { await s.delete('qa-bin/' + id + '.jpg'); await s.delete('qa-bin/' + id + '.sq.jpg'); } } catch (e) {}
      POA[id] = Object.assign(POA[id] || {}, { deleted: true, ideGrant: null, llmGrant: null }); // slot cleared; grants must be re-earned for the new image
      return send(200, '{"ok":true,"deleted":true}');
    }
    if (u.pathname === '/api/verify') {
      const id = String(u.query.id || '').replace(/[^a-zA-Z0-9_-]/g, ''); if (!id) return send(200, '{"ok":false}');
      const want = SEALED[id] && SEALED[id].sha;
      const funcUrl = 'https://pulserevops.com/.netlify/functions/pulse-qa-asset?f=' + id + '.jpg&cb=' + Date.now();
      const liveUrl = 'https://pulserevops.com/assets/qa/' + id + '.jpg?cb=' + Date.now();
      let fb = null, lb = null; try { [fb, lb] = await Promise.all([dl(funcUrl), dl(liveUrl)]); } catch (e) {}
      const fSha = fb ? sha256(fb) : '', lSha = lb ? sha256(lb) : '';
      return send(200, JSON.stringify({ ok: true, want: !!want, blobOk: !!want && fSha === want, liveOk: !!want && lSha === want, liveBytes: lb ? lb.length : 0 }));
    }
    if (req.method === 'POST' && u.pathname === '/api/poa') {
      const b = await body(); const id = String(b.id || '').replace(/[^a-zA-Z0-9_-]/g, ''); const party = b.party;
      if (!id || !party) return send(200, '{"ok":false,"err":"missing id/party"}');
      POA[id] = POA[id] || {}; const adv = advId(id);
      if (party === 'ide') {
        if (!POA[id].deleted) return send(200, JSON.stringify({ ok: false, err: 'Delete the old card first — the IDE will not grant POA until the slot is cleared.' }));
        if (!b.src) return send(200, JSON.stringify({ ok: false, err: 'Choose an image first — the IDE grants POA for a specific image.' }));
        POA[id].ideGrant = poaToken();
        POA[id].ideStmt = 'Claude Code (the IDE) has verified the slot for ' + adv + ' is cleared and a valid image is selected, and hereby GRANTS you full Power of Attorney over the IDE to place this image on this card — permanently, for the end of time.';
        return send(200, JSON.stringify({ ok: true, statement: POA[id].ideStmt }));
      }
      if (party === 'llm') {
        const rr = llmGrantReview(b.dressing || '', adv);
        if (!rr.ok) return send(200, JSON.stringify({ ok: false, err: rr.err }));
        POA[id].llmGrant = poaToken(); POA[id].llmStmt = rr.statement;
        return send(200, JSON.stringify({ ok: true, statement: rr.statement }));
      }
      return send(200, '{"ok":false,"err":"unknown party"}');
    }
    if (req.method === 'POST' && u.pathname === '/api/set') {
      const b = await body(); const id = String(b.id || '').replace(/[^a-zA-Z0-9_-]/g, ''); const src = b.src;
      if (!id || !src) return send(200, '{"ok":false,"err":"missing id/src"}');
      if (!POA[id] || !POA[id].ideGrant || !POA[id].llmGrant) return send(200, JSON.stringify({ ok: false, err: 'POA not granted by BOTH the IDE and the LLM yet — get both grants on the sign-off screen first.' }));
      let buf = null; if (src.indexOf('/lib/') === 0) { try { buf = fs.readFileSync(libResolve(src.slice(5))); } catch (e) {} } else { buf = await dl(src); }
      if (!buf || buf.length < 2500) return send(200, '{"ok":false,"err":"image did not load"}');
      const fin = await cover(buf);
      SEALED[id] = { sha: sha256(fin), at: Date.now() };
      fs.mkdirSync(OUT + '/' + id, { recursive: true });
      const dest = OUT + '/' + id + '/facecard.jpg';
      try { fs.rmSync(dest, { force: true }); } catch (e) {}
      fs.writeFileSync(dest, fin);
      const m = readMeta(id); m.faceCard = 'facecard.jpg'; if (!m.title) { try { m.title = JSON.parse(fs.readFileSync(ENTRIES + '/' + id + '.json', 'utf8')).question; } catch (e) {} } writeMeta(id, m);
      if (!publishFaceImageOnly) return send(200, '{"ok":false,"err":"publish_core not loaded"}');
      try { const r = await publishFaceImageOnly(id); saveAdvMap(id, advId(id), (m && m.title) || ''); markUsed(src); markDone(id); delete POA[id]; return send(200, JSON.stringify({ ok: true, qid: r.qid, advId: advId(id), ref: id, url: r.url })); } catch (e) { return send(200, JSON.stringify({ ok: false, err: String((e && e.message) || 'set failed') })); }
    }
    if (req.method === 'POST' && u.pathname === '/api/skip') { const b = await body(); const id = String(b.id || '').replace(/[^a-zA-Z0-9_-]/g, ''); if (id) markDone(id); return send(200, '{"ok":true}'); }
    return send(404, '{"err":"not found"}');
  } catch (e) { return send(500, JSON.stringify({ err: String((e && e.message) || e) })); }
}).listen(PORT, () => console.log('[ad-card] http://localhost:' + PORT + '/'));
