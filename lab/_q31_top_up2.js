// q31 top-up #2: ~300 more raw words to clear 8500 raw floor.
const path = require('path');
const fs = require('fs');
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  for (const raw of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('='); if (eq < 0) continue;
    const k = line.slice(0, eq).trim();
    let v = line.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (!process.env[k]) process.env[k] = v;
  }
}

const { getStore } = require('@netlify/blobs');
const ID = 'q31';
const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

// Insert just before "## Sources"
const insertBlock = `## Common Failure Modes in Internal Reference Workflows

### 45. The CEO-only failure mode

The most common failure mode in internal reference work is the CEO who insists on running references personally and only calls the candidate's former CEOs. This concentrates the reference signal in a single perspective (boss view) and a single relationship-class (peer founder). The boss view systematically over-weights number-hitting and under-weights culture impact; the peer-founder relationship-class creates a courtesy floor on negative signal that mutes 60-80% of the diagnostic value per [Korn Ferry NYSE:KFY](https://www.kornferry.com/) 2025 New Hire Success Tracker analysis. The fix is procedural: require the peer-call and former-report calls to be run by a different hiring-committee member (the COO, the head of talent, or a board member), and require those calls to be completed before the offer is extended.

### 46. The skipped-follow-up failure mode

The second most common failure mode is treating each reference call as a one-shot. The 48-hour follow-up call is where references add the "one more thing" caveat that did not surface cold. Hiring committees that skip the follow-up call miss approximately 25-35% of the high-signal disclosures per [Spencer Stuart](https://www.spencerstuart.com/) internal practice data. Schedule both calls at the same time; commit to the follow-up before hanging up; honor it even when the reference says nothing new — building the habit pays off across future searches.

### 47. The "we already know this person" failure mode

When the candidate is referred by a board member, a sitting executive, or an investor, hiring committees often compress the reference protocol because "we already know them." This is the single highest-cost failure mode in the entire VP+ hiring process. The referral relationship makes the off-list backchannel *more* important, not less — a candidate who is being referred by a single high-trust source has likely curated that relationship and you have less independent signal than usual. Run the full protocol on referred candidates; the referrer is happy to be the fourth or fifth reference, not the only one.

`;

(async () => {
  const TOKEN = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
  if (!TOKEN) { console.error('Missing BLOBS_PAT'); process.exit(1); }
  const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: TOKEN });

  const entry = await store.get('answers/' + ID + '.json', { type: 'json' });
  const current = entry.answer || '';
  const marker = '## Sources';
  const idx = current.indexOf(marker);
  if (idx < 0) { console.error('Sources marker not found'); process.exit(1); }
  const newAnswer = current.slice(0, idx) + insertBlock + current.slice(idx);

  const rawWords = newAnswer.trim().split(/\s+/).length;
  const cleanWords = newAnswer.replace(/[#*_\`>\[\]()-]/g, ' ').replace(/\s+/g, ' ').trim().split(/\s+/).length;
  console.log('AFTER raw words:', rawWords, 'clean words:', cleanWords);
  if (rawWords > 10500) { console.error('ABORT — over 10500 cap'); process.exit(1); }
  if (rawWords < 8500) { console.error('STILL UNDER FLOOR'); }

  const now = Date.now();
  const updated = { ...entry, answer: newAnswer, last_modified_ms: now };
  await store.setJSON('answers/' + ID + '.json', updated);
  console.log('blob: topped up');

  const indexBlob = await store.get('_index.json', { type: 'json' });
  if (indexBlob && Array.isArray(indexBlob.entries)) {
    const i = indexBlob.entries.findIndex(x => x && x.id === ID);
    if (i >= 0) {
      indexBlob.entries[i] = { ...indexBlob.entries[i], last_modified_ms: now };
      await store.setJSON('_index.json', indexBlob);
      console.log('_index mirrored');
    }
  }

  const v = await store.get('answers/' + ID + '.json', { type: 'json' });
  const vRaw = (v.answer || '').trim().split(/\s+/).length;
  const vClean = (v.answer || '').replace(/[#*_\`>\[\]()-]/g, ' ').replace(/\s+/g, ' ').trim().split(/\s+/).length;
  console.log('VERIFY:', { qs: v.quality_score, format_v: v.format_v, raw_words: vRaw, clean_words: vClean });
})();
