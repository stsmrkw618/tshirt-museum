import Link from "next/link";
import Image from "next/image";
import { Grid3X3, Plus } from "lucide-react";

type Item = {
  id: string;
  title: string;
  series: string;
  thumb_url: string | null;
};

export function CollectionGrid({ tshirts }: { tshirts: Item[] }) {
  if (tshirts.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-900 flex items-center justify-center">
          <Grid3X3 size={24} className="text-zinc-600" />
        </div>
        <p className="text-zinc-400 font-medium mb-1.5">アイテムが見つかりません</p>
        <p className="text-zinc-600 text-sm mb-6">検索条件を変えるか、新しく追加してください</p>
        <Link
          href="/collection/new"
          className="inline-flex items-center gap-1.5 bg-white text-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors"
        >
          <Plus size={14} />
          新しく追加する
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {tshirts.map((t) => (
        <Link key={t.id} href={`/collection/${t.id}`} className="group">
          {/* shimmer: 画像ロード前はアニメーションpulseが見える、ロード後は画像で覆われる */}
          <div className={`aspect-[3/4] rounded-lg overflow-hidden relative ${t.thumb_url ? "bg-zinc-800 animate-pulse" : "bg-zinc-900"}`}>
            {t.thumb_url ? (
              <Image
                src={t.thumb_url}
                alt={t.title}
                width={300}
                height={400}
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
  );
}
