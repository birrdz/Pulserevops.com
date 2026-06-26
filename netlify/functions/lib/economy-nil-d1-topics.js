// D1 college football NIL go-to-market topics (2027 cycle).
// Batch 1: every FBS program (ordered). Batch 2: every FCS. Batch 3: long-tail playbooks.

const { capitalizeQuestion } = require('./text-capitalize');
const { FBS, FCS } = require('./economy-nil-d1-schools');

function toQuestion(line) {
  const t = String(line || '').trim();
  let q;
  if (/^how do you /i.test(t)) q = t.endsWith('?') ? t : t + '?';
  else if (/^(what|why|when|where|which|who|can|should|do|does|is|are)\b/i.test(t))
    q = t.endsWith('?') ? t : t + '?';
  else q = 'How do you ' + t.replace(/\.$/, '') + '?';
  return capitalizeQuestion(q);
}

function topicKey(question) {
  return question.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function isLegacyCroHireTopic() {
  return false;
}

function schoolLabel(name) {
  const n = String(name || '').trim();
  if (/^(Alabama|Clemson|Georgia|LSU|Tennessee|Texas|USC|UCLA|Ohio State|Penn State|Notre Dame)$/i.test(n))
    return n;
  if (n.includes('(')) return n;
  return n;
}

function buildFbsNil2027() {
  return FBS.map(
    (school) =>
      `what is the 2027 NIL go-to-market strategy for ${schoolLabel(school)} D1 college football`
  );
}

function buildFcsNil2027() {
  return FCS.map(
    (school) =>
      `what is the 2027 NIL go-to-market strategy for ${schoolLabel(school)} D1 college football`
  );
}

const PLAYBOOKS = [
  'NIL collective donor fundraising GTM',
  'transfer portal retention for returning starters',
  'athlete personal brand deal pipeline',
  'booster and local sponsor outreach CRM',
  'NCAA and state NIL compliance disclosure workflow',
  'roster NIL valuation for portal offers',
  'digital and game-day fan monetization tied to NIL',
  'recruiting visit NIL pitch deck for 2027 commits',
  'December transfer portal sprint GTM',
  'third-party NIL marketplace partnerships',
  'Power 4 vs Group of 5 collective budget positioning',
  'high school recruit parent NIL education outbound',
];

const WINDOWS = [
  '2027 spring portal window',
  '2027 December transfer portal',
  '2027 offseason roster rebuild',
  '2027 conference realignment recruiting cycle',
  '2027 bowl season donor activation',
];

function buildNilLongTailTemplates() {
  const schools = FBS.concat(FCS);
  const out = [];
  let k = 0;
  for (let si = 0; si < schools.length; si++) {
    for (let pi = 0; pi < PLAYBOOKS.length; pi++) {
      for (let wi = 0; wi < WINDOWS.length; wi++) {
        const school = schoolLabel(schools[si]);
        const playbook = PLAYBOOKS[pi];
        const window = WINDOWS[wi];
        const variant = k % 4;
        k++;
        if (variant === 0)
          out.push(
            `how do you run ${playbook} for ${school} football during the ${window}`
          );
        else if (variant === 1)
          out.push(
            `what is the 2027 NIL GTM playbook for ${playbook} at ${school} before ${window}`
          );
        else if (variant === 2)
          out.push(
            `why do most ${school} football programs fail at ${playbook} heading into ${window}`
          );
        else
          out.push(
            `how should ${school} align collective staff and athletics on ${playbook} for ${window}`
          );
      }
    }
  }
  return out;
}

const PHASES = [
  { id: 'fbs-nil-2027', pool: buildFbsNil2027(), ordered: true },
  { id: 'fcs-nil-2027', pool: buildFcsNil2027(), ordered: true },
  { id: 'nil-longtail-2027', pool: buildNilLongTailTemplates(), ordered: false },
];

const BATCH_SIZES = [FBS.length, FCS.length, 200, 200, 200];

function nextPhaseId(currentId) {
  const idx = PHASES.findIndex((p) => p.id === currentId);
  if (idx < 0) return PHASES[0].id;
  return PHASES[(idx + 1) % PHASES.length].id;
}

function classifyTopicPhase(topic) {
  const q = topicKey(toQuestion(topic));
  for (const phase of PHASES) {
    if (phase.pool.some((line) => topicKey(toQuestion(line)) === q)) return phase.id;
  }
  return 'nil-longtail-2027';
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
  return a;
}

function phaseBatchSize(phaseId, batchIndex) {
  if (phaseId === 'fbs-nil-2027') return FBS.length;
  if (phaseId === 'fcs-nil-2027') return FCS.length;
  return batchIndex === 1 ? BATCH_SIZES[0] : BATCH_SIZES[2] || 200;
}

function generateTopicsBatch(count, seenKeys, seed = 0, phaseHint, batchIndex = 1) {
  const lines = [];
  let activePhase = PHASES.find((p) => p.id === phaseHint) || PHASES[0];

  if (batchIndex > 1 && activePhase.id === 'fbs-nil-2027') {
    activePhase = PHASES.find((p) => p.id === 'fcs-nil-2027') || PHASES[1];
  } else if (batchIndex > 2 && activePhase.id === 'fcs-nil-2027') {
    activePhase = PHASES.find((p) => p.id === 'nil-longtail-2027') || PHASES[2];
  }

  let phaseHops = 0;
  while (lines.length < count && phaseHops < PHASES.length + 2) {
    const pool = activePhase.ordered ? activePhase.pool : shuffle(activePhase.pool);
    let phaseAdded = 0;
    if (activePhase.ordered) {
      for (let i = 0; i < pool.length && lines.length < count; i++) {
        const topic = pool[i];
        const question = toQuestion(topic);
        const key = topicKey(question);
        if (seenKeys.has(key)) continue;
        seenKeys.add(key);
        lines.push(topic);
        phaseAdded++;
      }
    } else {
      for (let i = 0; i < pool.length && lines.length < count; i++) {
        const idx = (i + seed + phaseHops * 41) % pool.length;
        const topic = pool[idx];
        const question = toQuestion(topic);
        const key = topicKey(question);
        if (seenKeys.has(key)) continue;
        seenKeys.add(key);
        lines.push(topic);
        phaseAdded++;
      }
    }
    if (phaseAdded === 0) {
      activePhase = PHASES.find((p) => p.id === nextPhaseId(activePhase.id)) || PHASES[0];
      phaseHops++;
      continue;
    }
    break;
  }

  return {
    lines,
    phaseUsed: activePhase.id,
    batchIndex,
    exhausted: lines.length === 0,
  };
}

function generateTopics(count, seenKeys, seed = 0, phaseHint, batchIndex) {
  return generateTopicsBatch(count, seenKeys, seed, phaseHint, batchIndex).lines;
}

module.exports = {
  generateTopics,
  generateTopicsBatch,
  nextPhaseId,
  classifyTopicPhase,
  topicKey,
  toQuestion,
  isLegacyCroHireTopic,
  BATCH_SIZES,
  PHASES: PHASES.map((p) => ({ id: p.id, size: p.pool.length, ordered: !!p.ordered })),
  FBS_COUNT: FBS.length,
  FCS_COUNT: FCS.length,
};
