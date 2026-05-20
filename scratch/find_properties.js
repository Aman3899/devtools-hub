const fs = require('fs');
const path = require('path');

const en = JSON.parse(fs.readFileSync(path.join(__dirname, '../messages/en.json'), 'utf8'));
const ur = JSON.parse(fs.readFileSync(path.join(__dirname, '../messages/ur.json'), 'utf8'));

const toolsToCheck = [
  'prime-number-checker',
  'gcd-lcm-calculator',
  'bmi-calculator',
  'scientific-calculator',
  'timezone-converter',
  'currency-converter'
];

for (const toolId of toolsToCheck) {
  console.log(`\nTool: ${toolId}`);
  if (en.tools[toolId]) {
    console.log(`  EN faqs exists:`, !!en.tools[toolId].faqs);
    console.log(`  EN article exists:`, !!en.tools[toolId].article);
  } else {
    console.log(`  EN tool missing entirely!`);
  }
  if (ur.tools[toolId]) {
    console.log(`  UR faqs exists:`, !!ur.tools[toolId].faqs);
    console.log(`  UR article exists:`, !!ur.tools[toolId].article);
  } else {
    console.log(`  UR tool missing entirely!`);
  }
}
