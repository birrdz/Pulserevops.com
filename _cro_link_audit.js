// _cro_link_audit.js — audit the Kory White CRO ad on EVERY answer page: verify
// each link's TEXT matches its TARGET. Read-only (never writes). Rules:
//   • image card  [![…](…)](url)            -> url must be Calendly
//   • text "…LinkedIn…"                      -> url must be linkedin.com/in/korywhite
//   • text "…CRO Syndicate…"                 -> url must be crosyndicate.com
//   • booking text "Quick Call"/"Book a …call"/"Fractional CRO" -> url must be Calendly
// Flags any mismatch with the entry id. Run: node _cro_link_audit.js [--limit N]
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const arg = (k) => { const a = process.argv.find(x => x.startsWith('--' + k)); if (!a) return null; return a.split('=')[1] || process.argv[process.argv.indexOf(a) + 1]; };

const isCalendly = u => /calendly\.com\/korywhiterevops/i.test(u);
const isLinkedIn = u => /linkedin\.com\/in\/korywhite/i.test(u);
const isSynd     = u => /crosyndicate\.com/i.test(u);

// classify a link by its visible text → expected target predicate + label
function expectFor(text) {
  const t = text.toLowerCase();
  if (/linkedin|see kory|connect on/.test(t)) return { pred: isLinkedIn, want: 'LinkedIn' };
  if (/cro syndicate/.test(t))                return { pred: isSynd,     want: 'crosyndicate.com' };
  if (/quick call|book a .*call|fractional cro|20-minute|20 minute/.test(t)) return { pred: isCalendly, want: 'Calendly' };
  return null; // not a CRO-card link we assert on
}

(async () => {
  const limit = arg('limit') ? parseInt(arg('limit'), 10) : Infinity;
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const ids = idx.entries.map(e => e && e.id).filter(Boolean).slice(0, limit);
  let scanned = 0, withCard = 0, noCard = 0, clean = 0, bad = 0, missing = 0;
  const problems = [];
  const CONC = 8; let cur = 0;
  async function worker() {
    while (cur < ids.length) {
      const id = ids[cur++];
      let e; try { e = await store.get('answers/' + id + '.json', { type: 'json' }); } catch (x) { continue; }
      if (!e || !e.answer) continue;
      scanned++;
      const a = e.answer;
      const hasCard = /usgv65|files\.catbox\.moe|crosyndicate\.com|calendly\.com\/korywhiterevops/i.test(a);
      if (!hasCard) { noCard++; continue; }
      withCard++;
      const issues = [];
      // image card: [![alt](img)](url) — if the CRO ad image is ever a LINKED image,
      // its outer target must be Calendly. Scope to the CRO image (by alt/url signature)
      // so unrelated linked images — e.g. graphics pages whose graphic links to its own
      // /graphics/assets/*.svg — aren't mis-flagged. (Most cards use a PLAIN image with
      // no outer link, so imgM is null and skipped — the CTA links are the real check.)
      // Identify the CRO image by its IMAGE URL only (usgv65/catbox/wsrv proxy) — NOT
      // by alt-text phrases, which also appear in graphics titles like "Fractional CRO
      // org chart" whose graphic links to its own .svg.
      const imgM = a.match(/\[!\[([^\]]*)\]\(([^)]*)\)\]\(([^)]+)\)/);
      if (imgM && /usgv65|catbox\.moe/i.test(imgM[2]) && !isCalendly(imgM[3]))
        issues.push('image->' + imgM[3].slice(0, 60) + ' (want Calendly)');
      // Validate the CRO ad's CTA links ONLY. Scope to the "Reach Kory White" line so
      // unrelated body/resource links ("LinkedIn Sales Solutions", article-title images,
      // etc.) can't be mis-audited. The card template is one line:
      //   **Reach Kory White, Fractional CRO:** [📅 Book a Quick Call](…) · [💼 Kory on
      //   LinkedIn](…) · [🏢 CRO Syndicate](…)
      const ctaLine = a.split(/\r?\n/).find(L => /Reach Kory White/i.test(L)) || '';
      const re = /\[([^\]]+)\]\(([^)]+)\)/g; let m;
      while ((m = re.exec(ctaLine))) {
        const text = m[1], url = m[2];
        if (/^!/.test(text)) continue; // stray image alt
        const exp = expectFor(text);
        if (!exp) continue;
        if (!exp.pred(url)) issues.push('"' + text.slice(0, 28) + '"->' + url.slice(0, 50) + ' (want ' + exp.want + ')');
      }
      if (issues.length) { bad++; problems.push({ id, issues }); }
      else clean++;
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));
  console.log('\n=== CRO LINK AUDIT ===');
  console.log('scanned:', scanned, '| with CRO card:', withCard, '| no card:', noCard, '| CLEAN:', clean, '| MISMATCH:', bad);
  if (problems.length) {
    console.log('\n--- MISMATCHES (first 60) ---');
    problems.slice(0, 60).forEach(p => console.log(p.id, '::', p.issues.join(' | ')));
    fs.writeFileSync('C:/Users/koryj/website/_cro_link_audit_problems.json', JSON.stringify(problems, null, 1));
    console.log('\nfull list -> _cro_link_audit_problems.json (' + problems.length + ' entries)');
  } else {
    console.log('\n✅ All CRO-card links match their text. No mismatches.');
  }
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
