import { NextResponse } from "next/server";

const BASE_URL =
  "https://raw.githubusercontent.com/qt897/easybus/refs/heads/main/data";

const VALID_BUS_NO = /^[A-Za-z0-9-]+$/;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ busNo: string }> }
) {
  const { busNo } = await params;

  if (!VALID_BUS_NO.test(busNo)) {
    return NextResponse.json({ error: "Mã tuyến không hợp lệ" }, { status: 400 });
  }

  const res = await fetch(`${BASE_URL}/${encodeURIComponent(busNo)}.json`, {
    next: { revalidate: 3600 },
  });

  if (res.status === 404) {
    return NextResponse.json({ error: "Không tìm thấy tuyến" }, { status: 404 });
  }

  if (!res.ok) {
    return NextResponse.json(
      { error: "Không thể tải chi tiết tuyến" },
      { status: 502 }
    );
  }

  const json = await res.json();
  return NextResponse.json(json.data ?? json);
}
