"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, LayoutGrid, Play, Pause, Shuffle } from "lucide-react";

type Item = { id: string; title: string; series: string; image_url: string | null };

const AUTOPLAY_MS = 5000;
const KB_COUNT = 4;
const MIN_COLS = 1;
const MAX_COLS = 5;

export function ExhibitClient({ items: initialItems }: { items: Item[] }) {
  const [items, setItems] = useState(initialItems);
  const [mode, setMode] = useState<"grid" | "slideshow">("grid");
  const [cols, setCols] = useState(2);
  const [idx, setIdx] = useState(0);
  const [showInfo, setShowInfo] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const [fadingIdx, setFadingIdx] = useState<number | null>(null);
  const [kbVariant, setKbVariant] = useState(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const pinchStartDist = useRef<number | null>(null);
  const pinchCurrentDist = useRef<number | null>(null);

  // 画面幅に応じた初期列数
  useEffect(() => {
    const w = window.innerWidth;
    if (w >= 1024) setCols(5);
    else if (w >= 768) setCols(4);
    else if (w >= 640) setCols(3);
  }, []);

  // ピンチ中のブラウザズームを抑制（passive:false が必要なため native listener）
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        pinchCurrentDist.current = Math.sqrt(dx * dx + dy * dy);
      }
    };
    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => el.removeEventListener("touchmove", handleTouchMove);
  }, []);

  const onGridTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const d = Math.sqrt(dx * dx + dy * dy);
      pinchStartDist.current = d;
      pinchCurrentDist.current = d;
    }
  };

  const onGridTouchEnd = () => {
    const start = pinchStartDist.current;
    const current = pinchCurrentDist.current;
    if (start !== null && current !== null) {
      const ratio = current / start;
      if (ratio > 1.3) setCols((c) => Math.max(MIN_COLS, c - 1));
      else if (ratio < 0.75) setCols((c) => Math.min(MAX_COLS, c + 1));
      pinchStartDist.current = null;
      pinchCurrentDist.current = null;
    }
  };

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

  // スライド切り替え時に情報を3秒表示→自動非表示
  useEffect(() => {
    if (mode !== "slideshow") return;
    setShowInfo(true);
    const t = setTimeout(() => setShowInfo(false), 3000);
    return () => clearTimeout(t);
  }, [idx, mode]);

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

  // タッチスワイプ（スライドショー用）
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

          {/* 画像エリア：フル活用、ナビゲーションも内部に浮かせる */}
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
                <Image src={items[fadingIdx].image_url!} alt="" fill className="object-contain" />
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
                <Image src={item.image_url} alt={item.title} fill className="object-contain" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-700">
                  No Image
                </div>
              )}
            </div>

            {/* 左：前へボタン */}
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white hover:bg-black/50 transition-all"
            >
              <ChevronLeft size={20} />
            </button>

            {/* 右：次へボタン */}
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white hover:bg-black/50 transition-all"
            >
              <ChevronRight size={20} />
            </button>

            {/* ドットインジケーター（画像内・情報の上） */}
            <div className="absolute bottom-24 left-0 right-0 flex justify-center z-20 pointer-events-none">
              <div className="flex items-center gap-1.5 pointer-events-auto">
                {items
                  .slice(Math.max(0, idx - 3), Math.min(items.length, idx + 4))
                  .map((_, i) => {
                    const ai = Math.max(0, idx - 3) + i;
                    return (
                      <button
                        key={ai}
                        onClick={(e) => { e.stopPropagation(); goTo(ai); }}
                        className={`h-1.5 rounded-full flex-shrink-0 transition-all duration-300 ${
                          ai === idx ? "w-5 bg-white" : "w-1.5 bg-white/30 hover:bg-white/60"
                        }`}
                      />
                    );
                  })}
              </div>
            </div>

            {/* 情報オーバーレイ（3秒後自動非表示、タップで再表示） */}
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
        </div>
      </>
    );
  }

  // ─── グリッドモード ────────────────────────────────────
  return (
    <div className="min-h-screen bg-black" ref={gridRef} onTouchStart={onGridTouchStart} onTouchEnd={onGridTouchEnd}>
      <div className="flex justify-end items-center gap-4 px-4 pt-3">
        <button
          onClick={shuffle}
          className="text-zinc-500 hover:text-white text-sm flex items-center gap-1.5 transition-colors"
        >
          <Shuffle size={13} />
          シャッフル
        </button>
        <button
          onClick={() => setCols((c) => (c >= MAX_COLS ? MIN_COLS : c + 1))}
          className="text-zinc-500 hover:text-white text-sm flex items-center gap-1 transition-colors"
          title="列数を変更（ピンチでも操作可）"
        >
          <LayoutGrid size={13} />
          {cols}列
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
        <div className="gap-2 space-y-2" style={{ columnCount: cols }}>
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
              {/* ホバーオーバーレイ（デスクトップ） */}
              <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                  <p className="text-white text-xs font-semibold truncate drop-shadow">{t.title}</p>
                  <p className="text-zinc-400 text-xs truncate">{t.series}</p>
                </div>
              </div>
              {/* モバイル用：常時表示のテキストラベル */}
              <div className="sm:hidden mt-1 px-0.5">
                <p className="text-white text-xs truncate">{t.title}</p>
                <p className="text-zinc-500 text-[10px] truncate">{t.series}</p>
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
