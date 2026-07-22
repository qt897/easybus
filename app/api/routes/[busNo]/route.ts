import { NextResponse } from "next/server";
import { DATA_BASE_URL, DATA_CACHE_SECONDS } from "@/lib/env";
import { adaptRouteDetail } from "@/features/routes/adapters";
import type { ExternalRouteDetail } from "@/features/routes/external-types";

const VALID_BUS_NO = /^[A-Za-z0-9-]+$/;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ busNo: string }> }
) {
  const { busNo } = await params;

  if (!VALID_BUS_NO.test(busNo)) {
    return NextResponse.json({ error: "INVALID_BUS_NO" }, { status: 400 });
  }

  const res = await fetch(`${DATA_BASE_URL}/${encodeURIComponent(busNo)}.json`, {
    next: { revalidate: DATA_CACHE_SECONDS },
  });

  if (res.status === 404) {
    return NextResponse.json({ error: "ROUTE_NOT_FOUND" }, { status: 404 });
  }

  if (!res.ok) {
    return NextResponse.json(
      { error: "ROUTE_DETAIL_FETCH_FAILED" },
      { status: 502 }
    );
  }

  const json = (await res.json()) as { data?: ExternalRouteDetail };
  if (!json.data) {
    return NextResponse.json(
      { error: "ROUTE_DETAIL_FETCH_FAILED" },
      { status: 502 }
    );
  }

  return NextResponse.json(adaptRouteDetail(json.data));
}
