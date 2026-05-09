const fs = require('fs');
const path = require('path');

const replacements = [
  { from: /'Result will appear here...'/g, to: 'tCommon(\'ui.result\')' },
  { from: /"Result will appear here..."/g, to: 'tCommon(\'ui.result\')' }
];

const featuresDir = path.join(__dirname, 'src/features');

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('-client.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      
      for (const rep of replacements) {
        if (rep.from.test(content)) {
          content = content.replace(rep.from, rep.to);
          modified = true;
        }
      }
      
      if (modified) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

walkDir(featuresDir);
console.log('Done replacing result text.');
