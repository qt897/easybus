"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useRouteMap } from "@/features/routes/route-context";
import { colorForBusNo } from "@/features/routes/colors";

export function FloatingSearch() {
  const { routes, selectRoute } = useRouteMap();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return routes
      .filter((r) => r.bus_no.toLowerCase().includes(q) || r.name.toLowerCase().includes(q))
      .slice(0, 6);
  }, [query, routes]);

  const showPanel = focused && suggestions.length > 0;

  return (
    <div className="absolute left-1/2 top-4 z-10 w-[420px] max-w-[calc(100%-2rem)] -translate-x-1/2">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 120)}
          placeholder="Search places..."
          aria-label="Search places"
          className={`h-11 w-full rounded-lg border border-border bg-card pl-11 pr-4 text-sm text-foreground shadow-lg outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/50 ${
            showPanel ? "rounded-b-none border-b-transparent" : ""
          }`}
        />
      </div>

      {showPanel && (
        <div className="overflow-hidden rounded-b-lg border border-t-0 border-border bg-card shadow-lg">
          {suggestions.map((route) => (
            <button
              key={route.bus_no}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                selectRoute(route.bus_no);
                setQuery("");
                setFocused(false);
              }}
              className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm hover:bg-accent/50"
            >
              <span
                className="flex size-7 shrink-0 items-center justify-center rounded-md font-display text-[11px] font-bold text-white"
                style={{ background: colorForBusNo(route.bus_no) }}
              >
                {route.bus_no}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-foreground">{route.name}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {route.origin} → {route.destination}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
