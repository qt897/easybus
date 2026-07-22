/** Shared, non-secret parameters used across the app. */

export const CITY_CENTER: [lng: number, lat: number] = [
  Number(process.env.NEXT_PUBLIC_CITY_CENTER_LNG ?? 106.6997),
  Number(process.env.NEXT_PUBLIC_CITY_CENTER_LAT ?? 10.7769),
];

export const DEFAULT_MAP_ZOOM = Number(
  process.env.NEXT_PUBLIC_DEFAULT_MAP_ZOOM ?? 12.2
);

/** Zoom used when flying to a single stop (search result, nearby pick, popup). */
export const STOP_FOCUS_ZOOM = 15;

/** Used when a route has no color of its own yet (list still loading, etc). */
export const DEFAULT_ROUTE_COLOR = "#d9714f";

export const ROUTE_FIT_BOUNDS_MAX_ZOOM = 14.5;

export const ROUTE_FIT_BOUNDS_PADDING = {
  top: 110,
  bottom: 90,
  left: 90,
  right: 90,
};

export const NEARBY_STOPS_LIMIT = 5;

export const SEARCH_SUGGESTIONS_LIMIT = 6;

export const GEOLOCATION_TIMEOUT_MS = 8000;

export const SIDEBAR_WIDTH_PX = 380;

export const SIDEBAR_PEEK_HEIGHT_PX = 152;

export const SIDEBAR_EXPANDED_HEIGHT_VH = 78;

/** Keeps the bottom-right map controls clear of the mobile sidebar's peek height. */
export const MAP_CONTROLS_MOBILE_BOTTOM_OFFSET_PX = 172;
