import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";

export default async function ExhibitPage() {
  const supabase = await createClient();
  const { data: tshirts } = await supabase
    .from("tshirts")
    .select("id,title,series,image_url")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-2 py-4">
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-2 space-y-2">
          {(tshirts ?? []).map((t) => (
            <Link
              key={t.id}
              href={`/collection/${t.id}`}
              className="block break-inside-avoid group relative"
            >
              <div className="bg-zinc-950 rounded-lg overflow-hidden">
                {t.image_url ? (
                  <Image
                    src={t.image_url}
                    alt={t.title}
                    width={400}
                    height={500}
                    className="w-full object-cover"
                  />
                ) : (
                  <div className="aspect-square flex items-center justify-center text-zinc-700 text-xs">
                    No Image
                  </div>
                )}
              </div>
              {/* hover overlay */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col justify-end p-3">
                <p className="text-white text-xs font-semibold truncate">{t.title}</p>
                <p className="text-zinc-400 text-xs truncate">{t.series}</p>
              </div>
            </Link>
          ))}
        </div>
        {(!tshirts || tshirts.length === 0) && (
          <div className="text-center py-16">
            <p className="text-zinc-600">コレクションがありません</p>
          </div>
        )}
      </div>
    </div>
  );
}
