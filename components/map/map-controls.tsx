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
import { formatDistanceMeters, distanceMeters } from "@/lib/format";
import { MAP_STYLES, type MapStyleKey } from "@/lib/map-styles";
import { useMapInstance } from "./map-instance-context";
import { useRouteMap } from "@/features/routes/route-context";

const STYLE_LABELS: Record<MapStyleKey, string> = {
  simple: "Đơn giản",
  detailed: "Chi tiết",
};

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
  const [styleKey, setStyleKey] = useState<MapStyleKey>("simple");
  const [nearbyOpen, setNearbyOpen] = useState(false);

  const nearby = userLocation
    ? [...directionStops]
        .map((s) => ({ stop: s, dist: distanceMeters(userLocation, s) }))
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 5)
    : [];

  return (
    <div className="absolute right-4 top-4 z-10 flex flex-col items-end gap-2.5">
      <div className="flex flex-col divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
        <Popover open={nearbyOpen} onOpenChange={setNearbyOpen}>
          <PopoverTrigger
            aria-label="Nearby"
            className="flex size-10 items-center justify-center rounded-t-2xl text-foreground transition-colors hover:bg-accent/60"
          >
            <Radar className="size-4.5" />
          </PopoverTrigger>
          <PopoverContent side="left" align="start" className="w-64 p-2">
            <p className="px-2 py-1 text-xs font-medium text-muted-foreground">
              Trạm gần bạn
            </p>
            {!selectedBusNo ? (
              <p className="px-2 py-2 text-xs text-muted-foreground">
                Chọn một tuyến để xem trạm gần bạn.
              </p>
            ) : !userLocation ? (
              <div className="flex flex-col gap-2 px-2 py-2">
                <p className="text-xs text-muted-foreground">
                  Bật vị trí để xem các trạm gần bạn.
                </p>
                <button
                  type="button"
                  onClick={requestUserLocation}
                  className="self-start text-xs font-medium text-primary hover:underline"
                >
                  Bật vị trí
                </button>
              </div>
            ) : (
              <div className="flex flex-col">
                {nearby.map(({ stop, dist }) => (
                  <button
                    key={stop.stop_id}
                    type="button"
                    onClick={() => {
                      selectStop(stop);
                      map?.flyTo({ center: [stop.lng, stop.lat], zoom: 15, duration: 700 });
                      setNearbyOpen(false);
                    }}
                    className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-accent/50"
                  >
                    <span className="truncate">{stop.name}</span>
                    <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                      {formatDistanceMeters(dist)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </PopoverContent>
        </Popover>

        <ControlButton label="Locate me" onClick={requestUserLocation} disabled={locating}>
          <LocateFixed className={cn("size-4.5", locating && "animate-pulse")} />
        </ControlButton>

        <Popover>
          <PopoverTrigger
            aria-label="Layers"
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
                {STYLE_LABELS[key]}
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
    <div className="absolute bottom-[172px] right-4 z-10 flex flex-col items-end gap-2.5 md:bottom-6">
      <div className="flex flex-col divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
        <ControlButton label="Zoom in" onClick={() => map?.zoomIn({ duration: 250 })}>
          <Plus className="size-4.5" />
        </ControlButton>
        <ControlButton label="Zoom out" onClick={() => map?.zoomOut({ duration: 250 })}>
          <Minus className="size-4.5" />
        </ControlButton>
      </div>

      <div className="flex flex-col divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
        <ControlButton label="Reset compass" onClick={() => map?.easeTo({ bearing: 0, pitch: 0, duration: 350 })}>
          <Compass className="size-4.5" style={{ transform: `rotate(${-bearing}deg)` }} />
        </ControlButton>
        <ControlButton
          label="Current location"
          disabled={!userLocation}
          onClick={() =>
            userLocation &&
            map?.flyTo({ center: [userLocation.lng, userLocation.lat], zoom: 15, duration: 700 })
          }
        >
          <Crosshair className="size-4.5" />
        </ControlButton>
      </div>
    </div>
  );
}
