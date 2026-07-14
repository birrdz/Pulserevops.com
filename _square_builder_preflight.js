'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const root = __dirname;
const config = JSON.parse(fs.readFileSync(path.join(root, '_all_flux_config.json'), 'utf8'));
const { faceCardSquareGradeOpts, goldTitleLayout } = require('./_ddg_facecard_lib');

assert.strictEqual(config.faceCardVariant, 'square', 'square variant must be enabled');
assert.strictEqual(config.force, true, 'configured pillar must be rebuilt as squares');
assert(Array.isArray(config.prefixes) && config.prefixes.length, 'builder requires a scoped pillar');
assert(!fs.existsSync(path.join(root, '_all_flux_facecards_stop.flag')), 'generator stop flag is present');
assert(!fs.existsSync(path.join(root, '_all_flux_watchdog_stop.flag')), 'watchdog stop flag is present');
assert.strictEqual(faceCardSquareGradeOpts('Preflight', null).square, 760);
assert(goldTitleLayout(760, 760, 'Preflight square title').fontSize <= 38);

console.log('square builder preflight: ready · ' + config.prefixes.join(',') + ' · 760x760 · force=' + config.force);
