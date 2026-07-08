// _kw_cluster.js — per-URL SEO keyword-variation cluster (pillar-aware).
// Owner law (2026-06-27): every URL ranks for its TIGHT intent cluster (best /
// top / top-rated / top-ranked / highest-rated + the right buy/visit/pricing
// modifier for the EXACT title noun), NOT 200+ generic boilerplate phrases.
// Exports clusterFor(title, prefix) -> { mode, core, variants[], line }.
//   variants = ~8 deduped phrases (alternateName / future render + capped tags).
//   line     = deploy-free "People also search for:" markdown line ('' if unclean).

const YEAR_RE = /\b(20\d\d)\b/;

// Pillar → ranking modifier style.
const GOODS    = new Set(['er','ca','bt','aq','co','gb','pt','bo']);          // physical products → to buy
const SOFTWARE = new Set(['tl','sw','ai']);                                   // tools → alternatives / pricing
const PLACES   = new Set(['cl','rs','tv','tn','lv','es','ev','ga','nl','dn','sc','hf','wl','sy']); // experiences → near me / to visit
const MEDIA    = new Set(['gm','mv']);                                        // games/movies → ranked / list

const uniq = arr => Array.from(new Set(arr.map(s => s.replace(/\s+/g, ' ').trim()).filter(Boolean)));
const stripTail = s => s
  .replace(/\s+to\s+(buy|collect|own|invest(?:\s+in)?|consider|get|try|use|watch|stream|play|visit|read|stay\s+at)\b.*$/i, '')
  .replace(/\s+(in|of|for)\s+20\d\d\b.*$/i, '')
  .replace(/\s+20\d\d\b.*$/i, '')
  .replace(/[?.!,:;]+$/, '').trim();

function top10Core(title) {
  return stripTail(String(title || '')
    .replace(/^the\s+/i, '')
    .replace(/^(top\s*\d+|the\s+\d+|\d+\s*best|ten\s+best|\d+)\s+(best\s+)?/i, '')
    .replace(/^best\s+/i, ''));
}

function rankingVariants(core, year, prefix) {
  const y = year ? ' ' + year : '';
  const base = [
    `best ${core}${y}`, `top ${core}${y}`, `top rated ${core}${y}`,
    `top ranked ${core}${y}`, `highest rated ${core}${y}`, `${core} reviews${y}`,
  ];
  let extra = [];
  if (GOODS.has(prefix))         extra = [`best ${core} to buy${y}`, `${core} buying guide${y}`];
  else if (SOFTWARE.has(prefix)) extra = [`best ${core} software${y}`, `${core} alternatives${y}`, `${core} pricing${y}`];
  else if (PLACES.has(prefix))   extra = [`best ${core} near me`, `${core} to visit${y}`];
  else if (MEDIA.has(prefix))    extra = [`${core} ranked${y}`, `best ${core} list${y}`];
  else                           extra = [`${core} ranked${y}`, `best ${core} guide${y}`];
  return uniq([...base, ...extra]).slice(0, 8);
}

// Fractional-CRO lead-gen pages (owner's priority) — clean local/vertical cluster.
function croCluster(title) {
  const t = String(title);
  const role = /chief revenue officer/i.test(t) ? 'fractional chief revenue officer' : 'fractional cro';
  // Strip the year tail FIRST, then take the qualifier after the LAST " in "/" for ".
  const base = t.replace(/\b(in|of|for)\s+20\d\d\b.*$/i, '').replace(/\s+20\d\d\b.*$/i, '').replace(/[?.!]+$/, '').trim();
  const low = base.toLowerCase();
  let idx = -1, conn = 'in';
  for (const k of [' in ', ' for ']) { const i = low.lastIndexOf(k); if (i > idx) { idx = i; conn = k.trim(); } }
  let qual = idx >= 0 ? base.slice(idx + conn.length + 2) : '';
  qual = qual.replace(/^[\s,]*(a|an|the)\s+/i, '').replace(/\b(in|for|of)\s*$/i, '').replace(/[?.!,]+$/, '').replace(/\s+/g, ' ').trim();
  const vertical = conn === 'for' || /\b(company|business|startup|firm|saas|org|team)\b/i.test(qual);
  const c = vertical ? 'for' : 'in';
  const v = uniq([
    qual ? `${role} ${qual}` : role,
    qual ? `hire a ${role} ${c} ${qual}` : `hire a ${role}`,
    qual ? `${qual} ${role}` : '',
    `${role} near me`,
    qual ? `${role} cost ${qual}` : `${role} cost`,
  ]).slice(0, 6);
  return { mode: 'cro', core: qual || role, variants: v, line: `**People also search for:** ${v.slice(0, 4).join(' · ')}` };
}

