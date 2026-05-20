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

// Read registry.ts
const registryFilePath = path.join(__dirname, '../src/config/tools-registry.ts');
const registryContent = fs.readFileSync(registryFilePath, 'utf8');

const registryIds = [];
// Parse keys like 'json-formatter': {
const keyRegex = /'([^']+)':\s*{/g;
while ((match = keyRegex.exec(registryContent)) !== null) {
  registryIds.push(match[1]);
}

console.log(`Found ${toolIds.length} tools in tools.ts`);
console.log(`Found ${registryIds.length} tools in tools-registry.ts`);

const missingInRegistry = toolIds.filter(id => !registryIds.includes(id));
const extraInRegistry = registryIds.filter(id => !toolIds.includes(id));

console.log('Missing in registry:', missingInRegistry);
console.log('Extra in registry:', extraInRegistry);
