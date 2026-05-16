// Aggregates all 50 entries.
const b1 = require('./wake-loop-data-1.js');
const b2 = require('./wake-loop-data-2.js');
const b3 = require('./wake-loop-data-3.js');
const b4 = require('./wake-loop-data-4.js');
const b5 = require('./wake-loop-data-5.js');
module.exports = [...b1, ...b2, ...b3, ...b4, ...b5];
