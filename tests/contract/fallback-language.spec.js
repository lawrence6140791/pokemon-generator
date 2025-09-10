/**
 * Contract Test (Fail-First Placeholder): fallback-language
 * 驗證語系 fallback 順序： zh-Hant → zh-Hans → en → DEFAULT_TEXT
 * 尚未引入實作與測試框架；此檔為行為規格描述。
 */

// import { selectLocalizedText } from '../../src/utils/merge-pokemon.js'; // 預計未來提供的 helper

const mockNamesSets = {
  onlyEnglish: [ { language: { name: 'en' }, name: 'Bulbasaur' } ],
  hasHans: [ { language: { name: 'zh-Hans' }, name: '妙蛙種子' } ],
  hasHant: [ { language: { name: 'zh-Hant' }, name: '妙蛙種子（繁）' } ],
  mixed: [
    { language: { name: 'en' }, name: 'Bulbasaur' },
    { language: { name: 'zh-Hans' }, name: '妙蛙種子' },
    { language: { name: 'ja' }, name: 'フシギダネ' }
  ]
};

/**
 * 規劃案例：
 * 1. 同時缺 zh-Hant/zh-Hans 但有 en → 取 en
 * 2. 只有 zh-Hans → 取 zh-Hans
 * 3. 同時有 zh-Hant 與 zh-Hans → 取 zh-Hant (第一優先)
 * 4. 全缺（無 zh-Hant, zh-Hans, en）→ DEFAULT_TEXT
 */
function plannedLanguageFallbackCases() {
  return [
    '缺 zh-Hant/zh-Hans -> en',
    '只有 zh-Hans -> zh-Hans',
    '同時有 zh-Hant 與 zh-Hans -> zh-Hant',
    '全缺 -> DEFAULT_TEXT'
  ];
}

console.log('[CONTRACT PLACEHOLDER] fallback-language.spec.js planned cases:', plannedLanguageFallbackCases());
