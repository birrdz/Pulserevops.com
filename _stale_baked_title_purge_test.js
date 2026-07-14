'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const sharp = require('sharp');

(async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pulse-stale-title-'));
  fs.mkdirSync(path.join(root, 'assets', 'qa'), { recursive: true });
  process.env.PULSE_ROOT = root;
  const lib = require('./_ddg_facecard_lib');
  const id = 'ed0338';
  const file = lib.coverPath(id);
  const raw = await sharp({
    create: { width: 900, height: 700, channels: 3, background: '#765432' },
  }).jpeg().toBuffer();
  await lib.storeGradedImage(raw, file, { square: 760, goldTitle: 'Old baked title' });
  const stalePh = await lib.pHash(fs.readFileSync(file));
  fs.writeFileSync(path.join(root, '_img_registry.json'), JSON.stringify({
    entries: [
      { ph: stalePh, url: '/assets/qa/ed0338.jpg', pages: ['ed0338'] },
      { ph: '0'.repeat(64), url: '/assets/qa/shared.jpg', pages: ['ed0338', 'q1'] },
    ],
  }));

  assert.strictEqual(await lib.verifyGradeStamp(file), true);
  const result = lib.purgeFaceCardRegistry(id, stalePh);
  assert.strictEqual(result.removed, 1);
  assert.strictEqual(result.detached, 1);
  const registry = JSON.parse(fs.readFileSync(path.join(root, '_img_registry.json'), 'utf8'));
  assert.strictEqual(registry.entries.some(entry => entry.url === '/assets/qa/ed0338.jpg'), false);
  assert.deepStrictEqual(registry.entries[0].pages, ['q1']);

  lib.markFaceCardForceRegen(id, 'test stale title');
  assert.strictEqual(lib.faceCardForceRegenPending(id), true);
  assert.strictEqual(await lib.verifyGradeStamp(file), false, 'old EXIF stamp must not satisfy a forced regeneration');
  lib.clearFaceCardForceRegen(id);
  assert.strictEqual(await lib.verifyGradeStamp(file), true);

  fs.rmSync(root, { recursive: true, force: true });
  console.log('stale baked-title purge: ok');
})().catch(error => {
  console.error(error);
  process.exit(1);
});
