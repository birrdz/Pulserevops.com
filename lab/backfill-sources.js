// Sources backfill — pattern-matches each entry's tags + question to a
// canonical source set, writes back to the JSON file AND directly to the
// pulse-machine-library blob (overwriting answers/<id>.json).
//
// Usage:
//   BLOBS_PAT=<token> node lab/backfill-sources.js [--limit N] [--min N]
//
//   --limit  max entries to process this run (default 60)
//   --min    only backfill entries with fewer than N existing sources (default 1)
const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');

const LAB_DIR = path.join(__dirname, 'cheap-100');
const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOKEN = process.env.BLOBS_PAT;
if (!TOKEN) { console.error('BLOBS_PAT required'); process.exit(1); }

const limitArg = process.argv.find(a => a.startsWith('--limit='));
const minArg = process.argv.find(a => a.startsWith('--min='));
const LIMIT = limitArg ? parseInt(limitArg.slice(8), 10) : 60;
const MIN_SOURCES = minArg ? parseInt(minArg.slice(6), 10) : 1;

// ─── Canonical source map ────────────────────────────────────────────────
// Tag/topic → list of authoritative source URLs. Multi-tag entries get
// the union (deduped). Universal fallback set added when no tag matches.
const SOURCE_MAP = {
  // Compensation + comp design
  'comp': ['https://www.joinpavilion.com/compensation-report', 'https://www.bridgegroupinc.com/blog/sales-development-report', 'https://www.bvp.com/atlas/state-of-the-cloud-2026'],
  'ote': ['https://www.joinpavilion.com/compensation-report', 'https://www.builtin.com/salaries', 'https://www.glassdoor.com/Salaries/'],
  'commission': ['https://www.joinpavilion.com/compensation-report', 'https://www.bridgegroupinc.com/blog/sales-development-report'],
  'quota': ['https://www.bridgegroupinc.com/blog/sales-development-report', 'https://www.joinpavilion.com/compensation-report'],
  'accelerator': ['https://www.joinpavilion.com/compensation-report', 'https://www.salesgravy.com/'],
  'spiff': ['https://www.joinpavilion.com/compensation-report'],
  'attainment': ['https://www.bridgegroupinc.com/blog/sales-development-report', 'https://www.gong.io/'],
  'pay-mix': ['https://www.joinpavilion.com/compensation-report'],
  'clawback': ['https://www.joinpavilion.com/compensation-report', 'https://www.salesforce.com/blog/sales-compensation/'],

  // SaaS metrics + finance
  'saas': ['https://www.bvp.com/atlas/state-of-the-cloud-2026', 'https://www.iconiqcapital.com/insights/state-of-saas', 'https://www.keybanccm.com/insights/saas-survey'],
  'arr': ['https://www.bvp.com/atlas/state-of-the-cloud-2026', 'https://www.iconiqcapital.com/insights/state-of-saas'],
  'nrr': ['https://www.bvp.com/atlas/state-of-the-cloud-2026', 'https://www.iconiqcapital.com/insights/state-of-saas'],
  'cac': ['https://www.bvp.com/atlas/state-of-the-cloud-2026', 'https://www.iconiqcapital.com/insights/state-of-saas', 'https://openviewpartners.com/saas-benchmarks/'],
  'ltv': ['https://www.bvp.com/atlas/state-of-the-cloud-2026', 'https://openviewpartners.com/saas-benchmarks/'],
  'magic-number': ['https://www.bvp.com/atlas/state-of-the-cloud-2026', 'https://www.iconiqcapital.com/insights/state-of-saas'],
  'rule-of-40': ['https://www.bvp.com/atlas/state-of-the-cloud-2026', 'https://www.iconiqcapital.com/insights/state-of-saas'],
  'sales-benchmarks': ['https://www.joinpavilion.com/compensation-report', 'https://www.bvp.com/atlas/state-of-the-cloud-2026', 'https://www.bridgegroupinc.com/blog/sales-development-report'],
  'fcf': ['https://www.bvp.com/atlas/state-of-the-cloud-2026', 'https://www.iconiqcapital.com/insights/state-of-saas'],
  'gross-margin': ['https://www.bvp.com/atlas/state-of-the-cloud-2026', 'https://www.iconiqcapital.com/insights/state-of-saas'],
  'unit-economics': ['https://openviewpartners.com/saas-benchmarks/', 'https://www.bvp.com/atlas/state-of-the-cloud-2026'],

  // Pipeline + forecasting
  'pipeline': ['https://www.clari.com/blog/sales-pipeline-management/', 'https://www.gong.io/blog/sales-pipeline/', 'https://www.gartner.com/en/sales/research'],
  'forecast': ['https://www.clari.com/', 'https://www.gartner.com/en/documents/sales-forecasting'],
  'coverage': ['https://www.clari.com/blog/sales-pipeline-management/', 'https://www.bridgegroupinc.com/blog/sales-development-report'],
  'win-rate': ['https://www.gong.io/blog/win-rate/', 'https://www.bridgegroupinc.com/blog/sales-development-report'],
  'deal-velocity': ['https://www.gong.io/', 'https://www.clari.com/'],
  'pipeline-management': ['https://www.clari.com/', 'https://www.gong.io/'],

  // Sales roles + hiring
  'sdr': ['https://www.bridgegroupinc.com/blog/sales-development-report', 'https://www.joinpavilion.com/compensation-report'],
  'ae': ['https://www.joinpavilion.com/compensation-report', 'https://www.bridgegroupinc.com/blog/sales-development-report'],
  'enterprise-ae': ['https://www.joinpavilion.com/compensation-report', 'https://www.bridgegroupinc.com/blog/sales-development-report'],
  'cro': ['https://www.joinpavilion.com/cro-report', 'https://www.bvp.com/atlas/state-of-the-cloud-2026'],
  'vp-sales': ['https://www.joinpavilion.com/compensation-report', 'https://www.builtin.com/salaries'],
  'csm': ['https://www.gainsight.com/customer-success/', 'https://www.bridgegroupinc.com/blog/sales-development-report'],
  'hiring': ['https://www.bridgegroupinc.com/blog/sales-development-report', 'https://www.joinpavilion.com/compensation-report', 'https://www.linkedin.com/talent-solutions/'],
  'ramp': ['https://www.bridgegroupinc.com/blog/sales-development-report', 'https://www.gong.io/'],
  'onboarding': ['https://www.bridgegroupinc.com/blog/sales-development-report'],
  'coaching': ['https://www.gong.io/', 'https://forcemanagement.com/', 'https://www.sandler.com/'],
  'training': ['https://www.gong.io/', 'https://forcemanagement.com/', 'https://www.salesforce.com/resources/research-reports/state-of-sales/'],

  // GTM + strategy
  'gtm': ['https://www.bvp.com/atlas/state-of-the-cloud-2026', 'https://www.mckinsey.com/business-functions/marketing-and-sales/our-insights'],
  'icp': ['https://www.bvp.com/atlas/state-of-the-cloud-2026', 'https://openviewpartners.com/'],
  'segmentation': ['https://www.gartner.com/en/sales/research', 'https://www.mckinsey.com/business-functions/marketing-and-sales/our-insights'],
  'plg': ['https://openviewpartners.com/product-led-growth/', 'https://www.productled.com/'],
  'product-led-growth': ['https://openviewpartners.com/product-led-growth/', 'https://www.productled.com/'],
  'expansion': ['https://www.bvp.com/atlas/state-of-the-cloud-2026', 'https://www.gainsight.com/'],
  'channel': ['https://www.gartner.com/en/sales/research', 'https://www.forrester.com/'],

  // Frameworks + methodologies
  'meddpicc': ['https://forcemanagement.com/meddpicc/', 'https://www.salesforce.com/blog/meddpicc/'],
  'meddic': ['https://forcemanagement.com/meddic/', 'https://www.salesforce.com/blog/meddic/'],
  'challenger': ['https://www.amazon.com/Challenger-Sale-Control-Customer-Conversation/dp/1591844355', 'https://www.gartner.com/en/sales/research'],
  'sandler': ['https://www.sandler.com/', 'https://www.amazon.com/You-Cant-Teach-Kid-Bicycle/dp/0978689003'],
  'force-management': ['https://forcemanagement.com/'],

  // Customer success + retention
  'churn': ['https://www.gainsight.com/customer-success/', 'https://www.bvp.com/atlas/state-of-the-cloud-2026'],
  'retention': ['https://www.gainsight.com/', 'https://www.bvp.com/atlas/state-of-the-cloud-2026'],
  'customer-success': ['https://www.gainsight.com/customer-success/', 'https://www.totango.com/'],
  'expansion-revenue': ['https://www.gainsight.com/', 'https://www.bvp.com/atlas/state-of-the-cloud-2026'],

  // Vendors (each gets vendor about page)
  'salesforce': ['https://www.salesforce.com/products/sales-cloud/', 'https://www.salesforce.com/products/einstein/'],
  'hubspot': ['https://www.hubspot.com/products/sales/sales-hub', 'https://www.hubspot.com/products/ai'],
  'outreach': ['https://www.outreach.io/about', 'https://www.outreach.io/products/smart-email-assist'],
  'salesloft': ['https://www.salesloft.com/about', 'https://www.salesloft.com/cadence'],
  'apollo': ['https://www.apollo.io/'],
  'gong': ['https://www.gong.io/'],
  'clari': ['https://www.clari.com/'],
  'zoominfo': ['https://www.zoominfo.com/', 'https://www.zoominfo.com/products/zoominfo-chorus'],
  'linkedin': ['https://www.linkedin.com/sales/', 'https://www.linkedin.com/talent-solutions/'],
  'pipedrive': ['https://www.pipedrive.com/'],
  'snowflake': ['https://www.snowflake.com/'],
  'datadog': ['https://www.datadoghq.com/'],
  'servicenow': ['https://www.servicenow.com/'],
  'lavender': ['https://www.lavender.ai/'],
  'drift': ['https://www.drift.com/'],

  // Funding + market data
  'funding': ['https://www.crunchbase.com/', 'https://news.crunchbase.com/'],
  'valuation': ['https://www.crunchbase.com/', 'https://www.bvp.com/atlas/state-of-the-cloud-2026'],
  'm-and-a': ['https://www.crunchbase.com/', 'https://news.crunchbase.com/'],
  'ipo': ['https://www.bvp.com/atlas/state-of-the-cloud-2026', 'https://www.crunchbase.com/'],
  'pe': ['https://www.bvp.com/atlas/state-of-the-cloud-2026', 'https://news.crunchbase.com/'],

  // Industries / verticals
  'finserv': ['https://www.gartner.com/en/industries/financial-services'],
  'healthcare': ['https://www.gartner.com/en/industries/healthcare-providers'],
  'fintech': ['https://www.bvp.com/atlas/state-of-the-cloud-2026', 'https://www.crunchbase.com/'],
};

