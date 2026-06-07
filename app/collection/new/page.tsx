import { TshirtForm } from "@/components/tshirt-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewTshirtPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/collection" className="text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <h1 className="text-xl font-bold text-white">Tシャツを登録</h1>
      </div>
      <TshirtForm />
    </div>
  );
}
