// error-banner.js
// 顯示錯誤訊息與（若存在排程）倒數提示。

import { RETRY_DELAY_MS } from '../utils/constants.js';

let countdownTimer = null;
let countdownRemaining = 0;

const STATUS_AREA_ID = 'status-area';

function getArea() { return document.getElementById(STATUS_AREA_ID); }

export function showError(message, { retryScheduled = false } = {}) {
  clear();
  const area = getArea();
  if (!area) return;
  const el = document.createElement('div');
  el.className = 'error';
  el.setAttribute('role', 'alert');
  const base = document.createElement('div');
  base.textContent = message || '發生錯誤';
  el.appendChild(base);

  if (retryScheduled) {
    const info = document.createElement('div');
    info.className = 'small text-muted';
    countdownRemaining = Math.ceil(RETRY_DELAY_MS / 1000);
    info.textContent = `將於 ${countdownRemaining}s 後自動再試一次...`;
    el.appendChild(info);
    countdownTimer = setInterval(() => {
      countdownRemaining -= 1;
      if (countdownRemaining <= 0) {
        clearInterval(countdownTimer);
        countdownTimer = null;
        return; // retry 會由 draw-state 發出的事件觸發流程
      }
      info.textContent = `將於 ${countdownRemaining}s 後自動再試一次...`;
    }, 1000);
  }
  area.appendChild(el);
}

export function clearError() {
  clear();
  const area = getArea();
  if (!area) return;
  area.querySelectorAll('.error').forEach(e => e.remove());
}

function clear() {
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
}

export const __testables = { clear };
