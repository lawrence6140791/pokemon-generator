# Data Model – 寶可夢隨機卡片生成器

## Entities Overview
| Entity | Purpose | Notes |
|--------|---------|-------|
| Pokemon | 展示於卡片的單一寶可夢資料 | 來源：`pokemon/{id}` + `pokemon-species/{id}` 合併 |
| DrawInteraction (transient) | 控制一次抽取流程（避免並發） | 不持久化，僅前端狀態 |

## Pokemon
| Field | Type | Required | Source | Rule / Fallback |
|-------|------|----------|--------|-----------------|
| id | number | Yes | pokemon.id | 1..MAX_KNOWN (暫 1025) |
| englishName | string | Optional | pokemon.name | lower-case; 若缺視為空字串 |
| chineseName | string | Optional | species.names.* | zh-Hant→zh-Hans→englishName→DEFAULT_TEXT |
| displayName | string | Yes | derived | chineseName || englishName || DEFAULT_TEXT |
| primaryType | string | Yes | pokemon.types[0].type.name | 用於背景色映射 |
| types | string[] | Yes | pokemon.types[].type.name | 1~2 長度 |
| imageUrl | string | Yes | pokemon.sprites.front_default | 若缺用 UNKNOWN_IMAGE |
| svgImage | string | Optional | pokemon.sprites.other.dream_world.front_default | 首選顯示 (若存在) |
| staticImage | string | Optional | pokemon.sprites.front_default | Fallback 於 svg 缺失時使用 |
| animatedImage | string | Optional | sprites.versions['generation-v']['black-white'].animated.front_default | 用於背面動圖區；缺則使用 imageUrl |
| imageUrl | string | Yes | derived | svgImage || staticImage || UNKNOWN_IMAGE (向後相容主顯示) |
| hp | number | Yes | stats[stat.name=hp].base_stat | 無則 0 |
| attack | number | Yes | stats[stat.name=attack].base_stat | 無則 0 |
| defense | number | Yes | stats[stat.name=defense].base_stat | 無則 0 |
| speed | number | Yes | stats[stat.name=speed].base_stat | 無則 0 |
| description | string | Yes | species.flavor_text_entries.* | zh-Hant→zh-Hans→english→DEFAULT_TEXT；移除換行/控制字元 |
| lastUpdated | number (epoch ms) | Yes | Date.now() | 用於 UI 判斷是否陳舊（暫無邏輯） |

DEFAULT_TEXT = "關於這隻寶可夢還有許多未知"
UNKNOWN_IMAGE = 預設本地或 CDN 佔位圖路徑（後續於實作定義）。

## DrawInteraction (Transient)
| Field | Type | Description |
|-------|------|-------------|
| inProgress | boolean | 是否正在向 API 取資料 |
| startedAt | number | 開始請求時間戳 |
| retryScheduled | boolean | 是否已排程自動重試 |
| retryAt | number | 自動重試預計時間（ms epoch） |
| attempts | number | 已嘗試次數 (1=初次, 2=自動重試) |

## Derived / Validation Rules
1. `types.length` ∈ {1,2}
2. primaryType = types[0]
3. 抽到同 `id` 時允許一次重抽：若第二次仍同則接受
4. description 清理：去除 `\n`, `\f` 等特殊換行符 → 空白置換
5. imageUrl fallback 順序：dream_world svg → front_default → UNKNOWN_IMAGE
6. animatedImage 缺失時：背面顯示 imageUrl
7. chineseName 選取語言優先序：zh-Hant → zh-Hans → englishName → DEFAULT_TEXT
8. description 語言優先序：同上；若多條符合取第一條

## State Diagram (簡述)
DrawInteraction:
Idle → (click) → Loading → (success) → Idle
Loading → (timeout/failure) → ErrorShown → (5s timer) → Loading (retry) → (failure) → ErrorTerminal
ErrorTerminal 可由再次點擊（使用者手動）轉為 Loading

## Open Issues
無（規格已鎖定）。
