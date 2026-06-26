// Fallback tk image backfill for entries whose Core Stack uses a narrative /
// H3-heading / colon-terminated-label format that the per-layer parser can't
// attach to. Collects the real product bold-spans in the Core Stack section
// (filtering out analyst/source/metric noise), fetches an image+link per tool,
// and inserts the cards as a block right after the Core Stack header.
// Usage: node _tk_img_fallback.js tk0057 tk0184 ...   (ids required)
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
} catch (e) {}
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOK });
const IDS = process.argv.slice(2).filter(a => /^tk\d+$/.test(a));
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const NOISE = /gartner|forrester|idc|mckinsey|pavilion|tambellini|magic quadrant|marketscape|\bwave\b|benchmark|report|survey|study|\bq[1-4]\b|20\d\d|%/i;

function trimTool(t) {
  t = t.trim();
  const cuts = [t.indexOf('('), t.indexOf(','), t.indexOf(':'), t.indexOf(';'), t.indexOf(' plus '), t.indexOf(' or '), t.indexOf(' + '), t.indexOf(' with '), t.indexOf(' — '), t.indexOf(' for ')];
  let end = t.length; for (const c of cuts) { if (c >= 0 && c < end) end = c; }
  return t.slice(0, end).trim().replace(/[.\s]+$/, '').trim();
}
function coreTools(body) {
  const lines = body.split(/\r?\n/);
  let start = lines.findIndex(l => /^##\s+The Core Stack/i.test(l));
  if (start < 0) return { start: -1, tools: [] };
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) { if (/^##\s+(Real Operators|Integration|Failure Modes|Budget|Why )/i.test(lines[i])) { end = i; break; } }
  const tools = []; const seen = new Set();
  for (let i = start + 1; i < end; i++) {
    const ln = lines[i];
    if (/Market Context/i.test(ln)) continue;
    if (/^Before picking vendors/i.test(ln)) continue; // analyst intro paragraph
    let m; const re = /\*\*([^*]+)\*\*/g;
    while ((m = re.exec(ln))) {
      const t = trimTool(m[1]);
      if (!t || t.length < 2 || t.length > 50) continue;
      if (NOISE.test(t)) continue;
      const k = t.toLowerCase();
      if (seen.has(k)) continue;
      seen.add(k); tools.push(t);
    }
  }
  return { start, tools: tools.slice(0, 14) };
}
async function headOk(url) {
  try { const r = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(10000) }); const ct = (r.headers.get('content-type') || '').toLowerCase(); if (r.ok && ct.startsWith('image/')) return true; const g = await fetch(url, { method: 'GET', headers: { Range: 'bytes=0-1024', 'User-Agent': UA }, redirect: 'follow', signal: AbortSignal.timeout(10000) }); const ct2 = (g.headers.get('content-type') || '').toLowerCase(); return g.ok && ct2.startsWith('image/'); } catch (e) { return false; }
}
async function ddg(q, a = 0) {
  try {
    const tp = await fetch('https://duckduckgo.com/?q=' + encodeURIComponent(q) + '&iax=images&ia=images', { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(15000) });
    const html = await tp.text(); const m = html.match(/vqd=([\d-]+)/) || html.match(/vqd="([^"]+)"/);
    if (!m) { if (a < 2) { await sleep(1500 + a * 1500); return ddg(q, a + 1); } return []; }
    await sleep(120);
    const r = await fetch('https://duckduckgo.com/i.js?l=us-en&o=json&q=' + encodeURIComponent(q) + '&vqd=' + m[1] + '&f=,,,&p=1', { headers: { 'User-Agent': UA, 'Referer': 'https://duckduckgo.com/', 'Accept': 'application/json' }, signal: AbortSignal.timeout(15000) });
    if (r.status === 429 || r.status === 403) { if (a < 3) { await sleep(2500 + a * 2500); return ddg(q, a + 1); } return []; }
    const t = await r.text(); let j; try { j = JSON.parse(t); } catch (e) { if (a < 2) { await sleep(2000); return ddg(q, a + 1); } return []; }
    return (j.results || []).map(x => ({ image: x.image, url: x.url }));
  } catch (e) { if (a < 2) { await sleep(1500); return ddg(q, a + 1); } return []; }
}
async function ping(id) { try { await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'pulsemachine-writer-2026', id }), signal: AbortSignal.timeout(8000) }); } catch (e) {} }

(async () => {
  for (const id of IDS) {
    const e = await s.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
    if (!e || !e.answer) { console.log(id, 'no-body'); continue; }
    if (/@@PRODUCT[^\n]* img=/.test(e.answer)) { console.log(id, 'already-has-images'); continue; }
    const { start, tools } = coreTools(e.answer);
    if (start < 0 || !tools.length) { console.log(id, 'no-tools-found'); continue; }
    const cards = []; const seenImg = new Set();
    for (const t of tools) {
      const arr = await ddg(t + ' software logo'); let pick = null;
      for (const c of arr.slice(0, 8)) { if (!c.image || seenImg.has(c.image)) continue; if (await headOk(c.image)) { pick = c; break; } }
      if (!pick) { for (const c of arr.slice(0, 8)) { if (c.image && !seenImg.has(c.image)) { pick = c; break; } } }
      let str = `@@PRODUCT name="${t.replace(/"/g, '')}"`;
      if (pick && pick.image) { str += ` img="${pick.image.replace(/"/g, '')}"`; seenImg.add(pick.image); }
      if (pick && pick.url) str += ` site="${pick.url.replace(/"/g, '')}"`;
      cards.push(str);
    }
    const lines = e.answer.split(/\r?\n/);
    lines.splice(start + 1, 0, '', ...cards);
    e.answer = lines.join('\n'); e.ts = Date.now(); e.polished_at = Date.now();
    await s.setJSON('answers/' + id + '.json', e); await ping(id);
    console.log(id, '+' + cards.filter(c => / img=/.test(c)).length + ' imgs / ' + tools.length + ' tools');
  }
  console.log('FALLBACK DONE');
})().catch(e => { console.error('FATAL', e && e.stack); process.exit(1); });
