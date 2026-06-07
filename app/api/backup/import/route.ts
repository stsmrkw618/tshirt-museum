import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  let body: { tshirts?: unknown[]; wear_logs?: unknown[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "無効なJSONです" }, { status: 400 });
  }

  const { tshirts, wear_logs } = body;

  if (!Array.isArray(tshirts)) {
    return NextResponse.json({ error: "tshirtsが見つかりません" }, { status: 400 });
  }

  // tshirtsをupsert（id一致で上書き、なければ追加、削除はしない）
  const { error: tshirtError } = await supabase
    .from("tshirts")
    .upsert(tshirts, { onConflict: "id" });

  if (tshirtError) {
    return NextResponse.json({ error: tshirtError.message }, { status: 500 });
  }

  // wear_logsも同様にupsert
  let wearLogCount = 0;
  if (Array.isArray(wear_logs) && wear_logs.length > 0) {
    const { error: wearError } = await supabase
      .from("wear_logs")
      .upsert(wear_logs, { onConflict: "id" });
    if (!wearError) wearLogCount = wear_logs.length;
  }

  return NextResponse.json({
    success: true,
    tshirt_count: tshirts.length,
    wear_log_count: wearLogCount,
  });
}
