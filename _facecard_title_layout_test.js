'use strict';

const assert = require('assert');
const {
  faceCardSquareGradeOpts,
  goldTitleLayout,
  goldTitleOverlaySVG,
} = require('./_ddg_facecard_lib');

const shortSquare = goldTitleLayout(760, 760, 'A short square title');
const longSquare = goldTitleLayout(760, 760, 'What are the best practical ways to keep an unusually long square card title readable in 2027?');
const wide = goldTitleLayout(1200, 400, 'A wide card title');

assert.strictEqual(faceCardSquareGradeOpts('Title', null).square, 760);
assert.strictEqual(shortSquare.fontSize, 38);
assert(longSquare.fontSize < shortSquare.fontSize);
assert(wide.fontSize <= 38, 'wide canvas width must not inflate title size');
assert(longSquare.lines.length <= 3);
assert(goldTitleOverlaySVG(1200, 400, 'Safe <Title>').toString().includes('font-size="38"'));
assert(!goldTitleOverlaySVG(1200, 400, 'Safe <Title>').toString().includes('<Title>'));

console.log('face-card title layout: ok');
