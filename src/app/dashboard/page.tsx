"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ListChecks,
  Swords,
  Trophy,
  Calendar,
  BookOpen,
  Code2,
  MessageSquare,
  Bot,
  RotateCcw,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { getCoins, getProblemsWithStatus, getBattles, getCurrentUser } from "@/lib/frontendStore";

export default function DashboardHomePage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const currentUser = getCurrentUser();
  const isShreya = currentUser?.username === "shreya";

  useEffect(() => {
    function fetchDashboardStats() {
      try {
        const coinsData = getCoins();
        const problems = getProblemsWithStatus();
        const battles = getBattles();

        const shreyaSolved = problems.filter((p: any) => p.shreya_status === "done").length;
        const shivamSolved = problems.filter((p: any) => p.shivam_status === "done").length;
        const bothSolved = problems.filter((p: any) => p.shreya_status === "done" && p.shivam_status === "done").length;

        const nextBattle = battles.find((b: any) => b.status === "scheduled");

        setStats({
          coins: {
            shreya_coins: coinsData.shreya,
            shivam_coins: coinsData.shivam,
            leader: coinsData.shivam > coinsData.shreya ? "shivam" : coinsData.shreya > coinsData.shivam ? "shreya" : "tie",
          },
          totalProblems: problems.length,
          shreyaSolved,
          shivamSolved,
          bothSolved,
          nextBattle,
        });
      } catch (err) {
        console.error("Dashboard stats error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardStats();

    if (typeof window !== "undefined") {
      window.addEventListener("dsa_store_changed", fetchDashboardStats);
      window.addEventListener("storage", fetchDashboardStats);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("dsa_store_changed", fetchDashboardStats);
        window.removeEventListener("storage", fetchDashboardStats);
      }
    };
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome Banner */}
      <div
        className={`relative overflow-hidden rounded-3xl border-2 p-6 sm:p-8 transition-all bg-white/95 shadow-xl ${
          isShreya
            ? "border-pink-200 shadow-pink-100/60"
            : "border-sky-200 shadow-sky-100/60"
        }`}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div
              className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold mb-3 border shadow-sm ${
                isShreya
                  ? "bg-pink-100 text-pink-700 border-pink-300"
                  : "bg-sky-100 text-sky-700 border-sky-300"
              }`}
            >
              <span>{isShreya ? "🌸" : "🐻"}</span>
              <span>
                {isShreya
                  ? "Baby Shreya Mode Activated 🎀 Chhoti Bacchi"
                  : "Cute Shivam Mode Activated ☁️ Teddy Champ"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 flex items-center gap-2">
              <span>
                {isShreya
                  ? "Welcome Baby Shreya! 🌸🎀🧸"
                  : "Welcome Cute Shivam! 🐻☁️🍦"}
              </span>
            </h1>
            <p className="text-slate-600 text-sm mt-1.5 max-w-xl leading-relaxed font-medium">
              {isShreya
                ? "Hamari sabse pyari DSA coder bacchi ka kingdom! Chalo maze se questions solve karo aur Shivam bhaiya se aage niklo! 🍓✨"
                : "Canva Blue pastel aesthetic study arena! Cute teddy aur bunny ke sath DSA solve karo aur Shreya bacchi ke sath compete karo! 🍦✨"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/problems"
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all text-white ${
                isShreya
                  ? "bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 hover:from-pink-300 hover:to-rose-400 shadow-pink-200"
                  : "bg-gradient-to-r from-sky-400 via-blue-500 to-sky-500 hover:from-sky-300 hover:to-blue-400 shadow-sky-200"
              }`}
            >
              <ListChecks className="w-4 h-4" />
              <span>
                {isShreya ? "🌸 Baby Problem List 🎀" : "🐻 Cute Problem List ☁️"}
              </span>
            </Link>
            <Link
              href="/dashboard/battles"
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm border-2 transition-all ${
                isShreya
                  ? "bg-pink-50 hover:bg-pink-100 border-pink-200 text-pink-700 shadow-sm"
                  : "bg-sky-50 hover:bg-sky-100 border-sky-200 text-sky-700 shadow-sm"
              }`}
            >
              <Swords className="w-4 h-4 text-amber-500" />
              <span>
                {isShreya ? "🧸 1v1 Battle Arena" : "☁️ 1v1 Battle Arena 🐻"}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Head to Head Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Shreya Status Card */}
        <div className="p-5 rounded-2xl bg-white/95 border-2 border-pink-200 hover:border-pink-300 shadow-md shadow-pink-100/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                SG
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Shreya Gaur</h3>
                <span className="text-[11px] text-pink-600 font-bold">Solved Questions 🌸</span>
              </div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-pink-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-800">
              {stats?.shreyaSolved ?? "--"}
            </span>
            <span className="text-xs text-slate-500 font-medium">/ {stats?.totalProblems ?? 20} problems</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-pink-100 pt-2.5 font-medium">
            <span>Weekly Coins:</span>
            <span className="font-bold text-amber-600">{stats?.coins?.shreya_coins ?? 0} 🪙</span>
          </div>
        </div>

        {/* Shivam Status Card */}
        <div className="p-5 rounded-2xl bg-white/95 border-2 border-sky-200 hover:border-sky-300 shadow-md shadow-sky-100/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                SS
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Shivam Sharma</h3>
                <span className="text-[11px] text-sky-600 font-bold">Solved Questions ☁️</span>
              </div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-sky-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-800">
              {stats?.shivamSolved ?? "--"}
            </span>
            <span className="text-xs text-slate-500 font-medium">/ {stats?.totalProblems ?? 20} problems</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-sky-100 pt-2.5 font-medium">
            <span>Weekly Coins:</span>
            <span className="font-bold text-amber-600">{stats?.coins?.shivam_coins ?? 0} 🪙</span>
          </div>
        </div>

        {/* Common Solved (Battle Ready) Card */}
        <div className="p-5 rounded-2xl bg-white/95 border-2 border-amber-200 hover:border-amber-300 shadow-md shadow-amber-100/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-600 shadow-sm">
              <Swords className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              Battle Eligible
            </span>
          </div>
          <h3 className="text-xs font-bold text-slate-600">Common Solved</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-slate-800">
              {stats?.bothSolved ?? "--"}
            </span>
            <span className="text-xs text-slate-500 font-medium">ready for 1v1</span>
          </div>
          <div className="mt-3 border-t border-amber-100 pt-2.5">
            <Link href="/dashboard/battles" className="text-xs text-amber-700 hover:underline flex items-center gap-1 font-bold">
              Schedule Battle <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Weekly Leader Trophy Card */}
        <div className="p-5 rounded-2xl bg-white/95 border-2 border-indigo-200 hover:border-indigo-300 shadow-md shadow-indigo-100/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-300 flex items-center justify-center text-indigo-600 shadow-sm">
              <Trophy className="w-4 h-4 text-amber-500" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
              Week Leader
            </span>
          </div>
          <h3 className="text-xs font-bold text-slate-600">Current Leader</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-lg font-extrabold text-slate-800 capitalize">
              {stats?.coins?.leader === "shreya" ? "Shreya Gaur 👑" : stats?.coins?.leader === "shivam" ? "Shivam Sharma 👑" : "Tie 🤝"}
            </span>
          </div>
          <div className="mt-3 border-t border-indigo-100 pt-2.5">
            <Link href="/dashboard/weekly-challenge" className="text-xs text-indigo-700 hover:underline flex items-center gap-1 font-bold">
              View Leaderboard <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Next Upcoming Battle Banner */}
      {stats?.nextBattle && (
        <div className="p-5 rounded-2xl bg-white/95 border-2 border-amber-300 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 text-amber-600 flex items-center justify-center font-bold shadow-sm">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  Upcoming Battle
                </span>
                <span className="text-xs px-2 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300 font-bold">
                  {stats.nextBattle.problem_difficulty}
                </span>
              </div>
              <h4 className="text-base font-extrabold text-slate-800 mt-0.5">
                {stats.nextBattle.problem_title}
              </h4>
              <p className="text-xs text-slate-600 font-medium">
                Scheduled at: {new Date(stats.nextBattle.scheduled_at).toLocaleString()} · {stats.nextBattle.duration_minutes} mins
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/battles"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs transition-colors shadow-sm"
          >
            Go to Battle Room <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Feature Modules Quick Grid */}
      <div>
        <h2 className="text-base font-extrabold text-slate-800 mb-4 flex items-center gap-2">
          <Sparkles className={`w-4 h-4 ${isShreya ? "text-pink-500" : "text-sky-500"}`} />
          <span>Study & Tool Modules</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Problem List */}
          <Link
            href="/dashboard/problems"
            className={`p-5 rounded-2xl bg-white/95 border-2 transition-all group shadow-sm ${
              isShreya
                ? "border-pink-200 hover:border-pink-400 hover:bg-pink-50/40 shadow-pink-100/30"
                : "border-sky-200 hover:border-sky-400 hover:bg-sky-50/40 shadow-sky-100/30"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm ${
                isShreya
                  ? "bg-pink-100 text-pink-600 border border-pink-200"
                  : "bg-sky-100 text-sky-600 border border-sky-200"
              }`}
            >
              <ListChecks className="w-5 h-5" />
            </div>
            <h3 className={`text-sm font-bold text-slate-800 transition-colors ${isShreya ? "group-hover:text-pink-600" : "group-hover:text-sky-600"}`}>
              Problem List & LeetCode Sync
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
              Curated DSA questions, PDF problem extraction, LeetCode sync, and status for both users.
            </p>
          </Link>

          {/* Revision Area */}
          <Link
            href="/dashboard/revision"
            className={`p-5 rounded-2xl bg-white/95 border-2 transition-all group shadow-sm ${
              isShreya
                ? "border-pink-200 hover:border-pink-400 hover:bg-pink-50/40 shadow-pink-100/30"
                : "border-sky-200 hover:border-sky-400 hover:bg-sky-50/40 shadow-sky-100/30"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 border border-purple-200 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 group-hover:text-purple-600 transition-colors">
              Revision Area
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
              Spaced repetition for already done problems. Track revision counts and last revised dates.
            </p>
          </Link>

          {/* Battle Area */}
          <Link
            href="/dashboard/battles"
            className={`p-5 rounded-2xl bg-white/95 border-2 transition-all group shadow-sm ${
              isShreya
                ? "border-pink-200 hover:border-pink-400 hover:bg-pink-50/40 shadow-pink-100/30"
                : "border-sky-200 hover:border-sky-400 hover:bg-sky-50/40 shadow-sky-100/30"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
              <Swords className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 group-hover:text-amber-600 transition-colors">
              1v1 Coding Battle Area
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
              Schedule live battles on common solved problems, track timers, and record match winners.
            </p>
          </Link>

          {/* Weekly Challenge */}
          <Link
            href="/dashboard/weekly-challenge"
            className={`p-5 rounded-2xl bg-white/95 border-2 transition-all group shadow-sm ${
              isShreya
                ? "border-pink-200 hover:border-pink-400 hover:bg-pink-50/40 shadow-pink-100/30"
                : "border-sky-200 hover:border-sky-400 hover:bg-sky-50/40 shadow-sky-100/30"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
              Weekly Coin Challenge
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
              1 question = 1 coin. Weekly head-to-head race, winner trophy, and historical records.
            </p>
          </Link>

          {/* Timetable */}
          <Link
            href="/dashboard/timetable"
            className={`p-5 rounded-2xl bg-white/95 border-2 transition-all group shadow-sm ${
              isShreya
                ? "border-pink-200 hover:border-pink-400 hover:bg-pink-50/40 shadow-pink-100/30"
                : "border-sky-200 hover:border-sky-400 hover:bg-sky-50/40 shadow-sky-100/30"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
              Timetable Planner
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
              Weekly view Monday to Sunday. View and manage your schedule or peek at each other&apos;s timetable.
            </p>
          </Link>

          {/* DS Theory */}
          <Link
            href="/dashboard/theory"
            className={`p-5 rounded-2xl bg-white/95 border-2 transition-all group shadow-sm ${
              isShreya
                ? "border-pink-200 hover:border-pink-400 hover:bg-pink-50/40 shadow-pink-100/30"
                : "border-sky-200 hover:border-sky-400 hover:bg-sky-50/40 shadow-sky-100/30"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 group-hover:text-rose-600 transition-colors">
              DS Theory & Notes
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
              Topic-wise notes with clipboard image paste (Ctrl+V), PDF uploads, and markdown editor.
            </p>
          </Link>

          {/* Rough Code */}
          <Link
            href="/dashboard/rough-code"
            className={`p-5 rounded-2xl bg-white/95 border-2 transition-all group shadow-sm ${
              isShreya
                ? "border-pink-200 hover:border-pink-400 hover:bg-pink-50/40 shadow-pink-100/30"
                : "border-sky-200 hover:border-sky-400 hover:bg-sky-50/40 shadow-sky-100/30"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-sky-100 border border-sky-200 text-sky-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 group-hover:text-sky-600 transition-colors">
              Rough Code Area
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
              Syntax-highlighted code editor (C++, Java, Python, JS). Save, edit, rename, and organize files.
            </p>
          </Link>

          {/* WhatsApp Style Chat */}
          <Link
            href="/dashboard/chat"
            className={`p-5 rounded-2xl bg-white/95 border-2 transition-all group shadow-sm ${
              isShreya
                ? "border-pink-200 hover:border-pink-400 hover:bg-pink-50/40 shadow-pink-100/30"
                : "border-sky-200 hover:border-sky-400 hover:bg-sky-50/40 shadow-sky-100/30"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
              Realtime Study Chat
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
              WhatsApp-style chat between Shreya and Shivam with message bubbles, timestamps, and persistent history.
            </p>
          </Link>

          {/* PDF Chat (Gemini AI) */}
          <Link
            href="/dashboard/pdf-chat"
            className={`p-5 rounded-2xl bg-white/95 border-2 transition-all group shadow-sm ${
              isShreya
                ? "border-pink-200 hover:border-pink-400 hover:bg-pink-50/40 shadow-pink-100/30"
                : "border-sky-200 hover:border-sky-400 hover:bg-sky-50/40 shadow-sky-100/30"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-violet-100 border border-violet-200 text-violet-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 group-hover:text-violet-600 transition-colors">
              PDF AI Chat (Gemini)
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
              Strict RAG AI chat that answers strictly from your uploaded PDF notes sheet.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