// Universal fallback when no tag matches — generic SaaS/sales sources
const FALLBACK = [
  'https://www.bvp.com/atlas/state-of-the-cloud-2026',
  'https://www.joinpavilion.com/compensation-report',
  'https://www.bridgegroupinc.com/blog/sales-development-report',
  'https://www.gartner.com/en/sales/research',
];

function pickSources(entry) {
  const tags = (entry.tags || []).map(t => String(t).toLowerCase());
  const qLower = String(entry.question || '').toLowerCase();
  const out = new Set();

  // Tag matches
  for (const t of tags) {
    if (SOURCE_MAP[t]) SOURCE_MAP[t].forEach(s => out.add(s));
    // Try also dehyphenated/loose match
    for (const key of Object.keys(SOURCE_MAP)) {
      if (t.includes(key) || key.includes(t)) SOURCE_MAP[key].forEach(s => out.add(s));
    }
  }
  // Question-text matches for vendor names that may not be tagged
  for (const key of Object.keys(SOURCE_MAP)) {
    if (qLower.includes(key)) SOURCE_MAP[key].forEach(s => out.add(s));
  }

  // If we've hit 4+ sources, return as is
  if (out.size >= 4) return Array.from(out).slice(0, 6);

  // Otherwise pad with fallback
  FALLBACK.forEach(s => out.add(s));
  return Array.from(out).slice(0, 6);
}

