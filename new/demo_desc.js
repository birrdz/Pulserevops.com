// add factual one-line write-ups to q19024's 10 items, then re-publish with the new per-item layout
'use strict';
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
let claudeChat = null; try { ({ claudeChat } = require('../_claude_chat')); } catch (e) {}
const { publishLive } = require('./publish_core');
const NEW = 'newmrmirkry', QID = 'q19024';
const OUT = WD + '/new/output/' + NEW;

(async () => {
  const entry = JSON.parse(fs.readFileSync(WD + '/new/entries/' + NEW + '.json', 'utf8'));
  const meta = JSON.parse(fs.readFileSync(OUT + '/meta.json', 'utf8'));
  const names = []; for (let i = 0; i < 10; i++) names.push((meta.items && meta.items[i]) || ('#' + (i + 1)));
  const sys = 'You write ONE factual, specific sentence (18-32 words) about each named women\'s leadership network, grounded in what the article says. Output ONLY a JSON array of 10 strings, in order. No numbering, no names repeated at the start — just the descriptive sentence.';
  const user = 'ARTICLE:\n' + String(entry.body || '').slice(0, 7000) + '\n\nWrite one sentence each, in order, for: ' + names.map((n, i) => (i + 1) + '. ' + n).join('  ') + '\n\nReturn the JSON array of 10 sentences.';
  let t = '';
  try { const r = await claudeChat([{ role: 'system', content: sys }, { role: 'user', content: user }], { timeoutMs: 90000 }); t = typeof r === 'string' ? r : (r && (r.content || r.text)) || ''; } catch (e) { console.log('claude err', e.message); }
  let arr = []; try { const mm = t.match(/\[[\s\S]*\]/); if (mm) arr = JSON.parse(mm[0]); } catch (e) {}
  if (arr.length < 10) { console.log('extraction short (' + arr.length + ') — aborting'); process.exit(1); }
  meta.itemDesc = {}; arr.slice(0, 10).forEach((s, i) => { meta.itemDesc[i] = String(s).replace(/^\d+[.)]\s*/, '').trim(); });
  fs.writeFileSync(OUT + '/meta.json', JSON.stringify(meta, null, 1));
  console.log('wrote 10 write-ups. sample:\n  1.', meta.itemDesc[0], '\n  2.', meta.itemDesc[1]);
  const r = await publishLive({ newId: NEW, qid: QID });
  console.log('\n✅ re-published →', r.url);
})().catch(e => { console.log('ERR', e.message); process.exit(1); });
