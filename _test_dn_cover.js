// Test cover generation for dn0119 — reports engine used, never logs API key.
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  for (const l of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const {
  ensureImagenProbed,
  imagenStatus,
  geminiCoverFor,
} = require('./netlify/functions/lib/gemini-image-lib');

const id = process.argv[2] || 'dn0119';
const title = process.argv[3] || 'Top 10 Restaurants in Austin in 2027';

(async () => {
  console.log('id', id);
  console.log('title', title);
  await ensureImagenProbed();
  console.log('imagenStatus', imagenStatus());
  console.log('generating cover...');
  const url = await geminiCoverFor(title, id);
  if (url) {
    console.log('OK url', url);
    console.log('engine', imagenStatus().ok ? 'gemini-image' : 'pollinations-fallback');
  } else {
    console.log('FAIL no image URL');
    process.exit(1);
  }
})().catch((e) => {
  console.error('ERROR', e.message || e);
  process.exit(1);
});
