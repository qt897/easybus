import { NextResponse } from "next/server";

const BASE_URL =
  "https://raw.githubusercontent.com/qt897/easybus/refs/heads/main/data";

interface RawSummary {
  id: number;
  bus_no: string;
  name: string;
}

async function fetchFare(busNo: string) {
  try {
    const res = await fetch(`${BASE_URL}/${encodeURIComponent(busNo)}.json`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const route = json.data?.route;
    if (!route) return null;
    return {
      color: route.color as string | undefined,
      fare: route.tickets?.[0]?.price as number | undefined,
      operation_time: route.operation_time as
        | { start: string; end: string }
        | undefined,
    };
  } catch {
    return null;
  }
}

export async function GET() {
  const res = await fetch(`${BASE_URL}/all_routes.json`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Không thể tải danh sách tuyến" },
      { status: 502 }
    );
  }

  const json = await res.json();
  const summaries: RawSummary[] = json.data ?? [];

  const enriched = await Promise.all(
    summaries.map(async (item) => {
      const extra = await fetchFare(item.bus_no);
      return {
        id: item.id,
        bus_no: item.bus_no,
        name: item.name,
        color: extra?.color,
        fare: extra?.fare,
        operation_time: extra?.operation_time,
      };
    })
  );

  return NextResponse.json({ data: enriched });
}
