const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const target1Safe = html.substring(
    html.indexOf('    function openSLinkDetail(id) {'),
    html.indexOf('      // Cabecera del Social Link')
);

const replace1 = `    function openSLinkDetail(id, push = true) {
      if (push) {
          history.pushState({ screen: 'slink-detail', id: id }, '', '');
          currentScreenState = { screen: 'slink-detail', id: id };
      }
      const link = socialLinks.find(s => s.id === id);
      if (!link) return;
      showScreen('slink-detail', false);
`;

html = html.replace(target1Safe, replace1);
fs.writeFileSync('index.html', html);
console.log('Patched openSLinkDetail');
