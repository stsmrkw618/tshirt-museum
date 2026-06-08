"use client";

import Image from "next/image";

export function AmbientImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative rounded-xl overflow-hidden mb-6 aspect-[3/4] max-h-[480px] mx-auto">
      {/* ぼかした画像を背景に敷いてアンビエント効果を演出 */}
      <Image
        src={src}
        alt=""
        fill
        className="object-cover scale-150 blur-3xl opacity-70 saturate-[1.8]"
        aria-hidden="true"
        unoptimized
      />
      <div className="absolute inset-0 bg-black/40" />
      {/* メイン画像 */}
      <div className="absolute inset-0 z-10">
        <Image src={src} alt={alt} fill className="object-contain" priority />
      </div>
    </div>
  );
}
