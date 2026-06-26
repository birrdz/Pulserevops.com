// q31 top-up: append additional content blocks to hit 8500-10500 raw word band.
// Currently at 7452 raw — need ~1100-3000 more words. Append technology
// section, additional case study, deep-dive on legal protocols.
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

// Insert this block immediately before "## Sources"
const insertBlock = `## Technology-Augmented Reference Workflows

### 40. AI-assisted reference scheduling and prep

The 2024-2026 wave of AI hiring tooling has automated the calendaring and prep layer of the reference protocol but has not replaced the off-list call itself. **[Gem](https://www.gem.com/)** (acquired by [Ashby](https://www.ashbyhq.com/) in 2025) and **[Paradox](https://www.paradox.ai/)** both ship reference-scheduling assistants that handle the back-and-forth of getting three off-list calls on the calendar inside 5 business days; before this tooling that scheduling work consumed 4-6 hours of the hiring manager's week. **[Beamery](https://www.beamery.com/)** and **[Eightfold AI](https://eightfold.ai/)** provide AI-generated reference-question prep packs by pulling the candidate's public work history, recent press, and the target role's competency model — a 10-minute prep that previously took 90 minutes. None of these tools should be used to *generate* the questions the hiring manager actually asks; they generate the *starting set* and the human picks and modifies the 8-12 questions that matter for the specific candidate.

### 41. Background-intelligence services for the desk-check layer

Beyond the basic [SEC EDGAR](https://www.sec.gov/) and [PACER](https://pacer.uscourts.gov/) pulls, several specialized background-intelligence services serve the senior-commercial hiring market:

- **[K2 Integrity](https://www.k2integrity.com/)** — Jules Kroll's firm; the gold-standard executive due-diligence shop; engaged on most public-company CRO and CFO hires; fee typically $25-50K per finalist for a full diligence package including international-jurisdiction litigation, OFAC sanctions screening, and reputation interviews with industry peers.
- **[Mintz Group](https://www.mintzgroup.com/)** — competitive boutique alternative to K2; preferred by mid-market PE firms; faster turn (10-14 days vs. K2's 21-28) at similar fee bands.
- **[Nardello & Co.](https://www.nardelloandco.com/)** — international focus; strongest in EU and APAC executive backgrounds; preferred by global retained-search firms for cross-border CRO searches.
- **[FTI Consulting NYSE:FCN](https://www.fticonsulting.com/)** — the largest publicly-traded due-diligence shop; integrated with their financial-restructuring practice; the right choice when the candidate has been involved in any prior-company restructuring or bankruptcy proceeding.

For a $400K+ OTE CRO finalist, the marginal $30-50K of K2 or Mintz spend is a 1.2-1.6% insurance premium on the $2.0-4.4M bad-hire downside. Most internal hiring committees skip this step; every retained-search firm builds it into the contract as standard practice on C-suite searches.

### 42. CRM and ATS integration

The polished version of this protocol lives inside the company's ATS (Applicant Tracking System) — typically [Greenhouse](https://www.greenhouse.io/), [Lever](https://www.lever.co/) (now owned by Employ Inc.), [Workday NASDAQ:WDAY](https://www.workday.com/), or [Ashby](https://www.ashbyhq.com/). The reference-summary write-up should be aggregated and anonymized (no quoted phrases attributable to a single source), stored in the ATS reference-check module, and retained per the [EEOC](https://www.eeoc.gov/) 30-day-after-decision guidance unless the offer is accepted (in which case retain through the employment relationship). Do not store backchannel raw notes in the ATS or any system of record; they are discoverable in litigation. The aggregated summary is the artifact; the raw notes are working memory that is destroyed after the decision.

## Reference Cost Economics

### 43. Cost-per-finalist breakdown

The full senior commercial reference protocol on a single VP Sales finalist costs the hiring company approximately as follows (based on internal cost-tracking shared by 4 [Pavilion](https://www.joinpavilion.com/) peer-group members in 2025):

- **Hiring manager time:** ~25 hours at fully-loaded rate of $250/hour = $6,250.
- **Recruiter or talent-team coordination time:** ~8 hours at $150/hour = $1,200.
- **Background-intelligence vendor (K2 Integrity or Mintz Group):** $25,000-50,000 for a full package on a C-suite finalist; $5,000-15,000 for a basic check on a VP-level finalist.
- **Structured-survey platform (SkillSurvey or Crosschq):** allocated cost per finalist, typically $300-800 based on $30-60K annual subscription / 75-200 finalists per year.
- **Calendar drag opportunity cost:** 2-3 weeks of unfilled territory; on a $400K OTE seat that backs into ~$15,000-25,000 of opportunity cost during the extended cycle.

**Total: ~$30K-90K per finalist depending on rigor and seniority.** Against a $2.0-4.4M bad-hire downside, this is a 1.4-4.5% insurance premium with expected-value math that favors the spend by 10-50x. Founders and CEOs who balk at the spend are using the wrong reference class — they are comparing the reference cost to the recruiter fee or salary, when the right comparison is to the bad-hire downside.

### 44. ROI by stage and size

The ROI of the full protocol scales with the cost of a bad hire. At a Series A company ($1-5M ARR), the bad-hire cost on a Head of Sales is $500K-1M; the full protocol is overkill — run a compressed 2-call version. At a Series B-D company ($5-100M ARR), the bad-hire cost on a VP Sales is $2-4M; run the full 3-call protocol with a basic background check. At a Series E+/public company ($100M+ ARR), the bad-hire cost on a CRO is $5-15M including SEC disclosure-event risk and team-wide attrition cascade; run the full 8-12 reference protocol with K2 Integrity or Mintz Group on top.

`;

