const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.join(__dirname, '../src'));
console.log(`Searching through ${files.length} files...`);

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('overflow-hidden') || content.includes('h-screen') || content.includes('max-h-')) {
    const lines = content.split('\n');
    lines.forEach((line, i) => {
      if (line.includes('overflow-hidden') || line.includes('h-screen') || line.includes('max-h-')) {
        console.log(`${path.relative(path.join(__dirname, '..'), file)}:${i+1}: ${line.trim()}`);
      }
    });
  }
}
