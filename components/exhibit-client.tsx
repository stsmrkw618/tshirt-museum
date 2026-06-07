"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, LayoutGrid, Play, Pause, Shuffle } from "lucide-react";

type Item = { id: string; title: string; series: string; image_url: string | null };

const AUTOPLAY_MS = 5000;
const KB_COUNT = 4;

export function ExhibitClient({ items: initialItems }: { items: Item[] }) {
  const [items, setItems] = useState(initialItems);
  const [mode, setMode] = useState<"grid" | "slideshow">("grid");
  const [idx, setIdx] = useState(0);
  const [showInfo, setShowInfo] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const [fadingIdx, setFadingIdx] = useState<number | null>(null);
  const [kbVariant, setKbVariant] = useState(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const goTo = (newIdx: number) => {
    setFadingIdx(idx);
    setIdx(newIdx);
    setKbVariant((v) => (v + 1) % KB_COUNT);
  };

  const prev = () => { if (idx > 0) goTo(idx - 1); };
  const next = () => goTo(idx < items.length - 1 ? idx + 1 : 0);

  const shuffle = () => {
    setItems((prev) => [...prev].sort(() => Math.random() - 0.5));
    setIdx(0);
    setFadingIdx(null);
  };

  // オートプレイ
  useEffect(() => {
    if (!autoPlay || mode !== "slideshow") return;
    const timer = setTimeout(() => {
      setFadingIdx(idx);
      setKbVariant((v) => (v + 1) % KB_COUNT);
      setIdx((i) => (i < items.length - 1 ? i + 1 : 0));
    }, AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [autoPlay, mode, idx, items.length]);

  // フェードアウト層のクリーンアップ
  useEffect(() => {
    if (fadingIdx === null) return;
    const t = setTimeout(() => setFadingIdx(null), 1200);
    return () => clearTimeout(t);
  }, [fadingIdx, idx]);

  // キーボード操作
  useEffect(() => {
    if (mode !== "slideshow") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") setMode("grid");
      else if (e.key === " ") { e.preventDefault(); setAutoPlay((a) => !a); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, idx]); // eslint-disable-line react-hooks/exhaustive-deps

  // タッチスワイプ
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    const dy = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx > 0) next(); else prev();
    }
  };

  const item = items[idx];

  // ─── スライドショーモード ───────────────────────────────
  if (mode === "slideshow") {
    return (
      <>
        <style>{`
          @keyframes kenBurns0 { from { transform:scale(1.00) translate(0%,0%); } to { transform:scale(1.12) translate(-2%,-1%); } }
          @keyframes kenBurns1 { from { transform:scale(1.08) translate(-2%,0%); } to { transform:scale(1.00) translate(2%,1%); } }
          @keyframes kenBurns2 { from { transform:scale(1.00) translate(1%,1%); } to { transform:scale(1.10) translate(-1%,-2%); } }
          @keyframes kenBurns3 { from { transform:scale(1.10) translate(0%,-1%); } to { transform:scale(1.00) translate(-1%,1%); } }
          @keyframes xFadeIn  { from { opacity:0; } to { opacity:1; } }
          @keyframes xFadeOut { from { opacity:1; } to { opacity:0; } }
          @keyframes progressBar { from { transform:scaleX(0); } to { transform:scaleX(1); } }
        `}</style>

        <div
          className="fixed inset-0 bg-black z-50 flex flex-col select-none overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* プログレスバー */}
          {autoPlay && (
            <div className="absolute top-0 left-0 right-0 h-[2px] z-20 bg-zinc-900">
              <div
                key={idx}
                className="h-full bg-white origin-left"
                style={{ animation: `progressBar ${AUTOPLAY_MS}ms linear forwards` }}
              />
            </div>
          )}

          {/* ヘッダー */}
          <div className="relative z-10 flex items-center justify-between px-4 py-3 flex-shrink-0">
            <span className="text-zinc-600 text-sm tabular-nums">{idx + 1} / {items.length}</span>
            <div className="flex items-center gap-5">
              <button
                onClick={() => setAutoPlay((a) => !a)}
                className="text-zinc-400 hover:text-white transition-colors"
                title={autoPlay ? "一時停止 (Space)" : "オートプレイ (Space)"}
              >
                {autoPlay ? <Pause size={15} /> : <Play size={15} />}
              </button>
              <button
                onClick={() => setMode("grid")}
                className="text-zinc-500 hover:text-white transition-colors"
                title="グリッドに戻る (Esc)"
              >
                <LayoutGrid size={15} />
              </button>
            </div>
          </div>

          {/* 画像エリア（クロスフェード + Ken Burns） */}
          <div
            className="flex-1 relative cursor-pointer overflow-hidden"
            onClick={() => setShowInfo((s) => !s)}
          >
            {/* フェードアウト中の前の画像 */}
            {fadingIdx !== null && items[fadingIdx]?.image_url && (
              <div
                key={`fade-${fadingIdx}-${idx}`}
                className="absolute inset-0"
                style={{ animation: "xFadeOut 0.9s ease-in-out forwards" }}
              >
                <Image
                  src={items[fadingIdx].image_url!}
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
            )}

            {/* 現在の画像（Ken Burns + フェードイン） */}
            <div
              key={`show-${idx}`}
              className="absolute inset-0"
              style={{
                animation: `kenBurns${kbVariant} 8s ease-in-out forwards, xFadeIn 0.9s ease-in-out forwards`,
              }}
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
            </div>

            {/* 情報オーバーレイ（タップで表示切替） */}
            <div
              className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pb-6 pt-20 px-6 transition-opacity duration-500 z-10 pointer-events-none ${
                showInfo ? "opacity-100" : "opacity-0"
              }`}
            >
              {item && (
                <Link
                  href={`/collection/${item.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="block pointer-events-auto"
                >
                  <p className="text-white font-bold text-lg leading-tight drop-shadow-lg">
                    {item.title}
                  </p>
                  <p className="text-zinc-400 text-sm mt-0.5 drop-shadow-md">{item.series}</p>
                </Link>
              )}
            </div>
          </div>

          {/* ナビゲーション */}
          <div className="relative z-10 flex items-center justify-between px-6 py-4 flex-shrink-0">
            <button
              onClick={prev}
              className="w-11 h-11 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/15 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>

            {/* ドットインジケーター（アクティブは横長ピル） */}
            <div className="flex items-center gap-1.5 overflow-hidden max-w-[180px]">
              {items
                .slice(Math.max(0, idx - 3), Math.min(items.length, idx + 4))
                .map((_, i) => {
                  const ai = Math.max(0, idx - 3) + i;
                  return (
                    <button
                      key={ai}
                      onClick={() => goTo(ai)}
                      className={`h-1.5 rounded-full flex-shrink-0 transition-all duration-300 ${
                        ai === idx
                          ? "w-5 bg-white"
                          : "w-1.5 bg-zinc-600 hover:bg-zinc-400"
                      }`}
                    />
                  );
                })}
            </div>

            <button
              onClick={next}
              className="w-11 h-11 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/15 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </>
    );
  }

  // ─── グリッドモード ────────────────────────────────────
  return (
    <div className="min-h-screen bg-black">
      <div className="flex justify-end items-center gap-4 px-4 pt-3">
        <button
          onClick={shuffle}
          className="text-zinc-500 hover:text-white text-sm flex items-center gap-1.5 transition-colors"
        >
          <Shuffle size={13} />
          シャッフル
        </button>
        <button
          onClick={() => { setIdx(0); setMode("slideshow"); }}
          className="text-zinc-500 hover:text-white text-sm flex items-center gap-1.5 transition-colors"
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
              onClick={() => { setIdx(i); setMode("slideshow"); }}
              className="block w-full break-inside-avoid group relative text-left"
            >
              <div className="rounded-lg overflow-hidden transition-transform duration-500 group-hover:scale-[1.03]">
                {t.image_url ? (
                  <Image
                    src={t.image_url}
                    alt={t.title}
                    width={400}
                    height={500}
                    className="w-full object-cover"
                  />
                ) : (
                  <div className="aspect-[3/4] bg-zinc-950 flex items-center justify-center text-zinc-700 text-xs">
                    No Image
                  </div>
                )}
              </div>
              {/* ホバーオーバーレイ：グラデーション + テキストスライドイン */}
              <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                  <p className="text-white text-xs font-semibold truncate drop-shadow">{t.title}</p>
                  <p className="text-zinc-400 text-xs truncate">{t.series}</p>
                </div>
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
