export const meta = {
  name: 'nil-football-sprint-200',
  description: 'Write & publish 200 college NIL football Q&A entries (q13302-q13501, q11133 LAW format)',
  phases: [{ title: 'Write+Publish', detail: 'one writer agent per program, publishes via _write_nil.js' }],
}

const COUNT = (args && (typeof args === 'string' ? JSON.parse(args).count : args.count)) || 200

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'ok', 'words', 'url'],
  properties: {
    id: { type: 'string' },
    ok: { type: 'boolean', description: 'true if _write_nil.js printed {"ok":true,...}' },
    words: { type: 'number' },
    url: { type: 'string' },
  },
}

function promptFor(i) {
  return `PULSE knowledge pillar — write ONE gold NIL college-FOOTBALL Q&A entry. Work in C:/Users/koryj/website.

STEP 0 — Read C:/Users/koryj/_nil_football200_compact.json (a JSON array). Take the element at index ${i}. It has: id (q####), question, team, slug, sport ("football"). Use those EXACT values below.

STEP 1 — Read C:/Users/koryj/_nil_template_full.md (a finished NIL entry, "How much do Duke basketball players earn from NIL in 2027?"). Replicate its structure, depth, tone, and length EXACTLY — this is the q11133 LAW format. (It is a basketball example; you are writing FOOTBALL — adapt all content to football.)

STEP 2 — From your own knowledge, research the program's REAL 2027 FOOTBALL NIL situation: the team's NIL collective name(s), notable recent earners (especially QBs and top skill players) and their estimated NIL figures, the program's recruiting tier and conference (SEC/Big Ten/Big 12/ACC/Group of Five/FCS), and how the House v. NCAA settlement revenue-sharing cap (~$20.5M school-wide, of which FOOTBALL typically takes the largest slice ~75% at Power-conference schools) applies here. Football roster economics differ from basketball: ~85-105 players, QB1 commands the top of the market, big gap between starters and depth. Be factually grounded — real collective names, real player names, realistic dollar ranges. If unsure of an exact figure, give a sourced realistic range; never invent precise fake numbers.

STEP 3 — Write the body to C:/Users/koryj/<id>_answer.md (use the id from the queue row) with this EXACT structure (mirror the template):
- Line 1: \`# <question>\` (the exact question text as an H1)
- NO TL;DR (forbidden by LAW).
- \`## Direct Answer\` — a direct ~150-word answer that leads with the bottom-line dollar ranges (QB1 / starters / depth).
- 7-8 numbered sections \`## 1. …\` through \`## 8. …\` — team-specific FOOTBALL NIL analysis (why this program's NIL is valued where it is; the two layers = collective + revenue-share; what different positions/roles earn (QB vs skill vs line vs depth); real named earners and what they prove; how the House settlement reshaped the math + football's slice of the cap; the collectives/organizations in this program's NIL economy; how a player here maximizes earnings; how it stacks up vs peer programs). Each section 110-160 words with several **bold** spans.
- Exactly TWO \`\`\`mermaid\`\`\` diagrams woven into the body (e.g. how NIL money reaches a player, and a position/tier comparison) — same as the template.
- \`## Frequently Asked Questions\` — 4-5 Q&As; each question a bold line \`**...?**\` then an answer paragraph.
- \`## Sources\` — 5-6 real reference bullets (On3, 247Sports, ESPN, the collective's site, NCAA, Opendorse, etc.).
RULES: 1,500+ words (template is ~1,900; never below the 1,200 LAW floor). Real, grounded facts. No banned filler ("game-changer","look no further","when it comes to","in today's fast-paced world","dive in"). Correct acronym casing (NIL, NCAA, SEC, ACC, Big Ten, QB).

STEP 4 — Publish: run \`node _write_nil.js <id> "<question>" <slug> football\` from C:/Users/koryj/website (slug is the row's slug). On success it prints \`{"ok":true,...}\` and deletes the .md. If it ABORTS because the id already exists, that's fine — report ok:true. If it errors for another reason, fix and re-run.

Return ONLY the structured object: id (the q#### from the row), ok, words (approx body word count), url (https://pulserevops.com/knowledge/<id>).`
}

log(`NIL football sprint: writing ${COUNT} entries (indices 0..${COUNT - 1})`)

const idxs = Array.from({ length: COUNT }, (_, i) => i)
const results = await parallel(idxs.map(i => () =>
  agent(promptFor(i), { label: `nilfb#${i}`, phase: 'Write+Publish', schema: SCHEMA })
))

const ok = results.filter(r => r && r.ok)
const failedIdx = idxs.filter(i => !results[i] || !results[i].ok)
log(`DONE. published=${ok.length}/${COUNT}  failedIdx=${failedIdx.length}`)
return { published: ok.length, total: COUNT, failedIndices: failedIdx, results: results.filter(Boolean) }
