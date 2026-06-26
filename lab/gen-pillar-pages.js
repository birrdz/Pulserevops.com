#!/usr/bin/env node
// Generates the 9 pillar landing pages from a single template.
// Run from website root: node lab/gen-pillar-pages.js

const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

const PAGES = [
  {
    file: 'knowledge.html',
    pillar: 'all',
    title: 'Knowledge Library — Pulse RevOps',
    desc: 'Browse 6,300+ operator-grade RevOps answers, sales playbooks, KPIs, tech stacks, book summaries, and reviews. Search any question, filter by pillar, jump to the answer.',
    canonical: 'https://pulserevops.com/knowledge',
    eyebrow: 'The PULSE Knowledge Library',
    h1: 'Every',
    h1em: 'RevOps answer. One library.',
    sub: 'Operator-grade answers, sales playbooks, industry KPIs, tech stacks, book summaries, electronic reviews, revenue architecture, GTM playbooks, and graphics — searchable, sourced, free.',
    countEmoji: '📚',
    countLabel: 'entries · updated continuously',
    placeholder: 'Search 6,300+ entries — by question, vendor name, or entry ID (q1234, st0027, ra0001...)',
    gridLabel: 'library',
  },
  {
    file: 'sales-trainings.html',
    pillar: 'st',
    title: 'Sales Trainings — Pulse RevOps',
    desc: '430+ ready-to-run 60-minute sales meeting templates: verbatim scripts, role-plays, FAQs, and the exact agenda — built for sales managers to run as-is.',
    canonical: 'https://pulserevops.com/sales-trainings',
    eyebrow: 'Sales Trainings · 60-min meetings',
    h1: 'Run a',
    h1em: 'great sales meeting.',
    sub: 'Ready-to-run 60-minute sales training templates with verbatim scripts, role-plays, FAQs, and the exact agenda — built so any sales manager can pick one up and run it as-is.',
    countEmoji: '🎓',
    countLabel: 'training templates',
    placeholder: 'Search trainings by topic, vendor, or st#### id',
    gridLabel: 'trainings',
  },
  {
    file: 'industry-kpis.html',
    pillar: 'ik',
    title: 'Industry KPIs — Pulse RevOps',
    desc: '400+ industry-specific RevOps KPI deep dives: the 9 KPIs that matter, real operator benchmarks, failure modes, reporting cadence, and a 30/60/90 ramp.',
    canonical: 'https://pulserevops.com/industry-kpis',
    eyebrow: 'Industry KPIs · 9 metrics per vertical',
    h1: 'Track the',
    h1em: 'right 9 KPIs.',
    sub: 'For every industry: the exact 9 KPIs operators actually use, named-operator benchmarks, the failure modes that bury teams, reporting cadence, and a 30/60/90 onboarding ramp.',
    countEmoji: '📊',
    countLabel: 'KPI guides',
    placeholder: 'Search KPIs by industry, metric, or ik#### id',
    gridLabel: 'KPIs',
  },
  {
    file: 'tech-stacks.html',
    pillar: 'tk',
    title: 'Tech Stacks — Pulse RevOps',
    desc: 'Recommended full operating software stacks per industry: real vendors, real prices, real integrations — the stack a working operator would actually buy.',
    canonical: 'https://pulserevops.com/tech-stacks',
    eyebrow: 'Tech Stacks · Real vendors. Real prices.',
    h1: 'Buy the',
    h1em: 'right stack.',
    sub: 'The recommended operating-software stack for every industry — real vendors, real 2027 prices, real integrations, sized for working operators not enterprise procurement.',
    countEmoji: '🧰',
    countLabel: 'tech stack guides',
    placeholder: 'Search tech stacks by industry, vendor, or tk#### id',
    gridLabel: 'tech stacks',
  },
  {
    file: 'graphics.html',
    pillar: 'gb',
    title: 'Graphics Library — Pulse RevOps',
    desc: 'Free un-branded themeable RevOps SVGs and PNGs. Recolor to your brand in one click. 420+ funnels, flows, dashboards, and charts you can drop into your own deck.',
    canonical: 'https://pulserevops.com/graphics',
    eyebrow: 'Graphics · Un-branded. Themeable. Free.',
    h1: 'Pretty',
    h1em: 'RevOps graphics.',
    sub: 'Un-branded themeable RevOps SVGs and PNGs — funnels, flows, dashboards, charts. Recolor to your brand in one click, then drop into your own deck. Free.',
    countEmoji: '🎨',
    countLabel: 'graphics',
    placeholder: 'Search graphics by topic, type, or gb#### id',
    gridLabel: 'graphics',
  },
  {
    file: 'sales-book-summaries.html',
    pillar: 'bs',
    title: 'Sales Book Summaries — Pulse RevOps',
    desc: 'Chapter-by-chapter summaries of every sales and RevOps book that matters. The Challenger Sale, SPIN, MEDDIC, Predictable Revenue, Gap Selling — read once, apply forever.',
    canonical: 'https://pulserevops.com/sales-book-summaries',
    eyebrow: 'Sales Books · Chapter by chapter',
    h1: 'Every sales book.',
    h1em: 'Summarized.',
    sub: 'Chapter-by-chapter summaries of the sales and RevOps books that shape the field — frameworks pulled out as runnable plays you can apply on Monday.',
    countEmoji: '📖',
    countLabel: 'book summaries',
    placeholder: 'Search books by title, framework, or bs#### id',
    gridLabel: 'book summaries',
  },
  {
    file: 'electronic-reviews.html',
    pillar: 'er',
    title: 'Electronic Reviews — Pulse RevOps',
    desc: 'Top-10 product rankings for the gear RevOps operators actually buy: travel routers, lap desks, desk lamps, monitors, mics. Best Overall, Best Value, real prices, real reviewer experience.',
    canonical: 'https://pulserevops.com/electronic-reviews',
    eyebrow: 'Reviews · Top-10 gear rankings',
    h1: 'Pick the',
    h1em: 'right gear.',
    sub: 'Top-10 rankings for the gear RevOps operators actually buy — travel routers, lap desks, desk lamps, monitors, mics, headsets, anything you’d order for the work. Best Overall + Best Value picks in every list. No vendor-paid spin.',
    countEmoji: '⭐',
    countLabel: 'gear reviews',
    placeholder: 'Search reviews by product, category, or er#### id',
    gridLabel: 'reviews',
  },
  {
    file: 'revenue-architecture.html',
    pillar: 'ra',
    title: 'Revenue Architecture — Pulse RevOps',
    desc: 'Build the revenue organization. Org charts, comp plans, territory design, ramp models, and the org changes that turn a flat org into a scaled one.',
    canonical: 'https://pulserevops.com/revenue-architecture',
    eyebrow: 'Revenue Architecture · Build the org',
    h1: 'Build the',
    h1em: 'revenue org.',
    sub: 'Org charts, comp plans, territory design, ramp models, manager spans, and the org-shape decisions that turn a flat sales team into a scaled revenue engine.',
    countEmoji: '🏗️',
    countLabel: 'architecture guides',
    placeholder: 'Search architecture by topic, role, or ra#### id',
    gridLabel: 'architecture',
  },
  {
    file: 'go-to-market-playbooks.html',
    pillar: 'gp',
    title: 'Go-To-Market Playbooks — Pulse RevOps',
    desc: 'Operator-grade GTM playbooks per industry. Customer acquisition channels, sales motion, pricing, hiring sequence, churn, retention — everything needed to grow an industry business.',
    canonical: 'https://pulserevops.com/go-to-market-playbooks',
    eyebrow: 'GTM Playbooks · Industry-level',
    h1: 'Run a',
    h1em: 'great GTM motion.',
    sub: 'GTM playbooks for every industry — customer acquisition channels, sales motion, pricing, comp, hiring sequence, churn, retention. For operators running real businesses.',
    countEmoji: '🗺️',
    countLabel: 'GTM playbooks',
    placeholder: 'Search GTM playbooks by industry, motion, or gp#### id',
    gridLabel: 'playbooks',
  },
];

