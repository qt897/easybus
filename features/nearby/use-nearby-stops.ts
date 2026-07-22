"use client";

import { useMemo } from "react";
import { distanceMeters } from "@/lib/format";
import type { Stop } from "@/features/routes/types";

interface LatLng {
  lat: number;
  lng: number;
}

export interface NearbyStop {
  stop: Stop;
  distance: number;
}

export function useNearbyStops(
  stops: Stop[],
  origin: LatLng | null,
  limit: number
): NearbyStop[] {
  return useMemo(() => {
    if (!origin) return [];
    return [...stops]
      .map((stop) => ({ stop, distance: distanceMeters(origin, stop) }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);
  }, [stops, origin, limit]);
}
