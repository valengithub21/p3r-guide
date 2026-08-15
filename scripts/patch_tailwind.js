const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const tailwindConfigTarget = `          colors: {`;

const tailwindConfigReplace = `          keyframes: {
            'fade-in-up': {
              '0%': { opacity: '0', transform: 'translateY(15px)' },
              '100%': { opacity: '1', transform: 'translateY(0)' },
            },
            'scale-in': {
              '0%': { opacity: '0', transform: 'scale(0.95)' },
              '100%': { opacity: '1', transform: 'scale(1)' },
            }
          },
          animation: {
            'fade-in-up': 'fade-in-up 0.3s ease-out forwards',
            'scale-in': 'scale-in 0.25s ease-out forwards'
          },
          colors: {`;

html = html.replace(tailwindConfigTarget, tailwindConfigReplace);

html = html.replace('<main id="screen-home" class="space-y-4">', '<main id="screen-home" class="space-y-4 animate-fade-in-up">');
html = html.replace('<main id="screen-slinks" class="hidden space-y-4">', '<main id="screen-slinks" class="hidden space-y-4 animate-fade-in-up">');
html = html.replace('<main id="screen-slink-detail" class="hidden space-y-4">', '<main id="screen-slink-detail" class="hidden space-y-4 animate-fade-in-up">');
html = html.replace('<main id="screen-compendium" class="hidden space-y-4">', '<main id="screen-compendium" class="hidden space-y-4 animate-fade-in-up">');
html = html.replace('<main id="screen-persona-detail" class="hidden space-y-4">', '<main id="screen-persona-detail" class="hidden space-y-4 animate-fade-in-up">');
html = html.replace('<main id="screen-answers" class="hidden space-y-4">', '<main id="screen-answers" class="hidden space-y-4 animate-fade-in-up">');

fs.writeFileSync('index.html', html);
console.log('Patched animations');
