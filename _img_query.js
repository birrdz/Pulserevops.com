// _img_query.js — shared image-search disambiguation + junk-URL filter.
// Fixes the "Womb → fetus", "Tresor → treasure chest", "Contact → icon set"
// class of bug: searching a bare venue name returns the literal meaning of the
// word. Build a disambiguated query (name + venue-type + city) and hard-reject
// stock/illustration/product-catalog image hosts.
//
//   const { buildImageQuery, isJunkImageUrl } = require('./_img_query');
//   const q = buildImageQuery(itemName, 'nl', entry.question); // -> '"Womb" nightclub Tokyo'
//   results.filter(r => !isJunkImageUrl(r.imageUrl))

// Per-pillar venue/subject keyword appended to disambiguate the search.
const PILLAR_VENUE = {
  nl: 'nightclub bar', cl: 'club', dn: 'restaurant', ga: 'venue',
  rs: 'resort', es: 'estate property', lv: 'home', ev: 'event venue',
  bt: 'boat', ca: 'car', aq: 'aquarium', co: 'collectible',
  mv: 'movie', gm: 'video game', sy: 'fashion', tv: 'travel destination',
  tn: 'town', sc: 'school campus', pt: 'pet', sw: 'software', er: 'product',
  tl: 'software tool', tk: 'software', ai: 'AI software',
};

// City/locale is usually the last word(s) of a "Top 10 X in <City>" title.
function cityFromTitle(title) {
  const m = String(title || '').match(/\bin\s+([A-Z][A-Za-z.'-]+(?:\s+[A-Z][A-Za-z.'-]+){0,2})\s*$/);
  return m ? m[1].trim() : '';
}

function buildImageQuery(itemName, pillarPrefix, title) {
  const name = String(itemName || '').trim().replace(/\s+/g, ' ').slice(0, 80);
  const venue = PILLAR_VENUE[String(pillarPrefix || '').toLowerCase()] || '';
  const city = cityFromTitle(title);
  // Quote the name so the search treats it as a phrase, then add context.
  return [`"${name}"`, venue, city].filter(Boolean).join(' ').trim();
}

// Hosts that almost never carry a real venue/product editorial photo — stock
// illustration, clipart, microstock, and product-catalog/marketplace listings.
const JUNK_HOSTS = [
  'freepik', 'vecteezy', 'shutterstock', 'istockphoto', 'dreamstime', '123rf',
  'depositphotos', 'adobestock', 'stock.adobe', 'pngtree', 'flaticon', 'icons8',
  'cleanpng', 'pngwing', 'aliexpress', 'ebayimg.com', 'ebay.com', 'etsy.com',
  'amazon.com', 'media-amazon', 'khelmart', 'smartervegas',
];
// Path/file tokens that signal vector/clipart/icon/illustration (not a photo).
const JUNK_PATH_RX = /(vector|illustration|clip-?art|\bicons?\b|icons-|infographic|-set-|swatch|cartoon|drawing|sticker|logo-template|wallpaper|nebula|anatomy)/i;

function isJunkImageUrl(url) {
  const u = String(url || '').toLowerCase();
  if (!u) return true;
  if (JUNK_HOSTS.some((h) => u.includes(h))) return true;
  if (JUNK_PATH_RX.test(u)) return true;
  return false;
}

// Soft-flag hosts (allow, but down-rank vs. an official/maps/editorial domain):
const SOFT_HOST_RX = /(alamy|gettyimages|getty)/i;
function isSoftHost(url) { return SOFT_HOST_RX.test(String(url || '')); }

module.exports = { buildImageQuery, isJunkImageUrl, isSoftHost, cityFromTitle, PILLAR_VENUE };
