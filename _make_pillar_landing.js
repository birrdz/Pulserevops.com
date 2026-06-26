// Build a new pillar landing page by cloning aquariums.html (a clean recent
// pillar page) and swapping the pillar-specific bits. Strips aquarium-specific
// JSON-LD so we don't ship wrong structured data; the per-pillar SEO hub sync
// regenerates correct schema later.
const fs = require('fs');
const SRC = fs.readFileSync('C:/Users/koryj/website/aquariums.html', 'utf8');

const PILLARS = {
  pt: { file: 'pets.html', seg: 'pets', key: 'pt', name: 'Pets', title: 'Pets — Top-10 Pet Gear, Breeds & Care Guides — Pulse',
        desc: 'Top-10 pet gear, breed, and pet-care rankings plus straight-answer guides for dogs, cats, and more — Best Overall + Best Value picks for 2027.',
        kw: 'pet reviews, best pet products 2027, dog breeds, cat breeds, best dog food, best cat litter, pet insurance comparison, best dog beds, best cat trees, puppy training, best pet cameras, best flea treatment, pet care guide 2027, Top 10 dog breeds, Top 10 cat breeds, Top 10 dog foods, Top 10 pet insurance plans',
        logo: 'pulse-pets-logo.svg', emoji: '🐾', countLabel: 'pet rankings & guides' },
  sw: { file: 'software.html', seg: 'software', key: 'sw', name: 'Software', title: 'Software — Top-10 Software Comparisons & Reviews — Pulse',
        desc: 'Top-10 software rankings and head-to-head comparisons plus straight-answer guides — CRM, marketing, sales, productivity, and security tools, Best Overall + Best Value for 2027.',
        kw: 'software comparison, best software 2027, Salesforce vs HubSpot, best CRM for startups, best email marketing software, best project management tools, Outreach vs Salesloft, best help desk software, software reviews, Top 10 CRM software, Top 10 marketing tools, Top 10 sales tools, best accounting software, best HR software',
        logo: 'pulse-software-logo.svg', emoji: '🧩', countLabel: 'software rankings & guides' },
};

function build(p) {
  let h = SRC;
  // Strip every aquarium-specific JSON-LD block (wrong schema for the new pillar).
  h = h.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/gi, (block) =>
    /aquarium|fishkeep|tank|reef/i.test(block) ? '' : block);
  // Pillar key for pillar-page.js
  h = h.replace(/window\.PILLAR_DEFAULT = 'aq'/g, `window.PILLAR_DEFAULT = '${p.key}'`);
  h = h.replace(/recent=300&pillar=aq/g, `recent=300&pillar=${p.key}`);
  // URLs + canonical + og
  h = h.replace(/https:\/\/pulserevops\.com\/aquariums/g, `https://pulserevops.com/${p.seg}`);
  h = h.replace(/(["'])\/aquariums(["'/])/g, `$1/${p.seg}$2`);
  // Logo
  h = h.replace(/pulse-aquariums-logo\.svg/g, p.logo);
  // Titles / names
  h = h.replace(/<title>[^<]*<\/title>/i, `<title>${p.title}</title>`);
  h = h.replace(/(property="og:title" content=")[^"]*(")/i, `$1${p.title}$2`);
  h = h.replace(/(name="twitter:title" content=")[^"]*(")/i, `$1${p.title}$2`);
  h = h.replace(/(property="og:description" content=")[^"]*(")/i, `$1${p.desc}$2`);
  h = h.replace(/(name="description" content=")[^"]*(")/i, `$1${p.desc}$2`);
  h = h.replace(/(name="twitter:description" content=")[^"]*(")/i, `$1${p.desc}$2`);
  h = h.replace(/(name="keywords" content=")[^"]*(")/i, `$1${p.kw}$2`);
  // Hero copy
  h = h.replace(/<p class="hero-sub">[\s\S]*?<\/p>/i, `<p class="hero-sub">${p.desc}</p>`);
  h = h.replace(/<div class="hero-counts">[\s\S]*?<\/div>/i, `<div class="hero-counts">${p.emoji} <strong id="hc-total">…</strong> ${p.countLabel}</div>`);
  // Visible brand text
  h = h.replace(/Pulse Aquariums/g, `Pulse ${p.name}`);
  h = h.replace(/AQUARIUMS/g, p.name.toUpperCase());
  h = h.replace(/\bAquariums\b/g, p.name);
  h = h.replace(/\baquariums\b/g, p.seg);
  fs.writeFileSync(`C:/Users/koryj/website/${p.file}`, h);
  console.log(`wrote ${p.file} (${h.length} bytes)`);
}

build(PILLARS.pt);
build(PILLARS.sw);
