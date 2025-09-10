/**
 * Integration Test Placeholder: draw-flow (T021)
 * 目標：模擬使用者互動整體流程。
 * 場景：
 *  1. 初始頁面 -> 尚無卡片
 *  2. 點擊抽卡按鈕 -> 顯示載入 (若超過 300ms) -> 顯示卡片 (正面)
 *  3. 點擊卡片 -> 翻面，顯示描述文字
 *  4. 再次點擊抽卡 -> 取得新寶可夢並覆蓋舊卡（卡片重置為正面）
 *
 * 待日後導入測試框架時具體化：
 *  - 模擬 DOM / 使用 headless 瀏覽器 (例如 Playwright) 或 JSDOM + fetch mock。
 *  - 斷言：
 *      a. 第一次抽卡後 .poke-card 存在且 data-id = ID1。
 *      b. 翻面後 .poke-card 含 .is-flipped。
 *      c. 第二次抽卡後 data-id = ID2 且 != ID1，且 .is-flipped 被移除。
 */

console.log('[INTEGRATION PLACEHOLDER] draw-flow.spec.js scenario defined');
