"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import LiveNotificationToast from "@/components/LiveNotificationToast";
import { User } from "@/types";
import { getCurrentUser } from "@/lib/frontendStore";
import {
  BunnyCherrySticker,
  IceCreamSticker,
  RibbonBowSticker,
  TeddyBearSticker,
  BunnyUmbrellaSticker,
  HeartCloudSticker,
  FlowerSticker,
} from "@/components/CuteStickers";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(() => {
    try {
      return getCurrentUser();
    } catch {
      return null;
    }
  });

  useEffect(() => {
    function loadUser() {
      const u = getCurrentUser();
      setUser(u);
    }
    loadUser();

    if (typeof window !== "undefined") {
      window.addEventListener("dsa_store_changed", loadUser);
      window.addEventListener("storage", loadUser);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("dsa_store_changed", loadUser);
        window.removeEventListener("storage", loadUser);
      }
    };
  }, []);

  const isShreya = user?.username === "shreya";

  return (
    <div
      className={`min-h-screen flex flex-col relative transition-colors duration-300 ${
        isShreya
          ? "theme-pink-gingham text-slate-800 selection:bg-pink-300 selection:text-pink-950"
          : "theme-blue-gingham text-slate-800 selection:bg-sky-200 selection:text-sky-950"
      }`}
    >
      {/* Background Ambient Glows & Canva Floating Stickers */}
      {isShreya ? (
        <>
          <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-pink-400/20 rounded-full blur-[140px] pointer-events-none -z-10" />
          <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-rose-300/20 rounded-full blur-[160px] pointer-events-none -z-10" />
          <div className="fixed top-1/2 right-10 w-[300px] h-[300px] bg-pink-300/15 rounded-full blur-[120px] pointer-events-none -z-10" />

          {/* Canva Template 1 Cute Floating Stickers for Baby Shreya */}
          <div className="fixed top-20 right-6 hidden lg:block pointer-events-none z-20 transition-transform duration-300 hover:scale-110">
            <BunnyCherrySticker className="w-16 h-16 drop-shadow-lg rotate-6" />
          </div>
          <div className="fixed bottom-6 left-6 hidden lg:block pointer-events-none z-20 transition-transform duration-300 hover:scale-110">
            <IceCreamSticker className="w-14 h-16 drop-shadow-lg -rotate-12" />
          </div>
          <div className="fixed top-24 left-6 hidden xl:block pointer-events-none z-20 opacity-80">
            <HeartCloudSticker className="w-16 h-12 drop-shadow-md" />
          </div>
        </>
      ) : (
        <>
          <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-sky-400/20 rounded-full blur-[140px] pointer-events-none -z-10" />
          <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-[160px] pointer-events-none -z-10" />
          <div className="fixed top-1/2 right-10 w-[300px] h-[300px] bg-cyan-300/15 rounded-full blur-[120px] pointer-events-none -z-10" />

          {/* Canva Template 2 Cute Floating Stickers for Cute Shivam */}
          <div className="fixed top-20 right-6 hidden lg:block pointer-events-none z-20 transition-transform duration-300 hover:scale-110">
            <TeddyBearSticker className="w-16 h-16 drop-shadow-lg -rotate-6" />
          </div>
          <div className="fixed bottom-6 left-6 hidden lg:block pointer-events-none z-20 transition-transform duration-300 hover:scale-110">
            <BunnyUmbrellaSticker className="w-16 h-16 drop-shadow-lg rotate-12" />
          </div>
          <div className="fixed top-24 left-6 hidden xl:block pointer-events-none z-20 opacity-80">
            <HeartCloudSticker className="w-16 h-12 drop-shadow-md" />
          </div>
          <div className="fixed bottom-20 right-8 hidden xl:block pointer-events-none z-20 opacity-90">
            <FlowerSticker className="w-10 h-10 drop-shadow-md rotate-12" />
          </div>
        </>
      )}

      <LiveNotificationToast />

      <Header
        user={user}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
      />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 z-10">
        {children}
      </main>
    </div>
  );
}
