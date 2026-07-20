// Canonical public URL + kind for pulse-machine-library entries.
//
// Every answer has one SEO identity: /knowledge/<id>. Pillar URLs remain useful
// browsing aliases, but they must not be submitted through sitemaps or IndexNow
// because the entry renderer canonicalizes them to /knowledge/<id>.

const HOST = 'pulserevops.com';
const SITE = `https://${HOST}`;

function isTrainingEntry(e) {
  const id = e && e.id ? String(e.id) : '';
  return (Array.isArray(e.tags) && e.tags.includes('sales-training')) || /^st\d+$/i.test(id);
}

function isKpiEntry(e) {
  const id = e && e.id ? String(e.id) : '';
  return (Array.isArray(e.tags) && e.tags.includes('industry-kpi')) || /^ik\d+$/i.test(id);
}

function isTechstackEntry(e) {
  // Pillar membership is the tk#### ID only — the 'tech-stack' tag doubles as a
  // content topic on general Q&A, so tag-based detection would misroute them.
  const id = e && e.id ? String(e.id) : '';
  return /^tk\d+$/i.test(id);
}

function isGraphicEntry(e) {
  // Pillar membership is the gb#### ID only (downloadable graphic assets).
  const id = e && e.id ? String(e.id) : '';
  return /^gb\d+$/i.test(id);
}

function isBookSummaryEntry(e) {
  // Pillar membership is the bs#### ID only — Sales Book Summaries pillar.
  const id = e && e.id ? String(e.id) : '';
  return /^bs\d+$/i.test(id);
}

function isElectronicReviewEntry(e) {
  // Pillar membership is the er#### ID only — Electronic Reviews (top-10 product
  // rankings with Best Overall + Best Value highlights).
  const id = e && e.id ? String(e.id) : '';
  return /^er\d+$/i.test(id);
}

function isRevenueArchitectureEntry(e) {
  // Pillar membership is the ra#### ID only — Revenue Architecture (8th pillar,
  // operator-grade essays on GTM design, pipeline math, comp + org architecture).
  const id = e && e.id ? String(e.id) : '';
  return /^ra\d+$/i.test(id);
}

function isGTMPlaybookEntry(e) {
  // Pillar membership is the gp#### ID only — Go-To-Market Playbooks (9th pillar,
  // step-by-step playbooks for launching, scaling, and pivoting GTM motions).
  const id = e && e.id ? String(e.id) : '';
  return /^gp\d+$/i.test(id);
}

function stripMirrorSuffix(id) {
  const s = String(id || '');
  return s.endsWith('rv') ? s.slice(0, -2) : s;
}

function libraryEntryKind(e) {
  if (!e || !e.id) return null;
  const id = stripMirrorSuffix(e.id);
  const row = { ...e, id };
  if (isTrainingEntry(row)) return 'training';
  if (isKpiEntry(row)) return 'kpi';
  if (isTechstackEntry(row)) return 'techstack';
  if (isGraphicEntry(row)) return 'graphic';
  if (isBookSummaryEntry(row)) return 'booksummary';
  if (isElectronicReviewEntry(row)) return 'electronicreview';
  if (isRevenueArchitectureEntry(row)) return 'revenuearchitecture';
  if (isGTMPlaybookEntry(row)) return 'gtmplaybook';
  if (/^fr\d+$/i.test(id)) return 'franchise';
  if (/^ca\d+$/i.test(id)) return 'car';
  if (/^co\d+$/i.test(id)) return 'collectible';
  if (/^aq\d+$/i.test(id)) return 'aquarium';
  if (/^hf\d+$/i.test(id)) return 'hsfootball';
  if (/^tn\d+$/i.test(id)) return 'town';
  if (/^sc\d+$/i.test(id)) return 'school';
  if (/^nl\d+$/i.test(id)) return 'nightlife';
  if (/^dn\d+$/i.test(id)) return 'dining';
  if (/^bt\d+$/i.test(id)) return 'boat';
  if (/^mv\d+$/i.test(id)) return 'movie';
  if (/^wl\d+$/i.test(id)) return 'wellness';
  if (/^dr\d+$/i.test(id)) return 'drill';
  if (/^tv\d+$/i.test(id)) return 'travel';
  if (/^rs\d+$/i.test(id)) return 'resort';
  if (/^es\d+$/i.test(id)) return 'estate';
  if (/^cl\d+$/i.test(id)) return 'club';
  if (/^lv\d+$/i.test(id)) return 'living';
  if (/^ev\d+$/i.test(id)) return 'event';
  if (/^sy\d+$/i.test(id)) return 'style';
  if (/^ga\d+$/i.test(id)) return 'gathering';
  if (/^gm\d+$/i.test(id)) return 'gaming';
  if (/^sk\d+$/i.test(id)) return 'skill';
  if (/^tl\d+$/i.test(id)) return 'tools';
  if (/^sp\d+$/i.test(id)) return 'speech';
  if (/^ai\d+$/i.test(id)) return 'aiinfra';
  if (/^tc\d+$/i.test(id)) return 'telco';
  if (/^bo\d+$/i.test(id)) return 'buildout';
  if (/^cd\d+$/i.test(id)) return 'contract';
  if (/^cg\d+$/i.test(id)) return 'coaching';
  if (/^pt\d+$/i.test(id)) return 'pet';
  if (/^ce\d+$/i.test(id)) return 'currentevents';
  if (/^cr\d+$/i.test(id)) return 'crabbing';
  if (/^fs\d+$/i.test(id)) return 'fishing';
  if (/^sw\d+$/i.test(id)) return 'software';
  if (/^ed\d+$/i.test(id)) return 'editorial';
  if (/^q\d+$/i.test(id)) return 'knowledge';
  if (/^vq_/i.test(id)) return 'knowledge'; // visitor-asked questions
  return null;
}

function libraryEntryPublicUrl(e) {
  const kind = libraryEntryKind(e);
  if (!kind) return null;
  const id = String(e.id); // keep rv suffix in public URL
  return `${SITE}/knowledge/${id}`;
}

module.exports = {
  HOST,
  SITE,
  stripMirrorSuffix,
  isTrainingEntry,
  isKpiEntry,
  isTechstackEntry,
  isGraphicEntry,
  isBookSummaryEntry,
  isElectronicReviewEntry,
  isRevenueArchitectureEntry,
  isGTMPlaybookEntry,
  libraryEntryKind,
  libraryEntryPublicUrl,
};
