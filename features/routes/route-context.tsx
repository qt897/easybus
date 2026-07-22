"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useRouteList } from "./use-route-list";
import { useRouteDetail } from "./use-route-detail";
import { splitRouteName } from "./derive";
import type { DirectionKey, RouteStop } from "./api-types";

export type SidebarTab = "routes" | "directions" | "favorites";

export interface RouteListItem {
  id: number;
  bus_no: string;
  name: string;
  origin: string;
  destination: string;
  color?: string;
  fare?: number;
  operation_time?: { start: string; end: string };
}

interface UserLocationState {
  lat: number;
  lng: number;
}

interface RouteMapContextValue {
  routes: RouteListItem[];
  filteredRoutes: RouteListItem[];
  loading: boolean;
  error: boolean;
  retry: () => void;

  query: string;
  setQuery: (value: string) => void;

  tab: SidebarTab;
  setTab: (tab: SidebarTab) => void;

  selectedBusNo: string | null;
  selectRoute: (busNo: string | null) => void;
  hoveredBusNo: string | null;
  setHoveredBusNo: (busNo: string | null) => void;

  detail: ReturnType<typeof useRouteDetail>["detail"];
  detailLoading: boolean;
  detailError: boolean;
  retryDetail: () => void;

  direction: DirectionKey;
  setDirection: (direction: DirectionKey) => void;
  directionStops: RouteStop[];

  selectedStop: RouteStop | null;
  selectStop: (stop: RouteStop | null) => void;

  userLocation: UserLocationState | null;
  locating: boolean;
  locationError: boolean;
  requestUserLocation: () => void;
}

const RouteMapContext = createContext<RouteMapContextValue | null>(null);

export function RouteMapProvider({ children }: { children: React.ReactNode }) {
  const { routes: rawRoutes, loading, error, retry } = useRouteList();

  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<SidebarTab>("routes");
  const [selectedBusNo, setSelectedBusNo] = useState<string | null>(null);
  const [hoveredBusNo, setHoveredBusNo] = useState<string | null>(null);
  const [direction, setDirection] = useState<DirectionKey>("outbound");
  const [selectedStop, setSelectedStop] = useState<RouteStop | null>(null);

  const [userLocation, setUserLocation] = useState<UserLocationState | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState(false);

  const { detail, loading: detailLoading, error: detailError, retry: retryDetail } =
    useRouteDetail(selectedBusNo);

  const routes = useMemo<RouteListItem[]>(
    () =>
      rawRoutes.map((r) => ({
        ...r,
        ...splitRouteName(r.name),
      })),
    [rawRoutes]
  );

  const filteredRoutes = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return routes;
    return routes.filter(
      (r) =>
        r.bus_no.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.origin.toLowerCase().includes(q) ||
        r.destination.toLowerCase().includes(q)
    );
  }, [routes, query]);

  const selectRoute = useCallback((busNo: string | null) => {
    setSelectedBusNo((current) => (current === busNo ? null : busNo));
    setSelectedStop(null);
    setDirection("outbound");
  }, []);

  const selectStop = useCallback((stop: RouteStop | null) => {
    setSelectedStop(stop);
  }, []);

  const directionStops = useMemo(() => {
    if (!detail) return [];
    return direction === "outbound"
      ? detail.direction_outbound.stops
      : detail.direction_inbound.stops;
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
      { enableHighAccuracy: true, timeout: 8000 }
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

  return (
    <RouteMapContext.Provider value={value}>
      {children}
    </RouteMapContext.Provider>
  );
}

export function useRouteMap() {
  const ctx = useContext(RouteMapContext);
  if (!ctx) throw new Error("useRouteMap must be used within RouteMapProvider");
  return ctx;
}
