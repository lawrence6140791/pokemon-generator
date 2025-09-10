/**
 * Integration Test Placeholder: retry-fail-twice (T023)
 * 場景：
 *  1. 第一次抽卡失敗 -> 顯示錯誤 + 倒數
 *  2. 第二次（自動重試）仍失敗 -> 顯示永久錯誤訊息 (無倒數) 且不再排程
 *  3. 後續等待超過 RETRY_DELAY_MS 也不再觸發第三次抽卡
 *
 * 斷言構想：
 *  - 第二次 fail 後 state.permanentError = true
 *  - 錯誤區顯示最終訊息（無倒數字串）
 *  - 無後續 retry 事件派發
 */

console.log('[INTEGRATION PLACEHOLDER] retry-fail-twice.spec.js scenario defined');
