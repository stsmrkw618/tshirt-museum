import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { CollectionGrid } from "@/components/collection-grid";
import { CollectionFilters } from "@/components/collection-filters";
import { Plus } from "lucide-react";
import { Suspense } from "react";

export default async function CollectionPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; series?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("tshirts")
    .select("id,title,series,thumb_url");

  if (params.series) query = query.eq("series", params.series);

  const sort = params.sort ?? "created_at";
  if (sort === "purchase_date") {
    query = query.order("purchase_date", { ascending: false, nullsFirst: false });
  } else if (sort === "title") {
    query = query.order("title", { ascending: true });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data: tshirts } = await query;

  const { data: seriesData } = await supabase
    .from("tshirts")
    .select("series")
    .order("series");
  const seriesList = [...new Set(seriesData?.map((t) => t.series) ?? [])];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">コレクション</h1>
        <Link
          href="/collection/new"
          className="flex items-center gap-1.5 bg-white text-black text-sm font-semibold px-3 py-2 rounded-lg hover:bg-zinc-200 transition-colors"
        >
          <Plus size={14} />
          追加
        </Link>
      </div>

      <div className="mb-6">
        <Suspense>
          <CollectionFilters seriesList={seriesList} />
        </Suspense>
      </div>

      <CollectionGrid tshirts={tshirts ?? []} />
    </div>
  );
}
