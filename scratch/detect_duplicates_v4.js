const fs = require('fs');
const content = fs.readFileSync('messages/en.json', 'utf8');

// Match everything like "key":
const matches = content.match(/"[^"]+":/g);
if (matches) {
    const counts = {};
    matches.forEach(m => {
        counts[m] = (counts[m] || 0) + 1;
    });
    for (const m in counts) {
        if (counts[m] > 1) {
            // This is expected for "title": etc.
            // But for tool IDs it's not.
            if (!['"title":', '"description":', '"input":', '"output":', '"article":', '"faqs":', '"q0":', '"a0":', '"q1":', '"a1":', '"placeholder":', '"sample":', '"custom":'].includes(m)) {
                console.log(`Potential duplicate: ${m} (${counts[m]} times)`);
            }
        }
    }
}
