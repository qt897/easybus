"use client";

import { useCallback, useEffect, useState } from "react";
import type { RouteListResponse, RouteSummary } from "./api-types";

export function useRouteList() {
  const [routes, setRoutes] = useState<RouteSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => {
    setLoading(true);
    setError(false);
    setAttempt((n) => n + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/routes")
      .then((res) => {
        if (!res.ok) throw new Error("failed");
        return res.json() as Promise<RouteListResponse>;
      })
      .then((json) => {
        if (cancelled) return;
        setRoutes(json.data);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError(true);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  return { routes, loading, error, retry };
}
