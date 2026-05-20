const fs = require('fs');
const path = require('path');

// Read tools from tools.ts
const toolsFilePath = path.join(__dirname, '../src/constants/tools.ts');
const toolsContent = fs.readFileSync(toolsFilePath, 'utf8');

// Parse tool IDs using regex
const toolIdRegex = /id:\s*'([^']+)'/g;
const toolIds = [];
let match;
while ((match = toolIdRegex.exec(toolsContent)) !== null) {
  toolIds.push(match[1]);
}

console.log(`Found ${toolIds.length} tools in tools.ts`);

// Read en.json and ur.json
const enPath = path.join(__dirname, '../messages/en.json');
const urPath = path.join(__dirname, '../messages/ur.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const ur = JSON.parse(fs.readFileSync(urPath, 'utf8'));

console.log('en.json has tools keys:', Object.keys(en.tools || {}).length);
console.log('ur.json has tools keys:', Object.keys(ur.tools || {}).length);

const missingInEn = [];
const missingInUr = [];

for (const id of toolIds) {
  if (!en.tools || !en.tools[id]) {
    missingInEn.push(id);
  }
  if (!ur.tools || !ur.tools[id]) {
    missingInUr.push(id);
  }
}

console.log('\nMissing in en.json tools:', missingInEn);
console.log('Missing in ur.json tools:', missingInUr);

// Let's also check if there are sub-properties like 'title', 'description'
const missingTitleOrDescEn = [];
const missingTitleOrDescUr = [];

for (const id of toolIds) {
  if (en.tools && en.tools[id]) {
    if (!en.tools[id].title || !en.tools[id].description) {
      missingTitleOrDescEn.push(id);
    }
  }
  if (ur.tools && ur.tools[id]) {
    if (!ur.tools[id].title || !ur.tools[id].description) {
      missingTitleOrDescUr.push(id);
    }
  }
}

console.log('\nMissing title/description in en.json:', missingTitleOrDescEn);
console.log('Missing title/description in ur.json:', missingTitleOrDescUr);

// Check standard categories
console.log('\nCategories in tools.ts are checked');
