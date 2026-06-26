// Cursor workflow: write & publish 50 Pulse Cars entries (ca0924–ca0973).
// After pipeline completes, run: node _ca_sprint50_finish.js  (Serper cards + cover images).
import fs from 'fs';

export const meta = {
  name: 'cars-sprint-50',
  description: 'Write & publish 50 Pulse Cars Top-10 entries (ca0924–ca0973) + image finish pass',
  phases: [
    { title: 'Write', detail: 'one writer agent per entry, gold grader ≥10/12' },
    { title: 'Images', detail: 'auto-ensured at publish via _write_lib (cover + @@PRODUCT imgs); optional _ca_sprint50_finish.js for Serper upgrade' },
  ],
};

const QUEUE = JSON.parse(fs.readFileSync('C:/Users/koryj/_ca_sprint50.json', 'utf8'));

const SCHEMA = {
  type: 'object',
  required: ['id', 'ok', 'score', 'words'],
  properties: {
    id: { type: 'string' }, ok: { type: 'boolean' }, score: { type: 'integer' },
    words: { type: 'integer' }, note: { type: 'string' },
  },
};

function promptFor(item) {
  return `You are a meticulous automotive writer for "Pulse Cars". Write ONE deeply-researched Top-10 vehicle ranking and PUBLISH it.

ENTRY ID: ${item.id}
EXACT TITLE (use verbatim as H1): ${item.title}
TOPIC SLUG: ${item.slug}

Read the LOCKED spec at C:/Users/koryj/_ca_spec.md and mirror the skeleton in C:/Users/koryj/_ca0001_body.md BEFORE writing.

TITLE TYPE: This is a "Best Used <class> Under $<price> in 2027 (Ranked)" list. The 10 picks are REAL used vehicles that shoppers can find under the stated budget in 2027 — mix model years (typically 2014–2022) with realistic used-market prices, reliability, mpg, safety, and ownership costs. Section 1 = 🏆 BEST OVERALL (best balance). One other section = 💎 BEST VALUE (most car per dollar).

Write Markdown to C:/Users/koryj/${item.id}_answer.md then publish.

=== TEMPLATE (follow ca0001 structure exactly) ===
# ${item.title}

## Direct Answer
<Bold Best Overall vehicle + realistic used price band, Best Value + price, who this list is for, budget ceiling. Note picks use real specs and typical used-market pricing.>

*Note: Prices vary significantly based on condition and market; these are representative of the model's typical market positioning.*

## How We Ranked the Top 10
<6 weighted criteria summing to 100% — reliability, safety, cost to own, mpg, space, resale, etc.>

## 1. <Year Make Model Trim> 🏆 BEST OVERALL
**Starting MSRP:** **$xx,xxx** (used)  |  **Best for:** ...
<Real specs paragraph: hp, mpg, cargo, safety, typical mileage band for this price.>
Pros:
- **...** (4 bold bullets)
Cons:
- **...** (2 bullets)
**Verdict:** ...

## 2. <Year Make Model> 💎 BEST VALUE
(same shape)

## 3. through ## 10. (no pills on 3–10)

## Buyer Decision Tree — Which One's Right for You?
\`\`\`mermaid
flowchart TD
  A[Start] --> B{...}
\`\`\`

## What to Look For When Buying ...
<5–6 bold-led bullets + "matters less than marketing" note>

## FAQ
**Question?**
<answer>
(6 Q&A pairs, questions bold ending in ?)

## Bottom Line
<Restate Best Overall + Best Value with prices>

## Sources
- [Car and Driver](https://www.caranddriver.com/) ...
(8–10 markdown links: Car and Driver, MotorTrend, Edmunds, KBB, U.S. News, IIHS, EPA, NHTSA, manufacturer sites)

*<category> review — <category> reviews, rating, best <category> 2027, and a review of the top picks for buyers.*
=== END ===

HARD REQUIREMENTS (grader rejects below 10/12):
- ≥1,900 words (aim 2,000–2,300). REAL vehicles, realistic used prices under the title's budget.
- Exactly 10 numbered "## N." sections; section 1 has 🏆 BEST OVERALL; exactly one 💎 BEST VALUE elsewhere.
- One mermaid block; 6 FAQ pairs; 8–10 Sources links; ≥25 **bold** spans; ≥3 automakers.
- BANNED: delve, tapestry, landscape, holistic, "in today's", ever-evolving, synergy, paradigm shift, game-changer, cutting-edge, state-of-the-art, seamless integration, drive growth, unlock value/potential, needless to say, "it's worth noting", "it's important to note".
- Do NOT add @@PRODUCT lines or a cover image in the draft; _write_ca.js auto-ensures Image LAW at publish (DDG cover + product imgs). Optional Serper upgrade: _ca_sprint50_finish.js.

PUBLISH (Shell):
  node C:/Users/koryj/website/_write_ca.js ${item.id} "${item.title.replace(/"/g, '\\"')}" ${item.slug}

If REJECTED (score below 10/12), fix missing criteria, overwrite same file, retry up to 2 times.

Return ONLY: {"id":"${item.id}","ok":<bool>,"score":<int>,"words":<int>,"note":"<short>"}`;
}

phase('Write');
const results = await pipeline(
  QUEUE,
  item => agent(promptFor(item), { label: item.id, phase: 'Write', schema: SCHEMA })
);
const done = results.filter(Boolean);
const ok = done.filter(r => r.ok);
const failed = done.filter(r => !r.ok);
const missing = QUEUE.filter(q => !done.find(r => r.id === q.id));
log(`WRITE DONE: ${ok.length}/${QUEUE.length} published. failed=${failed.length} missing=${missing.length}`);

phase('Images');
const imgOut = await shell('node C:/Users/koryj/website/_ca_sprint50_finish.js');
log(String(imgOut || '').slice(0, 2000));

return {
  published: ok.length,
  total: QUEUE.length,
  failed: failed.map(r => ({ id: r.id, note: r.note })),
  missing: missing.map(q => q.id),
};
