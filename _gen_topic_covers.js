// _gen_topic_covers — one topical cover per topic (owner 2026-07-03 template: see "Hire a CRO" example =
// a real relevant PHOTO with a consistent warm VINTAGE grade; the title is added as GOLD ITALIC CSS text
// on top, NOT baked, so it auto-fits and never crops/doubles). Image source = POLLINATIONS flux (owner:
// "pollinator is better, use pollinator"). sharp grade: desaturate + warm sepia wash + grain + vignette.
// Square 760×760 → /assets/topics/<slug>.jpg. Gradient fallback. Stop: _gen_topic_covers_stop.flag
const fs = require('fs'), sharp = require('sharp');
const WD = 'C:/Users/koryj/website', DIR = WD + '/assets/topics';
if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });
let window = {}; eval(fs.readFileSync(WD + '/home-v2-data.js', 'utf8')); const T = window.PULSE_TAX || [];
let searchRealPhoto = null; try { ({ searchRealPhoto } = require('./netlify/functions/lib/img-search-lib')); } catch (e) {}
const slug = href => String(href).replace(/^\//, '').replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'x';
const PAL = [['#C99700', '#4a3200'], ['#B5531F', '#3a1808'], ['#6B8E23', '#26330a'], ['#2C7A7B', '#0c2e2e'], ['#A0522D', '#2a1409'], ['#8B5A2B', '#2a1a0a'], ['#5F7A3A', '#1e280f'], ['#C46210', '#3a1c04'], ['#3E6B57', '#122019'], ['#8A3324', '#2a0f0a']];
const jobs = [
  { slug: '_topics', q: 'a colorful stack of vintage magazines on many topics' },
  { slug: '_home', q: 'a vintage newsroom with a printing press' },
  { slug: '_search', q: 'a vintage magnifying glass on an old desk' },
  { slug: '_hire', q: 'a confident fractional chief revenue officer executive in a modern glass boardroom' },
];
const seen = {}; let ci = 0;
T.forEach(c => (c.subs || []).forEach(s => (s.items || []).forEach(it => {
  if (it && it[1] && !seen[it[1]] && !/knowledge|library/i.test(it[0] || '')) { seen[it[1]] = 1; jobs.push({ slug: slug(it[1]), q: it[0], col: PAL[ci++ % PAL.length] }); }
})));
const flux = (q, seed) => 'https://image.pollinations.ai/prompt/' + encodeURIComponent(('a realistic candid documentary color photograph of ' + q + ', natural light, cinematic, detailed, no text, no words, no letters, no signs, no poster, no flyer, no watermark').slice(0, 340)) + '?width=760&height=760&nologo=true&enhance=true&model=flux&seed=' + seed;
async function grab(u) { try { const r = await fetch(u, { signal: AbortSignal.timeout(80000) }); if (!(r.ok && (r.headers.get('content-type') || '').startsWith('image'))) return null; const b = Buffer.from(await r.arrayBuffer()); return b.length > 3000 ? b : null; } catch (e) { return null; } }
const sleep = ms => new Promise(r => setTimeout(r, ms));
function gradBuf(S, col) { return sharp(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="' + S + '" height="' + S + '"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + (col ? col[0] : '#8B5A2B') + '"/><stop offset="1" stop-color="' + (col ? col[1] : '#241405') + '"/></linearGradient></defs><rect width="' + S + '" height="' + S + '" fill="url(#g)"/></svg>')).toBuffer(); }
// consistent VINTAGE overlay (warm sepia wash + vignette + film grain) — NO text (title is CSS gold italic)
function overlaySVG(S) {
  return Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="' + S + '" height="' + S + '">' +
    '<defs><radialGradient id="v" cx="0.5" cy="0.45" r="0.95"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.26"/></radialGradient>' +
    '<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.12"/></feComponentTransfer></filter></defs>' +
    '<rect width="' + S + '" height="' + S + '" fill="#6b4a1e" opacity="0.08"/>' +   // whisper of warmth — keeps the photo in full color
    '<rect width="' + S + '" height="' + S + '" fill="url(#v)"/>' +                    // subtle vignette
    '<rect width="' + S + '" height="' + S + '" filter="url(#grain)" opacity="0.42"/></svg>'); // film grain = the aged look
}
(async () => {
  console.log('[topic-covers] ' + jobs.length + ' covers (Pollinations photo + vintage grade, gold CSS title)');
  let made = 0, ph = 0, qi = 0; const S = 760;
  async function worker() {
    while (qi < jobs.length) {
      if (fs.existsSync(WD + '/_gen_topic_covers_stop.flag')) return;
      const j = jobs[qi++], out = DIR + '/' + j.slug + '.jpg';
      if (fs.existsSync(out)) continue;   // keep the covers that already got a real photo
      let seed = 0; for (const ch of j.slug) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
      // POLLINATIONS ONLY (owner 2026-07-03: "use pollinator, don't care how long") — clean, no text/flyers.
      let img = null; for (let t = 0; t < 10 && !img; t++) { img = await grab(flux(j.q, seed % 99999 + t)); if (!img) await sleep(7000); }
      await sleep(2500);   // gentle spacing so we don't re-trip the throttle
      try {
        let base;
        if (img) { base = await sharp(img).resize(S, S, { fit: 'cover', position: 'centre' }).modulate({ saturation: 1.07, brightness: 1.16 }).toBuffer(); ph++; }
        else base = await gradBuf(S, j.col);
        await sharp(base).composite([{ input: overlaySVG(S), top: 0, left: 0 }]).jpeg({ quality: 86, mozjpeg: true }).toFile(out);
        made++; console.log('  ' + made + '/' + jobs.length + ' ' + j.slug + (img ? '' : ' (gradient)'));
      } catch (e) { console.log('  fail ' + j.slug + ' ' + e.message); }
    }
  }
  await Promise.all([worker(), worker()]);   // gentle: 2 at a time
  console.log('[topic-covers] DONE · ' + made + ' covers, ' + ph + ' with Pollinations photos');
})().catch(e => { console.log('[topic-covers] FATAL', e && e.message); process.exit(1); });
