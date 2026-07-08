// _pool10_server.js — local pick server (owner 2026-07-07). Serves the current topic's images at
// http://localhost:8791 with tap-to-select; when the 10th is tapped the page auto-submits and the server
// APPLIES those 10 across the topic (titled, balanced) then generates the NEXT topic's 20 — hands-free.
'use strict';
const http = require('http');
const fs = require('fs');
const { spawn } = require('child_process');
const WD = 'C:/Users/koryj/website';
const POOL = WD + '/assets/pool10';
const PORT = 8791;
const STATE = WD + '/_pool10_topic.txt';       // current topic being picked
const ORDER = ['mv', 'hf', 'gm', 'ga', 'sw', 'ev', 'sk', 'wl', 'lv', 'tn', 'co', 'cl', 'nl', 'rs', 'tc', 'sp', 'tv', 'bo', 'bs', 'es', 'dn', 'bt', 'gp', 'ai', 'sc', 'tk', 'gb', 'ra', 'pt', 'ik', 'er', 'cg', 'st', 'aq', 'ed', 'fr', 'ca', 'sy', 'q', 'tl'];
function curTopic() { try { return fs.readFileSync(STATE, 'utf8').trim(); } catch (e) { return 'gm'; } }
function setTopic(t) { try { fs.writeFileSync(STATE, t); } catch (e) {} }
function slots(t) { try { return fs.readdirSync(POOL + '/' + t).filter(f => /\.jpg$/i.test(f)).map(f => f.replace(/\.jpg$/i, '')).sort(); } catch (e) { return []; } }
function nextTopic(t) { const i = ORDER.indexOf(t); return i >= 0 && i < ORDER.length - 1 ? ORDER[i + 1] : null; }

function page(t) {
  const ns = slots(t);
  const figs = ns.map(n => '<figure data-n="' + n + '" onclick="tog(this)"><img src="/img/' + t + '/' + n + '.jpg"><figcaption>' + n + '</figcaption><div class=chk>✓</div></figure>').join('');
  return '<!doctype html><meta charset=utf-8><meta http-equiv=refresh content=12><title>' + t + ' pick 10</title><style>'
    + 'body{margin:0;background:#0f0f12;color:#eef1f6;font-family:system-ui,Arial}#bar{position:sticky;top:0;z-index:5;background:#16181d;padding:14px 20px;border-bottom:1px solid #333}#list{color:#EAC15C;font-weight:700}'
    + '.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;padding:16px}figure{margin:0;position:relative;border:3px solid #333;border-radius:9px;overflow:hidden;background:#000;cursor:pointer}figure.sel{border-color:#22c55e}img{width:100%;aspect-ratio:1;object-fit:cover;display:block}'
    + 'figcaption{position:absolute;top:5px;left:5px;background:rgba(0,0,0,.75);color:#EAC15C;font-weight:800;padding:2px 9px;border-radius:6px}.chk{position:absolute;top:5px;right:5px;width:30px;height:30px;border-radius:50%;background:#22c55e;color:#062;display:none;align-items:center;justify-content:center;font-weight:900}figure.sel .chk{display:flex}'
    + '#go{position:fixed;bottom:16px;right:16px;background:#22c55e;color:#052;font-weight:900;border:0;border-radius:10px;padding:14px 22px;font-size:1rem;cursor:pointer;display:none}</style>'
    + '<div id=bar>🎯 <b>' + t + '</b> — tap 10 (auto-applies at 10) · picked <b id=cnt>0</b>: <span id=list>none</span> · <b>' + ns.length + '</b> images · auto-updates</div>'
    + '<div class=g>' + figs + '</div><button id=go onclick=submit()>Apply 10 →</button>'
    + '<script>var T="' + t + '";var K="sel_"+T;var sel=new Set(JSON.parse(localStorage.getItem(K)||"[]"));var done=false;'
    + 'function paint(){document.querySelectorAll("figure").forEach(function(f){f.classList.toggle("sel",sel.has(f.dataset.n))});var a=[...sel].sort();list.textContent=a.join(", ")||"none";cnt.textContent=a.length;go.style.display=a.length>=1?"block":"none";if(a.length>=10&&!done){done=true;submit();}}'
    + 'function tog(f){var n=f.dataset.n;sel.has(n)?sel.delete(n):sel.add(n);localStorage.setItem(K,JSON.stringify([...sel]));paint();}'
    + 'function submit(){var a=[...sel].sort();if(!a.length)return;go.textContent="Applying...";fetch("/apply?topic="+T+"&picks="+a.join(","))'
    + '.then(function(r){return r.text()}).then(function(x){localStorage.removeItem(K);document.body.innerHTML="<div style=padding:40px;font-size:1.3rem>✅ "+x+"<br><br>Next topic is generating — this page will switch to it automatically. Keep it open.</div>";setTimeout(function(){location.href="/"},20000);});}'
    + 'paint();</script>';
}

const server = http.createServer((req, res) => {
  try {
    const u = new URL(req.url, 'http://x');
    if (u.pathname === '/') { res.writeHead(200, { 'content-type': 'text/html' }); res.end(page(curTopic())); return; }
    if (u.pathname.indexOf('/img/') === 0) { const fp = POOL + u.pathname.slice(4); try { res.writeHead(200, { 'content-type': 'image/jpeg' }); res.end(fs.readFileSync(fp)); } catch (e) { res.writeHead(404); res.end(); } return; }
    if (u.pathname === '/apply') {
      const t = u.searchParams.get('topic'); const picks = (u.searchParams.get('picks') || '').split(',').filter(Boolean);
      try { fs.readdirSync(POOL + '/' + t).filter(f => /\.jpg$/i.test(f)).forEach(f => { if (!picks.includes(f.replace(/\.jpg$/i, ''))) { try { fs.unlinkSync(POOL + '/' + t + '/' + f); } catch (e) {} } }); } catch (e) {}
      const applyEnv = Object.assign({}, process.env, { MODE: 'apply', ONLY_TOPIC: t, NO_EMAIL: '1' });
      const ap = spawn('node', ['_pool10_new.js'], { cwd: WD, env: applyEnv, detached: true, stdio: 'ignore' }); ap.unref();
      // NOTE: generation is owned by _pool10_pregen.js (builds pools ahead). Here we only mark applied + advance the view.
      try { fs.writeFileSync(WD + '/_pool10_applied_' + t + '.flag', 'x'); } catch (e) {}
      const nt = nextTopic(t);
      if (nt) setTopic(nt);
      res.writeHead(200, { 'content-type': 'text/plain' }); res.end('Applied ' + picks.length + ' images across ' + t + (nt ? ' — showing ' + nt + ' next' : ' — all topics done')); return;
    }
    res.writeHead(404); res.end();
  } catch (e) { res.writeHead(500); res.end(String(e.message)); }
});
server.listen(PORT, () => console.log('pool10 pick server on http://localhost:' + PORT + ' · topic ' + curTopic()));
