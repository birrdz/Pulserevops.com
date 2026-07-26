// DeepSeek Content Booster adapter for the localhost:7950 multibox manager.
// Args: <id> <directiveFile>. Returns nonzero on failure so the booster can park safely.
'use strict';

const fs = require('fs');
const { dsChat } = require('./_ds_lib');
const { publishContentBody } = require('./new/publish_core');
const { pickGoldTemplate } = require('./_pulse_gold_template_router');
const {
  VISUAL_LOCK_DS_SYSTEM_SNIPPET,
  enforceWriterVisualLock,
} = require('./_visual_lock_law');
const { getStore } = require('@netlify/blobs');

const WD = __dirname;
try {
  for (const line of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (_) {}

function store() {
  return getStore({
    name: 'pulse-machine-library',
    siteID: process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
    token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN,
  });
}

function unwrap(text) {
  let body = String(text || '').trim();
  const fenced = body.match(/^```(?:markdown|md)?\s*\n([\s\S]*?)\n```\s*$/i);
  if (fenced) body = fenced[1].trim();
  return body;
}

function logRoute(id, route, directive) {
  try {
    fs.appendFileSync(
      WD + '/_content_booster_template_runs.jsonl',
      JSON.stringify({
        ts: new Date().toISOString(),
        id,
        engine: 'deepseek',
        template: route.template,
        goldId: route.goldId,
        goldUrl: route.goldUrl,
        reason: route.reason,
        directive: String(directive || '').slice(0, 500),
      }) + '\n',
    );
  } catch (_) {}
}

async function main() {
  const id = String(process.argv[2] || '').replace(/[^a-zA-Z0-9_-]/g, '');
  const directiveFile = process.argv[3] || '';
  if (!id) throw new Error('Usage: node fix_entry.js <id> <directiveFile>');

  let directive = '';
  try { directive = fs.readFileSync(directiveFile, 'utf8'); } catch (_) {}
  if (!directive.trim()) throw new Error('Content Booster directive is empty');

  const blobs = store();
  let blob = null;
  for (let attempt = 0; attempt < 5; attempt++) {
    try { blob = await blobs.get('answers/' + id + '.json', { type: 'json', consistency: 'strong' }); } catch (_) {}
    if (blob) break;
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  if (!blob) throw new Error(id + ' not found in blob store');

  const question = String(blob.question || blob.title || '');
  const originalBody = String(blob.body || blob.answer || '');
  if (!originalBody.trim()) throw new Error(id + ' has no answer body');

  // Classification is locked before the writer is called and never changes mid-run.
  const route = pickGoldTemplate(id, originalBody, question);
  logRoute(id, route, directive);

  const routeLaw = route.template === 'top10'
    ? 'Preserve the existing Top-10 ranking structure exactly. Do not turn it into a Q&A essay.'
    : route.template === 'qa'
      ? 'Preserve the existing Q&A essay structure exactly. Do not add ranking pills or product directives.'
      : 'Preserve the existing document structure exactly.';

  const system = `You are the DeepSeek Content Booster editor for PULSE.
Fix ONLY the failed criteria listed by the operator. Return the COMPLETE revised Markdown body and nothing else.
${routeLaw}
Never invent facts, numbers, prices, vendors, quotes, studies, or source URLs.
Do not remove strong existing material. Do not change the question or title.
${VISUAL_LOCK_DS_SYSTEM_SNIPPET}`;

  const user = `ENTRY ID: ${id}
QUESTION: ${question}
LOCKED TEMPLATE: ${route.template || 'existing'} (${route.reason})

FAILED CRITERIA TO FIX:
${directive}

CURRENT BODY:
${originalBody}`;

  const response = await dsChat([
    { role: 'system', content: system },
    { role: 'user', content: user },
  ], { temperature: 0.2, max_tokens: 12000, retries: 4 });

  let revised = unwrap(response && response.content);
  if (!revised || revised.length < 500) throw new Error('DeepSeek returned an empty or truncated body');
  revised = enforceWriterVisualLock(originalBody, revised, {
    qaGold: route.template === 'qa',
    id,
    title: question,
  });
  if (!revised || revised.length < 500) throw new Error('body failed the visual/template lock');

  await publishContentBody(id, revised);
  console.log(`fix_entry: ${id} DeepSeek surgical fix published (${route.template || 'existing'} template locked)`);
}

main().catch(error => {
  console.error('fix_entry: DeepSeek failed:', error && error.message ? error.message : error);
  process.exitCode = 1;
});
