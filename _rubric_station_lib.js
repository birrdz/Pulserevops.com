// _rubric_station_lib.js — per-slice rubric stations (fix + audit one rubric group at a time).

const STATIONS = {
  writing: {
    label: '✍️ Writing',
    hint: 'Direct Answer · FAQs · word count · sources · related · links',
    keys: ['words2000', 'directAnswer', 'directAnswerFull', 'faq6', 'sources5', 'relatedPulse', 'linksClean'],
    auditSys: 'YOUR LANE = WRITING QUALITY. Focus on prose structure: Direct Answer (2–3 sentences), 6 FAQs, ≥2000 words, 5+ sources, Related on PULSE, clean links. Ignore images.',
  },
  structure: {
    label: '📐 Structure',
    hint: '2 clean mermaid diagrams',
    keys: ['mermaid2', 'mermaidClean'],
    auditSys: 'YOUR LANE = MERMAID DIAGRAMS. Confirm exactly 2 mermaid blocks, syntactically valid, supporting the article. Ignore prose depth and images.',
  },
  face: {
    label: '🦄 Face & hero',
    hint: 'Face-card cover + hero markdown sync',
    keys: ['heroImage', 'faceCardApplicable', 'pollinatorFaceCover'],
    auditSys: 'YOUR LANE = HERO / FACE-CARD. Confirm hero markdown exists, face-card is applicable to pillar, and /assets/qa/<id>.jpg cover is on-topic. Ignore section images.',
  },
  internal: {
    label: '📷 Internal images',
    hint: 'Section DDG images · 3–10 images law',
    keys: ['pollinatorInternalFlux', 'media3to10', 'imagesLaw'],
    auditSys: 'YOUR LANE = SECTION & TOP-10 IMAGES (DuckDuckGo). Confirm each ## section has a topically relevant self-hosted image. Count must satisfy media law (3–10 or Top-10 rules). Ignore prose and hero/face-card.',
  },
  top10: {
    label: '🏆 Top-10 images',
    hint: 'Hero + 10 unique @@PRODUCT images',
    keys: ['top10Images'],
    auditSys: 'YOUR LANE = TOP-10 LIST IMAGES. Every numbered rank needs its OWN unique image of THAT exact item. Never duplicate URLs across ranks.',
  },
  publish: {
    label: '✅ Publish gate',
    hint: 'Full 13/13 rubric + render verify',
    keys: null,
    auditSys: 'YOUR LANE = FINAL PUBLISH SIGN-OFF. All rubric checks must pass. Be maximally strict on anything that would block live publish.',
  },
};

function stationKeys(station) {
  const s = STATIONS[station];
  if (!s) return [];
  return s.keys || [];
}

function stationAuditFromRubric(station, rubric) {
  const keys = stationKeys(station);
  if (!keys.length) return rubric;
  const failed = keys.filter(k => !(rubric.checks && rubric.checks[k]));
  const total = keys.length;
  const passed = total - failed.length;
  return {
    pass: failed.length === 0,
    checks: Object.fromEntries(keys.map(k => [k, !!(rubric.checks && rubric.checks[k])])),
    failed,
    passed,
    total,
    rubricPct: total ? Math.round(passed / total * 100) : rubric.rubricPct,
    contentScore: rubric.contentScore != null ? rubric.contentScore : rubric.score,
  };
}

function stationNeedsWork(station, rubric) {
  if (station === 'publish') return !rubric.pass;
  const sa = stationAuditFromRubric(station, rubric);
  return !sa.pass;
}

function listStations() {
  return Object.entries(STATIONS).map(([id, s]) => ({ id, label: s.label, hint: s.hint, keys: s.keys }));
}

module.exports = {
  STATIONS,
  stationKeys,
  stationAuditFromRubric,
  stationNeedsWork,
  listStations,
};
