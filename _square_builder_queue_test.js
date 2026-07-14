'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pulse-square-queue-'));
process.env.SQUARE_BUILDER_QUEUE = path.join(dir, 'queue.json');
const queue = require('./_square_builder_queue');

assert.strictEqual(queue.enqueueSquareBuild('q11133', 'Question one'), true);
assert.strictEqual(queue.enqueueSquareBuild('q11133', 'Question one'), false);
assert.strictEqual(queue.enqueueSquareBuild('vq_demo', 'Question two'), true);
assert.strictEqual(queue.readSquareQueue().pending.length, 2);
assert.strictEqual(queue.failSquareBuild('vq_demo', 'temporary error'), true);
assert.strictEqual(queue.readSquareQueue().pending.find(x => x.id === 'vq_demo').attempts, 1);
assert.strictEqual(queue.completeSquareBuild('q11133'), true);
assert.strictEqual(queue.enqueueSquareBuild('q11133', 'Question one'), false, 'completed Q&A must not rebuild');
assert.strictEqual(queue.readSquareQueue().pending.length, 1);

fs.rmSync(dir, { recursive: true, force: true });
console.log('square builder queue: ok');
