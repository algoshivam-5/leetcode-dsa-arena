"use client";

import { useState, useEffect, useRef } from "react";
import { BookOpen, Plus, Trash2, Image as ImageIcon, Search, Tag, Edit3, X, FileText, Check } from "lucide-react";
import { Note } from "@/types";
import { getTheoryNotes, saveTheoryNote, deleteTheoryNote } from "@/lib/frontendStore";

export default function DsTheoryPage() {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      return getTheoryNotes();
    } catch {
      return [];
    }
  });
  const [selectedTopic, setSelectedTopic] = useState<string>("All");
  const [search, setSearch] = useState("");

  // Editor Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Partial<Note> | null>(null);
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("Arrays");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const contentAreaRef = useRef<HTMLTextAreaElement>(null);

  const fetchNotes = () => {
    try {
      const data = getTheoryNotes();
      setNotes(data);
    } catch (e) {
      console.error("Failed to load notes:", e);
    }
  };

  useEffect(() => {
    fetchNotes();

    if (typeof window !== "undefined") {
      window.addEventListener("dsa_store_changed", fetchNotes);
      window.addEventListener("storage", fetchNotes);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("dsa_store_changed", fetchNotes);
        window.removeEventListener("storage", fetchNotes);
      }
    };
  }, []);

  const openNewNote = () => {
    setEditingNote(null);
    setTitle("");
    setTopic("Arrays");
    setContent("");
    setImages([]);
    setIsModalOpen(true);
  };

  const openEditNote = (n: Note) => {
    setEditingNote(n);
    setTitle(n.title);
    setTopic(n.topic);
    setContent(n.content);
    setImages(n.images || []);
    setIsModalOpen(true);
  };

  // Clipboard Paste Image (Ctrl+V / Cmd+V)
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (loadEvent) => {
            const base64 = loadEvent.target?.result as string;
            if (base64) {
              setImages((prev) => [...prev, base64]);
            }
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const base64 = loadEvent.target?.result as string;
        if (base64) {
          setImages((prev) => [...prev, base64]);
        }
      };
      reader.readAsDataURL(files[i]);
    }
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    try {
      saveTheoryNote({
        id: editingNote?.id,
        title,
        topic,
        content,
        images,
      });

      setIsModalOpen(false);
      fetchNotes();
    } catch (err) {
      console.error("Save note error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNote = (id: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return;
    try {
      deleteTheoryNote(id);
      fetchNotes();
    } catch (e) {
      console.error("Delete note error:", e);
    }
  };

  const topicsList = ["All", ...Array.from(new Set(notes.map((n) => n.topic)))];

  const filteredNotes = notes.filter((n) => {
    const matchesTopic = selectedTopic === "All" || n.topic === selectedTopic;
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-rose-400" />
            <span>DS Theory & Concept Notes</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Topic-wise organize karein, images paste karein (Ctrl+V) aur core algorithms revise karein.
          </p>
        </div>

        <button
          onClick={openNewNote}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Theory Note</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search notes content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Topic Filters */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {topicsList.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTopic(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedTopic === t
                  ? "bg-rose-600 text-white"
                  : "bg-slate-800/80 text-slate-400 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white/95 border-2 border-pink-200 text-slate-600 text-xs shadow-sm font-semibold">
          🌸 Koi note nahi mila. Naya note create karein! 📝
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20">
                    {note.topic}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditNote(note)}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mb-2">{note.title}</h3>

                <div className="text-xs text-slate-300 whitespace-pre-wrap font-sans leading-relaxed line-clamp-6 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                  {note.content}
                </div>

                {/* Images Preview */}
                {note.images && note.images.length > 0 && (
                  <div className="mt-3 flex items-center gap-2 overflow-x-auto py-1">
                    {note.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="Note diagram"
                        className="h-16 w-24 object-cover rounded-lg border border-slate-700 flex-shrink-0 cursor-pointer hover:opacity-90"
                        onClick={() => window.open(img, "_blank")}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Updated: {new Date(note.updated_at).toLocaleDateString()}</span>
                <span>{note.images?.length || 0} attachments</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Note Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-rose-400" />
                <span>{editingNote ? "Edit Theory Note" : "Create New Theory Note"}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dynamic Programming Memoization vs Tabulation"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Topic</label>
                  <input
                    type="text"
                    required
                    placeholder="Arrays / DP / Trees"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-300">
                    Content & Code (Supports Ctrl+V Image Paste!)
                  </label>
                  <span className="text-[11px] text-rose-400">Ctrl+V / Cmd+V paste image directly</span>
                </div>
                <textarea
                  ref={contentAreaRef}
                  onPaste={handlePaste}
                  rows={8}
                  placeholder="Apne notes ya code templates yahan likhein... Copy-pasted diagram ko seedha yahan Ctrl+V karein!"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              {/* Upload Images Option */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Attached Diagrams / Images ({images.length})
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs">
                    <ImageIcon className="w-3.5 h-3.5 text-rose-400" />
                    <span>Upload Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-slate-500">
                    (Ya textarea mein direct Ctrl+V se paste karein)
                  </span>
                </div>

                {images.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800">
                    {images.map((img, i) => (
                      <div key={i} className="relative group">
                        <img
                          src={img}
                          alt="preview"
                          className="h-16 w-24 object-cover rounded-lg border border-slate-700"
                        />
                        <button
                          type="button"
                          onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                          className="absolute -top-1.5 -right-1.5 p-1 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Buttons */}
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
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/20 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Note"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

