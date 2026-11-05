"use client";

import { useState, useEffect } from "react";
import { Calendar, Plus, Trash2, Clock, Tag, UserCheck, X } from "lucide-react";
import { TimetableSlot, User } from "@/types";
import { getCurrentUser, getTimetable, saveTimetableSlot, deleteTimetableSlot } from "@/lib/frontendStore";

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export default function TimetablePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      return getCurrentUser();
    } catch {
      return null;
    }
  });
  const [selectedUserId, setSelectedUserId] = useState<string>(() => {
    try {
      return getCurrentUser()?.id || "user_shivam";
    } catch {
      return "user_shivam";
    }
  });
  const [slots, setSlots] = useState<TimetableSlot[]>(() => {
    try {
      const uid = getCurrentUser()?.id || "user_shivam";
      return getTimetable(uid);
    } catch {
      return [];
    }
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dayOfWeek, setDayOfWeek] = useState<string>("Monday");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("11:00");
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("DSA");
  const [color, setColor] = useState("indigo");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    function initUser() {
      const u = getCurrentUser();
      setCurrentUser(u);
      setSelectedUserId(u?.id || "user_shivam");
    }
    initUser();
  }, []);

  const fetchTimetable = (userId: string) => {
    try {
      const data = getTimetable(userId);
      setSlots(data);
    } catch (e) {
      console.error("Timetable fetch error:", e);
    }
  };

  useEffect(() => {
    if (selectedUserId) {
      fetchTimetable(selectedUserId);
    }
  }, [selectedUserId]);

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    try {
      saveTimetableSlot({
        user_id: selectedUserId,
        day_of_week: dayOfWeek as any,
        start_time: startTime,
        end_time: endTime,
        title,
        tag,
        color,
      });

      setIsModalOpen(false);
      setTitle("");
      fetchTimetable(selectedUserId);
    } catch (e) {
      console.error("Create slot error:", e);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSlot = (id: string) => {
    if (!confirm("Delete this time slot?")) return;
    try {
      deleteTimetableSlot(id);
      fetchTimetable(selectedUserId);
    } catch (e) {
      console.error("Delete slot error:", e);
    }
  };

  const isOwnTimetable = currentUser?.id === selectedUserId;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-400" />
            <span>Weekly Study Timetable</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Weekly slots organize karein aur ek dusre ka schedule track karein.
          </p>
        </div>

        {/* User Switcher Tabs */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedUserId("user_shreya")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors font-medium ${
                selectedUserId === "user_shreya"
                  ? "bg-pink-600 text-white font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>Shreya&apos;s Timetable</span>
            </button>
            <button
              onClick={() => setSelectedUserId("user_shivam")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors font-medium ${
                selectedUserId === "user_shivam"
                  ? "bg-indigo-600 text-white font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>Shivam&apos;s Timetable</span>
            </button>
          </div>

          {isOwnTimetable && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Slot</span>
            </button>
          )}
        </div>
      </div>

      {/* Viewing Profile Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-xs ${
              selectedUserId === "user_shreya"
                ? "bg-gradient-to-tr from-pink-600 to-rose-400"
                : "bg-gradient-to-tr from-indigo-600 to-blue-500"
            }`}
          >
            {selectedUserId === "user_shreya" ? "SG" : "SS"}
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">
              Currently Viewing: {selectedUserId === "user_shreya" ? "Shreya Gaur" : "Shivam Sharma"}
            </h3>
            <span className="text-[11px] text-slate-400">
              {isOwnTimetable ? "Aapka apna schedule (editable)" : "Shared view (read only)"}
            </span>
          </div>
        </div>

        <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-mono">
          {slots.length} time slots set
        </span>
      </div>

      {/* Weekly View Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
        {DAYS_OF_WEEK.map((day) => {
          const daySlots = slots
            .filter((s) => s.day_of_week === day)
            .sort((a, b) => a.start_time.localeCompare(b.start_time));

          return (
            <div
              key={day}
              className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between min-h-[220px]"
            >
              <div>
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-white">{day}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{daySlots.length}</span>
                </div>

                <div className="space-y-2">
                  {daySlots.length === 0 ? (
                    <div className="py-8 text-center text-[11px] text-slate-600 italic">
                      No slots
                    </div>
                  ) : (
                    daySlots.map((slot) => (
                      <div
                        key={slot.id}
                        className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-colors group relative"
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                          <span className="text-indigo-400 font-semibold">
                            {slot.start_time} - {slot.end_time}
                          </span>
                          {isOwnTimetable && (
                            <button
                              onClick={() => handleDeleteSlot(slot.id)}
                              className="text-slate-600 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-white leading-snug">
                          {slot.title}
                        </h4>
                        <span className="inline-block mt-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                          {slot.tag}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {isOwnTimetable && (
                <button
                  onClick={() => {
                    setDayOfWeek(day);
                    setIsModalOpen(true);
                  }}
                  className="mt-3 w-full py-1.5 rounded-lg border border-dashed border-slate-800 hover:border-slate-700 text-slate-500 hover:text-slate-300 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Slot Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>Add Timetable Slot</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSlot} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Day of Week</label>
                <select
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {DAYS_OF_WEEK.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Subject / Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Graph BFS/DFS + Topo Sort Practice"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Tag / Category</label>
                <select
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="DSA">DSA</option>
                  <option value="Revision">Revision</option>
                  <option value="Contest">Contest</option>
                  <option value="College">College / Academics</option>
                  <option value="Break">Break</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Add to Timetable"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

