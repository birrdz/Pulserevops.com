// Quick audit of q224 current state
const { getStore } = require('@netlify/blobs');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
if (!process.env.BLOBS_PAT && process.env.NETLIFY_AUTH_TOKEN) process.env.BLOBS_PAT = process.env.NETLIFY_AUTH_TOKEN;

const ID = 'q224';

function countAnswerWords(s) {
  return String(s || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[#>*_`~|\-=]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .length;
}
function countRawWords(s) { return String(s || '').split(/\s+/).filter(Boolean).length; }

(async () => {
  const TOKEN = process.env.BLOBS_PAT;
  if (!TOKEN) { console.error('Missing BLOBS_PAT'); process.exit(1); }
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOKEN });

  const entry = await store.get('answers/' + ID + '.json', { type: 'json' });
  if (!entry) { console.error(ID, 'entry not found'); process.exit(1); }
  const a = entry.answer || '';

  const idx = await store.get('_index.json', { type: 'json' });
  const row = idx && idx.entries ? idx.entries.find(x => x && x.id === ID) : null;

  console.log('=== q224 CURRENT STATE ===');
  console.log('  question      :', entry.question);
  console.log('  tags          :', Array.isArray(entry.tags) ? entry.tags.join(',') : 'n/a');
  console.log('  quality_score :', entry.quality_score, '| index qs:', row ? row.quality_score : 'n/a');
  console.log('  format_v      :', entry.format_v || null, '| index format_v:', row ? row.format_v : 'n/a');
  console.log('  word_count    :', countAnswerWords(a), '(clean)', countRawWords(a), '(raw)');
  console.log('  char_count    :', a.length);
  console.log('  polish_history:', Array.isArray(entry.polish_history) ? entry.polish_history.length : 0);

  fs.writeFileSync(path.join(__dirname, 'q224_original.md'), a, 'utf8');
  console.log('  written to q224_original.md');

  // Element audit
  const e1_h3 = /(^|\n)###\s+Direct Answer\b/.test(a);
  const e2_h2 = (a.match(/^##\s+/gm) || []).length;
  const e3_numbered = (a.match(/^###\s+\d+\.\s+/gm) || []).length;
  const e4_bullets_bold = (a.match(/^[-*]\s+\*\*[^*]+\*\*/gm) || []).length;
  const e6_inline_links = (a.match(/\]\(https?:\/\//g) || []).length;
  console.log('\n=== ELEMENT AUDIT ===');
  console.log('  e1_h3                   :', e1_h3);
  console.log('  e2_h2_banners           :', e2_h2);
  console.log('  e3_numbered_subsections :', e3_numbered);
  console.log('  e4_bullets_with_bold    :', e4_bullets_bold);
  console.log('  e6_inline_links         :', e6_inline_links);
})().catch(e => { console.error(e); process.exit(1); });