const tpl = (p) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#09090F">
<meta name="format-detection" content="telephone=no">
<title>${p.title}</title>
<meta name="description" content="${p.desc}">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
<link rel="canonical" href="${p.canonical}">
<meta property="og:title" content="${p.title}">
<meta property="og:description" content="${p.desc}">
<meta property="og:url" content="${p.canonical}">
<meta property="og:image" content="https://pulserevops.com/og-themachine.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Pulse RevOps">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${p.title}">
<meta name="twitter:description" content="${p.desc}">
<meta name="twitter:image" content="https://pulserevops.com/og-themachine.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/pillar-page.css">
<link rel="prefetch" href="/.netlify/functions/pulse-machine-library-list?recent=300" as="fetch" crossorigin>
</head>
<body>
<header class="hdr">
  <div class="hdr-in">
    <a href="/" class="hdr-logo">
      <span class="hdr-pill"><span class="hdr-dot"></span>LIVE</span>
      <span class="hdr-name">PULSE</span>
    </a>
    <a href="/sponsor" class="hdr-cta">✦ Advertise</a>
  </div>
</header>
<section class="hero">
  <div class="hero-eyebrow"><span class="hero-dot"></span>${p.eyebrow}</div>
  <h1>${p.h1} <em>${p.h1em}</em></h1>
  <p class="hero-sub">${p.sub}</p>
  <div class="hero-counts">${p.countEmoji} <strong id="hc-total">…</strong> ${p.countLabel}</div>
