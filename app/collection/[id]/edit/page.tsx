import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { TshirtForm } from "@/components/tshirt-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DeleteButton } from "@/components/delete-button";

export default async function EditTshirtPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: tshirt } = await supabase
    .from("tshirts")
    .select("*")
    .eq("id", id)
    .single();

  if (!tshirt) notFound();

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href={`/collection/${id}`} className="text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <h1 className="text-xl font-bold text-white">編集</h1>
        </div>
        <DeleteButton id={id} />
      </div>
      <TshirtForm initialData={tshirt} />
    </div>
  );
}
