import { createClient } from "@/lib/supabase/server";

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: tshirts } = await supabase.from("tshirts").select("series,purchase_date,purchase_place,purchase_price");

  if (!tshirts || tshirts.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 text-center">
        <p className="text-zinc-500">まだデータがありません</p>
      </div>
    );
  }

  // 作品ランキング
  const seriesCount = tshirts.reduce<Record<string, number>>((acc, t) => {
    acc[t.series] = (acc[t.series] ?? 0) + 1;
    return acc;
  }, {});
  const seriesRanking = Object.entries(seriesCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // 年別購入数
  const yearCount = tshirts.reduce<Record<string, number>>((acc, t) => {
    if (!t.purchase_date) return acc;
    const year = t.purchase_date.slice(0, 4);
    acc[year] = (acc[year] ?? 0) + 1;
    return acc;
  }, {});
  const yearData = Object.entries(yearCount).sort((a, b) => a[0].localeCompare(b[0]));

  // 購入場所ランキング
  const placeCount = tshirts.reduce<Record<string, number>>((acc, t) => {
    if (!t.purchase_place) return acc;
    acc[t.purchase_place] = (acc[t.purchase_place] ?? 0) + 1;
    return acc;
  }, {});
  const placeRanking = Object.entries(placeCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const maxSeriesCount = seriesRanking[0]?.[1] ?? 1;
  const maxYearCount = Math.max(...yearData.map((d) => d[1]));
  const maxPlaceCount = placeRanking[0]?.[1] ?? 1;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-10">
      <h1 className="text-xl font-bold text-white">コレクション分析</h1>

      {/* 作品ランキング */}
      <section>
        <h2 className="text-white font-semibold mb-4">作品ランキング</h2>
        <div className="space-y-2">
          {seriesRanking.map(([series, count], i) => (
            <div key={series} className="flex items-center gap-3">
              <span className="text-zinc-500 text-sm w-5 text-right">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-white text-sm truncate">{series}</span>
                  <span className="text-zinc-400 text-sm ml-2">{count}枚</span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-zinc-400 rounded-full"
                    style={{ width: `${(count / maxSeriesCount) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 年別購入数 */}
      {yearData.length > 0 && (
        <section>
          <h2 className="text-white font-semibold mb-4">年別購入数</h2>
          <div className="space-y-2">
            {yearData.map(([year, count]) => (
              <div key={year} className="flex items-center gap-3">
                <span className="text-zinc-400 text-sm w-12">{year}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden flex-1 mr-3">
                      <div
                        className="h-full bg-zinc-400 rounded-full"
                        style={{ width: `${(count / maxYearCount) * 100}%` }}
                      />
                    </div>
                    <span className="text-zinc-400 text-sm w-8 text-right">{count}枚</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 購入場所ランキング */}
      {placeRanking.length > 0 && (
        <section>
          <h2 className="text-white font-semibold mb-4">購入場所ランキング</h2>
          <div className="space-y-2">
            {placeRanking.map(([place, count], i) => (
              <div key={place} className="flex items-center gap-3">
                <span className="text-zinc-500 text-sm w-5 text-right">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-white text-sm truncate">{place}</span>
                    <span className="text-zinc-400 text-sm ml-2">{count}枚</span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-zinc-400 rounded-full"
                      style={{ width: `${(count / maxPlaceCount) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
