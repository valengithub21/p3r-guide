const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace('<div id="slink-content-answers" class="space-y-2"></div>', '<div id="slink-content-answers" class="space-y-2 animate-fade-in-up"></div>');
html = html.replace('<div id="slink-content-unlocks" class="hidden space-y-2"></div>', '<div id="slink-content-unlocks" class="hidden space-y-2 animate-fade-in-up"></div>');
html = html.replace('<div id="slink-content-phone" class="hidden space-y-2"></div>', '<div id="slink-content-phone" class="hidden space-y-2 animate-fade-in-up"></div>');
html = html.replace('<div id="slink-content-gifts" class="hidden space-y-2"></div>', '<div id="slink-content-gifts" class="hidden space-y-2 animate-fade-in-up"></div>');

fs.writeFileSync('index.html', html);
console.log('Patched SLink tabs');
