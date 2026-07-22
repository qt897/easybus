import { NextResponse } from "next/server";
import { DATA_BASE_URL, DATA_CACHE_SECONDS } from "@/lib/env";
import { adaptRouteInfo } from "@/features/routes/adapters";
import type {
  ExternalRouteDetail,
  ExternalRouteListResponse,
  ExternalRouteSummary,
} from "@/features/routes/external-types";
import type { RouteSummary } from "@/features/routes/types";

async function fetchSummaryExtras(busNo: string) {
  try {
    const res = await fetch(`${DATA_BASE_URL}/${encodeURIComponent(busNo)}.json`, {
      next: { revalidate: DATA_CACHE_SECONDS },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: ExternalRouteDetail };
    if (!json.data?.route) return null;
    const info = adaptRouteInfo(json.data.route);
    return {
      fare: info.tickets[0]?.price,
      operationTime: info.operationTime,
    };
  } catch {
    return null;
  }
}

export async function GET() {
  const res = await fetch(`${DATA_BASE_URL}/all_routes.json`, {
    next: { revalidate: DATA_CACHE_SECONDS },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "ROUTES_FETCH_FAILED" }, { status: 502 });
  }

  const json = (await res.json()) as ExternalRouteListResponse;
  const summaries: ExternalRouteSummary[] = json.data ?? [];

  const data: RouteSummary[] = await Promise.all(
    summaries.map(async (item) => {
      const extra = await fetchSummaryExtras(item.bus_no);
      return {
        id: item.id,
        busNo: item.bus_no,
        name: item.name,
        fare: extra?.fare,
        operationTime: extra?.operationTime,
      };
    })
  );

  return NextResponse.json({ data });
}
