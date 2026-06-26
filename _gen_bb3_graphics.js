// Generates 25 BB3 AI-themed graphics (gb0471-gb0495) as 1584x396 LinkedIn-banner SVGs.
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, 'graphics', 'assets');

const PAL = {
  amber:   { c1: '#fbbf24', c2: '#d97706', c3: '#fde68a', ink: '#2a1a02' },
  emerald: { c1: '#34d399', c2: '#059669', c3: '#a7f3d0', ink: '#022c22' },
  sky:     { c1: '#38bdf8', c2: '#0284c7', c3: '#bae6fd', ink: '#0c2740' },
  rose:    { c1: '#fb7185', c2: '#e11d48', c3: '#fecdd3', ink: '#3b0a16' },
  violet:  { c1: '#a78bfa', c2: '#7c3aed', c3: '#ddd6fe', ink: '#1e1b4b' },
  cyan:    { c1: '#22d3ee', c2: '#0891b2', c3: '#a5f3fc', ink: '#083344' },
  indigo:  { c1: '#818cf8', c2: '#4f46e5', c3: '#c7d2fe', ink: '#1e1b4b' },
  orange:  { c1: '#fb923c', c2: '#ea580c', c3: '#fed7aa', ink: '#3a160a' },
  teal:    { c1: '#2dd4bf', c2: '#0d9488', c3: '#99f6e4', ink: '#042f2e' },
  lime:    { c1: '#a3e635', c2: '#65a30d', c3: '#d9f99d', ink: '#172a04' },
  fuchsia: { c1: '#e879f9', c2: '#a21caf', c3: '#f5d0fe', ink: '#3b0a3a' },
};

function radial(transform){return `
  <g transform="${transform}">
    <line x1="0" y1="0" x2="0" y2="-110" stroke="url(#accent)" stroke-width="4" stroke-linecap="round" opacity="0.9"/>
    <line x1="0" y1="0" x2="110" y2="0" stroke="url(#accent)" stroke-width="4" stroke-linecap="round" opacity="0.9"/>
    <line x1="0" y1="0" x2="0" y2="110" stroke="url(#accent)" stroke-width="4" stroke-linecap="round" opacity="0.9"/>
    <line x1="0" y1="0" x2="-110" y2="0" stroke="url(#accent)" stroke-width="4" stroke-linecap="round" opacity="0.9"/>
    <circle cx="0" cy="-110" r="22" fill="none" stroke="url(#accent)" stroke-width="5"/>
    <circle cx="110" cy="0" r="22" fill="none" stroke="url(#accent)" stroke-width="5"/>
    <circle cx="0" cy="110" r="22" fill="none" stroke="url(#accent)" stroke-width="5"/>
    <circle cx="-110" cy="0" r="22" fill="none" stroke="url(#accent)" stroke-width="5"/>
    <circle cx="0" cy="0" r="16" fill="url(#accent)"/>
  </g>`;}

function neuralNet(){return `
  <g transform="translate(1280,198)" stroke="url(#accent)" fill="none" stroke-width="2.5" opacity="0.95">
    <circle cx="-110" cy="-60" r="14" fill="url(#accent)"/>
    <circle cx="-110" cy="0" r="14" fill="url(#accent)"/>
    <circle cx="-110" cy="60" r="14" fill="url(#accent)"/>
    <circle cx="0" cy="-90" r="14" fill="url(#accent)"/>
    <circle cx="0" cy="-30" r="14" fill="url(#accent)"/>
    <circle cx="0" cy="30" r="14" fill="url(#accent)"/>
    <circle cx="0" cy="90" r="14" fill="url(#accent)"/>
    <circle cx="110" cy="-40" r="14" fill="url(#accent)"/>
    <circle cx="110" cy="40" r="14" fill="url(#accent)"/>
    <line x1="-110" y1="-60" x2="0" y2="-90"/>
    <line x1="-110" y1="-60" x2="0" y2="-30"/>
    <line x1="-110" y1="0" x2="0" y2="-30"/>
    <line x1="-110" y1="0" x2="0" y2="30"/>
    <line x1="-110" y1="60" x2="0" y2="30"/>
    <line x1="-110" y1="60" x2="0" y2="90"/>
    <line x1="0" y1="-90" x2="110" y2="-40"/>
    <line x1="0" y1="-30" x2="110" y2="-40"/>
    <line x1="0" y1="30" x2="110" y2="40"/>
    <line x1="0" y1="90" x2="110" y2="40"/>
  </g>`;}

function brain(){return `
  <g transform="translate(1280,198)" stroke="url(#accent)" fill="none" stroke-width="4" opacity="0.95">
    <path d="M-90,-50 Q-60,-90 0,-90 Q60,-90 90,-50 Q120,-10 90,30 Q60,80 0,80 Q-60,80 -90,30 Q-120,-10 -90,-50 Z"/>
    <path d="M0,-90 Q-30,-60 -50,-20 Q-30,0 0,-10 Q30,0 50,-20 Q30,-60 0,-90"/>
    <path d="M-50,-20 Q-60,20 -30,50"/>
    <path d="M50,-20 Q60,20 30,50"/>
    <circle cx="0" cy="0" r="5" fill="url(#accent)"/>
  </g>`;}

