    tailwind.config = {
      theme: {
        extend: {
          keyframes: {
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
          colors: {
            theme: {
              card: 'var(--theme-card)',
              'card-dark': 'var(--theme-card-dark)',
              hover: 'var(--theme-hover)',
              border: 'var(--theme-border)',
              text: 'var(--theme-text)',
              muted: 'var(--theme-muted)',
              accent: 'var(--theme-accent)',
              'accent-bg': 'var(--theme-accent-bg)'
            }
          }
        }
      }
    }
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js');
    }

    let currentScreenState = { screen: 'home' };
    
    // Initialize history on load
    window.addEventListener('DOMContentLoaded', () => {
        if (!history.state) {
            history.replaceState({ screen: 'home' }, '', '#home');
        } else {
            currentScreenState = history.state;
            restoreScreen(history.state);
        }
    });

    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.screen) {
            currentScreenState = event.state;
            restoreScreen(event.state);
        } else {
            currentScreenState = { screen: 'home' };
            showScreen('home', false);
        }
    });

    function restoreScreen(state) {
        if (state.screen === 'slink-detail') {
            openSLinkDetail(state.id, false);
        } else if (state.screen === 'persona-detail') {
            openPersonaDetail(state.id, false);
        } else if (state.screen === 'slinks') {
            showScreen('slinks', false);
            if (typeof renderSLinksList === 'function') renderSLinksList();
        } else if (state.screen === 'compendium') {
            showScreen('compendium', false);
            if (typeof renderCompendium === 'function') renderCompendium();
        } else if (state.screen === 'answers') {
            showScreen('answers', false);
            if (typeof renderAnswers === 'function') renderAnswers();
        } else {
            showScreen('home', false);
        }
    }

    function showScreen(screen, push = true) {
      if (push && currentScreenState.screen !== screen) {
         history.pushState({ screen: screen }, '', '#' + screen);
         currentScreenState = { screen: screen };
      }

      ['screen-home', 'screen-answers', 'screen-slinks', 'screen-slink-detail', 'screen-compendium', 'screen-persona-detail'].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.classList.add('hidden');
      });
      
      const backBtn = document.getElementById('back-btn');
      if (screen === 'home') {
        document.getElementById('screen-home').classList.remove('hidden');
        backBtn.classList.add('hidden');
        document.documentElement.style.setProperty('--current-bg-img', "url('img/persona-3-reload2.jpg')");
      } else {
        document.getElementById('screen-' + screen).classList.remove('hidden');
        backBtn.classList.remove('hidden');
        
        // Use history.back() for the in-app back button to keep states synchronized
        backBtn.setAttribute('onclick', 'history.back()');
        
        if (screen === 'compendium' || screen === 'persona-detail') {
          document.documentElement.style.setProperty('--current-bg-img', "url('img/persona3-reload4.jpg')");
        } else if (screen === 'slinks' || screen === 'slink-detail') {
          document.documentElement.style.setProperty('--current-bg-img', "url('img/persona-3-reload3.jpg')");
        } else if (screen === 'answers') {
          document.documentElement.style.setProperty('--current-bg-img', "url('img/persona-3-reload.jpg')");
        } else {
          document.documentElement.style.setProperty('--current-bg-img', "url('img/persona-3-reload2.jpg')");
        }
      }
    }
    function switchSLinkTab(tab) {
      ['answers', 'unlocks', 'phone', 'gifts'].forEach(t => {
        const el = document.getElementById('slink-content-' + t);
        if(el) el.classList.add('hidden');
        
        const btn = document.getElementById('tab-' + t);
        if(btn) {
            btn.classList.remove('text-theme-accent', 'border-theme-accent');
            btn.classList.add('text-theme-muted', 'border-transparent');
        }
      });
      
      const targetEl = document.getElementById('slink-content-' + tab);
      if(targetEl) targetEl.classList.remove('hidden');
      
      const activeBtn = document.getElementById('tab-' + tab);
      if(activeBtn) {
          activeBtn.classList.remove('text-theme-muted', 'border-transparent');
          activeBtn.classList.add('text-theme-accent', 'border-theme-accent');
      }
    }

    function toggleFavorite(e, id) {
      e.stopPropagation();
      let favs = JSON.parse(localStorage.getItem('p3r-favs') || '[]');
      if (favs.includes(id)) {
        favs = favs.filter(f => f !== id);
      } else {
        favs.push(id);
      }
      localStorage.setItem('p3r-favs', JSON.stringify(favs));
      renderSLinksList();
    }

    function renderSLinksList() {
      const grid = document.getElementById('slinks-grid');
      grid.innerHTML = ''; 
      if (typeof socialLinks === 'undefined') return;
      
      let favs = JSON.parse(localStorage.getItem('p3r-favs')) || [];
      let sortedLinks = [...socialLinks].sort((a, b) => {
          let aFav = favs.includes(a.id) ? 1 : 0;
          let bFav = favs.includes(b.id) ? 1 : 0;
          return bFav - aFav; // Favorites first
      });

      sortedLinks.forEach(link => {
        const card = document.createElement('div');
        card.className = "relative slink-card p3r-card p-4 rounded-xl text-center flex flex-col items-center justify-center cursor-pointer hover:bg-theme-accent-bg transition";
        card.onclick = () => openSLinkDetail(link.id);
        
        card.innerHTML = `
          <button onclick="toggleFavorite(event, '${link.id}')" class="absolute top-2 right-2 text-lg focus:outline-none transition-transform hover:scale-125 z-10 ${favs.includes(link.id) ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]' : 'text-theme-muted hover:text-theme-muted'}">
             <i class="fas fa-star"></i>
          </button>
          <img src="${link.image}" alt="${link.name}" class="w-16 h-16 object-cover rounded-full mb-2 border-2 ${link.borderColor}">
          <h3 class="font-bold text-theme-text text-sm leading-tight">${link.name}</h3>
          <p class="text-xs text-theme-muted mt-1">${link.arcana}</p>
        `;
        grid.appendChild(card);
      });
    }

    function openSLinkDetail(id, push = true) {
      if (push) {
          history.pushState({ screen: 'slink-detail', id: id }, '', '#slink-detail-' + id);
          currentScreenState = { screen: 'slink-detail', id: id };
      }
      const link = socialLinks.find(s => s.id === id);
      if (!link) return;
      showScreen('slink-detail', false);
      // Cabecera del Social Link
      document.getElementById('slink-header').innerHTML = `
        <img src="${link.image}" alt="${link.name}" class="w-24 h-24 object-cover rounded-full mx-auto mb-3 border-4 ${link.borderColor}">
        <h2 class="text-2xl font-bold text-theme-text">${link.name}</h2>
        <p class="text-sm text-theme-accent tracking-widest uppercase mt-1">${link.arcana}</p>
        ${link.req ? `<p class="text-xs text-red-400 mt-3 bg-red-900/30 p-2 rounded inline-block border border-red-500/30">${link.req}</p>` : ''}
      `;

      // Pestanas
            document.getElementById('slink-tabs-container').innerHTML = `
        <div class="flex border-b border-theme-border mb-4 mt-2 ">
          <button id="tab-answers" onclick="switchSLinkTab('answers')" class="flex-1 px-3 py-2 text-xs md:text-sm font-bold text-theme-accent border-b-2 border-theme-accent transition">Ranks</button>
          <button id="tab-phone" onclick="switchSLinkTab('phone')" class="flex-1 px-3 py-2 text-xs md:text-sm font-bold text-theme-muted border-b-2 border-transparent transition">Events</button>
          <button id="tab-gifts" onclick="switchSLinkTab('gifts')" class="flex-1 px-3 py-2 text-xs md:text-sm font-bold text-theme-muted border-b-2 border-transparent transition">Gifts</button>
          <button id="tab-unlocks" onclick="switchSLinkTab('unlocks')" class="flex-1 px-3 py-2 text-xs md:text-sm font-bold text-theme-muted border-b-2 border-transparent transition">Skills</button>
        </div>
      `;

      // 1. Respuestas de Diálogo
      const ranksContainer = document.getElementById('slink-content-answers');
      ranksContainer.innerHTML = '';

      if (link.availability) {
        ranksContainer.innerHTML += `
        <details class="mb-4 bg-theme-card border border-theme-border rounded-xl overflow-hidden group">
          <summary class="cursor-pointer p-3 text-theme-accent font-bold hover:bg-theme-hover transition-colors select-none flex items-center justify-between">
            <span class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Availability & Location
            </span>
            <svg class="w-5 h-5 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linecap="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </summary>
          <div class="p-4 border-t border-theme-border bg-theme-card-dark">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p class="text-xs text-theme-accent uppercase tracking-wider mb-1">Location</p>
                <p class="text-sm text-theme-text">${link.availability.location}</p>
              </div>
              <div>
                <p class="text-xs text-theme-accent uppercase tracking-wider mb-1">Time of Day</p>
                <p class="text-sm text-theme-text">${link.availability.time}</p>
              </div>
              <div>
                <p class="text-xs text-theme-accent uppercase tracking-wider mb-1">Unlocks On</p>
                <p class="text-sm text-theme-text">${link.availability.unlock}</p>
              </div>
            </div>
            
            <p class="text-xs text-theme-accent uppercase tracking-wider mb-2">Weekly Schedule</p>
            <div class="flex gap-1 mb-4 text-center text-[10px] sm:text-xs">
              ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => `
                <div class="flex-1 rounded p-1 ${link.availability.days[day] ? 'bg-theme-accent-bg text-theme-accent' : 'bg-theme-card-dark text-theme-muted'} border ${link.availability.days[day] ? 'border-theme-border' : 'border-theme-border'}">
                  <div class="font-bold mb-1">${day}</div>
                  <div class="text-sm font-black">${link.availability.days[day] ? '✓' : '✗'}</div>
                </div>
              `).join('')}
            </div>

            <p class="text-xs text-theme-accent uppercase tracking-wider mb-2">Monthly Availability</p>
            <div class="flex gap-1 text-center text-[10px] sm:text-xs">
              ${['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'].map(month => `
                <div class="flex-1 rounded p-1 ${link.availability.months[month] ? 'bg-[var(--theme-accent-bg)] text-[var(--theme-accent)] font-bold' : 'bg-theme-card-dark text-theme-muted'} border ${link.availability.months[month] ? 'border-theme-border' : 'border-theme-border'}">
                  <div class="font-bold mb-1">${month}</div>
                  <div class="text-sm font-black">${link.availability.months[month] ? '✓' : '✗'}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </details>
        `;
      }

      if (!link.ranks || link.ranks.length === 0) {
        ranksContainer.innerHTML = `<p class="text-theme-muted text-center italic mt-4">Automatic S.Link or no dialogue choices.</p>`;
      } else {
        link.ranks.forEach((r, idx) => {          let promptsHTML = r.prompts.map(p => {            let optionsHTML = p.options.map(opt => {              let isBest = opt.best ? 'bg-theme-accent-bg border-theme-accent text-theme-text font-bold' : 'bg-theme-card border-theme-border text-theme-muted';              let checkIcon = opt.best ? '<i class="fas fa-check-circle text-theme-accent mr-2"></i>' : '<i class="far fa-circle text-theme-muted mr-2"></i>';              let pointsBadge = opt.points > 0 ? `<span class="ml-2 text-xs font-bold bg-theme-accent-bg text-theme-text px-2 py-0.5 rounded whitespace-nowrap">+${opt.points}</span>` : '';                            let textToDisplay = opt.text === '(Any response)' ? '-' : opt.text;              if (textToDisplay === '-') {                 isBest = 'bg-theme-card border-theme-border text-theme-muted opacity-70';                 checkIcon = '<i class="fas fa-minus text-theme-muted mr-2"></i>';              }                            return `<div class="p-2 mb-2 rounded-lg border ${isBest} text-sm flex items-center justify-between"><div class="flex items-start"><div class="mt-0.5">${checkIcon}</div><span>${textToDisplay}</span></div>${pointsBadge}</div>`;            }).join('');            
            let qText = p.question
                .replace(/\[Romance\]/g, '<span class="text-pink-400 font-bold">[Romance]</span>')
                .replace(/\[Romance Route\]/g, '<span class="text-pink-400 font-bold">[Romance]</span>')
                .replace(/\[Platonic\]/g, '<span class="text-purple-400 font-bold">[Platonic]</span>')
                .replace(/\[ALT Platonic\]/g, '<span class="text-purple-400 font-bold">[ALT Platonic]</span>');
            return `<div class="mb-5 last:mb-0"><p class="text-sm text-theme-muted font-semibold mb-3 flex items-start gap-2"><i class="fas fa-comment-dots mt-1 text-theme-accent"></i><span>${qText}</span></p>${optionsHTML}</div>`;
          }).join('<div class="h-px bg-[var(--theme-border)] my-4"></div>');                    let reqHTML = r.req ? `<div class="mt-5 p-3 bg-emerald-900/20 border border-emerald-500/50 rounded-lg text-emerald-300 text-sm flex items-start gap-2"><i class="fas fa-check-circle mt-0.5"></i><span>${r.req}</span></div>` : '';                    let contentId = `slink-rank-${idx}-${Math.random().toString(36).substr(2, 9)}`;          ranksContainer.innerHTML += `            <div class="p3r-card rounded-xl overflow-hidden mb-3 border-l-2 border-[var(--theme-accent)] transition-colors">              <div class="bg-theme-card p-3 flex justify-between items-center cursor-pointer select-none hover:bg-theme-hover" onclick="document.getElementById('${contentId}').classList.toggle('hidden'); this.querySelector('.fa-chevron-down').classList.toggle('rotate-180');">                <span class="font-bold text-theme-accent">Rank ${r.rank}</span>                <i class="fas fa-chevron-down text-theme-muted text-sm transition-transform duration-300"></i>              </div>              <div id="${contentId}" class="p-3 bg-theme-card-dark hidden">                 ${promptsHTML}                 ${reqHTML}              </div>            </div>          `;        });      }      // 2. Habilidades / Recompensas (Soporta múltiples formatos de datos)
      const unlocksContainer = document.getElementById('slink-content-unlocks');
      unlocksContainer.innerHTML = '';
      const rewardsList = link.rewards || link.unlocks || link.skills || [];
      
      if (rewardsList.length === 0) {
         unlocksContainer.innerHTML = `<p class="text-theme-muted text-center italic mt-4">This character does not grant special skills or they are not registered.</p>`;
      } else {
         rewardsList.forEach(u => {
           let title = u.name || u.rank || "Recompensa";
           let desc = u.desc || u.effect || u.text || u;
           unlocksContainer.innerHTML += `
             <div class="p3r-card p-4 rounded-xl mb-3 border-l-4 border-purple-500">
               <h4 class="text-theme-text font-bold mb-1">${title}</h4>
               <p class="text-sm text-theme-muted">${desc}</p>
             </div>
           `;
         });
      }

                        // 3. Events (Summer Fest + Phone)
      const phoneContainer = document.getElementById('slink-content-phone');
      phoneContainer.innerHTML = '';
      
      let eventsHTML = '';
      
      if (link.summerFestival) {
          eventsHTML += `
                <div class="p3r-card rounded-xl overflow-hidden mb-4 border-l-2 border-orange-500 transition-colors">
                  <div class="bg-theme-card p-3 flex justify-between items-center cursor-pointer select-none hover:bg-theme-hover" onclick="document.getElementById('summer-fest').classList.toggle('hidden'); this.querySelector('.fa-chevron-down').classList.toggle('rotate-180');">
                    <span class="font-bold text-orange-300">🎆 Summer Festival (${link.summerFestival.date})</span>
                    <i class="fas fa-chevron-down text-theme-muted text-sm transition-transform duration-300"></i>
                  </div>
                  <div id="summer-fest" class="p-3 bg-theme-card-dark hidden">
                     <p class="text-sm text-theme-muted font-semibold mb-3 flex items-start gap-2">
                        <i class="fas fa-fire mt-1 text-orange-500"></i><span>${link.summerFestival.prompt}</span>
                     </p>
                     <div class="p-2 mb-2 rounded-lg border bg-theme-accent-bg border-theme-accent text-theme-text font-bold text-sm flex items-center justify-between">
                        <div class="flex items-start"><div class="mt-0.5"><i class="fas fa-check-circle text-theme-accent mr-2"></i></div><span>${link.summerFestival.response}</span></div>
                        ${link.summerFestival.pts ? `<span class="ml-2 text-xs font-bold bg-orange-800 text-orange-100 px-2 py-0.5 rounded whitespace-nowrap">${link.summerFestival.pts}</span>` : ''}
                     </div>
                  </div>
                </div>
          `;
      }

      const phoneList = link.phoneInvites || [];
      if (phoneList.length > 0) {
          if (link.summerFestival) {
              eventsHTML += '<h4 class="text-xs font-bold text-theme-accent uppercase tracking-wider mb-2 mt-4">Phone Invites</h4>';
          }
          phoneList.forEach((inv, idx) => {
              let ptsHTML = inv.pts ? `<span class="ml-2 text-xs font-bold bg-theme-accent-bg text-theme-text px-2 py-0.5 rounded whitespace-nowrap">${inv.pts}</span>` : '';
              let contentId = `slink-phone-${idx}-${Math.random().toString(36).substr(2, 9)}`;
              eventsHTML += `
                <div class="p3r-card rounded-xl overflow-hidden mb-3 border-l-2 border-purple-500 transition-colors">
                  <div class="bg-theme-card p-3 flex justify-between items-center cursor-pointer select-none hover:bg-theme-hover" onclick="document.getElementById('${contentId}').classList.toggle('hidden'); this.querySelector('.fa-chevron-down').classList.toggle('rotate-180');">
                    <span class="font-bold text-purple-300">Rank ${inv.rank}</span>
                    <i class="fas fa-chevron-down text-theme-muted text-sm transition-transform duration-300"></i>
                  </div>
                  <div id="${contentId}" class="p-3 bg-theme-card-dark hidden">
                     <p class="text-sm text-theme-muted font-semibold mb-3 flex items-start gap-2">
                        <i class="fas fa-phone-alt mt-1 text-purple-500"></i><span>${inv.prompt}</span>
                     </p>
                     <div class="p-2 mb-2 rounded-lg border bg-theme-accent-bg border-theme-accent text-theme-text font-bold text-sm flex items-center justify-between">
                        <div class="flex items-start"><div class="mt-0.5"><i class="fas fa-check-circle text-theme-accent mr-2"></i></div><span>${inv.response}</span></div>${ptsHTML}
                     </div>
                  </div>
                </div>
              `;
          });
      }
      
      if (phoneList.length === 0 && !link.summerFestival) {
          eventsHTML = `<p class="text-theme-muted text-center italic mt-4">This character has no registered phone or special events.</p>`;
      }
      
      phoneContainer.innerHTML = eventsHTML;

      // 4. Gifts
      const giftsContainer = document.getElementById('slink-content-gifts');
      giftsContainer.innerHTML = '';
      const giftsList = link.gifts || link.favGifts || link.bestGifts || [];
      
      if (giftsList.length > 0) {
         giftsList.forEach(g => {
           let giftName = typeof g === 'string' ? g : (g.name || g.item);
           let giftReaction = typeof g === 'object' && (g.reaction || g.pts) ? (g.reaction || g.pts) : "+50";
           
           if (!String(giftReaction).includes('+')) giftReaction = '+' + giftReaction;

           giftsContainer.innerHTML += `
             <div class="p3r-card p-3 rounded-xl mb-2 flex justify-between items-center border border-pink-500/30">
               <span class="text-sm font-bold text-theme-text">${giftName}</span>
               <span class="text-xs bg-pink-900/50 text-pink-300 py-1 px-2 rounded-lg border border-pink-500/30 font-bold">${giftReaction}</span>
             </div>
           `;
         });
      } else {
          giftsContainer.innerHTML = `<p class="text-theme-muted text-center italic mt-4">This character does not receive gifts or they are not registered.</p>`;
      }
      
      switchSLinkTab('answers'); 
    }

    function renderAnswers() {
      const container = document.getElementById('answers-list');
      const searchTerm = document.getElementById('search-answers').value.toLowerCase();
      container.innerHTML = '';

      if (typeof classAnswers === 'undefined') return;

      classAnswers.forEach(monthGroup => {
        // Filtramos los items dentro del mes que coincidan con la búsqueda
        const filteredItems = monthGroup.items.filter(item => 
          item.date.toLowerCase().includes(searchTerm) || 
          item.question.toLowerCase().includes(searchTerm) || 
          item.answer.toLowerCase().includes(searchTerm) ||
          monthGroup.month.toLowerCase().includes(searchTerm)
        );

        // Si hay resultados para este mes, renderizamos el bloque del mes
                if (filteredItems.length > 0) {
          let isSearching = searchTerm.trim() !== '';
          let html = `
            <details class="month-group mb-4 border border-theme-border rounded-xl overflow-hidden group" ${isSearching ? 'open' : ''}>
              <summary class="cursor-pointer p-3 bg-theme-hover hover:bg-theme-hover transition-colors select-none flex items-center justify-between border-b border-theme-border">
                <h3 class="text-lg font-black text-theme-accent">${monthGroup.month}</h3>
                <svg class="w-5 h-5 text-theme-accent transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </summary>
              <div class="p-4 space-y-3 bg-theme-card-dark">
          `;

          filteredItems.forEach(item => {
            html += `
              <div class="p3r-card p-4 rounded-xl border-l-4 border-l-[var(--theme-accent)]">
                <span class="text-xs font-bold text-theme-accent tracking-widest block mb-2">${item.date.replace('(Exam)', '<span class="text-yellow-400">(Exam)</span>')}</span>
                <p class="text-sm text-theme-text mb-3 italic">${item.question}</p>
                <p class="text-sm font-bold text-theme-text bg-theme-card-dark p-2 rounded border border-theme-border">✓ ${item.answer}</p>
              </div>
            `;
          });

          html += `</div></details>`;
          container.innerHTML += html;
        }
      });

      if (container.innerHTML === '') {
        container.innerHTML = '<p class="text-theme-muted text-center italic mt-4">No se encontraron resultados.</p>';
      }
    }

    function filterSLinks() {
      let input = document.getElementById('search-slink').value.toLowerCase();
      let cards = document.getElementsByClassName('slink-card');
      for (let card of cards) {
        let text = card.innerText.toLowerCase();
        if (text.includes(input)) { card.style.display = "flex"; } 
        else { card.style.display = "none"; }
      }
    }

    function renderCompendium() {
      filterAndSortCompendium();
    }

    function filterAndSortCompendium() {
      const list = document.getElementById('compendium-list');
      list.innerHTML = '';
      if (typeof compendiumData === 'undefined') return;

      let textInput = document.getElementById('search-persona').value.toLowerCase();
      let arcanaFilter = document.getElementById('filter-arcana').value;
      let sortOption = document.getElementById('sort-compendium').value;

      let filtered = compendiumData.filter(persona => {
        let matchesText = persona.name.toLowerCase().includes(textInput);
        let matchesArcana = (arcanaFilter === 'all' || persona.arcana === arcanaFilter);
        return matchesText && matchesArcana;
      });

      filtered.sort((a, b) => {
        if (sortOption === 'lvl-asc') return a.lvl - b.lvl;
        if (sortOption === 'lvl-desc') return b.lvl - a.lvl;
        if (sortOption === 'name-asc') return a.name.localeCompare(b.name);
      });

      filtered.forEach(persona => {
        const item = document.createElement('div');
        item.className = "p3r-card p-3 rounded-xl flex items-center justify-between border-l-4 border-[var(--theme-accent)] cursor-pointer hover:bg-theme-hover transition";
        item.onclick = () => openPersonaDetail(persona.name);
        
        item.innerHTML = `
          <div class="flex items-center gap-3">
            <div class="bg-[var(--theme-accent-bg)] text-[var(--theme-accent)] font-black text-sm w-10 h-10 flex items-center justify-center rounded-lg border border-theme-border">
              ${persona.lvl}
            </div>
            <div>
              <h3 class="font-bold text-theme-text">${persona.name}</h3>
              <p class="text-xs text-theme-muted">${persona.arcana}</p>
            </div>
          </div>
          <div class="text-theme-muted text-xs text-right w-24">
            ${persona.special ? '<i class="fas fa-star text-yellow-500"></i> Especial' : 'Estándar'}
          </div>
        `;
        list.appendChild(item);
      });
    }

    function openPersonaDetail(name, push = true) {
      if (push) {
          history.pushState({ screen: 'persona-detail', id: name }, '', '#persona-detail-' + encodeURIComponent(name));
          currentScreenState = { screen: 'persona-detail', id: name };
      }
      const p = compendiumData.find(x => x.name === name);
      if (!p) return;
      showScreen('persona-detail', false);
      document.getElementById('persona-header').innerHTML = `
        <h2 class="text-2xl font-bold text-theme-text">${p.name}</h2>
        <p class="text-sm text-theme-accent tracking-widest uppercase mt-1">${p.arcana} - Level ${p.lvl}</p>
      `;

      const shadowContainer = document.getElementById('persona-shadow');
      if (p.shadowName) {
        shadowContainer.innerHTML = `<span class="text-xs text-theme-muted uppercase tracking-wider block mb-1">Nombre de Sombra</span><span class="text-theme-text font-bold text-sm">${p.shadowName}</span>`;
        shadowContainer.classList.remove('hidden');
      } else {
        shadowContainer.classList.add('hidden');
      }

      let statsHTML = '';
      if (p.stats) {
         statsHTML = `
           <h3 class="text-theme-accent font-bold mb-3 border-b border-theme-border pb-1">Estadísticas</h3>
           <div class="flex justify-between text-center">
             <div><p class="text-xs text-theme-muted">FU</p><p class="text-theme-text font-bold">${p.stats.st}</p></div>
             <div><p class="text-xs text-theme-muted">MA</p><p class="text-theme-text font-bold">${p.stats.ma}</p></div>
             <div><p class="text-xs text-theme-muted">EN</p><p class="text-theme-text font-bold">${p.stats.en}</p></div>
             <div><p class="text-xs text-theme-muted">AG</p><p class="text-theme-text font-bold">${p.stats.ag}</p></div>
             <div><p class="text-xs text-theme-muted">SU</p><p class="text-theme-text font-bold">${p.stats.lu}</p></div>
           </div>
         `;
      } else { statsHTML = '<p class="text-theme-muted italic text-sm">Estadísticas no disponibles aún.</p>'; }
      document.getElementById('persona-stats').innerHTML = statsHTML;

      let affHTML = '<h3 class="text-theme-accent font-bold mb-3 border-b border-theme-border pb-1">Affinities</h3>';
      if (p.affinities) {
        affHTML += `
          <div class="grid grid-cols-3 gap-2 text-center text-sm">
             <div class="bg-[var(--theme-accent-bg)] p-1 rounded border border-theme-border"><span class="block text-xs text-theme-muted">Slash</span><span class="text-[var(--theme-accent)] font-bold">${p.affinities.slash}</span></div>
             <div class="bg-[var(--theme-accent-bg)] p-1 rounded border border-theme-border"><span class="block text-xs text-theme-muted">Strike</span><span class="text-[var(--theme-accent)] font-bold">${p.affinities.strike}</span></div>
             <div class="bg-[var(--theme-accent-bg)] p-1 rounded border border-theme-border"><span class="block text-xs text-theme-muted">Pierce</span><span class="text-[var(--theme-accent)] font-bold">${p.affinities.pierce}</span></div>
             <div class="bg-[var(--theme-accent-bg)] p-1 rounded border border-theme-border"><span class="block text-xs text-theme-muted">Fire</span><span class="text-[var(--theme-accent)] font-bold">${p.affinities.fire}</span></div>
             <div class="bg-[var(--theme-accent-bg)] p-1 rounded border border-theme-border"><span class="block text-xs text-theme-muted">Ice</span><span class="text-[var(--theme-accent)] font-bold">${p.affinities.ice}</span></div>
             <div class="bg-[var(--theme-accent-bg)] p-1 rounded border border-theme-border"><span class="block text-xs text-theme-muted">Elec</span><span class="text-[var(--theme-accent)] font-bold">${p.affinities.elec}</span></div>
             <div class="bg-[var(--theme-accent-bg)] p-1 rounded border border-theme-border"><span class="block text-xs text-theme-muted">Wind</span><span class="text-[var(--theme-accent)] font-bold">${p.affinities.wind}</span></div>
             <div class="bg-[var(--theme-accent-bg)] p-1 rounded border border-theme-border"><span class="block text-xs text-theme-muted">Light</span><span class="text-[var(--theme-accent)] font-bold">${p.affinities.light}</span></div>
             <div class="bg-[var(--theme-accent-bg)] p-1 rounded border border-theme-border"><span class="block text-xs text-theme-muted">Dark</span><span class="text-[var(--theme-accent)] font-bold">${p.affinities.dark}</span></div>
          </div>
        `;
      } else { affHTML += '<p class="text-theme-muted italic text-sm">Affinities not registered.</p>'; }
      document.getElementById('persona-affinities').innerHTML = affHTML;

      let skillsHTML = '<h3 class="text-theme-accent font-bold mb-3 border-b border-theme-border pb-1">Skills</h3>';
      if (p.skills && p.skills.length > 0) {
        skillsHTML += p.skills.map(s => `
          <div class="mb-2 last:mb-0 bg-theme-card-dark/50 p-2 rounded border border-theme-border">
            <div class="flex justify-between items-center mb-1">
              <span class="font-bold text-theme-text text-sm">${s.name}</span>
              <span class="text-xs bg-[var(--theme-accent-bg)] text-[var(--theme-accent)] border border-theme-border px-2 py-0.5 rounded">${s.cost}</span>
            </div>
            <p class="text-xs text-theme-muted">${s.desc}</p>
          </div>
        `).join('');
      } else { skillsHTML += '<p class="text-theme-muted italic text-sm">No skills registered.</p>'; }
      document.getElementById('persona-skills').innerHTML = skillsHTML;

      let fusionHTML = '<h3 class="text-theme-accent font-bold mb-3 border-b border-theme-border pb-1">Fusions (Examples)</h3>';
      if (p.fusions && p.fusions.length > 0) {
        fusionHTML += '<ul class="list-disc pl-5 text-sm text-theme-muted space-y-1">';
        fusionHTML += p.fusions.map(f => `<li>${f}</li>`).join('');
        fusionHTML += '</ul>';
      } else { fusionHTML += '<p class="text-theme-muted italic text-sm">Fusion recipes not registered.</p>'; }
      document.getElementById('persona-fusions').innerHTML = fusionHTML;
    }
    window.addEventListener('scroll', () => {
      const btn = document.getElementById('backToTop');
      if (window.scrollY > 300) {
        btn.classList.remove('opacity-0', 'pointer-events-none');
        btn.classList.add('opacity-100', 'pointer-events-auto');
      } else {
        btn.classList.add('opacity-0', 'pointer-events-none');
        btn.classList.remove('opacity-100', 'pointer-events-auto');
      }
    });
    function updateActiveThemeBtn(theme) {
       document.querySelectorAll('.theme-btn').forEach(btn => {
           if(btn.dataset.themeId === theme) {
               btn.classList.add('ring-2', 'ring-theme-accent', 'bg-theme-hover');
           } else {
               btn.classList.remove('ring-2', 'ring-theme-accent', 'bg-theme-hover');
           }
       });
    }

    function setTheme(theme) {
       localStorage.setItem('p3r-theme', theme);
       applyTheme(theme);
       updateActiveThemeBtn(theme);
    }

    function applyTheme(theme) {
       let activeTheme = theme;
       if (theme === 'system') {
           activeTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
       }
       document.documentElement.setAttribute('data-theme', activeTheme);
    }

    // Init theme
    const savedTheme = localStorage.getItem('p3r-theme') || 'default';
    applyTheme(savedTheme);
    
    // Listen for system changes if system theme is selected
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if(localStorage.getItem('p3r-theme') === 'system') {
            applyTheme('system');
        }
    });
    
    window.addEventListener('DOMContentLoaded', () => {
        updateActiveThemeBtn(savedTheme);
    });
