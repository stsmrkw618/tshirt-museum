import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { ServiceWorker } from "@/components/service-worker";
import { createClient } from "@/lib/supabase/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Anime T-Shirt Museum",
  description: "個人アニメTシャツコレクション",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "T-Shirt Museum",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="ja" className={`${geistSans.variable} h-full`}>
      <body className="min-h-full bg-black text-white antialiased">
        <ServiceWorker />
        {user && <Navigation />}
        <main className={user ? "pt-14" : ""}>{children}</main>
      </body>
    </html>
  );
}
