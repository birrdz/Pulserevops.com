const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const fs = require('fs');
const code = fs.readFileSync('./_ca_sprint50_bodies.js', 'utf8');
const fnBlock = code.match(/function buildBody[\s\S]*?(?=\nfunction publish)/)[0];
eval(fnBlock + '\n' + code.match(/function poolFor[\s\S]*?(?=\nfunction v)/)[0] + '\n' + code.match(/function v[\s\S]*?(?=\nfunction parseTitle)/)[0] + '\n' + code.match(/function parseTitle[\s\S]*?(?=\nfunction section)/)[0] + '\n' + code.match(/function section[\s\S]*?(?=\nfunction buildBody)/)[0]);
const SOURCES = `- [Car and Driver](https://www.caranddriver.com/)`;
// simpler - just require by refactoring
