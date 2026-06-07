import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { TodayPick } from "@/components/today-pick";

export default async function HomePage() {
  const supabase = await createClient();

  const [{ count }, { data: recent }, { data: priceData }] = await Promise.all([
    supabase.from("tshirts").select("*", { count: "exact", head: true }),
    supabase
      .from("tshirts")
      .select("id,title,series,thumb_url")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("tshirts").select("purchase_price"),
  ]);

  const totalPrice =
    priceData?.reduce((sum, t) => sum + (t.purchase_price ?? 0), 0) ?? 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900 rounded-xl p-6">
          <p className="text-zinc-400 text-sm">コレクション総数</p>
          <p className="text-4xl font-bold text-white mt-1">
            {count ?? 0}
            <span className="text-lg text-zinc-400 ml-1">枚</span>
          </p>
        </div>
        <div className="bg-zinc-900 rounded-xl p-6">
          <p className="text-zinc-400 text-sm">総購入金額</p>
          <p className="text-4xl font-bold text-white mt-1">
            ¥{totalPrice.toLocaleString()}
          </p>
        </div>
      </div>

      {/* today's pick */}
      <TodayPick />

      {/* recent */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">最近追加したアイテム</h2>
          <Link
            href="/collection"
            className="text-zinc-400 text-sm hover:text-white transition-colors"
          >
            すべて見る →
          </Link>
        </div>
        {recent && recent.length > 0 ? (
          <div className="grid grid-cols-5 gap-3">
            {recent.map((t) => (
              <Link key={t.id} href={`/collection/${t.id}`} className="group">
                <div className="aspect-square bg-zinc-900 rounded-lg overflow-hidden">
                  {t.thumb_url ? (
                    <Image
                      src={t.thumb_url}
                      alt={t.title}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xs">
                      No Image
                    </div>
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
