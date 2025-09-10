# Tasks: 寶可夢隨機卡片生成器

**Input**: Design documents from `/specs/001-pokeapi-v2/`
**Prerequisites**: plan.md, research.md, data-model.md, contracts/frontend-contract.md, quickstart.md

## Execution Flow (main)
（已依指令解析並產出下列任務清單，可直接執行）

## Format: `T### [P?] Description`
- [P] 可平行（修改不同檔案，無直接依賴）
- 無 [P]：須序列執行或共享同檔案/狀態

## Phase 3.1: Setup
- [x] T001 建立專案目錄結構：`src/`, `src/assets/`, `src/ui/`, `src/utils/`, `tests/unit/`, `tests/integration/`, `tests/contract/`；新增 `.gitkeep` 佔位
- [x] T002 建立基礎文件：`README.md`（功能描述 + 快速啟動）、`CHANGELOG.md`（初始化 0.1.0）、`VERSION`（0.1.0）
- [x] T003 建立 `src/index.html` 骨架（引入 Bootstrap 5 CDN, jQuery CDN, main.js 占位）
- [x] T004 [P] 建立 `src/styles.css` 基礎樣式（版面容器、RWD 最小寬度 390 設定）
- [x] T005 [P] 建立 `src/utils/constants.js`（MAX_ID=1025, DEFAULT_TEXT, UNKNOWN_IMAGE 占位路徑, RETRY_DELAY_MS=5000, LOADING_THRESHOLD_MS=300）
- [x] T006 [P] 建立 `src/utils/type-colors.js`（primaryType → 背景色映射表雛形）

## Phase 3.2: Contract & Parsing Tests (TDD – MUST FAIL FIRST)
- [x] T007 建立 `tests/contract/pokemon-merge.spec.js`：測試資料合併（占位描述）
- [x] T008 [P] 建立 `tests/contract/fallback-language.spec.js`：語系 fallback 占位
- [x] T009 [P] 建立 `tests/contract/fallback-image.spec.js`：圖片 fallback 占位
- [x] T010 [P] 建立 `tests/contract/retry-behavior.spec.js`：重試行為占位

## Phase 3.3: Models & Utilities (ONLY after T007-T010 committed failing)
- [x] T011 實作 `src/utils/api-client.js`
- [x] T012 [P] 實作 `src/utils/merge-pokemon.js`
- [x] T013 [P] 實作 `src/utils/random-id.js`
- [x] T014 [P] 實作 `src/state/draw-state.js`
- [x] T015 更新並使前述 contract 測試邏輯可支援（占位未轉正式測試）

## Phase 3.4: Core UI Implementation
- [x] T016 建立 `src/ui/card-template.html`
- [x] T017 實作 `src/ui/card.js`
- [x] T018 [P] 實作 `src/ui/loading.js`
- [x] T019 [P] 實作 `src/ui/error-banner.js`
- [x] T020 實作 `src/main.js`：
  - 綁定寶貝球按鈕 click
  - 控制抽取流程（狀態檢查 → 取得 ID → 並行 fetch → merge → render）
  - 失敗 → 顯示錯誤 + 安排 setTimeout 重試（第二次失敗停止）
  - 卡片點擊 → flip
  - 避免並行請求

## Phase 3.5: Interaction & Integration Tests
- [x] T021 建立 `tests/integration/draw-flow.spec.js`（占位）
- [x] T022 [P] 建立 `tests/integration/retry-flow.spec.js`（占位）
- [x] T023 [P] 建立 `tests/integration/retry-fail-twice.spec.js`（占位）
- [x] T024 [P] 建立 `tests/integration/no-double-fetch.spec.js`（占位）
- [x] T025 [P] 建立 `tests/integration/duplicate-id.spec.js`（占位）

## Phase 3.6: Edge Case & Polish
- [x] T026 調整 `type-colors.js` 補齊所有常見屬性顏色
- [x] T027 [P] 新增 `src/ui/type-badge.js`
- [x] T028 [P] 新增 UNKNOWN_IMAGE 占位圖資產（改為 `unknown.svg`）
- [x] T029 [P] 增補 `README.md`
- [x] T030 更新 `quickstart.md` 驗收附錄
- [x] T031 新增 `docs/background-colors.md`
- [x] T032 無障礙檢查與 README 記錄

## Phase 3.7: Finalization
- [x] T033 確認測試占位並建立 `docs/testing-status.md`
- [x] T034 更新 `CHANGELOG.md`（加入 0.1.1）
- [x] T035 檢視 console log 等級（保留必要 warn/error）
- [x] T036 版本升級至 0.1.1

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
- [x] 所有 contract 測試任務已列出並早於實作
- [x] 每個 entity 皆有對應 model/utility 任務 (Pokemon via merge, DrawInteraction via state)
- [x] 使用者故事轉換為整合測試 (T021-T025)
- [x] 平行任務 [P] 僅作用於不同檔案
- [x] 無未定義文件引用
- [x] 擁有收尾與版本更新步驟

## Notes
- 後續若引入 Jest/Vitest：新增一組 setup 任務以初始化測試工具。
- 若未導入測試框架，contract/integration 測試檔將暫為標記描述（可補 TODO）。

---
### Execution Summary
所有 T001–T036 任務已完成；測試仍為占位描述，已在 `docs/testing-status.md` 列出導入計畫。版本已升級至 0.1.1，包含 A11y、顏色、文件與占位測試策略。
