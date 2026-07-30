// 🦆 DDG IMAGE SEARCH — real photographs of real, named things.
//
// Owner 2026-07-30: franchise pages need "a picture of the store", not stock and not a generated
// mark. DDG is a web image search, so "Five Guys restaurant storefront" returns actual photographs
// of actual Five Guys buildings. Stock libraries never will, and a generator can only invent one.
//
// Keyless, unmetered, serialised with a fixed gap so there is exactly ONE request in flight per
// process. Verified 2026-07-30: 56 results for Five Guys storefront, 35 for a Mr. Rooter van,
// 33 for a Blink Fitness interior — all ≥1200px.

'use strict';

const DDG_GAP_MS = parseInt(process.env.DDG_GAP_MS || '5000', 10);
const MIN_W = parseInt(process.env.DDG_MIN_WIDTH || '1200', 10);
const TTL_MS = 6 * 3600 * 1000;

let _token = { t: '', at: 0 };
let _last = 0;
let _chain = Promise.resolve();
const _cache = new Map();
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function one(query) {
  const key = String(query).toLowerCase().trim();
  const hit = _cache.get(key);
  if (hit && (Date.now() - hit.at) < TTL_MS) return hit.p;

  const gap = DDG_GAP_MS - (Date.now() - _last);
  if (gap > 0) await sleep(gap);
  _last = Date.now();

  try {
    // DDG hands out a short-lived vqd token on the HTML page; the image API rejects requests without it.
    if (!_token.t || Date.now() - _token.at > 900000) {
      const h = await fetch('https://duckduckgo.com/?q=' + encodeURIComponent(query),
        { headers: { 'user-agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(20000) });
      const txt = await h.text();
      const m = txt.match(/vqd=["']?([-\d]+)["']?/) || txt.match(/vqd=([^&"']+)/);
      if (!m) return [];
      _token = { t: m[1], at: Date.now() };
      await sleep(1200);
    }
    const u = 'https://duckduckgo.com/i.js?l=us-en&o=json&q=' + encodeURIComponent(query)
      + '&vqd=' + encodeURIComponent(_token.t) + '&f=,,,size:Large,,&p=1';
    const r = await fetch(u, {
      headers: { 'user-agent': 'Mozilla/5.0', referer: 'https://duckduckgo.com/' },
      signal: AbortSignal.timeout(20000),
    });
    if (!r.ok) { if (r.status === 403) _token = { t: '', at: 0 }; return []; }
    const j = await r.json();
    const out = (j.results || [])
      .map(x => ({ url: x.image, alt: x.title || '', w: x.width || 0, h: x.height || 0, by: x.source || 'ddg', page: x.url || '' }))
      // https ONLY: the crew's downloader is https.get(), which throws
      // 'Protocol "http:" not supported' on a plain-http URL and kills the page's image loop.
      .filter(x => x.url && /^https:\/\//i.test(x.url) && x.w >= MIN_W);
    _cache.set(key, { at: Date.now(), p: out });
    return out;
  } catch (e) { return []; }
}

/** Serialised search — one request at a time, DDG_GAP_MS apart, process-wide. */
function ddgSearch(query) {
  _chain = _chain.then(() => one(query)).catch(() => []);
  return _chain;
}

// ── BRAND EXTRACTION ────────────────────────────────────────────────────────
// "Should I open or buy a Mr. Rooter Plumbing franchise in 2027?" → "Mr. Rooter Plumbing"
// Verified on the live index: parses cleanly on 939 of 1,104 fr pages (85%). The remaining 15%
// are pages that name no single company ("Best Asian-cuisine franchises to buy in 2027",
// "How do I franchise my own business?") — those correctly get generic imagery instead.
function franchiseBrand(title) {
  const m = String(title || '').match(/(?:open or buy|buy|open|start|own)\s+(?:a|an|the)?\s*(.+?)\s+franchise/i);
  if (!m) return '';
  const b = m[1].trim();
  // guard against a whole clause landing here
  if (!b || b.length > 60 || /\b(?:my own|your own|a new|the best)\b/i.test(b)) return '';
  return b;
}

/** Scene queries for a named business — real photos, never a logo or brand mark.
 *  Deliberately category-neutral: an earlier version led with "<brand> restaurant storefront",
 *  which is nonsense for a pest-control or plumbing franchise and returned a farmers market
 *  photo for "Mosquito Authority". "storefront" and "location" work across every category. */
function storeQueries(brand) {
  return [
    brand + ' storefront',
    brand + ' location',
    brand + ' store',
    brand + ' building exterior',
    brand + ' sign',
    brand,
  ];
}

/**
 * RELEVANCE GUARD for named entities: the alt text must actually mention the thing.
 * This is what stops "Gerardi's Farmers Market" being accepted as a Mosquito Authority photo.
 * Requires every significant word of the brand to appear (so "White Spot" needs both words,
 * blocking a generic "white wall" hit), ignoring short connector words.
 */
function brandMatch(alt, brand) {
  const a = ' ' + String(alt || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ') + ' ';
  const phrase = String(brand || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (!phrase) return false;
  // The brand must appear as a CONTIGUOUS PHRASE. Requiring only that each word appear somewhere
  // let "White Spot Lesions in Orthodontics" through as a White Spot restaurant photo.
  // Word-boundary phrase match. The old `includes(' '+phrase)` allowed a PREFIX, so
  // "white spots on posters" matched the brand "white spot". Anchor the end of the phrase.
  // Word-boundary phrase match. A plain includes() allowed a PREFIX, so "white spots on posters"
  // matched the brand "white spot". Both ends must land on a word boundary.
  const esc = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp('(^|\\s)' + esc + '(\\s|$)').test(a.trim());
}

// Signals that an image is of a BUSINESS PREMISES rather than something that merely shares the
// brand's words. "White Spot" is a real restaurant chain AND a dental condition AND a poster
// defect — the phrase match alone cannot separate them, but "opening hours" / "location" /
// "restaurant" in the alt text can.
const BIZ_SIGNAL = /\b(restaurant|store|storefront|shop|location|locations|opening hours|franchise|outlet|branch|mall|plaza|drive[- ]?thru|menu|address|street|avenue|road|opens?|opened|new\s+\w+\s+location|company|service|pest|plumbing|gym|fitness|salon|cafe|coffee|bakery|dealer|center|centre)\b/i;
// Signals the image is about something else that happens to share the name.
const OFF_TOPIC = /\b(lesion|lesions|orthodontic|dental|teeth|tooth|disease|symptom|diagnos|posters?|wallpapers?|nail|skin|rash|fungus|paint defect|drywall|clip ?art|vector|icon set|lego|minifig|miniature|toy|model kit|diorama|papercraft|cake|costume|tattoo|meme)\b/i;

/** 0 = reject, higher = better. Used to rank verified brand photos. */
function brandScore(alt, brand) {
  if (!brandMatch(alt, brand)) return 0;
  const t = String(alt || '');
  if (OFF_TOPIC.test(t)) return 0;            // shares the name, different subject
  return BIZ_SIGNAL.test(t) ? 2 : 1;          // premises evidence ranks above a bare name match
}

/** Real photos of a named business, best-first, each one verified to mention the brand. */
async function brandPhotos(brand, want) {
  // OVER-FETCH ON PURPOSE. Plenty of DDG hosts block hotlinking, so a meaningful share of any
  // pool 403s at download time — measured 2 of 4 on a Five Guys pool. Collect ~3x what the page
  // needs so the picker still has real candidates after the failures.
  const need = Math.max(1, want || 11);
  const target = need * 3;
  const seen = new Set();
  const out = [];
  for (const q of storeQueries(brand)) {
    if (out.length >= target) break;
    const rows = await ddgSearch(q);
    for (const r of rows) {
      if (!r.url || seen.has(r.url)) continue;
      const sc = brandScore(r.alt, brand);
      if (!sc) continue;                            // must actually be this business
      seen.add(r.url);
      out.push(Object.assign({ via: q, score: sc }, r));
    }
  }
  // premises evidence first, then bigger images
  out.sort((a, b) => (b.score - a.score) || (b.w * b.h - a.w * a.h));
  return out.slice(0, target);
}

// ── NAMED-ITEM PHOTOS (ranked pages) ────────────────────────────────────────
// Owner 2026-07-30, gaming next. A ranked page names its real things INSIDE the items
// ("## 3. Persona 5 Royal"), not in the page title the way a franchise does. So slot N is
// searched for item N by name, and verified the same way: the item name must appear as a
// contiguous phrase, and off-topic subjects are rejected.
//
// CATEGORY HINT disambiguates a bare name. "Persona 5 Royal" alone is fine, but "Control" or
// "Journey" as a game name would return anything; "Control game cover" does not.

/** Strip ranking furniture off a "## N. Name 🏆 BEST OVERALL" heading. */
function itemName(heading) {
  return String(heading || '')
    .replace(/^#{2,3}\s*/, '').replace(/^\d+[.)]\s*/, '')
    .replace(/[🏆💎]/g, '').replace(/\bBEST\s+(?:OVERALL|VALUE)\b/gi, '')
    .replace(/[—–|]/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

/** Every ranked item name on a page, in rank order. */
function rankedItems(body) {
  return (String(body || '').match(/^##\s+\d+\.\s+(.+)$/gm) || []).map(itemName).filter(Boolean);
}

/** The subject noun of a ranked page: "Top 10 Gaming TVs in 2027" -> "gaming tvs".
 *  This is the disambiguator, and it MUST come from the page rather than the pillar: gm holds
 *  "Gaming TVs", "Capture Cards", "VR Headsets" AND "Battle Royale Games", so a fixed
 *  "game cover art" hint would search "LG C4 OLED game cover art" and return nonsense. */
function pageSubject(title) {
  return String(title || '')
    .replace(/^\s*(?:the\s+)?(?:top|best)\s*\d*\s*/i, '')
    .replace(/\bin\s+(?:19|20)\d{2}\b.*$/i, '')
    .replace(/[—–|].*$/, '')
    .replace(/\bfor\s+\d{4}\b.*$/i, '')
    .replace(/[?"]/g, '').replace(/\s{2,}/g, ' ').trim().toLowerCase();
}

/** Real photos of ONE named item, verified to actually be it. */
async function itemPhotos(name, pageTitle, want) {
  const subj = pageSubject(pageTitle);
  // Bare name first — a model name like "Sony PlayStation 5" or "Persona 5 Royal" is already
  // unambiguous. The page subject is the fallback for short/generic names ("Control", "Journey").
  const queries = [name, subj ? name + ' ' + subj : ''].filter(Boolean);
  const target = Math.max(1, want || 1);
  const seen = new Set();
  const out = [];
  for (const q of queries) {
    if (out.length >= target) break;
    const rows = await ddgSearch(q);
    for (const r of rows) {
      if (out.length >= target) break;
      if (!r.url || seen.has(r.url)) continue;
      if (!brandMatch(r.alt, name)) continue;      // must actually be this item
      if (OFF_TOPIC.test(String(r.alt || ''))) continue;
      seen.add(r.url);
      out.push(Object.assign({ via: 'ddg-item', item: name }, r));
    }
  }
  return out;
}

/**
 * One verified photo per ranked item, in rank order, so slot N illustrates item N.
 * An item DDG cannot verify simply yields nothing and the ladder covers that slot instead.
 */
async function rankedItemPhotos(body, pageTitle, want) {
  const items = rankedItems(body).slice(0, Math.max(1, want || 11));
  const out = [];
  for (const name of items) {
    const p = await itemPhotos(name, pageTitle, 1);
    if (p.length) out.push(p[0]);
  }
  return out;
}

module.exports = { ddgSearch, itemName, rankedItems, itemPhotos, rankedItemPhotos, pageSubject, franchiseBrand, storeQueries, brandMatch, brandScore, brandPhotos, DDG_GAP_MS, MIN_W };
