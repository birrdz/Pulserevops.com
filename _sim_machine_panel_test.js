'use strict';

const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const source = fs.readFileSync(require.resolve('./_sim_machine_server_cursor.js'), 'utf8');
const marker = 'const PANEL = `';
const start = source.indexOf(marker);
assert(start >= 0, 'PANEL template start missing');
const bodyStart = start + marker.length;
const end = source.indexOf('`;\n\nhttp.createServer', bodyStart);
assert(end > bodyStart, 'PANEL template end missing');
const html = vm.runInNewContext('`' + source.slice(bodyStart, end) + '`');
const script = (html.match(/<script>([\s\S]*?)<\/script>/i) || [])[1];
assert(script, 'rendered PANEL inline script missing');
new Function(script);
assert(html.includes('AUTO-RUN 100'));
assert(html.includes('SIMILARITY'));
assert(html.includes('QUALITY'));
assert(html.includes('13/13'));
assert(!html.includes('�'), 'rendered panel contains replacement characters');
assert(!html.includes('10 at a time'), 'rendered panel has stale concurrency copy');
console.log('sim machine rendered panel: ok');
