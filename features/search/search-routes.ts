export interface SearchableRoute {
  busNo: string;
  name: string;
  origin?: string;
  destination?: string;
}

export function matchesQuery(route: SearchableRoute, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    route.busNo.toLowerCase().includes(q) ||
    route.name.toLowerCase().includes(q) ||
    (route.origin?.toLowerCase().includes(q) ?? false) ||
    (route.destination?.toLowerCase().includes(q) ?? false)
  );
}

export function filterRoutes<T extends SearchableRoute>(routes: T[], query: string): T[] {
  if (!query.trim()) return routes;
  return routes.filter((route) => matchesQuery(route, query));
}
