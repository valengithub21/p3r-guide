const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(
  "history.replaceState({ screen: 'home' }, '', '');",
  "history.replaceState({ screen: 'home' }, '', '#home');"
);

html = html.replace(
  "history.pushState({ screen: screen }, '', '');",
  "history.pushState({ screen: screen }, '', '#' + screen);"
);

html = html.replace(
  "history.pushState({ screen: 'slink-detail', id: id }, '', '');",
  "history.pushState({ screen: 'slink-detail', id: id }, '', '#slink-detail-' + id);"
);

html = html.replace(
  "history.pushState({ screen: 'persona-detail', id: name }, '', '');",
  "history.pushState({ screen: 'persona-detail', id: name }, '', '#persona-detail-' + encodeURIComponent(name));"
);

fs.writeFileSync('index.html', html);
console.log('Patched hashes');
