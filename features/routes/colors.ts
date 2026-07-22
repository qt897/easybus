const PALETTE = [
  "var(--route-1)",
  "var(--route-2)",
  "var(--route-3)",
  "var(--route-4)",
  "var(--route-5)",
  "var(--route-6)",
];

/**
 * The route list endpoint doesn't always resolve a real color for every
 * route (only per-route detail always has one). Assign a stable palette
 * color per bus number as a fallback, keyed to the current theme via CSS
 * variables so it stays correct across light/dark.
 */
export function colorForBusNo(busNo: string): string {
  let hash = 0;
  for (let i = 0; i < busNo.length; i++) {
    hash = (hash * 31 + busNo.charCodeAt(i)) | 0;
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}
