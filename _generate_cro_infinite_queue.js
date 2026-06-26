// Build deduped fringe / nuance RevOps topic queue for infinite economy loop.
// Usage: node _generate_cro_infinite_queue.js [count]
const fs = require('fs');
const path = require('path');
const { fetchLibrary, checkAgainst } = require('./_economy_q_dedupe_check');
const { toQuestion } = require('./_economy_post_lib');

// Reuse same generator as Netlify cron (copy kept in sync manually).
const { generateTopics, topicKey } = require('./netlify/functions/lib/economy-cro-topics');

const OUT = path.join(__dirname, '_economy_cro_infinite_queue.txt');
const COUNT = parseInt(process.argv[2] || '500', 10);

async function main() {
  const entries = (await fetchLibrary()).filter((e) => /^q\d+$/i.test(e.id));
  const seen = new Set();
  for (const e of entries) {
    if (e.question) seen.add(topicKey(e.question));
  }

  const lines = generateTopics(COUNT, seen, 0);
  if (lines.length < Math.min(50, COUNT)) {
    console.error('Only generated', lines.length, 'unique topics');
    process.exit(1);
  }

  let verified = 0;
  for (const topic of lines) {
    const question = toQuestion(topic);
    const dup = checkAgainst(entries, question);
    if (!dup.clear) continue;
    verified++;
    entries.push({ id: 'pending-' + verified, question });
  }

  const header =
    `# Fringe RevOps nuance — economy infinite queue — ${new Date().toISOString().slice(0, 10)}\n` +
    `# ${lines.length} topics (${verified} verified clear vs live library at generation time)\n` +
    `# Cron: pulse-cro-economy-tick-background */5 * * * *\n`;

  fs.writeFileSync(OUT, header + lines.join('\n') + '\n', 'utf8');
  console.log('Wrote', lines.length, 'topics to', OUT);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
