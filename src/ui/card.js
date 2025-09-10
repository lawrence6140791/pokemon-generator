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
  const imgEl = cardEl.querySelector('.sprite');
  const descEl = cardEl.querySelector('.description');
  const typesEl = cardEl.querySelector('.types');
  if (nameEl) nameEl.textContent = pokemon.name;
  if (imgEl) {
    imgEl.src = pokemon.imageUrl;
    imgEl.alt = pokemon.name || 'pokemon';
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
  // 主色背景套用在卡片外層（或可改在 front/back）
  if (pokemon.primaryType) {
    const color = colorForType(pokemon.primaryType);
    cardEl.style.setProperty('--primary-color', color);
    // 可加上漸層或背景色：
    cardEl.querySelectorAll('.poke-card-face').forEach(face => {
      face.style.background = `linear-gradient(135deg, ${color} 0%, #ffffff 85%)`;
    });
  }
}

export function flipCard(cardEl) {
  if (!cardEl) return;
  cardEl.classList.toggle('is-flipped');
}

export const __testables = { applyData, ensureTemplateLoaded };
