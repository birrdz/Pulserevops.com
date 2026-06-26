// Post + index economy CRO Q&As. Cadence uses programmatic 1,000+ word answers + valid Mermaid.

const { generateAnswer, isValidEconomyAnswer } = require('./economy-answer-generate');
const { countWords, MIN_WORDS } = require('./economy-answer-quality');
const { capitalizeQuestion } = require('./text-capitalize');

const WRITER_KEY = 'pulsemachine-writer-2026';
const SITE = 'https://pulserevops.com';

function toQuestion(line) {
  const t = String(line || '').trim();
  let q;
  if (/^how do you /i.test(t)) q = t.endsWith('?') ? t : t + '?';
  else if (/^(what|why|when|where|which|who|can|should|do|does|is|are)\b/i.test(t))
    q = t.endsWith('?') ? t : t + '?';
  else if (
    /^(use|trigger|deploy|train|automate|build|bypass|run|structure|bridge|set|handle|measure|identify|restructure|manage|define|apply|calculate|correlate|track|analyze|create|transition|align|design|develop|standardize|model|decouple|establish|reset|restrict|quantify|archive|write|audit|operationalize|map|forecast|strip|migrate|capture|qualify|log|prevent|sync|compare|onboard|stop|weight|prove|reduce|recover|enforce|score|detect|route|reconcile|attribute|prove|model|audit)/i.test(
      t
    )
  )
    q = 'How do you ' + t.replace(/\.$/, '') + '?';
  else q = 'How do you ' + t.replace(/\.$/, '') + '?';
  return capitalizeQuestion(q);
}

function slugTag(q) {
  return q.replace(/[^a-z0-9]+/gi, '-').slice(0, 36).toLowerCase();
}

function tagsFor(question, topic) {
  const q = question.toLowerCase();
  const isNil =
    /\bnil\b|name.?image.?likeness|college football|transfer portal|nil collective|d1 football/.test(
      q
    );
  const tags = isNil
    ? ['nil', 'nil-gtm', 'college-football', 'year-2027', 'economy-mode', slugTag(topic)]
    : ['revops', 'revops-google', 'economy-mode', slugTag(topic)];
  if (/\b(fbs|fcs|power 4|group of 5)\b/.test(q)) tags.push('d1-football');
  const schoolMatch = q.match(
    /\b(for|at)\s+([a-z][a-z\s.'()-]+?)\s+(d1|football|nil)/i
  );
  if (schoolMatch) tags.push(slugTag(schoolMatch[2].slice(0, 28)));
  if (!isNil && /\b(salesforce|hubspot|dynamics|pipedrive|zoho)\b/.test(q)) {
    const crm = q.match(/\b(salesforce|hubspot|dynamics 365|pipedrive|zoho)\b/);
    if (crm) tags.push(crm[1].replace(/\s+/g, '-'));
  }
  if (/\b(forecast|pipeline|commission|quota|renewal|churn|attribution)\b/.test(q))
    tags.push('revops-ops');
  if (/\bchief membership|\bchief core\b|\bchief executive forum|\bwomen's leadership network\b/.test(q))
    tags.push('chief-network');
  if (/\bpalantir|foundry|ontology|aip\b/.test(q)) tags.push('palantir');
  if (/\bdata center|colo|colocation|hyperscaler|cross-connect|pue\b|gpu colocation|carrier hotel\b/.test(q))
    tags.push('data-centers');
  if (/\bdark funnel|black-box|shadow pipeline|theater|conspiracy|myth|smoke-and-mirrors\b/.test(q))
    tags.push('revops-signals');
  return tags;
}

async function postOne(num, question, tags) {
  const { answer, source } = await generateAnswer(question, { preferLlm: true });
  const words = countWords(answer);
  if (!isValidEconomyAnswer(answer)) {
    return {
      id: 'q' + num,
      status: 422,
      body: JSON.stringify({
        error: 'answer_quality_gate',
        words,
        minWords: MIN_WORDS,
        hasMermaid: /```mermaid/i.test(answer),
      }),
      question,
      chars: answer.length,
    };
  }
  const id = 'q' + num;
  const labRun =
    source && String(source).startsWith('llm-')
      ? 'economy-mode-1000w-llm'
      : 'economy-cadence-v3';
  const r = await fetch(SITE + '/.netlify/functions/pulse-blob-writer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      key: WRITER_KEY,
      id,
      question,
      answer,
      tags,
      sources: ['Pulse RevOps operational practice'],
      lab_run: labRun,
      defer_images: true,
      skip_images: true,
    }),
  });
  const body = await r.text();
  return { id, status: r.status, body, question, chars: answer.length };
}

async function indexOne(id) {
  const r = await fetch(SITE + '/.netlify/functions/pulse-indexnow-target', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: WRITER_KEY, id }),
  });
  const j = await r.json().catch(() => ({}));
  return { id, status: r.status, pings: j.pings || null };
}

async function seoSpotCheck(id) {
  const url = SITE + '/knowledge/' + id;
  const r = await fetch(url, { headers: { 'User-Agent': 'pulse-cro-economy-tick/1.0' } });
  const body = await r.text();
  const canonical = 'rel="canonical" href="' + url + '"';
  const ok =
    r.status === 200 &&
    /<title[^>]*>/i.test(body) &&
    /<meta\s+name="description"/i.test(body) &&
    body.includes(canonical) &&
    /application\/ld\+json/i.test(body);
  return { id, status: r.status, seoOk: ok };
}

module.exports = {
  WRITER_KEY,
  SITE,
  toQuestion,
  tagsFor,
  generateAnswer,
  postOne,
  indexOne,
  seoSpotCheck,
};
