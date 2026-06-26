// Dry-run that re-uses the polish script's body content without hitting blob
const fs = require('fs');
const src = fs.readFileSync(__dirname + '/polish-q1989-deep.js', 'utf8');

function extract(name) {
  const pattern = 'const ' + name + ' = `';
  const startIdx = src.indexOf(pattern);
  if (startIdx === -1) return null;
  const bodyStart = startIdx + pattern.length;
  // Find the closing backtick at end-of-line — match \`;\n
  const endIdx = src.indexOf('`;', bodyStart);
  if (endIdx === -1) return null;
  return src.slice(bodyStart, endIdx);
}

function countWords(s) {
  return String(s || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[#>*_`~|\-=]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .length;
}

const parts = ['TLDR','U1','U2','U3','FLOW','SOURCES','NUMBERS','COUNTER','RELATED'];
let answer = '';
for (const p of parts) {
  const v = extract(p);
  if (v === null) { console.error('MISSING', p); process.exit(1); }
  console.log(p.padEnd(8), countWords(v).toString().padStart(5), 'words /', v.length, 'chars');
  answer += v;
}
const totalWords = countWords(answer);
console.log('\nTOTAL:', totalWords, 'words /', answer.length, 'chars');
console.log('HARD_CAP 10500 — margin:', 10500 - totalWords);

const e1_h3 = /^###\s+Direct Answer\b/m.test(answer);
const head = answer.slice(0, 14000);
const directBlock = head.match(/### Direct Answer\s*\n+([\s\S]{0,13000})/);
const e1_bold = directBlock ? /\*\*[^*]+\*\*/.test(directBlock[1].split(/\n##\s/)[0].split(/\n###\s/)[0]) : false;
const e2_h2 = (answer.match(/^##\s+/gm) || []).length;
const e3_numbered = (answer.match(/^###\s+\d+\.\s+/gm) || []).length;
const e4_bullets_bold = (answer.match(/^[-*]\s+\*\*[^*]+\*\*/gm) || []).length;
const e6_inline_links = (answer.match(/\]\(https?:\/\//g) || []).length;

console.log('\nELEMENT AUDIT:');
console.log('  e1_direct_answer_h3      =', e1_h3);
console.log('  e1_bold_tldr_top         =', e1_bold);
console.log('  e2_h2_banners            =', e2_h2);
console.log('  e3_numbered_subsections  =', e3_numbered);
console.log('  e4_bullets_with_bold     =', e4_bullets_bold);
console.log('  e6_inline_links          =', e6_inline_links);

// Real-name probe set
const realName = {
  yankee_candle:      /Yankee Candle/i.test(answer),
  newell_brands:      /Newell Brands|\bNWL\b/i.test(answer),
  bath_body_works:    /Bath\s*&?\s*Body Works|\bBBWI\b/i.test(answer),
  diptyque:           /Diptyque/i.test(answer),
  jo_malone:          /Jo Malone/i.test(answer),
  estee_lauder:       /Estée Lauder|Estee Lauder|\bEL\b/.test(answer),
  voluspa:            /Voluspa/i.test(answer),
  pf_candle:          /P\.F\. Candle/i.test(answer),
  boy_smells:         /Boy Smells/i.test(answer),
  nest_new_york:      /NEST New York/i.test(answer),
  otherland:          /Otherland/i.test(answer),
  homesick:           /Homesick/i.test(answer),
  wicks_n_more:       /Wicks 'n' More|Wicks n More/i.test(answer),
  candle_science:     /CandleScience/i.test(answer),
  flaming_candle:     /Flaming Candle/i.test(answer),
  lone_star:          /Lone Star Candle Supply/i.test(answer),
  etsy_etsy:          /Etsy.*ETSY|ETSY.*Etsy|\bETSY\b/i.test(answer),
  shopify_shop:       /Shopify.*SHOP|SHOP.*Shopify|\bSHOP\b/i.test(answer),
  faire:              /Faire/.test(answer),
  squarespace:        /Squarespace/i.test(answer),
  amazon_handmade:    /Amazon Handmade/i.test(answer),
  nca:                /National Candle Association|\bNCA\b/.test(answer),
  dot_shipping:       /\bDOT\b/.test(answer),
  fda_cosmetics:      /\bFDA\b/.test(answer),
  square_pos:         /Square.{0,30}(POS|payments|reader)|\bSQ\b/.test(answer),
  klaviyo:            /Klaviyo/i.test(answer),
  meta_instagram:     /Meta.{0,30}(business|Facebook|Instagram)/i.test(answer),
  tiktok_shop:        /TikTok Shop/i.test(answer),
  astm:               /\bASTM\b/.test(answer),
  ifra:               /\bIFRA\b/.test(answer),
  indie_business:     /Indie Business Network/i.test(answer),
  flip_thimble:       /FLIP|Thimble/i.test(answer),
  act_insurance:      /ACT Insurance/i.test(answer),
  woodwick:           /WoodWick/i.test(answer),
  apotheke:           /Apotheke/i.test(answer),
  le_labo:            /Le Labo/i.test(answer),
  golden_brands:      /Golden Brands|AAK/i.test(answer),
  cargill_naturewax:  /NatureWax|Cargill/i.test(answer),
  bramble_berry:      /Bramble Berry/i.test(answer),
  makesy:             /Makesy/i.test(answer),
  natures_garden:     /Nature's Garden|Natures Garden/i.test(answer),
  aztec:              /Aztec Candle/i.test(answer),
};
const hits = Object.values(realName).filter(Boolean).length;
console.log('  e5_real_name_hits        =', hits + '/' + Object.keys(realName).length);
for (const [k, v] of Object.entries(realName)) if (!v) console.log('   MISSING:', k);
