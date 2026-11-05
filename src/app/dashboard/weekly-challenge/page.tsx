"use client";

import { useState, useEffect } from "react";
import { Trophy, Coins, Flame, Award, Calendar, Sparkles, TrendingUp, ShieldAlert } from "lucide-react";
import { getWeeklyStats } from "@/lib/frontendStore";

export default function WeeklyChallengePage() {
  const [stats, setStats] = useState<any>(() => {
    try {
      const data = getWeeklyStats();
      return {
        ...data,
        leader: data.winner,
      };
    } catch {
      return null;
    }
  });

  useEffect(() => {
    function loadStats() {
      const data = getWeeklyStats();
      setStats({
        ...data,
        leader: data.winner,
      });
    }
    loadStats();

    if (typeof window !== "undefined") {
      window.addEventListener("dsa_store_changed", loadStats);
      window.addEventListener("storage", loadStats);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("dsa_store_changed", loadStats);
        window.removeEventListener("storage", loadStats);
      }
    };
  }, []);

  const shreyaCoins = stats?.shreya_coins ?? 0;
  const shivamCoins = stats?.shivam_coins ?? 0;
  const totalCoins = (shreyaCoins + shivamCoins) || 1;
  const shreyaPercent = Math.round((shreyaCoins / totalCoins) * 100);
  const shivamPercent = 100 - shreyaPercent;

  const winner = stats?.leader;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-2">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>Monday to Sunday League</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white">Weekly Coin Challenge</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          1 question solved = 1 coin. Har week ka winner banega DSA Champion!
        </p>
      </div>

      {/* Winner Spotlight Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-indigo-950/60 border border-amber-500/30 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/10">
              <Trophy className="w-10 h-10" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Current Week Leader</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {winner === "shreya"
                  ? "Shreya Gaur 👑"
                  : winner === "shivam"
                  ? "Shivam Sharma 👑"
                  : "Neck to Neck Tie! 🤝"}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Week runs Monday through Sunday midnight. Highest coins wins this week&apos;s trophy.
              </p>
            </div>
          </div>

          <div className="text-center sm:text-right bg-slate-900/80 px-5 py-3.5 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 block font-medium">Sprint Status</span>
            <span className="text-sm font-bold text-amber-400 flex items-center justify-center sm:justify-end gap-1 mt-0.5">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Competitive Phase</span>
            </span>
          </div>
        </div>
      </div>

      {/* Head to Head Duel Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shreya Coin Card */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-pink-500/40 transition-all relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-400 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-pink-600/20">
                SG
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Shreya Gaur</h3>
                <span className="text-xs text-pink-400 font-medium">DSA Champ</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-amber-400 font-mono">
                {shreyaCoins}
              </span>
              <span className="text-xs text-slate-400 block">coins earned</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Career Championship Titles:</span>
            <span className="font-bold text-white px-2 py-0.5 bg-slate-800 rounded-lg">
              {stats?.shreya_total_wins ?? 4} 🏆
            </span>
          </div>
        </div>

        {/* Shivam Coin Card */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-indigo-600/20">
                SS
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Shivam Sharma</h3>
                <span className="text-xs text-indigo-400 font-medium">LeetCode Wizard</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-amber-400 font-mono">
                {shivamCoins}
              </span>
              <span className="text-xs text-slate-400 block">coins earned</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Career Championship Titles:</span>
            <span className="font-bold text-white px-2 py-0.5 bg-slate-800 rounded-lg">
              {stats?.shivam_total_wins ?? 3} 🏆
            </span>
          </div>
        </div>
      </div>

      {/* Tug of War Score Bar */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-pink-400">Shreya ({shreyaPercent}%)</span>
          <span className="text-slate-400">Current Week Score Bar</span>
          <span className="text-indigo-400">Shivam ({shivamPercent}%)</span>
        </div>
        <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden flex">
          <div
            style={{ width: `${shreyaPercent}%` }}
            className="bg-gradient-to-r from-pink-500 to-rose-400 transition-all duration-500"
          />
          <div
            style={{ width: `${shivamPercent}%` }}
            className="bg-gradient-to-r from-indigo-500 to-blue-400 transition-all duration-500"
          />
        </div>
      </div>

      {/* Rules & Coin Mechanics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <Coins className="w-5 h-5 text-amber-400 mb-2" />
          <h4 className="text-sm font-bold text-white">1 Question = 1 Coin</h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Har baar jab aap koi question solve karte hain ya LeetCode se sync karte hain, aapke account mein 1 coin add ho jata hai.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <Calendar className="w-5 h-5 text-indigo-400 mb-2" />
          <h4 className="text-sm font-bold text-white">Monday - Sunday Window</h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Har week Monday 00:00 se Sunday 23:59 tak chalta hai. Naye week par score 0 se shuru hota hai aur purana record history mein save rehta hai.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <Award className="w-5 h-5 text-emerald-400 mb-2" />
          <h4 className="text-sm font-bold text-white">Hall of Champions</h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Weekly winner ko permanent champion trophy award hoti hai jo total title count mein increment hoti hai.
          </p>
        </div>
      </div>
    </div>
  );
}

