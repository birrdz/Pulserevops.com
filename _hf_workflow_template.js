export const meta = {
  name: 'hsfootball-sprint-50',
  description: 'Write & publish 50 HS Football Recruiting Top-10 entries (hf0001-hf0050)',
  phases: [{ title: 'Write', detail: 'one writer agent per entry, schema-validated, 12/12 gate' }],
}

// __QUEUE__

const SCHEMA = {
  type: 'object',
  required: ['id', 'ok', 'score', 'words'],
  properties: {
    id: { type: 'string' }, ok: { type: 'boolean' }, score: { type: 'integer' },
    words: { type: 'integer' }, note: { type: 'string' },
  },
}

function promptFor(item) {
  return `You are a meticulous recruiting writer for "Pulse HS Football Recruiting", a site that helps high-school football players GET RECRUITED. Write ONE deeply-researched Top-10 ranking guide and PUBLISH it.

ENTRY ID: ${item.id}
EXACT TITLE (use verbatim): ${item.title}
TOPIC SLUG: ${item.slug}

EDITORIAL ANGLE (stay heavy on these): "WHO to use to get recruited" (real recruiting services, websites, apps, camps, combines, 7-on-7s, trainers, evaluators, NIL platforms) and "HOW to get recruited" (concrete, actionable steps a player/parent can do). Be practical and specific — this is a how-to-get-recruited resource, not entertainment.

Decide which the title calls for:
- "WHO to use" list (services/camps/people) => the 10 picks are REAL named services/camps/companies (e.g. 247Sports, Rivals, On3, Hudl, NCSA, SportsRecruits, FieldLevel, BeRecruited, Nike Football camps, Under Armour camps, Rivals Camp Series, The Opening, trainers/orgs). Each @@PRODUCT site = that service's real homepage or its Wikipedia page.
- "HOW to get recruited / steps / ways / mistakes" list => the 10 picks are concrete ACTIONS/STEPS (e.g. "Build a Hudl highlight reel", "Email position coaches with film + transcript"). Each @@PRODUCT line still present; site = a relevant real tool/resource (Hudl, NCAA Eligibility Center, an authoritative recruiting guide).

Write a Markdown body to  C:/Users/koryj/${item.id}_answer.md  (Write tool, absolute path) following THIS EXACT locked template, then publish.

=== TEMPLATE (Markdown) ===
# ${item.title}

<90-130 word intro: who this helps (athlete year/level), why it matters for getting recruited, how you judged the field. Bold 4-6 key terms.>

## Direct Answer
<2-4 sentences. Name the #1 BEST OVERALL pick in **bold** (service name or the single most important step) and the BEST VALUE pick in **bold** (best free/cheap option or highest-ROI easy move). One caution.>

## How We Ranked
- **<Factor>** — <e.g. coach adoption, exposure, cost, ease, credibility, results>
(5 weighting bullets, each factor bolded)

## 1. <Service or Step Name> 🏆 BEST OVERALL
@@PRODUCT name="<Service or Step Name>" site="https://en.wikipedia.org/wiki/<Page>"   (for services use the real homepage URL if well known)
<Why it wins, 2 short paragraphs with **bold** specifics (cost, who it is for, what to do).>
- **Cost:** <free / $ / $$ — real ballpark>
- **Best for:** <position/year/level>
- **Pros:** <...>
- **Cons:** <...>
**Verdict:** <one line>

## 2. <Service or Step Name> 💎 BEST VALUE
@@PRODUCT name="<...>" site="..."
<same shape>

## 3. ... through ## 10.  (ten numbered picks; sections 3-10 have NO pill)
Each numbered section MUST have its own @@PRODUCT line, **Cost:**, **Best for:**, **Pros:**, **Cons:**, **Verdict:**.

## How to Choose
\`\`\`mermaid
flowchart TD
  A[Start] --> B{Year / level?}
  B -->|Underclassman / unknown| C[Do ...]
  B -->|Junior-Senior / has film| D[Do ...]
\`\`\`

## What to Look For
<2-4 practical tips: red flags (pay-to-play scams), what real exposure looks like, contacting coaches the right way.>

## FAQ
**<Question 1 ending in ?>**
<answer>

**<Question 2 ending in ?>**
<answer>

**<Question 3 ending in ?>**
<answer>

**<Question 4 ending in ?>**
<answer>

## Bottom Line
<2-4 sentences naming the overall + value picks again and the single next action.>

## Sources
- <real org/site, e.g. 247Sports, Rivals, On3, Hudl, NCSA, NCAA Eligibility Center, USA Football, AFCA>
- <5+ dash bullets total>

*Keywords: ${item.title} — review, reviews, rating, comparison, best of 2027.*
=== END TEMPLATE ===

HARD REQUIREMENTS (grader REJECTS below 10/12):
- REAL named services/camps/people for "who" lists; concrete real actions for "how" lists. No invented companies. Accurate, current (2026/2027) info — costs, who runs it, how it works.
- Length: at least 2,100 words of plain prose (aim 2,200-2,400). Add real, specific detail.
- EXACTLY one "🏆 BEST OVERALL" (section 1) and one "💎 BEST VALUE" (section 2). Exactly 10 numbered "## N." sections.
- Exactly one \`\`\`mermaid block.
- FAQ: at least 4 bold questions ending in ? like **Question?**
- Sources: at least 5 dash-bullet items under ## Sources.
- At least 25 bold (**...**) spans; at least 3 distinct named services/orgs.
- NEVER use these banned words/phrases: delve, tapestry, landscape, holistic, "in today's", ever-evolving, synergy/synergies/synergistic, paradigm shift, game-changer, cutting-edge, state-of-the-art, "seamless integration", "drive growth", "unlock value", "unlock potential", "needless to say", "it's worth noting", "it's important to note".
- Do NOT put a literal < or > in prose (only inside the mermaid block). Write "under"/"over".
- Do NOT add a cover image; images are backfilled later.

PUBLISH STEP (Bash tool):
  node C:/Users/koryj/website/_write_hf.js ${item.id} "${item.title}" ${item.slug}

SUCCESS = stdout JSON has "ok":true . An 11/12 NOTE is fine. If "REJECTED ... scored N/12", FIX the missing criteria (usually word_count_floor — reach 2,200+ words — or pills/sources/bold), overwrite the same file, re-run. Retry up to 2 times.

Return ONLY: {id:"${item.id}", ok:<bool>, score:<int>, words:<int>, note:<short status>}.`
}

phase('Write')
const results = await pipeline(
  QUEUE,
  item => agent(promptFor(item), { label: item.id, phase: 'Write', schema: SCHEMA })
)
const done = results.filter(Boolean)
const ok = done.filter(r => r.ok)
const failed = done.filter(r => !r.ok)
const missing = QUEUE.filter(q => !done.find(r => r.id === q.id))
log(`DONE: ${ok.length}/${QUEUE.length} published. failed=${failed.length} missing=${missing.length}`)
return { published: ok.length, total: QUEUE.length, failed: failed.map(r => ({ id: r.id, note: r.note })), missing: missing.map(q => q.id) }
