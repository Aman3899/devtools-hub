const fs = require('fs');
const path = require('path');

const replacements = [
  { from: />\s*Settings\s*</g, to: '>\n              {tCommon(\'ui.settings\')}\n            <' },
  { from: />\s*Customization\s*</g, to: '>\n              {tCommon(\'ui.customization\')}\n            <' },
  { from: />\s*Preview\s*</g, to: '>\n              {tCommon(\'ui.preview\')}\n            <' },
  { from: />\s*Editor\s*</g, to: '>\n              {tCommon(\'ui.editor\')}\n            <' },
  { from: />\s*Options\s*</g, to: '>\n              {tCommon(\'ui.options\')}\n            <' },
  { from: />\s*Result\s*</g, to: '>\n              {tCommon(\'ui.result\')}\n            <' },
  { from: />\s*Output\s*</g, to: '>\n              {tCommon(\'ui.output\')}\n            <' },
  { from: />\s*Code\s*</g, to: '>\n              {tCommon(\'ui.code\')}\n            <' },
  { from: />\s*Privacy\s*</g, to: '>\n              {tCommon(\'ui.privacy\')}\n            <' },
  { from: />\s*Security\s*</g, to: '>\n              {tCommon(\'ui.security\')}\n            <' },
  { from: />\s*Layout\s*</g, to: '>\n              {tCommon(\'ui.layout\')}\n            <' },
  { from: />\s*Live Preview\s*</g, to: '>\n              {tCommon(\'ui.livePreview\')}\n            <' },
  { from: />\s*Details\s*</g, to: '>\n              {tCommon(\'ui.details\')}\n            <' },
  { from: />\s*INFO\s*</g, to: '>\n              {tCommon(\'ui.info\')}\n            <' }
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
console.log('Done replacing common UI text.');
