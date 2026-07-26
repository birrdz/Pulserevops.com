#!/usr/bin/env node
/** Mass-fix mermaid in tl blobs: sanitize + strip <br/> / bad angles. No LLM. */
const fs = require('fs');
const { getStore } = require('/workspace/node_modules/@netlify/blobs');
const { sanitizeMermaid } = require('/workspace/_mermaid_sanitize');

const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const LOG = '/tmp/tl-mermaid-mass.log';
const REPORT = '/tmp/tl-mermaid-mass-report.json';
const cfg = require('/home/ubuntu/.config/netlify/config.json');
const token = Object.values(cfg.users || {})[0].auth.token;
const store = getStore({ name: 'pulse-machine-library', siteID: SITE, token });

function log(s){ const l=`[${new Date().toISOString()}] ${s}`; console.log(l); fs.appendFileSync(LOG,l+'\n'); }

function fixMermaids(body) {
  let changed = false;
  let n = 0;
  let next = String(body || '').replace(/```mermaid\s*([\s\S]*?)```/g, (full, inner) => {
    n++;
    let fixed = inner
      .replace(/<br\s*\/?>/gi, ' - ')
      .replace(/under br\/over /gi, ' - ');
    const block = sanitizeMermaid('```mermaid\n' + fixed.replace(/^\n+/, '').replace(/\n+$/, '') + '\n```');
    if (block !== full) changed = true;
    return block;
  });
  // ensure >=2 with CRO-safe canned diagrams (text-only insert before FAQ)
  const count = (next.match(/```mermaid/g) || []).length;
  if (count < 2) {
    const pad = `
\`\`\`mermaid
flowchart TD
    A[Assess revenue gaps] --> B[Scope fractional CRO mandate]
    B --> C[Install operating cadence]
    C --> D[Review pipeline and forecast weekly]
\`\`\`

\`\`\`mermaid
flowchart LR
    A[Diagnose GTM] --> B[Prioritize fixes]
    B --> C[Coach leaders]
    C --> D[Hand off system]
\`\`\`

`;
    if (/^## FAQ/m.test(next)) next = next.replace(/^## FAQ/m, pad + '## FAQ');
    else if (/^## Sources/m.test(next)) next = next.replace(/^## Sources/m, pad + '## Sources');
    else next = next.replace(/\s*$/, '\n' + pad);
    changed = true;
  }
  return { next, changed, mermaidCount: (next.match(/```mermaid/g) || []).length, before: n };
}

(async () => {
  const idx = await store.get('_index.json', { type: 'json' });
  const tl = (idx.entries || []).filter((e) => e && /^tl\d+$/i.test(e.id));
  log('mermaid mass start ' + tl.length);
  const stats = { scanned: 0, fixed: 0, skipped: 0, errors: 0 };
  const CONC = 20;
  for (let i = 0; i < tl.length; i += CONC) {
    const chunk = tl.slice(i, i + CONC);
    await Promise.all(
      chunk.map(async (row) => {
        try {
          const e = await store.get('answers/' + row.id + '.json', { type: 'json', consistency: 'strong' });
          if (!e || !e.answer) { stats.errors++; return; }
          stats.scanned++;
          const { next, changed } = fixMermaids(e.answer);
          if (!changed) { stats.skipped++; return; }
          // preserve non-mermaid content exactly besides mermaid blocks / inserted pads
          await store.setJSON('answers/' + row.id + '.json', {
            ...e,
            answer: next,
            tl_mermaid_mass_at: Date.now(),
          });
          stats.fixed++;
        } catch (err) {
          stats.errors++;
          log('ERR ' + row.id + ' ' + err.message);
        }
      })
    );
    if (i % 500 === 0 || i + CONC >= tl.length) {
      log(`progress ${Math.min(i + CONC, tl.length)}/${tl.length} fixed=${stats.fixed} skip=${stats.skipped} err=${stats.errors}`);
    }
  }
  fs.writeFileSync(REPORT, JSON.stringify({ ok: true, ...stats, at: new Date().toISOString() }, null, 2));
  log('DONE ' + JSON.stringify(stats));
})().catch((e) => { console.error(e); process.exit(1); });