const ACTION_RE = /^(find|hire|build|choose|create|set\s?up|get|make|write|run|track|measure|align|configure|connect|use|start|launch|calculate|design|implement|reduce|improve|manage|automate|score|migrate|integrate|pick|select|negotiate|audit|forecast|map|plan|stop|keep|tie|rank|coach|balance|change)\b/i;

function clusterFor(title, prefix) {
  const t = String(title || '').trim();
  prefix = (prefix || (t.match(/^([a-z]+)\d/i) || [])[1] || '').toLowerCase();
  const ym = t.match(YEAR_RE);
  const year = ym ? ym[1] : '';

  if (/fractional\s+(cro|chief revenue officer)/i.test(t)) return croCluster(t);

  const isTop10 = /\b(\d+\s*best|top\s*\d+|the\s+\d+\b|ten\s+best)\b/i.test(t) || /^best\s+/i.test(t);
  if (isTop10) {
    const core = top10Core(t).toLowerCase();
    if (!core || core.length < 3) return { mode: 'none', core: '', variants: [], line: '' };
    const v = rankingVariants(core, year, prefix);
    return { mode: 'rank', core, variants: v, line: `**People also search for:** ${v.slice(0, 6).join(' · ')}` };
  }

  // Plain Q&A: keep MINIMAL + clean. Strip the question scaffold; only emit a
  // visible line when the remainder is a clean, short phrase (else a keyword line
  // would read like spam and HURT the page). "what is" → definition framing;
  // action verbs → "how to" framing; compound/awkward cores → no line.
  const isWhatIs = /^what\s+(is|are)\b/i.test(t);
  let core = t
    .replace(/^(how\s+(do|can|should|much\s+does|long\s+does|often\s+should|many)|what\s+(is|are|should|does)|where\s+(do|can|to|should)|why\s+(do|should|is|are)|when\s+(should|do|to)|which|who|should\s+(i|a|you)|do\s+(i|you|need)|can\s+(i|you|a))\b/i, '')
    .replace(/\b(in|of|for)\s+20\d\d\b.*$/i, '')
    .replace(/[?.!]+$/, '')
    .replace(/^\s*(a|an|the|i|you|my)\s+/i, '')
    .trim()
    .toLowerCase();
  const words = core ? core.split(/\s+/).length : 0;
  const awkward = !core || words < 2 || words > 7 || /\b(and|why|whether|versus|vs)\b/.test(core) || /\bneed\b/.test(core);
  if (awkward) return { mode: 'qa', core, variants: core ? [core] : [], line: '' };
  if (isWhatIs) {
    const v = uniq([core, `what is ${core}`, `${core} explained`, `${core} definition`]).slice(0, 5);
    return { mode: 'qa', core, variants: v, line: `**People also search for:** ${uniq([`what is ${core}`, `${core} explained`, `${core} definition`]).join(' · ')}` };
  }
  if (!ACTION_RE.test(core)) return { mode: 'qa', core, variants: [core, `${core} guide`], line: '' };
  const v = uniq([core, `how to ${core}`, `${core} guide`, year ? `${core} ${year}` : '']).slice(0, 5);
  return { mode: 'qa', core, variants: v, line: `**People also search for:** ${uniq([core, `how to ${core}`, `${core} guide`]).join(' · ')}` };
}

module.exports = { clusterFor };

if (require.main === module) {
  const samples = [
    ['The 10 Best Vintage Baseball Cards to Collect in 2027', 'co'],
    ['The 10 Best Blenders in 2027', 'er'],
    ['The 10 Best Vector Databases for RAG in 2027', 'ai'],
    ['The 10 Best Beach Clubs in Miami 2027', 'cl'],
    ['The 10 Best CRM Platforms for Small Business in 2027', 'tl'],
    ['Where do I find a fractional CRO in Alabama?', 'tl'],
    ['How much does a fractional CRO cost in Texas in 2027?', 'tl'],
    ['How do I find a fractional CRO for a B2B SaaS company?', 'tl'],
    ['How Do I Build a Sales Rep Scorecard?', 'tl'],
    ['What is an AI gateway and why do enterprises need one?', 'ai'],
  ];
  for (const [s, p] of samples) {
    const c = clusterFor(s, p);
    console.log('\nTITLE:', s, `(${p})`);
    console.log('  mode:', c.mode, '| variants:', c.variants.join(' | '));
    console.log('  line:', c.line || '(none)');
  }
}
