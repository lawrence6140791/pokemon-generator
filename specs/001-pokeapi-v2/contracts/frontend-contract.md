# Frontend Contract – 寶可夢隨機卡片生成器

## Scope
純前端互動：無自建後端 API。此處定義前端與外部 PokeAPI 之資料存取契約與解析規則。

## External Endpoints
1. GET https://pokeapi.co/api/v2/pokemon/{id}
2. GET https://pokeapi.co/api/v2/pokemon-species/{id}

## Request Rules
- `id` 取值範圍：1..1025（若 API 更新可調整常數）。
- 兩個請求順序：允許並行；完成後合併資料。
- 在抽取進行時不得再發送第二組新請求。

## Response Fields Used (pokemon/{id})
| Field Path | Purpose |
|------------|---------|
| id | 主鍵 |
| name | 英文名稱 |
| types[].type.name | 屬性列表（第一個為主要屬性） |
| sprites.front_default | 靜態主圖 |
| sprites.versions['generation-v']['black-white'].animated.front_default | 動圖（優先） |

## Response Fields Used (pokemon-species/{id})
| Field Path | Purpose |
|------------|---------|
| names[] | 多語名稱（挑選 zh-Hant → zh-Hans） |
| flavor_text_entries[] | 多語敘述（挑選 zh-Hant → zh-Hans → en） |

## Data Merge Logic
Pseudo:
```
base = pokemon/{id}
species = pokemon-species/{id}
cn = findName(species.names, ['zh-Hant','zh-Hans'])
flavor = findFlavor(species.flavor_text_entries, ['zh-Hant','zh-Hans','en'])
animated = base.sprites.versions['generation-v']['black-white'].animated.front_default || base.sprites.front_default || UNKNOWN_IMAGE
image = base.sprites.front_default || UNKNOWN_IMAGE
primaryType = base.types[0].type.name
```

## Error Handling Contract
| Situation | UI Behavior |
|-----------|-------------|
| 網路錯誤/超時 | 顯示錯誤訊息 + 5 秒後自動重試一次 |
| 第二次仍失敗 | 停止自動重試，維持錯誤訊息 |
| 缺中文名稱 | 使用英文名稱 |
| 缺英文名稱 | 顯示 DEFAULT_TEXT |
| 缺動圖 & 靜態圖 | 使用 UNKNOWN_IMAGE |

## Non-Functional Notes
- 時間閾值：載入指示 300ms 閾值；超過顯示。
- 動畫：翻轉 0.5s。

## Testable Assertions
1. 抽取請求期間第二次點擊不產生新請求。
2. 失敗後 5 秒自動重試一次。
3. primaryType 與背景色映射一致。
4. 連續同 ID 只重抽一次。
5. 缺語系時依序 fallback。
