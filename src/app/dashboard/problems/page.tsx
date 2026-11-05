"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ExternalLink,
  Upload,
  Search,
  Check,
  CheckCircle2,
  X,
  AlertCircle,
  FileText,
  Sparkles,
  Layers,
  FileCheck,
  ChevronDown,
  RotateCcw,
  BookOpen,
  MessageSquare,
  Swords,
  Code2,
  Trash2,
  Bot,
  Lightbulb,
  Cpu,
  ShieldAlert,
  Send,
} from "lucide-react";
import { Problem, ProblemStatus, User } from "@/types";
import {
  getProblemsWithStatus,
  getCurrentUser,
  toggleProblemStatus,
  incrementRevision,
  saveProblemNote,
  deleteProblem,
} from "@/lib/frontendStore";
import { askAiMentorClient, extractProblemsFromPdfClient } from "@/lib/geminiClient";
import {
  BunnyCherrySticker,
  IceCreamSticker,
  TeddyBearSticker,
  HeartCloudSticker,
  RibbonBowSticker,
  BlueTeddySticker,
  FlowerSticker,
  BunnyUmbrellaSticker,
} from "@/components/CuteStickers";

export default function ProblemsPage() {
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

  // Filters
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeSheetTab, setActiveSheetTab] = useState<string>("all");

  // Status Dropdown open state: problemId + user (e.g. "p-1_my" or "p-1_partner")
  const [openStatusDropdown, setOpenStatusDropdown] = useState<string | null>(null);

  // Notes Modal State
  const [noteModalProblem, setNoteModalProblem] = useState<Problem | null>(null);
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  // AI Mentor Modal State
  const [aiMentorProblem, setAiMentorProblem] = useState<Problem | null>(null);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [customAiQuery, setCustomAiQuery] = useState("");

  // PDF Sheet Auto-Generator Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [destination, setDestination] = useState<"new_sheet" | "current_sheet">("new_sheet");
  const [sheetName, setSheetName] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = (_isBackground = false) => {
    try {
      const u = getCurrentUser();
      const p = getProblemsWithStatus();
      setCurrentUser(u);
      setProblems(p);
    } catch (err) {
      console.error("Failed to load problems:", err);
    }
  };

  useEffect(() => {
    fetchData();

    // Auto-sync listeners for multi-tab / realtime collaboration
    const handlePartnerSolved = () => {
      fetchData();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("partner_solved_problem", handlePartnerSolved);
      window.addEventListener("dsa_store_changed", handlePartnerSolved);
      window.addEventListener("storage", handlePartnerSolved);
    }

    const interval = setInterval(() => {
      fetchData(true);
    }, 2500);

    return () => {
      clearInterval(interval);
      if (typeof window !== "undefined") {
        window.removeEventListener("partner_solved_problem", handlePartnerSolved);
        window.removeEventListener("dsa_store_changed", handlePartnerSolved);
        window.removeEventListener("storage", handlePartnerSolved);
      }
    };
  }, []);

  // Update Problem Status
  const handleUpdateStatus = (problemId: string, targetUserId: string, newStatus: ProblemStatus) => {
    setOpenStatusDropdown(null);
    try {
      toggleProblemStatus(targetUserId, problemId, newStatus);
      fetchData(true);
    } catch (e) {
      console.error("Update status error:", e);
    }
  };

  // Quick Revise Increment
  const handleQuickRevise = (problemId: string, targetUserId: string) => {
    try {
      incrementRevision(targetUserId, problemId);
      fetchData(true);
    } catch (e) {
      console.error("Revise error:", e);
    }
  };

  // Delete Problem
  const handleDeleteProblem = (problemId: string) => {
    if (!confirm("Are you sure you want to delete this problem from the list?")) return;
    try {
      deleteProblem(problemId);
      fetchData(true);
    } catch (e) {
      console.error("Delete error:", e);
    }
  };

  // Save Problem Note
  const handleSaveNote = () => {
    if (!noteModalProblem) return;
    setSavingNote(true);
    try {
      saveProblemNote(noteModalProblem.id, noteText);
      setNoteModalProblem(null);
      fetchData(true);
    } catch (e) {
      console.error("Note save error:", e);
    } finally {
      setSavingNote(false);
    }
  };

  // Ask AI Mentor (Direct Browser Call)
  const handleAskAi = async (questionType: string, customText?: string) => {
    if (!aiMentorProblem) return;
    setAiLoading(true);
    setAiResponse(null);

    try {
      const answer = await askAiMentorClient(
        aiMentorProblem.title,
        aiMentorProblem.difficulty,
        aiMentorProblem.topic,
        questionType,
        customText || customAiQuery
      );
      setAiResponse(answer);
    } catch (e) {
      setAiResponse("Failed to connect to AI Mentor. Please check internet connection.");
    } finally {
      setAiLoading(false);
    }
  };

  // PDF Upload & Extraction (Direct Browser Call)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setModalError(null);

    const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]+/g, " ");
    const formatted = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    setSheetName(formatted);
  };

  const handleExtractFromPdf = async () => {
    if (!selectedFile) {
      setModalError("Kripya pehle PDF file select karein.");
      return;
    }

    setIsExtracting(true);
    setModalError(null);

    try {
      const finalSheet = destination === "current_sheet" ? "Curated Top DSA 75" : sheetName;
      const res = await extractProblemsFromPdfClient(selectedFile, finalSheet, destination);

      setSuccessBanner(res.message);
      setIsUploadModalOpen(false);
      setSelectedFile(null);
      if (destination === "new_sheet" && sheetName) {
        setActiveSheetTab(sheetName);
      }
      fetchData();
    } catch (err: any) {
      setModalError("Extraction error: " + err.message);
    } finally {
      setIsExtracting(false);
    }
  };

  // Current User details
  const isShivam = currentUser?.id !== "user_shreya";
  const myUserId = isShivam ? "user_shivam" : "user_shreya";
  const partnerUserId = isShivam ? "user_shreya" : "user_shivam";
  const partnerName = isShivam ? "Shreya" : "Shivam";

  // Categories & Sheets
  const categoriesList = ["All Categories", ...Array.from(new Set(problems.map((p) => p.topic).filter(Boolean)))];
  const allSheets = Array.from(new Set(problems.map((p) => p.sheet_name || "Curated Top DSA 75")));

  // Calculate Stats
  const totalCount = problems.length;
  const bothDoneCount = problems.filter((p) => p.shivam_status === "done" && p.shreya_status === "done").length;
  const myDoneCount = problems.filter((p) => (isShivam ? p.shivam_status === "done" : p.shreya_status === "done")).length;
  const partnerDoneCount = problems.filter((p) => (isShivam ? p.shreya_status === "done" : p.shivam_status === "done")).length;

  const easySolved = problems.filter((p) => p.difficulty === "Easy" && (isShivam ? p.shivam_status === "done" : p.shreya_status === "done")).length;
  const mediumSolved = problems.filter((p) => p.difficulty === "Medium" && (isShivam ? p.shivam_status === "done" : p.shreya_status === "done")).length;
  const hardSolved = problems.filter((p) => p.difficulty === "Hard" && (isShivam ? p.shivam_status === "done" : p.shreya_status === "done")).length;

  const reviseCount = problems.filter((p) => (isShivam ? p.shivam_status === "revise" : p.shreya_status === "revise")).length;
  const todoCount = problems.filter((p) => (isShivam ? p.shivam_status === "todo" || !p.shivam_status : p.shreya_status === "todo" || !p.shreya_status)).length;
  const donePercent = totalCount > 0 ? Math.round((myDoneCount / totalCount) * 100) : 0;

  // Filter problems
  const filteredProblems = problems.filter((p) => {
    const currentSheet = p.sheet_name || "Curated Top DSA 75";
    const matchesSheet = activeSheetTab === "all" || currentSheet === activeSheetTab;

    const titleLower = (p.title || "").toLowerCase();
    const topicLower = (p.topic || "").toLowerCase();
    const notesLower = (p.notes || "").toLowerCase();
    const searchLower = search.toLowerCase().trim();

    const matchesSearch =
      !searchLower ||
      titleLower.includes(searchLower) ||
      topicLower.includes(searchLower) ||
      notesLower.includes(searchLower);

    const matchesCategory = selectedCategory === "All Categories" || (p.topic || "") === selectedCategory;

    const matchesDifficulty =
      difficultyFilter === "all" || (p.difficulty || "Medium").toLowerCase() === difficultyFilter.toLowerCase();

    const myStatus = (isShivam ? p.shivam_status : p.shreya_status) || "todo";
    let matchesStatus = true;
    if (statusFilter === "solved") matchesStatus = myStatus === "done";
    else if (statusFilter === "in_progress") matchesStatus = myStatus === "trying";
    else if (statusFilter === "revision") matchesStatus = myStatus === "revise";
    else if (statusFilter === "todo") matchesStatus = myStatus === "todo" || myStatus === "no_answer";

    return matchesSheet && matchesSearch && matchesCategory && matchesDifficulty && matchesStatus;
  }).sort((a, b) => (a.order_index ?? 9999) - (b.order_index ?? 9999));

  // Helper for Status Badge Component
  const isShreyaUser = currentUser?.username === "shreya";

  const renderStatusBadge = (status: ProblemStatus | undefined, isPartner: boolean, probId: string) => {
    const s = status || "todo";
    const dropdownKey = `${probId}_my`;
    const isOpen = openStatusDropdown === dropdownKey;

    // Check if the badge being rendered belongs to Shreya
    const isThisShreyaBadge = isPartner ? !isShreyaUser : isShreyaUser;

    let bgStyle = "bg-slate-100 text-slate-700 border-slate-200";
    let dotColor = "bg-slate-400";
    let label = "Todo";

    if (s === "done") {
      if (isThisShreyaBadge) {
        bgStyle = "bg-pink-100 text-pink-700 border-pink-300 shadow-sm shadow-pink-100 font-bold";
        dotColor = "bg-pink-500";
        label = "Done 🌸";
      } else {
        bgStyle = "bg-sky-100 text-sky-700 border-sky-300 shadow-sm shadow-sky-100 font-bold";
        dotColor = "bg-sky-500";
        label = "Done ☁️";
      }
    } else if (s === "trying") {
      bgStyle = "bg-amber-100 text-amber-800 border-amber-300 font-semibold";
      dotColor = "bg-amber-500";
      label = "Trying";
    } else if (s === "revise") {
      bgStyle = "bg-purple-100 text-purple-800 border-purple-300 font-semibold";
      dotColor = "bg-purple-500";
      label = "Revise";
    }

    // STRICTLY READ-ONLY FOR PARTNER: Shreya cannot change Shivam's status, and Shivam cannot change Shreya's!
    if (isPartner) {
      return (
        <div
          title={`${partnerName}'s status (Sirf ${partnerName} hi ise update kar sakte hain)`}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-sm cursor-default select-none ${bgStyle}`}
        >
          <span className={`w-2 h-2 rounded-full ${dotColor}`} />
          <span>{label}</span>
        </div>
      );
    }

    // MY OWN STATUS (Dropdown Allowed)
    return (
      <div className="relative inline-block text-left">
        <button
          onClick={() => setOpenStatusDropdown(isOpen ? null : dropdownKey)}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all shadow-sm ${bgStyle} ${
            isThisShreyaBadge ? "hover:bg-pink-200/60" : "hover:bg-sky-200/60"
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${dotColor}`} />
          <span>{label}</span>
          <ChevronDown className="w-3 h-3 opacity-60" />
        </button>

        {/* Dropdown Menu for MY STATUS only */}
        {isOpen && (
          <div
            className={`absolute left-0 mt-1.5 w-36 rounded-2xl border-2 shadow-2xl p-1 z-30 animate-in fade-in zoom-in-95 ${
              isThisShreyaBadge ? "bg-white border-pink-200 shadow-pink-200/40" : "bg-white border-sky-200 shadow-sky-200/40"
            }`}
          >
            <button
              onClick={() => handleUpdateStatus(probId, myUserId, "done")}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-xl font-bold transition-colors ${
                isThisShreyaBadge
                  ? "text-pink-700 hover:bg-pink-50"
                  : "text-sky-700 hover:bg-sky-50"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isThisShreyaBadge ? "bg-pink-500" : "bg-sky-500"}`} />
              <span>{isThisShreyaBadge ? "Done 🌸" : "Done ☁️"}</span>
            </button>
            <button
              onClick={() => handleUpdateStatus(probId, myUserId, "trying")}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-amber-800 hover:bg-amber-50 rounded-xl font-semibold"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Trying</span>
            </button>
            <button
              onClick={() => handleUpdateStatus(probId, myUserId, "revise")}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-purple-800 hover:bg-purple-50 rounded-xl font-semibold"
            >
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span>Revise</span>
            </button>
            <button
              onClick={() => handleUpdateStatus(probId, myUserId, "todo")}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-xl font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span>Todo</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200">
      {/* Top Navigation Bar from Screenshot */}
      <div
        className={`relative rounded-3xl border-2 p-3 sm:p-4 shadow-md flex flex-wrap items-center justify-between gap-3 transition-colors ${
          isShreyaUser
            ? "bg-white/95 border-pink-200 shadow-pink-100/50"
            : "bg-white/95 border-sky-200 shadow-sky-100/50"
        }`}
      >
        {/* Brand Left */}
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white font-mono font-bold text-sm shadow-md ${
              isShreyaUser
                ? "bg-gradient-to-tr from-pink-500 to-rose-400 shadow-pink-300/40"
                : "bg-gradient-to-tr from-sky-400 via-blue-500 to-cyan-300 shadow-sky-300/40"
            }`}
          >
            {isShreyaUser ? "🌸" : "🐻"}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-800 text-base tracking-tight">
                {isShreyaUser ? "LeetTracker 🎀" : "LeetTracker 🐻"}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  isShreyaUser
                    ? "bg-pink-100 text-pink-700 border-pink-200"
                    : "bg-sky-100 text-sky-700 border-sky-200"
                }`}
              >
                {isShreyaUser ? "🌸 DUO AI" : "☁️ DUO AI"}
              </span>
            </div>
            <span className={`text-[11px] block -mt-0.5 font-medium ${isShreyaUser ? "text-pink-600" : "text-sky-600"}`}>
              {isShreyaUser ? "Baby Shreya & Shivam's Private DSA Tracker 🧸" : "Cute Shivam & Shreya's Private DSA Tracker ☁️"}
            </span>
          </div>
        </div>

        {/* Quick Nav Pills + Mascot Sticker */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Link
            href="/dashboard/theory"
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold border border-slate-200 transition-colors shadow-sm"
          >
            Home / Theory
          </Link>
          <span
            className={`px-3 py-1.5 rounded-xl font-bold border flex items-center gap-1 shadow-sm ${
              isShreyaUser
                ? "bg-pink-100 text-pink-700 border-pink-300"
                : "bg-sky-100 text-sky-700 border-sky-300"
            }`}
          >
            {isShreyaUser ? (
              <RibbonBowSticker className="w-3.5 h-3.5" />
            ) : (
              <FlowerSticker className="w-3.5 h-3.5" />
            )}
            <span>DSA Tracker {isShreyaUser ? "🌸" : "☁️"}</span>
          </span>
          <Link
            href="/dashboard/revision"
            className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold border border-purple-200 transition-colors shadow-sm"
          >
            Revise Arena
          </Link>
          <Link
            href="/dashboard/battles"
            className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold border border-amber-200 transition-colors shadow-sm"
          >
            1v1 Battle
          </Link>
          <Link
            href="/dashboard/rough-code"
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold border border-slate-200 transition-colors shadow-sm"
          >
            Tuition Code
          </Link>
          <Link
            href="/dashboard/chat"
            className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold border border-sky-200 transition-colors shadow-sm"
          >
            Call / Chat
          </Link>

          {/* Upload PDF Pill */}
          <button
            onClick={() => {
              setIsUploadModalOpen(true);
              setModalError(null);
            }}
            className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shadow-md transition-all ${
              isShreyaUser
                ? "bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 hover:from-pink-300 hover:to-rose-400 text-white shadow-pink-200"
                : "bg-gradient-to-r from-sky-400 via-blue-500 to-sky-500 hover:from-sky-300 hover:to-blue-400 text-white shadow-sky-200"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{isShreyaUser ? "🌸 Upload PDF" : "☁️ Upload PDF 🐻"}</span>
          </button>

          {/* Canva Mascot Sticker in Header */}
          {isShreyaUser ? (
            <div className="hidden sm:inline-block ml-1">
              <BunnyCherrySticker className="w-10 h-10 rotate-6" />
            </div>
          ) : (
            <div className="hidden sm:inline-block ml-1">
              <TeddyBearSticker className="w-10 h-10 -rotate-6" />
            </div>
          )}
        </div>
      </div>

      {/* Progress & Stats Row (Matching Screenshot) */}
      <div
        className={`relative rounded-3xl border-2 p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md transition-colors ${
          isShreyaUser
            ? "bg-white/95 border-pink-200 shadow-pink-100/50"
            : "bg-white/95 border-sky-200 shadow-sky-100/50"
        }`}
      >
        {/* Left: Overall Solved Percentage */}
        <div className="flex items-center gap-4">
          <div
            className={`w-16 h-16 rounded-full border-4 bg-white flex flex-col items-center justify-center text-center shadow-md ${
              isShreyaUser ? "border-pink-400 text-pink-700" : "border-sky-400 text-sky-700"
            }`}
          >
            <span className="text-base font-extrabold text-slate-800">{donePercent}%</span>
            <span
              className={`text-[9px] font-bold -mt-0.5 ${
                isShreyaUser ? "text-pink-600" : "text-sky-600"
              }`}
            >
              {isShreyaUser ? "DONE 🌸" : "DONE ☁️"}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-800">
                {myDoneCount} / {totalCount} solved
              </span>
              <span className="text-[11px] text-slate-500">
                (Both done: <strong className={isShreyaUser ? "text-pink-600 font-extrabold" : "text-sky-600 font-extrabold"}>{bothDoneCount}</strong>)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
              <span>
                {isShreyaUser
                  ? "Shreya champ ka target: Har sheet mein 100% solve karna! 🧸"
                  : "Cute Shivam ka target: Har sheet mein 100% solve karna! 🐻☁️"}
              </span>
            </p>
          </div>
        </div>

        {/* Canva Sticker Mascot Card */}
        {isShreyaUser ? (
          <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-pink-50 border border-pink-200 shadow-sm">
            <IceCreamSticker className="w-8 h-10 -rotate-6" />
            <div className="text-[11px]">
              <span className="font-bold block text-pink-900">Baby Shreya 🍦</span>
              <span className="text-pink-600 text-[10px] font-medium">Strawberry Sweet DSA</span>
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-sky-50 border border-sky-200 shadow-sm">
            <TeddyBearSticker className="w-8 h-8 -rotate-6" />
            <div className="text-[11px]">
              <span className="font-bold block text-sky-900">Cute Shivam 🐻</span>
              <span className="text-sky-600 text-[10px] font-medium">Canva Pastel Blue DSA ☁️</span>
            </div>
          </div>
        )}

        {/* Center: Difficulty Breakdown Bars */}
        <div className="flex-1 max-w-md w-full space-y-1.5 text-xs">
          <div className="flex items-center justify-between font-semibold text-slate-600 text-[11px]">
            <span>Difficulty Breakdown</span>
            <span>Easy: {easySolved} · Med: {mediumSolved} · Hard: {hardSolved}</span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex gap-0.5 p-0.5 border border-slate-200">
            <div
              style={{ width: `${totalCount ? (easySolved / totalCount) * 100 : 0}%` }}
              className="bg-emerald-500 rounded-full"
              title={`Easy: ${easySolved}`}
            />
            <div
              style={{ width: `${totalCount ? (mediumSolved / totalCount) * 100 : 0}%` }}
              className="bg-amber-500 rounded-full"
              title={`Medium: ${mediumSolved}`}
            />
            <div
              style={{ width: `${totalCount ? (hardSolved / totalCount) * 100 : 0}%` }}
              className="bg-rose-500 rounded-full"
              title={`Hard: ${hardSolved}`}
            />
          </div>
        </div>

        {/* Right: Quick Counters */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{reviseCount} Revise</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
            <span>{todoCount} Todo</span>
          </div>
        </div>
      </div>

      {/* Sheets Tabs */}
      <div className={`flex items-center gap-2 overflow-x-auto pb-1 border-b ${isShreyaUser ? "border-pink-200" : "border-sky-200"}`}>
        <button
          onClick={() => setActiveSheetTab("all")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 shadow-sm ${
            activeSheetTab === "all"
              ? isShreyaUser
                ? "bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-pink-200"
                : "bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-sky-200"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All Sheets ({problems.length})</span>
        </button>

        {allSheets.map((sheet) => {
          const sheetCount = problems.filter((p) => (p.sheet_name || "Curated Top DSA 75") === sheet).length;
          const isActive = activeSheetTab === sheet;

          return (
            <button
              key={sheet}
              onClick={() => setActiveSheetTab(sheet)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 shadow-sm ${
                isActive
                  ? isShreyaUser
                    ? "bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-pink-200"
                    : "bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-sky-200"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>{sheet}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? "bg-white/30 text-white font-black"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {sheetCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar (From Screenshot) */}
      <div
        className={`p-4 rounded-2xl border-2 space-y-3 shadow-sm ${
          isShreyaUser
            ? "bg-white/95 border-pink-200"
            : "bg-white/95 border-sky-200"
        }`}
      >
        {/* Top: Search and Category */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search problems, topics, notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                isShreyaUser
                  ? "border-pink-200 focus:ring-pink-300 focus:border-pink-400"
                  : "border-sky-200 focus:ring-sky-300 focus:border-sky-400"
              }`}
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`w-full sm:w-56 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 ${
              isShreyaUser
                ? "border-pink-200 focus:ring-pink-300 focus:border-pink-400"
                : "border-sky-200 focus:ring-sky-300 focus:border-sky-400"
            }`}
          >
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Bottom: Difficulty and Status Filter Pills */}
        <div className={`flex flex-wrap items-center justify-between gap-3 pt-2 border-t text-xs ${isShreyaUser ? "border-pink-100" : "border-sky-100"}`}>
          {/* Difficulty */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-semibold mr-1">Difficulty:</span>
            {["all", "Easy", "Medium", "Hard"].map((d) => (
              <button
                key={d}
                onClick={() => setDifficultyFilter(d)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  difficultyFilter.toLowerCase() === d.toLowerCase()
                    ? isShreyaUser
                      ? "bg-pink-500 text-white font-bold shadow-sm"
                      : "bg-sky-500 text-white font-bold shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>

          {/* Status */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-semibold mr-1">Status:</span>
            {[
              { id: "all", label: "All" },
              { id: "solved", label: "Solved" },
              { id: "in_progress", label: "In Progress" },
              { id: "revision", label: "Revision" },
              { id: "todo", label: "Todo" },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setStatusFilter(s.id)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  statusFilter === s.id
                    ? isShreyaUser
                      ? "bg-pink-500 text-white font-bold shadow-sm"
                      : "bg-sky-500 text-white font-bold shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Problems Table (Exact columns matching screenshot) */}
      <div
        className={`rounded-2xl border-2 overflow-hidden shadow-xl transition-all ${
          isShreyaUser
            ? "border-pink-200 shadow-pink-100/50 bg-white"
            : "border-sky-200 shadow-sky-100/50 bg-white"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead
              className={`border-b-2 text-[11px] font-black uppercase tracking-wider ${
                isShreyaUser
                  ? "bg-pink-100/90 border-pink-200 text-pink-900"
                  : "bg-sky-100/90 border-sky-200 text-sky-900"
              }`}
            >
              <tr>
                <th className="py-3.5 px-4 w-32">MY STATUS</th>
                <th className="py-3.5 px-4 w-32">{partnerName.toUpperCase()}&apos;S STATUS</th>
                <th className="py-3.5 px-4">PROBLEM NAME</th>
                <th className="py-3.5 px-4 w-28">DIFFICULTY</th>
                <th className="py-3.5 px-4 w-36">CATEGORY</th>
                <th className="py-3.5 px-4 w-28 text-center">NOTES</th>
                <th className="py-3.5 px-4 w-32 text-center">AI MENTOR</th>
                <th className="py-3.5 px-4 w-12 text-center"></th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isShreyaUser ? "divide-pink-100/80" : "divide-sky-100/80"}`}>
              {filteredProblems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-500 font-medium">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="text-2xl">{isShreyaUser ? "🌸🧸" : "🐻☁️"}</span>
                      <p className="text-sm font-bold text-slate-700">Koi problem match nahi hui</p>
                      <button
                        onClick={() => {
                          setSearch("");
                          setSelectedCategory("All Categories");
                          setDifficultyFilter("all");
                          setStatusFilter("all");
                          setActiveSheetTab("all");
                        }}
                        className={`mt-1 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-sm transition-all ${
                          isShreyaUser
                            ? "bg-pink-500 hover:bg-pink-400"
                            : "bg-sky-500 hover:bg-sky-400"
                        }`}
                      >
                        Reset All Filters ✨
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProblems.map((prob, idx) => {
                  const myStatus = (isShivam ? prob.shivam_status : prob.shreya_status) || "todo";
                  const partnerStatus = (isShivam ? prob.shreya_status : prob.shivam_status) || "todo";

                  // BOTH DONE = AUTOMATIC CROSS OUT (LINE-THROUGH)
                  const isBothDone = prob.shivam_status === "done" && prob.shreya_status === "done";

                  const diffBadge =
                    prob.difficulty === "Easy"
                      ? "text-emerald-800 bg-emerald-100 border-emerald-300 font-bold"
                      : prob.difficulty === "Hard"
                      ? "text-rose-800 bg-rose-100 border-rose-300 font-bold"
                      : "text-amber-800 bg-amber-100 border-amber-300 font-bold";

                  return (
                    <tr
                      key={`${prob.id}_${idx}`}
                      className={`transition-colors group ${
                        isBothDone
                          ? isShreyaUser
                            ? "bg-pink-50/80 hover:bg-pink-100/70 border-l-4 border-l-pink-400"
                            : "bg-sky-50/80 hover:bg-sky-100/70 border-l-4 border-l-sky-400"
                          : isShreyaUser
                          ? "hover:bg-pink-50/50"
                          : "hover:bg-sky-50/50"
                      }`}
                    >
                      {/* Column 1: MY STATUS */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1 items-start">
                          {renderStatusBadge(myStatus, false, prob.id)}
                          {myStatus === "done" && (
                            <button
                              onClick={() => handleQuickRevise(prob.id, myUserId)}
                              className={`px-2 py-0.5 rounded text-[10px] flex items-center gap-1 font-semibold transition-colors shadow-sm ${
                                isShreyaUser
                                  ? "bg-pink-100 text-pink-700 hover:bg-pink-200 border border-pink-200"
                                  : "bg-sky-100 text-sky-700 hover:bg-sky-200 border border-sky-200"
                              }`}
                            >
                              <RotateCcw className="w-2.5 h-2.5" />
                              <span>Revise</span>
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Column 2: PARTNER STATUS */}
                      <td className="py-3 px-4">
                        {renderStatusBadge(partnerStatus, true, prob.id)}
                      </td>

                      {/* Column 3: PROBLEM NAME (Strikethrough / Crossed out when both done!) */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 font-mono text-[11px] w-6">
                            #{prob.order_index ?? idx + 1}
                          </span>
                          <a
                            href={prob.leetcode_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`font-semibold inline-flex items-center gap-1.5 transition-all ${
                              isBothDone
                                ? isShreyaUser
                                  ? "line-through text-slate-400 decoration-pink-500 decoration-2 opacity-80 hover:text-slate-600"
                                  : "line-through text-slate-400 decoration-sky-500 decoration-2 opacity-80 hover:text-slate-600"
                                : isShreyaUser
                                ? "text-slate-800 hover:text-pink-600"
                                : "text-slate-800 hover:text-sky-600"
                            }`}
                          >
                            <span>{prob.title}</span>
                            <ExternalLink
                              className={`w-3 h-3 text-slate-400 transition-colors ${
                                isShreyaUser ? "group-hover:text-pink-500" : "group-hover:text-sky-500"
                              }`}
                            />
                          </a>

                          {isBothDone && (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-black border flex items-center gap-1 shadow-sm ${
                                isShreyaUser
                                  ? "bg-pink-100 text-pink-700 border-pink-300"
                                  : "bg-sky-100 text-sky-700 border-sky-300"
                              }`}
                            >
                              ✓ Both Done {isShreyaUser ? "🌸" : "🐻☁️"}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Column 4: DIFFICULTY */}
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${diffBadge}`}>
                          {prob.difficulty}
                        </span>
                      </td>

                      {/* Column 5: CATEGORY */}
                      <td className="py-3 px-4 text-slate-600 font-semibold text-xs">
                        {prob.topic}
                      </td>

                      {/* Column 6: NOTES */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            setNoteModalProblem(prob);
                            setNoteText(prob.notes || "");
                          }}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all ${
                            prob.notes
                              ? isShreyaUser
                                ? "bg-pink-100 text-pink-700 border-pink-300 shadow-sm font-bold"
                                : "bg-sky-100 text-sky-700 border-sky-300 shadow-sm font-bold"
                              : isShreyaUser
                              ? "bg-pink-50/70 border-pink-200 text-slate-600 hover:text-pink-700 hover:bg-pink-100/70"
                              : "bg-sky-50/70 border-sky-200 text-slate-600 hover:text-sky-700 hover:bg-sky-100/70"
                          }`}
                        >
                          <FileText className="w-3 h-3" />
                          <span>{prob.notes ? "Notes" : "+ Note"}</span>
                        </button>
                      </td>

                      {/* Column 7: AI MENTOR */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            setAiMentorProblem(prob);
                            setAiResponse(null);
                            setCustomAiQuery("");
                          }}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-bold shadow-sm transition-all border ${
                            isShreyaUser
                              ? "bg-pink-50 hover:bg-pink-100 text-pink-700 border-pink-200"
                              : "bg-sky-50 hover:bg-sky-100 text-sky-700 border-sky-200"
                          }`}
                        >
                          <Bot className={`w-3.5 h-3.5 ${isShreyaUser ? "text-pink-500" : "text-sky-500"}`} />
                          <span>Ask AI</span>
                          <Sparkles className={`w-2.5 h-2.5 ${isShreyaUser ? "text-pink-400" : "text-sky-400"}`} />
                        </button>
                      </td>

                      {/* Column 8: DELETE */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleDeleteProblem(prob.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Delete problem"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Floating Bottom Action Dock (Matching Screenshot) */}
      <div
        className={`fixed bottom-6 right-6 z-40 flex items-center gap-2.5 backdrop-blur-md p-2 rounded-2xl border-2 shadow-2xl transition-all ${
          isShreyaUser
            ? "bg-white/95 border-pink-200 shadow-pink-200/40"
            : "bg-white/95 border-sky-200 shadow-sky-200/40"
        }`}
      >
        <Link
          href="/dashboard/revision"
          className="px-3.5 py-2 rounded-xl text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 shadow-purple-200"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Revise Solved</span>
        </Link>
        <Link
          href="/dashboard/battles"
          className={`px-3.5 py-2 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5 text-white ${
            isShreyaUser
              ? "bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-300 hover:to-rose-300 shadow-pink-200"
              : "bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 shadow-sky-200"
          }`}
        >
          <Swords className="w-3.5 h-3.5" />
          <span>{isShreyaUser ? "🌸 1v1 Battle" : "1v1 Battle 🐻"}</span>
        </Link>
        <Link
          href="/dashboard/rough-code"
          className={`px-3.5 py-2 rounded-xl font-bold text-xs border transition-all flex items-center gap-1.5 ${
            isShreyaUser
              ? "bg-pink-50 hover:bg-pink-100 border-pink-200 text-pink-700"
              : "bg-sky-50 hover:bg-sky-100 border-sky-200 text-sky-700"
          }`}
        >
          <Code2 className={`w-3.5 h-3.5 ${isShreyaUser ? "text-pink-500" : "text-sky-500"}`} />
          <span>Tuition Code</span>
        </Link>
        <Link
          href="/dashboard/chat"
          className={`px-3.5 py-2 rounded-xl text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 ${
            isShreyaUser
              ? "bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-400 hover:to-rose-300 shadow-pink-200"
              : "bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 shadow-sky-200"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{isShreyaUser ? "🌸 Study Room 🧸" : "Study Room & Chat"}</span>
        </Link>
      </div>

      {/* Notes Modal */}
      {noteModalProblem && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm ${
            isShreyaUser ? "bg-pink-950/25" : "bg-sky-950/25"
          }`}
        >
          <div
            className={`bg-white border-2 rounded-3xl p-6 w-full max-w-lg shadow-2xl animate-in zoom-in-95 ${
              isShreyaUser ? "border-pink-200 shadow-pink-200/50" : "border-sky-200 shadow-sky-200/50"
            }`}
          >
            <div className={`flex items-center justify-between mb-3 border-b pb-3 ${isShreyaUser ? "border-pink-100" : "border-sky-100"}`}>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <FileText className={`w-4 h-4 ${isShreyaUser ? "text-pink-500" : "text-sky-500"}`} />
                <span>Notes for {noteModalProblem.title}</span>
              </h3>
              <button
                onClick={() => setNoteModalProblem(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <textarea
              rows={6}
              placeholder="Important tips, edge cases, formula, or approach..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className={`w-full px-3.5 py-2.5 bg-white border-2 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                isShreyaUser
                  ? "border-pink-200 focus:ring-pink-300 focus:border-pink-400"
                  : "border-sky-200 focus:ring-sky-300 focus:border-sky-400"
              }`}
            />

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setNoteModalProblem(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-semibold hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                disabled={savingNote}
                className={`px-4 py-2 rounded-xl text-white font-bold text-xs shadow-md transition-all ${
                  isShreyaUser
                    ? "bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-300 hover:to-rose-300 shadow-pink-200"
                    : "bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 shadow-sky-200"
                }`}
              >
                {savingNote ? "Saving..." : "Save Note"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Mentor Modal */}
      {aiMentorProblem && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm ${
            isShreyaUser ? "bg-pink-950/25" : "bg-sky-950/25"
          }`}
        >
          <div
            className={`bg-white border-2 rounded-3xl p-6 w-full max-w-2xl shadow-2xl max-h-[85vh] overflow-y-auto animate-in zoom-in-95 ${
              isShreyaUser ? "border-pink-200 shadow-pink-200/50" : "border-sky-200 shadow-sky-200/50"
            }`}
          >
            <div className={`flex items-center justify-between mb-4 border-b pb-3 ${isShreyaUser ? "border-pink-100" : "border-sky-100"}`}>
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shadow-sm ${
                    isShreyaUser
                      ? "bg-pink-100 text-pink-600 border border-pink-200"
                      : "bg-sky-100 text-sky-600 border border-sky-200"
                  }`}
                >
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <span>AI Mentor</span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full border font-bold ${
                        isShreyaUser
                          ? "bg-pink-50 text-pink-700 border-pink-200"
                          : "bg-sky-50 text-sky-700 border-sky-200"
                      }`}
                    >
                      {aiMentorProblem.title}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Gemini AI Powered · Instant DSA intuition & complexity tutor
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAiMentorProblem(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Prompt Chips */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => handleAskAi("hint")}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-900 text-xs font-semibold border border-slate-200 hover:border-amber-300 flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Give Me a Subtle Hint</span>
              </button>
              <button
                onClick={() => handleAskAi("approach")}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-900 text-xs font-semibold border border-slate-200 hover:border-indigo-300 flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                <span>Explain Optimal Approach</span>
              </button>
              <button
                onClick={() => handleAskAi("complexity")}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 text-xs font-semibold border border-slate-200 hover:border-emerald-300 flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>Time & Space Complexity</span>
              </button>
              <button
                onClick={() => handleAskAi("edge_cases")}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-900 text-xs font-semibold border border-slate-200 hover:border-rose-300 flex items-center gap-1.5 shadow-sm transition-all"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                <span>Common Edge Cases</span>
              </button>
            </div>

            {/* AI Response Display */}
            {aiLoading ? (
              <div
                className={`p-8 text-center text-xs flex flex-col items-center justify-center gap-2 rounded-2xl border-2 ${
                  isShreyaUser
                    ? "bg-pink-50/60 border-pink-200 text-pink-700"
                    : "bg-sky-50/60 border-sky-200 text-sky-700"
                }`}
              >
                <Bot className="w-6 h-6 animate-spin" />
                <span className="font-semibold">AI Mentor generating intuitive explanation...</span>
              </div>
            ) : aiResponse ? (
              <div
                className={`p-4 rounded-2xl border-2 text-xs text-slate-800 whitespace-pre-wrap leading-relaxed font-sans shadow-inner ${
                  isShreyaUser ? "bg-pink-50/50 border-pink-200" : "bg-sky-50/50 border-sky-200"
                }`}
              >
                {aiResponse}
              </div>
            ) : (
              <div
                className={`p-6 text-center text-xs rounded-2xl border ${
                  isShreyaUser
                    ? "bg-pink-50/30 border-pink-100 text-slate-500"
                    : "bg-sky-50/30 border-sky-100 text-slate-500"
                }`}
              >
                Upar diye gaye prompt chips par click karein ya custom question puchiye!
              </div>
            )}

            {/* Custom Query Input */}
            <div className="mt-4 flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask specific doubt about this question..."
                value={customAiQuery}
                onChange={(e) => setCustomAiQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAskAi("custom", customAiQuery)}
                className={`flex-1 px-3.5 py-2.5 bg-white border-2 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                  isShreyaUser
                    ? "border-pink-200 focus:ring-pink-300 focus:border-pink-400"
                    : "border-sky-200 focus:ring-sky-300 focus:border-sky-400"
                }`}
              />
              <button
                onClick={() => handleAskAi("custom", customAiQuery)}
                disabled={aiLoading || !customAiQuery.trim()}
                className={`p-2.5 rounded-xl text-white font-bold transition-all shadow-md disabled:opacity-50 ${
                  isShreyaUser
                    ? "bg-pink-500 hover:bg-pink-600 shadow-pink-200"
                    : "bg-sky-500 hover:bg-sky-600 shadow-sky-200"
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Sheet Auto-Generator Modal */}
      {isUploadModalOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm ${
            isShreyaUser ? "bg-pink-950/25" : "bg-sky-950/25"
          }`}
        >
          <div
            className={`bg-white border-2 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 transition-all ${
              isShreyaUser
                ? "border-pink-200 shadow-pink-200/50"
                : "border-sky-200 shadow-sky-200/50"
            }`}
          >
            <div
              className={`p-6 pb-4 flex items-start justify-between border-b ${
                isShreyaUser ? "border-pink-100 bg-pink-50/70" : "border-sky-100 bg-sky-50/70"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-md ${
                    isShreyaUser
                      ? "bg-pink-100 border border-pink-200 text-pink-600"
                      : "bg-sky-100 border border-sky-200 text-sky-600"
                  }`}
                >
                  {isShreyaUser ? (
                    <BunnyCherrySticker className="w-9 h-9" />
                  ) : (
                    <TeddyBearSticker className="w-9 h-9" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                    <span>
                      {isShreyaUser
                        ? "🌸 Baby Shreya's PDF Auto-Generator 🧸"
                        : "☁️ Cute Shivam's PDF Auto-Generator 🐻"}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Upload Striver, NeetCode, or college DSA PDF — Gemini AI extracts in sequential order
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <input
                type="file"
                ref={fileInputRef}
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-all group ${
                  isShreyaUser
                    ? "border-pink-300 hover:border-pink-400 bg-pink-50/50 hover:bg-pink-50"
                    : "border-sky-300 hover:border-sky-400 bg-sky-50/50 hover:bg-sky-50"
                }`}
              >
                {selectedFile ? (
                  <div className="text-center">
                    <div
                      className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-2 shadow-sm ${
                        isShreyaUser
                          ? "bg-pink-100 text-pink-700"
                          : "bg-sky-100 text-sky-700"
                      }`}
                    >
                      <FileCheck className="w-6 h-6" />
                    </div>
                    <span
                      className={`block text-sm font-bold ${
                        isShreyaUser ? "text-pink-700" : "text-sky-700"
                      }`}
                    >
                      {selectedFile.name}
                    </span>
                    <span className="block text-xs text-slate-500 mt-0.5 font-medium">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Click to change file
                    </span>
                  </div>
                ) : (
                  <div className="text-center">
                    <div
                      className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-2 transition-colors ${
                        isShreyaUser
                          ? "bg-pink-100 text-pink-600 group-hover:text-pink-700"
                          : "bg-sky-100 text-sky-600 group-hover:text-sky-700"
                      }`}
                    >
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="block text-xs font-bold text-slate-800">
                      {isShreyaUser
                        ? "Click to choose Shreya's DSA PDF 🌸"
                        : "Click to choose or drag & drop DSA PDF ⚡"}
                    </span>
                    <span className="block text-[11px] text-slate-500 mt-0.5">
                      Gemini AI will extract all questions with direct LeetCode links
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Sheet Destination:
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setDestination("new_sheet")}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      destination === "new_sheet"
                        ? isShreyaUser
                          ? "border-pink-400 bg-pink-50/80 shadow-md shadow-pink-100"
                          : "border-sky-400 bg-sky-50/80 shadow-md shadow-sky-100"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          destination === "new_sheet"
                            ? isShreyaUser
                              ? "bg-pink-500 text-white"
                              : "bg-sky-500 text-white"
                            : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        <Sparkles className="w-3 h-3" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">Create New Sheet</span>
                    </div>
                    <p className="text-[11px] text-slate-500 pl-7">
                      New tab with its own status tracker
                    </p>
                  </div>

                  <div
                    onClick={() => setDestination("current_sheet")}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      destination === "current_sheet"
                        ? isShreyaUser
                          ? "border-pink-400 bg-pink-50/80 shadow-md shadow-pink-100"
                          : "border-sky-400 bg-sky-50/80 shadow-md shadow-sky-100"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          destination === "current_sheet"
                            ? isShreyaUser
                              ? "bg-pink-500 text-white"
                              : "bg-sky-500 text-white"
                            : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">Add to Current Sheet</span>
                    </div>
                    <p className="text-[11px] text-slate-500 pl-7">
                      Curated Top DSA 75
                    </p>
                  </div>
                </div>
              </div>

              {destination === "new_sheet" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    New Sheet Name:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Prefix and suffix problem"
                    value={sheetName}
                    onChange={(e) => setSheetName(e.target.value)}
                    className={`w-full px-3.5 py-2.5 bg-white border-2 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all ${
                      isShreyaUser
                        ? "border-pink-200 focus:ring-2 focus:ring-pink-300 focus:border-pink-400"
                        : "border-sky-200 focus:ring-2 focus:ring-sky-300 focus:border-sky-400"
                    }`}
                  />
                </div>
              )}

              {modalError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 leading-relaxed font-medium">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="break-words">{modalError}</div>
                </div>
              )}

              <button
                type="button"
                onClick={handleExtractFromPdf}
                disabled={isExtracting || !selectedFile}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm shadow-md transition-all disabled:opacity-50 ${
                  isShreyaUser
                    ? "bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 hover:from-pink-300 hover:to-rose-300 text-white shadow-pink-200"
                    : "bg-gradient-to-r from-sky-400 via-blue-500 to-sky-500 hover:from-sky-300 hover:to-blue-400 text-white shadow-sky-200"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {isExtracting
                    ? "Gemini AI Extracting Problems..."
                    : isShreyaUser
                    ? "🌸 Extract Problems for Baby Shreya 🎀"
                    : "⚡ Extract Problems from PDF 🐻"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
