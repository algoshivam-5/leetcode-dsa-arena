"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, Sparkles, ShieldCheck, Heart } from "lucide-react";
import { loginUser } from "@/lib/frontendStore";
import {
  BunnyCherrySticker,
  IceCreamSticker,
  RibbonBowSticker,
  TeddyBearSticker,
  BlueTeddySticker,
  BunnyUmbrellaSticker,
  HeartCloudSticker,
  FlowerSticker,
} from "@/components/CuteStickers";

export default function LoginPage() {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<"shreya" | "shivam" | null>("shreya");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      setError("Pehle apni profile select kijiye");
      return;
    }
    if (!password) {
      setError("Password enter kijiye");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = loginUser(selectedUser, password);

      if (!result.success) {
        setError(result.error || "Login fail ho gaya");
        setIsLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError("Error. Kripya punah prayas karein.");
      setIsLoading(false);
    }
  };

  const isShreyaSelected = selectedUser === "shreya";
  const isShivamSelected = selectedUser === "shivam";

  return (
    <div
      className={`min-h-screen flex flex-col justify-center items-center px-4 relative overflow-hidden transition-colors duration-500 ${
        isShreyaSelected
          ? "theme-pink-gingham"
          : isShivamSelected
          ? "theme-blue-gingham"
          : "theme-pink-gingham"
      }`}
    >
      {/* Background Ambient Glow Orbs */}
      <div
        className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-500 ${
          isShreyaSelected
            ? "bg-pink-400/20"
            : isShivamSelected
            ? "bg-sky-400/20"
            : "bg-pink-400/10"
        }`}
      />
      <div
        className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-500 ${
          isShreyaSelected
            ? "bg-rose-300/20"
            : isShivamSelected
            ? "bg-blue-400/20"
            : "bg-rose-300/10"
        }`}
      />

      {/* Floating Cute Clouds for Shreya */}
      {isShreyaSelected && (
        <>
          <div className="absolute top-12 left-10 hidden sm:block animate-pulse pointer-events-none">
            <HeartCloudSticker className="w-20 h-16 opacity-85" />
          </div>
          <div className="absolute bottom-12 left-14 hidden sm:block pointer-events-none">
            <IceCreamSticker className="w-16 h-20 -rotate-12" />
          </div>
          <div className="absolute top-16 right-12 hidden sm:block pointer-events-none">
            <BunnyCherrySticker className="w-20 h-20 rotate-6" />
          </div>
        </>
      )}

      {/* Floating Cute Canva Stickers for Shivam (From Template 2) */}
      {isShivamSelected && (
        <>
          <div className="absolute top-12 left-10 hidden sm:block pointer-events-none animate-pulse">
            <TeddyBearSticker className="w-20 h-20 -rotate-12" />
          </div>
          <div className="absolute bottom-12 right-12 hidden sm:block pointer-events-none">
            <BunnyUmbrellaSticker className="w-20 h-20 rotate-6" />
          </div>
          <div className="absolute top-16 right-12 hidden sm:block pointer-events-none">
            <IceCreamSticker className="w-16 h-20 -rotate-6" />
          </div>
          <div className="absolute bottom-12 left-14 hidden sm:block pointer-events-none">
            <FlowerSticker className="w-14 h-14 rotate-12" />
          </div>
        </>
      )}

      {/* Main Container */}
      <div className="w-full max-w-lg z-10">
        {/* App Brand Header */}
        <div className="text-center mb-6">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold mb-3 border shadow-sm transition-all ${
              isShreyaSelected
                ? "bg-pink-100 text-pink-700 border-pink-300"
                : isShivamSelected
                ? "bg-sky-100 text-sky-700 border-sky-300"
                : "bg-pink-100 text-pink-700 border-pink-200"
            }`}
          >
            {isShreyaSelected ? (
              <>
                <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                <span>🌸 Baby Shreya & Shivam Arena 🎀</span>
              </>
            ) : isShivamSelected ? (
              <>
                <span>🐻</span>
                <span>☁️ Cute Shivam & Shreya Arena 🍦</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                <span>Private Study & Battle Arena</span>
              </>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-800 flex items-center justify-center gap-2">
            <span>Shreya & Shivam</span>
            {isShreyaSelected && <span className="text-2xl animate-bounce">🧸</span>}
            {isShivamSelected && <span className="text-2xl animate-bounce">🐻</span>}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 font-medium">
            {isShreyaSelected
              ? "Chhoti Bacchi Shreya ka Cute Baby Pink DSA Room 🌸"
              : "Cute Shivam ka Canva Pastel Sky Blue DSA Room 🐻☁️"}
          </p>
        </div>

        {/* Login Card */}
        <div
          className={`backdrop-blur-xl border-2 rounded-3xl p-6 sm:p-8 shadow-2xl transition-all duration-300 bg-white/95 ${
            isShreyaSelected
              ? "border-pink-200 shadow-pink-200/50"
              : isShivamSelected
              ? "border-sky-200 shadow-sky-200/50"
              : "border-pink-200 shadow-pink-100/50"
          }`}
        >
          <div className="mb-6">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3 text-center">
              Kaun login kar raha hai? Choose Profile:
            </label>

            {/* Profile Selection Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* Shreya Profile Card (Canva Cute Pink Theme) */}
              <button
                type="button"
                onClick={() => {
                  setSelectedUser("shreya");
                  setPassword("");
                  setError("");
                }}
                className={`group relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-300 ${
                  selectedUser === "shreya"
                    ? "border-pink-400 bg-pink-50 text-slate-800 shadow-lg shadow-pink-200/60 scale-[1.03] ring-2 ring-pink-300"
                    : "border-slate-200 bg-white/80 text-slate-600 hover:border-pink-300 hover:bg-pink-50/40"
                }`}
              >
                {/* Cute Bunny Cherry Sticker Badge */}
                <div className="absolute -top-4 -right-3">
                  <BunnyCherrySticker className="w-12 h-12 rotate-12 group-hover:rotate-0 transition-transform" />
                </div>

                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 via-rose-400 to-pink-300 p-0.5 shadow-md shadow-pink-300/40 mb-2">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-pink-600 text-xl font-extrabold shadow-inner">
                    🌸
                  </div>
                </div>

                <div className="flex items-center gap-1 font-extrabold text-sm text-slate-800">
                  <span>Shreya Gaur</span>
                  <RibbonBowSticker className="w-4 h-4 inline-block" />
                </div>
                <span className="text-[11px] text-pink-600 mt-0.5 font-bold">
                  Chhoti Bacchi · DSA Champ 🧸
                </span>
              </button>

              {/* Shivam Profile Card (Canva Cute Blue Theme) */}
              <button
                type="button"
                onClick={() => {
                  setSelectedUser("shivam");
                  setPassword("");
                  setError("");
                }}
                className={`group relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-300 ${
                  selectedUser === "shivam"
                    ? "border-sky-400 bg-sky-50 text-slate-800 shadow-lg shadow-sky-200/60 scale-[1.03] ring-2 ring-sky-300"
                    : "border-slate-200 bg-white/80 text-slate-600 hover:border-sky-300 hover:bg-sky-50/40"
                }`}
              >
                {/* Cute Teddy Bear Sticker Badge from Canva Template */}
                <div className="absolute -top-4 -right-3">
                  <TeddyBearSticker className="w-12 h-12 -rotate-12 group-hover:rotate-0 transition-transform" />
                </div>

                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-sky-400 via-blue-500 to-cyan-400 p-0.5 shadow-md shadow-sky-300/40 mb-2">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-sky-600 text-xl font-extrabold shadow-inner">
                    🐻
                  </div>
                </div>

                <div className="flex items-center gap-1 font-extrabold text-sm text-slate-800">
                  <span>Shivam Sharma</span>
                  <FlowerSticker className="w-3.5 h-3.5 inline-block" />
                </div>
                <span className="text-[11px] text-sky-600 mt-0.5 font-bold">
                  Cute Teddy · DSA Wizard ☁️
                </span>
              </button>
            </div>
          </div>

          {/* Password Form */}
          {selectedUser && (
            <form onSubmit={handleLogin} className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {selectedUser === "shreya"
                    ? "🌸 Shreya ka Secret PIN enter kijiye (Hint: 3005)"
                    : "🐻 Cute Shivam ka Secret PIN enter kijiye (Hint: 1504)"}
                </label>
                <div className="relative">
                  <div
                    className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                      isShreyaSelected ? "text-pink-500" : "text-sky-500"
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    autoFocus
                    placeholder="Enter PIN..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 bg-white border-2 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none text-sm font-semibold transition-all ${
                      isShreyaSelected
                        ? "border-pink-200 focus:ring-2 focus:ring-pink-300 focus:border-pink-400"
                        : "border-sky-200 focus:ring-2 focus:ring-sky-300 focus:border-sky-400"
                    }`}
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-bold text-sm transition-all duration-200 shadow-md disabled:opacity-50 ${
                  isShreyaSelected
                    ? "bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 hover:from-pink-300 hover:to-rose-400 shadow-pink-200"
                    : "bg-gradient-to-r from-sky-400 via-blue-500 to-sky-500 hover:from-sky-300 hover:to-blue-400 shadow-sky-200"
                }`}
              >
                {isLoading ? (
                  <span>Logging in...</span>
                ) : (
                  <>
                    <span>
                      {isShreyaSelected
                        ? "🌸 Enter Baby Shreya Arena 🎀"
                        : "🐻 Enter Cute Shivam Arena ☁️"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Secure Badge */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-1.5 text-slate-400 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>100% Client-Side Pure Storage · Instant Access</span>
          </div>
        </div>
      </div>
    </div>
  );
}