function tokens(){return `
  <g transform="translate(1280,198)" opacity="0.95">
    <rect x="-150" y="-15" width="60" height="30" rx="5" fill="url(#accent)"/>
    <rect x="-80" y="-15" width="60" height="30" rx="5" fill="url(#accent)" opacity="0.85"/>
    <rect x="-10" y="-15" width="60" height="30" rx="5" fill="url(#accent)" opacity="0.7"/>
    <rect x="60" y="-15" width="60" height="30" rx="5" fill="url(#accent)" opacity="0.55"/>
    <text x="-120" y="5" text-anchor="middle" font-family="monospace" font-size="14" fill="#0b0f17" font-weight="700">T1</text>
    <text x="-50" y="5" text-anchor="middle" font-family="monospace" font-size="14" fill="#0b0f17" font-weight="700">T2</text>
    <text x="20" y="5" text-anchor="middle" font-family="monospace" font-size="14" fill="#0b0f17" font-weight="700">T3</text>
    <text x="90" y="5" text-anchor="middle" font-family="monospace" font-size="14" fill="#0b0f17" font-weight="700">T4</text>
    <text x="-15" y="60" text-anchor="middle" font-family="'Inter',sans-serif" font-size="14" fill="#94a3b8">tokens</text>
  </g>`;}

function shield(){return `
  <g transform="translate(1280,198)" stroke="url(#accent)" fill="none" stroke-width="5">
    <path d="M0,-130 L100,-90 L100,30 Q100,110 0,140 Q-100,110 -100,30 L-100,-90 Z" opacity="0.9"/>
    <path d="M-40,10 L-15,40 L40,-25" stroke="url(#accent)" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
  </g>`;}

