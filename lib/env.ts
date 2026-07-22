/** Server-only environment access — never import this from client components. */

export const DATA_BASE_URL =
  process.env.EASYBUS_DATA_BASE_URL ??
  "https://raw.githubusercontent.com/qt897/easybus/refs/heads/main/data";

export const DATA_CACHE_SECONDS = Number(
  process.env.EASYBUS_DATA_CACHE_SECONDS ?? 3600
);
