"use client";

import { useCallback, useEffect, useState } from "react";
import type { RouteDetail } from "./api-types";

const cache = new Map<string, RouteDetail>();

export function useRouteDetail(busNo: string | null) {
  const [prevBusNo, setPrevBusNo] = useState(busNo);
  const [detail, setDetail] = useState<RouteDetail | null>(() =>
    busNo ? cache.get(busNo) ?? null : null
  );
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  if (busNo !== prevBusNo) {
    setPrevBusNo(busNo);
    setDetail(busNo ? cache.get(busNo) ?? null : null);
    setError(false);
  }

  const retry = useCallback(() => {
    setError(false);
    setAttempt((n) => n + 1);
  }, []);

  useEffect(() => {
    if (!busNo || cache.has(busNo)) return;

    let cancelled = false;

    fetch(`/api/routes/${encodeURIComponent(busNo)}`)
      .then((res) => {
        if (!res.ok) throw new Error("failed");
        return res.json() as Promise<RouteDetail>;
      })
      .then((json) => {
        if (cancelled) return;
        cache.set(busNo, json);
        setDetail(json);
      })
      .catch(() => {
        if (cancelled) return;
        setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [busNo, attempt]);

  const loading = !!busNo && !error && !detail;

  return { detail, loading, error, retry };
}
