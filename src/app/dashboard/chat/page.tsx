"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, CheckCheck, Smile, Sparkles, User, ShieldCheck } from "lucide-react";
import { ChatMessage, User as UserType } from "@/types";
import { getCurrentUser, getChatMessages, sendChatMessage } from "@/lib/frontendStore";

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = () => {
    try {
      const msgs = getChatMessages();
      setMessages(msgs);
    } catch (e) {
      console.error("Messages fetch error:", e);
    }
  };

  useEffect(() => {
    function init() {
      const u = getCurrentUser();
      setCurrentUser(u);
      fetchMessages();
    }
    init();

    if (typeof window !== "undefined") {
      window.addEventListener("dsa_store_changed", fetchMessages);
      window.addEventListener("storage", fetchMessages);
    }

    const interval = setInterval(fetchMessages, 2000);

    return () => {
      clearInterval(interval);
      if (typeof window !== "undefined") {
        window.removeEventListener("dsa_store_changed", fetchMessages);
        window.removeEventListener("storage", fetchMessages);
      }
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || sending) return;

    setSending(true);
    const contentToSend = inputText;
    setInputText("");

    try {
      const senderId = currentUser?.id || "user_shivam";
      const receiverId = senderId === "user_shreya" ? "user_shivam" : "user_shreya";
      sendChatMessage(contentToSend, senderId, receiverId);
      fetchMessages();
    } catch (e) {
      console.error("Send error:", e);
    } finally {
      setSending(false);
    }
  };

  const isCurrentShivam = currentUser?.id === "user_shivam";
  const partnerName = isCurrentShivam ? "Shreya Gaur" : "Shivam Sharma";
  const isShreya = currentUser?.username === "shreya";

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Chat Container */}
      <div
        className={`max-w-4xl mx-auto rounded-3xl bg-white/95 border-2 shadow-2xl flex flex-col h-[760px] overflow-hidden ${
          isShreya
            ? "border-pink-200 shadow-pink-200/40"
            : "border-sky-200 shadow-sky-200/40"
        }`}
      >
        {/* Chat Header */}
        <div
          className={`h-16 border-b px-5 flex items-center justify-between ${
            isShreya
              ? "bg-pink-50/80 border-pink-200"
              : "bg-sky-50/80 border-sky-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-md ${
                isCurrentShivam
                  ? "bg-gradient-to-tr from-pink-500 to-rose-400 shadow-pink-300/40"
                  : "bg-gradient-to-tr from-sky-400 to-blue-500 shadow-sky-300/40"
              }`}
            >
              {isCurrentShivam ? "🌸" : "🐻"}
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                <span>{partnerName}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              </h2>
              <span className={`text-[11px] font-bold ${isShreya ? "text-pink-600" : "text-sky-600"}`}>
                {isShreya ? "🎀 Baby Shreya & Shivam Study Room 🧸" : "☁️ Cute Shivam & Shreya Study Room 🐻"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="hidden sm:inline">Private Duo Channel</span>
          </div>
        </div>

        {/* Message Feed Area */}
        <div
          className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 ${
            isShreya ? "bg-[#fff8fa]" : "bg-[#f8faff]"
          }`}
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 text-xs font-medium">
              <MessageSquare className={`w-10 h-10 mb-2 ${isShreya ? "text-pink-300" : "text-sky-300"}`} />
              <p>Koi message nahi hai abhi. Ek dusre ko message bhej kar DSA discussion shuru karein!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender_id === currentUser?.id;
              const senderDisplayName =
                msg.sender_id === "user_shreya" ? "Shreya" : "Shivam";

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 shadow-md relative ${
                      isMe
                        ? isShreya
                          ? "bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 text-white rounded-br-xs shadow-pink-200"
                          : "bg-gradient-to-r from-sky-400 via-blue-500 to-sky-500 text-white rounded-br-xs shadow-sky-200"
                        : "bg-white border-2 border-slate-200 text-slate-800 rounded-bl-xs shadow-slate-200/50"
                    }`}
                  >
                    {!isMe && (
                      <span className={`block text-[11px] font-black mb-0.5 ${isShreya ? "text-sky-700" : "text-pink-700"}`}>
                        {senderDisplayName}
                      </span>
                    )}

                    <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed break-words font-sans font-medium">
                      {msg.content}
                    </p>

                    <div
                      className={`flex items-center gap-1 justify-end text-[10px] mt-1 ${
                        isMe ? "text-white/80" : "text-slate-500"
                      }`}
                    >
                      <span>
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {isMe && <CheckCheck className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={handleSend}
          className={`p-3 border-t flex items-center gap-2 ${
            isShreya ? "bg-pink-50/70 border-pink-200" : "bg-sky-50/70 border-sky-200"
          }`}
        >
          <input
            type="text"
            placeholder={`Message ${partnerName}... (Enter to send)`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className={`flex-1 px-4 py-2.5 bg-white border-2 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 font-medium ${
              isShreya
                ? "border-pink-200 focus:ring-pink-300 focus:border-pink-400"
                : "border-sky-200 focus:ring-sky-300 focus:border-sky-400"
            }`}
          />

          <button
            type="submit"
            disabled={!inputText.trim() || sending}
            className={`p-3 rounded-2xl text-white font-bold shadow-md transition-all disabled:opacity-50 ${
              isShreya
                ? "bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 hover:from-pink-300 hover:to-rose-400 shadow-pink-200"
                : "bg-gradient-to-r from-sky-400 via-blue-500 to-sky-500 hover:from-sky-300 hover:to-blue-400 shadow-sky-200"
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
