"use client";

import { AnimatePresence, motion } from "motion/react";
import { RefreshCw, SearchX, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RouteCard } from "./route-card";
import { useRouteMap } from "@/features/routes/route-context";

function RouteCardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="flex items-start gap-3">
        <Skeleton className="size-10 shrink-0 rounded-md" />
        <div className="flex-1 space-y-2.5 pt-0.5">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
      <div className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <SearchX className="size-5" />
      </div>
      <p className="text-sm font-medium text-foreground">Không tìm thấy tuyến nào</p>
      <p className="text-xs text-muted-foreground">
        Thử tìm theo số tuyến, tên trạm hoặc điểm đến khác.
      </p>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
      <div className="flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <WifiOff className="size-5" />
      </div>
      <p className="text-sm font-medium text-foreground">Không thể tải danh sách tuyến</p>
      <p className="text-xs text-muted-foreground">Vui lòng kiểm tra kết nối và thử lại.</p>
      <Button variant="outline" size="sm" onClick={onRetry} className="mt-1 gap-1.5">
        <RefreshCw className="size-3.5" />
        Thử lại
      </Button>
    </div>
  );
}

export function RouteList() {
  const {
    filteredRoutes,
    loading,
    error,
    retry,
    selectedBusNo,
    selectRoute,
    setHoveredBusNo,
  } = useRouteMap();

  if (loading) {
    return (
      <div className="flex h-full flex-col gap-2.5 overflow-y-auto px-3 py-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <RouteCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full overflow-y-auto">
        <ErrorState onRetry={retry} />
      </div>
    );
  }

  if (filteredRoutes.length === 0) {
    return (
      <div className="h-full overflow-y-auto">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-2.5 overflow-y-auto px-3 py-3">
      <AnimatePresence initial={false}>
        {filteredRoutes.map((route, index) => (
          <motion.div
            key={route.id}
            layout
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, delay: Math.min(index, 6) * 0.02 }}
          >
            <RouteCard
              route={route}
              selected={selectedBusNo === route.bus_no}
              onSelect={() => selectRoute(route.bus_no)}
              onHoverChange={(hovered) => setHoveredBusNo(hovered ? route.bus_no : null)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
