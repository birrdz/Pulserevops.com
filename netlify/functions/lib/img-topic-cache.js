// Topic-level image reuse — one cover per topic across many entries (massive cost savings).
// Manifest format matches _img_gen_fill.js: topicKey -> slug or external URL.
const fs = require('fs');
const path = require('path');

const IMG_DIR = path.join(__dirname, '../../../img/auto');
const PUB_BASE = 'https://pulserevops.com/img/auto/';
const MANIFEST_PATH = path.join(__dirname, '../../../_img_gen_manifest.json');

const STOP = new Set(
  'the a an of for to in on and or how do you what is are best top 2027 2026 with your my we i it that this when why which who whom should can will be as at by from into about'.split(
    /\s+/
  )
);

let manifest = null;
let dirty = 0;

function prefixOf(id) {
  return (String(id).match(/^([a-z]+)\d+$/i) || [])[1] || '';
}

function hash(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
  return h;
}

function topicKeyFromEntry(title, id, tags) {
  const pre = prefixOf(id) || 'entry';
  const tagList = Array.isArray(tags) ? tags : [];
  const tag = tagList.map((t) => String(t).toLowerCase()).find((t) => t.length > 3);
  const words = String(title || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w))
    .slice(0, 5);
  const phrase = ((tag ? tag.replace(/-/g, ' ') + ' ' : '') + words.join(' ')).trim();
  return `${pre}:${phrase || String(id)}`;
}

function loadManifest() {
  if (manifest) return manifest;
  manifest = {};
  try {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  } catch (e) {
    manifest = {};
  }
  return manifest;
}

function saveManifest() {
  if (!dirty) return;
  try {
    fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 0));
    dirty = 0;
  } catch (e) {}
}

function resolveManifestValue(val) {
  if (!val) return null;
  const s = String(val);
  if (s.startsWith('http://') || s.startsWith('https://')) return { url: s, hosted: false };
  const file = path.join(IMG_DIR, s + '.jpg');
  try {
    if (fs.existsSync(file) && fs.statSync(file).size > 3000) {
      return { url: PUB_BASE + s + '.jpg', hosted: true, slug: s };
    }
  } catch (e) {}
  return null;
}

function getTopicCachedImage(key) {
  const m = loadManifest();
  const hit = resolveManifestValue(m[key]);
  if (hit) return { ...hit, via: 'topic-cache' };
  return null;
}

function setTopicCachedImage(key, urlOrSlug) {
  if (!key || !urlOrSlug) return;
  const m = loadManifest();
  let val = String(urlOrSlug);
  if (val.startsWith(PUB_BASE)) val = val.slice(PUB_BASE.length).replace(/\.jpg$/, '');
  m[key] = val;
  dirty++;
  if (dirty >= 5) saveManifest();
}

function slugForTopicKey(key) {
  const base = key
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 48);
  return base + '-' + hash(key).toString(36);
}

module.exports = {
  topicKeyFromEntry,
  getTopicCachedImage,
  setTopicCachedImage,
  slugForTopicKey,
  saveManifest,
  MANIFEST_PATH,
  PUB_BASE,
  IMG_DIR,
};
