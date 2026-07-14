// _car_type_gen.js — REGULAR real-looking car images, 200 per car type, then the next type (owner 2026-07-10).
// Iterates make/model x year, real photos from Pexels first (regular type), realistic Pollinator fallback.
// Writes into the shared pool (assets/qa/_gp_pool) + manifest so the approval gallery (:8905) shows them.
// Resume-safe (_car_type_done.json tracks images made per type). One image at a time, 3s apart.
'use strict';
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { grade } = require('./_gp_grade.js');
const PEXELS = process.env.PEXELS_API_KEY;
const PTOK = process.env.POLLINATOR_API_KEY || process.env.POLLINATIONS_TOKEN || process.env.POLLINATIONS_API_KEY || '';
const POOL = WD + '/assets/qa/_gp_pool';
const MANI = WD + '/_gp_pool_manifest.json';
const DONE_F = WD + '/_car_type_done.json';
const PER_TYPE = parseInt(process.env.PER_TYPE || '200', 10);
const START_SLOT = parseInt(process.env.CAR_SLOT_BASE || '20000', 10);   // car-type images live at 20000+
const GAP_MS = parseInt(process.env.CAR_GAP_MS || '3000', 10);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const YEARS = [];
for (let y = 2026; y >= 2010; y--) YEARS.push(y);
const TYPES = [
  'Ford F-150','Chevrolet Silverado','Ram 1500','Toyota Tacoma','Toyota Tundra','GMC Sierra','Jeep Wrangler','Jeep Grand Cherokee','Jeep Gladiator','Ford Bronco',
  'Toyota Camry','Honda Accord','Toyota Corolla','Honda Civic','Nissan Altima','Tesla Model 3','Tesla Model Y','Tesla Model S','Tesla Cybertruck','Ford Mustang',
  'Chevrolet Corvette','Chevrolet Camaro','Dodge Challenger','Dodge Charger','Ford Explorer','Toyota RAV4','Honda CR-V','Toyota Highlander','Subaru Outback','Subaru Forester',
  'Ford Escape','Chevrolet Tahoe','Chevrolet Suburban','GMC Yukon','Cadillac Escalade','Toyota 4Runner','Nissan Frontier','Honda Ridgeline','Ford Ranger','Land Rover Defender',
  'Toyota Land Cruiser','Range Rover','BMW 3 Series','BMW X5','Mercedes-Benz C-Class','Mercedes-Benz G-Class','Audi Q5','Audi A4','Porsche 911','Lexus RX',
];

const loadJSON = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } };
const mani = loadJSON(MANI, { slots: [] });
const okSlots = new Set(mani.slots.map(s => s.slot));
let slotCursor = START_SLOT;
function nextSlot() { while (okSlots.has(slotCursor)) slotCursor++; okSlots.add(slotCursor); return slotCursor; }
function markSlot(slot, meta) { mani.slots.push(Object.assign({ slot, ok: true }, meta)); try { fs.writeFileSync(MANI, JSON.stringify(mani, null, 1)); } catch (e) {} }

async function pexels(q, page) {
  if (!PEXELS) return null;
  try {
    const r = await fetch('https://api.pexels.com/v1/search?per_page=15&page=' + page + '&query=' + encodeURIComponent(q), { headers: { Authorization: PEXELS }, signal: AbortSignal.timeout(30000) });
    if (!r.ok) return null; const ph = ((await r.json()).photos || []); if (!ph.length) return null;
    const url = (ph[Math.floor(Math.random() * ph.length)].src || {}); const u = url.large2x || url.large || url.original;
    const ir = await fetch(u, { signal: AbortSignal.timeout(30000) }); if (!ir.ok) return null;
    const b = Buffer.from(await ir.arrayBuffer()); return b.length > 3000 ? b : null;
  } catch (e) { return null; }
}
async function flux(prompt, seed) {
  const url = 'https://image.pollinations.ai/prompt/' + encodeURIComponent(prompt) + '?width=760&height=760&nologo=true&model=flux&seed=' + (seed % 1000000);
  for (let a = 0; a < 4; a++) { try { const r = await fetch(url, { headers: PTOK ? { Authorization: 'Bearer ' + PTOK } : {}, signal: AbortSignal.timeout(120000) }); if (r.ok && (r.headers.get('content-type') || '').startsWith('image')) { const b = Buffer.from(await r.arrayBuffer()); if (b.length > 3000) return b; } } catch (e) {} await sleep(2500); }
  return null;
}

async function main() {
  const done = loadJSON(DONE_F, {});   // { 'Ford F-150': 200, ... }
  console.log('[car-type] types=' + TYPES.length + '  per-type=' + PER_TYPE + '  regular real photos (Pexels first, flux fallback)');
  for (const type of TYPES) {
    let made = done[type] || 0;
    if (made >= PER_TYPE) { console.log('[car-type] ' + type + ' already ' + made + ' — skip'); continue; }
    console.log('\n[car-type] ══ ' + type + ' ══ (' + made + '/' + PER_TYPE + ')');
    while (made < PER_TYPE) {
      const year = YEARS[made % YEARS.length];
      const q = year + ' ' + type;
      let buf = await pexels(q + ' car', 1 + (made % 20));
      let src = 'pexels';
      if (!buf) { buf = await flux('a regular realistic photograph of a ' + year + ' ' + type + ' car, real photo, no text, no watermark', (made * 2654435761 + type.length) >>> 0); src = 'flux'; }
      if (buf) {
        const slot = nextSlot();
        try { await grade(buf, POOL + '/' + String(slot).padStart(3, '0') + '.jpg', { w: 760, h: 760, pass: 0 }); markSlot(slot, { scene: q, type, year, provider: src }); made++; done[type] = made; fs.writeFileSync(DONE_F, JSON.stringify(done)); process.stdout.write('\r[car-type] ' + type + ' ' + made + '/' + PER_TYPE + ' (slot ' + slot + ', ' + src + ')   '); }
        catch (e) {}
      }
      await sleep(GAP_MS);
    }
    console.log('\n[car-type] ✓ ' + type + ' done (' + made + ')');
  }
  console.log('\n[car-type] ALL TYPES DONE');
}
main().catch(e => { console.error('[car-type] FATAL', e.message); process.exit(1); });
