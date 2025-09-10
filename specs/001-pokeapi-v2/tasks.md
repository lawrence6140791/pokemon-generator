# Tasks: 寶可夢隨機卡片生成器

**Input**: Design documents from `/specs/001-pokeapi-v2/`
**Prerequisites**: plan.md, research.md, data-model.md, contracts/frontend-contract.md, quickstart.md

## Execution Flow (main)
（已依指令解析並產出下列任務清單，可直接執行）

## Format: `T### [P?] Description`
- [P] 可平行（修改不同檔案，無直接依賴）
- 無 [P]：須序列執行或共享同檔案/狀態

## Phase 3.1: Setup
- [ ] T001 建立專案目錄結構：`src/`, `src/assets/`, `src/ui/`, `src/utils/`, `tests/unit/`, `tests/integration/`, `tests/contract/`；新增 `.gitkeep` 佔位
- [ ] T002 建立基礎文件：`README.md`（功能描述 + 快速啟動）、`CHANGELOG.md`（初始化 0.1.0）、`VERSION`（0.1.0）
- [ ] T003 建立 `src/index.html` 骨架（引入 Bootstrap 5 CDN, jQuery CDN, main.js 占位）
- [ ] T004 [P] 建立 `src/styles.css` 基礎樣式（版面容器、RWD 最小寬度 390 設定）
- [ ] T005 [P] 建立 `src/utils/constants.js`（MAX_ID=1025, DEFAULT_TEXT, UNKNOWN_IMAGE 占位路徑, RETRY_DELAY_MS=5000, LOADING_THRESHOLD_MS=300）
- [ ] T006 [P] 建立 `src/utils/type-colors.js`（primaryType → 背景色映射表雛形）

## Phase 3.2: Contract & Parsing Tests (TDD – MUST FAIL FIRST)
- [ ] T007 建立 `tests/contract/pokemon-merge.spec.js`：測試資料合併（成功：語系 fallback, 動圖 fallback, primaryType）
- [ ] T008 [P] 建立 `tests/contract/fallback-language.spec.js`：測試 zh-Hant → zh-Hans → en → DEFAULT_TEXT 流程
- [ ] T009 [P] 建立 `tests/contract/fallback-image.spec.js`：測試 animated → front_default → UNKNOWN_IMAGE 流程
- [ ] T010 [P] 建立 `tests/contract/retry-behavior.spec.js`：模擬第一次失敗 5 秒後自動重試一次、第二次仍失敗維持錯誤

## Phase 3.3: Models & Utilities (ONLY after T007-T010 committed failing)
- [ ] T011 實作 `src/utils/api-client.js`：`fetchPokemon(id)`, `fetchSpecies(id)`（回傳 raw JSON）
- [ ] T012 [P] 實作 `src/utils/merge-pokemon.js`：輸出 `buildPokemon(rawPokemon, rawSpecies, timestamp)` 對應 data-model 規則（暫不處理 UI）
- [ ] T013 [P] 實作 `src/utils/random-id.js`：`nextRandom(excludeId?)`（1..MAX_ID，若等於 excludeId 再抽一次）
- [ ] T014 [P] 實作 `src/state/draw-state.js`：管理 inProgress, attempts, scheduling（export `begin()`, `fail()`, `success()`, `scheduleRetry()`）
- [ ] T015 更新並使前述 contract 測試（T007-T010）綠燈：補充語系/圖片 fallback 邏輯

