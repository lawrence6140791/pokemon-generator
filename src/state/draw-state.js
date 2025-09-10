// draw-state.js
// 管理抽卡互動狀態：避免並行、處理單次自動重試。
// 對應 retry-behavior 契約描述 (T010)。

import { RETRY_DELAY_MS } from '../utils/constants.js';

const state = {
  inProgress: false,
  attempts: 0, // 本輪嘗試次數（含自動重試）
  lastId: null,
  retryTimer: null,
  permanentError: false,
};

export function begin(selectedId) {
  if (state.inProgress) return false; // 已在進行中
  state.inProgress = true;
  state.attempts = 1;
  state.permanentError = false;
  state.lastId = selectedId || null;
  clearRetry();
  return true;
}

export function success() {
  state.inProgress = false;
  clearRetry();
}

export function fail() {
  // 若第一次失敗且尚未排程，準備自動重試
  if (state.attempts === 1 && !state.retryTimer) {
    scheduleRetryInternal();
  } else {
    // 第二次失敗 -> permanent error
    state.permanentError = true;
    state.inProgress = false;
    clearRetry();
  }
}

function scheduleRetryInternal() {
  clearRetry();
  state.retryTimer = setTimeout(() => {
    state.retryTimer = null;
    state.attempts += 1; // 第二次嘗試
    // 呼叫者應在外層偵測計時器結束後再觸發抽卡流程（例如 main.js）
    const event = new CustomEvent('draw:retry');
    window.dispatchEvent(event);
  }, RETRY_DELAY_MS);
}

export function scheduleRetry() {
  // 額外暴露（若外層想手動觸發）；僅在尚未排程且第一輪失敗後
  if (state.attempts === 1 && !state.retryTimer) {
    scheduleRetryInternal();
  }
}

export function isInProgress() { return state.inProgress; }
export function getAttempts() { return state.attempts; }
export function hasPermanentError() { return state.permanentError; }
export function getLastId() { return state.lastId; }

function clearRetry() {
  if (state.retryTimer) {
    clearTimeout(state.retryTimer);
    state.retryTimer = null;
  }
}

export function debugState() { return { ...state }; }

export const __testables = { clearRetry };
