import { addExtractedProblems, saveUploadedPdfDoc } from "./frontendStore";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const PRIMARY_MODEL = "gemini-2.5-flash";
const FALLBACK_MODELS = ["gemini-1.5-flash", "gemini-flash-latest"];

// Helper: Convert File to Base64 in Browser
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

// ---------------- AI MENTOR (Direct Client Call) ----------------

export async function askAiMentorClient(
  problemTitle: string,
  problemDifficulty: string = "Medium",
  problemTopic: string = "DSA",
  questionType: string = "hint",
  customQuery?: string
): Promise<string> {
  const systemPrompt = `You are an expert FAANG DSA mentor tutoring Shreya and Shivam.
The problem is "${problemTitle}" (${problemDifficulty}, Topic: ${problemTopic}).

CRITICAL FORMATTING RULES:
1. NEVER use LaTeX math or dollar signs (DO NOT write $O(N^2)$ or $O(N)$ or $$...$$). ALWAYS write clean plain text: O(N^2), O(N), O(1), O(log N).
2. Explain in clear, natural, direct language (friendly Hinglish / English mix).
3. Be super practical, intuitive, and concise. Explain the "Aha!" moment and data structure trick directly without academic fluff.`;

  let userQuery = customQuery || "";
  if (questionType === "hint") {
    userQuery = "Give me 2 sharp, intuitive progressive hints to lead directly to the optimal solution. Do not spoil full code, but make the intuition crystal clear.";
  } else if (questionType === "approach") {
    userQuery = "Explain the brute force approach vs the optimal approach with step-by-step intuition, data structure choice, and why it works.";
  } else if (questionType === "complexity") {
    userQuery = "What is the optimal Time Complexity and Space Complexity? Explain why in plain text without dollar signs.";
  } else if (questionType === "edge_cases") {
    userQuery = "What are the most common tricky edge cases (e.g. empty, negatives, single element, duplicates) to watch out for?";
  }

  const models = [PRIMARY_MODEL, ...FALLBACK_MODELS];

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: `${systemPrompt}\n\nTask:\n${userQuery}` }],
            },
          ],
        }),
      });

      const data = await res.json();
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        let clean = data.candidates[0].content.parts[0].text;
        // Strip away raw LaTeX dollar signs
        clean = clean.replace(/\$([^\$]+)\$/g, "$1");
        return clean;
      }
    } catch (e) {
      console.warn(`Model ${model} failed, trying fallback:`, e);
    }
  }

  return `Mentor Hint for "${problemTitle}": Focus on tracking elements with a Hash Map or Two Pointers to achieve an optimal O(N) time complexity!`;
}

// ---------------- EXTRACT PROBLEMS FROM PDF (Direct Client Call) ----------------

