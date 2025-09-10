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

function findSvgSprite(rawPokemon) {
  try {
    return rawPokemon?.sprites?.other?.dream_world?.front_default || null;
  } catch (_) {
    return null;
  }
}

function findStaticPng(rawPokemon) {
  return rawPokemon?.sprites?.front_default || null;
}

// 主顯示圖優先序： dream_world SVG → front_default → UNKNOWN
function selectPrimaryImage(rawPokemon) {
  const svg = findSvgSprite(rawPokemon);
  if (svg) return svg;
  const png = findStaticPng(rawPokemon);
  if (png) return png;
  return UNKNOWN_IMAGE;
}

// 向後相容：舊測試使用 imageUrl 指向 (animated || static)；現改為 primary image（不再自動取 animated）
// 若需要背面動圖顯示，另外提供 animatedImage 欄位。
function selectImageUrl(rawPokemon) {
  return selectPrimaryImage(rawPokemon);
}

const NAME_LANGUAGE_PRIORITY = ['zh-Hant', 'zh-Hans', 'en'];
const DESCRIPTION_LANGUAGE_PRIORITY = ['zh-Hant', 'zh-Hans'];

function extractLocalized(entries, valueKey, priority) {
  if (!Array.isArray(entries)) return DEFAULT_TEXT;
  for (const lang of priority) {
    const match = entries.find(e => e?.language?.name === lang);
    if (match && match[valueKey]) {
      return normalizeWhitespace(match[valueKey]);
    }
  }
  // fallback: 尋找第一個有效文字；否則 DEFAULT_TEXT
  const any = entries.find(e => e && e[valueKey]);
  return any ? normalizeWhitespace(any[valueKey]) : DEFAULT_TEXT;
}

function normalizeWhitespace(str) {
  if (typeof str !== 'string') return str;
  // PokeAPI flavor_text 常含換行、跳脫；統一轉空白
  return str.replace(/\s+/g, ' ').trim();
}

function selectName(rawSpecies) {
  return extractLocalized(rawSpecies?.names, 'name', NAME_LANGUAGE_PRIORITY);
}

function selectDescription(rawSpecies) {
  if (!Array.isArray(rawSpecies?.flavor_text_entries)) return DEFAULT_TEXT;
  for (const lang of DESCRIPTION_LANGUAGE_PRIORITY) {
    const match = rawSpecies.flavor_text_entries.find(e => e?.language?.name === lang);
    if (match && match.flavor_text) {
      return normalizeWhitespace(match.flavor_text);
    }
  }
  return DEFAULT_TEXT;
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
  const englishNameRaw = (rawPokemon?.name || '').trim();
  const svgImage = findSvgSprite(rawPokemon);
  const staticImage = findStaticPng(rawPokemon);
  const animatedImage = findAnimatedSprite(rawPokemon);
  const imageUrl = selectPrimaryImage(rawPokemon);
  const stats = extractStats(rawPokemon);
  return {
    id: rawPokemon.id,
  name,
  englishName: englishNameRaw || '',
    description,
    imageUrl,
    svgImage: svgImage || null,
    staticImage: staticImage || null,
    animatedImage: animatedImage || null,
    hp: stats.hp,
    attack: stats.attack,
    defense: stats.defense,
    speed: stats.speed,
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
  findAnimatedSprite,
  findSvgSprite,
  findStaticPng,
  selectPrimaryImage,
  extractStats,
};

// 取出指定四項能力值
function extractStats(rawPokemon) {
  const result = { hp: 0, attack: 0, defense: 0, speed: 0 };
  if (!Array.isArray(rawPokemon?.stats)) return result;
  rawPokemon.stats.forEach(s => {
    const name = s?.stat?.name;
    const val = typeof s?.base_stat === 'number' ? s.base_stat : 0;
    switch (name) {
      case 'hp': result.hp = val; break;
      case 'attack': result.attack = val; break;
      case 'defense': result.defense = val; break;
      case 'speed': result.speed = val; break;
      default: break; // 其他（special-attack 等）暫不顯示
    }
  });
  return result;
}
