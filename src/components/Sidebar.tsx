"use client";

import { usePathname } from "next/navigation";
import {
  ListChecks,
  RotateCcw,
  Swords,
  Trophy,
  Calendar,
  BookOpen,
  Code2,
  MessageSquare,
  Bot,
  X,
} from "lucide-react";
import { getCurrentUser } from "@/lib/frontendStore";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NAV_ITEMS = [
  { name: "Problem List", href: "/dashboard/problems", icon: ListChecks, badge: "Core" },
  { name: "Revision Area", href: "/dashboard/revision", icon: RotateCcw, badge: null },
  { name: "Battle Area", href: "/dashboard/battles", icon: Swords, badge: "1v1" },
  { name: "Weekly Challenge", href: "/dashboard/weekly-challenge", icon: Trophy, badge: "Coins" },
  { name: "Timetable", href: "/dashboard/timetable", icon: Calendar, badge: null },
  { name: "DS Theory", href: "/dashboard/theory", icon: BookOpen, badge: null },
  { name: "Rough Code", href: "/dashboard/rough-code", icon: Code2, badge: "Editor" },
  { name: "Chat", href: "/dashboard/chat", icon: MessageSquare, badge: "Live" },
  { name: "PDF Chat", href: "/dashboard/pdf-chat", icon: Bot, badge: "AI" },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const currentUser = getCurrentUser();
  const isShreya = currentUser?.username === "shreya";

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className={`fixed inset-0 z-40 backdrop-blur-sm transition-opacity ${
            isShreya ? "bg-pink-950/25" : "bg-sky-950/25"
          }`}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 border-r-2 z-50 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl ${
          isShreya
            ? "bg-white/95 backdrop-blur-xl border-pink-200 text-slate-800 shadow-pink-200/40"
            : "bg-white/95 backdrop-blur-xl border-sky-200 text-slate-800 shadow-sky-200/40"
        } ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Brand Header */}
        <div
          className={`h-16 border-b px-4 flex items-center justify-between ${
            isShreya ? "border-pink-100 bg-pink-50/70" : "border-sky-100 bg-sky-50/70"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md ${
                isShreya
                  ? "bg-gradient-to-tr from-pink-500 to-rose-400 shadow-pink-300/40"
                  : "bg-gradient-to-tr from-sky-400 to-blue-500 shadow-sky-300/40"
              }`}
            >
              {isShreya ? "🌸" : "🐻"}
            </div>
            <div>
              <span className="font-extrabold text-slate-800 text-sm block flex items-center gap-1">
                <span>{isShreya ? "Baby Shreya 🎀" : "Cute Shivam 🐻"}</span>
              </span>
              <span
                className={`text-[10px] block -mt-0.5 font-bold ${
                  isShreya ? "text-pink-600" : "text-sky-600"
                }`}
              >
                {isShreya ? "Chhoti Bacchi Den 🧸" : "Cute Teddy Den ☁️"}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isShreya
                ? "text-pink-600 hover:text-pink-900 hover:bg-pink-100"
                : "text-sky-600 hover:text-sky-900 hover:bg-sky-100"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items List */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <div
            className={`px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider ${
              isShreya ? "text-pink-600" : "text-sky-600"
            }`}
          >
            {isShreya ? "🌸 Baby Modules" : "🐻 Cute Modules ☁️"}
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            const activeClass = isShreya
              ? "bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 text-white shadow-md shadow-pink-200 font-bold"
              : "bg-gradient-to-r from-sky-400 via-blue-500 to-sky-500 text-white shadow-md shadow-sky-200 font-bold";

            const inactiveClass = isShreya
              ? "text-slate-700 hover:bg-pink-50 hover:text-pink-800 font-medium"
              : "text-slate-700 hover:bg-sky-50 hover:text-sky-800 font-medium";

            return (
              <a
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all duration-150 ${
                  isActive ? activeClass : inactiveClass
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? "text-white"
                        : isShreya
                        ? "text-pink-500"
                        : "text-sky-500"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? "bg-white/25 text-white"
                        : isShreya
                        ? "bg-pink-100 text-pink-700 border border-pink-200"
                        : "bg-sky-100 text-sky-700 border border-sky-200"
                    }`}
                  >
                    {isShreya && item.badge === "Core"
                      ? "🎀 Core"
                      : isShreya && item.badge === "1v1"
                      ? "🧸 1v1"
                      : !isShreya && item.badge === "Core"
                      ? "🐻 Core"
                      : !isShreya && item.badge === "1v1"
                      ? "☁️ 1v1"
                      : item.badge}
                  </span>
                )}
              </a>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
