const fs = require('fs');

function findDuplicateKeys(jsonString) {
    const keys = [];
    JSON.parse(jsonString, (key, value) => {
        // This won't work as JSON.parse already handles duplicates (last one wins)
        return value;
    });
}

// Manual parsing to find duplicates
function getDuplicates(content) {
    const lines = content.split('\n');
    const stack = [{}];
    const duplicates = [];

    lines.forEach((line, index) => {
        const match = line.match(/^\s*"([^"]+)"\s*:/);
        if (match) {
            const key = match[1];
            // This is a naive check but might work for flat-ish structures or identifying the line
            // Real duplicate detection would need a full parser that tracks keys per level
        }
    });
}

// Let's use a simpler approach: sort keys and find adjacent identical ones?
// No, that won't help with line numbers.

// Let's just try to parse it with a library that throws on duplicates if possible, 
// or just grep for common keys.

const content = fs.readFileSync('messages/en.json', 'utf8');
const lines = content.split('\n');
const keyCounts = {};

lines.forEach((line, i) => {
    const match = line.match(/^\s*"([^"]+)"\s*:/);
    if (match) {
        const key = match[1];
        const lineNum = i + 1;
        if (!keyCounts[key]) keyCounts[key] = [];
        keyCounts[key].push(lineNum);
    }
});

for (const key in keyCounts) {
    if (keyCounts[key].length > 1) {
        console.log(`Duplicate key "${key}" found at lines: ${keyCounts[key].join(', ')}`);
    }
}
