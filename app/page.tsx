import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { TodayPick } from "@/components/today-pick";
import type { Tshirt } from "@/lib/types";

function getDayPick(items: Tshirt[]): Tshirt | null {
  if (items.length === 0) return null;
  const dateStr = new Date().toISOString().slice(0, 10);
  const seed = dateStr.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return items[seed % items.length];
}

export default async function HomePage() {
  const supabase = await createClient();

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [{ count }, { data: recent }, { data: priceData }, { data: allItems }, { count: monthCount }] =
    await Promise.all([
      supabase.from("tshirts").select("*", { count: "exact", head: true }),
      supabase.from("tshirts").select("id,title,series,thumb_url").order("created_at", { ascending: false }).limit(5),
      supabase.from("tshirts").select("purchase_price"),
      supabase.from("tshirts").select("*"),
      supabase.from("tshirts").select("*", { count: "exact", head: true }).gte("created_at", monthStart),
    ]);

  const totalPrice = priceData?.reduce((sum, t) => sum + (t.purchase_price ?? 0), 0) ?? 0;
  const todayItem = getDayPick(allItems ?? []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* 今日の1枚：ヒーローとして最上部に */}
      {todayItem && <TodayPick item={todayItem} />}

      {/* 統計カード */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-zinc-900 rounded-xl p-5">
          <p className="text-zinc-500 text-xs uppercase tracking-wider">コレクション</p>
          <p className="text-6xl font-black text-white mt-1 tracking-tighter tabular-nums leading-none">
            {count ?? 0}
          </p>
          <p className="text-zinc-500 text-xs mt-1.5">枚</p>
        </div>
        <div className="bg-zinc-900 rounded-xl p-5">
          <p className="text-zinc-500 text-xs uppercase tracking-wider">今月追加</p>
          <p className="text-6xl font-black text-white mt-1 tracking-tighter tabular-nums leading-none">
            {monthCount ?? 0}
          </p>
          <p className="text-zinc-500 text-xs mt-1.5">枚</p>
        </div>
        <div className="col-span-2 bg-zinc-900 rounded-xl p-5">
          <p className="text-zinc-500 text-xs uppercase tracking-wider">総購入金額</p>
          <p className="text-4xl font-black text-white mt-1 tracking-tighter tabular-nums">
            ¥{totalPrice.toLocaleString()}
          </p>
        </div>
      </div>

      {/* 最近追加 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-widest">最近追加</h2>
          <Link href="/collection" className="text-zinc-500 text-sm hover:text-white transition-colors">
            すべて見る →
          </Link>
        </div>
        {recent && recent.length > 0 ? (
          <div className="grid grid-cols-5 gap-3">
            {recent.map((t) => (
              <Link key={t.id} href={`/collection/${t.id}`} className="group">
                <div className={`aspect-[3/4] rounded-lg overflow-hidden ${t.thumb_url ? "bg-zinc-800 animate-pulse" : "bg-zinc-900"}`}>
                  {t.thumb_url && (
                    <Image
                      src={t.thumb_url}
                      alt={t.title}
                      width={200}
                      height={267}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                </div>
                <p className="text-white text-xs mt-1.5 truncate">{t.title}</p>
                <p className="text-zinc-500 text-xs truncate">{t.series}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-zinc-900 rounded-xl p-8 text-center">
            <p className="text-zinc-500 text-sm">まだアイテムがありません</p>
            <Link
              href="/collection/new"
              className="mt-3 inline-block bg-white text-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors"
            >
              最初の1枚を登録する
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
