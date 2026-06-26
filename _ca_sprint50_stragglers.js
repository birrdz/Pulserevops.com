// Image straggler fix for ca0924–ca0973 (DDG per missing @@PRODUCT img=).
const { execSync } = require('child_process');
const ids = [];
for (let i = 924; i <= 973; i++) ids.push('ca' + String(i).padStart(4, '0'));
execSync(`node _ca_fix_stragglers.js ${ids.join(' ')}`, { cwd: 'C:/Users/koryj/website', stdio: 'inherit' });
