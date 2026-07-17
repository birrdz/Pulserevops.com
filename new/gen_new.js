// new/gen_new.js — generate ONE fresh NEW Q&A (net-new q-id) from a rotating theme, dedup-checked.
// Used by tl_runner's "new" slot so the feed mixes new pages in with the old fixers.
'use strict';
const fs = require('fs');
const { spawnSync } = require('child_process');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
let claudeChat = null; try { ({ claudeChat } = require('../_claude_chat')); } catch (e) {}
let dsChat = null; try { ({ dsChat } = require('../_ds_lib')); } catch (e) {}
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN });
const STATE = WD + '/new/_gen_new_state.json';

const THEMES = [
  'revenue operations (RevOps) process and systems', 'sales leadership and management', 'go-to-market (GTM) strategy',
  'customer success and retention', 'sales forecasting and pipeline', 'B2B demand generation and marketing ops',
  'sales compensation and quota design', 'scaling a startup sales team', 'deal strategy and negotiation',
  'sales hiring, onboarding, and enablement', 'CRM and sales tech stack', 'board reporting and revenue metrics',
];
const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 3 && !['2027', 'what', 'how', 'the', 'you', 'your', 'that', 'with', 'does', 'and'].includes(w));

async function draftTitles(theme) {
  const sys = 'You output ONLY 4 plain Q&A question titles, one per line — no numbering, no quotes. Each a natural "How do you… in 2027?" / "What… in 2027?" question a revenue leader would search.';
  const user = 'Draft 4 DISTINCT, specific, practical Q&A questions about: "' + theme + '". Each ends in "2027?". One per line.';
  let t = '';
  try { if (claudeChat) { const r = await claudeChat([{ role: 'system', content: sys }, { role: 'user', content: user }], { timeoutMs: 60000 }); t = typeof r === 'string' ? r : (r && (r.content || r.text)) || ''; } } catch (e) {}
  if (!t && dsChat) { try { const r = await dsChat([{ role: 'system', content: sys }, { role: 'user', content: user }], { max_tokens: 300, temperature: 1.0 }); t = (r && r.content) || ''; } catch (e) {} }
  return String(t || '').split('\n').map(l => l.replace(/^\s*\d+[).:]?\s*/, '').replace(/^["'`-]\s*/, '').trim()).filter(l => /\?\s*$/.test(l) && l.length > 15);
}

(async () => {
  const idx = await store.get('_index.json', { type: 'json' });
  const existing = idx.entries.map(e => new Set(norm(e.question)));
  const sim = q => { const a = new Set(norm(q)); let b = 0; for (const s of existing) { let i = 0; a.forEach(t => { if (s.has(t)) i++; }); const j = i / (a.size + s.size - i || 1); if (j > b) b = j; } return b; };
  let st = { i: 0 }; try { st = JSON.parse(fs.readFileSync(STATE, 'utf8')); } catch (e) {}
  const theme = THEMES[st.i % THEMES.length]; st.i = (st.i || 0) + 1; try { fs.writeFileSync(STATE, JSON.stringify(st)); } catch (e) {}
  const titles = await draftTitles(theme);
  const fresh = titles.find(t => sim(t) < 0.7);
  if (!fresh) { console.log('no fresh title for theme:', theme); process.exit(1); }
  console.log('▶ NEW:', fresh);
  const r = spawnSync(process.execPath, [WD + '/new/generate.js', fresh], { cwd: WD, encoding: 'utf8', timeout: 600000, env: Object.assign({}, process.env, { GEN_FORCE_FORMAT: 'essay' }) });
  const out = (r.stdout || '') + (r.stderr || '');
  console.log(/rebuilt →|3\/3 —|text not at 3/.test(out) ? 'rebuilt → new page' : 'issue');
})().catch(e => { console.log('ERR', e.message); process.exit(1); });
