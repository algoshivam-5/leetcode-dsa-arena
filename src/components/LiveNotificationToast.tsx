"use client";

import { useState, useEffect, useRef } from "react";
import { ActivityNotification } from "@/types";
import { Sparkles, Trophy, X, CheckCircle2, Flame, Swords, BellRing } from "lucide-react";
import { getActivities, getCurrentUser } from "@/lib/frontendStore";

function playVictoryChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // First tone (D5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.25);

    // Second tone (A5)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880, now + 0.12);
    gain2.gain.setValueAtTime(0.15, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.55);
  } catch (e) {
    // Autoplay restrictions or audio unsupported
  }
}

export default function LiveNotificationToast() {
  const [activeToast, setActiveToast] = useState<ActivityNotification | null>(null);
  const seenIdsRef = useRef<Set<string>>(new Set());
  const hasInitializedRef = useRef<boolean>(false);

  useEffect(() => {
    const showToast = (activity: ActivityNotification) => {
      setActiveToast(activity);
      playVictoryChime();

      // Auto-hide after 8 seconds
      setTimeout(() => {
        setActiveToast((current) => (current?.id === activity.id ? null : current));
      }, 8000);
    };

    // Check for new activities from store
    const checkActivities = () => {
      const currentUser = getCurrentUser();
      const list = getActivities();

      if (list.length > 0) {
        if (!hasInitializedRef.current) {
          hasInitializedRef.current = true;
          list.forEach((item) => seenIdsRef.current.add(item.id));
          return;
        }

        for (const item of list) {
          if (!seenIdsRef.current.has(item.id)) {
            seenIdsRef.current.add(item.id);
            if (item.user_id !== currentUser.id) {
              showToast(item);
              break;
            }
          }
        }
      } else {
        hasInitializedRef.current = true;
      }
    };

    // Listen to local partner solved event
    const handleCustomSolved = (e: any) => {
      if (e.detail) {
        const currentUser = getCurrentUser();
        if (e.detail.user_id !== currentUser.id) {
          showToast(e.detail);
        }
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("partner_solved_problem", handleCustomSolved);
      window.addEventListener("dsa_store_changed", checkActivities);
      window.addEventListener("storage", checkActivities);
    }

    checkActivities();
    const interval = setInterval(checkActivities, 2000);

    return () => {
      clearInterval(interval);
      if (typeof window !== "undefined") {
        window.removeEventListener("partner_solved_problem", handleCustomSolved);
        window.removeEventListener("dsa_store_changed", checkActivities);
        window.removeEventListener("storage", checkActivities);
      }
    };
  }, []);

  if (!activeToast) return null;

  const isShreya = activeToast.user_id === "user_shreya";

  return (
    <div className="fixed top-5 right-5 z-50 max-w-sm sm:max-w-md w-full animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="p-4 rounded-3xl bg-slate-900/95 border-2 border-emerald-500/80 shadow-2xl backdrop-blur-xl flex items-start gap-3.5 relative overflow-hidden ring-4 ring-emerald-500/10">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* User Avatar */}
        <div
          className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-white text-sm shadow-lg flex-shrink-0 mt-0.5 ${
            isShreya
              ? "bg-gradient-to-tr from-pink-600 to-rose-400 shadow-pink-500/30 ring-2 ring-pink-400/40"
              : "bg-gradient-to-tr from-indigo-600 to-blue-500 shadow-indigo-500/30 ring-2 ring-indigo-400/40"
          }`}
        >
          {isShreya ? "SG" : "SS"}
        </div>

        {/* Body */}
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Partner Solved!</span>
            </span>
            <span className="text-[11px] text-amber-400 font-extrabold">+1 Coin 🪙</span>
          </div>

          <h4 className="text-xs sm:text-sm font-extrabold text-white leading-snug">
            {activeToast.user_name} ne <span className="text-emerald-300 underline font-black">&quot;{activeToast.problem_title}&quot;</span> complete kar liya!
          </h4>

          <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
            {activeToast.both_done ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 inline text-emerald-400" />
                <span>Bhai dono ne solve kar liya! Problem table mein cross ho gayi hai 🤝</span>
              </span>
            ) : (
              <span>Aapka status abhi pending hai — solve karke match karein! 🔥</span>
            )}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setActiveToast(null)}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