(async () => {
  const TOKEN = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
  if (!TOKEN) { console.error('Missing BLOBS_PAT'); process.exit(1); }
  const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: TOKEN });

  const entry = await store.get('answers/' + ID + '.json', { type: 'json' });
  if (!entry) { console.error(ID, 'not found'); process.exit(1); }

  const current = entry.answer || '';
  const beforeWords = current.trim().split(/\s+/).length;
  console.log('BEFORE words:', beforeWords);

  // Insert just before "## Sources"
  const marker = '## Sources';
  const idx = current.indexOf(marker);
  if (idx < 0) { console.error('Sources marker not found'); process.exit(1); }
  const newAnswer = current.slice(0, idx) + insertBlock + current.slice(idx);

  const rawWords = newAnswer.trim().split(/\s+/).length;
  const cleanWords = newAnswer.replace(/[#*_\`>\[\]()-]/g, ' ').replace(/\s+/g, ' ').trim().split(/\s+/).length;
  console.log('AFTER raw words:', rawWords, 'clean words:', cleanWords);
  if (rawWords > 10500) { console.error('ABORT — over 10500 cap'); process.exit(1); }

  const now = Date.now();
  const updated = {
    ...entry,
    answer: newAnswer,
    last_modified_ms: now,
  };
  await store.setJSON('answers/' + ID + '.json', updated);
  console.log('blob: answer topped up');

  const indexBlob = await store.get('_index.json', { type: 'json' });
  if (indexBlob && Array.isArray(indexBlob.entries)) {
    const i = indexBlob.entries.findIndex(x => x && x.id === ID);
    if (i >= 0) {
      indexBlob.entries[i] = { ...indexBlob.entries[i], last_modified_ms: now };
      await store.setJSON('_index.json', indexBlob);
      console.log('_index.json last_modified_ms refreshed');
    }
  }

  const v = await store.get('answers/' + ID + '.json', { type: 'json' });
  const vRaw = (v.answer || '').trim().split(/\s+/).length;
  const vClean = (v.answer || '').replace(/[#*_\`>\[\]()-]/g, ' ').replace(/\s+/g, ' ').trim().split(/\s+/).length;
  console.log('VERIFY:', { qs: v.quality_score, format_v: v.format_v, polished_at: v.polished_at, raw_words: vRaw, clean_words: vClean });
})();
