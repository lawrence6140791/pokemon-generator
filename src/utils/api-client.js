// api-client.js
// 負責呼叫 PokeAPI v2。僅包裝 fetch，錯誤交由上層處理。
// 參考 endpoints:
//  - https://pokeapi.co/api/v2/pokemon/{id}
//  - https://pokeapi.co/api/v2/pokemon-species/{id}

const BASE = 'https://pokeapi.co/api/v2';

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const err = new Error(`Request failed ${res.status} ${res.statusText}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

export async function fetchPokemon(id) {
  return fetchJson(`${BASE}/pokemon/${id}`);
}

export async function fetchSpecies(id) {
  return fetchJson(`${BASE}/pokemon-species/${id}`);
}
