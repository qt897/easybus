// Curated, on-brand palette — the transit agency's own per-route colors
// (from the API) are inconsistent and often clash, so every route in the UI
// (cards, detail badge, map polyline/markers, popups) is colored from this
// set instead, picked deterministically from the bus number. Plain hex so
// the same value works for both DOM (inline style) and MapLibre paint
// properties (which can't resolve CSS custom properties).
const PALETTE = [
  "#d9714f", // terracotta
  "#e0a52e", // amber
  "#6f8fea", // periwinkle
  "#e0648a", // rose
  "#2fa695", // teal
  "#a67ce8", // violet
];

export function colorForBusNo(busNo: string): string {
  let hash = 0;
  for (let i = 0; i < busNo.length; i++) {
    hash = (hash * 31 + busNo.charCodeAt(i)) | 0;
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}
