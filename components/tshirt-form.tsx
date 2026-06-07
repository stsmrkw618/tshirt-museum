"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { Tshirt } from "@/lib/types";
import { Upload } from "lucide-react";

type FormData = Omit<Tshirt, "id" | "created_at" | "updated_at" | "image_url" | "thumb_url">;

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "FREE"];
const CONDITIONS = ["新品", "未使用", "良好", "普通", "使用感あり"];

export function TshirtForm({ initialData }: { initialData?: Tshirt }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.image_url ?? null);
  const [form, setForm] = useState<FormData>({
    title: initialData?.title ?? "",
    series: initialData?.series ?? "",
    character: initialData?.character ?? "",
    manufacturer: initialData?.manufacturer ?? "",
    purchase_date: initialData?.purchase_date ?? "",
    purchase_place: initialData?.purchase_place ?? "",
    purchase_price: initialData?.purchase_price ?? null,
    size: initialData?.size ?? "",
    condition: initialData?.condition ?? "",
    memo: initialData?.memo ?? "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const set = (key: keyof FormData, value: string | number | null) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    let image_url = initialData?.image_url ?? null;
    let thumb_url = initialData?.thumb_url ?? null;

    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const filename = `${Date.now()}.${ext}`;
      const thumbFilename = `thumb_${Date.now()}.${ext}`;

      const { data: uploadData } = await supabase.storage
        .from("tshirts")
        .upload(filename, imageFile, { upsert: true });

      if (uploadData) {
        const { data: { publicUrl } } = supabase.storage.from("tshirts").getPublicUrl(filename);
        image_url = publicUrl;

        // サムネイル用に同じ画像を別名で保存（Next.js Imageで最適化）
        await supabase.storage.from("tshirts").upload(thumbFilename, imageFile, { upsert: true });
        const { data: { publicUrl: thumbPublicUrl } } = supabase.storage.from("tshirts").getPublicUrl(thumbFilename);
        thumb_url = thumbPublicUrl;
      }
    }

    const payload = {
      title: form.title,
      series: form.series,
      character: form.character || null,
      manufacturer: form.manufacturer || null,
      purchase_date: form.purchase_date || null,
      purchase_place: form.purchase_place || null,
      purchase_price: form.purchase_price ? Number(form.purchase_price) : null,
      size: form.size || null,
      condition: form.condition || null,
      memo: form.memo || null,
      image_url,
      thumb_url,
    };

    if (initialData) {
      await supabase.from("tshirts").update(payload).eq("id", initialData.id);
      router.push(`/collection/${initialData.id}`);
    } else {
      const { data } = await supabase.from("tshirts").insert(payload).select("id").single();
      router.push(data ? `/collection/${data.id}` : "/collection");
    }

    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* image upload */}
      <div>
        <label className="block text-zinc-400 text-sm mb-2">画像 <span className="text-white">*</span></label>
        <div
          onClick={() => fileRef.current?.click()}
          className="cursor-pointer border-2 border-dashed border-zinc-700 rounded-xl aspect-square max-w-xs mx-auto flex items-center justify-center overflow-hidden hover:border-zinc-500 transition-colors"
        >
          {previewUrl ? (
            <Image src={previewUrl} alt="preview" width={300} height={300} className="w-full h-full object-contain" />
          ) : (
            <div className="text-center text-zinc-600 space-y-2">
              <Upload size={32} className="mx-auto" />
              <p className="text-sm">クリックして画像を選択</p>
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Field label="タイトル" required>
          <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)} required className={inputCls} placeholder="例：初号機 EvaT" />
        </Field>
        <Field label="作品名" required>
          <input type="text" value={form.series} onChange={(e) => set("series", e.target.value)} required className={inputCls} placeholder="例：新世紀エヴァンゲリオン" />
        </Field>
        <Field label="キャラ名">
          <input type="text" value={form.character ?? ""} onChange={(e) => set("character", e.target.value)} className={inputCls} placeholder="例：綾波レイ" />
        </Field>
        <Field label="メーカー">
          <input type="text" value={form.manufacturer ?? ""} onChange={(e) => set("manufacturer", e.target.value)} className={inputCls} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="サイズ">
            <select value={form.size ?? ""} onChange={(e) => set("size", e.target.value)} className={inputCls}>
              <option value="">選択</option>
              {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="状態">
            <select value={form.condition ?? ""} onChange={(e) => set("condition", e.target.value)} className={inputCls}>
              <option value="">選択</option>
              {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="購入日">
            <input type="date" value={form.purchase_date ?? ""} onChange={(e) => set("purchase_date", e.target.value)} className={inputCls} />
          </Field>
          <Field label="購入価格">
            <input type="number" value={form.purchase_price ?? ""} onChange={(e) => set("purchase_price", e.target.value ? Number(e.target.value) : null)} className={inputCls} placeholder="3800" />
          </Field>
        </div>
        <Field label="購入場所">
          <input type="text" value={form.purchase_place ?? ""} onChange={(e) => set("purchase_place", e.target.value)} className={inputCls} placeholder="例：秋葉原 アニメイト" />
        </Field>
        <Field label="メモ">
          <textarea value={form.memo ?? ""} onChange={(e) => set("memo", e.target.value)} rows={3} className={inputCls} />
        </Field>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-white text-black font-semibold rounded-lg py-3 hover:bg-zinc-200 transition-colors disabled:opacity-50"
      >
        {loading ? "保存中..." : initialData ? "更新する" : "登録する"}
      </button>
    </form>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-zinc-400 text-sm mb-1">
        {label} {required && <span className="text-white">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors";
