"use client";

import { useRef, useState } from "react";
import { Download, Upload, CheckCircle, AlertCircle } from "lucide-react";

export default function SettingsPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setResult(null);

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      const res = await fetch("/api/backup/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (json.success) {
        setResult({
          ok: true,
          message: `Tシャツ ${json.tshirt_count}件、着用ログ ${json.wear_log_count}件をインポートしました`,
        });
      } else {
        setResult({ ok: false, message: json.error ?? "インポートに失敗しました" });
      }
    } catch {
      setResult({ ok: false, message: "JSONの解析に失敗しました" });
    }

    setImporting(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-10">
      <h1 className="text-xl font-bold text-white">設定</h1>

      {/* バックアップ */}
      <section className="space-y-4">
        <h2 className="text-white font-semibold">バックアップ</h2>

        {/* エクスポート */}
        <div className="bg-zinc-900 rounded-xl p-5 space-y-3">
          <p className="text-zinc-400 text-sm">
            全データをJSONファイルとしてダウンロードします。
            画像URLも含まれます（画像ファイル自体はSupabase Storageに保存されています）。
          </p>
          <a
            href="/api/backup/export"
            download
            className="flex items-center gap-2 bg-white text-black text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-zinc-200 transition-colors w-fit"
          >
            <Download size={15} />
            JSONでダウンロード
          </a>
        </div>

        {/* インポート */}
        <div className="bg-zinc-900 rounded-xl p-5 space-y-3">
          <p className="text-zinc-400 text-sm">
            バックアップJSONを読み込みます。
            既存データは上書き更新、新規データは追加されます。
            <span className="text-zinc-500">（削除は行いません）</span>
          </p>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={importing}
            className="flex items-center gap-2 bg-zinc-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-zinc-700 transition-colors disabled:opacity-50"
          >
            <Upload size={15} />
            {importing ? "インポート中..." : "JSONファイルを選択"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />

          {result && (
            <div
              className={`flex items-start gap-2 text-sm rounded-lg p-3 ${
                result.ok
                  ? "bg-green-950 text-green-400"
                  : "bg-red-950 text-red-400"
              }`}
            >
              {result.ok ? (
                <CheckCircle size={15} className="mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
              )}
              {result.message}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
