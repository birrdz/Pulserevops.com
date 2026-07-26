// Regression: book-summary subsection heads like "### 1.1 … vs …" must NOT
// trigger comparison-entry grading (false vs_compare_valid fails).
const assert = require('assert');
const {
  isComparisonEntry,
  auditComparisonEntry,
} = require('../netlify/functions/lib/vs-expert-verify');

const bookBody = `## Direct Answer

SPIN Selling separates small-sale tactics from large-sale discovery.

### 1.1 Chapter 1 — The Small-Sale vs. Large-Sale Distinction

Huthwaite research showed different behaviors win in large deals.

### 3.1 Chapter 8 — Features vs. Advantages vs. Benefits

Rackham separates features from buyer-valued benefits.

## FAQ

**What is SPIN?**
Situation, Problem, Implication, Need-payoff.

## Sources

- Neil Rackham — SPIN Selling
`;

assert.strictEqual(
  isComparisonEntry('bs0002', 'SPIN Selling by Neil Rackham — Cliff Notes', bookBody),
  false,
  'subsection vs headings must not mark book summaries as comparison entries'
);

const audit = auditComparisonEntry(
  'bs0002',
  'SPIN Selling by Neil Rackham — Cliff Notes',
  bookBody
);
assert.strictEqual(audit.isComparison, false);
assert.strictEqual(audit.structuralPass, true);

// Real compare entries still detect
const realCompare = `## Direct Answer

Pick A or B by use case.

## HubSpot vs Salesforce

\`\`\`compare
a: HubSpot
b: Salesforce
- CRM depth | lighter | deeper
- Price | lower mid-market | higher enterprise
- Impl time | weeks | months
- Best for | inbound SMB | complex enterprise
\`\`\`
`;
assert.strictEqual(
  isComparisonEntry('q9999', 'HubSpot vs Salesforce for RevOps', realCompare),
  true
);

console.log('vs-body-heading-false-positive.test.js: ok');
