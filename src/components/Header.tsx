"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, LogOut, User as UserIcon, Coins, ShieldCheck, ChevronDown, ExternalLink } from "lucide-react";
import { User } from "@/types";
import { logoutUser } from "@/lib/frontendStore";

interface HeaderProps {
  user: User | null;
  onToggleSidebar: () => void;
}

export default function Header({ user, onToggleSidebar }: HeaderProps) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logoutUser();
    router.push("/login");
  };

  const isShreya = user?.username === "shreya";

  return (
    <header
      className={`h-16 border-b sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between backdrop-blur-md transition-colors ${
        isShreya
          ? "border-pink-200 bg-white/85 shadow-sm shadow-pink-100/50"
          : "border-sky-200 bg-white/85 shadow-sm shadow-sky-100/50"
      }`}
    >
      {/* Left: Hamburger Menu and Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
          className={`p-2 rounded-xl transition-colors ${
            isShreya
              ? "text-pink-600 hover:text-pink-900 hover:bg-pink-100/70"
              : "text-sky-600 hover:text-sky-900 hover:bg-sky-100/70"
          }`}
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-slate-800 text-base tracking-tight hidden sm:inline flex items-center gap-1.5">
            {isShreya ? "🌸 Meadowbell" : "☁️ Meadowbell"}
          </span>
          <span className={isShreya ? "text-pink-300 hidden sm:inline" : "text-sky-300 hidden sm:inline"}>/</span>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1 shadow-sm ${
              isShreya
                ? "bg-pink-100/90 text-pink-700 border-pink-200"
                : "bg-sky-100/90 text-sky-700 border-sky-200"
            }`}
          >
            <span>{isShreya ? "🎀 Baby Shreya's Arena" : "🐻 Cute Shivam's Arena ☁️"}</span>
          </span>
        </div>
      </div>

      {/* Right: User Profile Dropdown */}
      <div className="flex items-center gap-3">
        {/* LeetCode Profile Link Pill */}
        {user?.leetcode_username && (
          <a
            href={`https://leetcode.com/${user.leetcode_username}/`}
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all shadow-sm ${
              isShreya
                ? "bg-pink-50 hover:bg-pink-100 border-pink-200 text-pink-700"
                : "bg-sky-50 hover:bg-sky-100 border-sky-200 text-sky-700"
            }`}
          >
            <span className={isShreya ? "text-pink-600 font-bold" : "text-sky-600 font-bold"}>
              {isShreya ? "🍓 LC" : "🍦 LC"}
            </span>
            <span>{user.leetcode_username}</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        )}

        {/* Profile Avatar & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`flex items-center gap-2 p-1.5 pr-2.5 rounded-2xl transition-all border ${
              isShreya
                ? "bg-white hover:bg-pink-50 border-pink-200 shadow-sm shadow-pink-100/40 text-slate-800"
                : "bg-white hover:bg-sky-50 border-sky-200 shadow-sm shadow-sky-100/40 text-slate-800"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md ${
                isShreya
                  ? "bg-gradient-to-tr from-pink-500 via-rose-400 to-pink-300 shadow-pink-300/40"
                  : "bg-gradient-to-tr from-sky-500 via-blue-500 to-cyan-300 shadow-sky-300/40"
              }`}
            >
              {isShreya ? "🌸" : "🐻"}
            </div>
            <span className="text-sm font-bold text-slate-800 hidden sm:inline flex items-center gap-1">
              <span>{user?.name || (isShreya ? "Shreya Gaur" : "Shivam Sharma")}</span>
              <span>{isShreya ? "🧸" : "☁️"}</span>
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div
              className={`absolute right-0 mt-2 w-56 rounded-2xl border-2 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 ${
                isShreya
                  ? "bg-white border-pink-200 shadow-pink-200/40"
                  : "bg-white border-sky-200 shadow-sky-200/40"
              }`}
            >
              <div
                className={`px-3 py-2.5 border-b rounded-xl mb-1.5 ${
                  isShreya
                    ? "border-pink-100 bg-pink-50/80"
                    : "border-sky-100 bg-sky-50/80"
                }`}
              >
                <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span>{user?.name}</span>
                  <span>{isShreya ? "🎀" : "🐻"}</span>
                </p>
                <p className="text-[11px] text-slate-500">@{user?.username}</p>
                <div
                  className={`mt-1 flex items-center gap-1 text-[11px] font-bold ${
                    isShreya ? "text-pink-600" : "text-sky-600"
                  }`}
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>{isShreya ? "Chhoti Bacchi Mode 🌸" : "Cute Shivam Mode 🐻☁️"}</span>
                </div>
              </div>

              <div className="py-1">
                <a
                  href={`https://leetcode.com/${user?.leetcode_username || ""}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl transition-colors ${
                    isShreya
                      ? "text-slate-700 hover:bg-pink-50 hover:text-pink-800"
                      : "text-slate-700 hover:bg-sky-50 hover:text-sky-800"
                  }`}
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  <span>Open LeetCode Profile</span>
                </a>
              </div>

              <div
                className={`pt-1 border-t ${
                  isShreya ? "border-pink-100" : "border-sky-100"
                }`}
              >
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors font-bold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
