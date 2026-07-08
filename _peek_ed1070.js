const fs = require('fs');
const path = require('path');
const WD = path.join(__dirname);
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const { isTop10Body } = require('./netlify/functions/lib/ensure-entry-images');
const { KORY_CRO_IMG, countFluxJobs } = require('./_img_flux_lib');

const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
});

const id = process.argv[2] || 'ed1070';
const MEDIA_SKIP = /^#{2,3}\s+(FAQ|Sources|References|Related on PULSE)/i;

(async () => {
  const blob = await store.get('answers/' + id + '.json', { type: 'json' });
  const body = (blob && blob.answer) || '';
  const imgs = [...body.matchAll(/!\[([^\]]*)\]\(([^)\s]+)\)/g)];
  const lines = body.split('\n');
  const sections = [];
  for (let i = 0; i < lines.length; i++) {
    if (/^#{2,3}\s+\S/.test(lines[i]) && !MEDIA_SKIP.test(lines[i])) {
      let hasImg = false;
      for (let j = i + 1; j < lines.length; j++) {
        if (/^#{2,3}\s/.test(lines[j])) break;
        if (/!\[/.test(lines[j])) { hasImg = true; break; }
      }
      sections.push({ line: i + 1, h: lines[i].slice(0, 70), hasImg });
    }
  }
  const plan = countFluxJobs(id, body, 'flux');
  console.log('id:', id);
  console.log('top10:', isTop10Body(body));
  console.log('markdown_images:', imgs.length);
  imgs.forEach((m, i) => console.log('  #' + (i + 1), m[2]));
  console.log('sections:', sections.length);
  sections.forEach(s => console.log('  L' + s.line, s.hasImg ? 'IMG' : 'NO ', s.h));
  console.log('sections_missing_img:', sections.filter(s => !s.hasImg).length);
  console.log('kory_at_slot2:', !!(imgs[1] && imgs[1][2] === KORY_CRO_IMG));
  console.log('flux_plan:', JSON.stringify(plan));

  // Simulate mediaOk from scrub server
  const MEDIA_MIN = 3, MEDIA_MAX = 10;
  const { KORY_CRO_IMG } = require('./_img_flux_lib');
  const countMedia = imgs.filter(m => m[2] !== KORY_CRO_IMG).length;
  const mediaCountOk = countMedia >= MEDIA_MIN && countMedia <= MEDIA_MAX;
  const sectionsOk = sections.every(s => s.hasImg);
  console.log('counted_media_images (excl CRO):', countMedia);
  console.log('total_markdown_including_cro:', imgs.length);
  console.log('media_count_ok:', mediaCountOk);
  console.log('all_sections_have_img:', sectionsOk);
  console.log('would_pass_media3to10:', mediaCountOk && sectionsOk && !!(imgs[1] && imgs[1][2] === KORY_CRO_IMG));
})();
