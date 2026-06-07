import Link from "next/link";
import Image from "next/image";

type Item = {
  id: string;
  title: string;
  series: string;
  thumb_url: string | null;
};

export function CollectionGrid({ tshirts }: { tshirts: Item[] }) {
  if (tshirts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-zinc-500">アイテムが見つかりません</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
      {tshirts.map((t) => (
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
  );
}
