// random-id.js
// nextRandom(excludeId?)：回傳 1..MAX_ID 之間整數；若結果等於 excludeId 則再抽一次（第二次不再強制避免）。

import { MAX_ID } from './constants.js';

export function nextRandom(excludeId) {
  const first = rand();
  if (excludeId != null && first === excludeId) {
    const second = rand();
    return second; // 即使仍相同也接受
  }
  return first;
}

function rand() {
  return Math.floor(Math.random() * MAX_ID) + 1; // 1..MAX_ID
}

export const __testables = { rand };
