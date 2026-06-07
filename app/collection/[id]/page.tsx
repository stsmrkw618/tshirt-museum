import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Pencil, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { WearLogSection } from "@/components/wear-log-section";

export default async function TshirtDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: tshirt },
    { data: wearLogs, count: wearCount },
    { data: allItems },
  ] = await Promise.all([
    supabase.from("tshirts").select("*").eq("id", id).single(),
    supabase
      .from("wear_logs")
      .select("*", { count: "exact" })
      .eq("tshirt_id", id)
      .order("worn_at", { ascending: false }),
    supabase
      .from("tshirts")
      .select("id")
      .order("created_at", { ascending: false }),
  ]);

  if (!tshirt) notFound();

  const ids = allItems?.map((t) => t.id) ?? [];
  const currentIdx = ids.indexOf(id);
  const prevId = currentIdx > 0 ? ids[currentIdx - 1] : null;
  const nextId = currentIdx < ids.length - 1 ? ids[currentIdx + 1] : null;

  const fields = [
    { label: "作品名", value: tshirt.series },
    { label: "キャラ名", value: tshirt.character },
    { label: "メーカー", value: tshirt.manufacturer },
    { label: "購入日", value: tshirt.purchase_date },
    { label: "購入場所", value: tshirt.purchase_place },
    {
      label: "購入価格",
      value: tshirt.purchase_price
        ? `¥${tshirt.purchase_price.toLocaleString()}`
        : null,
    },
    { label: "サイズ", value: tshirt.size },
    { label: "状態", value: tshirt.condition },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/collection"
          className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
        >
          <ArrowLeft size={16} />
          <span className="text-sm">一覧</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-zinc-600 text-xs">
            {currentIdx + 1} / {ids.length}
          </span>
          <Link
            href={`/collection/${id}/edit`}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white text-sm transition-colors"
          >
            <Pencil size={14} />
            編集
          </Link>
        </div>
      </div>

      {/* 画像 */}
      <div className="bg-zinc-900 rounded-xl overflow-hidden mb-6 aspect-[3/4] max-h-[480px] mx-auto">
        {tshirt.image_url ? (
          <Image
            src={tshirt.image_url}
            alt={tshirt.title}
            width={600}
            height={800}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600">
            No Image
          </div>
        )}
      </div>

      {/* タイトル */}
      <h1 className="text-2xl font-bold text-white mb-1">{tshirt.title}</h1>
      <p className="text-zinc-400 mb-6">{tshirt.series}</p>

      {/* 属性 */}
      <div className="space-y-3 mb-8">
        {fields
          .filter((f) => f.value)
          .map((f) => (
            <div key={f.label} className="flex">
              <span className="text-zinc-500 text-sm w-24 flex-shrink-0">
                {f.label}
              </span>
              <span className="text-white text-sm">{f.value}</span>
            </div>
          ))}
        {tshirt.memo && (
          <div className="flex flex-col gap-1 mt-2">
            <span className="text-zinc-500 text-sm">メモ</span>
            <p className="text-white text-sm whitespace-pre-wrap bg-zinc-900 rounded-lg p-3">
              {tshirt.memo}
            </p>
          </div>
        )}
      </div>

      {/* 前後ナビ */}
      <div className="flex items-center justify-between border-t border-zinc-800 pt-6 mb-8">
        {prevId ? (
          <Link
            href={`/collection/${prevId}`}
            className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors text-sm"
          >
            <ChevronLeft size={16} />
            前へ
          </Link>
        ) : (
          <span />
        )}
        {nextId ? (
          <Link
            href={`/collection/${nextId}`}
            className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors text-sm"
          >
            次へ
            <ChevronRight size={16} />
          </Link>
        ) : (
          <span />
        )}
      </div>

      {/* 着用ログ */}
      <WearLogSection
        tshirtId={id}
        logs={wearLogs ?? []}
        wearCount={wearCount ?? 0}
      />
    </div>
  );
}
