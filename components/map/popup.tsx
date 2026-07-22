"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useMapInstance } from "./map-instance-context";
import { useRouteMap } from "@/features/routes/route-context";
import { colorForBusNo } from "@/features/routes/colors";

export function StopPopup() {
  const map = useMapInstance();
  const { selectedStop, selectStop, selectedBusNo, detail, selectRoute } = useRouteMap();
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!map || !selectedStop) return;

    const update = () => {
      const p = map.project([selectedStop.lng, selectedStop.lat]);
      setPos({ x: p.x, y: p.y });
    };

    update();
    map.on("move", update);
    return () => {
      map.off("move", update);
    };
  }, [map, selectedStop]);

  return (
    <AnimatePresence>
      {selectedStop && pos && (
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 4 }}
          transition={{ duration: 0.14 }}
          className="pointer-events-auto absolute z-10 w-60 -translate-x-1/2 -translate-y-[calc(100%+16px)] rounded-lg border border-border bg-card p-3.5 shadow-lg"
          style={{ left: pos.x, top: pos.y }}
        >
          <span className="absolute -bottom-1.5 left-1/2 size-3 -translate-x-1/2 rotate-45 border-b border-r border-border bg-card" />

          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-foreground">{selectedStop.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {selectedStop.address || selectedStop.street}
              </p>
            </div>
            <button
              type="button"
              onClick={() => selectStop(null)}
              className="shrink-0 rounded-md p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Đóng"
            >
              <X className="size-4" />
            </button>
          </div>

          {selectedStop.routes.length > 0 && (
            <div className="mt-3">
              <p className="text-[11px] font-medium text-muted-foreground">Tuyến đi qua</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {selectedStop.routes.map((busNo) => {
                  const isCurrent = busNo === selectedBusNo;
                  const color = isCurrent && detail ? detail.route.color : colorForBusNo(busNo);
                  return (
                    <button
                      key={busNo}
                      type="button"
                      onClick={() => {
                        selectRoute(busNo);
                        selectStop(null);
                      }}
                      className="flex h-7 min-w-7 items-center justify-center rounded-md px-1.5 font-display text-xs font-bold text-white transition-transform hover:scale-105"
                      style={{ background: color }}
                    >
                      {busNo}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
