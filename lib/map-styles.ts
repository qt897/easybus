export const MAP_STYLES = {
  simple: "https://tiles.openfreemap.org/styles/positron",
  detailed: "https://tiles.openfreemap.org/styles/liberty",
} as const;

export type MapStyleKey = keyof typeof MAP_STYLES;
