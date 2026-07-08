// _gen_cro_covers — generate a big library of PROFESSIONAL CRO/business cover photos (owner 4444).
// Flux, verified to render, saved contiguously as cro-cover-6, 7, 8… Writes _cro_cover_count.json with
// the total so the modulo can be updated. Rate-limit tolerant (retries). Stop: _gen_cro_covers_stop.flag.
const fs = require('fs'), sharp = require('sharp');
const WD = 'C:/Users/koryj/website', DIR = WD + '/assets';
const PROMPTS = [
  'confident fractional chief revenue officer executive in a modern glass boardroom, cinematic premium photograph',
  'sales revenue growth line chart climbing on a large screen in a corporate office, warm gold light',
  'diverse revenue operations team collaborating around a laptop in a bright modern office',
  'executive presenting a go-to-market strategy on a glass whiteboard, professional',
  'business handshake closing a major deal in a high-rise office, premium corporate',
  'clean modern SaaS revenue analytics dashboard on a monitor, professional workspace',
  'confident businesswoman CRO leader standing in a glass office overlooking a city skyline',
  'sales team celebrating hitting quota in a modern office, energetic and professional',
  'a revenue funnel diagram on a screen during a corporate strategy meeting',
  'executive reviewing pipeline forecasts on a tablet in a sleek office, premium',
  'two executives shaking hands over a signed contract, warm cinematic light',
  'a packed leadership meeting in a modern conference room, city view windows',
  'a CRO coaching a sales rep at a standing desk, bright professional office',
  'financial growth arrows and bar charts, abstract premium business visualization gold',
  'a confident male executive in a tailored suit in a corner office, cinematic',
  'a whiteboard covered in revenue architecture and GTM diagrams, professional',
  'a modern startup office with a big monitor showing MRR growth, warm light',
  'business people analyzing KPIs on a wall of screens, professional data center vibe',
  'a boardroom presentation with a revenue slide on the projector, premium corporate',
  'an executive on a video call closing a deal from a modern home office, professional',
  'a sales leader pointing to a target on a screen, motivational corporate photograph',
  'handshake between a founder and a fractional executive, bright office premium',
  'a strategy session with sticky notes on glass, diverse professional team',
  'stacks of upward trending financial charts on a desk with a coffee, warm premium',
  'a confident revenue leader addressing a team, modern auditorium, cinematic'
];
const url = (p, seed) => 'https://image.pollinations.ai/prompt/' + encodeURIComponent((p + ', high resolution sharp professional editorial photography, cinematic depth of field, magazine cover quality, no text, no watermark, no words').slice(0, 340)) + '?width=1600&height=900&nologo=true&enhance=true&model=flux&seed=' + seed;
async function grab(u) { try { const r = await fetch(u, { signal: AbortSignal.timeout(70000) }); if (!(r.ok && (r.headers.get('content-type') || '').startsWith('image'))) return null; return Buffer.from(await r.arrayBuffer()); } catch (e) { return null; } }
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  let n = 6, made = 0;
  for (let i = 0; i < PROMPTS.length; i++) {
    if (fs.existsSync(WD + '/_gen_cro_covers_stop.flag')) break;
    let buf = null;
    for (let t = 0; t < 3 && !buf; t++) { buf = await grab(url(PROMPTS[i], 1000 + i * 7 + t)); if (!buf) await sleep(4000); }
    if (!buf) { console.log('skip #' + i + ' (flux/rate-limit)'); continue; }
    try { await sharp(buf).resize(1600, 900, { fit: 'cover', position: 'centre' }).jpeg({ quality: 92, mozjpeg: true }).toFile(DIR + '/cro-cover-' + n + '.jpg'); made++; console.log('saved cro-cover-' + n + '.jpg'); n++; } catch (e) { console.log('sharp fail #' + i); }
    fs.writeFileSync(WD + '/_cro_cover_count.json', JSON.stringify({ total: n - 1, made, at: new Date().toISOString() }));
    await sleep(1500);
  }
  console.log('[cro-covers] DONE · total covers = ' + (n - 1) + ' (' + made + ' new)');
})().catch(e => { console.log('[cro-covers] FATAL', e && e.message); process.exit(1); });
