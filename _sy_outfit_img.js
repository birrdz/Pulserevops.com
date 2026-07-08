// _sy_outfit_img.js — fill a REAL matching photo (img:) into every ```outfit block
// of Style (sy) entries that lacks one. Query is built from the block's gender + age
// + named garments so the photo matches the described look. Deploy-free, clobber-safe
// (re-reads + writes only the one answer blob), idempotent (skips blocks with img:),
// resumable. Usage:
//   node _sy_outfit_img.js <id>     # one entry
//   node _sy_outfit_img.js all      # sweep all sy, newest-first
const fs = require('fs'), path = require('path');
try { const e = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8'); for (const l of e.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (e) {}
const { getStore } = require('@netlify/blobs');
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36';
const STOP = '_sy_outfit_img_stop.flag';

async function ddgImage(query) {
  try {
    const tp = await fetch('https://duckduckgo.com/?q=' + encodeURIComponent(query) + '&iax=images&ia=images', { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(15000) });
    const html = await tp.text(); const m = html.match(/vqd=["']?([\d-]+)/); if (!m) return null;
    const r = await fetch('https://duckduckgo.com/i.js?l=us-en&o=json&q=' + encodeURIComponent(query) + '&vqd=' + m[1] + '&f=,,,&p=1', { headers: { 'User-Agent': UA, 'Referer': 'https://duckduckgo.com/', 'Accept': 'application/json' }, signal: AbortSignal.timeout(15000) });
    const j = await r.json(); const results = (j && j.results) || [];
    for (const it of results) { if (it.image && /^https?:\/\//.test(it.image) && !/\.svg(\?|$)/i.test(it.image)) return it.image; }
  } catch (e) {}
  return null;
}
const proxy = (u) => 'https://wsrv.nl/?url=' + encodeURIComponent(u) + '&w=900&output=webp';

function parseBlock(b) {
  const meta = {}; const pieces = [];
  for (const s of b.split(/\r?\n/)) {
    const kv = s.match(/^(gender|title|occasion|budget|age|img):\s*(.+)$/i);
    if (kv) { meta[kv[1].toLowerCase()] = kv[2].trim(); continue; }
    const it = s.replace(/^[-•*]\s*/, '').split('|').map(x => x.trim());
    if (it.length >= 2) pieces.push((it[1] || '') + ' ' + (it[0] || ''));
  }
  return { meta, pieces };
}

async function fillEntry(store, id) {
  const blob = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!blob || !blob.answer) return { id, changed: 0 };
  let body = blob.answer, changed = 0;
  // iterate ```outfit ... ``` blocks
  const re = /```outfit\r?\n([\s\S]*?)```/g; let m; const edits = [];
  while ((m = re.exec(body))) edits.push({ start: m.index, end: re.lastIndex, inner: m[1] });
  // process from last to first so indices stay valid
  for (let k = edits.length - 1; k >= 0; k--) {
    const { start, end, inner } = edits[k];
    if (/^\s*img:/im.test(inner)) continue;                    // already has a real image
    const { meta, pieces } = parseBlock(inner);
    const gender = /women|female|ladies/i.test(meta.gender || '') ? 'woman' : 'man';
    const age = (meta.age || '').replace(/[^0-9a-z\s]/gi, '').trim();
    const q = [age, gender, pieces.slice(0, 4).join(' '), 'full body outfit fashion'].filter(Boolean).join(' ');
    const url = await ddgImage(q);
    if (!url) continue;
    // insert img: as the line right after the opening fence
    const block = body.slice(start, end);
    const newBlock = block.replace(/^```outfit\r?\n/, '```outfit\nimg: ' + proxy(url) + '\n');
    body = body.slice(0, start) + newBlock + body.slice(end);
    changed++;
    await new Promise(r => setTimeout(r, 1200));               // polite pacing
  }
  if (changed) { blob.answer = body; blob.outfit_img_at = Date.now(); await store.setJSON('answers/' + id + '.json', blob); }
  return { id, changed };
}

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const arg = (process.argv[2] || '').toLowerCase();
  let ids;
  if (arg && arg !== 'all') ids = [arg];
  else {
    const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
    ids = idx.entries.filter(e => /^sy\d+$/.test(e.id)).map(e => e.id).sort((a, b) => b.localeCompare(a)); // newest-first
    // optional lane split: LANE=1..NLANES each owns a disjoint set (by id number)
    const NL = parseInt(process.env.NLANES || '0'), LN = parseInt(process.env.LANE || '0');
    if (NL > 1 && LN >= 1) ids = ids.filter(id => (parseInt(id.slice(2)) % NL) === (LN - 1));
  }
  let totBlocks = 0, totEntries = 0;
  for (const id of ids) {
    if (fs.existsSync(STOP)) { console.log('STOP flag — halting'); break; }
    const r = await fillEntry(store, id);
    if (r.changed) { totEntries++; totBlocks += r.changed; console.log(`${id}: +${r.changed} real outfit images`); }
  }
  console.log(`DONE. entries updated: ${totEntries} | outfit images added: ${totBlocks}`);
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
