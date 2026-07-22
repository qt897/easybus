"use client";

import { useEffect, useMemo, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import { useMapInstance } from "./map-instance-context";
import { useRouteMap } from "@/features/routes/route-context";
import { colorForBusNo } from "@/features/routes/colors";
import {
  DEFAULT_ROUTE_COLOR,
  ROUTE_FIT_BOUNDS_MAX_ZOOM,
  ROUTE_FIT_BOUNDS_PADDING,
} from "@/lib/constants";

const SOURCE_ID = "selected-route";
const LAYER_CASING = "selected-route-casing";
const LAYER_LINE = "selected-route-line";

interface RouteLine {
  color: string;
  path: [number, number][];
}

function applyRouteData(map: maplibregl.Map, line: RouteLine | null) {
  const source = map.getSource(SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
  if (!source) return;

  if (!line || line.path.length < 2) {
    source.setData({ type: "FeatureCollection", features: [] });
    return;
  }

  source.setData({
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: { type: "LineString", coordinates: line.path },
      },
    ],
  });

  if (map.getLayer(LAYER_LINE)) {
    map.setPaintProperty(LAYER_LINE, "line-color", line.color);
  }
}

export function RouteLayer() {
  const map = useMapInstance();
  const { detail, directionStops } = useRouteMap();

  const line: RouteLine | null = useMemo(
    () =>
      detail
        ? {
            color: colorForBusNo(detail.route.busNo),
            path: directionStops.map((s) => [s.lng, s.lat] as [number, number]),
          }
        : null,
    [detail, directionStops]
  );

  const lineRef = useRef(line);
  useEffect(() => {
    lineRef.current = line;
  }, [line]);

  useEffect(() => {
    if (!map) return;

    const ensureLayers = () => {
      if (map.getSource(SOURCE_ID)) return;
      map.addSource(SOURCE_ID, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });
      map.addLayer({
        id: LAYER_CASING,
        type: "line",
        source: SOURCE_ID,
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": "#ffffff", "line-width": 7.5, "line-opacity": 0.95 },
      });
      map.addLayer({
        id: LAYER_LINE,
        type: "line",
        source: SOURCE_ID,
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": DEFAULT_ROUTE_COLOR, "line-width": 4.5 },
      });
      applyRouteData(map, lineRef.current);
    };

    ensureLayers();
    map.on("style.load", ensureLayers);
    return () => {
      map.off("style.load", ensureLayers);
    };
  }, [map]);

  useEffect(() => {
    if (!map || !map.getSource(SOURCE_ID)) return;
    applyRouteData(map, line);

    if (!line || line.path.length < 2) return;

    const [first, ...rest] = line.path;
    const bounds = rest.reduce(
      (b, coord) => b.extend(coord),
      new maplibregl.LngLatBounds(first, first)
    );
    map.fitBounds(bounds, {
      padding: ROUTE_FIT_BOUNDS_PADDING,
      duration: 800,
      maxZoom: ROUTE_FIT_BOUNDS_MAX_ZOOM,
    });
  }, [map, line]);

  return null;
}
