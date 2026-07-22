"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouteMap } from "@/features/routes/route-context";
import { useTranslation } from "@/lib/i18n/context";

export function RouteSearch() {
  const { query, setQuery } = useRouteMap();
  const t = useTranslation();

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t.routeSearch.placeholder}
        aria-label={t.routeSearch.placeholder}
        className="h-10 rounded-xl bg-muted pl-9 pr-9 shadow-none focus-visible:bg-card"
      />
      {query && (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => setQuery("")}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          aria-label={t.routeSearch.clearAriaLabel}
        >
          <X className="size-3.5" />
        </Button>
      )}
    </div>
  );
}
