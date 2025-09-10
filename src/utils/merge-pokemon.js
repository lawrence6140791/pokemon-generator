// merge-pokemon.js
// 實作 buildPokemon: 將 raw pokemon 與 raw species 合併為前端使用資料物件。
// 對應 data-model 與契約測試描述 (T007-T010)。

import { DEFAULT_TEXT, UNKNOWN_IMAGE } from './constants.js';
import { colorForType } from './type-colors.js';

// 尋找 animated sprite (generation-v -> black-white -> animated.front_default)
function findAnimatedSprite(rawPokemon) {
  try {
    return rawPokemon?.sprites?.versions?.['generation-v']?.['black-white']?.animated?.front_default || null;
  } catch (_) {
    return null;
  }
}

function selectImageUrl(rawPokemon) {
  const animated = findAnimatedSprite(rawPokemon);
  if (animated) return animated;
  const staticImg = rawPokemon?.sprites?.front_default;
  if (staticImg) return staticImg;
  return UNKNOWN_IMAGE;
}

const LANGUAGE_PRIORITY = ['zh-Hant', 'zh-Hans', 'en'];

function extractLocalized(entries, valueKey) {
  if (!Array.isArray(entries)) return DEFAULT_TEXT;
  for (const lang of LANGUAGE_PRIORITY) {
    const match = entries.find(e => e?.language?.name === lang);
    if (match && match[valueKey]) {
      return normalizeWhitespace(match[valueKey]);
    }
  }
  // fallback: 若都找不到 en，嘗試第一個有效文字；否則 DEFAULT_TEXT
  const any = entries.find(e => e && e[valueKey]);
  return any ? normalizeWhitespace(any[valueKey]) : DEFAULT_TEXT;
}

function normalizeWhitespace(str) {
  if (typeof str !== 'string') return str;
  // PokeAPI flavor_text 常含換行、跳脫；統一轉空白
  return str.replace(/\s+/g, ' ').trim();
}

function selectName(rawSpecies) {
  return extractLocalized(rawSpecies?.names, 'name');
}

function selectDescription(rawSpecies) {
  return extractLocalized(rawSpecies?.flavor_text_entries, 'flavor_text');
}

function extractTypes(rawPokemon) {
  const list = rawPokemon?.types;
  if (!Array.isArray(list)) return { types: [], primaryType: null };
  const sorted = [...list].sort((a, b) => (a?.slot || 0) - (b?.slot || 0));
  const names = sorted.map(t => t?.type?.name).filter(Boolean);
  const primaryType = names[0] || null;
  return { types: names, primaryType };
}

export function buildPokemon(rawPokemon, rawSpecies, timestamp = Date.now()) {
  if (!rawPokemon || !rawSpecies) {
    throw new Error('buildPokemon requires both rawPokemon and rawSpecies');
  }
  const { types, primaryType } = extractTypes(rawPokemon);
  const name = selectName(rawSpecies);
  const description = selectDescription(rawSpecies);
  const imageUrl = selectImageUrl(rawPokemon);
  return {
    id: rawPokemon.id,
    name,
    description,
    imageUrl,
    types,
    primaryType,
    primaryColor: primaryType ? colorForType(primaryType) : '#CCCCCC',
    obtainedAt: timestamp,
  };
}

// 為未來測試（T007-T010）可能需要個別 helper，可選擇性匯出
export const __testables = {
  selectImageUrl,
  selectName,
  selectDescription,
  extractTypes,
  normalizeWhitespace,
};
