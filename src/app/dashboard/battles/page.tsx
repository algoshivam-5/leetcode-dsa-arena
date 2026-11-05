"use client";

import { useState, useEffect } from "react";
import { Swords, Plus, Calendar, Clock, Trophy, ExternalLink, Check, AlertCircle, Sparkles } from "lucide-react";
import { Battle, Problem } from "@/types";
import { getBattles, createBattle, recordBattleWinner, getProblemsWithStatus } from "@/lib/frontendStore";

export default function BattleAreaPage() {
  const [battles, setBattles] = useState<Battle[]>([]);
  const [commonProblems, setCommonProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [duration, setDuration] = useState("45");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Record Winner State
  const [winnerModalBattle, setWinnerModalBattle] = useState<Battle | null>(null);

  const fetchData = () => {
    try {
      const bData = getBattles();
      setBattles(bData);

      const allProbs = getProblemsWithStatus();
      const common = allProbs.filter(
        (p) => p.shreya_status === "done" && p.shivam_status === "done"
      );
      setCommonProblems(common);
      if (common.length > 0 && !selectedProblemId) {
        setSelectedProblemId(common[0].id);
      }
    } catch (e) {
      console.error("Failed to load battle data:", e);
    } finally {
      setLoading(false);
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

  const handleCreateBattle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProblemId || !scheduledDate || !scheduledTime) {
      alert("Please select problem, date and time");
      return;
    }

    setSubmitting(true);
    try {
      const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
      createBattle({
        problem_id: selectedProblemId,
        scheduled_at: scheduledAt,
        duration_minutes: parseInt(duration),
        notes,
      });

      setShowScheduleModal(false);
      setNotes("");
      fetchData();
    } catch (err) {
      console.error("Schedule error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRecordWinner = (battleId: string, winnerId: string, winnerName: string) => {
    try {
      recordBattleWinner(battleId, winnerId, winnerName);
      setWinnerModalBattle(null);
      fetchData();
    } catch (e) {
      console.error("Error setting winner:", e);
    }
  };

  const upcomingBattles = battles.filter((b) => b.status === "scheduled" || b.status === "ongoing");
  const pastBattles = battles.filter((b) => b.status === "completed");

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title & Schedule Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Swords className="w-6 h-6 text-amber-400" />
            <span>1v1 Coding Battle Arena</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Dono ke solved common questions mein head-to-head live code battle schedule karein.
          </p>
        </div>

        <button
          onClick={() => setShowScheduleModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Battle</span>
        </button>
      </div>

      {/* Eligible Common Solved Banner */}
      <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">
            {commonProblems.length}
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Common Solved Questions Available</h4>
            <p className="text-[11px] text-slate-400">
              Sirf wahi questions select ho sakte hain jo Shreya aur Shivam dono ne solve kiye hain.
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          Battle Pool Ready
        </span>
      </div>

      {/* Upcoming Battles Section */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>Upcoming Battles ({upcomingBattles.length})</span>
        </h2>

        {upcomingBattles.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-500 text-xs">
            Koi upcoming battle scheduled nahi hai. Schedule New Battle button par click karke shuru karein!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingBattles.map((b) => (
              <div
                key={b.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/30 shadow-lg relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      Scheduled Match
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {b.duration_minutes} mins
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>{b.problem_title}</span>
                    {b.problem_slug && (
                      <a
                        href={`https://leetcode.com/problems/${b.problem_slug}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-white"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </h3>

                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{new Date(b.scheduled_at).toLocaleString()}</span>
                  </p>

                  {b.notes && (
                    <p className="mt-3 text-xs bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-slate-300 italic">
                      &quot;{b.notes}&quot;
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <a
                    href={`https://leetcode.com/problems/${b.problem_slug || ""}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-400 hover:underline font-medium"
                  >
                    Open LeetCode
                  </a>

                  <button
                    onClick={() => setWinnerModalBattle(b)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition-colors"
                  >
                    Record Winner 🏆
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Battles History Section */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-emerald-400" />
          <span>Completed Battles History ({pastBattles.length})</span>
        </h2>

        {pastBattles.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-500 text-xs">
            Abhi koi completed battle record nahi hai.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pastBattles.map((b) => (
              <div
                key={b.id}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Completed
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(b.scheduled_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white">{b.problem_title}</h3>

                  <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Winner</span>
                      <span className="text-xs font-bold text-amber-300">
                        {b.winner_name || (b.winner_id === "user_shreya" ? "Shreya Gaur" : "Shivam Sharma")}
                      </span>
                    </div>
                  </div>

                  {b.notes && (
                    <p className="mt-2 text-xs text-slate-400 italic">
                      &quot;{b.notes}&quot;
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Schedule Battle Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Swords className="w-5 h-5 text-amber-400" />
              <span>Schedule 1v1 Battle</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Select common solved problem & date for the battle.
            </p>

            <form onSubmit={handleCreateBattle} className="space-y-4">
              {/* Problem Select */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Select Common Solved Problem
                </label>
                {commonProblems.length === 0 ? (
                  <p className="text-xs text-amber-400 p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/30">
                    Abhi koi common solved question nahi hai. Pehle Problem List mein dono ek common problem solve karein.
                  </p>
                ) : (
                  <select
                    value={selectedProblemId}
                    onChange={(e) => setSelectedProblemId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {commonProblems.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.difficulty} · {p.topic})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Time</label>
                  <input
                    type="time"
                    required
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Duration (Minutes)</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="15">15 Minutes (Sprint)</option>
                  <option value="30">30 Minutes</option>
                  <option value="45">45 Minutes (Standard)</option>
                  <option value="60">60 Minutes</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Challenge Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Optimal O(N) time without hints"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || commonProblems.length === 0}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 disabled:opacity-50"
                >
                  {submitting ? "Scheduling..." : "Schedule Battle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Winner Modal */}
      {winnerModalBattle && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Declare Battle Winner</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Match: <strong className="text-white">{winnerModalBattle.problem_title}</strong>. Kaun jeeta yeh battle?
            </p>

            <div className="space-y-2">
              <button
                onClick={() => handleRecordWinner(winnerModalBattle.id, "user_shreya", "Shreya Gaur")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-pink-950/40 hover:bg-pink-900/50 border border-pink-500/40 text-pink-300 font-bold text-xs transition-all"
              >
                <span>Shreya Gaur 👑</span>
                <span>Select</span>
              </button>

              <button
                onClick={() => handleRecordWinner(winnerModalBattle.id, "user_shivam", "Shivam Sharma")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-500/40 text-indigo-300 font-bold text-xs transition-all"
              >
                <span>Shivam Sharma 👑</span>
                <span>Select</span>
              </button>

              <button
                onClick={() => handleRecordWinner(winnerModalBattle.id, "draw", "Draw / Tie")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 font-bold text-xs transition-all"
              >
                <span>Draw / Both Tied 🤝</span>
                <span>Select</span>
              </button>
            </div>

            <button
              onClick={() => setWinnerModalBattle(null)}
              className="mt-4 w-full py-2 text-center text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

