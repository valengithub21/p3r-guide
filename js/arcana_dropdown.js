const ARCANAS = [
  { name: 'All Arcana', value: 'all', img: '' },
  { name: 'Fool', value: 'Fool', img: 'img/arcanas/sg-p3re-arcana-0-fool.jpg' },
  { name: 'Magician', value: 'Magician', img: 'img/arcanas/sg-p3re-arcana-1-magician.jpg' },
  { name: 'Priestess', value: 'Priestess', img: 'img/arcanas/sg-p3re-arcana-2-priestess.jpg' },
  { name: 'Empress', value: 'Empress', img: 'img/arcanas/sg-p3re-arcana-3-empress.jpg' },
  { name: 'Emperor', value: 'Emperor', img: 'img/arcanas/sg-p3re-arcana-4-emperor.jpg' },
  { name: 'Hierophant', value: 'Hierophant', img: 'img/arcanas/sg-p3re-arcana-5-hierophant.jpg' },
  { name: 'Lovers', value: 'Lovers', img: 'img/arcanas/sg-p3re-arcana-6-lovers.jpg' },
  { name: 'Chariot', value: 'Chariot', img: 'img/arcanas/sg-p3re-arcana-7-chariot.jpg' },
  { name: 'Justice', value: 'Justice', img: 'img/arcanas/sg-p3re-arcana-8-justice.jpg' },
  { name: 'Hermit', value: 'Hermit', img: 'img/arcanas/sg-p3re-arcana-9-hermit.jpg' },
  { name: 'Fortune', value: 'Fortune', img: 'img/arcanas/sg-p3re-arcana-10-fortune.jpg' },
  { name: 'Strength', value: 'Strength', img: 'img/arcanas/sg-p3re-arcana-11-strength.jpg' },
  { name: 'Hanged', value: 'Hanged', img: 'img/arcanas/sg-p3re-arcana-12-hanged-man.jpg' }, // Note value is Hanged
  { name: 'Death', value: 'Death', img: 'img/arcanas/sg-p3re-arcana-13-death.jpg' },
  { name: 'Temperance', value: 'Temperance', img: 'img/arcanas/sg-p3re-arcana-14-temperance.jpg' },
  { name: 'Devil', value: 'Devil', img: 'img/arcanas/sg-p3re-arcana-15-devil.jpg' },
  { name: 'Tower', value: 'Tower', img: 'img/arcanas/sg-p3re-arcana-16-tower.jpg' },
  { name: 'Star', value: 'Star', img: 'img/arcanas/sg-p3re-arcana-17-star.jpg' },
  { name: 'Moon', value: 'Moon', img: 'img/arcanas/sg-p3re-arcana-18-moon.jpg' },
  { name: 'Sun', value: 'Sun', img: 'img/arcanas/sg-p3re-arcana-19-sun.jpg' },
  { name: 'Judgement', value: 'Judgement', img: 'img/arcanas/sg-p3re-arcana-20-judgement.jpg' },
  { name: 'Aeon', value: 'Aeon', img: 'img/arcanas/sg-p3re-arcana-20-aeon.jpg' }
];

function toggleArcanaDropdown(e) {
    if(e) e.stopPropagation();
    const menu = document.getElementById('custom-arcana-menu');
    const chevron = document.getElementById('custom-arcana-chevron');
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        chevron.classList.add('rotate-180');
    } else {
        menu.classList.add('hidden');
        chevron.classList.remove('rotate-180');
    }
}

function selectArcana(value, name) {
    document.getElementById('filter-arcana').value = value;
    document.getElementById('custom-arcana-btn-text').innerText = name;
    toggleArcanaDropdown();
    if(typeof filterAndSortCompendium === 'function') {
        filterAndSortCompendium();
    }
}

// Close when clicking outside
document.addEventListener('click', (e) => {
    const container = document.getElementById('custom-arcana-dropdown-container');
    const menu = document.getElementById('custom-arcana-menu');
    const chevron = document.getElementById('custom-arcana-chevron');
    if (container && !container.contains(e.target) && !menu.classList.contains('hidden')) {
        menu.classList.add('hidden');
        chevron.classList.remove('rotate-180');
    }
});

function initArcanaDropdown() {
    const grid = document.getElementById('arcana-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    ARCANAS.forEach(arcana => {
        const div = document.createElement('div');
        div.className = 'cursor-pointer flex flex-col items-center justify-center p-2 rounded-xl hover:bg-theme-hover border border-transparent hover:border-theme-border transition-colors text-center';
        div.onclick = (e) => {
            e.stopPropagation();
            selectArcana(arcana.value, arcana.name);
        };
        
        if (arcana.value === 'all') {
            div.innerHTML = `
                <div class="w-12 h-20 bg-theme-accent/20 rounded-md flex items-center justify-center mb-1 border border-theme-accent/50">
                    <i class="fas fa-layer-group text-theme-accent text-xl"></i>
                </div>
                <span class="text-[10px] font-bold text-theme-text uppercase tracking-wider">${arcana.name}</span>
            `;
        } else {
            div.innerHTML = `
                <img src="${arcana.img}" alt="${arcana.name}" class="w-12 h-20 object-cover rounded-md mb-1 shadow-md border border-black/50">
                <span class="text-[10px] font-bold text-theme-text uppercase tracking-wider truncate w-full">${arcana.name}</span>
            `;
        }
        grid.appendChild(div);
    });
}

// Initialize when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    initArcanaDropdown();
});

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initArcanaDropdown();
}
