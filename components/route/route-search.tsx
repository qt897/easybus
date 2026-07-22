"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouteMap } from "@/features/routes/route-context";

export function RouteSearch() {
  const { query, setQuery } = useRouteMap();

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search routes..."
        aria-label="Search routes"
        className="h-10 rounded-xl bg-muted pl-9 pr-9 shadow-none focus-visible:bg-card"
      />
      {query && (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => setQuery("")}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          aria-label="Clear search"
        >
          <X className="size-3.5" />
        </Button>
      )}
    </div>
  );
}
