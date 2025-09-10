// type-badge.js
// 產生屬性徽章元素；若多於2 只顯示前兩個並加 +n 標記。
import { colorForType } from '../utils/type-colors.js';

export function createTypeBadges(types = []) {
  const wrapper = document.createElement('div');
  wrapper.className = 'type-badges d-flex gap-2 flex-wrap justify-content-center';
  const display = types.slice(0, 2);
  display.forEach(t => wrapper.appendChild(makeBadge(t)));
  if (types.length > 2) {
    const more = document.createElement('span');
    more.className = 'badge rounded-pill bg-dark';
    more.textContent = `+${types.length - 2}`;
    more.title = types.slice(2).join(', ');
    wrapper.appendChild(more);
  }
  return wrapper;
}

function makeBadge(type) {
  const span = document.createElement('span');
  span.className = 'badge rounded-pill';
  const color = colorForType(type);
  span.style.background = color;
  span.style.color = pickTextColor(color);
  span.textContent = type;
  return span;
}

// 簡單依亮度決定文字顏色
function pickTextColor(hex) {
  if (!hex || !hex.startsWith('#')) return '#222';
  const r = parseInt(hex.substr(1, 2), 16);
  const g = parseInt(hex.substr(3, 2), 16);
  const b = parseInt(hex.substr(5, 2), 16);
  // 相對亮度估計
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 150 ? '#222' : '#fff';
}

export const __testables = { pickTextColor };
