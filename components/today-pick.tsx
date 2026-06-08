import Link from "next/link";
import Image from "next/image";
import type { Tshirt } from "@/lib/types";

export function TodayPick({ item }: { item: Tshirt }) {
  const dateLabel = new Date().toLocaleDateString("ja-JP", { month: "long", day: "numeric" });

  return (
    <section>
      <p className="text-zinc-600 text-xs font-medium tracking-widest uppercase mb-3">Today&apos;s Pick</p>
      <Link
        href={`/collection/${item.id}`}
        className="group block relative rounded-2xl overflow-hidden bg-zinc-900"
      >
        {/* アンビエント背景 */}
        {item.thumb_url && (
          <>
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src={item.thumb_url}
                alt=""
                fill
                className="object-cover blur-3xl scale-150 opacity-50 saturate-[1.8]"
                aria-hidden="true"
                unoptimized
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20" />
          </>
        )}

        <div className="relative flex gap-5 p-5 items-center">
          <div className="w-28 h-36 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
            {item.thumb_url ? (
              <Image
                src={item.thumb_url}
                alt={item.title}
                width={112}
                height={144}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-600 text-xs">
                No Image
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <p className="text-zinc-400 text-xs mb-2">{dateLabel}</p>
            <p className="text-white font-bold text-xl leading-tight mb-1.5 line-clamp-2">
              {item.title}
            </p>
            <p className="text-zinc-300 text-sm">{item.series}</p>
            {item.character && (
              <p className="text-zinc-500 text-sm mt-0.5">{item.character}</p>
            )}
          </div>
        </div>
      </Link>
    </section>
  );
}
