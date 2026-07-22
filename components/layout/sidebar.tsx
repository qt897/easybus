"use client";

import { useState } from "react";
import { Heart, Milestone, Route as RouteIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RouteSearch } from "@/components/route/route-search";
import { RouteList } from "@/components/route/route-list";
import { RouteDetail } from "@/components/route/route-detail";
import { ComingSoon } from "@/components/ui/coming-soon";
import { cn } from "@/lib/utils";
import {
  SIDEBAR_EXPANDED_HEIGHT_VH,
  SIDEBAR_PEEK_HEIGHT_PX,
  SIDEBAR_WIDTH_PX,
} from "@/lib/constants";
import { useRouteMap, type SidebarTab } from "@/features/routes/route-context";
import { useTranslation } from "@/lib/i18n/context";

export function Sidebar() {
  const { tab, setTab, selectedBusNo } = useRouteMap();
  const t = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const isOpen = expanded || !!selectedBusNo;

  return (
    <aside
      className={cn(
        "fixed inset-x-0 bottom-0 z-20 flex h-(--sidebar-height) flex-col rounded-t-2xl border-t border-border bg-background shadow-2xl transition-[height] duration-300 ease-out",
        "md:static md:z-auto md:h-auto md:w-(--sidebar-width) md:shrink-0 md:rounded-none md:border-t-0 md:border-r md:shadow-none"
      )}
      style={{
        ["--sidebar-height" as string]: isOpen
          ? `${SIDEBAR_EXPANDED_HEIGHT_VH}vh`
          : `${SIDEBAR_PEEK_HEIGHT_PX}px`,
        ["--sidebar-width" as string]: `${SIDEBAR_WIDTH_PX}px`,
      }}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex shrink-0 items-center justify-center py-2 md:hidden"
        aria-label={isOpen ? t.sidebar.collapse : t.sidebar.expand}
      >
        <span className="h-1 w-9 rounded-full bg-border" />
      </button>

      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as SidebarTab)}
        className="flex min-h-0 flex-1 flex-col gap-0"
      >
        <div className="shrink-0 border-b border-border p-3">
          <TabsList className="w-full">
            <TabsTrigger value="routes" className="gap-1.5">
              <RouteIcon className="size-3.5" />
              {t.sidebar.tabRoutes}
            </TabsTrigger>
            <TabsTrigger value="directions" className="gap-1.5">
              <Milestone className="size-3.5" />
              {t.sidebar.tabDirections}
            </TabsTrigger>
            <TabsTrigger value="favorites" className="gap-1.5">
              <Heart className="size-3.5" />
              {t.sidebar.tabFavorites}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="routes" className="flex min-h-0 flex-1 flex-col">
          {selectedBusNo ? (
            <RouteDetail />
          ) : (
            <>
              {/* <div className="shrink-0 border-b border-border p-3">
                <RouteSearch />
              </div> */}
              <div className="min-h-0 flex-1">
                <RouteList />
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="directions" className="min-h-0 flex-1">
          <ComingSoon label={t.sidebar.directionsLabel} />
        </TabsContent>

        <TabsContent value="favorites" className="min-h-0 flex-1">
          <ComingSoon label={t.sidebar.favoritesLabel} />
        </TabsContent>
      </Tabs>
    </aside>
  );
}
