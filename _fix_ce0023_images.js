// Force topic-relevant Pollinator flux images for ce0023 (Taylor Swift / Travis Kelce wedding gold entry).
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const ID = 'ce0023';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const {
  makeFaceCardAndSyncHero,
  makeSectionForce,
  forceMainTopHero,
} = require('./_img_flux_rewrite_lib');
const {
  ddgImageSectionTargets,
  sectionCaption,
  sectionFileSlot,
  findSectionImageLine,
} = require('./_img_media_law_lib');
const {
  saveCeEntry,
  normalizeCeSectionOrder,
  normalizeCeBodyOrder,
  ensureDirectAnswerAfterHero,
  enforceCroCardLaw,
} = require('./_ce_current_events_fix_lib');

const TITLE = "What details were revealed about Taylor Swift and Travis Kelce's wedding in 2027?";

const COVER_PROMPT = [
  'Taylor Swift and Travis Kelce celebrity wedding ceremony 2027',
  'romantic bride and groom at elegant private estate wedding Rhode Island',
  'star-studded Hollywood NFL wedding golden hour editorial photograph',
  'real candid wedding photo, full subjects in frame with headroom',
  'not generic stock wedding clipart, no text overlay, no watermark',
].join(', ');

function sectionPrompt(heading) {
  const h = String(heading || '').replace(/^##\s+/, '').replace(/[\[\]"]/g, '').trim();
  return [
    'Taylor Swift Travis Kelce wedding 2027',
    h,
    'editorial documentary wedding photograph for this exact topic',
    'real candid celebrity wedding, elegant and specific',
    'no text overlay, no watermark',
  ].join(', ');
}

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const existing = await store.get('answers/' + ID + '.json', { type: 'json' });
  let body = existing.answer || '';

  console.log('1/2 Face-card + hero flux for', ID);
  const cover = await makeFaceCardAndSyncHero(ID, TITLE, body, COVER_PROMPT, { noCooldown: true });
  if (!cover.ok) throw new Error('Cover flux failed');
  body = cover.body;

  console.log('2/2 Section flux images');
  let lines = body.split('\n');
  const targets = ddgImageSectionTargets(lines, body);
  for (let ti = 0; ti < targets.length; ti++) {
    const idxLine = targets[ti];
    const sect = lines[idxLine];
    const found = findSectionImageLine(lines, idxLine);
    const slot = sectionFileSlot(ID, ti, found.url);
    console.log('  section', ti + 1, '/', targets.length, '·', sect.replace(/^##\s+/, '').slice(0, 50));
    const local = await makeSectionForce(ID, slot, sect + ' ' + TITLE, sectionPrompt(sect), { noCooldown: true });
    if (!local) { console.log('    skip (flux failed)'); continue; }
    const tag = '![' + sectionCaption(TITLE, sect) + '](' + local + ')';
    if (found.line >= 0) lines[found.line] = tag;
    else lines.splice(idxLine + 1, 0, '', tag, '');
  }
  body = lines.join('\n');
  body = normalizeCeSectionOrder(normalizeCeBodyOrder(ensureDirectAnswerAfterHero(enforceCroCardLaw(body)), TITLE, ID));
  body = forceMainTopHero(ID, TITLE, body);

  const saved = await saveCeEntry(store, idx, ID, TITLE, body, existing, {});
  await store.setJSON('_index.json', idx);
  console.log('Done · grade=' + saved.grade + '/13 · imgs=' + saved.imgs + ' · hero=' + saved.img);
})().catch(e => { console.error(e); process.exit(1); });
