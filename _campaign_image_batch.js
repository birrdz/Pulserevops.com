'use strict';

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { ddgImages } = require('./netlify/functions/lib/img-search-lib');
const { UA } = require('./netlify/functions/lib/img-cover-lib');

const draftDir = process.argv[2];
const assetDir = process.argv[3];
if (!draftDir || !assetDir) {
  console.error('usage: node _campaign_image_batch.js <draft-dir> <asset-dir>');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(path.join(draftDir, 'manifest.json'), 'utf8'));
fs.mkdirSync(assetDir, { recursive: true });
const poolFile = path.join(draftDir, 'image-pool.json');
const imagePool = fs.existsSync(poolFile) ? JSON.parse(fs.readFileSync(poolFile, 'utf8')) : [];
const slotMapFile = path.join(draftDir, 'slot-image-map.json');
const slotImageMap = fs.existsSync(slotMapFile) ? JSON.parse(fs.readFileSync(slotMapFile, 'utf8')) : {};
let poolCursor = 0;

const usedUrls = new Set();
const usedSourceKeys = new Set();
const usedHashes = [];
const banned = /(?:logo|icon|badge|banner|sprite|favicon|watermark|chart|graph|diagram|infographic|journal|magazine|newspaper|post-dispatch|book-cover|publication-cover|screen[-_ ]?shot|sample-cover|service[-_ ]?map|csoft|northrimacg|asset-3|volleyball|football|soccer|basketball|softball|granbird|slidegeeks|slideteam|slideshare|stockcake|shutterstock|dreamstime|alamy|istock|123rf|depositphotos|getty|adobe-stock|freepik|ftcdn|vecteezy|vectorstock|pngtree|stock-photo|stockphoto|bigstock|canstock)/i;
const preferredHost = /(?:images\.unsplash\.com|images\.pexels\.com|upload\.wikimedia\.org|chief\.com|hbr\.org|forbes\.com|fortune\.com|fastcompany\.com|reuters\.com|apnews\.com)/i;
let lastWikimediaAt = 0;
let wikimediaFallbackCursor = 0;
const wikimediaFallbacks = [
  'engineering team meeting', 'communications technician', 'airport operations team',
  'public safety communications', 'radio tower technician', 'control room operators',
  'project manager team', 'field service engineer', 'aircraft maintenance crew',
  'network operations center', 'emergency dispatch center', 'microwave antenna technician',
  'two way radio technician', 'cybersecurity operations center', 'Annapolis Maryland',
  'aviation communications', 'electrical engineering team', 'federal building team',
  'utility maintenance crew', 'telecommunications equipment technician',
];

function sourceKey(url) {
  const s = String(url || '');
  const m = s.match(/\/wp-content\/uploads\/([^?&#]+)/i);
  return m ? m[1].toLowerCase() : s.replace(/[?#].*$/, '').toLowerCase();
}

async function wikimediaCandidates(subject) {
  const wait = 1800 - (Date.now() - lastWikimediaAt);
  if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
  lastWikimediaAt = Date.now();
  const query = String(subject || '').replace(/\b(?:professional|candid|editorial|photograph|photo)\b/gi, ' ').replace(/\s+/g, ' ').trim();
  const url = 'https://commons.wikimedia.org/w/api.php?action=query&generator=search'
    + '&gsrsearch=' + encodeURIComponent(query + ' filetype:bitmap')
    + '&gsrnamespace=6&gsrlimit=20&prop=imageinfo&iiprop=url|size&iiurlwidth=1600&format=json&origin=*';
  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': 'PulseRevOpsImageAudit/1.0 (pulserevops.com)' },
      signal: AbortSignal.timeout(20000),
    });
    if (!r.ok) return [];
    const j = await r.json();
    return Object.values((j && j.query && j.query.pages) || {})
      .map((p) => ({ image: p.imageinfo && p.imageinfo[0] && p.imageinfo[0].thumburl, url: p.title }))
      .filter((x) => x.image && !banned.test(x.url));
  } catch (_) {
    return [];
  }
}

function hamming(a, b) {
  let n = BigInt('0x' + a) ^ BigInt('0x' + b);
  let c = 0;
  while (n) {
    c += Number(n & 1n);
    n >>= 1n;
  }
  return c;
}

async function dHash(buf) {
  const raw = await sharp(buf).rotate().resize(9, 8, { fit: 'fill' }).grayscale().raw().toBuffer();
  let bits = 0n;
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      bits = (bits << 1n) | BigInt(raw[y * 9 + x] > raw[y * 9 + x + 1] ? 1 : 0);
    }
  }
  return bits.toString(16).padStart(16, '0');
}

