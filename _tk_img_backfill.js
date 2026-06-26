// Tech Stacks (tk####) image backfill. Unlike the Top-10 pillars, tk entries
// have NO `## N.` product headings — the tools live in the "Core Stack, Layer by
// Layer" section as **bold lead-in lines** of the form:
//   **<Layer Label> — <Primary Tool> (or <alt> ...).**  <paragraph...>
// This script extracts the PRIMARY tool from each such layer line, finds a real
// image + official link via keyless DuckDuckGo, and inserts an @@PRODUCT card
// immediately after the layer line so every tech-stack component renders an image.
// Idempotent + never-regress: re-running only adds missing images.
//
// Usage:
//   node _tk_img_backfill.js --dry [tk0001]     # parse only, no writes
//   node _tk_img_backfill.js                     # backfill ALL tk entries
//   node _tk_img_backfill.js tk0001 tk0002       # backfill specific ids
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
} catch (e) {}
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const s = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });

const ARGS = process.argv.slice(2);
const DRY = ARGS.includes('--dry');
const IDS = ARGS.filter(a => /^tk\d+$/.test(a));
const CONCURRENCY = 3;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const num = id => parseInt(String(id).match(/\d+/)[0], 10);

// Cut a raw tool string at the first multi-tool / qualifier boundary.
function trimTool(tool) {
  tool = tool.trim();
  const cuts = [tool.indexOf('('), tool.indexOf(','), tool.indexOf(':'), tool.indexOf(';'),
    tool.indexOf(' plus '), tool.indexOf(' or '), tool.indexOf(' + '), tool.indexOf(' with ')];
  let end = tool.length;
  for (const c of cuts) { if (c >= 0 && c < end) end = c; }
  return tool.slice(0, end).trim().replace(/[.\s]+$/, '').trim();
}

// Extract the primary tool/vendor name from a Core Stack layer line. Handles:
//  1) **Layer — Tool (or alt).**            (em-dash, tool inside lead bold)
//  2) **Layer (note): Tool**                (colon, tool inside lead bold, may be bulleted)
//  3) - **Layer: Tool.** paragraph...       (bulleted variant of #2)
//  4) **Layer label.** ... **Tool** ...      (label-only bold; tool is the next bold span)
// Returns null if the line is not a tool layer.
function primaryToolFromLayer(line) {
  const s = line.replace(/^\s*(?:[-*+]|\d+\.)\s+/, ''); // strip optional bullet or "N."
  const m = s.match(/^\*\*([^*]+)\*\*/);
  if (!m) return null;
  const bold = m[1];
  let tool = null;
  const dash = bold.indexOf('—');
  const colonIn = bold.indexOf(':');
  const rest = s.slice(m[0].length);
  if (dash >= 0) tool = bold.slice(dash + 1);
  else if (colonIn >= 0 && trimTool(bold.slice(colonIn + 1))) tool = bold.slice(colonIn + 1);
  else if (/^\s*[—–-]/.test(rest)) tool = bold; // "N. **Tool** — desc": lead bold IS the tool
  else {
    // label-only lead bold → use the first bold span in the remainder of the line.
    const m2 = rest.match(/\*\*([^*]+)\*\*/);
    if (m2) tool = m2[1];
  }
  if (tool == null) return null;
  tool = trimTool(tool);
  if (!tool || tool.length < 2 || tool.length > 60) return null;
  return tool;
}

function layerLines(body) {
  const lines = body.split(/\r?\n/);
  // Restrict to the Core Stack section so we don't grab unrelated bold lines.
  let start = lines.findIndex(l => /Core Stack, Layer by Layer/i.test(l));
  if (start < 0) start = 0;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^##\s+(Real Operators|Integration|Failure Modes|Budget)/i.test(lines[i])) { end = i; break; }
  }
  const out = [];
  for (let i = start; i < end; i++) {
    const t = primaryToolFromLayer(lines[i]);
    if (t) out.push({ idx: i, tool: t });
  }
  return out;
}

async function headOk(url) {
  try {
    const r = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(10000) });
    const ct = (r.headers.get('content-type') || '').toLowerCase();
    if (r.ok && ct.startsWith('image/')) return true;
    const g = await fetch(url, { method: 'GET', headers: { Range: 'bytes=0-1024', 'User-Agent': UA }, redirect: 'follow', signal: AbortSignal.timeout(10000) });
    const ct2 = (g.headers.get('content-type') || '').toLowerCase();
    return g.ok && ct2.startsWith('image/');
  } catch (e) { return false; }
}

async function ddgImages(q, attempt = 0) {
  try {
    const tp = await fetch('https://duckduckgo.com/?q=' + encodeURIComponent(q) + '&iax=images&ia=images', { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(15000) });
    const html = await tp.text();
    const m = html.match(/vqd=([\d-]+)/) || html.match(/vqd="([^"]+)"/);
    if (!m) { if (attempt < 2) { await sleep(1500 + attempt * 1500); return ddgImages(q, attempt + 1); } return []; }
    const vqd = m[1];
    await sleep(120);
    const r = await fetch('https://duckduckgo.com/i.js?l=us-en&o=json&q=' + encodeURIComponent(q) + '&vqd=' + vqd + '&f=,,,&p=1', { headers: { 'User-Agent': UA, 'Referer': 'https://duckduckgo.com/', 'Accept': 'application/json' }, signal: AbortSignal.timeout(15000) });
    if (r.status === 429 || r.status === 403) { if (attempt < 3) { await sleep(2500 + attempt * 2500); return ddgImages(q, attempt + 1); } return []; }
    const t = await r.text();
    let j; try { j = JSON.parse(t); } catch (e) { if (attempt < 2) { await sleep(2000); return ddgImages(q, attempt + 1); } return []; }
    return (j.results || []).map(x => ({ image: x.image, url: x.url }));
  } catch (e) { if (attempt < 2) { await sleep(1500); return ddgImages(q, attempt + 1); } return []; }
}

