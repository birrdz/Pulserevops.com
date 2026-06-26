// Queue 100 "The 10 Best AI Tools for <web-development task> in 2027" entries (ai pillar).
// Hand-curated web-dev use-cases (no DeepSeek spend). Dedups vs the live index + existing
// queue, PREPENDS to _gapfill_queue.json so writers do them next.
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const QFILE = 'C:/Users/koryj/website/_gapfill_queue.json';
const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
const titleFor = uc => `The 10 Best AI Tools for ${uc} in 2027`;

const USECASES = [
  // frameworks / frontend
  'React Development', 'Vue.js Development', 'Angular Development', 'Svelte Development', 'Next.js Development',
  'Tailwind CSS', 'CSS and Styling', 'Responsive Web Design', 'Web Animations', 'Frontend Debugging',
  'Component Libraries', 'Design Systems', 'Web Typography', 'Dark Mode Design', 'Single-Page Apps',
  // backend / apis
  'Node.js Development', 'Python Web Development', 'PHP Development', 'Ruby on Rails Development', 'Django Development',
  'Laravel Development', 'Express.js Development', 'REST API Development', 'GraphQL Development', 'Backend Debugging',
  'Serverless Functions', 'Microservices Development', 'Authentication and Login', 'Webhook Integration', 'Real-Time Web Apps',
  // full-stack / platforms
  'Full-Stack Web Development', 'WordPress Development', 'Shopify Store Development', 'Webflow Sites', 'Wix Websites',
  'Squarespace Websites', 'Headless CMS Development', 'Drupal Development', 'Static Site Generation', 'Jamstack Sites',
  // ecommerce
  'E-commerce Websites', 'Online Store Building', 'Payment Integration', 'Product Page Design', 'Shopping Cart Development',
  'Subscription Billing', 'Checkout Optimization',
  // design / ux
  'Landing Page Design', 'Web Wireframing', 'Web Prototyping', 'UI Mockups', 'Color Palette Generation',
  'Favicon and Icon Design', 'Hero Section Design', 'Web Form Design', 'Navigation and Menu Design', 'Web Illustration',
  // content
  'Website Copywriting', 'Blog Writing for Websites', 'UX Microcopy', 'Meta Description Writing', 'Image Alt Text',
  'Website Content Planning', 'FAQ Page Writing',
  // performance
  'Website Performance Optimization', 'Core Web Vitals', 'Web Image Optimization', 'Lazy Loading', 'Web Caching',
  'Bundle Size Optimization', 'Website Speed Testing',
  // accessibility
  'Web Accessibility', 'Accessibility Audits', 'Screen Reader Testing', 'Color Contrast Checking',
  // seo / analytics
  'Technical SEO', 'On-Page SEO', 'Schema Markup', 'Sitemap Generation', 'Website Analytics', 'Keyword Research for Websites',
  // testing / qa
  'Web Testing and QA', 'End-to-End Testing', 'Unit Testing', 'Visual Regression Testing', 'Cross-Browser Testing',
  // devops / deploy
  'Website Deployment', 'CI/CD for Web Apps', 'Docker for Web Apps', 'Web Hosting Management', 'Domain and DNS Management',
  'SSL and HTTPS Setup', 'Website Monitoring', 'Uptime Monitoring', 'Web Error Tracking',
  // security
  'Web Application Security', 'Website Vulnerability Scanning', 'Bot and Spam Protection',
  // conversion
  'Conversion Rate Optimization', 'Website A/B Testing', 'Heatmaps and Session Recording', 'Lead Capture Forms', 'Pop-up Optimization',
  // site types / misc
  'Portfolio Websites', 'SaaS Landing Pages', 'Real Estate Websites', 'Restaurant Websites', 'Membership Sites',
  'Online Course Platforms', 'Directory Websites', 'Booking and Appointment Sites', 'Website Chatbots', 'Website Localization',
  'Progressive Web Apps', 'Browser Extension Development', 'Website Migration', 'Website Redesign', 'Web Code Refactoring',
];

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const taken = new Set(idx.entries.map(e => norm(e.question)));
  const queue = JSON.parse(fs.readFileSync(QFILE, 'utf8'));
  for (const it of queue) taken.add(norm(it.title));

  const picked = [], seen = new Set();
  for (const uc of USECASES) {
    const t = titleFor(uc);
    const n = norm(t);
    if (taken.has(n) || seen.has(n)) continue;
    seen.add(n);
    picked.push({ prefix: 'ai', title: t, kind: 'top10' });
  }
  const out = [...picked, ...queue];
  fs.writeFileSync(QFILE, JSON.stringify(out, null, 1));
  console.log(`QUEUED ${picked.length} web-dev AI-tool titles (prepended). queue now ${out.length}.`);
  picked.slice(0, 10).forEach(p => console.log('  ' + p.title));
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });
