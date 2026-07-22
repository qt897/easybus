"use client";

import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import { useMapInstance } from "./map-instance-context";
import { useRouteMap } from "@/features/routes/route-context";
import { colorForBusNo } from "@/features/routes/colors";
import { DEFAULT_ROUTE_COLOR } from "@/lib/constants";
import type { Stop } from "@/features/routes/types";

function createMarkerElement(kind: "origin" | "stop" | "destination", color: string) {
  const el = document.createElement("div");
  el.className = "flex cursor-pointer items-center justify-center";

  const inner = document.createElement("div");
  inner.className = "transition-transform duration-150 ease-out hover:scale-125";
  el.appendChild(inner);

  if (kind === "origin") {
    inner.style.width = "16px";
    inner.style.height = "16px";
    inner.style.borderRadius = "9999px";
    inner.style.background = color;
    inner.style.border = "3px solid white";
    inner.style.boxShadow = "0 2px 6px rgba(20,30,25,0.35)";
    return el;
  }

  if (kind === "destination") {
    inner.innerHTML = `
      <svg width="26" height="30" viewBox="0 0 26 30" fill="none">
        <path d="M13 1C6.4 1 1 6.2 1 12.7C1 21 13 29 13 29C13 29 25 21 25 12.7C25 6.2 19.6 1 13 1Z"
          fill="${color}" stroke="white" stroke-width="2"/>
        <circle cx="13" cy="12.5" r="4.5" fill="white"/>
      </svg>`;
    inner.style.width = "26px";
    inner.style.height = "30px";
    inner.style.transformOrigin = "bottom center";
    return el;
  }

  inner.style.width = "11px";
  inner.style.height = "11px";
  inner.style.borderRadius = "9999px";
  inner.style.background = color;
  inner.style.border = "2px solid white";
  inner.style.boxShadow = "0 1px 4px rgba(20,30,25,0.3)";
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

    const color = detail ? colorForBusNo(detail.route.busNo) : DEFAULT_ROUTE_COLOR;

    directionStops.forEach((stop: Stop, index: number) => {
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

      markers.set(stop.stopId, marker);
    });

    return () => {
      markers.forEach((marker) => marker.remove());
      markers.clear();
    };
  }, [map, directionStops, detail, selectStop]);

  return null;
}
