export const meta = {
  name: 'boats-sprint-200',
  description: 'Write & publish 200 new Boats pillar Top-10 entries (bt0201-bt0400)',
  phases: [{ title: 'Write', detail: 'one writer agent per entry, schema-validated, 12/12 gate' }],
}

// __QUEUE__

const SCHEMA = {
  type: 'object',
  required: ['id', 'ok', 'score', 'words'],
  properties: {
    id: { type: 'string' },
    ok: { type: 'boolean' },
    score: { type: 'integer' },
    words: { type: 'integer' },
    note: { type: 'string' },
  },
}

function promptFor(item) {
  return `You are a meticulous boating writer for "Pulse Boats", a boat-buying answer site. Write ONE deeply-researched Top-10 ranking guide and PUBLISH it.

ENTRY ID: ${item.id}
EXACT TITLE (use verbatim): ${item.title}
TOPIC SLUG: ${item.slug}

Write a Markdown body to the file  C:/Users/koryj/${item.id}_answer.md  (use the Write tool, absolute path) following THIS EXACT locked template. Then publish it.

=== TEMPLATE (Markdown) ===
# ${item.title}

<One 90-130 word intro paragraph framing the segment, who it is for, and how you judged the field. Bold 4-6 key terms.>

## Direct Answer
<2-4 sentences. Name the #1 BEST OVERALL pick in **bold** with its approximate price in **bold**, and the BEST VALUE pick in **bold** with its price. One sentence of caution/criteria.>

## How We Ranked
- **<Factor>** — <why it matters>
(5 weighting bullets, each factor bolded)

## 1. <Year(s) Brand Model> 🏆 BEST OVERALL
@@PRODUCT name="<Year Brand Model>" site="https://en.wikipedia.org/wiki/<Brand_Page>"
<Why it wins, 2 short paragraphs with **bold** specs/prices.>
- **Price:** ~$<amount>
- **Pros:** <...>
- **Cons:** <...>
**Verdict:** <one line>

## 2. <Year(s) Brand Model> 💎 BEST VALUE
@@PRODUCT name="<Year Brand Model>" site="https://en.wikipedia.org/wiki/<Brand_Page>"
<same shape>

## 3. ... through ## 10.  (ten numbered picks total; sections 3-10 have NO pill)
Each numbered section MUST have its own @@PRODUCT line, a **Price:**, **Pros:**, **Cons:**, **Verdict:** set.

## How to Choose
\`\`\`mermaid
flowchart TD
  A[Start] --> B{Budget?}
  B -->|Under X| C[Pick ...]
  B -->|Higher| D[Pick ...]
\`\`\`

## What to Look For
<2-4 buyer-tip bullets or a short paragraph (hull, engine hours, trailer, survey, etc.)>

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
<2-4 sentence wrap naming the overall + value picks again.>

## Sources
- <real org/publication, e.g. Boat Trader, Discover Boating, NMMA, BoatUS, Yamaha, Mercury Marine, Boating Magazine, NADA Guides>
- <5+ dash bullets total>

*Keywords: ${item.title} — review, reviews, rating, comparison, best of 2027.*
=== END TEMPLATE ===

HARD REQUIREMENTS (a writer-time grader will REJECT below 10/12):
- REAL boats/brands only with realistic approximate prices/specs. No invented models. Pick 10 genuinely fitting boats for "${item.title}".
- Length: at least 2,100 words of plain prose (aim ~2,200-2,400). Add real buying detail (length, beam, hull type, engine/horsepower options, capacity, common issues, resale).
- EXACTLY one "🏆 BEST OVERALL" (section 1) and one "💎 BEST VALUE" (section 2). Exactly 10 numbered "## N." product sections.
- Exactly one \`\`\`mermaid block.
- FAQ: at least 4 questions, each formatted as a bold line ending in ? like **Question?**
- Sources: at least 5 dash-bullet items under ## Sources.
- At least 25 bold (**...**) spans across the body; at least 3 distinct boat brands named.
- NEVER use these banned words/phrases anywhere: delve, tapestry, landscape, holistic, "in today's", ever-evolving, synergy/synergies/synergistic, paradigm shift, game-changer, cutting-edge, state-of-the-art, "seamless integration", "drive growth", "unlock value", "unlock potential", "needless to say", "it's worth noting", "it's important to note".
- Do NOT put a literal < or > character in prose (only inside the mermaid/code block). Write "under" / "over" instead.
- Do NOT add a cover image; images are backfilled later.

PUBLISH STEP (run with the Bash tool):
  node C:/Users/koryj/website/_write_bt.js ${item.id} "${item.title}" ${item.slug}

Read the command output. SUCCESS = stdout JSON contains  "ok":true . A NOTE about scoring 11/12 is fine; 11 or 12 both pass.
If it prints "REJECTED ... scored N/12" with a "missing:" list, FIX the body to satisfy the missing criteria (most often word_count_floor — add real content to reach 2,200+ plain words — or heavy_bold/best pills/sources), overwrite the same file, and re-run the publish command. Retry up to 2 times.

Return ONLY the structured object: {id:"${item.id}", ok:<true if published>, score:<grader score int>, words:<approx plain word count int>, note:<short status or failure reason>}.`
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
return {
  published: ok.length,
  total: QUEUE.length,
  failed: failed.map(r => ({ id: r.id, note: r.note })),
  missing: missing.map(q => q.id),
}