## Phase 3.4: Core UI Implementation
- [ ] T016 建立 `src/ui/card-template.html`（或 JS 模板函式）定義卡片 DOM 結構（正面/背面容器）
- [ ] T017 實作 `src/ui/card.js`：`renderCard(pokemon)`、`flipCard()`, `updateCard(pokemon)`（背景色應用）
- [ ] T018 [P] 實作 `src/ui/loading.js`：顯示/隱藏載入狀態（延遲 300ms 閾值）
- [ ] T019 [P] 實作 `src/ui/error-banner.js`：顯示錯誤訊息（含自動重試倒數 UI 預留）
- [ ] T020 實作 `src/main.js`：
  - 綁定寶貝球按鈕 click
  - 控制抽取流程（狀態檢查 → 取得 ID → 並行 fetch → merge → render）
  - 失敗 → 顯示錯誤 + 安排 setTimeout 重試（第二次失敗停止）
  - 卡片點擊 → flip
  - 避免並行請求

## Phase 3.5: Interaction & Integration Tests
- [ ] T021 建立 `tests/integration/draw-flow.spec.js`：模擬點擊抽卡 → 顯示卡片 → 翻轉 → 再抽覆蓋
- [ ] T022 [P] 建立 `tests/integration/retry-flow.spec.js`：第一次 失敗 + 自動重試成功
- [ ] T023 [P] 建立 `tests/integration/retry-fail-twice.spec.js`：兩次失敗後保持錯誤訊息
- [ ] T024 [P] 建立 `tests/integration/no-double-fetch.spec.js`：快速連點僅一次請求
- [ ] T025 [P] 建立 `tests/integration/duplicate-id.spec.js`：連續抽到同 ID 時第二次重新抽一次（若仍同則接受）

## Phase 3.6: Edge Case & Polish
- [ ] T026 調整 `type-colors.js` 補齊所有常見屬性顏色（草/火/水/...）
- [ ] T027 [P] 新增 `src/ui/type-badge.js`：顯示 1~2 個屬性徽章
- [ ] T028 [P] 新增 UNKNOWN_IMAGE 占位圖資產（`src/assets/unknown.png`）或文字替代策略
- [ ] T029 [P] 增補 `README.md`：加入執行/測試/結構說明
- [ ] T030 更新 `quickstart.md`：補上版本 0.1.0 驗收附錄（若需）
- [ ] T031 新增 `docs/background-colors.md`（選擇原因 + 無障礙對比建議）
- [ ] T032 進行無障礙檢查（對比、aria-label）並在 README 記錄

## Phase 3.7: Finalization
- [ ] T033 確認所有測試（若測試架構後續加入）通過或提供待辦標記
- [ ] T034 更新 `CHANGELOG.md`：標註完成日期與主要功能條目
- [ ] T035 檢視 console log 等級（移除過度 debug）
- [ ] T036 將版本檔 `VERSION` 更新為 0.1.1（若有修正）

## Dependencies / Ordering Notes
- T007-T010 (contract tests) 必須先失敗再實作 T011-T015。
- T011-T015 綠燈後才進入 UI (T016+)。
- T016 依賴 T011-T015 的資料建構能力。
- Integration tests (T021-T025) 可在初版 UI 可操作後撰寫（可先建立骨架並標記 TODO）。
- Edge/Polish 可與部分整合測試平行（標記 [P]）。

## Parallel Execution Examples
```
# 套件/工具無需安裝（純前端），可並行：
T004, T005, T006  （不同檔案）
T008, T009, T010  （獨立測試檔）
T012, T013, T014  （不同 utils/state 檔）
T022, T023, T024, T025 （整合測試不同檔案）
T027, T028, T029 （UI 分離 + 文檔）
```

## Validation Checklist
- [ ] 所有 contract 測試任務已列出並早於實作
- [ ] 每個 entity 皆有對應 model/utility 任務 (Pokemon via merge, DrawInteraction via state)
- [ ] 使用者故事轉換為整合測試 (T021-T025)
- [ ] 平行任務 [P] 僅作用於不同檔案
- [ ] 無未定義文件引用
- [ ] 擁有收尾與版本更新步驟

## Notes
- 後續若引入 Jest/Vitest：新增一組 setup 任務以初始化測試工具。
- 若未導入測試框架，contract/integration 測試檔將暫為標記描述（可補 TODO）。