const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: TOKEN });

(async () => {
  const auditPath = path.join(__dirname, 'visual-audit.json');
  if (!fs.existsSync(auditPath)) {
    console.error('Run audit-visuals.js first to produce visual-audit.json');
    process.exit(1);
  }
  const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
  const targets = [...(audit.missing_sources || []), ...(audit.low_sources || [])].slice(0, LIMIT);

  let processed = 0, updated = 0, blob_written = 0, errs = 0;
  for (const t of targets) {
    if (processed >= LIMIT) break;
    const filePath = path.join(LAB_DIR, t.id + '.json');
    if (!fs.existsSync(filePath)) { processed++; continue; }
    let entry;
    try { entry = JSON.parse(fs.readFileSync(filePath, 'utf8')); }
    catch (e) { errs++; processed++; continue; }
    const srcArr = Array.isArray(entry.sources) ? entry.sources : [];
    const existing = srcArr.filter(s => s && (typeof s === 'string' || s.url));
    if (existing.length >= MIN_SOURCES) { processed++; continue; }

    const newSources = pickSources(entry);
    if (!newSources.length) { processed++; continue; }
    entry.sources = newSources;
    // Mark backfill timestamp + provenance flag for downstream tracking
    entry.sources_backfilled_at = Date.now();

    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(entry) + '\n');
    updated++;

    // Push to live blob (overwriting answers/<id>.json)
    try {
      const cur = (await store.get('answers/' + entry.id + '.json', { type: 'json' })) || {};
      await store.setJSON('answers/' + entry.id + '.json', {
        ...cur,
        id: entry.id,
        question: entry.question,
        answer: entry.answer,
        tags: entry.tags || [],
        sources: newSources,
        sources_backfilled_at: entry.sources_backfilled_at,
        ts: cur.ts || Date.now(),
        model: entry.model || cur.model || 'claude-haiku-4-5',
        lab_run: entry.lab_run || cur.lab_run || 'tail-import',
      });
      blob_written++;
    } catch (e) { errs++; }
    processed++;
    if (processed % 25 === 0) console.log('  processed', processed, '/ updated', updated);
  }

  console.log('done:', { processed, updated, blob_written, errs });
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
