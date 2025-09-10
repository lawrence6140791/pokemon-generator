# 測試狀態 (T033)

目前版本：0.1.0 即將升版 0.1.1

## 現況摘要
- 尚未導入實際測試框架（Jest / Vitest 未安裝）。
- 已存在的測試檔為「占位描述」：
  - contract: `tests/contract/*.spec.js`
  - integration: `tests/integration/*.spec.js`
- 目的：協助未來開發者快速轉換為正式測試。

## 推薦落地步驟
1. 建立 `package.json` 並安裝：`npm i -D vitest jsdom whatwg-fetch`。
2. 在 `merge-pokemon.spec.js` 內導入 `buildPokemon`，撰寫語系與圖片 fallback 案例。
3. 對 `random-id.js` 建立單元測試：控制 Math.random() 序列。
4. 用 jsdom 模擬 DOM，測試 `draw-state` 與 `main.js` 基本流程（或升級為 Playwright）。
5. 跑 CI：`npx vitest run --coverage`。

## 待補測試清單
| 類型 | 描述 | 狀態 |
|------|------|------|
| Contract | 語系 fallback 全流程 | 未實作 |
| Contract | 圖片 fallback | 未實作 |
| Contract | 單次重試 state 轉移 | 未實作 |
| Unit | buildPokemon 例外處理 | 未實作 |
| Unit | random-id duplicate 再抽一次 | 未實作 |
| Unit | type-badge 亮度文字色 | 未實作 |
| Integration | draw-flow | 未實作 |
| Integration | retry-flow success | 未實作 |
| Integration | retry fail twice | 未實作 |
| Integration | no double fetch | 未實作 |
| Integration | duplicate id branch | 未實作 |

## 風險評估
- 目前所有行為依手動測試與瀏覽器實測；無自動防回歸。
- 推薦於升版 0.2.0 前至少完成 Contract + 部分 Unit 測試。

## 建議優先級 (1 高 – 3 低)
1. buildPokemon fallback (Contract/Unit)
1. retry-behavior state (Contract)
2. random-id duplicate branch (Unit)
2. draw-flow happy path (Integration)
3. A11y 靜態斷言（role/aria 存在性）

## 備註
此文件將在導入測試框架後更新，並調整表格中狀態欄位。