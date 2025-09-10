// loading.js
// 若載入超過 LOADING_THRESHOLD_MS 才顯示指示，避免閃爍。

import { LOADING_THRESHOLD_MS } from '../utils/constants.js';

let timer = null;
let visible = false;

const DRAW_BUTTON_ID = 'draw-btn';
function getButton() { return document.getElementById(DRAW_BUTTON_ID); }

export function startLoading() {
  clear();
  timer = setTimeout(() => {
    timer = null;
    show();
  }, LOADING_THRESHOLD_MS);
}

export function stopLoading() {
  clear();
  hide();
}

function show() {
  if (visible) return;
  const btn = getButton();
  if (!btn) return;
  btn.classList.add('is-loading');
  btn.setAttribute('aria-busy', 'true');
  visible = true;
}

function hide() {
  if (!visible) return;
  const btn = getButton();
  if (btn) {
    btn.classList.remove('is-loading');
    btn.removeAttribute('aria-busy');
  }
  visible = false;
}

function clear() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}

export const __testables = { show, hide, clear };
