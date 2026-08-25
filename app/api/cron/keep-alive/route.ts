import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Vercel Cron から毎日呼び出され、Supabase に軽量クエリを投げて
// 無料プランの自動休止（7日間無アクセスで pause）を防止する。
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Vercel Cron の正当性チェック（CRON_SECRET を設定した場合のみ検証）
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 軽量クエリで DB に接続する。RLS で拒否されても DB へは到達するため
  // 休止防止の目的は達成される。
  const { error } = await supabase.from("tshirts").select("id").limit(1);

  return NextResponse.json({
    ok: true,
    pinged_at: new Date().toISOString(),
    ...(error ? { note: error.message } : {}),
  });
}
