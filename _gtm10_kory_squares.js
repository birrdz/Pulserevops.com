// Build 10 GTM browse squares from CRO-card Kory White portrait.
'use strict';
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const WD = __dirname;
const SRC = path.join(WD, 'assets', 'kory-white.jpg');
const QA = path.join(WD, 'assets', 'qa');
const SIZE = 760;

const CARDS = [
  { id: 'gp515', t: 'Getting Started with GTM 2027', accent: '#EAC15C' },
  { id: 'gp514', t: 'Is GTM Playbooks Worth It 2027', accent: '#F6C445' },
  { id: 'gp0511', t: 'Inbound Demand-Capture GTM 2027', accent: '#E8B84A' },
  { id: 'gp0510', t: 'Sales-Assisted PLG for 2027', accent: '#D4A84A' },
  { id: 'gp0509', t: 'Reseller and VAR Channel GTM', accent: '#CF9F2E' },
  { id: 'gp0508', t: 'International Geo-Expansion GTM', accent: '#EAC15C' },
  { id: 'gp0507', t: 'Vertical SaaS GTM for Healthcare', accent: '#F0C860' },
  { id: 'gp0506', t: 'Usage-Based Pricing GTM Motion', accent: '#EAC15C' },
  { id: 'gp0505', t: 'ABM GTM Playbook for Enterprise', accent: '#DDB24A' },
  { id: 'gp0504', t: 'Event-Led Field-Marketing GTM', accent: '#F6C445' }
];

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function makeCard(card, koryCirclePng) {
  const accent = card.accent;
  // Match CRO card: dark gradient plane + gold ring + circular portrait (no baked title).
  const svg = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#180a10"/>
      <stop offset="55%" stop-color="#0f0a0c"/>
      <stop offset="100%" stop-color="#1a1014"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="42%" r="48%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.22"/>
      <stop offset="70%" stop-color="${accent}" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#bg)"/>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#glow)"/>
  <!-- outer gold frame like cro-card inset -->
  <rect x="18" y="18" width="${SIZE - 36}" height="${SIZE - 36}" fill="none" stroke="${accent}" stroke-width="6" opacity="0.85"/>
  <rect x="28" y="28" width="${SIZE - 56}" height="${SIZE - 56}" fill="none" stroke="${accent}" stroke-width="2" opacity="0.35"/>
  <!-- portrait ring (CRO card circle) -->
  <circle cx="380" cy="340" r="248" fill="none" stroke="${accent}" stroke-width="5" opacity="0.55"/>
  <circle cx="380" cy="340" r="236" fill="none" stroke="${accent}" stroke-width="2" opacity="0.9"/>
  <!-- small CRO eyebrow mark — not a title -->
  <text x="380" y="650" text-anchor="middle" font-family="system-ui,Arial,sans-serif" font-size="18" font-weight="800" letter-spacing="4" fill="${accent}" opacity="0.7">KORY WHITE · CRO</text>
</svg>`);

  const dest = path.join(QA, card.id + '.sq.jpg');
  await sharp(svg)
    .composite([
      {
        input: koryCirclePng,
        top: 340 - 220,
        left: 380 - 220
      }
    ])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(dest);
  return dest;
}

(async () => {
  if (!fs.existsSync(SRC)) throw new Error('missing ' + SRC);

  // Circular crop of Kory, brightness bumped like cro-card__img filter
  const diam = 440;
  const circleMask = Buffer.from(`<svg width="${diam}" height="${diam}"><circle cx="${diam / 2}" cy="${diam / 2}" r="${diam / 2}" fill="#fff"/></svg>`);
  const koryCirclePng = await sharp(SRC)
    .rotate()
    .resize(diam, diam, { fit: 'cover', position: 'centre' })
    .modulate({ brightness: 1.08 })
    .composite([{ input: circleMask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const out = [];
  for (const card of CARDS) {
    const dest = await makeCard(card, koryCirclePng);
    const bytes = fs.statSync(dest).size;
    console.log('OK', card.id, bytes, card.t);
    out.push({ id: card.id, t: card.t, bytes, src: 'kory-white.jpg' });
  }
  fs.writeFileSync(path.join(WD, '_preview_gtm10_kory.json'), JSON.stringify(out, null, 2));
  console.log('done');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
