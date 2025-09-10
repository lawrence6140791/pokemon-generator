# pokemon-generator

寶可夢隨機卡片生成器（Feature 001）

此專案為純前端單頁（SPA）示範，從 PokeAPI 抽取隨機寶可夢並顯示卡片，可翻面顯示基本資訊與描述，具語系與圖片 fallback、失敗一次後延時自動重試一次的邏輯。

## 功能概要
* 隨機抽卡：點擊按鈕即抽 1..1025 範圍內隨機寶可夢
* 語系名稱與敘述：優先 zh-Hant → zh-Hans → en → 預設佔位文字
* 圖片 fallback：優先 animated sprite → front_default → 內建 UNKNOWN 占位
* 翻面動畫：0.5s 翻轉顯示背面敘述
* 重試機制：首次請求任一 API 失敗則 5 秒後自動重試一次；第二次失敗顯示錯誤
* Duplicate 防護：若連續抽到同 ID 自動再抽一次（若仍同則接受）
* RWD 最低支援：390x844（手機直向）

## 目錄結構 (初始)
```
src/
	assets/
	ui/
	utils/
tests/
	contract/
	integration/
	unit/
specs/001-pokeapi-v2/ (設計與規格文件)
```

## 快速啟動
目前僅為靜態資源，可直接以任何簡易 HTTP 伺服器或瀏覽器開啟 `src/index.html` 後續會實作。

範例（Python 3）：
```
python -m http.server 8000
# 瀏覽 http://localhost:8000/src/index.html
```

## 規格與計畫文件
請參考 `specs/001-pokeapi-v2/` 內：
* `spec.md` 功能需求與情境
* `plan.md` 實作計畫
* `data-model.md` 資料模型
* `contracts/frontend-contract.md` 外部 API 與合併邏輯
* `quickstart.md` 手動驗收步驟
* `tasks.md` 任務分解（目前執行至 T006 前）

## 版本
版本號以檔案 `VERSION` 為準（目前 0.1.1）。

## 執行方式
無建置步驟：
1. 啟動任意靜態伺服器於專案根目錄。
2. 造訪 `/src/index.html`。

範例（Node npx serve）：
```
npx serve .
```

## 測試策略（尚未導入框架）
目前 `tests/contract/` 與 `tests/integration/` 內為「占位描述檔」，以 console.log 說明預期案例。
未來若導入 Vitest / Jest：
1. 建立 `package.json` 並安裝測試套件。
2. 將占位檔改寫為實際 `describe/it` 結構。
3. 針對 fetch 建立 mock（可用 Mock Service Worker 或 jest.fn）。

## 組件 & Utils 概述
| 檔案 | 角色 |
|------|------|
| `src/utils/api-client.js` | 呼叫 PokeAPI | 
| `src/utils/merge-pokemon.js` | 合併 + fallback 邏輯 |
| `src/utils/random-id.js` | 抽取 ID + duplicate 再抽一次 |
| `src/state/draw-state.js` | 抽卡狀態 / retry 排程 |
| `src/ui/card.js` | 卡片渲染與翻面 |
| `src/ui/loading.js` | 延遲顯示載入狀態 |
| `src/ui/error-banner.js` | 錯誤與倒數顯示 |
| `src/ui/type-badge.js` | 屬性徽章產生 |

## 可存取性 (A11y)
已採取：
* `aria-live="polite"`：卡片容器在更新時可被螢幕閱讀器感知。
* 對圖片加入 `alt` 屬性（fallback 時仍給定名稱或描述）。
* 翻面交互使用單一可點擊區塊，後續可加 `role="button"` 與鍵盤事件（見「改進中」）。
* 卡片現已具 `role="button"` 與鍵盤 Enter/Space 支援。
* `status-area` 加上 `role="status"` 與 `aria-live` 以播報載入/錯誤。
* 錯誤訊息元素使用 `role="alert"` 立即播報。

改進中 / 待辦：
* 為卡片翻面添加鍵盤進入與 `Enter`/`Space` 觸發。
* 針對顏色對比將在 `docs/background-colors.md` 提供建議文字顏色。
* 錯誤與倒數訊息加上 `role="status"` 或 `aria-live` 以即時播報。
* 針對深色模式 / 高對比模式的顏色替換。

## 顏色與屬性
`type-colors.js` 已包含主流屬性背景色；文字顏色在 `type-badge.js` 依亮度自動決定白/深色。
背景漸層（卡片）使用主屬性色至白色，避免過強飽和造成對比不足。

## 未來可能的延伸
* 加入 Service Worker 作快取（尚未在本版需求內）。
* 引入測試框架、自動化 CI。
* 增加搜尋或收藏功能。
* 用 CSS prefers-reduced-motion 降低翻轉動畫對敏感使用者的影響。

## 授權
（後續可補充）
