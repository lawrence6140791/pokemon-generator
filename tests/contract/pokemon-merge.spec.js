/**
 * Contract Test (Fail-First Placeholder): pokemon-merge
 * 目標：驗證 buildPokemon(rawPokemon, rawSpecies, timestamp) 合併邏輯。
 * 尚未引入測試框架，先以描述 + TODO 形式；後續若採用 Jest/Vitest 可直接轉為真實測試。
 *
 * 覆蓋需求重點：
 * 1. 語系名稱 fallback：zh-Hant → zh-Hans → en → DEFAULT_TEXT
 * 2. 描述文字 fallback：同語系序列
 * 3. 圖片 fallback：animated sprite → front_default → UNKNOWN_IMAGE
 * 4. primaryType：以 rawPokemon.types 中 slot=1 或第一個元素為主色判斷
 * 5. duplicate handling 不在此檔（屬於 random-id / draw-state 行為）
 * 6. timestamp 傳入後應寫入結果物件（如 data-model 所述）
 *
 * 預期輸出結構（簡化）：
 * {
 *   id: number,
 *   name: string, // 已套用 fallback
 *   description: string, // 已套用 fallback
 *   imageUrl: string, // 已套用 fallback
 *   primaryType: string | null,
 *   types: string[],
 *   obtainedAt: number // timestamp 原樣
 * }
 */

// 假想引入（尚未存在，故此檔案在真正執行測試時會失敗/報錯）
// import { buildPokemon } from '../../src/utils/merge-pokemon.js';

// 範例 raw 資料片段（簡化，實際 PokeAPI 結構更大）：
const rawPokemonExample = {
  id: 25,
  name: 'pikachu',
  sprites: {
    versions: {
      'generation-v': {
        'black-white': {
          animated: { front_default: 'https://img.example/pika-anim.gif' }
        }
      }
    },
    front_default: 'https://img.example/pika.png'
  },
  types: [
    { slot: 1, type: { name: 'electric' } },
  ]
};

const rawSpeciesExample = {
  names: [
    { language: { name: 'en' }, name: 'Pikachu' },
    { language: { name: 'zh-Hans' }, name: '皮卡丘' },
    { language: { name: 'ja' }, name: 'ピカチュウ' }
  ],
  flavor_text_entries: [
    { language: { name: 'en' }, flavor_text: 'When several of these POKéMON gather...' },
    { language: { name: 'zh-Hans' }, flavor_text: '當這些寶可夢聚集時...' }
  ]
};

/**
 * TODO: 後續以測試框架撰寫案例：
 *  - happy path：全部 fallback 第一優先就能取得
 *  - 語系缺 zh-Hant：自動落到 zh-Hans
 *  - 語系缺 zh-Hant, zh-Hans：落到 en
 *  - 語系均缺：使用 DEFAULT_TEXT
 *  - 圖片只有 animated（使用 animated）
 *  - 動圖缺失但有 front_default（使用 front_default）
 *  - 兩者都缺：使用 UNKNOWN_IMAGE
 */

function describePlannedAssertions() {
  return [
    '應將 zh-Hans 名稱解析並作為最終名稱（若 zh-Hant 缺失）',
    '應使用 flavor_text zh-Hans 作為描述（若 zh-Hant 缺失）',
    '應選擇 animated front_default 作為 imageUrl',
    '應抽出 primaryType = electric 並 types=["electric"]',
    '應保留 timestamp 為 obtainedAt',
  ];
}

// 暫時輸出到 console 以便人工檢查（無測試框架）
console.log('[CONTRACT PLACEHOLDER] pokemon-merge.spec.js planned assertions:', describePlannedAssertions());
