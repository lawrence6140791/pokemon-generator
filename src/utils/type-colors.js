// type-colors.js
// 初始屬性對應色彩（T006）。僅提供部分常見屬性；T026 將補齊並加上無障礙對比說明。
// 顏色為柔和背景，文字顏色後續由 UI 決定（可能根據亮度計算）。

// 顏色來源：取自常見社群配色 (近似官方) 並稍微調整亮度以利文字對比。
// 後續在 docs/background-colors.md 補上對比與建議文字色（淺底用 #222, 深底用 #fff）。
export const TYPE_COLORS = {
  normal:   '#A8A878',
  fire:     '#F08030',
  water:    '#6890F0',
  electric: '#F8D030',
  grass:    '#78C850',
  ice:      '#98D8D8',
  fighting: '#C03028',
  poison:   '#A040A0',
  ground:   '#E0C068',
  flying:   '#A890F0',
  psychic:  '#F85888',
  bug:      '#A8B820',
  rock:     '#B8A038',
  ghost:    '#705898',
  dragon:   '#7038F8',
  dark:     '#705848',
  steel:    '#B8B8D0',
  fairy:    '#EE99AC',
};

export function colorForType(type) {
  if (!type) return '#CCCCCC';
  return TYPE_COLORS[type] || '#CCCCCC';
}
