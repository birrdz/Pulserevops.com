const fs = require('fs');
const path = 'C:\\Users\\koryj\\.cursor\\projects\\C-Users-koryj-website\\agent-transcripts\\4ca10bd6-f3de-4bb8-be1e-22ef722d6ee0\\4ca10bd6-f3de-4bb8-be1e-22ef722d6ee0.jsonl';
const out = 'C:\\Users\\koryj\\website\\_restore_mosaic_script.txt';
const lines = fs.readFileSync(path, 'utf8').split(/\n/);
for (const line of lines) {
  if (!line.includes('ONE MOSAIC HOMEPAGE') || !line.includes('old_string')) continue;
  const obj = JSON.parse(line);
  for (const part of obj.message.content) {
    if (part.type === 'tool_use' && part.name === 'StrReplace' && part.input.path.includes('index.html')) {
      fs.writeFileSync(out, part.input.old_string);
      console.log('extracted', part.input.old_string.length);
      process.exit(0);
    }
  }
}
process.exit(1);
