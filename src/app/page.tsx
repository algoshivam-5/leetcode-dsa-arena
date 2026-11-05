"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/frontendStore";
import { BunnyCherrySticker, TeddyBearSticker, IceCreamSticker } from "@/components/CuteStickers";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    try {
      const user = getCurrentUser();
      if (user && user.username) {
        // Direct instant navigation to problem list
        window.location.replace("/dashboard/problems");
      } else {
        window.location.replace("/login");
      }
    } catch {
      window.location.replace("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen theme-pink-gingham flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="bg-white/95 border-2 border-pink-200 rounded-3xl p-8 max-w-sm w-full shadow-2xl shadow-pink-200/50 flex flex-col items-center gap-4 animate-in zoom-in-95">
        <div className="flex items-center gap-3">
          <BunnyCherrySticker className="w-14 h-14 animate-bounce" />
          <IceCreamSticker className="w-12 h-14 -rotate-12" />
          <TeddyBearSticker className="w-14 h-14 animate-pulse" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-800">
            🌸 Shreya & Shivam Arena 🧸
          </h2>
          <p className="text-xs text-pink-600 font-bold mt-1">
            Loading your cute DSA arena... ✨
          </p>
        </div>
        <div className="flex flex-col gap-2.5 w-full mt-2">
          <a
            href="/dashboard/problems"
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 hover:from-pink-300 hover:to-rose-400 text-white font-bold text-xs shadow-md shadow-pink-200 transition-all text-center block"
          >
            🌸 Enter Problem List Directly 🎀
          </a>
          <a
            href="/login"
            className="w-full py-2 px-4 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold text-xs border border-pink-200 transition-all text-center block"
          >
            Switch Profile / Login
          </a>
        </div>
      </div>
    </div>
  );
}
