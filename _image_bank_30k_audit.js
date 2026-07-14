'use strict';
/**
 * Quick pillar image-bank audit for ~30k future Q&As.
 * Outputs current sizes, existing banks, and recommended future bank by category.
 */
const fs = require('fs');
const path = require('path');
const WD = __dirname;

for (const l of fs.readFileSync(path.join(WD, '.env.local'), 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
});

const PNAMES = {
  tl: 'Pulse Tools', ca: 'Cars', bt: 'Boats', aq: 'Aquariums', ik: 'Industry KPIs', tk: 'Tech Stacks',
  bs: 'Book Summaries', st: 'Sales Trainings', fr: 'Franchises', co: 'Collectibles', ai: 'AI Infra',
  gb: 'Graphics', bo: 'Buildouts', sy: 'Style', gp: 'GTM Playbooks', ra: 'Rev Architecture', pt: 'Pets',
  es: 'Espresso', tv: 'TVs', rs: 'Resorts', cl: 'Cologne', lv: 'Lux Vacations', ev: 'Events',
  ga: 'Gatherings', gm: 'Gaming', mv: 'Movies', wl: 'Wellness', dn: 'Dining', nl: 'Nightlife',
  tn: 'Towns', sc: 'Schools', tc: 'Telco', er: 'Electronics', q: 'Q&A / Knowledge', hf: 'Home & Family',
  sw: 'Software', sk: 'Skill Drills', sp: 'Sports', dr: 'Drills', ce: 'Current Events', ed: 'Advice',
  cg: 'Coaching',
};

// Visual / photo category for Pexels bank sourcing
const CATEGORY = {
  tl: 'revops-tools-saas-dashboards',
  q: 'revops-b2b-office-meetings',
  ik: 'industry-verticals-jobs-kpi',
  ra: 'revenue-ops-architecture-meetings',
  gp: 'gtm-sales-marketing-warroom',
  st: 'sales-training-workshops',
  bs: 'books-reading-library',
  tk: 'tech-stacks-servers-code',
  ai: 'ai-data-centers-ml',
  sw: 'software-laptops-product',
  ca: 'cars-auto',
  bt: 'boats-marine',
  aq: 'aquariums-fish-tanks',
  fr: 'franchises-retail-storefronts',
  co: 'collectibles-auctions',
  gb: 'graphics-design-creative',
  bo: 'buildouts-construction',
  sy: 'style-fashion',
  pt: 'pets-animals',
  es: 'espresso-coffee',
  tv: 'tvs-living-room-tech',
  rs: 'resorts-hotels',
  cl: 'cologne-fragrance',
  lv: 'luxury-travel',
  ev: 'events-conferences',
  ga: 'gatherings-venues-weddings',
  gm: 'gaming-esports',
  mv: 'movies-cinema',
  wl: 'wellness-fitness-meditation',
  dn: 'dining-restaurants',
  nl: 'nightlife-bars',
  tn: 'towns-main-street',
  sc: 'schools-campus',
  tc: 'telco-network-towers',
  er: 'electronics-gadgets',
  hf: 'home-family',
  sk: 'skills-training-drills',
  sp: 'sports',
  dr: 'drills-practice',
  ce: 'news-current-events',
  ed: 'advice-mentoring',
  cg: 'coaching-leadership',
};

function bankCount(pfx) {
  const files = [
    `_${pfx}_topic_review_state.json`,
    `_${pfx}_face_review_state.json`,
    `_${pfx}_old_new_approve_state.json`,
  ];
  for (const f of files) {
    const p = path.join(WD, f);
    if (!fs.existsSync(p)) continue;
    try {
      const s = JSON.parse(fs.readFileSync(p, 'utf8'));
      const approved = Object.keys(s.approved || {}).length;
      const bank = Array.isArray(s.bank) ? s.bank.length : Object.keys(s.bank || {}).length;
      return { approved, bank, file: f };
    } catch (e) {}
  }
  return { approved: 0, bank: 0, file: null };
}

function faceFiles(pfx) {
  const qa = path.join(WD, 'assets', 'qa');
  let face = 0, sq = 0;
  try {
    for (const n of fs.readdirSync(qa)) {
      if (!n.toLowerCase().startsWith(pfx)) continue;
      if (/\.sq\.jpe?g$/i.test(n)) sq++;
      else if (/\.jpe?g$/i.test(n)) face++;
    }
  } catch (e) {}
  return { face, sq };
}

(async () => {
  const idx = await store.get('_index.json', { type: 'json' });
  const byP = {};
  for (const e of (idx.entries || [])) {
    if (!e || !e.id) continue;
    const m = String(e.id).match(/^([a-z]{1,6})\d/i);
    if (!m) continue;
    const p = m[1].toLowerCase();
    byP[p] = (byP[p] || 0) + 1;
  }
  const totalNow = Object.values(byP).reduce((a, b) => a + b, 0) || 1;
  const FUTURE = 30000;

  const rows = [];
  for (const [pfx, n] of Object.entries(byP).sort((a, b) => b[1] - a[1])) {
    const share = n / totalNow;
    const growth = Math.round(FUTURE * share);
    const b = bankCount(pfx);
    const files = faceFiles(pfx);
    // Future-proof bank: cover growth faces + 300 spare (owner FACE/TOPS pattern) + 15% thematic variety
    const needBank = Math.round((growth + 300) * 1.15);
    const haveBank = Math.max(b.bank, Math.max(0, files.face - n)); // rough
    const gap = Math.max(0, needBank - b.bank);
    rows.push({
      pfx,
      name: PNAMES[pfx] || pfx,
      category: CATEGORY[pfx] || 'general-business',
      now: n,
      sharePct: Math.round(share * 1000) / 10,
      futureAdd: growth,
      faceOnDisk: files.face,
      approved: b.approved,
      bankNow: b.bank,
      recommendBank: needBank,
      gap,
    });
  }

  // Category rollup
  const cats = {};
  for (const r of rows) {
    const c = r.category;
    if (!cats[c]) cats[c] = { category: c, pillars: [], now: 0, futureAdd: 0, bankNow: 0, recommendBank: 0, gap: 0 };
    cats[c].pillars.push(r.pfx);
    cats[c].now += r.now;
    cats[c].futureAdd += r.futureAdd;
    cats[c].bankNow += r.bankNow;
    cats[c].recommendBank += r.recommendBank;
    cats[c].gap += r.gap;
  }

  const out = {
    at: new Date().toISOString(),
    totalEntriesNow: totalNow,
    futureQAs: FUTURE,
    method: 'Allocate 30k new Q&As proportional to current pillar mix. Bank = (growth + 300 spare) × 1.15 variety. Tops reuse faces (dupes OK) so bank ≈ unique faces needed.',
    totals: {
      recommendBankAll: rows.reduce((a, r) => a + r.recommendBank, 0),
      bankNowAll: rows.reduce((a, r) => a + r.bankNow, 0),
      gapAll: rows.reduce((a, r) => a + r.gap, 0),
    },
    byCategory: Object.values(cats).sort((a, b) => b.recommendBank - a.recommendBank),
    byPillar: rows,
  };
  fs.writeFileSync(path.join(WD, '_image_bank_30k_audit.json'), JSON.stringify(out, null, 2));
  console.log(JSON.stringify({
    totalEntriesNow: out.totalEntriesNow,
    futureQAs: FUTURE,
    recommendBankAll: out.totals.recommendBankAll,
    bankNowAll: out.totals.bankNowAll,
    gapAll: out.totals.gapAll,
    topCategories: out.byCategory.slice(0, 12),
  }, null, 2));
})().catch((e) => { console.error(e); process.exit(1); });
