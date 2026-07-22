"use client";

import { useCallback, useEffect, useState } from "react";
import type { ApiErrorCode } from "@/lib/i18n/types";
import type { RouteSummary } from "./types";

interface RouteListApiResponse {
  data?: RouteSummary[];
  error?: ApiErrorCode;
}

export function useRouteList() {
  const [routes, setRoutes] = useState<RouteSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorCode, setErrorCode] = useState<ApiErrorCode | null>(null);
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => {
    setLoading(true);
    setErrorCode(null);
    setAttempt((n) => n + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/routes")
      .then(async (res) => {
        const json = (await res.json()) as RouteListApiResponse;
        if (!res.ok || !json.data) throw new Error(json.error ?? "UNKNOWN");
        return json.data;
      })
      .then((data) => {
        if (cancelled) return;
        setRoutes(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setErrorCode((err.message as ApiErrorCode) || "UNKNOWN");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  return { routes, loading, error: errorCode, retry };
}
