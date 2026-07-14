// _gp_assign_watcher.js — as the owner APPROVES images in the gallery, assign each to the best-matching
// GTM (gp) entry by industry (mechanic→Automotive, doctor→Healthcare, chef→Restaurants…), bake the entry
// TITLE in main-page CRO-gold (gold italic serif + bottom scrim that also hides any bottom lettering),
// and OVERWRITE that entry's cover /assets/qa/<id>.jpg. Deploy-gated (static) — nothing live till owner promotes.
// Generic images (office/boardroom/team) are RESERVED and used to fill gaps at the end; by the end every
// entry gets a cover (owner: "when push comes to shove just put them where they need to go").
// Runs continuously alongside the generator + approving. State: _gp_assign_state.json.
const fs = require('fs');
const sharp = require('sharp');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const POOL = WD + '/assets/qa/_gp_pool';
const QA = WD + '/assets/qa';
const PILLAR = process.env.ASSIGN_PILLAR || 'gp';                  // which pillar's Q&A face-cards to fill
const STATE_F = WD + '/_gp_assign_state' + (PILLAR === 'gp' ? '' : '_' + PILLAR) + '.json';
const path = require('path');
const loadJSON = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } };
const saveJSON = (f, o) => { try { fs.writeFileSync(f, JSON.stringify(o, null, 1)); } catch (e) {} };
const sleep = ms => new Promise(r => setTimeout(r, ms));

