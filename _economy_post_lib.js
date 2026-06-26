// Shared economy Q&A post helpers — LLM-first answers (1,000+ words), not canned templates.
const https = require('https');
const { fetchLibrary, checkAgainst } = require('./_economy_q_dedupe_check');
const { capitalizeQuestion } = require('./netlify/functions/lib/text-capitalize');
const { generateAnswer, isValidEconomyAnswer } = require('./netlify/functions/lib/economy-answer-generate');
const { countWords } = require('./netlify/functions/lib/economy-answer-quality');

function toQuestion(line) {
  const t = String(line || '').trim();
  let q;
  if (/^how do you /i.test(t)) q = t.endsWith('?') ? t : t + '?';
  else if (/^(what|why|when|where|which|who|can|should|do|does|is|are)\b/i.test(t))
    q = t.endsWith('?') ? t : t + '?';
  else if (
    /^(use|trigger|deploy|train|automate|build|bypass|run|structure|bridge|set|handle|measure|identify|restructure|manage|define|apply|calculate|correlate|track|analyze|create|transition|align|design|develop|standardize|model|decouple|establish|reset|restrict|quantify|archive|write|audit|operationalize|map|forecast|strip|migrate|capture|qualify|log|prevent|sync|compare|onboard|stop|weight|prove|reduce|recover|enforce|score|detect|route|reconcile|attribute)/i.test(
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
  const tags = ['revops', 'economy-mode', slugTag(topic)];
  if (/palantir/i.test(question)) tags.push('palantir');
  if (/\brevops\b/i.test(question) || /\b(salesforce|hubspot|forecast|pipeline|commission)\b/i.test(question)) {
    tags.push('revops-fringe', 'nuance');
  }
  return tags;
}

async function postOne(num, question, tags) {
  let { answer, source } = await generateAnswer(question, { preferLlm: true });
  if (!isValidEconomyAnswer(answer)) {
    return {
      id: 'q' + num,
      status: 422,
      body: JSON.stringify({ error: 'answer_quality_gate', words: countWords(answer) }),
      question,
      chars: answer.length,
    };
  }
  const id = 'q' + num;
  const labRun =
    source && String(source).startsWith('llm-') ? 'economy-mode-1000w-llm' : 'economy-mode-1000w';
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      key: 'pulsemachine-writer-2026',
      id,
      question,
      answer,
      tags,
      sources: ['Pulse RevOps operational practice'],
      lab_run: labRun,
      defer_images: true,
      skip_images: true,
    });
    const req = https.request(
      {
        hostname: 'pulserevops.com',
        path: '/.netlify/functions/pulse-blob-writer',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) },
      },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => resolve({ id, status: res.statusCode, body, question, chars: answer.length }));
      }
    );
    req.on('error', (e) => resolve({ id, status: 0, body: e.message, question, chars: 0 }));
    req.write(payload);
    req.end();
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function indexOne(id) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({ key: 'pulsemachine-writer-2026', id });
    const req = https.request(
      {
        hostname: 'pulserevops.com',
        path: '/.netlify/functions/pulse-indexnow-target',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) },
      },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => resolve({ id, status: res.statusCode }));
      }
    );
    req.on('error', (e) => resolve({ id, status: 0, body: e.message }));
    req.write(payload);
    req.end();
  });
}

module.exports = {
  fetchLibrary,
  checkAgainst,
  toQuestion,
  slugTag,
  tagsFor,
  postOne,
  sleep,
  indexOne,
};
