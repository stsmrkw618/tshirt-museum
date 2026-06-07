import Link from "next/link";
import Image from "next/image";
import type { Tshirt } from "@/lib/types";

export function TodayPick({ item }: { item: Tshirt }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-white mb-4">今日の1枚</h2>
      <Link
        href={`/collection/${item.id}`}
        className="group flex gap-4 bg-zinc-900 rounded-xl p-4 hover:bg-zinc-800 transition-colors"
      >
        <div className="w-24 h-32 flex-shrink-0 bg-zinc-800 rounded-lg overflow-hidden">
          {item.thumb_url ? (
            <Image
              src={item.thumb_url}
              alt={item.title}
              width={96}
              height={128}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">
              No Image
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-white font-semibold">{item.title}</p>
          <p className="text-zinc-400 text-sm">{item.series}</p>
          {item.character && (
            <p className="text-zinc-500 text-sm">{item.character}</p>
          )}
        </div>
      </Link>
    </section>
  );
}
