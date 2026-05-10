const fs = require('fs');

function fixJson(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);

    // List of keys that are NOT tools
    const nonToolKeys = ['common', 'tools', 'privacy', 'github', 'changelog'];

    const tools = data.tools || {};
    
    // Iterate through all top-level keys
    Object.keys(data).forEach(key => {
        if (!nonToolKeys.includes(key)) {
            // This is a tool that accidentally became top-level
            tools[key] = data[key];
            delete data[key];
        }
    });

    data.tools = tools;

    // Fix some specific tool issues discovered (like sample being outside)
    // Actually, JSON.parse already handled that if it was valid JSON, 
    // but if I had duplicate keys like "sample", it might have been overwritten.
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Fixed ${filePath}`);
}

fixJson('c:/Users/maman/OneDrive/Desktop/Projects/devtools-hub/messages/en.json');
fixJson('c:/Users/maman/OneDrive/Desktop/Projects/devtools-hub/messages/ur.json');
