"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid3X3, BarChart3, Maximize, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: Home, label: "ホーム" },
  { href: "/collection", icon: Grid3X3, label: "コレクション" },
  { href: "/analytics", icon: BarChart3, label: "分析" },
  { href: "/exhibit", icon: Maximize, label: "展示" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* トップナビ（全画面共通） */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-zinc-800 h-14">
        <div className="max-w-5xl mx-auto px-4 h-full flex items-center justify-between">
          <Link href="/" className="text-white font-bold text-sm tracking-widest uppercase">
            T-Shirt Museum
          </Link>
          <div className="flex items-center gap-1">
            {navItems.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors",
                  pathname === href
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                )}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
            <Link
              href="/settings"
              className={cn(
                "flex items-center px-2.5 py-1.5 rounded-md transition-colors ml-1",
                pathname === "/settings"
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-600 hover:text-white hover:bg-zinc-900"
              )}
            >
              <Settings size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* モバイル用ボトムナビ */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-t border-zinc-800 safe-area-inset-bottom">
        <div className="flex items-stretch">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center pt-2.5 pb-3 gap-1 transition-colors",
                pathname === href ? "text-white" : "text-zinc-500 active:text-zinc-300"
              )}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          ))}
          <Link
            href="/settings"
            className={cn(
              "flex-1 flex flex-col items-center justify-center pt-2.5 pb-3 gap-1 transition-colors",
              pathname === "/settings" ? "text-white" : "text-zinc-500 active:text-zinc-300"
            )}
          >
            <Settings size={20} />
            <span className="text-[10px] font-medium">設定</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
