"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function CollectionFilters({
  seriesList,
}: {
  seriesList: string[];
}) {
  const router = useRouter();
  const params = useSearchParams();

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    router.push(`/collection?${next.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <select
        defaultValue={params.get("sort") ?? ""}
        onChange={(e) => update("sort", e.target.value)}
        className="bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-zinc-500"
      >
        <option value="created_at">登録順</option>
        <option value="purchase_date">購入日順</option>
        <option value="title">タイトル順</option>
      </select>
      <select
        defaultValue={params.get("series") ?? ""}
        onChange={(e) => update("series", e.target.value)}
        className="bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-zinc-500"
      >
        <option value="">作品：すべて</option>
        {seriesList.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>
  );
}