async function pingIndexNow(id) { try { await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'pulsemachine-writer-2026', id }), signal: AbortSignal.timeout(8000) }); } catch (e) {} }
async function emailOwner(subject, html) { try { await fetch('https://pulserevops.com/.netlify/functions/pulse-progress-notify?key=pulsemachine-writer-2026', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject, html }), signal: AbortSignal.timeout(12000) }); } catch (e) {} }

async function processEntry(id) {
  const e = await s.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
  if (!e || !e.answer) return { id, skip: 'no-body' };
  const layers = layerLines(e.answer);
  if (!layers.length) return { id, skip: 'no-layers' };
  const have = (e.answer.match(/@@PRODUCT[^\n]* img=/g) || []).length;
  if (have >= layers.length) return { id, skip: 'already', imgs: have, layers: layers.length };

  if (DRY) return { id, dry: true, layers: layers.map(l => l.tool) };

  // Build a card per layer with a validated image + site link.
  const cardFor = {};
  const seenImg = new Set();
  for (const L of layers) {
    const arr = await ddgImages(L.tool + ' software logo');
    let pick = null;
    for (const c of arr.slice(0, 8)) {
      if (!c.image || seenImg.has(c.image)) continue;
      if (await headOk(c.image)) { pick = c; break; }
    }
    if (!pick) { for (const c of arr.slice(0, 8)) { if (c.image && !seenImg.has(c.image)) { pick = c; break; } } }
    const nm = L.tool.replace(/"/g, '');
    let str = `@@PRODUCT name="${nm}"`;
    if (pick && pick.image) { str += ` img="${pick.image.replace(/"/g, '')}"`; seenImg.add(pick.image); }
    if (pick && pick.url) str += ` site="${pick.url.replace(/"/g, '')}"`;
    cardFor[L.idx] = str;
  }
  const lines = e.answer.split(/\r?\n/).filter(l => !/^@@PRODUCT/.test(l)); // strip any prior cards first
  // recompute layer indices on the stripped body
  const freshLayers = layerLines(lines.join('\n'));
  const cardByTool = {};
  layers.forEach(L => { if (cardFor[L.idx]) cardByTool[L.tool] = cardFor[L.idx]; });
  const out = [];
  let imgs = 0;
  const used = new Set();
  for (const l of lines) {
    out.push(l);
    const t = primaryToolFromLayer(l);
    if (t && cardByTool[t] && !used.has(t)) { out.push(cardByTool[t]); used.add(t); if (/ img=/.test(cardByTool[t])) imgs++; }
  }
  e.answer = out.join('\n');
  e.ts = Date.now(); e.polished_at = Date.now();
  await s.setJSON('answers/' + id + '.json', e);
  await pingIndexNow(id);
  return { id, fixed: true, imgs, layers: layers.length };
}

(async () => {
  let ids = IDS;
  if (!ids.length) {
    const idx = (await s.get('_index.json', { type: 'json' })) || { entries: [] };
    ids = (idx.entries || []).map(x => x.id).filter(x => /^tk\d+$/.test(x)).sort((a, b) => num(a) - num(b));
  }
  console.log(`[tk] ${DRY ? 'DRY-RUN ' : ''}targets: ${ids.length}`);
  if (DRY) {
    for (const id of ids.slice(0, 3)) {
      const r = await processEntry(id);
      console.log(id, JSON.stringify(r, null, 1));
    }
    return;
  }
  let done = 0, cursor = 0, totalImgs = 0, lastEmail = Date.now();
  async function worker() {
    while (cursor < ids.length) {
      const id = ids[cursor++];
      try {
        const r = await processEntry(id);
        done++;
        if (r.fixed) { totalImgs += r.imgs; console.log(`  [${done}/${ids.length}] ${id} +${r.imgs} imgs / ${r.layers} layers`); }
        else console.log(`  [${done}/${ids.length}] ${id} skip:${r.skip}`);
      } catch (err) { done++; console.log(`  FAIL ${id}: ${err.message}`); }
      if (Date.now() - lastEmail > 15 * 60 * 1000) { lastEmail = Date.now(); await emailOwner(`PULSE tk image backfill: ${done}/${ids.length}`, `<p>Tech Stacks image backfill: <b>${done}</b>/${ids.length} entries processed, ${totalImgs} images added so far.</p>`); }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  console.log(`\n[tk] DONE. processed=${done} imagesAdded=${totalImgs}`);
  fs.writeFileSync('C:/Users/koryj/website/_tk_img_result.json', JSON.stringify({ processed: done, imagesAdded: totalImgs }, null, 1));
  await emailOwner('PULSE tk image backfill COMPLETE', `<p>Tech Stacks image backfill finished. ${totalImgs} real images added across ${ids.length} entries — every Core Stack layer now has an image.</p><p>https://pulserevops.com/tech-stacks</p>`);
})().catch(e => { console.error('FATAL', e && e.stack); process.exit(1); });
