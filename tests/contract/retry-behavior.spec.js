/**
 * Contract Test (Fail-First Placeholder): retry-behavior
 * 驗證單次自動重試行為：
 *  - 第一次任一 API 請求失敗 -> 5 秒後自動重試
 *  - 第二次仍失敗 -> 顯示錯誤並不再重試
 *  - 成功後清除任何排程
 */

// import { scheduleRetry, begin, fail, success } from '../../src/state/draw-state.js';
// import { RETRY_DELAY_MS } from '../../src/utils/constants.js';

/**
 * 規劃模擬：
 * 1. 呼叫 begin() -> inProgress=true
 * 2. 模擬第一次 fetch 失敗 -> fail() -> 應排程 setTimeout (RETRY_DELAY_MS)
 * 3. 第二次：
 *    a. 若成功 -> success() -> 不再重試
 *    b. 若失敗 -> fail() -> 標記 permanentError
 * 4. 防止多次排程：再次 fail 不應新增新計時器（除非先 begin）
 */

function plannedRetryAssertions() {
  return [
    '第一次失敗後應排程一個 retry timeout',
    '第二次仍失敗 -> permanent error 狀態維持並無再排程',
    '第二次成功 -> 取消後續 retry',
    '多次連續 fail 不應產生多個 timeout',
  ];
}

console.log('[CONTRACT PLACEHOLDER] retry-behavior.spec.js planned assertions:', plannedRetryAssertions());
