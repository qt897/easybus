"use client";

import { createContext, useContext } from "react";
import type * as maplibregl from "maplibre-gl";

const MapInstanceContext = createContext<maplibregl.Map | null>(null);

export function MapInstanceProvider({
  map,
  children,
}: {
  map: maplibregl.Map | null;
  children: React.ReactNode;
}) {
  return (
    <MapInstanceContext.Provider value={map}>
      {children}
    </MapInstanceContext.Provider>
  );
}

export function useMapInstance() {
  return useContext(MapInstanceContext);
}
