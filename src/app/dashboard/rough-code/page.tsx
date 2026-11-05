"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Code2,
  FileCode,
  Plus,
  Save,
  Trash2,
  Edit2,
  Copy,
  Check,
  Download,
  FolderOpen,
} from "lucide-react";
import { CodeFile } from "@/types";
import { getRoughFiles, saveRoughFile, deleteRoughFile } from "@/lib/frontendStore";

// Dynamic import for Monaco Editor to disable SSR
const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const DEFAULT_TEMPLATES: Record<string, string> = {
  cpp: `#include <iostream>\n#include <vector>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    void solve() {\n        // Rough code and experimentation\n        cout << "Meadowbell DSA Scratchpad!" << endl;\n    }\n};\n\nint main() {\n    Solution s;\n    s.solve();\n    return 0;\n}`,
  java: `import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        System.out.println("Meadowbell DSA Scratchpad!");\n    }\n}`,
  python: `class Solution:\n    def solve(self):\n        print("Meadowbell DSA Scratchpad!")\n\nif __name__ == "__main__":\n    s = Solution()\n    s.solve()`,
  javascript: `// JavaScript DSA Scratchpad\nfunction solve() {\n    console.log("Meadowbell DSA Scratchpad!");\n}\nsolve();`,
  typescript: `// TypeScript DSA Scratchpad\nfunction solve(): void {\n    console.log("Meadowbell DSA Scratchpad!");\n}\nsolve();`,
};

export default function RoughCodePage() {
  const [files, setFiles] = useState<CodeFile[]>(() => {
    try {
      return getRoughFiles();
    } catch {
      return [];
    }
  });
  const [activeFile, setActiveFile] = useState<CodeFile | null>(null);
  const [title, setTitle] = useState("solution.cpp");
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(DEFAULT_TEMPLATES.cpp);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const fetchFiles = () => {
    try {
      const loaded: CodeFile[] = getRoughFiles();
      setFiles(loaded);
      if (loaded.length > 0 && !activeFile) {
        selectFile(loaded[0]);
      }
    } catch (e) {
      console.error("Failed to load code files:", e);
    }
  };

  useEffect(() => {
    fetchFiles();

    if (typeof window !== "undefined") {
      window.addEventListener("dsa_store_changed", fetchFiles);
      window.addEventListener("storage", fetchFiles);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("dsa_store_changed", fetchFiles);
        window.removeEventListener("storage", fetchFiles);
      }
    };
  }, []);

  const selectFile = (f: CodeFile) => {
    setActiveFile(f);
    setTitle(f.title);
    setLanguage(f.language);
    setCode(f.code);
  };

  const createNewFile = () => {
    setActiveFile(null);
    setTitle(`scratch_${Date.now().toString().slice(-4)}.cpp`);
    setLanguage("cpp");
    setCode(DEFAULT_TEMPLATES.cpp);
  };

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    // Adjust extension
    const extMap: Record<string, string> = {
      cpp: ".cpp",
      java: ".java",
      python: ".py",
      javascript: ".js",
      typescript: ".ts",
    };
    const baseName = title.split(".")[0] || "solution";
    setTitle(`${baseName}${extMap[newLang] || ".txt"}`);
  };

  const handleSave = () => {
    setSaving(true);
    try {
      const saved = saveRoughFile({
        id: activeFile?.id,
        title,
        language,
        code,
      });

      setActiveFile(saved);
      fetchFiles();
    } catch (e) {
      console.error("Save error:", e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this code file?")) return;

    try {
      deleteRoughFile(id);
      if (activeFile?.id === id) {
        createNewFile();
      }
      fetchFiles();
    } catch (e) {
      console.error("Delete error:", e);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = title;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Code2 className="w-6 h-6 text-sky-400" />
            <span>Rough Code Area</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Syntax highlighted code scratchpad with Monaco Editor. Write, save, and organize multiple solution files.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={createNewFile}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
          >
            <Plus className="w-4 h-4 text-sky-400" />
            <span>New File</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md shadow-sky-600/20 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save File"}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace: File List Sidebar + Monaco Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[700px]">
        {/* Left: Files List */}
        <div className="lg:col-span-1 rounded-2xl bg-slate-900/80 border border-slate-800 p-3 flex flex-col justify-between overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-1">
            <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>Saved Files ({files.length})</span>
              <FolderOpen className="w-3.5 h-3.5 text-slate-400" />
            </div>

            {files.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">
                No saved files yet.
              </div>
            ) : (
              files.map((f) => {
                const isActive = activeFile?.id === f.id;
                return (
                  <div
                    key={f.id}
                    onClick={() => selectFile(f)}
                    className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors text-xs ${
                      isActive
                        ? "bg-sky-500/10 border border-sky-500/30 text-white font-semibold"
                        : "text-slate-300 hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCode className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-sky-400" : "text-slate-500"}`} />
                      <span className="truncate">{f.title}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleDelete(f.id, e)}
                        className="p-1 text-slate-500 hover:text-red-400 rounded transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Code Editor Box */}
        <div className="lg:col-span-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col overflow-hidden shadow-xl">
          {/* Editor Action Bar */}
          <div className="h-12 border-b border-slate-800/80 bg-slate-950/60 px-4 flex items-center justify-between gap-4">
            {/* File Name & Language */}
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-transparent border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-sky-500 w-48 sm:w-64"
                placeholder="filename.cpp"
              />

              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
              </select>
            </div>

            {/* Quick Action Tools */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                title="Copy Code"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>

              <button
                onClick={handleDownload}
                title="Download Code File"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Monaco Editor Container */}
          <div className="flex-1 w-full bg-[#1e1e1e]">
            <Editor
              height="100%"
              language={language}
              value={code}
              theme="vs-dark"
              onChange={(value) => setCode(value || "")}
              options={{
                fontSize: 13,
                fontFamily: "Menlo, Monaco, 'Courier New', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: "on",
                automaticLayout: true,
                tabSize: 4,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

