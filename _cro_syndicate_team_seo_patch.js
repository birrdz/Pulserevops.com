#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { metaKeywordsString, FRACTIONAL_CRO_100 } = require('./_cro_fractional_100_keywords');

const p = path.join(__dirname, 'cro-syndicate-team.html');
let html = fs.readFileSync(p, 'utf8');
const kw = metaKeywordsString();

html = html.replace(
  /<title>[^<]*<\/title>/,
  '<title>CRO Syndicate Team — Hire a Fractional CRO | Practitioner Chief Revenue Officers</title>'
);
html = html.replace(
  /<meta name="description" content="[^"]*" \/>/,
  '<meta name="description" content="Hire a fractional CRO through CRO Syndicate. Practitioner Chief Revenue Officers for revenue leadership, GTM strategy, sales scaling, and RevOps — fractional, interim, and on-demand. Kory White serves Maryland, DC, and nationwide." />'
);
html = html.replace(
  /<meta name="keywords" content="[^"]*" \/>/,
  `<meta name="keywords" content="${kw.replace(/"/g, '&quot;')}" />`
);
html = html.replace(
  /<meta property="og:title" content="[^"]*" \/>/,
  '<meta property="og:title" content="CRO Syndicate Team — Hire a Fractional CRO | Practitioner CROs" />'
);
html = html.replace(
  /<meta property="og:description" content="[^"]*" \/>/,
  '<meta property="og:description" content="Fractional Chief Revenue Officers via CRO Syndicate — revenue leadership, sales scaling, GTM, and RevOps. Book a discovery call with Kory White." />'
);

if (!html.includes('twitter:card')) {
  html = html.replace(
    /<meta property="og:image" content="https:\/\/pulserevops.com\/pulse-og.png" \/>/,
    `<meta property="og:image" content="https://pulserevops.com/pulse-og.png" />
  <meta property="og:image:alt" content="CRO Syndicate — fractional CRO team" />
  <meta property="og:locale" content="en_US" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="CRO Syndicate Team — Hire a Fractional CRO" />
  <meta name="twitter:description" content="Practitioner fractional Chief Revenue Officers — revenue leadership without the full-time hire." />
  <meta name="twitter:image" content="https://pulserevops.com/pulse-og.png" />`
  );
}

const knows = JSON.stringify(FRACTIONAL_CRO_100.slice(0, 40));
html = html.replace(
  /"description": "CRO Syndicate provides seasoned interim executives[^"]*"/,
  `"description": "CRO Syndicate places practitioner fractional and interim Chief Revenue Officers — fractional CRO services, revenue leadership, GTM strategy, and sales scaling for ambitious companies.",
    "alternateName": ["CRO Syndicate fractional CRO", "Practitioner CRO network", "Fractional CRO services"],
    "knowsAbout": ${knows}`
);

if (!html.includes('ProfessionalService')) {
  const svc = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'CRO Syndicate — Fractional CRO Team',
    url: 'https://pulserevops.com/cro-syndicate-team',
    description:
      'Hire a fractional Chief Revenue Officer through CRO Syndicate. Practitioner CROs for revenue leadership, sales scaling, GTM strategy, RevOps, and pipeline growth.',
    provider: { '@type': 'Organization', name: 'CRO Syndicate', url: 'https://crosyndicate.com/' },
    areaServed: 'United States',
    serviceType: FRACTIONAL_CRO_100.slice(0, 25),
  };
  html = html.replace(
    '</head>',
    `  <script type="application/ld+json">\n${JSON.stringify(svc, null, 2)}\n  </script>\n</head>`
  );
}

fs.writeFileSync(p, html);
console.log(JSON.stringify({ ok: true, file: p, keywordCount: FRACTIONAL_CRO_100.length, metaLen: kw.length }, null, 2));
