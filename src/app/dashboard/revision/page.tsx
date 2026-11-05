"use client";

import { useState, useEffect } from "react";
import { RotateCcw, CheckCircle, ExternalLink, Calendar, Flame, Sparkles, Filter } from "lucide-react";
import { Problem, User } from "@/types";
import { getCurrentUser, getProblemsWithStatus, incrementRevision } from "@/lib/frontendStore";

export default function RevisionAreaPage() {
  const [problems, setProblems] = useState<Problem[]>(() => {
    try {
      return getProblemsWithStatus();
    } catch {
      return [];
    }
  });
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      return getCurrentUser();
    } catch {
      return null;
    }
  });
  const [viewUser, setViewUser] = useState<"current" | "shreya" | "shivam">("current");

  const fetchData = () => {
    try {
      const u = getCurrentUser();
      const p = getProblemsWithStatus();
      setCurrentUser(u);
      setProblems(p);
    } catch (e) {
      console.error("Failed to load revision data:", e);
    }
  };

  useEffect(() => {
    fetchData();

    if (typeof window !== "undefined") {
      window.addEventListener("dsa_store_changed", fetchData);
      window.addEventListener("storage", fetchData);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("dsa_store_changed", fetchData);
        window.removeEventListener("storage", fetchData);
      }
    };
  }, []);

  const handleReviseAgain = (problemId: string, targetUserId: string) => {
    try {
      incrementRevision(targetUserId, problemId);
      fetchData();
    } catch (e) {
      console.error("Revise again error:", e);
    }
  };

  const isShreya = currentUser?.username === "shreya";

  // Determine which user's solved list we are viewing
  const activeUserId =
    viewUser === "shreya"
      ? "user_shreya"
      : viewUser === "shivam"
      ? "user_shivam"
      : currentUser?.id || "user_shivam";

  const isViewingShreya = activeUserId === "user_shreya";

  // Filter problems done by this user
  const solvedProblems = problems.filter((p) => {
    return isViewingShreya ? p.shreya_status === "done" : p.shivam_status === "done";
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
            <RotateCcw className={`w-6 h-6 ${isShreya ? "text-pink-500" : "text-sky-500"}`} />
            <span>Revision Area (Spaced Repetition)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5 font-medium">
            Jo questions solve ho chuke hain unhe retain karne ke liye regular revision karein.
          </p>
        </div>

        {/* User Filter Tabs */}
        <div
          className={`flex items-center p-1 bg-white rounded-2xl border-2 text-xs shadow-sm ${
            isShreya ? "border-pink-200" : "border-sky-200"
          }`}
        >
          <button
            onClick={() => setViewUser("current")}
            className={`px-3 py-1.5 rounded-xl transition-all font-bold ${
              viewUser === "current"
                ? isShreya
                  ? "bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-sm"
                  : "bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            My Revisions
          </button>
          <button
            onClick={() => setViewUser("shreya")}
            className={`px-3 py-1.5 rounded-xl transition-all font-bold ${
              viewUser === "shreya"
                ? "bg-pink-500 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🌸 Shreya&apos;s Done List
          </button>
          <button
            onClick={() => setViewUser("shivam")}
            className={`px-3 py-1.5 rounded-xl transition-all font-bold ${
              viewUser === "shivam"
                ? "bg-sky-500 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🐻 Shivam&apos;s Done List
          </button>
        </div>
      </div>

      {/* Summary Box */}
      <div
        className={`p-4 rounded-2xl bg-white/95 border-2 flex items-center justify-between shadow-md ${
          isShreya ? "border-pink-200 shadow-pink-100/40" : "border-sky-200 shadow-sky-100/40"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-sm ${
              isShreya
                ? "bg-pink-100 text-pink-600 border border-pink-200"
                : "bg-sky-100 text-sky-600 border border-sky-200"
            }`}
          >
            <Flame className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-slate-800">
              {isViewingShreya ? "🌸 Shreya Gaur" : "🐻 Shivam Sharma"} · Ready for Revision
            </h4>
            <p className="text-[11px] text-slate-600 font-medium">
              Total {solvedProblems.length} completed problems tracked with revision counts and dates.
            </p>
          </div>
        </div>
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full border shadow-sm ${
            isShreya
              ? "bg-pink-100 text-pink-700 border-pink-300"
              : "bg-sky-100 text-sky-700 border-sky-300"
          }`}
        >
          {solvedProblems.length} Solved
        </span>
      </div>

      {/* Revision Table */}
      <div
        className={`rounded-2xl border-2 bg-white overflow-hidden shadow-xl ${
          isShreya ? "border-pink-200 shadow-pink-100/40" : "border-sky-200 shadow-sky-100/40"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead
              className={`border-b-2 text-[11px] font-black uppercase tracking-wider ${
                isShreya
                  ? "bg-pink-100/90 border-pink-200 text-pink-900"
                  : "bg-sky-100/90 border-sky-200 text-sky-900"
              }`}
            >
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4">Problem Name</th>
                <th className="py-3.5 px-4 w-28">Difficulty</th>
                <th className="py-3.5 px-4 w-32">Topic</th>
                <th className="py-3.5 px-4 w-36 text-center">Revision Count</th>
                <th className="py-3.5 px-4 w-44">Last Revised Date</th>
                <th className="py-3.5 px-4 w-36 text-center">Action</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isShreya ? "divide-pink-100/80" : "divide-sky-100/80"}`}>
              {solvedProblems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500 font-medium">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="text-2xl">{isShreya ? "🌸🧸" : "🐻☁️"}</span>
                      <p className="text-xs font-bold text-slate-700">
                        Is profile ke liye abhi koi question solved mark nahi hai.
                      </p>
                      <a
                        href="/dashboard/problems"
                        className={`mt-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-sm transition-all ${
                          isShreya
                            ? "bg-pink-500 hover:bg-pink-400"
                            : "bg-sky-500 hover:bg-sky-400"
                        }`}
                      >
                        Solve Questions Now ✨
                      </a>
                    </div>
                  </td>
                </tr>
              ) : (
                solvedProblems.map((prob, idx) => {
                  const revisionCount = isViewingShreya
                    ? prob.shreya_revision_count || 1
                    : prob.shivam_revision_count || 1;

                  const lastRevised = isViewingShreya
                    ? prob.shreya_last_revised
                    : prob.shivam_last_revised;

                  const diffBadge =
                    prob.difficulty === "Easy"
                      ? "text-emerald-800 bg-emerald-100 border-emerald-300 font-bold"
                      : prob.difficulty === "Hard"
                      ? "text-rose-800 bg-rose-100 border-rose-300 font-bold"
                      : "text-amber-800 bg-amber-100 border-amber-300 font-bold";

                  return (
                    <tr
                      key={prob.id}
                      className={`transition-colors ${
                        isShreya ? "hover:bg-pink-50/50" : "hover:bg-sky-50/50"
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center text-slate-400 font-mono">
                        {idx + 1}
                      </td>

                      <td className="py-3.5 px-4">
                        <a
                          href={prob.leetcode_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`font-bold inline-flex items-center gap-1.5 transition-colors ${
                            isShreya
                              ? "text-slate-800 hover:text-pink-600"
                              : "text-slate-800 hover:text-sky-600"
                          }`}
                        >
                          <span>{prob.title}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${diffBadge}`}>
                          {prob.difficulty}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-semibold">{prob.topic}</td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black border shadow-sm ${
                            isShreya
                              ? "bg-pink-100 text-pink-700 border-pink-200"
                              : "bg-sky-100 text-sky-700 border-sky-200"
                          }`}
                        >
                          <span>{revisionCount}x</span>
                          {revisionCount >= 3 && <Flame className="w-3 h-3 text-amber-500" />}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                        {lastRevised ? new Date(lastRevised).toLocaleDateString() : "Today"}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleReviseAgain(prob.id, activeUserId)}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-[11px] shadow-sm transition-all text-white ${
                            isShreya
                              ? "bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-300 hover:to-rose-300 shadow-pink-200"
                              : "bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 shadow-sky-200"
                          }`}
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Revise again</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
