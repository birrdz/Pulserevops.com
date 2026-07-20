'use strict';

const assert = require('assert');
const {
  candidateInvariantIssues,
  contentImages,
} = require('./_deepseek_booster_candidate');
const { pickGoldTemplate } = require('./_pulse_gold_template_router');

const image = '![Revenue team reviewing pipeline](/assets/qa/q-test.jpg)';
const product = '@@PRODUCT name="Example" img="/assets/qa/example.jpg" site="https://example.com"';
const original = `## Direct Answer

This is a complete direct answer with enough useful context for the reader.

${image}

${product}

## 1. Operating Context

${'Existing factual operating guidance. '.repeat(60)}

## FAQ

**What should the team do first?**

Start with the smallest measurable workflow.

## Sources

- https://www.bls.gov/
`;
const route = pickGoldTemplate('q12345', original, 'How should a team improve its operating process?');

assert.deepStrictEqual(contentImages(original), [image, product]);
assert.deepStrictEqual(
  candidateInvariantIssues(original, original + '\n\nAdditional factual guidance.', route, 'q12345', 'How should a team improve its operating process?'),
  [],
);
assert(candidateInvariantIssues(
  original,
  original.replace(image, '![Changed](/different.jpg)'),
  route,
  'q12345',
  'How should a team improve its operating process?',
).includes('image_slots_changed'));
assert(candidateInvariantIssues(
  original,
  original.replace('/assets/qa/example.jpg', '/assets/qa/changed.jpg'),
  route,
  'q12345',
  'How should a team improve its operating process?',
).includes('image_slots_changed'));
assert(candidateInvariantIssues(
  original,
  original.replace(image + '\n\n' + product, '').replace('## FAQ', image + '\n\n' + product + '\n\n## FAQ'),
  route,
  'q12345',
  'How should a team improve its operating process?',
).includes('image_slots_moved'));
assert(candidateInvariantIssues(
  original,
  '## Direct Answer\n\nAs an AI, I cannot browse.',
  route,
  'q12345',
  'How should a team improve its operating process?',
).includes('ai_meta_language'));

console.log('deepseek content booster guardrail tests passed');
