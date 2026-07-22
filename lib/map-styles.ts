export const MAP_STYLES = {
  simple:
    process.env.NEXT_PUBLIC_MAP_STYLE_SIMPLE_URL ??
    "https://tiles.openfreemap.org/styles/positron",
  detailed:
    process.env.NEXT_PUBLIC_MAP_STYLE_DETAILED_URL ??
    "https://tiles.openfreemap.org/styles/liberty",
} as const;

export type MapStyleKey = keyof typeof MAP_STYLES;
