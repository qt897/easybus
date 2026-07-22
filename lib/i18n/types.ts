export type Locale = "vi" | "en";

export type ApiErrorCode =
  | "ROUTES_FETCH_FAILED"
  | "ROUTE_NOT_FOUND"
  | "ROUTE_DETAIL_FETCH_FAILED"
  | "INVALID_BUS_NO"
  | "UNKNOWN";

export interface Dictionary {
  header: {
    searchPlaceholder: string;
    city: string;
    login: string;
    signup: string;
  };
  sidebar: {
    tabRoutes: string;
    tabDirections: string;
    tabFavorites: string;
    comingSoon: string;
    directionsLabel: string;
    favoritesLabel: string;
    expand: string;
    collapse: string;
  };
  routeSearch: {
    placeholder: string;
    clearAriaLabel: string;
  };
  routeList: {
    emptyTitle: string;
    emptyDesc: string;
    errorTitle: string;
    errorDesc: string;
    retry: string;
  };
  routeDetail: {
    operationHours: string;
    headway: string;
    distance: string;
    seats: string;
    minutesUnit: string;
    seatsUnit: string;
    fare: string;
    noFareInfo: string;
    operator: string;
    outbound: string;
    inbound: string;
    stopsCount: string;
    back: string;
    errorTitle: string;
    retry: string;
  };
  popup: {
    routesThrough: string;
    close: string;
  };
  mapControls: {
    nearby: string;
    nearbyTitle: string;
    nearbyNoRoute: string;
    nearbyNoLocation: string;
    enableLocation: string;
    locateMe: string;
    layers: string;
    styleSimple: string;
    styleDetailed: string;
    zoomIn: string;
    zoomOut: string;
    resetCompass: string;
    currentLocation: string;
  };
  floatingSearch: {
    placeholder: string;
  };
  errors: Record<ApiErrorCode, string>;
}
