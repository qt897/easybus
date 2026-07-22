"use client";

import { useCallback, useEffect, useState } from "react";
import type { ApiErrorCode } from "@/lib/i18n/types";
import type { RouteDetail } from "./types";

const cache = new Map<string, RouteDetail>();

interface RouteDetailApiError {
  error?: ApiErrorCode;
}

export function useRouteDetail(busNo: string | null) {
  const [prevBusNo, setPrevBusNo] = useState(busNo);
  const [detail, setDetail] = useState<RouteDetail | null>(() =>
    busNo ? cache.get(busNo) ?? null : null
  );
  const [errorCode, setErrorCode] = useState<ApiErrorCode | null>(null);
  const [attempt, setAttempt] = useState(0);

  if (busNo !== prevBusNo) {
    setPrevBusNo(busNo);
    setDetail(busNo ? cache.get(busNo) ?? null : null);
    setErrorCode(null);
  }

  const retry = useCallback(() => {
    setErrorCode(null);
    setAttempt((n) => n + 1);
  }, []);

  useEffect(() => {
    if (!busNo || cache.has(busNo)) return;

    let cancelled = false;

    fetch(`/api/routes/${encodeURIComponent(busNo)}`)
      .then(async (res) => {
        const json = (await res.json()) as RouteDetail & RouteDetailApiError;
        if (!res.ok) throw new Error(json.error ?? "UNKNOWN");
        return json;
      })
      .then((json) => {
        if (cancelled) return;
        cache.set(busNo, json);
        setDetail(json);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setErrorCode((err.message as ApiErrorCode) || "UNKNOWN");
      });

    return () => {
      cancelled = true;
    };
  }, [busNo, attempt]);

  const loading = !!busNo && !errorCode && !detail;

  return { detail, loading, error: errorCode, retry };
}
