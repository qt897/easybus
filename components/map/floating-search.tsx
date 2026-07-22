"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useRouteMap } from "@/features/routes/route-context";
import { colorForBusNo } from "@/features/routes/colors";
import { useRouteSuggestions } from "@/features/search/use-route-suggestions";
import { SEARCH_SUGGESTIONS_LIMIT } from "@/lib/constants";
import { useTranslation } from "@/lib/i18n/context";

export function FloatingSearch() {
  const { routes, selectRoute } = useRouteMap();
  const t = useTranslation();
  const { query, setQuery, suggestions } = useRouteSuggestions(routes, SEARCH_SUGGESTIONS_LIMIT);
  const [focused, setFocused] = useState(false);

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
          placeholder={t.floatingSearch.placeholder}
          aria-label={t.floatingSearch.placeholder}
          className={`h-11 w-full rounded-lg border border-border bg-card pl-11 pr-4 text-sm text-foreground shadow-lg outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/50 ${
            showPanel ? "rounded-b-none border-b-transparent" : ""
          }`}
        />
      </div>

      {showPanel && (
        <div className="overflow-hidden rounded-b-lg border border-t-0 border-border bg-card shadow-lg">
          {suggestions.map((route) => (
            <button
              key={route.busNo}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                selectRoute(route.busNo);
                setQuery("");
                setFocused(false);
              }}
              className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm hover:bg-accent/50"
            >
              <span
                className="flex size-7 shrink-0 items-center justify-center rounded-md font-display text-[11px] font-bold text-white"
                style={{ background: colorForBusNo(route.busNo) }}
              >
                {route.busNo}
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
