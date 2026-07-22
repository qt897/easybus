"use client";

import { useMemo, useState } from "react";
import { filterRoutes, type SearchableRoute } from "./search-routes";

/** Sidebar route list search: a single persistent query + derived filtered list. */
export function useRouteSearch<T extends SearchableRoute>(routes: T[]) {
  const [query, setQuery] = useState("");

  const filteredRoutes = useMemo(() => filterRoutes(routes, query), [routes, query]);

  return { query, setQuery, filteredRoutes };
}