async function seedExistingHashes() {
  const dirs = String(process.env.IMAGE_COMPARE_DIRS || '').split(',').map((x) => x.trim()).filter(Boolean);
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir).filter((x) => /-[123]\.jpe?g$/i.test(x))) {
      try {
        usedHashes.push(await dHash(fs.readFileSync(path.join(dir, file))));
      } catch (_) {}
    }
  }
  const reports = String(process.env.IMAGE_SOURCE_REPORTS || '').split(',').map((x) => x.trim()).filter(Boolean);
  for (const report of reports) {
    if (!fs.existsSync(report)) continue;
    const sources = JSON.parse(fs.readFileSync(report, 'utf8')).flatMap((x) => x.sources || []);
    for (const url of sources) {
      const key = sourceKey(url);
      if (usedUrls.has(url) || usedSourceKeys.has(key)) continue;
      try {
        const r = await fetch(url, {
          headers: { 'User-Agent': UA },
          redirect: 'follow',
          signal: AbortSignal.timeout(15000),
        });
        if (!r.ok) continue;
        const buf = Buffer.from(await r.arrayBuffer());
        usedUrls.add(url);
        usedSourceKeys.add(key);
        usedHashes.push(await dHash(buf));
      } catch (_) {}
    }
  }
}

function overlays(width, height) {
  const vignette = Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">` +
    `<defs><radialGradient id="v"><stop offset="55%" stop-color="#000" stop-opacity="0"/>` +
    `<stop offset="100%" stop-color="#000" stop-opacity=".22"/></radialGradient>` +
    `<filter id="n"><feTurbulence baseFrequency=".8" numOctaves="2" seed="17" type="fractalNoise"/>` +
    `<feColorMatrix type="saturate" values="0"/></filter></defs>` +
    `<rect width="100%" height="100%" fill="#6b4a1e" fill-opacity=".08"/>` +
    `<rect width="100%" height="100%" fill="url(#v)"/>` +
    `<rect width="100%" height="100%" filter="url(#n)" opacity=".055"/>` +
    `</svg>`
  );
  return [{ input: vignette, blend: 'over' }];
}

async function graded(buf, width, height) {
  return sharp(buf)
    .rotate()
    .resize(width, height, { fit: 'cover', position: 'attention' })
    .modulate({ saturation: 0.72, brightness: 0.97 })
    .linear(0.9, 10)
    .composite(overlays(width, height))
    .withMetadata({ exif: { IFD0: { ImageDescription: 'PULSE_GRADE=v_final' } } })
    .jpeg({ quality: 84, progressive: true })
    .toBuffer();
}

