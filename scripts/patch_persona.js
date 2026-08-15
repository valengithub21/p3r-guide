const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const targetSafe = html.substring(
    html.indexOf('    function openPersonaDetail(name) {'),
    html.indexOf('      document.getElementById(\'persona-header\').innerHTML = `')
);

const replace = `    function openPersonaDetail(name, push = true) {
      if (push) {
          history.pushState({ screen: 'persona-detail', id: name }, '', '');
          currentScreenState = { screen: 'persona-detail', id: name };
      }
      const p = compendiumData.find(x => x.name === name);
      if (!p) return;
      showScreen('persona-detail', false);
`;

html = html.replace(targetSafe, replace);
fs.writeFileSync('index.html', html);
console.log('Patched openPersonaDetail');
