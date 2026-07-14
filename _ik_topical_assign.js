// _ik_topical_assign.js — RE-ASSIGN the KPI (ik) face-cards TOPICALLY (owner 2026-07-09).
// The auto gap-fill put Star-Wars/generic images on business KPI pages. This reads each KPI's INDUSTRY from
// its title and assigns a matching BUSINESS/INDUSTRY image (never sci-fi), spread round-robin to minimize
// repeats, with an ADAPTIVE gold title (auto-shrinks so long titles never clip). Overwrites /assets/qa/ik*.jpg
// (deploy-gated). Reuse across entries is allowed (topical beats unique-but-wrong). One-shot, not a watcher.
const fs = require('fs');
const sharp = require('sharp');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const POOL = WD + '/assets/qa/_gp_pool', QA = WD + '/assets/qa';
const FACE_TITLE_ORANGE = '#FFD54F', FACE_TITLE_STROKE = '#000000';

// ---------- Compact gold title — clean sans (match _ddg_facecard_lib.js) ----------
function goldTitleOverlaySVG(w, h, text) {
  const xesc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const clean = String(text || '').replace(/[#*_`>|]/g, ' ').replace(/\s+/g, ' ').trim();
  const words = clean.split(/\s+/).filter(Boolean);
  const pad = Math.round(w * 0.04), maxW = w - pad * 2;
  let F = Math.max(16, Math.min(32, Math.round(h * 0.072))), lines = [];
  for (let iter = 0; iter < 12; iter++) {
    const cw = F * 0.55;                                   // approx glyph advance for bold Arial
    const maxChars = Math.max(6, Math.floor(maxW / cw));
    lines = []; let cur = '';
    for (const wd of words) { if ((cur + ' ' + wd).trim().length > maxChars && cur) { lines.push(cur.trim()); cur = wd; } else cur = (cur + ' ' + wd).trim(); }
    if (cur) lines.push(cur);
    const longest = lines.reduce((a, l) => Math.max(a, l.length), 0);
    if (lines.length <= 3 && longest * cw <= maxW) break;
    F = Math.round(F * 0.9);
  }
  const L = lines.slice(0, 3);
  const lh = Math.round(F * 1.12);
  const y0 = h - Math.round(h * 0.055) - (L.length - 1) * lh;
  const strokeW = Math.max(1.5, Math.round(F * 0.09));
  const ts = L.map((l, i) => '<text x="' + pad + '" y="' + (y0 + i * lh) + '" font-family="Arial,Helvetica,sans-serif" font-style="normal" font-weight="700" font-size="' + F + '" fill="' + FACE_TITLE_ORANGE + '" stroke="' + FACE_TITLE_STROKE + '" stroke-width="' + strokeW + '" stroke-linejoin="round" paint-order="stroke fill">' + xesc(l) + '</text>').join('');
  return Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '"><defs><linearGradient id="gt" x1="0" y1="0" x2="0" y2="1"><stop offset="0.5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.78"/></linearGradient></defs><rect width="' + w + '" height="' + h + '" fill="url(#gt)"/><g>' + ts + '</g></svg>');
}
function displayTitle(t) { return String(t || '').split(/\s+[—-]\s+/)[0].replace(/\?$/, '').trim(); }

// ---------- KPI industry -> which pool scenes fit ----------
const SCIFI = /starfighter|sith|jedi|droid|mech|robot|cyborg|cyber|galactic|emperor|sarlacc|walker|lightsaber|space opera|alien|rebel|throne|desert planet|twin sun|astromech|android|hologram|neon|dragon|nano|exosuit|futuristic|drone|starship|battle station|podracer|samurai|inventor|friends|sports|athlete|book|reader|autonomous car|glowing|self-built|contraption|robotic/i;
// each: [industry regex on the KPI title, scene regex on the pool image]
const MAP = [
  [/solar|renewable|wind|energy|utilit|power|electric|oil|gas|nuclear|coal|grid/, /electrician|welder|factory|solar|panel|turbine|data-center|construction|refinery|utility|energy/],
  [/car rental|auto|automotive|vehicle|dealership|rideshare|electric vehicle|motorcycle|\btire/, /mechanic|\bcar\b|garage|automotive|auto detailer|car dealership/],
  [/cruise|airline|aviation|aerospace|travel|tourism|hotel|hospitality|resort|vacation|lodging|casino/, /hotel|concierge|pilot|airliner|travel|housekeeping|catering|hospitality/],
  [/universit|college|school|education|edtech|k-12|tutoring|academ|student|learning|bootcamp/, /teacher|classroom|students|lecture|university|campus|course/],
  [/real estate|property|proptech|realtor|housing|mortgage|construction|architec|contractor|hvac|plumb|roofing|landscap/, /real-estate agent|architect reviewing|construction crew|scaffolding|plumber|property manager/],
  [/stream|media|entertainment|ott|film|music|gaming|advertis|marketing|adtech|content|creator|podcast|publishing/, /design studio|marketing team|drafting|graphic designer|creative|video|photographer/],
  [/restaurant|food|dining|cafe|catering|bakery|brewery|beverage|qsr|fast food|grocery/, /chef|line cook|kitchen|restaurant|barista|cafe|brewery|catering/],
  [/retail|store|ecommerce|e-commerce|dtc|apparel|fashion|footwear|consumer goods|boutique|mall/, /retail|store|boutique|shopper|customer in a shop|florist/],
  [/bank|financ|fintech|insur|investment|wealth|lending|payment|trading|accounting|tax|credit|capital/, /bank|trading floor|broker|financial advisor|teller/],
  [/health|hospital|medical|pharma|clinic|dental|biotech|medtech|life science|nursing|senior|home care|hospice|wellness|therapy|veterinar/, /nurse|doctor|hospital|dentist|pharmacist|clinic|therapist|laborator|scientist/],
  [/logistic|shipping|freight|supply chain|warehouse|fulfillment|delivery|courier|trucking|3pl|distribution|port|maritime/, /warehouse|delivery|loading dock|logistics|crane operator|port|cargo|truck driver/],
  [/manufactur|factory|industrial|machin|fabricat|assembly|production|steel|chemical|textile/, /factory|welder|fabrication|assembly|machinist|industrial/],
  [/software|saas|tech|it services|cloud|data|cyber|telecom|network|iot|\bai\b|platform|app|developer|managed service/, /software|data-center|server rack|developer|coding|it support|programmer|cybersecurity analyst/],
  [/legal|law firm|attorney|court|paralegal|litigation/, /lawyer|courtroom|legal|court reporter/],
  [/agricult|farm|crop|agtech|ranch|dairy|livestock/, /farmer|tractor|greenhouse|crops|field/],
  [/salon|beauty|spa|barber|cosmetic|fitness|gym|personal training/, /hair stylist|salon|spa|trainer|gym|barber/],
  [/govern|public sector|municipal|nonprofit|emergency|fire|police|security|safety|defense/, /firefighter|police|security guard|emergency|paramedic|government/],
  [/funeral|cemetery|mortuary|memorial/, /nurse|doctor|home-health|hospital/],
];
function catImages(title, biz) {
  const t = String(title || '').toLowerCase();
  for (const [ind, scene] of MAP) { if (ind.test(t)) { const hits = biz.filter(s => scene.test(s.scene || '')); if (hits.length) return hits; } }
  return null; // fall back to general business
}

(async () => {
  const idx = await store.get('_index.json', { type: 'json' });
  const PILLAR = process.env.TOPICAL_PILLAR || 'ik';
  const ik = (idx.entries || idx || []).filter(e => e && new RegExp('^' + PILLAR + '\\d').test(e.id)).sort((a, b) => a.id.localeCompare(b.id));
  const man = JSON.parse(fs.readFileSync(WD + '/_gp_pool_manifest.json', 'utf8'));
  const biz = man.slots.filter(s => s.ok && !SCIFI.test(s.scene || s.sourceTitle || '') && fs.existsSync(POOL + '/' + String(s.slot).padStart(3, '0') + '.jpg'));
  // general-business fallback bucket (offices/teams/professionals) for entries with no industry match
  const general = biz.filter(s => /business team|boardroom|executives|office|receptionist|lobby|commuters|call-center|meeting|handshake|sales team|startup|marketing|professional/i.test(s.scene || ''));
  console.log('[ik-topical] ' + ik.length + ' KPI entries · ' + biz.length + ' business images · ' + general.length + ' general fallback');

  const useCount = new Map();                              // slot -> times used (spread evenly)
  const pick = arr => { let best = null, bestN = Infinity; for (const s of arr) { const n = useCount.get(s.slot) || 0; if (n < bestN) { bestN = n; best = s; } } if (best) useCount.set(best.slot, (useCount.get(best.slot) || 0) + 1); return best; };
  const state = { slotToId: {} }; let done = 0, gen = 0;
  for (const e of ik) {
    let bucket = catImages(e.question || e.title, biz);
    const matched = !!(bucket && bucket.length);
    if (!matched) bucket = biz;                                 // no industry match -> draw from ALL business images (varied, never a repetitive office loop)
    const s = pick(bucket && bucket.length ? bucket : biz);
    if (!s) continue;
    const src = POOL + '/' + String(s.slot).padStart(3, '0') + '.jpg';
    const dest = QA + '/' + e.id + '.jpg';
    try {
      const buf = fs.readFileSync(src);
      const meta = await sharp(buf).metadata();
      const outBuf = await sharp(buf).composite([{ input: goldTitleOverlaySVG(meta.width || 760, meta.height || 760, displayTitle(e.question || e.title)) }]).jpeg({ quality: 90 }).toBuffer();
      try { fs.unlinkSync(dest); } catch (x) {}                 // REMOVE the old cover first (owner), then write new
      fs.writeFileSync(dest, outBuf);
      state.slotToId[s.slot + '_' + e.id] = e.id;
      done++; if (!matched) gen++;
      if (done % 100 === 0) console.log('[ik-topical] ' + done + '/' + ik.length);
    } catch (x) { console.log('[ik-topical] ✖ ' + e.id + ' ' + (x && x.message)); }
  }
  fs.writeFileSync(WD + '/_ik_topical_state_' + (process.env.TOPICAL_PILLAR||'ik') + '.json', JSON.stringify(state, null, 1));
  console.log('[ik-topical] DONE · assigned ' + done + '/' + ik.length + ' · general-fallback ' + gen + ' · distinct images used ' + useCount.size);
})().catch(x => { console.error('FATAL', x.message); process.exit(1); });
