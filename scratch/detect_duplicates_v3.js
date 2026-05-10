const fs = require('fs');
const content = fs.readFileSync('messages/en.json', 'utf8');
const lines = content.split('\n');

const scopeStack = [[]];

lines.forEach((line, i) => {
    const lineNum = i + 1;
    if (line.includes('{')) {
        scopeStack.push([]);
    }
    const match = line.match(/"([^"]+)":/);
    if (match) {
        const key = match[1];
        const currentScope = scopeStack[scopeStack.length - 1];
        if (currentScope.includes(key)) {
            console.log(`DUPLICATE KEY: "${key}" at line ${lineNum} (Level ${scopeStack.length})`);
        } else {
            currentScope.push(key);
        }
    }
    if (line.includes('}')) {
        scopeStack.pop();
    }
});
