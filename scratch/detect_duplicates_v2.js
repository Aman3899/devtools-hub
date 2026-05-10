const fs = require('fs');

function checkDuplicates(obj, path = '') {
    if (typeof obj !== 'object' || obj === null) return;

    // We can't use a standard JSON parser to find duplicates as it overrides them.
    // We need to parse the JSON manually or use a library.
    // Since we don't have a library, let's use a regex-based approach for each level.
}

// Better manual detector
const content = fs.readFileSync('messages/en.json', 'utf8');
const lines = content.split('\n');

const scopeStack = [[]]; // Stack of arrays of keys at each level

lines.forEach((line, i) => {
    const lineNum = i + 1;

    // Check for opening brace (new scope)
    if (line.includes('{')) {
        scopeStack.push([]);
    }

    // Check for key
    const match = line.match(/^\s*"([^"]+)"\s*:/);
    if (match) {
        const key = match[1];
        const currentScope = scopeStack[scopeStack.length - 1];
        if (scopeStack.length === 2) { // Top level keys (1 for root, 2 for first level)
            console.log(`Top level key: "${key}" at line ${lineNum}`);
        }
        if (currentScope.includes(key)) {
            console.log(`DUPLICATE KEY FOUND: "${key}" at line ${lineNum}`);
        } else {
            currentScope.push(key);
        }
    }

    // Check for closing brace (end scope)
    if (line.includes('}')) {
        scopeStack.pop();
    }
});
