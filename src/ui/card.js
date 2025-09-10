// card.js
// 提供建立與更新寶可夢卡片的函式。

import { colorForType } from '../utils/type-colors.js';

let templateEl = null;

function ensureTemplateLoaded() {
  if (!templateEl) {
    templateEl = document.querySelector('#pokemon-card-template');
    if (!templateEl) {
      console.warn('[card] template #pokemon-card-template not found (did you include card-template.html?)');
    }
  }
  return templateEl;
}

export function renderCard(pokemon) {
  ensureTemplateLoaded();
  if (!templateEl) return null;
  const fragment = templateEl.content.cloneNode(true);
  const card = fragment.querySelector('.poke-card');
  // A11y: 讓卡片可聚焦並以 Enter/Space 翻面
  card.setAttribute('role', 'button');
  card.tabIndex = 0;
  applyData(card, pokemon);
  card.addEventListener('click', () => flipCard(card));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      flipCard(card);
    }
  });
  return card;
}

export function updateCard(cardEl, pokemon) {
  applyData(cardEl, pokemon);
}

function applyData(cardEl, pokemon) {
  if (!cardEl || !pokemon) return;
  cardEl.dataset.id = pokemon.id;
  const nameEl = cardEl.querySelector('.name');
  const enNameEl = cardEl.querySelector('.english-name');
  const imgEl = cardEl.querySelector('.sprite');
  const animatedImgEl = cardEl.querySelector('.animated');
  const descEl = cardEl.querySelector('.description');
  const typesEl = cardEl.querySelector('.types');
  const hpBadgeVal = cardEl.querySelector('.hp-badge .hp-value');
  const statHp = cardEl.querySelector('.stat-value.hp');
  const statAtk = cardEl.querySelector('.stat-value.attack');
  const statDef = cardEl.querySelector('.stat-value.defense');
  const statSpd = cardEl.querySelector('.stat-value.speed');

  if (nameEl) nameEl.textContent = pokemon.name;
  if (enNameEl) {
    // 假設英/中名稱相同時不重複顯示
    if (pokemon.name && pokemon.name.toLowerCase() === (pokemon.englishName || '').toLowerCase()) {
      enNameEl.textContent = '';
    } else {
      enNameEl.textContent = pokemon.englishName || '';
    }
  }
  if (imgEl) {
    imgEl.src = pokemon.imageUrl;
    imgEl.alt = pokemon.name || 'pokemon';
  }
  if (animatedImgEl) {
    const anim = pokemon.animatedImage || pokemon.imageUrl;
    animatedImgEl.src = anim;
    animatedImgEl.alt = (pokemon.name || 'pokemon') + ' animated image';
  }
  if (descEl) descEl.textContent = pokemon.description;
  if (typesEl) {
    typesEl.innerHTML = '';
    pokemon.types.forEach(t => {
      const span = document.createElement('span');
      span.className = 'badge rounded-pill bg-secondary';
      span.textContent = t;
      typesEl.appendChild(span);
    });
  }
  if (hpBadgeVal) hpBadgeVal.textContent = pokemon.hp ?? 0;
  if (statHp) statHp.textContent = pokemon.hp ?? 0;
  if (statAtk) statAtk.textContent = pokemon.attack ?? 0;
  if (statDef) statDef.textContent = pokemon.defense ?? 0;
  if (statSpd) statSpd.textContent = pokemon.speed ?? 0;

  // 主色背景套用在卡片外層（或可改在 front/back）
  if (pokemon.primaryType) {
    const color = colorForType(pokemon.primaryType);
    cardEl.style.setProperty('--primary-color', color);
    cardEl.querySelectorAll('.poke-card-face.front').forEach(face => {
      face.style.background = `linear-gradient(160deg, ${color} 0%, #ffffff 75%)`;
    });
  }
}

export function flipCard(cardEl) {
  if (!cardEl) return;
  cardEl.classList.toggle('is-flipped');
}

export const __testables = { applyData, ensureTemplateLoaded };
