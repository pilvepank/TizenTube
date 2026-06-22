const fs = require('fs');
const path = require('path');

const dir = 'c:/koodimine/qsymphonyfix/mods/translations/resources';
fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.json')) {
        const filepath = path.join(dir, file);
        try {
            JSON.parse(fs.readFileSync(filepath, 'utf8'));
            console.log(`${file}: OK`);
        } catch (e) {
            console.error(`${file}: ERROR - ${e.message}`);
        }
    }
});
