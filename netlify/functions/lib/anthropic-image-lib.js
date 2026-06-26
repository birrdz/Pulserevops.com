// Anthropic image generation placeholder — no public image-gen API as of 2026.
// Pipeline slot #3: attempt/skip gracefully (return null); do not block downstream DDG.

function anthropicKey() {
  return process.env.ANTHROPIC_API_KEY || null;
}

/** @returns {Promise<string|null>} hosted URL or null */
async function anthropicCoverFor(_title, _id) {
  if (!anthropicKey()) return null;
  // Wire Anthropic image API here when available.
  return null;
}

/** @returns {Promise<string|null>} hosted URL or null */
async function anthropicProductFor(_name, _id) {
  if (!anthropicKey()) return null;
  return null;
}

module.exports = {
  anthropicKey,
  anthropicCoverFor,
  anthropicProductFor,
};
