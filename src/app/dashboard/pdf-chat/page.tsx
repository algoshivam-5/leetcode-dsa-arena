"use client";

import { useState, useEffect, useRef } from "react";
import { Bot, Send, Upload, FileText, Sparkles, Check, AlertCircle, HelpCircle } from "lucide-react";
import { getUploadedPdfDoc, saveUploadedPdfDoc } from "@/lib/frontendStore";
import { askPdfChatClient, fileToBase64 } from "@/lib/geminiClient";

interface QnA {
  id: string;
  sender: "user" | "gemini";
  text: string;
  timestamp: string;
}

export default function PdfChatPage() {
  const [messages, setMessages] = useState<QnA[]>([
    {
      id: "welcome",
      sender: "gemini",
      text: "Namaste! Main aapka Gemini DSA Assistant hoon. Aapne jo PDF upload ki hai, usse related koi bhi question puchiye. Main sirf PDF content ke aadhar par answer dunga (agar PDF mein nahi mila toh bol dunga 'PDF mein nahi mila').",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfStatus, setPdfStatus] = useState<{ hasPdf: boolean; charCount?: number; preview?: string } | null>(() => {
    try {
      const doc = getUploadedPdfDoc();
      return doc ? { hasPdf: true, preview: `PDF Document: ${doc.name} loaded and ready!` } : { hasPdf: false };
    } catch {
      return { hasPdf: false };
    }
  });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const checkPdfStatus = () => {
    try {
      const doc = getUploadedPdfDoc();
      if (doc) {
        setPdfStatus({
          hasPdf: true,
          preview: `PDF Document: ${doc.name} loaded and ready!`,
        });
      } else {
        setPdfStatus({ hasPdf: false });
      }
    } catch (e) {
      console.error("PDF status error:", e);
    }
  };

  useEffect(() => {
    checkPdfStatus();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const b64 = await fileToBase64(file);
      saveUploadedPdfDoc(b64, file.name);
      checkPdfStatus();

      setMessages((prev) => [
        ...prev,
        {
          id: `sys-${Date.now()}`,
          sender: "gemini",
          text: `Nayi PDF "${file.name}" successfully upload ho gayi hai! Ab aap is PDF ke baare mein koi bhi sawal pooch sakte hain.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (e) {
      console.error("Upload error:", e);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || loading) return;

    const userText = inputQuery.trim();
    setInputQuery("");

    const userMsg: QnA = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const doc = getUploadedPdfDoc();
      const history = messages.map((m) => ({
        role: m.sender === "user" ? ("user" as const) : ("model" as const),
        text: m.text,
      }));

      const answer = await askPdfChatClient(userText, doc?.base64, history);

      const botMsg: QnA = {
        id: `g-${Date.now()}`,
        sender: "gemini",
        text: answer || "PDF mein nahi mila.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "gemini",
          text: "Question process karne mein error aaya. Kripya punah prayas karein.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    "Is PDF mein kaun-kaun se Binary Tree problems hain?",
    "Dynamic Programming ke questions list karo.",
    "Kya is PDF mein Graph Cycle Detection ka question hai?",
    "Two Pointers technique ke questions batao.",
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Bot className="w-6 h-6 text-violet-400" />
            <span>PDF AI Chat (Gemini RAG)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Strict RAG: Answer sirf aapki uploaded PDF notes ke base par diya jayega.
          </p>
        </div>

        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            accept=".pdf"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/20 transition-all disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            <span>{uploading ? "Extracting Text..." : "Upload / Replace PDF"}</span>
          </button>
        </div>
      </div>

      {/* PDF Status Badge */}
      <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-violet-400" />
          <div>
            <h4 className="text-xs font-bold text-white">
              {pdfStatus?.hasPdf
                ? `Active PDF Loaded (${pdfStatus.charCount?.toLocaleString()} characters indexed)`
                : "Koi PDF index nahi hui hai"}
            </h4>
            <span className="text-[11px] text-slate-400">
              {pdfStatus?.hasPdf
                ? "Gemini model is context-bound to this document."
                : "Upload DSA sheet or topic notes to enable AI answers."}
            </span>
          </div>
        </div>

        <span
          className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${
            pdfStatus?.hasPdf
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
              : "bg-amber-500/10 text-amber-400 border-amber-500/30"
          }`}
        >
          {pdfStatus?.hasPdf ? "Ready for Q&A" : "No PDF"}
        </span>
      </div>

      {/* Chat Container */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col h-[640px] overflow-hidden shadow-2xl">
        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-950/60">
          {messages.map((m) => {
            const isUser = m.sender === "user";

            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-300 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl p-4 shadow-md ${
                    isUser
                      ? "bg-indigo-600 text-white rounded-br-xs"
                      : "bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-xs"
                  }`}
                >
                  <div className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed font-sans">
                    {m.text}
                  </div>
                  <div
                    className={`text-[10px] mt-1.5 text-right ${
                      isUser ? "text-indigo-200/80" : "text-slate-500"
                    }`}
                  >
                    {m.timestamp}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center flex-shrink-0 mt-1">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl bg-violet-600/20 text-violet-300 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-900 border border-slate-800 text-slate-400 rounded-2xl p-3 text-xs flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
                <span>Reading PDF chunks and generating response with Gemini...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-slate-500 font-semibold flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Try:</span>
          </span>
          {samplePrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => setInputQuery(p)}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 whitespace-nowrap transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Question Input Form */}
        <form
          onSubmit={handleAskQuestion}
          className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="PDF se related koi bhi question puchiye..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          <button
            type="submit"
            disabled={!inputQuery.trim() || loading}
            className="p-3 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold shadow-md transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

