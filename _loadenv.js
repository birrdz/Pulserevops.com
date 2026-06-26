// Preload (-r ./_loadenv.js): loads .env.local into process.env without dotenv dep.
const fs = require('fs');
try {
  for (const line of fs.readFileSync(require('path').join(__dirname, '.env.local'), 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) { /* no .env.local — rely on shell env */ }
