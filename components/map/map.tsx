"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import * as maplibregl from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { MapInstanceProvider } from "./map-instance-context";
import { RouteLayer } from "./route-layer";
import { StopMarkers } from "./stop-marker";
import { UserLocationMarker } from "./user-location-marker";
import { StopPopup } from "./popup";
import { FloatingSearch } from "./floating-search";
import { MapControlsTopRight, MapControlsBottomRight } from "./map-controls";
import { useRouteMap } from "@/features/routes/route-context";
import { HCMC_CENTER } from "@/features/routes/data";
import { MAP_STYLES } from "@/lib/map-styles";

// Next.js bundles maplibre-gl as ESM, whose worker resolves relative to
// `import.meta.url` — that isn't an http(s) URL under Turbopack/webpack, so
// the built-in worker silently never starts. Self-host the worker bundle
// (copied from node_modules to public/) and point maplibre at it directly.
maplibregl.setWorkerUrl("/maplibre-gl-worker.mjs");

export function MapContainer() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const { selectStop } = useRouteMap();

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const instance = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLES.simple,
      center: HCMC_CENTER,
      zoom: 12.2,
      attributionControl: { compact: true },
    });

    mapRef.current = instance;
    instance.on("load", () => setMap(instance));
    instance.on("click", () => selectStop(null));

    return () => {
      instance.remove();
      mapRef.current = null;
    };
  }, [selectStop]);

  return (
    <div className="relative flex-1 overflow-hidden bg-muted">
      <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />

      {!map && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}

      <MapInstanceProvider map={map}>
        <RouteLayer />
        <StopMarkers />
        <UserLocationMarker />
        <StopPopup />
        <FloatingSearch />
        <MapControlsTopRight />
        <MapControlsBottomRight />
      </MapInstanceProvider>
    </div>
  );
}
