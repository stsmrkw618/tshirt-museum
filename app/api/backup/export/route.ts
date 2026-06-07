import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  const [{ data: tshirts }, { data: wearLogs }] = await Promise.all([
    supabase.from("tshirts").select("*").order("created_at"),
    supabase.from("wear_logs").select("*").order("worn_at"),
  ]);

  const payload = JSON.stringify(
    { tshirts, wear_logs: wearLogs, exported_at: new Date().toISOString() },
    null,
    2
  );

  const filename = `tshirt-museum-${new Date().toISOString().slice(0, 10)}.json`;

  return new NextResponse(payload, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