</section>
<div class="toolbar">
  <div class="search-wrap">
    <span class="search-icon">🔍</span>
    <input class="search-input" id="q" type="search" placeholder="${p.placeholder}" autocomplete="off">
    <button class="search-clear" id="qclear" aria-label="Clear search">×</button>
  </div>
  <div class="filters" id="filters"></div>
</div>
<div class="statusbar" id="status">
  <span><strong id="st-count">…</strong> entries shown</span>
  <span>Sorted newest first</span>
</div>
<div class="grid-wrap">
  <div class="grid" id="grid"><div class="loading"><div class="pulse-logo"><span class="pulse-dot"></span></div><div class="pulse-label">Loading ${p.gridLabel}<span class="pulse-dots">...</span></div><div class="pulse-skeleton"><div class="skel-card"></div><div class="skel-card"></div><div class="skel-card"></div><div class="skel-card"></div><div class="skel-card"></div><div class="skel-card"></div><div class="skel-card"></div><div class="skel-card"></div><div class="skel-card"></div></div></div></div>
  <div class="pager" id="pager"></div>
</div>
<footer class="footer">
  <div class="footer-in">
    <a href="#" class="footer-pill"><span class="footer-pill-dot"></span>Library · <span id="lp-num">live</span> entries</a>
    <div class="footer-pillars" id="lp-pillars"></div>
    <div class="footer-copy">© 2025 Kory White · PULSE RevOps · <a href="/">pulserevops.com</a> · <a href="/tools">🛠 Free Tools</a> · <a href="/sponsor">Advertise</a> · <a href="/my-content">My Content (4-digit code)</a> · <a href="https://calendly.com/korywhiterevops">Open to Senior B2B/B2C Revenue Leader roles →</a></div>
  </div>
</footer>
<script>window.PILLAR_DEFAULT = '${p.pillar}';</script>
<script src="/js/pillar-page.js" defer></script>
</body>
</html>
`;

for (const p of PAGES) {
  const out = path.join(ROOT, p.file);
  fs.writeFileSync(out, tpl(p), 'utf8');
  console.log('wrote', p.file, '(' + tpl(p).length + ' bytes)');
}
console.log('DONE — wrote', PAGES.length, 'pillar pages');
