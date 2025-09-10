# Phase 0 Research – 寶可夢隨機卡片生成器

## Scope
單頁前端功能：點擊寶貝球 → 抽取並顯示一張可翻轉的寶可夢卡片（覆蓋更新）。

## Decisions & Rationale
### D1: 架構形態 – 單純前端 SPA（無後端）
- Decision: 使用純前端 (HTML + CSS + JS) 搭配 Bootstrap 5 與 jQuery。
- Rationale: 規格僅需即時呼叫公開 API，無狀態持久化需求；快速開發與教學示例適合。
- Alternatives: (a) 使用現代框架（React/Vue/Svelte）→ 對單一互動過度設計；(b) 建後端 Proxy → 增加維運複雜度且無資料加工需求。

### D2: 視覺與互動 – 使用 Bootstrap 5 + 客製 CSS 動畫
- Decision: 基礎版面與 RWD 借助 Bootstrap Grid；翻轉與丟出特效使用 CSS transform + transition。
- Rationale: 減少自建樣式時間；需求簡單不需大型 UI 套件。
- Alternatives: Tailwind（需設定與語意化較弱）；完全手刻（增加 CSS 撰寫時間）。

### D3: 資料來源 API
- Decision: 使用 `pokemon/{id}` 與 `pokemon-species/{id}` 兩個端點。
- Rationale: 前者提供基本屬性與 sprites；後者提供多語敘述（flavor_text_entries）。
- Alternatives: 第三方快取服務（無必要、可靠度未知）。

### D4: 隨機策略與避免重複
- Decision: 使用 1..N（N 取決於 API 可用最大 ID，暫以 1025 假設）等機率隨機；若與當前卡片相同則重抽一次。
- Rationale: 規格要求只避免連續重複；二次仍相同則接受以避免無限等待。
- Alternatives: 維護最近集合避免 N 次內重複 → 超出需求。

### D5: 錯誤與重試
- Decision: 失敗或超時（自定 5s）顯示訊息並於 5 秒後自動重試一次；第二次失敗停止。
- Rationale: 與規格一致；避免過度重試造成體驗不佳。
- Alternatives: 指數退避多次重試（過度設計）。

### D6: Loading 顯示策略
- Decision: 300ms 延遲門檻：若請求 <300ms 完成則不顯示 loading 以避免閃爍；超過則顯示。
- Rationale: 提升感知順暢度。
- Alternatives: 立即顯示（造成閃爍）、固定骨架（對單卡過重）。

### D7: 翻轉動畫
- Decision: 使用 CSS `transform: rotateY(180deg)` + 0.5s transition；雙面容器套 `perspective`。
- Rationale: 簡單、跨瀏覽器支援佳。
- Alternatives: JS 驅動逐步動畫（複雜）。

### D8: 中文名稱與描述擷取
- Decision: 從 species 回傳 `names`（language.name === 'zh-Hant' 或 'zh-Hans' fallback），描述從 `flavor_text_entries` 同語系，若都缺則顯示統一文案。
- Rationale: 滿足替代策略；繁簡體 fallback 增加成功率。
- Alternatives: 僅 zh-Hant → 容易缺失；用英語描述 → 與需求不符。

### D9: 小動圖來源
- Decision: 使用 pokemon API `sprites.versions['generation-v']['black-white'].animated.front_default` 或 fallback 至 `sprites.front_default`；最後缺失用自備未知靜態圖占位。
- Rationale: 動圖指定 generation-v animated 最普遍；多層 fallback 提高穩定性。
- Alternatives: 只用 front_default（失去動圖效果）。

### D10: 無 PWA / 離線
- Decision: 不加入 Service Worker 或 Cache；所有請求即時呼叫。
- Rationale: 規格明確聲明不支援離線；減少維護面。
- Alternatives: Cache First / stale-while-revalidate → 超出需求。

### D11: 測試策略（最小可行）
- Decision: 因為為純前端無 build，目前採用：
  - 合約近似測試：以 mock fetch（可日後引入 Vitest/Jest）驗證資料解析函式。
  - 使用一份手動 quickstart 腳本指引人工驗收互動流程。
- Rationale: 專案目前無測試框架與 runtime 結構；先在計畫中標註後續可引入工具。
- Alternatives: 立即導入完整單元 + E2E（Playwright）→ 對初始示例超過必要。

### D12: 專案結構最小化
- Decision: 採單一 `src/` 方案（Option 1），無後端、無多專案拆分。
- Rationale: 功能簡單；避免空資料夾與過度抽象。
- Alternatives: frontend/ + tests/ 分離 → 現階段冗餘。

## Open Items (已全部解決，無 NEEDS CLARIFICATION)
無。

## Risks & Mitigations
| 風險 | 影響 | 緩解 |
|------|------|------|
| PokeAPI 延遲或失敗 | 使用者體驗中斷 | 顯示訊息 + 單次自動重試 |
| Sprites animated 缺失 | 背面缺少動態效果 | 多層 fallback + 未知占位圖 |
| 語系欄位不一致 | 中文名稱缺失 | zh-Hant → zh-Hans → 英文 → 預設文案 |
| 連續點擊造成多請求 | UI 競態 | 進行中狀態下忽略新點擊 |
| 過長描述影響排版 | 版面超出容器 | 容器允許自然換行 + 滾動（若 CSS overflow 自然出現） |

## Summary Extract
前端單頁，直接對 PokeAPI 呼叫兩端點，最小化互動（單卡覆蓋抽取 + 翻轉），建立一套清楚 fallback 與錯誤/重試策略，無離線、無狀態持久化。