const FACE_TITLE_ORANGE = '#FFD54F', FACE_TITLE_STROKE = '#000000';
// Match _ddg_facecard_lib.js — clean sans, compact (owner 2026-07-11).
function goldTitleOverlaySVG(w, h, text) {
  const xesc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const clean = String(text || '').replace(/[#*_`>|]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 220);
  const words = clean.split(/\s+/).filter(Boolean);
  const lines = []; let cur = '';
  const maxChars = Math.max(w, h) >= 700 ? 34 : 24;
  words.forEach(x => { if ((cur + ' ' + x).trim().length > maxChars && cur) { lines.push(cur.trim()); cur = x; } else cur = (cur + ' ' + x).trim(); });
  if (cur) lines.push(cur);
  const L = lines.slice(-3);
  const F = Math.max(16, Math.min(32, Math.round(h * 0.072)));
  const lh = Math.round(F * 1.12);
  const y0 = h - Math.round(h * 0.055) - (L.length - 1) * lh, pad = Math.round(w * 0.04);
  const strokeW = Math.max(1.5, Math.round(F * 0.09));
  const ts = L.map((l, i) => '<text x="' + pad + '" y="' + (y0 + i * lh) + '" font-family="Arial,Helvetica,sans-serif" font-style="normal" font-weight="700" font-size="' + F + '" fill="' + FACE_TITLE_ORANGE + '" stroke="' + FACE_TITLE_STROKE + '" stroke-width="' + strokeW + '" stroke-linejoin="round" paint-order="stroke fill">' + xesc(l) + '</text>').join('');
  return Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '"><defs><linearGradient id="gt" x1="0" y1="0" x2="0" y2="1"><stop offset="0.5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.78"/></linearGradient></defs><rect width="' + w + '" height="' + h + '" fill="url(#gt)"/><g>' + ts + '</g></svg>');
}
// short, main-page-style title from a long gp entry title
function displayTitle(t) {
  let s = String(t || '').split(/\s+[—-]\s+/)[0].trim();         // drop "— The Complete Operator Guide"
  s = s.replace(/\?$/, '').trim();
  return s;
}

// scene -> industry category tokens
const SCENE_CATS = [
  [/firefighter|fire crew|firemen|blaze|ladder truck/, ['safety', 'gov', 'emergency', 'public']],
  [/police|security guard|cameras/, ['gov', 'govtech', 'security', 'cyber', 'safety']],
  [/construction|scaffolding|architect|crane|skyscraper|steel|bridge|job site/, ['construction', 'proptech', 'real estate', 'building', 'engineering']],
  [/mayor|ribbon|new building/, ['govtech', 'gov', 'construction', 'proptech']],
  [/nurse|doctor|hospital|clinic/, ['healthcare', 'health', 'medtech', 'pharma', 'life science', 'clinical']],
  [/scientist|laborator/, ['pharma', 'life science', 'biotech', 'ai infrastructure', 'research', 'cyber']],
  [/chef|line cook|kitchen|restaurant/, ['restaurant', 'food', 'hospitality']],
  [/barista|cafe/, ['restaurant', 'food', 'retail', 'hospitality']],
  [/warehouse|shelves/, ['logistics', 'supply chain', 'ecommerce', 'dtc', 'warehouse']],
  [/factory|assembly|welder|fabrication/, ['manufacturing', 'industrial']],
  [/delivery|loading dock|logistics team|depot|truck driver|crane operator|port|cargo/, ['logistics', 'supply chain', 'ecommerce', 'dtc', 'fleet', 'shipping']],
  [/mechanic|\bcar\b|garage|lifted car/, ['automotive', 'auto', 'vehicle']],
  [/city bus|bus driver/, ['automotive', 'transit', 'mobility', 'gov']],
  [/retail|store/, ['retail', 'ecommerce', 'dtc', 'commerce']],
  [/hotel|concierge/, ['travel', 'hospitality', 'hotel']],
  [/teacher|classroom|students/, ['edtech', 'education', 'learning', 'k-12', 'higher ed']],
  [/electrician|panel/, ['energy', 'utilities', 'electrical', 'construction']],
  [/plumber|pipes/, ['construction', 'proptech', 'home', 'field service']],
  [/data-center|server rack/, ['ai infrastructure', 'iot', 'telecom', 'cloud', 'saas', 'data', 'cyber']],
  [/farmer|tractor|field at sunrise/, ['agtech', 'agriculture', 'farming']],
  [/pilot|airliner|cockpit|crew boarding/, ['aviation', 'aerospace', 'travel', 'airline']],
  [/bank|trading floor|broker|financial advisor/, ['fintech', 'finance', 'banking', 'insuretech', 'trading']],
  [/real-estate|real estate|office space/, ['proptech', 'real estate', 'commercial']],
  [/design studio|drafting|graphic designer|creative studio/, ['media', 'entertainment', 'design', 'adtech', 'martech']],
  [/lawyer|courtroom/, ['legaltech', 'legal', 'law', 'gov']],
  [/startup founder|pitching|investors/, ['saas', 'startup', 'fintech', 'venture']],
  [/marketing team|whiteboard|brainstorm/, ['martech', 'adtech', 'marketing']],
  [/sales team/, ['saas', 'sales', 'b2b']],
];
const GENERIC = /business team|boardroom|executives|office tower|skyline|downtown office|receptionist|lobby|commuters|call-center|open office|janitor|handshake|meeting/i;
function sceneCats(scene) { const out = []; for (const [re, cats] of SCENE_CATS) if (re.test(scene)) out.push(...cats); return out; }
function isGeneric(scene) { return GENERIC.test(scene) && !SCENE_CATS.some(([re]) => re.test(scene)); }

function titleTokens(t) { return String(t || '').toLowerCase(); }
function scoreMatch(cats, title) { const lt = titleTokens(title); let s = 0; for (const c of cats) if (lt.includes(c)) s++; return s; }

async function overlayAndWrite(slot, entry) {
  const src = POOL + '/' + String(slot).padStart(3, '0') + '.jpg';
  if (!fs.existsSync(src)) return false;
  const dest = QA + '/' + entry.id + '.jpg';
  // one-time backup of the current live cover before first overwrite
  try { const bak = WD + '/_gp_cover_bak'; if (!fs.existsSync(bak)) fs.mkdirSync(bak, { recursive: true }); const bf = bak + '/' + entry.id + '.jpg'; if (fs.existsSync(dest) && !fs.existsSync(bf)) fs.copyFileSync(dest, bf); } catch (e) {}
  const buf = fs.readFileSync(src);
  const meta = await sharp(buf).metadata();
  const w = meta.width || 760, h = meta.height || 760;
  await sharp(buf).composite([{ input: goldTitleOverlaySVG(w, h, displayTitle(entry.question || entry.title)) }]).jpeg({ quality: 90 }).toFile(dest + '.tmp');
  fs.renameSync(dest + '.tmp', dest);
  return true;
}

(async () => {
  const idx = await store.get('_index.json', { type: 'json' });
  const entries = (idx.entries || idx || []).filter(e => e && new RegExp('^' + PILLAR + '\\d').test(e.id)).sort((a, b) => a.id.localeCompare(b.id));
  console.log('[' + PILLAR + '-assign] watching approvals · ' + entries.length + ' ' + PILLAR + ' entries to cover');
  const FINALIZE = WD + '/_gp_assign_finalize.flag';

  for (;;) {
    const man = loadJSON(WD + '/_gp_pool_manifest.json', { slots: [] });
    const appr = loadJSON(WD + '/_gp_pool_approval.json', {});
    const state = loadJSON(STATE_F, { slotToId: {}, reserved: [] });
    const usedIds = new Set(Object.values(state.slotToId));
    const usedSlots = new Set(Object.keys(state.slotToId).map(Number));
    const sceneOf = new Map(man.slots.map(s => [s.slot, s.scene || s.sourceTitle || '']));
    const provOf = new Map(man.slots.map(s => [s.slot, s.provider || '']));
    // cross-pillar exclusion: never reuse an image already placed on ANOTHER pillar's cover
    const otherUsed = new Set();
    try { for (const f of fs.readdirSync(WD)) { if (/^_gp_assign_state(_[a-z0-9]+)?\.json$/.test(f) && f !== path.basename(STATE_F)) { const o = loadJSON(WD + '/' + f, {}); for (const sl of Object.keys(o.slotToId || {})) otherUsed.add(Number(sl)); } } } catch (e) {}

    // UN-ASSIGN any cover that came from DDG (watermarked stock) so a clean image reclaims that entry
    for (const [sl, id] of Object.entries(state.slotToId)) {
      if (provOf.get(Number(sl)) === 'ddg') { delete state.slotToId[sl]; usedIds.delete(id); usedSlots.delete(Number(sl)); }
    }
    const unassigned = entries.filter(e => !usedIds.has(e.id));

    // approved, generated-ok, CLEAN provider (never DDG — watermarks), not yet assigned
    const reservedSet = new Set(state.reserved || []);
    const approved = man.slots.filter(s => s.ok && appr[s.slot] === 'ok' && s.provider !== 'ddg' && !usedSlots.has(s.slot) && !otherUsed.has(s.slot));
    let placed = 0;
    for (const s of approved) {
      const scene = sceneOf.get(s.slot) || '';
      if (isGeneric(scene)) { reservedSet.add(s.slot); continue; }         // hold generics for end gap-fill
      const cats = sceneCats(scene);
      let best = null, bestScore = 0;
      for (const e of unassigned) { if (usedIds.has(e.id)) continue; const sc = scoreMatch(cats, e.question || e.title); if (sc > bestScore) { bestScore = sc; best = e; } }
      if (best && bestScore > 0) {
        if (await overlayAndWrite(s.slot, best)) { state.slotToId[s.slot] = best.id; usedIds.add(best.id); usedSlots.add(s.slot); reservedSet.delete(s.slot); placed++; console.log('[gp-assign] ✓ #' + s.slot + ' (' + scene.slice(0, 30) + ') → ' + best.id + ' ' + displayTitle(best.question).slice(0, 40)); }
      } else { reservedSet.add(s.slot); }                                   // no industry match → reserve
    }

    // END GAP-FILL: when generation is done OR owner drops _gp_assign_finalize.flag, place every remaining
    // approved (reserved/unmatched) image onto the still-uncovered entries so nothing is left blank.
    const genDone = (man.generated || 0) + (man.fail || 0) >= (man.total || 450);
    if (fs.existsSync(FINALIZE) || genDone) {
      const pool = [...reservedSet].filter(sl => !usedSlots.has(sl) && !otherUsed.has(sl) && provOf.get(sl) !== 'ddg');
      const remaining = entries.filter(e => !usedIds.has(e.id));
      let fi = 0;
      for (const e of remaining) {
        if (fi >= pool.length) break;
        const sl = pool[fi++];
        if (await overlayAndWrite(sl, e)) { state.slotToId[sl] = e.id; usedIds.add(e.id); usedSlots.add(sl); reservedSet.delete(sl); placed++; console.log('[gp-assign] ↪ gap-fill #' + sl + ' → ' + e.id); }
      }
    }

    state.reserved = [...reservedSet];
    saveJSON(STATE_F, state);
    const cov = Object.keys(state.slotToId).length;
    fs.writeFileSync(WD + '/_gp_assign_progress.txt', 'assigned ' + cov + '/' + entries.length + ' · reserved ' + state.reserved.length + ' · this sweep +' + placed);
    await sleep(6000);
  }
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });
