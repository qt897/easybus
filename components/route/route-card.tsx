"use client";

import { Clock } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { colorForBusNo } from "@/features/routes/colors";
import type { RouteListItem } from "@/features/routes/route-context";

interface RouteCardProps {
  route: RouteListItem;
  selected: boolean;
  onSelect: () => void;
  onHoverChange: (hovered: boolean) => void;
}

export function RouteCard({ route, selected, onSelect, onHoverChange }: RouteCardProps) {
  const color = route.color || colorForBusNo(route.busNo);

  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      aria-pressed={selected}
      data-slot="route-card"
      className={cn(
        "group relative w-full rounded-lg border bg-card p-3 text-left shadow-sm transition-colors",
        "hover:border-primary/40 hover:bg-accent/40",
        "active:translate-y-px",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        selected ? "border-primary bg-accent/60" : "border-border"
      )}
    >
      {selected && (
        <motion.span
          layoutId="route-card-selected"
          className="absolute inset-y-3 left-0 w-[3px] rounded-full bg-primary"
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
        />
      )}

      <div className="flex items-start gap-3">
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-md font-display text-sm font-bold text-white"
          style={{ background: color }}
        >
          {route.busNo}
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <p className="truncate text-sm font-semibold text-foreground">
            {route.name}
          </p>

          <div className="mt-2.5 flex gap-2.5">
            <div className="flex flex-col items-center pt-0.5">
              <span className="size-2 shrink-0 rounded-full" style={{ background: color }} />
              <span
                className="my-0.5 w-px flex-1 opacity-35"
                style={{ background: color, minHeight: "16px" }}
              />
              <svg width="9" height="9" viewBox="0 0 10 10" className="shrink-0" style={{ color }}>
                <path d="M5 0 L9 8 H1 Z" fill="currentColor" />
              </svg>
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-2.5 text-xs">
              <span className="truncate text-muted-foreground">{route.origin}</span>
              <span className="truncate font-medium text-foreground">{route.destination}</span>
            </div>
          </div>

          {(route.operationTime || route.fare != null) && (
            <div className="mt-2.5 flex items-center justify-between border-t border-border pt-2 font-mono text-[11px] text-muted-foreground">
              {route.operationTime ? (
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {route.operationTime.start} - {route.operationTime.end}
                </span>
              ) : (
                <span />
              )}
              {route.fare != null && (
                <span className="font-medium text-foreground">
                  {route.fare.toLocaleString("vi-VN")} ₫
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
