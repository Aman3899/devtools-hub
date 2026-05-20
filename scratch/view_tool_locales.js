const fs = require('fs');
const path = require('path');

const en = JSON.parse(fs.readFileSync(path.join(__dirname, '../messages/en.json'), 'utf8'));

console.log('aspect-ratio-calculator:', en.tools['aspect-ratio-calculator']);
console.log('prime-number-checker:', en.tools['prime-number-checker']);
