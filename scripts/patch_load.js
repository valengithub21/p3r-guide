const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const targetSafe = `    window.addEventListener('DOMContentLoaded', () => {
        if (!history.state) {
            history.replaceState({ screen: 'home' }, '', '');
        }
    });`;

const replace = `    window.addEventListener('DOMContentLoaded', () => {
        if (!history.state) {
            history.replaceState({ screen: 'home' }, '', '');
        } else {
            currentScreenState = history.state;
            restoreScreen(history.state);
        }
    });`;

html = html.replace(targetSafe, replace);
fs.writeFileSync('index.html', html);
console.log('Patched DOMContentLoaded');
