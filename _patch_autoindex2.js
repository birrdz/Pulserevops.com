const fs = require('fs');
const p = 'C:/Users/koryj/website/_scrub_button_server.js';
let s = fs.readFileSync(p, 'utf8');

// syncGeneratedEntryMetadata: optional certified flag
const oldSync = `async function syncGeneratedEntryMetadata(id, title, score, body) {
  try {
    if (faceCoverOk(id)) {
      if (coverSrcOf[id] !== 'flux') coverSrcOf[id] = 'flux';
      await stampFluxProvenance(id, store, 'flux');
    }
    const cur = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
    if (cur) {
      await store.setJSON('answers/' + id + '.json', Object.assign({}, cur, {
        answer: body || cur.answer,
        cover_src: coverSrcOf[id] || cur.cover_src || null,
        quality_score: score != null ? score : cur.quality_score,
        pending: true,
        updated_at: new Date().toISOString(),
      }));
    }
  } catch (e) {}
}`;
const neuSync = `async function syncGeneratedEntryMetadata(id, title, score, body, opts) {
  const certified = opts && opts.certified;
  try {
    if (faceCoverOk(id)) {
      if (coverSrcOf[id] !== 'flux') coverSrcOf[id] = 'flux';
      await stampFluxProvenance(id, store, 'flux');
    }
    const cur = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
    if (cur) {
      await store.setJSON('answers/' + id + '.json', Object.assign({}, cur, {
        answer: body || cur.answer,
        cover_src: coverSrcOf[id] || cur.cover_src || null,
        quality_score: score != null ? score : cur.quality_score,
        pending: certified ? false : true,
        updated_at: new Date().toISOString(),
      }));
    }
  } catch (e) {}
}`;
if (!s.includes(oldSync)) { console.error('sync block not found'); process.exit(1);} 
s = s.replace(oldSync, neuSync);

// generateOne: pipeline call + post handling
const oldGenBlock = `  const result = await entryScrubPipeline({
    id, title: question, body,
    save: b => saveBody(id, b),
    sib, out: { steps: [] },
    ui: 'gen', certifyOnPass: false, maxRounds: 5,
    shouldStop: () => !!genJob.stop,
  });
  const finalBody = result.body || body;
  const score = result.score || gradeEntry(id, finalBody, { imagesDeferred: true }).score;
  await syncGeneratedEntryMetadata(id, question, score, finalBody);
  if (result.status === 'stopped') {
    touchScrubLive({ active: false, stage: 'idle', carwash: 'Generate stopped — ' + id });
    return { status: 'stopped', id, score, notes: result.msg || 'stopped' };
  }
  if (result.status === 'ready' && (result.passedGate || result.needsReview)) {
    await queueNewEntryForScrubber(id, finalBody, { skipQueue: true });
    addPendingSignoff({
      id, score, title: titleShort, pillar,
      rubricPct: result.rubric && result.rubric.rubricPct,
      needsReview: !!result.needsReview,
      caveats: result.caveats || [],
    });
    setScrubStep('certify', 1, 1, result.needsReview ? '12/13 — your approval pile' : 'Passed — approval pile');
    markScrubStepDone('certify', result.needsReview ? 'Review caveats in pile' : 'Awaiting your approval');
    touchScrubLive({ active: false, stage: 'idle', carwash: 'In your approval pile — ' + id });
    const note = result.msg || (result.needsReview ? '12/13 with review caveats' : 'passed all gates');
    return { status: 'ready', id, score, notes: note, factor1Pass: true, needsReview: !!result.needsReview, caveats: result.caveats || [] };
  }
  if (result.status === 'certified') {
    await certify(id, score, finalBody);
    setScrubStep('certify', 1, 1, 'Certified');
    markScrubStepDone('certify', 'Certified ' + score + '/13');
    touchScrubLive({ active: false, stage: 'idle', carwash: 'Certified ' + id });
    return { status: 'certified', id, score, notes: 'certified', factor1Pass: true };
  }`;

const neuGenBlock = `  const result = await entryScrubPipeline({
    id, title: question, body,
    save: b => saveBody(id, b),
    sib, out: { steps: [] },
    ui: 'gen', certifyOnPass: true, maxRounds: 5,
    shouldStop: () => !!genJob.stop,
  });
  const finalBody = result.body || body;
  const score = result.score || gradeEntry(id, finalBody, { imagesDeferred: true }).score;
  if (result.status === 'stopped') {
    touchScrubLive({ active: false, stage: 'idle', carwash: 'Generate stopped — ' + id });
    return { status: 'stopped', id, score, notes: result.msg || 'stopped' };
  }
  if (result.status === 'certified') {
    await syncGeneratedEntryMetadata(id, question, score, finalBody, { certified: true });
    await loadIndex();
    setScrubStep('certify', 1, 1, 'Certified');
    markScrubStepDone('certify', 'Auto-indexed ' + score + '/13');
    touchScrubLive({ active: false, stage: 'idle', carwash: 'Certified ' + id });
    return { status: 'certified', id, score, notes: 'auto-indexed on rubric pass', factor1Pass: true };
  }
  if (result.status === 'ready' && (result.passedGate || result.needsReview)) {
    await syncGeneratedEntryMetadata(id, question, score, finalBody);
    await queueNewEntryForScrubber(id, finalBody, { skipQueue: true });
    addPendingSignoff({
      id, score, title: titleShort, pillar,
      rubricPct: result.rubric && result.rubric.rubricPct,
      needsReview: !!result.needsReview,
      caveats: result.caveats || [],
    });
    setScrubStep('certify', 1, 1, result.needsReview ? '12/13 — your approval pile' : 'Passed — approval pile');
    markScrubStepDone('certify', result.needsReview ? 'Review caveats in pile' : 'Awaiting your approval');
    touchScrubLive({ active: false, stage: 'idle', carwash: 'In your approval pile — ' + id });
    const note = result.msg || (result.needsReview ? '12/13 with review caveats' : 'passed all gates');
    return { status: 'ready', id, score, notes: note, factor1Pass: true, needsReview: !!result.needsReview, caveats: result.caveats || [] };
  }`;

if (!s.includes(oldGenBlock)) { console.error('generateOne block not found'); process.exit(1);} 
s = s.replace(oldGenBlock, neuGenBlock);

// scrubOneWork: certifyOnPass true + simplify certified path
s = s.replace(
  `      ui: 'scrub', certifyOnPass: false,`,
  `      ui: 'scrub', certifyOnPass: true,`
);

fs.writeFileSync(p, s);
console.log('patched sync + generateOne + scrubOne certifyOnPass');