async function downloadCandidate(url, pageUrl) {
  const key = sourceKey(url);
  if (!url || usedUrls.has(url) || usedSourceKeys.has(key) || banned.test(url) || banned.test(pageUrl || '')) return null;
  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': UA, Accept: 'image/avif,image/webp,image/jpeg,image/png,*/*' },
      redirect: 'follow',
      signal: AbortSignal.timeout(15000),
    });
    if (!r.ok) return null;
    const type = String(r.headers.get('content-type') || '').toLowerCase();
    if (!type.startsWith('image/') || type.includes('svg') || type.includes('gif')) return null;
    const buf = Buffer.from(await r.arrayBuffer());
    if (buf.length < 30000) return null;
    const meta = await sharp(buf).metadata();
    if (!meta.width || !meta.height || meta.width < 700 || meta.height < 450) return null;
    const ratio = meta.width / meta.height;
    if (ratio < 0.5 || ratio > 2.5) return null;
    const hash = await dHash(buf);
    if (usedHashes.some((h) => hamming(hash, h) <= 8)) return null;
    usedUrls.add(url);
    usedSourceKeys.add(key);
    usedHashes.push(hash);
    return { buf, hash, width: meta.width, height: meta.height };
  } catch (_) {
    return null;
  }
}

async function imagesFor(entry, body) {
  const imageSlots = [...body.matchAll(/^\[\[IMAGE_SLOT_(\d+):\s*(.+?)\]\]$/gm)]
    .map((m) => ({ n: Number(m[1]), full: m[0], subject: m[2].trim(), kind: 'image' }));
  const productSlots = [...body.matchAll(/^\[\[PRODUCT_SLOT_(\d+):\s*([^|\]]+?)\s*\|\s*([^|\]]+?)\s*\|\s*(https?:\/\/[^\]\s]+)\]\]$/gm)]
    .map((m) => ({
      n: Number(m[1]),
      full: m[0],
      name: m[2].trim(),
      subject: m[3].trim(),
      site: m[4].trim(),
      kind: 'product',
    }));
  const slots = [...imageSlots, ...productSlots]
    .sort((a, b) => a.n - b.n);
  if (slots.length !== 3 && slots.length !== 10) {
    throw new Error(`${entry.id}: expected 3 image or 10 product slots, found ${slots.length}`);
  }

  const picks = [];
  for (let i = 0; i < slots.length; i++) {
    const specific = slotImageMap[entry.id] && slotImageMap[entry.id][i];
    if (specific) {
      const found = await downloadCandidate(specific, specific);
      if (!found) throw new Error(`${entry.id}: rejected mapped image for slot ${i + 1}`);
      found.source = specific;
      picks.push(found);
      continue;
    }
    if (imagePool.length) {
      let found = null;
      while (poolCursor < imagePool.length && !found) {
        const url = imagePool[poolCursor++];
        found = await downloadCandidate(url, url);
        if (found) found.source = url;
      }
      if (found) {
        picks.push(found);
        continue;
      }
    }
    let candidates = await wikimediaCandidates(slots[i].subject);
    let found = null;
    for (const c of candidates) {
      found = await downloadCandidate(c && c.image, c && c.url);
      if (found) {
        found.source = c.image;
        break;
      }
    }
    if (found) {
      picks.push(found);
      continue;
    }
    for (let attempt = 0; attempt < 3 && !found; attempt++) {
      const fallbackQuery = wikimediaFallbacks[wikimediaFallbackCursor++ % wikimediaFallbacks.length];
      candidates = await wikimediaCandidates(fallbackQuery);
      for (const c of candidates) {
        found = await downloadCandidate(c && c.image, c && c.url);
        if (found) {
          found.source = c.image;
          break;
        }
      }
    }
    if (found) {
      picks.push(found);
      continue;
    }
    candidates = await ddgImages(
      slots[i].subject + ' professional candid editorial photograph -stock -vector -illustration -logo'
    );
    candidates = candidates.sort((a, b) =>
      Number(preferredHost.test((b && b.image) || '')) - Number(preferredHost.test((a && a.image) || ''))
    );
    found = null;
    for (const c of candidates) {
      found = await downloadCandidate(c && c.image, c && c.url);
      if (found) {
        found.source = c.image;
        break;
      }
    }
    if (!found) throw new Error(`${entry.id}: no valid image for slot ${i + 1}`);
    picks.push(found);
  }

  let ready = body;
  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    const file = `${entry.id}-${slot.n}.jpg`;
    fs.writeFileSync(path.join(assetDir, file), await graded(picks[i].buf, 1200, 675));
    const replacement = slot.kind === 'product'
      ? `@@PRODUCT name="${slot.name.replace(/"/g, '')}" img="/assets/qa/${file}" site="${slot.site}"`
      : `![${slot.subject}](/assets/qa/${file})`;
    ready = ready.replace(slot.full, replacement);
  }

  const cover = await graded(picks[0].buf, 760, 760);
  fs.writeFileSync(path.join(assetDir, `${entry.id}.jpg`), cover);
  fs.writeFileSync(path.join(assetDir, `${entry.id}.sq.jpg`), cover);
  fs.writeFileSync(path.join(draftDir, `${entry.id}.ready.md`), ready);
  return { sources: picks.map((p) => p.source), files: slots.length + 2 };
}

(async () => {
  await seedExistingHashes();
  const report = [];
  for (const entry of manifest) {
    const body = fs.readFileSync(path.join(draftDir, entry.file), 'utf8');
    const result = await imagesFor(entry, body);
    report.push({ id: entry.id, ...result });
    console.log(JSON.stringify(report[report.length - 1]));
  }
  fs.writeFileSync(path.join(draftDir, 'image-report.json'), JSON.stringify(report, null, 2));
})().catch((err) => {
  console.error(err.stack || err.message);
  process.exit(1);
});
