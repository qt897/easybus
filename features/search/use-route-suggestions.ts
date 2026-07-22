"use client";

import { useMemo, useState } from "react";
import { filterRoutes, type SearchableRoute } from "./search-routes";

/** Floating map search: its own query, capped suggestion list. */
export function useRouteSuggestions<T extends SearchableRoute>(routes: T[], limit: number) {
  const [query, setQuery] = useState("");

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    return filterRoutes(routes, query).slice(0, limit);
  }, [routes, query, limit]);

  return { query, setQuery, suggestions };
}
