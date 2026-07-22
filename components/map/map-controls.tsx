"use client";

import { useEffect, useState } from "react";
import {
  Compass,
  Crosshair,
  Layers,
  LocateFixed,
  Minus,
  Plus,
  Radar,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { formatDistanceMeters } from "@/lib/format";
import { MAP_STYLES, type MapStyleKey } from "@/lib/map-styles";
import {
  MAP_CONTROLS_MOBILE_BOTTOM_OFFSET_PX,
  NEARBY_STOPS_LIMIT,
  STOP_FOCUS_ZOOM,
} from "@/lib/constants";
import { useMapInstance } from "./map-instance-context";
import { useRouteMap } from "@/features/routes/route-context";
import { useNearbyStops } from "@/features/nearby/use-nearby-stops";
import { useTranslation } from "@/lib/i18n/context";
import type { Dictionary } from "@/lib/i18n/types";

function styleLabels(t: Dictionary): Record<MapStyleKey, string> {
  return { simple: t.mapControls.styleSimple, detailed: t.mapControls.styleDetailed };
}

function ControlButton({
  label,
  onClick,
  children,
  active,
  disabled,
}: {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        className={cn(
          "flex size-10 items-center justify-center text-foreground transition-colors first:rounded-t-2xl last:rounded-b-2xl hover:bg-accent/60 disabled:pointer-events-none disabled:opacity-40",
          active && "bg-accent text-accent-foreground"
        )}
      >
        {children}
      </TooltipTrigger>
      <TooltipContent side="left">{label}</TooltipContent>
    </Tooltip>
  );
}

export function MapControlsTopRight() {
  const map = useMapInstance();
  const { userLocation, locating, requestUserLocation, directionStops, selectStop, selectedBusNo } =
    useRouteMap();
  const t = useTranslation();
  const [styleKey, setStyleKey] = useState<MapStyleKey>("simple");
  const [nearbyOpen, setNearbyOpen] = useState(false);

  const nearby = useNearbyStops(directionStops, userLocation, NEARBY_STOPS_LIMIT);

  return (
    <div className="absolute right-4 top-4 z-10 flex flex-col items-end gap-2.5">
      <div className="flex flex-col divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
        <Popover open={nearbyOpen} onOpenChange={setNearbyOpen}>
          <PopoverTrigger
            aria-label={t.mapControls.nearby}
            className="flex size-10 items-center justify-center rounded-t-2xl text-foreground transition-colors hover:bg-accent/60"
          >
            <Radar className="size-4.5" />
          </PopoverTrigger>
          <PopoverContent side="left" align="start" className="w-64 p-2">
            <p className="px-2 py-1 text-xs font-medium text-muted-foreground">
              {t.mapControls.nearbyTitle}
            </p>
            {!selectedBusNo ? (
              <p className="px-2 py-2 text-xs text-muted-foreground">
                {t.mapControls.nearbyNoRoute}
              </p>
            ) : !userLocation ? (
              <div className="flex flex-col gap-2 px-2 py-2">
                <p className="text-xs text-muted-foreground">{t.mapControls.nearbyNoLocation}</p>
                <button
                  type="button"
                  onClick={requestUserLocation}
                  className="self-start text-xs font-medium text-primary hover:underline"
                >
                  {t.mapControls.enableLocation}
                </button>
              </div>
            ) : (
              <div className="flex flex-col">
                {nearby.map(({ stop, distance }) => (
                  <button
                    key={stop.stopId}
                    type="button"
                    onClick={() => {
                      selectStop(stop);
                      map?.flyTo({ center: [stop.lng, stop.lat], zoom: STOP_FOCUS_ZOOM, duration: 700 });
                      setNearbyOpen(false);
                    }}
                    className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-accent/50"
                  >
                    <span className="truncate">{stop.name}</span>
                    <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                      {formatDistanceMeters(distance)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </PopoverContent>
        </Popover>

        <ControlButton label={t.mapControls.locateMe} onClick={requestUserLocation} disabled={locating}>
          <LocateFixed className={cn("size-4.5", locating && "animate-pulse")} />
        </ControlButton>

        <Popover>
          <PopoverTrigger
            aria-label={t.mapControls.layers}
            className="flex size-10 items-center justify-center rounded-b-2xl text-foreground transition-colors hover:bg-accent/60"
          >
            <Layers className="size-4.5" />
          </PopoverTrigger>
          <PopoverContent side="left" align="start" className="w-44 p-1.5">
            {(Object.keys(MAP_STYLES) as MapStyleKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setStyleKey(key);
                  map?.setStyle(MAP_STYLES[key]);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-sm hover:bg-accent/50",
                  styleKey === key && "bg-accent text-accent-foreground"
                )}
              >
                {styleLabels(t)[key]}
              </button>
            ))}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

export function MapControlsBottomRight() {
  const map = useMapInstance();
  const { userLocation } = useRouteMap();
  const t = useTranslation();
  const [bearing, setBearing] = useState(0);

  useEffect(() => {
    if (!map) return;
    const onRotate = () => setBearing(map.getBearing());
    map.on("rotate", onRotate);
    return () => {
      map.off("rotate", onRotate);
    };
  }, [map]);

  return (
    <div
      className="absolute bottom-(--controls-bottom-mobile) right-4 z-10 flex flex-col items-end gap-2.5 md:bottom-6"
      style={{ ["--controls-bottom-mobile" as string]: `${MAP_CONTROLS_MOBILE_BOTTOM_OFFSET_PX}px` }}
    >
      <div className="flex flex-col divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
        <ControlButton label={t.mapControls.zoomIn} onClick={() => map?.zoomIn({ duration: 250 })}>
          <Plus className="size-4.5" />
        </ControlButton>
        <ControlButton label={t.mapControls.zoomOut} onClick={() => map?.zoomOut({ duration: 250 })}>
          <Minus className="size-4.5" />
        </ControlButton>
      </div>

      <div className="flex flex-col divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
        <ControlButton
          label={t.mapControls.resetCompass}
          onClick={() => map?.easeTo({ bearing: 0, pitch: 0, duration: 350 })}
        >
          <Compass className="size-4.5" style={{ transform: `rotate(${-bearing}deg)` }} />
        </ControlButton>
        <ControlButton
          label={t.mapControls.currentLocation}
          disabled={!userLocation}
          onClick={() =>
            userLocation &&
            map?.flyTo({ center: [userLocation.lng, userLocation.lat], zoom: STOP_FOCUS_ZOOM, duration: 700 })
          }
        >
          <Crosshair className="size-4.5" />
        </ControlButton>
      </div>
    </div>
  );
}
