// _seed_ai_infra100.js — build the AI Infrastructure sprint queue: 50 Top-10 +
// 50 regular Q&As, deduped vs the live index, ids assigned sequentially from the
// current max ai id. Writes _ai_sprint_queue100.json. Real topics, no fabrication.
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const norm = t => String(t || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const TOP10 = [
  'The 10 Best Vector Databases for RAG in 2027',
  'The 10 Best GPU Cloud Providers for AI Training in 2027',
  'The 10 Best LLM Inference Servers in 2027',
  'The 10 Best MLOps Platforms in 2027',
  'The 10 Best AI Model Monitoring Tools in 2027',
  'The 10 Best Feature Stores for Machine Learning in 2027',
  'The 10 Best Data Labeling Platforms for AI in 2027',
  'The 10 Best RAG Frameworks in 2027',
  'The 10 Best LLM Gateways in 2027',
  'The 10 Best Model Registries in 2027',
  'The 10 Best GPU Orchestration Tools for Kubernetes in 2027',
  'The 10 Best LLM Fine-Tuning Platforms in 2027',
  'The 10 Best Embedding Models for Search and RAG in 2027',
  'The 10 Best AI Observability Platforms in 2027',
  'The 10 Best Prompt Management Tools in 2027',
  'The 10 Best LLM Guardrails and Safety Tools in 2027',
  'The 10 Best Synthetic Data Generation Tools in 2027',
  'The 10 Best Model Serving Frameworks in 2027',
  'The 10 Best AI Data Pipeline Tools in 2027',
  'The 10 Best Experiment Tracking Tools for ML in 2027',
  'The 10 Best AI Workflow Orchestration Tools in 2027',
  'The 10 Best LLM Evaluation Tools in 2027',
  'The 10 Best Real-Time ML Feature Platforms in 2027',
  'The 10 Best AI Compute Cost Optimization Tools in 2027',
  'The 10 Best Distributed Training Frameworks in 2027',
  'The 10 Best LLM Quantization and Inference Optimization Tools in 2027',
  'The 10 Best AI Agent Frameworks in 2027',
  'The 10 Best Retrieval and Search Infrastructure Tools for AI in 2027',
  'The 10 Best Open-Source Model Hubs in 2027',
  'The 10 Best Edge AI Deployment Platforms in 2027',
  'The 10 Best GPU Monitoring Tools in 2027',
  'The 10 Best LLMOps Platforms in 2027',
  'The 10 Best Data Versioning Tools for ML in 2027',
  'The 10 Best Multi-Cloud AI Platforms in 2027',
  'The 10 Best Model Compression Tools in 2027',
  'The 10 Best Streaming Data Platforms for AI in 2027',
  'The 10 Best Semantic Caching Tools for LLM Apps in 2027',
  'The 10 Best LLM Routing and Load Balancing Tools in 2027',
  'The 10 Best Confidential Computing Platforms for AI in 2027',
  'The 10 Best AI Model CI/CD Tools in 2027',
  'The 10 Best Fractional GPU and GPU Sharing Tools in 2027',
  'The 10 Best Data Annotation QA Tools in 2027',
  'The 10 Best Time-Series Databases for AI in 2027',
  'The 10 Best Infrastructure-as-Code Tools for AI Platforms in 2027',
  'The 10 Best Secrets Management Tools for LLM Applications in 2027',
  'The 10 Best Open-Source LLMs for Self-Hosting in 2027',
  'The 10 Best AI Inference Accelerators in 2027',
  'The 10 Best Data Warehouses for Machine Learning in 2027',
  'The 10 Best Foundation Model API Providers in 2027',
  'The 10 Best AI Observability Tools for RAG Pipelines in 2027',
];

const REGULAR = [
  'How do you choose a vector database for a production RAG system in 2027?',
  'What is an AI gateway and why do enterprises need one?',
  'How do you reduce GPU costs when serving large language models?',
  'What is the difference between vLLM, TGI, and Triton for LLM inference?',
  'How do you scale LLM inference to handle thousands of concurrent users?',
  'What is model quantization and when should you use it?',
  'How do you build a self-hosted LLM stack in 2027?',
  'What is an MLOps platform and what problems does it solve?',
  'How do you monitor LLMs in production for drift and hallucinations?',
  'What is a feature store and do you still need one for LLM apps?',
  'How do you architect a RAG pipeline for low latency?',
  'How do you handle GPU scheduling on Kubernetes for AI workloads?',
  'How do you secure an LLM application’s infrastructure?',
  'What is LLMOps and how does it differ from MLOps?',
  'How do you evaluate LLM output quality at scale?',
  'What is a semantic cache and how much can it cut inference costs?',
  'How do you fine-tune an open-source LLM cost-effectively?',
  'What infrastructure do you need to run AI agents in production?',
  'How do you choose between cloud GPUs and on-prem for AI workloads?',
  'What is the role of an embedding model in AI infrastructure?',
  'How do you prevent prompt injection at the infrastructure layer?',
  'What is model serving and how is it different from a REST API?',
  'How do you version datasets and models for reproducibility?',
  'What is distributed training and when do you need it?',
  'How do you set up observability for a RAG application?',
  'What causes high latency in LLM inference and how do you fix it?',
  'How do you A/B test different LLMs in production?',
  'What is the best architecture for multi-tenant AI applications?',
  'How do you manage secrets and API keys for LLM applications?',
  'What is GPU memory fragmentation and how do you avoid it?',
  'How do you deploy AI models at the edge?',
  'What is a model registry and why does it matter for governance?',
  'How do you build data pipelines for continuous model training?',
  'What infrastructure does retrieval-augmented generation require?',
  'How do you optimize cold-start latency for serverless AI inference?',
  'What is the difference between batch and real-time inference infrastructure?',
  'How do you implement guardrails for an enterprise LLM deployment?',
  'What is confidential computing and why does it matter for AI?',
  'How do you choose an inference accelerator: GPU, TPU, or custom silicon?',
  'How do you build a cost dashboard for AI and LLM spend?',
  'What is the best way to cache embeddings at scale?',
  'How do you route requests across multiple LLM providers?',
  'What is a vector index and how do HNSW and IVF differ?',
  'How do you load-test an LLM inference service?',
  'What infrastructure do you need for fine-tuning versus RAG?',
  'How do you handle model rollbacks safely in production?',
  'What is the role of Kubernetes in modern AI infrastructure?',
  'How do you measure and improve GPU utilization?',
  'What are the biggest hidden costs in running AI infrastructure?',
  'How do you design a disaster recovery plan for AI services?',
];

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const have = new Set(idx.entries.map(e => norm(e.question)));
  let maxAi = 0;
  for (const e of idx.entries) { const m = String(e.id).match(/^ai(\d+)$/); if (m) maxAi = Math.max(maxAi, +m[1]); }
  const items = [];
  const push = (title, kind) => { if (have.has(norm(title))) { console.log('SKIP dup:', title); return; } maxAi++; items.push({ id: 'ai' + String(maxAi).padStart(3, '0'), title, kind, prefix: 'ai' }); };
  // interleave so a serial writer alternates top10 / regular
  const n = Math.max(TOP10.length, REGULAR.length);
  for (let i = 0; i < n; i++) { if (TOP10[i]) push(TOP10[i], 'top10'); if (REGULAR[i]) push(REGULAR[i], 'regular'); }
  fs.writeFileSync('C:/Users/koryj/website/_ai_sprint_queue100.json', JSON.stringify(items, null, 1));
  const t10 = items.filter(i => i.kind === 'top10').length, reg = items.filter(i => i.kind === 'regular').length;
  console.log(`queue: ${items.length} items (${t10} top10 + ${reg} regular) | ids ${items[0].id}..${items[items.length - 1].id}`);
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
