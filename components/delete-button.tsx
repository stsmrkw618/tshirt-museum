"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("tshirts").delete().eq("id", id);
    router.push("/collection");
    router.refresh();
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-zinc-400 text-sm">削除しますか？</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-red-400 text-sm hover:text-red-300 font-semibold"
        >
          {loading ? "削除中..." : "はい"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-zinc-500 text-sm hover:text-zinc-300"
        >
          キャンセル
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-zinc-600 hover:text-red-400 transition-colors"
    >
      <Trash2 size={16} />
    </button>
  );
}
