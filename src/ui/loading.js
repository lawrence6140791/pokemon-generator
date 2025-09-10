// loading.js
// 若載入超過 LOADING_THRESHOLD_MS 才顯示指示，避免閃爍。

import { LOADING_THRESHOLD_MS } from '../utils/constants.js';

let timer = null;
let visible = false;

const STATUS_AREA_ID = 'status-area';

function getArea() {
  return document.getElementById(STATUS_AREA_ID);
}

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
  const area = getArea();
  if (!area) return;
  const el = document.createElement('div');
  el.className = 'loading';
  el.textContent = '載入中...';
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  area.appendChild(el);
  visible = true;
}

function hide() {
  if (!visible) return;
  const area = getArea();
  if (!area) return;
  const loadingEl = area.querySelector('.loading');
  if (loadingEl) loadingEl.remove();
  visible = false;
}

function clear() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}

export const __testables = { show, hide, clear };
