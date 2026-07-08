// Canonical Anthropic model IDs — single source of truth (owner 2026-07-07).
// Marketing copy may say "Sonnet 4.6"; API calls must use real GA model slugs.
module.exports = {
  // Live visitor / high-quality paths
  VISITOR_ANSWER: process.env.ANTHROPIC_VISITOR_MODEL || 'claude-sonnet-4-20250514',
  BACKGROUND_RESEARCH: process.env.ANTHROPIC_RESEARCH_MODEL || 'claude-sonnet-4-20250514',
  BACKGROUND_PUBLISH: process.env.ANTHROPIC_PUBLISH_MODEL || 'claude-sonnet-4-20250514',
  // Economy cascade fallback (see economy-answer-llm.js)
  ECONOMY_SONNET: 'claude-sonnet-4-20250514',
  ECONOMY_HAIKU: 'claude-3-5-haiku-20241022',
  // Display label for UI / JSON-LD (not an API id)
  MARKETING_LABEL: 'Claude Sonnet 4.6 + Gemini + Grok cascade',
};
