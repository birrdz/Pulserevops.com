#!/usr/bin/env node
// Owner directive 2026-06-02: change "fractional CRO" copy describing Kory's
// role to "Senior B2B/B2C Revenue Leader" on public marketing surfaces.
// fractional-cro.html is INTENTIONALLY skipped — that's a dedicated CRO
// Syndicate SEO landing page where "fractional CRO" is the ranking target.
//
// Run from website root: node lab/rename-role-copy.js

const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

// (oldSubstring, newSubstring) — order matters, longer specific phrases first
// so they don't get eaten by shorter generic ones.
const REPLACEMENTS = [
  // Footer pillar-page CTA
  ['Open to fractional CRO conversations', 'Open to Senior B2B/B2C Revenue Leader roles'],
  ['Open to fractional CRO roles',          'Open to Senior B2B/B2C Revenue Leader roles'],
  // Hero/copy lines
  ['Built by Kory White, fractional CRO and former Regional President.', 'Built by Kory White, Senior B2B/B2C Revenue Leader and former Regional President.'],
  ['Built by Kory White, fractional CRO.', 'Built by Kory White, Senior B2B/B2C Revenue Leader.'],
  ['Built by a fractional CRO',            'Built by a Senior B2B/B2C Revenue Leader'],
  ['Kory White, fractional CRO',           'Kory White, Senior B2B/B2C Revenue Leader'],
  ['Kory White is a fractional CRO',       'Kory White is a Senior B2B/B2C Revenue Leader'],
  ['fractional CRO with',                  'Senior B2B/B2C Revenue Leader with'],
];

// Files to touch — only public marketing copy. JSON data, SVGs, lab scripts,
// and the fractional-cro.html SEO page are intentionally skipped.
const FILES = [
  'index.html',
  'sponsor.html',
  'pulse-funnel-overlay.js',
  'resume.html',
  'kory-white-maryland.html',
  'plan-90.html',
  'dashboard.html',
  // 9 pillar pages
  'knowledge.html',
  'sales-trainings.html',
  'industry-kpis.html',
  'tech-stacks.html',
  'graphics.html',
  'sales-book-summaries.html',
  'electronic-reviews.html',
  'revenue-architecture.html',
  'go-to-market-playbooks.html',
  // Pillar-page generator (so future regens stay correct)
  'lab/gen-pillar-pages.js',
];

const SKIP = new Set(['fractional-cro.html']);

let touched = 0, totalReplacements = 0;
for (const rel of FILES) {
  if (SKIP.has(rel)) { console.log('SKIP', rel); continue; }
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) { console.log('MISS', rel); continue; }
  let src = fs.readFileSync(abs, 'utf8');
  let n = 0;
  for (const [a, b] of REPLACEMENTS) {
    if (src.includes(a)) {
      const before = src;
      src = src.split(a).join(b);
      const occurrences = before.split(a).length - 1;
      n += occurrences;
    }
  }
  if (n > 0) {
    fs.writeFileSync(abs, src, 'utf8');
    console.log('UPDATED', rel, '(' + n + ' replacements)');
    touched++;
    totalReplacements += n;
  } else {
    console.log('  no-op', rel);
  }
}
console.log('---');
console.log('done — touched', touched, 'files,', totalReplacements, 'replacements total');
