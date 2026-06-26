export const meta = {
  name: 'aquariums-sprint-50',
  description: 'Write & publish 50 new Aquariums pillar Top-10 entries (aq0001-aq0050)',
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
  return `You are a meticulous fishkeeping writer for "Pulse Aquariums", an aquarium-hobby answer site. Write ONE deeply-researched Top-10 ranking guide and PUBLISH it.

ENTRY ID: ${item.id}
EXACT TITLE (use verbatim): ${item.title}
TOPIC SLUG: ${item.slug}

The 10 picks are REAL aquarium products (filters, heaters, lights, tanks, kits, foods, decor) OR real fish/plant/invertebrate species — whichever the title calls for. Either way, rank the 10 best with honest pros/cons.

Write a Markdown body to the file  C:/Users/koryj/${item.id}_answer.md  (use the Write tool, absolute path) following THIS EXACT locked template. Then publish it.

=== TEMPLATE (Markdown) ===
# ${item.title}

<One 90-130 word intro paragraph framing the category, who it is for (beginner/intermediate/reef/planted), and how you judged the field. Bold 4-6 key terms.>

## Direct Answer
<2-4 sentences. Name the #1 BEST OVERALL pick in **bold** with its approximate price in **bold** (for gear/tanks) or key trait (for species), and the BEST VALUE pick in **bold**. One sentence of caution/criteria.>

## How We Ranked
- **<Factor>** — <why it matters (e.g. flow rate, hardiness, footprint, par output, bioload)>
(5 weighting bullets, each factor bolded)

## 1. <Product or Species Name> 🏆 BEST OVERALL
@@PRODUCT name="<Product or Species Name>" site="https://en.wikipedia.org/wiki/<Page>"
<Why it wins, 2 short paragraphs with **bold** specs (gph, watts, gallons, adult size, temperament, water params).>
- **Price / Cost:** ~$<amount>  (for species: typical store price each)
- **Pros:** <...>
- **Cons:** <...>
**Verdict:** <one line>

## 2. <Product or Species Name> 💎 BEST VALUE
@@PRODUCT name="<...>" site="https://en.wikipedia.org/wiki/<Page>"
<same shape>

## 3. ... through ## 10.  (ten numbered picks total; sections 3-10 have NO pill)
Each numbered section MUST have its own @@PRODUCT line, a **Price / Cost:**, **Pros:**, **Cons:**, **Verdict:** set.

## How to Choose
\`\`\`mermaid
flowchart TD
  A[Start] --> B{Tank size / skill?}
  B -->|Small / beginner| C[Pick ...]
  B -->|Large / advanced| D[Pick ...]
\`\`\`

## What to Look For
<2-4 buyer/care tips: footprint, flow, filtration load, water parameters, quarantine, compatibility.>

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
- <real brand/org/community, e.g. Fluval, Seachem, API, Aqueon, Eheim, Fishlore, Aquarium Co-Op, C.A.R.E. sheets, Seriously Fish>
- <5+ dash bullets total>

*Keywords: ${item.title} — review, reviews, rating, comparison, best of 2027.*
=== END TEMPLATE ===

HARD REQUIREMENTS (a writer-time grader will REJECT below 10/12):
- REAL products/species only with realistic specs and approximate prices. No invented brands or species. Pick 10 genuinely fitting items for "${item.title}".
- Length: at least 2,100 words of plain prose (aim ~2,200-2,400). Add real care/spec detail (flow rates, wattage, footprint, adult size, temperament, water parameters, common pitfalls).
- EXACTLY one "🏆 BEST OVERALL" (section 1) and one "💎 BEST VALUE" (section 2). Exactly 10 numbered "## N." sections.
- Exactly one \`\`\`mermaid block.
- FAQ: at least 4 questions, each a bold line ending in ? like **Question?**
- Sources: at least 5 dash-bullet items under ## Sources.
- At least 25 bold (**...**) spans; at least 3 distinct named brands or species.
- NEVER use these banned words/phrases: delve, tapestry, landscape, holistic, "in today's", ever-evolving, synergy/synergies/synergistic, paradigm shift, game-changer, cutting-edge, state-of-the-art, "seamless integration", "drive growth", "unlock value", "unlock potential", "needless to say", "it's worth noting", "it's important to note".
- Do NOT put a literal < or > in prose (only inside the mermaid block). Write "under" / "over" instead.
- Do NOT add a cover image in the draft; _write_aq.js auto-ensures Image LAW (DDG cover + product imgs) before publish.

PUBLISH STEP (run with the Bash tool):
  node C:/Users/koryj/website/_write_aq.js ${item.id} "${item.title}" ${item.slug}

Read the command output. SUCCESS = stdout JSON contains  "ok":true . A NOTE about 11/12 is fine; 11 or 12 both pass.
If it prints "REJECTED ... scored N/12" with a "missing:" list, FIX the body (most often word_count_floor — reach 2,200+ plain words — or heavy_bold/best pills/sources), overwrite the same file, and re-run the publish command. Retry up to 2 times.

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
