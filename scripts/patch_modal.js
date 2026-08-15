const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const modalTarget = `<div class="p3r-card w-full max-w-sm rounded-2xl p-5 border border-theme-border flex flex-col gap-4 relative">`;
const modalReplace = `<div class="p3r-card w-full max-w-sm rounded-2xl p-5 border border-theme-border flex flex-col gap-4 relative animate-scale-in">`;

html = html.replace(modalTarget, modalReplace);

fs.writeFileSync('index.html', html);
console.log('Patched modal');
