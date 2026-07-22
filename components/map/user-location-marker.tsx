"use client";

import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import { useMapInstance } from "./map-instance-context";
import { useRouteMap } from "@/features/routes/route-context";

export function UserLocationMarker() {
  const map = useMapInstance();
  const { userLocation } = useRouteMap();
  const markerRef = useRef<maplibregl.Marker | null>(null);

  useEffect(() => {
    if (!map) return;

    if (!userLocation) {
      markerRef.current?.remove();
      markerRef.current = null;
      return;
    }

    if (!markerRef.current) {
      const el = document.createElement("div");
      el.className = "relative flex items-center justify-center";
      el.style.width = "18px";
      el.style.height = "18px";
      el.innerHTML = `
        <span class="absolute inset-0 rounded-full bg-map-user/40" style="animation: user-location-pulse 2.2s ease-out infinite;"></span>
        <span class="relative size-3 rounded-full bg-map-user ring-2 ring-white shadow"></span>
      `;
      markerRef.current = new maplibregl.Marker({ element: el, anchor: "center" });
    }

    markerRef.current.setLngLat([userLocation.lng, userLocation.lat]).addTo(map);
  }, [map, userLocation]);

  useEffect(() => {
    return () => {
      markerRef.current?.remove();
    };
  }, []);

  return null;
}
