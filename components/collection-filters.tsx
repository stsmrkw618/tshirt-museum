"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

const SORTS = [
  { value: "created_at", label: "登録順" },
  { value: "purchase_date", label: "購入日順" },
  { value: "title", label: "タイトル順" },
];

export function CollectionFilters({
  seriesList,
  activeYear,
  activePlace,
}: {
  seriesList: string[];
  activeYear?: string;
  activePlace?: string;
}) {
  const router = useRouter();
  const params = useSearchParams();

  const currentSort = params.get("sort") ?? "created_at";
  const currentSeries = params.get("series") ?? "";
  const currentQ = params.get("q") ?? "";
  const [searchInput, setSearchInput] = useState(currentQ);

  const update = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(params.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") next.delete(key);
      else next.set(key, value);
    });
    router.push(`/collection?${next.toString()}`);
  };

  const handleSearch = () => update({ q: searchInput || null });

  return (
    <div className="space-y-3">
      {/* 検索 */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
        className="relative"
      >
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
        <input
          type="search"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            if (e.target.value === "") update({ q: null });
          }}
          placeholder="タイトル・作品・キャラ名で検索"
          className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg pl-9 pr-4 py-2 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
        />
      </form>

      {/* ソートチップ */}
      <div className="flex gap-2 flex-wrap">
        {SORTS.map((s) => (
          <button
            key={s.value}
            onClick={() => update({ sort: s.value })}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium transition-colors",
              currentSort === s.value
                ? "bg-white text-black"
                : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* 年・場所のアクティブフィルタ */}
      {(activeYear || activePlace) && (
        <div className="flex gap-2 flex-wrap">
          {activeYear && (
            <button
              onClick={() => update({ year: null })}
              className="flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-zinc-600 text-white"
            >
              {activeYear}年
              <X size={10} />
            </button>
          )}
          {activePlace && (
            <button
              onClick={() => update({ place: null })}
              className="flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-zinc-600 text-white"
            >
              {activePlace}
              <X size={10} />
            </button>
          )}
        </div>
      )}

      {/* 作品フィルタチップ */}
      {seriesList.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {currentSeries && (
            <button
              onClick={() => update({ series: null })}
              className="flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-zinc-600 text-white"
            >
              {currentSeries}
              <X size={10} />
            </button>
          )}
          {seriesList
            .filter((s) => s !== currentSeries)
            .map((s) => (
              <button
                key={s}
                onClick={() => update({ series: s })}
                className="px-3 py-1 rounded-full text-xs bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
              >
                {s}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
