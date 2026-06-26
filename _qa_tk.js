// One-off self-QA: pull live tk bodies from the store and verify gold-format
// markers + lexicon (no "software stack") + no banned phrases. Read-only.
const fs = require('fs');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}
const { getStore } = require('@netlify/blobs');
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
const FENCE = '`' + '`' + '`mermaid';
const BANNED = ['delve', 'tapestry', 'landscape', 'holistic', 'in today', 'ever-evolving', 'synergy', 'paradigm shift', 'game-changer', 'cutting-edge', 'state-of-the-art', 'seamless integration', 'drive growth', 'unlock value', 'unlock potential', 'needless to say', "it's worth noting", "it's important to note"];
const IDS = process.argv.slice(2).length ? process.argv.slice(2) : ['tk0033', 'tk0037', 'tk0040'];

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  for (const id of IDS) {
    const e = await store.get('answers/' + id + '.json', { type: 'json' });
    if (!e) { console.log(id + ': MISSING'); continue; }
    const a = e.answer || '';
    const h2 = (a.match(/^## /gm) || []).length;
    const mer = a.split(FENCE).length - 1;
    const faq = (a.match(/\?\*\*/g) || []).length;
    const src = (a.match(/^- /gm) || []).length;
    const bold = Math.floor((a.match(/\*\*/g) || []).length / 2);
    const sw = (a.match(/software stack/gi) || []).length;
    const ts = (a.match(/tech stack/gi) || []).length;
    const banned = BANNED.filter(b => a.toLowerCase().includes(b));
    const words = a.split(/\s+/).length;
    console.log(`${id}: H2=${h2} mermaid=${mer} faqQ=${faq} dashLines=${src} bold=${bold} words=${words} | techStack=${ts} softwareStack=${sw} | banned=${banned.length ? banned.join(',') : 'none'}`);
  }
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
