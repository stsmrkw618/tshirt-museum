"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { WearLog } from "@/lib/types";
import { useRouter } from "next/navigation";

export function WearLogSection({
  tshirtId,
  logs,
  wearCount,
}: {
  tshirtId: string;
  logs: WearLog[];
  wearCount: number;
}) {
  const router = useRouter();
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("wear_logs").insert({ tshirt_id: tshirtId, worn_at: date });
    setLoading(false);
    router.refresh();
  };

  const lastWorn = logs[0]?.worn_at;

  return (
    <div className="border-t border-zinc-800 pt-6">
      <h2 className="text-white font-semibold mb-4">着用ログ</h2>
      <div className="flex gap-6 mb-4">
        <div>
          <p className="text-zinc-500 text-xs">着用回数</p>
          <p className="text-white font-bold text-lg">{wearCount}回</p>
        </div>
        {lastWorn && (
          <div>
            <p className="text-zinc-500 text-xs">最終着用日</p>
            <p className="text-white font-bold text-lg">{lastWorn}</p>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-zinc-500"
        />
        <button
          onClick={handleAdd}
          disabled={loading}
          className="bg-zinc-800 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-zinc-700 transition-colors disabled:opacity-50"
        >
          {loading ? "記録中..." : "着用を記録"}
        </button>
      </div>
    </div>
  );
}