function makeBanner({kicker, headline, sub, palette, deco}) {
  const p = PAL[palette];
  const decoSvg = deco === 'neural' ? neuralNet()
                : deco === 'brain' ? brain()
                : deco === 'tokens' ? tokens()
                : deco === 'shield' ? shield()
                : radial('translate(1260,198)');
  const subRendered = sub.replace(/\s·\s/g, ' <tspan fill="url(#accent)">&#183;</tspan> ');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1584" height="396" viewBox="0 0 1584 396">
  <style>svg{--c1:${p.c1};--c2:${p.c2};--c3:${p.c3};--c4:${p.c1};--c4b:${p.c3};--ink:${p.ink};}</style>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1584" y2="396" gradientUnits="userSpaceOnUse">
      <stop offset="0" style="stop-color:var(--bg1,#0b0f17)"/>
      <stop offset="1" style="stop-color:var(--bg2,#0f172a)"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" style="stop-color:var(--c1,${p.c1})"/>
      <stop offset="0.55" style="stop-color:var(--c2,${p.c2})"/>
      <stop offset="1" style="stop-color:var(--c3,${p.c3})"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.78" cy="0.3" r="0.5">
      <stop offset="0" style="stop-color:var(--c1,${p.c1})" stop-opacity="0.18"/>
      <stop offset="1" style="stop-color:var(--c1,${p.c1})" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect x="0" y="0" width="1584" height="396" fill="url(#bg)"/>
  <rect x="0" y="0" width="1584" height="396" fill="url(#glow)"/>
  ${decoSvg}

  <text x="120" y="180" font-family="'Inter','Segoe UI',system-ui,Arial,sans-serif" font-size="22" font-weight="700" letter-spacing="6" fill="#94a3b8">${kicker}</text>
  <text x="118" y="262" font-family="'Inter','Segoe UI',system-ui,Arial,sans-serif" font-size="72" font-weight="900" fill="#FFFFFF">${headline}</text>
  <text x="120" y="316" font-family="'Inter','Segoe UI',system-ui,Arial,sans-serif" font-size="28" font-weight="700" fill="#EDE5D8">${subRendered}</text>
</svg>
`;
}

const ITEMS = [
  { id:'gb0471', palette:'violet',  deco:'brain',   kicker:'AI ENGINEER',           headline:'LLM Builder.',          sub:'Claude · GPT · Gemini · Llama' },
  { id:'gb0472', palette:'sky',     deco:'neural',  kicker:'ML PLATFORM',            headline:'Vector Database CTO.',  sub:'Pinecone · Qdrant · Weaviate · Vespa' },
  { id:'gb0473', palette:'emerald', deco:'tokens',  kicker:'AI OBSERVABILITY',       headline:'LangSmith Operator.',   sub:'Trace · Eval · Drift · Cost' },
  { id:'gb0474', palette:'amber',   deco:'tokens',  kicker:'GENAI PLATFORM',         headline:'RAG Architect.',        sub:'Connectors · Embeddings · Re-Ranker · LLM' },
  { id:'gb0475', palette:'indigo',  deco:'neural',  kicker:'GPU CLOUD',              headline:'CoreWeave Operator.',   sub:'H100 · H200 · B200 · TPU' },
  { id:'gb0476', palette:'rose',    deco:'shield',  kicker:'AI SAFETY',              headline:'Red Team Lead.',        sub:'PyRIT · Garak · Lakera · OWASP' },
  { id:'gb0477', palette:'teal',    deco:'brain',   kicker:'FINE-TUNING',            headline:'LoRA Engineer.',        sub:'QLoRA · DPO · RLHF · Unsloth' },
  { id:'gb0478', palette:'cyan',    deco:'tokens',  kicker:'EMBEDDINGS API',         headline:'Vector Engineer.',      sub:'OpenAI · Cohere · Voyage · bge' },
  { id:'gb0479', palette:'lime',    deco:'neural',  kicker:'SYNTHETIC DATA',         headline:'Data Generator.',       sub:'Gretel · Tonic · Synthesia · DSPy' },
  { id:'gb0480', palette:'fuchsia', deco:'neural',  kicker:'AI AGENTS',              headline:'Agent Orchestrator.',   sub:'LangGraph · CrewAI · AutoGen · Swarm' },
  { id:'gb0481', palette:'orange',  deco:'tokens',  kicker:'AI EVALS',               headline:'Eval Engineer.',        sub:'Promptfoo · Braintrust · LangSmith · HELM' },
  { id:'gb0482', palette:'sky',     deco:'brain',   kicker:'AI CODING',              headline:'Cursor Operator.',      sub:'Claude Code · Cursor · Cline · Devin' },
  { id:'gb0483', palette:'violet',  deco:'brain',   kicker:'COMPUTER VISION',        headline:'CV Engineer.',          sub:'Rekognition · CLIP · YOLO · Florence' },
  { id:'gb0484', palette:'emerald', deco:'tokens',  kicker:'SPEECH AI',              headline:'STT Operator.',         sub:'Whisper · Deepgram · AssemblyAI · Speechmatics' },
  { id:'gb0485', palette:'amber',   deco:'tokens',  kicker:'VOICE AI',               headline:'TTS Engineer.',         sub:'ElevenLabs · Hume · Cartesia · Play.ht' },
  { id:'gb0486', palette:'rose',    deco:'brain',   kicker:'AI IMAGE',               headline:'Image Engineer.',       sub:'DALL-E · Midjourney · Stable Diffusion · Flux' },
  { id:'gb0487', palette:'indigo',  deco:'brain',   kicker:'AI VIDEO',               headline:'Video Engineer.',       sub:'Runway · Pika · Luma · Veo' },
  { id:'gb0488', palette:'fuchsia', deco:'tokens',  kicker:'AI MUSIC',               headline:'Music Engineer.',       sub:'Suno · Udio · Stable Audio · MusicGen' },
  { id:'gb0489', palette:'teal',    deco:'tokens',  kicker:'AI TRANSLATION',         headline:'Translation Engineer.', sub:'DeepL · Google · GPT · Claude' },
  { id:'gb0490', palette:'cyan',    deco:'tokens',  kicker:'DOCUMENT INTELLIGENCE',  headline:'Doc AI Engineer.',      sub:'Textract · Form Recognizer · Unstructured · Reducto' },
  { id:'gb0491', palette:'lime',    deco:'tokens',  kicker:'AI SALES COACHING',      headline:'Sales AI Operator.',    sub:'Gong · Chorus · Outreach · Salesloft' },
  { id:'gb0492', palette:'orange',  deco:'tokens',  kicker:'AI CUSTOMER SUPPORT',    headline:'CX AI Operator.',       sub:'Intercom · Zendesk · Sierra · Decagon' },
  { id:'gb0493', palette:'sky',     deco:'tokens',  kicker:'AI RECRUITING',          headline:'Talent AI Operator.',   sub:'Eightfold · HireVue · Paradox · Mercor' },
  { id:'gb0494', palette:'violet',  deco:'shield',  kicker:'AI LEGAL',               headline:'Legal AI Operator.',    sub:'Harvey · CoCounsel · Spellbook · Robin AI' },
  { id:'gb0495', palette:'emerald', deco:'brain',   kicker:'AI CODE REVIEW',         headline:'Code Review AI.',       sub:'Greptile · CodeRabbit · Qodo · Bito' },
];

let wrote = 0;
for (const it of ITEMS) {
  const svg = makeBanner(it);
  const p = path.join(OUT_DIR, it.id + '.svg');
  fs.writeFileSync(p, svg);
  wrote++;
  console.log('wrote', it.id);
}
console.log('done.', wrote, 'svgs');
