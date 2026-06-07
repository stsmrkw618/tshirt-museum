"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, LayoutGrid, Play } from "lucide-react";

type Item = {
  id: string;
  title: string;
  series: string;
  image_url: string | null;
};

export function ExhibitClient({ items }: { items: Item[] }) {
  const [mode, setMode] = useState<"grid" | "slideshow">("grid");
  const [idx, setIdx] = useState(0);
  const [showInfo, setShowInfo] = useState(true);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const prev = () => setIdx((i) => Math.max(i - 1, 0));
  const next = () => setIdx((i) => Math.min(i + 1, items.length - 1));

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    const dy = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx > 0) next();
      else prev();
    }
  };

  useEffect(() => {
    if (mode !== "slideshow") return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setMode("grid");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [mode, idx]);

  const item = items[idx];

  if (mode === "slideshow") {
    return (
      <div
        className="fixed inset-0 bg-black z-50 flex flex-col select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between px-4 py-3 flex-shrink-0">
          <span className="text-zinc-500 text-sm">
            {idx + 1} / {items.length}
          </span>
          <button
            onClick={() => setMode("grid")}
            className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 text-sm"
          >
            <LayoutGrid size={14} />
            グリッド
          </button>
        </div>

        {/* 画像エリア */}
        <div
          className="flex-1 relative cursor-pointer overflow-hidden"
          onClick={() => setShowInfo((s) => !s)}
        >
          {item?.image_url ? (
            <Image
              src={item.image_url}
              alt={item.title}
              fill
              className="object-contain"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-700">
              No Image
            </div>
          )}

          {/* 情報オーバーレイ（タップで表示切替） */}
          <div
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pb-4 pt-16 px-6 transition-opacity duration-300 ${
              showInfo ? "opacity-100" : "opacity-0"
            }`}
          >
            {item && (
              <Link
                href={`/collection/${item.id}`}
                onClick={(e) => e.stopPropagation()}
                className="block"
              >
                <p className="text-white font-bold text-lg leading-tight">
                  {item.title}
                </p>
                <p className="text-zinc-400 text-sm mt-0.5">{item.series}</p>
              </Link>
            )}
          </div>
        </div>

        {/* ナビゲーション */}
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0">
          <button
            onClick={prev}
            disabled={idx === 0}
            className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-white disabled:opacity-20 hover:bg-zinc-800 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>

          {/* インジケータドット */}
          <div className="flex gap-1.5 overflow-hidden max-w-[160px]">
            {items
              .slice(Math.max(0, idx - 3), Math.min(items.length, idx + 4))
              .map((_, i) => {
                const actualIdx = Math.max(0, idx - 3) + i;
                return (
                  <button
                    key={actualIdx}
                    onClick={() => setIdx(actualIdx)}
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${
                      actualIdx === idx ? "bg-white" : "bg-zinc-700"
                    }`}
                  />
                );
              })}
          </div>

          <button
            onClick={next}
            disabled={idx === items.length - 1}
            className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-white disabled:opacity-20 hover:bg-zinc-800 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  // グリッドモード
  return (
    <div className="min-h-screen bg-black">
      <div className="flex justify-end px-4 pt-3">
        <button
          onClick={() => {
            setIdx(0);
            setMode("slideshow");
          }}
          className="text-zinc-400 hover:text-white text-sm flex items-center gap-1.5 transition-colors"
        >
          <Play size={13} />
          スライドショー
        </button>
      </div>
      <div className="max-w-7xl mx-auto px-2 pb-4 pt-2">
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-2 space-y-2">
          {items.map((t, i) => (
            <button
              key={t.id}
              onClick={() => {
                setIdx(i);
                setMode("slideshow");
              }}
              className="block w-full break-inside-avoid group relative text-left"
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
                  <div className="aspect-[3/4] flex items-center justify-center text-zinc-700 text-xs">
                    No Image
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col justify-end p-3">
                <p className="text-white text-xs font-semibold truncate">
                  {t.title}
                </p>
                <p className="text-zinc-400 text-xs truncate">{t.series}</p>
              </div>
            </button>
          ))}
        </div>
        {items.length === 0 && (
          <div className="text-center py-16">
            <p className="text-zinc-600">コレクションがありません</p>
          </div>
        )}
      </div>
    </div>
  );
}
