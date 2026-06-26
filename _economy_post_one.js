// Post exactly ONE economy Q&A from _economy_queue.txt
const fs = require('fs');
const path = require('path');
const {
  fetchLibrary,
  checkAgainst,
  toQuestion,
  tagsFor,
  postOne,
  indexOne,
  sleep,
} = require('./_economy_post_lib');

const QUEUE = path.join(__dirname, '_economy_queue.txt');
const START_ID = 10634; // after CRO100 done q10539–q10633 (95 posted)

async function main() {
  const lines = fs.readFileSync(QUEUE, 'utf8').split(/\r?\n/);
  let topicLine = -1;
  let topic = '';
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('#')) continue;
    if (line.startsWith('DONE|')) continue;
    topicLine = i;
    topic = line;
    break;
  }
  if (!topic) {
    console.log('QUEUE_EMPTY');
    return;
  }

  const question = toQuestion(topic);
  const tags = tagsFor(question, topic);

  const qEntries = (await fetchLibrary()).filter((e) => /^q\d+$/i.test(e.id));
  const dup = checkAgainst(qEntries, question);
  if (!dup.clear) {
    const hit = dup.exact[0] || dup.similar[0];
    console.log(
      JSON.stringify(
        {
          ok: false,
          skip: 'duplicate',
          question,
          existing: hit,
          url: hit ? `https://pulserevops.com/knowledge/${hit.id}` : null,
        },
        null,
        2
      )
    );
    lines[topicLine] = 'SKIP_DUP|' + question;
    fs.writeFileSync(QUEUE, lines.join('\n'), 'utf8');
    return;
  }

  let num = START_ID;
  let r;
  for (let tries = 0; tries < 200; tries++) {
    r = await postOne(num, question, tags);
    if (r.status === 200 || r.status === 201) break;
    if (r.status === 409) {
      num++;
      continue;
    }
    break;
  }

  const out = {
    ok: r.status === 200 || r.status === 201,
    id: r.id,
    status: r.status,
    body: r.body,
    question: r.question,
    chars: r.chars,
    url: r.id ? `https://pulserevops.com/knowledge/${r.id}` : null,
  };
  console.log(JSON.stringify(out, null, 2));

  if (out.ok) {
    lines[topicLine] = 'DONE|' + question;
    fs.writeFileSync(QUEUE, lines.join('\n'), 'utf8');
    // Redundant if blob-writer indexed on write; ensures stamp if writer response omitted index.
    await sleep(500);
    const idx = await indexOne(out.id);
    out.index = idx;
    console.log(JSON.stringify({ index: idx }, null, 2));
  }
}

main();
