"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useRouteList } from "./use-route-list";
import { useRouteDetail } from "./use-route-detail";
import { splitRouteName } from "./derive";
import { useRouteSearch } from "@/features/search/use-route-search";
import { GEOLOCATION_TIMEOUT_MS } from "@/lib/constants";
import type { ApiErrorCode } from "@/lib/i18n/types";
import type { DirectionKey, RouteDetail, RouteSummary, Stop } from "./types";

export type SidebarTab = "routes" | "directions" | "favorites";

export interface RouteListItem extends RouteSummary {
  origin: string;
  destination: string;
}

interface UserLocationState {
  lat: number;
  lng: number;
}

interface RouteMapContextValue {
  routes: RouteListItem[];
  filteredRoutes: RouteListItem[];
  loading: boolean;
  error: ApiErrorCode | null;
  retry: () => void;

  query: string;
  setQuery: (value: string) => void;

  tab: SidebarTab;
  setTab: (tab: SidebarTab) => void;

  selectedBusNo: string | null;
  selectRoute: (busNo: string | null) => void;
  hoveredBusNo: string | null;
  setHoveredBusNo: (busNo: string | null) => void;

  detail: RouteDetail | null;
  detailLoading: boolean;
  detailError: ApiErrorCode | null;
  retryDetail: () => void;

  direction: DirectionKey;
  setDirection: (direction: DirectionKey) => void;
  directionStops: Stop[];

  selectedStop: Stop | null;
  selectStop: (stop: Stop | null) => void;

  userLocation: UserLocationState | null;
  locating: boolean;
  locationError: boolean;
  requestUserLocation: () => void;
}

const RouteMapContext = createContext<RouteMapContextValue | null>(null);

export function RouteMapProvider({ children }: { children: React.ReactNode }) {
  const { routes: rawRoutes, loading, error, retry } = useRouteList();

  const [tab, setTab] = useState<SidebarTab>("routes");
  const [selectedBusNo, setSelectedBusNo] = useState<string | null>(null);
  const [hoveredBusNo, setHoveredBusNo] = useState<string | null>(null);
  const [direction, setDirection] = useState<DirectionKey>("outbound");
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);

  const [userLocation, setUserLocation] = useState<UserLocationState | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState(false);

  const {
    detail,
    loading: detailLoading,
    error: detailError,
    retry: retryDetail,
  } = useRouteDetail(selectedBusNo);

  const routes = useMemo<RouteListItem[]>(
    () => rawRoutes.map((r) => ({ ...r, ...splitRouteName(r.name) })),
    [rawRoutes]
  );

  const { query, setQuery, filteredRoutes } = useRouteSearch(routes);

  const selectRoute = useCallback((busNo: string | null) => {
    setSelectedBusNo((current) => (current === busNo ? null : busNo));
    setSelectedStop(null);
    setDirection("outbound");
  }, []);

  const selectStop = useCallback((stop: Stop | null) => {
    setSelectedStop(stop);
  }, []);

  const directionStops = useMemo(() => {
    if (!detail) return [];
    return direction === "outbound" ? detail.directionOutbound.stops : detail.directionInbound.stops;
  }, [detail, direction]);

  const requestUserLocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setLocationError(true);
      return;
    }
    setLocating(true);
    setLocationError(false);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocating(false);
      },
      () => {
        setLocationError(true);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: GEOLOCATION_TIMEOUT_MS }
    );
  }, []);

  const value: RouteMapContextValue = {
    routes,
    filteredRoutes,
    loading,
    error,
    retry,
    query,
    setQuery,
    tab,
    setTab,
    selectedBusNo,
    selectRoute,
    hoveredBusNo,
    setHoveredBusNo,
    detail,
    detailLoading,
    detailError,
    retryDetail,
    direction,
    setDirection,
    directionStops,
    selectedStop,
    selectStop,
    userLocation,
    locating,
    locationError,
    requestUserLocation,
  };

  return <RouteMapContext.Provider value={value}>{children}</RouteMapContext.Provider>;
}

export function useRouteMap() {
  const ctx = useContext(RouteMapContext);
  if (!ctx) throw new Error("useRouteMap must be used within RouteMapProvider");
  return ctx;
}
