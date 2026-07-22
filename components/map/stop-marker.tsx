"use client";

import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import { useMapInstance } from "./map-instance-context";
import { useRouteMap } from "@/features/routes/route-context";
import type { RouteStop } from "@/features/routes/api-types";

const DEFAULT_COLOR = "#d9714f";

function createMarkerElement(kind: "origin" | "stop" | "destination", color: string) {
  const el = document.createElement("div");
  el.className =
    "flex items-center justify-center cursor-pointer transition-transform duration-150 ease-out hover:scale-125";

  if (kind === "origin") {
    el.style.width = "16px";
    el.style.height = "16px";
    el.style.borderRadius = "9999px";
    el.style.background = color;
    el.style.border = "3px solid white";
    el.style.boxShadow = "0 2px 6px rgba(20,30,25,0.35)";
    return el;
  }

  if (kind === "destination") {
    el.innerHTML = `
      <svg width="26" height="30" viewBox="0 0 26 30" fill="none">
        <path d="M13 1C6.4 1 1 6.2 1 12.7C1 21 13 29 13 29C13 29 25 21 25 12.7C25 6.2 19.6 1 13 1Z"
          fill="${color}" stroke="white" stroke-width="2"/>
        <circle cx="13" cy="12.5" r="4.5" fill="white"/>
      </svg>`;
    el.style.width = "26px";
    el.style.height = "30px";
    el.style.transformOrigin = "bottom center";
    return el;
  }

  el.style.width = "11px";
  el.style.height = "11px";
  el.style.borderRadius = "9999px";
  el.style.background = color;
  el.style.border = "2px solid white";
  el.style.boxShadow = "0 1px 4px rgba(20,30,25,0.3)";
  return el;
}

export function StopMarkers() {
  const map = useMapInstance();
  const { detail, directionStops, selectStop } = useRouteMap();
  const markersRef = useRef<Map<number, maplibregl.Marker>>(new Map());

  useEffect(() => {
    if (!map) return;

    const markers = markersRef.current;
    markers.forEach((marker) => marker.remove());
    markers.clear();

    const color = detail?.route.color || DEFAULT_COLOR;

    directionStops.forEach((stop: RouteStop, index: number) => {
      let kind: "origin" | "stop" | "destination" = "stop";
      if (index === 0) kind = "origin";
      else if (index === directionStops.length - 1) kind = "destination";

      const el = createMarkerElement(kind, color);
      const marker = new maplibregl.Marker({
        element: el,
        anchor: kind === "destination" ? "bottom" : "center",
      })
        .setLngLat([stop.lng, stop.lat])
        .addTo(map);

      el.addEventListener("click", (event) => {
        event.stopPropagation();
        selectStop(stop);
      });

      markers.set(stop.stop_id, marker);
    });

    return () => {
      markers.forEach((marker) => marker.remove());
      markers.clear();
    };
  }, [map, directionStops, detail, selectStop]);

  return null;
}
