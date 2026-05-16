// Inject an animated SVG comic into a single library entry's answer field
// (inside a ```svg fence) and push the updated entry back to the blob.

const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOKEN = process.env.BLOBS_PAT;
if (!TOKEN) { console.error('BLOBS_PAT required'); process.exit(1); }

const ENTRY_ID = process.argv[2] || 'q1843';

// Pull the SVG from the test HTML file
const testHtml = fs.readFileSync(path.join(__dirname, 'test-svg-comic.html'), 'utf8');
const svgMatch = testHtml.match(/<svg viewBox[\s\S]*?<\/svg>/);
if (!svgMatch) { console.error('No SVG found in test-svg-comic.html'); process.exit(1); }
const svg = svgMatch[0];
console.log('Pulled SVG:', svg.length, 'chars');

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: TOKEN });
  const entry = await store.get('answers/' + ENTRY_ID + '.json', { type: 'json' });
  if (!entry) { console.error('entry not found in blob:', ENTRY_ID); process.exit(1); }
  console.log('Loaded entry:', ENTRY_ID, '— answer is', entry.answer.length, 'chars');

  // Inject the SVG fence right after "## Direct Answer" paragraph,
  // before the first sub-section (## The X ...). If already injected, skip.
  if (entry.answer.includes('```svg')) {
    console.log('Entry already has svg fence; replacing existing');
    entry.answer = entry.answer.replace(/```svg\n[\s\S]*?\n```/, '```svg\n' + svg + '\n```');
  } else {
    // Find the first ## sub-section after Direct Answer and insert before it
    const m = entry.answer.match(/^(## Direct Answer\n[\s\S]*?)\n(##\s+)/m);
    if (m) {
      const before = m[1];
      const rest = entry.answer.slice(before.length);
      entry.answer = before + '\n\n```svg\n' + svg + '\n```\n' + rest;
    } else {
      // Fallback: append at end before Tags
      entry.answer = entry.answer.replace(/(\n## Tags\n)/, '\n```svg\n' + svg + '\n```\n$1');
    }
  }

  await store.setJSON('answers/' + ENTRY_ID + '.json', entry);
  console.log('Pushed updated entry. New answer length:', entry.answer.length, 'chars');
  console.log('Live URL: https://pulserevops.com/knowledge/' + ENTRY_ID);
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
