"use client";

import { ArrowLeft, Clock, MapPin, RefreshCw, Ruler, Timer, Users, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useRouteMap } from "@/features/routes/route-context";
import type { RouteStop } from "@/features/routes/api-types";

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2 rounded-lg bg-muted p-2.5">
      <Icon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="size-11 shrink-0 rounded-md" />
        <Skeleton className="h-5 w-2/3" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-14 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-24 rounded-lg" />
      <Skeleton className="h-40 rounded-lg" />
    </div>
  );
}

export function RouteDetail() {
  const {
    detail,
    detailLoading,
    detailError,
    retryDetail,
    selectRoute,
    direction,
    setDirection,
    directionStops,
    selectedStop,
    selectStop,
  } = useRouteMap();

  if (detailLoading) return <DetailSkeleton />;

  if (detailError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
        <div className="flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <WifiOff className="size-5" />
        </div>
        <p className="text-sm font-medium text-foreground">Không thể tải chi tiết tuyến</p>
        <Button variant="outline" size="sm" onClick={retryDetail} className="gap-1.5">
          <RefreshCw className="size-3.5" />
          Thử lại
        </Button>
      </div>
    );
  }

  if (!detail) return null;

  const { route } = detail;

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="flex items-start gap-3 p-4 pb-3">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => selectRoute(null)}
          aria-label="Quay lại danh sách tuyến"
          className="mt-0.5 shrink-0"
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-md font-display text-base font-bold text-white"
          style={{ background: route.color }}
        >
          {route.bus_no}
        </div>
        <div className="min-w-0 pt-0.5">
          <p className="text-sm font-semibold leading-snug text-foreground">{route.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{route.type}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 px-4">
        <Stat
          icon={Clock}
          label="Giờ hoạt động"
          value={`${route.operation_time.start} - ${route.operation_time.end}`}
        />
        <Stat
          icon={Timer}
          label="Giãn cách"
          value={`${route.headway_minutes.min}-${route.headway_minutes.max} phút`}
        />
        <Stat
          icon={Ruler}
          label="Chiều dài"
          value={`${(route.distance_m / 1000).toFixed(1)} km`}
        />
        <Stat
          icon={Users}
          label="Sức chứa"
          value={`${route.num_of_seats} chỗ`}
        />
      </div>

      <div className="px-4 pt-3">
        <p className="text-xs font-medium text-muted-foreground">Giá vé</p>
        {route.tickets.length === 0 ? (
          <p className="mt-1.5 text-sm text-foreground">Liên hệ nhà xe để biết giá vé.</p>
        ) : (
          <div className="mt-1.5 flex flex-col divide-y divide-border rounded-lg border border-border">
            {route.tickets.map((ticket) => (
              <div key={ticket.name} className="flex items-center justify-between px-3 py-2 text-sm">
                <span className="text-foreground">{ticket.name}</span>
                <span className="font-mono font-medium text-foreground">
                  {ticket.price.toLocaleString("vi-VN")} {ticket.currency}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {route.operators.length > 0 && (
        <div className="px-4 pt-3">
          <p className="text-xs font-medium text-muted-foreground">Đơn vị vận hành</p>
          <p className="mt-1.5 text-sm text-foreground">{route.operators.join(", ")}</p>
        </div>
      )}

      <Separator className="my-4" />

      <div className="px-4">
        <div className="inline-flex rounded-lg bg-muted p-1">
          <button
            type="button"
            onClick={() => setDirection("outbound")}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              direction === "outbound"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Lượt đi · {route.outbound_name}
          </button>
          <button
            type="button"
            onClick={() => setDirection("inbound")}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              direction === "inbound"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Lượt về · {route.inbound_name}
          </button>
        </div>
      </div>

      <div className="flex-1 px-4 py-3">
        <p className="mb-1.5 text-xs font-medium text-muted-foreground">
          {directionStops.length} trạm dừng
        </p>
        <ol className="flex flex-col">
          {directionStops.map((stop: RouteStop, index: number) => (
            <li key={stop.stop_id}>
              <button
                type="button"
                onClick={() => selectStop(stop)}
                className={cn(
                  "flex w-full items-start gap-2.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-accent/40",
                  selectedStop?.stop_id === stop.stop_id && "bg-accent/60"
                )}
              >
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-[10px] text-muted-foreground">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-foreground">{stop.name}</span>
                  <span className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                    <MapPin className="size-3 shrink-0" />
                    {stop.address || stop.street}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