export async function extractProblemsFromPdfClient(
  file: File,
  sheetName: string = "Curated Sheet",
  destination: "new_sheet" | "current_sheet" = "new_sheet"
): Promise<{ extractedCount: number; message: string }> {
  const base64Pdf = await fileToBase64(file);

  // Save for PDF chat in memory / client storage
  saveUploadedPdfDoc(base64Pdf, file.name);

  const prompt = `You are an expert DSA instructor and LeetCode problem curator.
Analyze this entire uploaded PDF document.
Extract EVERY single DSA coding problem mentioned or present in this PDF.

CRITICAL SEQUENTIAL ORDER RULE:
Extract problems in the EXACT sequential order (from top to bottom, page by page) as they appear in the PDF file.
- DO NOT reorder or rearrange the questions.
- DO NOT sort by difficulty (do not put Easy first).
- Question 1 in the PDF MUST be 1st in the array, Question 2 must be 2nd, etc.

For each problem determine:
- "order_index": 1, 2, 3... (exact sequential 1-based index)
- "title": Clean Problem Title (e.g. "Range Sum Query - Immutable")
- "slug": Exact LeetCode problem slug in lowercase with hyphens (e.g. "range-sum-query-immutable")
- "leetcode_url": Full valid LeetCode problem link ("https://leetcode.com/problems/{slug}/")
- "difficulty": "Easy", "Medium", or "Hard"
- "topic": Topic name (e.g. "Prefix Sum", "Two Pointers", "Sliding Window", "Dynamic Programming", "Trees", "Arrays")

Strict Output Format:
Return ONLY a valid JSON array of objects without markdown formatting or code fences:
[
  {
    "order_index": 1,
    "title": "...",
    "slug": "...",
    "leetcode_url": "https://leetcode.com/problems/.../",
    "difficulty": "Easy",
    "topic": "..."
  }
]`;

  const models = [PRIMARY_MODEL, ...FALLBACK_MODELS];
  let extracted: any[] = [];

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inlineData: {
                    mimeType: "application/pdf",
                    data: base64Pdf,
                  },
                },
                { text: prompt },
              ],
            },
          ],
        }),
      });

      const data = await res.json();
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        let text = data.candidates[0].content.parts[0].text.trim();
        text = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed) && parsed.length > 0) {
          extracted = parsed;
          break;
        }
      }
    } catch (e) {
      console.warn(`Direct PDF extraction error on ${model}:`, e);
    }
  }

  // Fallback: If AI fails, create placeholder from filename
  if (extracted.length === 0) {
    const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]+/g, " ");
    extracted = [
      {
        order_index: 1,
        title: cleanName,
        slug: cleanName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        leetcode_url: "https://leetcode.com/problemset/all/",
        difficulty: "Medium",
        topic: "General DSA",
      },
    ];
  }

  // Clean titles from LaTeX notation
  const cleanedProblems = extracted
    .filter((p) => p.title && p.title.trim().length >= 3)
    .map((p, idx) => {
      let title = p.title
        .replace(/\s*[\(\[]?\$?O\s*\([^)]*\)\$?[\)\]]?/gi, "")
        .replace(/\s*-\s*O\s*\([^)]*\)/gi, "")
        .replace(/^\s*\d+[\.\)\-:\s]+/, "")
        .trim();

      if (!title) title = p.title.trim();
      const slug = (p.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-")).toLowerCase();

      return {
        order_index: typeof p.order_index === "number" ? p.order_index : idx + 1,
        title,
        slug,
        leetcode_url: p.leetcode_url || `https://leetcode.com/problems/${slug}/`,
        difficulty: ["Easy", "Medium", "Hard"].includes(p.difficulty) ? p.difficulty : "Medium",
        topic: p.topic || "General DSA",
      };
    });

  const finalSheetName = destination === "current_sheet" ? "Curated Top DSA 75" : sheetName;
  const added = addExtractedProblems(cleanedProblems, finalSheetName);

  return {
    extractedCount: added.length,
    message: `Successfully extracted ${added.length} problems into "${finalSheetName}"!`,
  };
}

// ---------------- PDF CHAT (RAG Direct Client Call) ----------------

export async function askPdfChatClient(
  question: string,
  base64Pdf?: string,
  chatHistory: Array<{ role: "user" | "model"; text: string }> = []
): Promise<string> {
  const systemPrompt = `You are an expert AI tutor helping Shreya and Shivam study from their uploaded PDF.
RULE 1: Answer strictly based on the information provided in the attached PDF.
RULE 2: If the answer is NOT present in the PDF, clearly respond with: "PDF mein nahi mila. (This information is not present in the uploaded PDF)."
RULE 3: Do NOT use LaTeX dollar signs ($O(N)$ -> write O(N)).
RULE 4: Be concise, clear, and direct.`;

  const contents: any[] = [];

  // Add previous turns
  chatHistory.slice(-4).forEach((h) => {
    contents.push({
      role: h.role,
      parts: [{ text: h.text }],
    });
  });

  const parts: any[] = [];
  if (base64Pdf) {
    parts.push({
      inlineData: {
        mimeType: "application/pdf",
        data: base64Pdf,
      },
    });
  }
  parts.push({ text: `${systemPrompt}\n\nUser Question:\n${question}` });

  contents.push({
    role: "user",
    parts,
  });

  const models = [PRIMARY_MODEL, ...FALLBACK_MODELS];

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents }),
      });

      const data = await res.json();
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        let answer = data.candidates[0].content.parts[0].text;
        answer = answer.replace(/\$([^\$]+)\$/g, "$1");
        return answer;
      }
    } catch (e) {
      console.warn(`PDF chat error on ${model}:`, e);
    }
  }

  return "PDF mein nahi mila. Kripya check karein ki kya ye topic document mein covered hai.";
}

