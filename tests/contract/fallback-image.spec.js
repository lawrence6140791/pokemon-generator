/**
 * Contract Test (Fail-First Placeholder): fallback-image
 * 驗證圖片 fallback 順序： animated → front_default → UNKNOWN_IMAGE
 */

// import { selectImageUrl } from '../../src/utils/merge-pokemon.js'; // 預計未來提供 helper
// import { UNKNOWN_IMAGE } from '../../src/utils/constants.js';

const mockSpriteSets = {
  animatedAndFront: {
    sprites: {
      versions: { 'generation-v': { 'black-white': { animated: { front_default: 'anim.gif' } } } },
      front_default: 'static.png'
    }
  },
  onlyStatic: {
    sprites: { front_default: 'only-static.png' }
  },
  none: {
    sprites: { }
  }
};

function plannedImageFallbackCases() {
  return [
    'animated 存在 -> 使用 animated URL',
    'animated 缺但 front_default 存在 -> 使用 front_default',
    '兩者都缺 -> 使用 UNKNOWN_IMAGE'
  ];
}

console.log('[CONTRACT PLACEHOLDER] fallback-image.spec.js planned cases:', plannedImageFallbackCases());
