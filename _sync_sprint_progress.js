// Merge published IDs from run logs + known retries into sprint progress files.
const fs = require('fs');
const path = require('path');

const ROOT = 'C:/Users/koryj/website';
const EXTRA = {
  cg: ['cg0518', 'cg0524', 'cg0549'],
  es: ['es0064'],
  rs: ['rs0165'],
};

function idsFromLog(logPath) {
  if (!fs.existsSync(logPath)) return [];
  const text = fs.readFileSync(logPath, 'utf8');
  const ids = new Set();
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^OK\s+([a-z]{2}\d+)/i);
    if (m) ids.add(m[1].toLowerCase());
  }
  return [...ids];
}

function mergeProgress(prefix) {
  const progPath = path.join(ROOT, `_${prefix}_sprint300_progress.json`);
  const logPath = path.join(ROOT, `_${prefix}_sprint300_run.log`);
  const data = fs.existsSync(progPath) ? JSON.parse(fs.readFileSync(progPath, 'utf8')) : { done: [] };
  const set = new Set(data.done || []);
  const before = set.size;
  for (const id of idsFromLog(logPath)) set.add(id);
  for (const id of EXTRA[prefix] || []) set.add(id);
  data.done = [...set].sort();
  data.updated = new Date().toISOString();
  fs.writeFileSync(progPath, JSON.stringify(data, null, 2));
  console.log(`${prefix}: ${before} → ${data.done.length} (+${data.done.length - before})`);
}

for (const p of ['nl', 'dn', 'st', 'cg', 'er', 'es', 'rs']) mergeProgress(p);
