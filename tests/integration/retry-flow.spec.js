/**
 * Integration Test Placeholder: retry-flow (T022)
 * 場景：
 *  1. 第一次抽卡：pokemon 或 species 任一 fetch 失敗（模擬 network error）
 *  2. 顯示錯誤訊息 + 倒數 (retryScheduled=true)；draw-state 排程 retry
 *  3. 計時器結束觸發第二次抽卡 -> 成功取得資料 -> 卡片渲染，錯誤消失
 *  4. 驗證只嘗試兩次，且成功後不再存在 retry timer。
 *
 * 斷言構想：
 *  - 第一次後 state.attempts = 1，錯誤區含倒數文字。
 *  - 第二次成功後 state.attempts = 2，錯誤元素移除。
 *  - 無 permanentError 標記。
 */

console.log('[INTEGRATION PLACEHOLDER] retry-flow.spec.js scenario defined');
