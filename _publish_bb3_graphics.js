// Publishes the 25 BB3 AI-themed graphics
const { execSync } = require('child_process');

const ITEMS = [
  { id:'gb0471', title:'LLM Builder AI Engineer — LinkedIn Banner',          cat:'linkedin-banner', desc:'Banner for AI engineers building on Claude, GPT, Gemini, and Llama foundation models — recolor and drop into LinkedIn.' },
  { id:'gb0472', title:'Vector Database CTO — LinkedIn Banner',              cat:'linkedin-banner', desc:'Banner for vector database CTOs and ML platform leaders running Pinecone, Qdrant, Weaviate, or Vespa — recolor and download.' },
  { id:'gb0473', title:'AI Observability Operator — LinkedIn Banner',        cat:'linkedin-banner', desc:'Banner for AI observability engineers running LangSmith, Braintrust, Arize, or Helicone for production LLM monitoring — recolor and download.' },
  { id:'gb0474', title:'RAG Architect GenAI Platform — LinkedIn Banner',     cat:'linkedin-banner', desc:'Banner for RAG architects building production retrieval-augmented generation platforms with connectors, embeddings, re-rankers, and LLMs — recolor and download.' },
  { id:'gb0475', title:'GPU Cloud Operator CoreWeave — LinkedIn Banner',     cat:'linkedin-banner', desc:'Banner for GPU cloud operators running NVIDIA H100, H200, B200, or Google TPUs at scale for AI training and inference — recolor and download.' },
  { id:'gb0476', title:'AI Safety Red Team Lead — LinkedIn Banner',          cat:'linkedin-banner', desc:'Banner for AI safety red teamers running PyRIT, Garak, Lakera, and OWASP LLM Top 10 probes against production AI — recolor and download.' },
  { id:'gb0477', title:'LoRA Fine-Tuning Engineer — LinkedIn Banner',        cat:'linkedin-banner', desc:'Banner for fine-tuning engineers running QLoRA, DPO, RLHF, and Unsloth on Llama, Mistral, or DeepSeek base models — recolor and download.' },
  { id:'gb0478', title:'Embeddings API Vector Engineer — LinkedIn Banner',   cat:'linkedin-banner', desc:'Banner for embeddings engineers running OpenAI text-embedding-3, Cohere embed-v4, Voyage, or self-hosted bge models — recolor and download.' },
  { id:'gb0479', title:'Synthetic Data Generator — LinkedIn Banner',         cat:'linkedin-banner', desc:'Banner for synthetic data engineers running Gretel, Tonic, Synthesia, or DSPy for training data augmentation — recolor and download.' },
  { id:'gb0480', title:'AI Agent Orchestrator — LinkedIn Banner',            cat:'linkedin-banner', desc:'Banner for AI agent orchestrators building on LangGraph, CrewAI, AutoGen, or OpenAI Swarm — recolor and download.' },
  { id:'gb0481', title:'AI Evals Engineer — LinkedIn Banner',                cat:'linkedin-banner', desc:'Banner for AI evaluation engineers running Promptfoo, Braintrust, LangSmith, and HELM-style benchmarks — recolor and download.' },
  { id:'gb0482', title:'AI Coding Operator Cursor Claude Code — LinkedIn Banner', cat:'linkedin-banner', desc:'Banner for AI coding operators running Cursor, Claude Code, Cline, or Cognition Devin for agentic engineering workflows — recolor and download.' },
  { id:'gb0483', title:'Computer Vision Engineer — LinkedIn Banner',         cat:'linkedin-banner', desc:'Banner for computer vision engineers running AWS Rekognition, CLIP, YOLO, or Microsoft Florence vision models — recolor and download.' },
  { id:'gb0484', title:'Speech-to-Text Operator — LinkedIn Banner',          cat:'linkedin-banner', desc:'Banner for speech-to-text engineers running OpenAI Whisper, Deepgram, AssemblyAI, or Speechmatics in production — recolor and download.' },
  { id:'gb0485', title:'TTS Voice AI Engineer — LinkedIn Banner',            cat:'linkedin-banner', desc:'Banner for voice AI engineers running ElevenLabs, Hume AI, Cartesia, or Play.ht for production text-to-speech — recolor and download.' },
  { id:'gb0486', title:'AI Image Engineer — LinkedIn Banner',                cat:'linkedin-banner', desc:'Banner for AI image engineers running OpenAI DALL-E, Midjourney, Stable Diffusion, or Flux for production image generation — recolor and download.' },
  { id:'gb0487', title:'AI Video Engineer — LinkedIn Banner',                cat:'linkedin-banner', desc:'Banner for AI video engineers running Runway, Pika Labs, Luma, or Google Veo for production video generation — recolor and download.' },
  { id:'gb0488', title:'AI Music Engineer — LinkedIn Banner',                cat:'linkedin-banner', desc:'Banner for AI music engineers running Suno, Udio, Stability MusicGen, or Stable Audio for music generation — recolor and download.' },
  { id:'gb0489', title:'AI Translation Engineer — LinkedIn Banner',          cat:'linkedin-banner', desc:'Banner for AI translation engineers running DeepL, Google Translate, GPT, or Claude for production multilingual workflows — recolor and download.' },
  { id:'gb0490', title:'Document Intelligence AI Engineer — LinkedIn Banner', cat:'linkedin-banner', desc:'Banner for document AI engineers running AWS Textract, Azure Form Recognizer, Unstructured, or Reducto for document workflows — recolor and download.' },
  { id:'gb0491', title:'AI Sales Coaching Operator — LinkedIn Banner',       cat:'linkedin-banner', desc:'Banner for AI sales coaching operators running Gong, Chorus, Outreach, or Salesloft for sales call intelligence — recolor and download.' },
  { id:'gb0492', title:'AI Customer Support Operator — LinkedIn Banner',     cat:'linkedin-banner', desc:'Banner for AI customer support operators running Intercom Fin, Zendesk AI, Sierra, or Decagon for autonomous support — recolor and download.' },
  { id:'gb0493', title:'AI Recruiting Operator — LinkedIn Banner',           cat:'linkedin-banner', desc:'Banner for AI recruiting operators running Eightfold, HireVue, Paradox, or Mercor for talent acquisition workflows — recolor and download.' },
  { id:'gb0494', title:'AI Legal Operator — LinkedIn Banner',                cat:'linkedin-banner', desc:'Banner for AI legal operators running Harvey, CoCounsel, Spellbook, or Robin AI for legal workflows — recolor and download.' },
  { id:'gb0495', title:'AI Code Review Operator — LinkedIn Banner',          cat:'linkedin-banner', desc:'Banner for AI code review operators running Greptile, CodeRabbit, Qodo, or Bito for automated code review — recolor and download.' },
];

let ok = 0, fail = 0;
for (const it of ITEMS) {
  const cmd = `node _write_gb.js ${it.id} "${it.title.replace(/"/g, '\\"')}" ${it.cat} "${it.desc.replace(/"/g, '\\"')}"`;
  try {
    const out = execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    const last = out.trim().split('\n').pop();
    const j = JSON.parse(last);
    if (j.ok) { console.log('OK', it.id, j.url); ok++; }
    else      { console.log('FAIL', it.id, last); fail++; }
  } catch (e) {
    console.log('ERR', it.id, String(e.stderr || e.message).slice(0, 200));
    fail++;
  }
}
console.log(`---\npublished ${ok}/${ITEMS.length}  fail=${fail}`);
