// main.js
// 整合抽卡流程：
// 1. 按鈕點擊 -> 若未 inProgress -> begin -> 執行 fetch 兩 API -> merge -> render
// 2. 錯誤：第一次失敗顯示錯誤 + 倒數； draw-state 排程 retry 的事件 'draw:retry'
// 3. 第二次仍失敗 -> permanent error -> 顯示錯誤，不再重試
// 4. 卡片點擊翻面在 card.js 已註冊

import { fetchPokemon, fetchSpecies } from './utils/api-client.js';
import { buildPokemon } from './utils/merge-pokemon.js';
import { nextRandom } from './utils/random-id.js';
import { begin, success, fail, isInProgress, hasPermanentError, getLastId } from './state/draw-state.js';
import { startLoading, stopLoading } from './ui/loading.js';
import { showError, clearError } from './ui/error-banner.js';
import { renderCard, updateCard } from './ui/card.js';

// Template 載入 Promise，確保在首次 draw 前完成，避免 card.js 找不到 template 警告。
let templateReadyResolve;
const templateReady = new Promise(res => { templateReadyResolve = res; });

// 將 template HTML 載入（簡單方式：fetch + insert）。也可直接在 index.html inline。
(async function ensureTemplateInjected() {
  try {
    if (!document.querySelector('#pokemon-card-template')) {
      const res = await fetch('ui/card-template.html');
      if (res.ok) {
        const html = await res.text();
        const div = document.createElement('div');
        div.innerHTML = html;
        const tpl = div.firstElementChild;
        if (tpl) document.body.appendChild(tpl);
      }
    }
  } catch (e) {
    console.warn('[main] unable to load card-template.html', e);
  } finally {
    templateReadyResolve();
  }
})();

const cardArea = document.getElementById('card-area');
const drawBtn = document.getElementById('draw-btn');

function bindEvents() {
  if (drawBtn) {
    drawBtn.addEventListener('click', () => {
      triggerDraw();
    });
  }
  window.addEventListener('draw:retry', () => {
    // 自動重試從頭走流程，但不需阻擋（draw-state 已調整 attempts）
    triggerDraw({ isRetry: true });
  });
}

async function triggerDraw({ isRetry = false, fixedId = null } = {}) {
  if (isInProgress() && !isRetry) return; // 避免人工雙擊並行
  await templateReady; // 確保 template 已載入
  clearError();
  startLoading();
  let id = fixedId != null ? fixedId : nextRandom(getLastId());
  if (!isRetry) {
    const started = begin(id);
    if (!started) {
      stopLoading();
      return;
    }
  }
  try {
    const [rawPokemon, rawSpecies] = await Promise.all([
      fetchPokemon(id),
      fetchSpecies(id),
    ]);
    const merged = buildPokemon(rawPokemon, rawSpecies, Date.now());
    // 若尚未有卡片則 renderCard 立即同步建立，再等圖片預載；若已有卡片則 updateCard 回傳 Promise
    const updatePromise = renderOrUpdateCard(merged);
    if (updatePromise && typeof updatePromise.then === 'function') {
      await updatePromise;
    }
    success();
    stopLoading();
  } catch (e) {
    console.error('[draw] error', e);
    fail();
    stopLoading();
    // 判斷是否還會自動重試：fail() 後若非 permanent -> 顯示倒數
    if (!hasPermanentError()) {
      showError('取得資料失敗，將自動再試一次。', { retryScheduled: true });
    } else {
      showError('無法取得資料，請稍後再試。');
    }
  }
}

function renderOrUpdateCard(pokemon) {
  if (!cardArea) return;
  let existing = cardArea.querySelector('.poke-card');
  if (!existing) {
    const card = renderCard(pokemon);
    if (card) cardArea.appendChild(card);
    // 首次建立已在 renderCard 中同步套資料，這裡仍需等待 update（包含動圖）再行完成 loading
    // 但首次 card 已經 applyData，為保持一致性仍走二次預載（可選）；這裡直接預載 animated 若存在
    return Promise.resolve();
  } else {
    // 若正在翻面，維持 class 不變；直接更新內容
    return updateCard(existing, pokemon);
    // 確保正面朝上（需求指「覆蓋顯示新卡」而不是保留背面）
    existing.classList.remove('is-flipped');
  }
}

bindEvents();

// 初始載入顯示皮卡丘 (ID=25)
(async function initialLoad() {
  try {
    await templateReady; // 等待模板後再載入初始卡片
    await triggerDraw({ fixedId: 25 });
  } catch (e) {
    console.warn('[init] initial load failed', e);
  }
})();
