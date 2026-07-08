// One-shot: repair aq1160 live pollinations URLs → self-hosted /assets/qa/ alternates.
process.env.POLLINATOR_FREQ_MS = process.env.POLLINATOR_FREQ_MS || '20000';
process.env.DDG_THROTTLE_COOLDOWN_MS = process.env.DDG_THROTTLE_COOLDOWN_MS || '20000';
process.env.DDG_DELAY_MS = process.env.DDG_DELAY_MS || '20000';
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const ID = 'aq1160';
const RECIPIENT = 'koryjordanwhite@gmail.com';

for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const { getStore } = require('@netlify/blobs');
const { repairBrokenQaImages, fillEntryMissingImages } = require('./_ddg_facecard_lib');
const { saveAqQaEntry } = require('./_aq_qa_gold_fix_lib');
const { pillarUrl } = require('./_ranking_list_rebuild_lib');
const { prepareEntryForPublish } = require('./_write_lib');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');

function env(k) {
  try {
    const m = fs.readFileSync(WD + '/.env.local', 'utf8').match(new RegExp('^' + k + '=(.+)$', 'm'));
    return m ? m[1].trim() : '';
  } catch (e) { return ''; }
}

async function resendKey() {
  let k = env('resendapikey') || env('RESEND_API_KEY');
  if (k) return k;
  const TOKEN = env('NETLIFY_AUTH_TOKEN');
  const s = await fetch('https://api.netlify.com/api/v1/sites/' + SITE, { headers: { Authorization: 'Bearer ' + TOKEN } }).then(r => r.json());
  const acct = s.account_slug || s.account_name;
  const r = await fetch('https://api.netlify.com/api/v1/accounts/' + acct + '/env/resendapikey?site_id=' + SITE, { headers: { Authorization: 'Bearer ' + TOKEN } });
  if (!r.ok) throw new Error('netlify env ' + r.status);
  const j = await r.json();
  const val = (j.values || []).find(v => v.context === 'all' || v.context === 'production') || (j.values || [])[0];
  k = val && val.value;
  if (!k) throw new Error('no resend key');
  return k;
}

(async () => {
  const store = getStore({
    name: 'pulse-machine-library',
    siteID: SITE,
    token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
  });
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const existing = await store.get('answers/' + ID + '.json', { type: 'json' });
  if (!existing || !existing.answer) throw new Error('aq1160 blob missing');

  const title = existing.question || 'Best way to cycle a new tank in 2027';
  console.log('Before:', (existing.answer.match(/!\[[^\]]*\]\(([^)]+)\)/g) || []).join('\n'));

  let body = existing.answer;
  const repaired = await repairBrokenQaImages(ID, title, body, {
    alternateSources: true,
    upgradeMode: true,
    pollinatorPrefer: true,
    allowTopicalReuse: true,
    onProgress: p => console.log('repair', JSON.stringify(p)),
  });
  body = repaired.body;
  console.log('Repaired slots:', repaired.fixed, '/', repaired.slots);

  const filled = await fillEntryMissingImages(ID, title, body, {
    upgradeMode: true,
    alternateSources: true,
    pollinatorPrefer: true,
    allowTopicalReuse: true,
  });
  body = filled.body || body;

  const imgs = [...body.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map(m => m[1]);
  const polLeft = imgs.filter(u => /pollinations/i.test(u));
  if (polLeft.length) throw new Error('Still has pollinations URLs: ' + polLeft.length);

  const saved = await saveAqQaEntry(store, idx, ID, title, body, existing);
  await store.setJSON('_index.json', idx);

  console.log('After URLs:', imgs);
  console.log('Saved grade=', saved.grade, 'imgs=', saved.imgs);

  const url = pillarUrl(ID);
  const key = await resendKey();
  const html = '<div style="font-family:system-ui,Arial,sans-serif;font-size:15px;line-height:1.6">' +
    '<p><b>Fixed aq1160</b> — replaced live pollinations.ai URLs with self-hosted <code>/assets/qa/</code> images.</p>' +
    '<p>Enabled <b>DDG ↔ Pollinator alternate</b> for AQ Q&A image repair + gold rebuild path.</p>' +
    '<p><a href="' + url + '">' + url + '</a></p>' +
    '<p>Images: ' + imgs.map(u => u.replace(/^\/assets\/qa\//, '')).join(', ') + '</p></div>';
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'PULSE Engine <onboarding@resend.dev>',
      to: [RECIPIENT],
      subject: 'Fixed aq1160 + enabled DDG/Pollinator alternate for Q&A images',
      html,
    }),
  });
  const txt = await r.text();
  if (!r.ok) console.warn('Email failed:', r.status, txt.slice(0, 120));
  else console.log('Email sent');
})().catch(e => { console.error(e); process.exit(1); });
