// Migrate the 50 wrongly-scored qmp26* entries to proper 5/10 baselines
// with qNNNN IDs. Preserves all the content (questions, answers, tags,
// sources) but resets the polish state so the overnight polish loop can
// legitimately walk them through 5->6->7->8->9->10.
//
// Allocates IDs q9510 through q9559.

const { getStore } = require('@netlify/blobs');
const TOKEN = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
if (!TOKEN) { console.error('BLOBS_PAT required'); process.exit(1); }
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOKEN });

const OLD_IDS = [
  'qmp26gplb61u1','qmp26gqnzif4k','qmp26grltneek','qmp26gsj5xw81','qmp26gtg217ey',
  'qmp26gudt1k53','qmp26gvd0763h','qmp26gwaa7107','qmp26gx6jan7c','qmp26gy2o8hvb',
  'qmp26gyz4r0mk','qmp26gzxt3z0j','qmp26h0k0mrd3','qmp26h15bcd3f','qmp26h23353sm',
  'qmp26h2ouvp3l','qmp26h3anc83c','qmp26h3wuim0t','qmp26h4imimmi','qmp26h54tq8qw',
  'qmp26h5r22mka','qmp26h6e8bnyq','qmp26h70euko6','qmp26h7m6n8x8','qmp26h88chmfc',
  'qmp26h8v4flsk','qmp26h9gvxkm4','qmp26haebp8ry','qmp26hazy4m3u','qmp26hblqr794',
  'qmp26hc8euq91','qmp26hcw0k379','qmp26hdi79xl3','qmp26he4hl7k8','qmp26hf1bbqss',
  'qmp26hfo0nu6b','qmp26hgkw50uf','qmp26hh6mx8fu','qmp26hhsdjbc3','qmp26hiemx1kb',
  'qmp26hjbixmr5','qmp26hjxp8oue','qmp26hkrbz8p9','qmp26hlei5brk','qmp26hm15z0gk',
  'qmp26hmnuyvss','qmp26hnaktcii','qmp26hnx8re5j','qmp26hokstrsk','qmp26hp6y43h2',
];

const ID_START = 9510;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  console.log('Migrating ' + OLD_IDS.length + ' fake-10/10 entries -> q' + ID_START + '..q' + (ID_START + OLD_IDS.length - 1));
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  let migrated = 0;
  let skipped = 0;

  for (let i = 0; i < OLD_IDS.length; i++) {
    const oldId = OLD_IDS[i];
    const newId = 'q' + (ID_START + i);
    try {
      const cur = await store.get('answers/' + oldId + '.json', { type: 'json' });
      if (!cur) {
        console.warn('  ' + oldId + ' not found · skip');
        skipped++;
        continue;
      }
      const ts = Date.now();
      const baseline = {
        ...cur,
        id: newId,
        quality_score: 5,
        polished_at: null,
        polish_history: [],
        baseline_answer_v5: cur.answer,
        source: 'wake-loop-baseline',
        model: cur.model || 'wake-loop',
        ts,
        // Honest state — these have NOT been pushed to search engines yet.
        // The IndexNow batch will set was_indexed_at when it actually pings.
        was_indexed_at: null,
        indexed: false,
        seo_optimized_at: null,
        fresh_at: null,
      };
      await store.setJSON('answers/' + newId + '.json', baseline);
      await store.delete('answers/' + oldId + '.json');

      // Update index — replace old ID row with new ID row.
      // No was_indexed_at / polished_at on baseline = honest "not yet indexed / SEO'd / fresh".
      const oldIdx = idx.entries.findIndex(e => e.id === oldId);
      const newIdxRow = {
        id: newId,
        question: cur.question,
        tags: cur.tags || [],
        ts,
        quality_score: 5,
        polished_at: null,
        last_modified_ms: ts,
        sources_count: Array.isArray(cur.sources) ? cur.sources.length : 0,
        was_indexed_at: null,
      };
      if (oldIdx >= 0) idx.entries[oldIdx] = newIdxRow;
      else idx.entries = [newIdxRow, ...idx.entries];

      migrated++;
      if (migrated % 10 === 0) {
        await store.setJSON('_index.json', idx); // checkpoint every 10
        console.log('  ... migrated ' + migrated + ' so far');
      }
    } catch (e) {
      console.error('  ERR on ' + oldId + ' -> ' + newId + ': ' + e.message);
      skipped++;
    }
    await sleep(150);
  }

  await store.setJSON('_index.json', idx);
  console.log('\n=== DONE ===');
  console.log('migrated:', migrated, '· skipped:', skipped);
  console.log('New IDs: q' + ID_START + ' through q' + (ID_START + OLD_IDS.length - 1));
  console.log('All ' + migrated + ' entries now at quality_score=5 · polished_at=null · empty polish_history');
  console.log('Overnight polish loop will pick them up (highest qNNNN first — these will be processed before older 5/10s)');
})().catch(e => { console.error('FATAL', e); process.exit(1); });
