import {
  User,
  Problem,
  Battle,
  Note,
  CodeFile,
  TimetableSlot,
  ChatMessage,
  ActivityNotification,
  ProblemStatus,
  UserRole,
} from "@/types";
import {
  INITIAL_PROBLEMS,
  INITIAL_USER_PROBLEMS,
  INITIAL_BATTLES,
  INITIAL_THEORY_NOTES,
  INITIAL_ROUGH_FILES,
  INITIAL_TIMETABLE,
  INITIAL_MESSAGES,
  INITIAL_ACTIVITIES,
  INITIAL_COINS,
} from "./initialData";

export const USERS_CONFIG: Record<
  UserRole,
  {
    id: string;
    username: UserRole;
    name: string;
    pin: string;
    leetcode_username: string;
    avatar_color: string;
  }
> = {
  shreya: {
    id: "user_shreya",
    username: "shreya",
    name: "Shreya Gaur",
    pin: "3005",
    leetcode_username: "shreya_gaur",
    avatar_color: "pink",
  },
  shivam: {
    id: "user_shivam",
    username: "shivam",
    name: "Shivam Sharma",
    pin: "1504",
    leetcode_username: "shivam_sharma",
    avatar_color: "indigo",
  },
};

const STORAGE_KEYS = {
  CURRENT_USER: "dsa_current_user",
  PROBLEMS: "dsa_problems_v1",
  USER_PROBLEMS: "dsa_user_problems_v1",
  BATTLES: "dsa_battles_v1",
  THEORY_NOTES: "dsa_theory_notes_v1",
  ROUGH_FILES: "dsa_rough_files_v1",
  TIMETABLE: "dsa_timetable_v1",
  MESSAGES: "dsa_messages_v1",
  ACTIVITIES: "dsa_activities_v1",
  COINS: "dsa_coins_v1",
  PDF_DOC: "dsa_current_pdf_doc",
};

// Helper: Safe LocalStorage reading with fallback
function getFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(item);
  } catch (e) {
    return fallback;
  }
}

// Helper: Safe LocalStorage saving and dispatching storage event for multi-tab sync
function saveToStorage<T>(key: string, data: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event("dsa_store_changed"));
    // Also trigger cross-tab storage event
    try {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key,
          newValue: JSON.stringify(data),
          url: window.location.href,
        })
      );
    } catch {}
  } catch (e) {
    console.error("Storage save error:", e);
  }
}

// ---------------- AUTH FUNCTIONS ----------------

export function getCurrentUser(): User {
  if (typeof window === "undefined") {
    return {
      id: USERS_CONFIG.shivam.id,
      username: USERS_CONFIG.shivam.username,
      name: USERS_CONFIG.shivam.name,
      leetcode_username: USERS_CONFIG.shivam.leetcode_username,
      avatar_color: USERS_CONFIG.shivam.avatar_color,
      coins: 27,
    };
  }

  const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {}
  }

  // Default to Shivam if not set
  const defaultUser: User = {
    id: USERS_CONFIG.shivam.id,
    username: USERS_CONFIG.shivam.username,
    name: USERS_CONFIG.shivam.name,
    leetcode_username: USERS_CONFIG.shivam.leetcode_username,
    avatar_color: USERS_CONFIG.shivam.avatar_color,
    coins: 27,
  };
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(defaultUser));
  return defaultUser;
}

export function loginUser(username: "shreya" | "shivam", pin: string): { success: boolean; error?: string; user?: User } {
  const config = USERS_CONFIG[username];
  if (!config) {
    return { success: false, error: "Invalid profile selected" };
  }

  if (config.pin !== pin.trim()) {
    return { success: false, error: "Incorrect password. Kripya sahi PIN daalein." };
  }

  const coins = getCoins();
  const user: User = {
    id: config.id,
    username: config.username,
    name: config.name,
    leetcode_username: config.leetcode_username,
    avatar_color: config.avatar_color,
    coins: coins[username] || 0,
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    window.dispatchEvent(new Event("dsa_store_changed"));
  }

  return { success: true, user };
}

export function logoutUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    window.dispatchEvent(new Event("dsa_store_changed"));
  }
}

// ---------------- PROBLEMS FUNCTIONS ----------------

export function getProblemsWithStatus(): Problem[] {
  const problems = getFromStorage<Problem[]>(STORAGE_KEYS.PROBLEMS, INITIAL_PROBLEMS);
  const userProblems = getFromStorage<Record<string, any>>(STORAGE_KEYS.USER_PROBLEMS, INITIAL_USER_PROBLEMS);

  return problems
    .map((p, idx) => {
      const shivamKey = `user_shivam_${p.id}`;
      const shreyaKey = `user_shreya_${p.id}`;

      const shivamRecord = userProblems[shivamKey];
      const shreyaRecord = userProblems[shreyaKey];

      return {
        ...p,
        title: p.title || "DSA Problem",
        topic: p.topic || "General DSA",
        difficulty: p.difficulty || "Medium",
        sheet_name: p.sheet_name || "Curated Top DSA 75",
        order_index: typeof p.order_index === "number" ? p.order_index : idx + 1,
        shivam_status: (shivamRecord?.status as any) || "todo",
        shreya_status: (shreyaRecord?.status as any) || "todo",
        shivam_revision_count: shivamRecord?.revision_count || 0,
        shreya_revision_count: shreyaRecord?.revision_count || 0,
        shivam_last_revised: shivamRecord?.last_revised_at,
        shreya_last_revised: shreyaRecord?.last_revised_at,
      };
    })
    .sort((a, b) => (a.order_index ?? 9999) - (b.order_index ?? 9999));
}

export function toggleProblemStatus(
  targetUserId: string,
  problemId: string,
  newStatus?: ProblemStatus
): { status: ProblemStatus; coins: number } {
  const userProblems = getFromStorage<Record<string, any>>(STORAGE_KEYS.USER_PROBLEMS, INITIAL_USER_PROBLEMS);
  const problems = getFromStorage<Problem[]>(STORAGE_KEYS.PROBLEMS, INITIAL_PROBLEMS);
  const coins = getFromStorage<{ shivam: number; shreya: number }>(STORAGE_KEYS.COINS, INITIAL_COINS);

  const key = `${targetUserId}_${problemId}`;
  const current = userProblems[key];
  const userRole: "shreya" | "shivam" = targetUserId === "user_shreya" ? "shreya" : "shivam";

  let statusToSet: ProblemStatus = newStatus ?? (current?.status === "done" ? "todo" : "done");

  if (statusToSet === "done" || statusToSet === "trying" || statusToSet === "revise") {
    const prevRev = current?.revision_count || 0;
    userProblems[key] = {
      id: current?.id || `up-${Date.now()}`,
      user_id: targetUserId,
      problem_id: problemId,
      status: statusToSet,
      solved_at: current?.solved_at || new Date().toISOString(),
      revision_count: statusToSet === "done" ? prevRev + 1 : prevRev,
      last_revised_at: new Date().toISOString(),
    };

    if (statusToSet === "done" && current?.status !== "done") {
      coins[userRole] = (coins[userRole] || 0) + 1;
      saveToStorage(STORAGE_KEYS.COINS, coins);

      // Create Notification Activity
      const problem = problems.find((p) => p.id === problemId);
      const partnerUserId = targetUserId === "user_shreya" ? "user_shivam" : "user_shreya";
      const isPartnerDone = userProblems[`${partnerUserId}_${problemId}`]?.status === "done";

      const activity: ActivityNotification = {
        id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        user_id: targetUserId,
        user_name: targetUserId === "user_shreya" ? "Shreya Gaur" : "Shivam Sharma",
        problem_id: problemId,
        problem_title: problem?.title || "Problem",
        action: "solved",
        both_done: isPartnerDone,
        created_at: new Date().toISOString(),
      };

      const activities = getFromStorage<ActivityNotification[]>(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
      activities.unshift(activity);
      if (activities.length > 50) activities.pop();
      saveToStorage(STORAGE_KEYS.ACTIVITIES, activities);

      // Dispatch partner solved event
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("partner_solved_problem", { detail: activity }));
      }
    }
  } else {
    delete userProblems[key];
    if (current?.status === "done") {
      coins[userRole] = Math.max(0, (coins[userRole] || 1) - 1);
      saveToStorage(STORAGE_KEYS.COINS, coins);
    }
  }

  saveToStorage(STORAGE_KEYS.USER_PROBLEMS, userProblems);
  return { status: statusToSet, coins: coins[userRole] || 0 };
}

export function incrementRevision(userId: string, problemId: string) {
  const userProblems = getFromStorage<Record<string, any>>(STORAGE_KEYS.USER_PROBLEMS, INITIAL_USER_PROBLEMS);
  const key = `${userId}_${problemId}`;
  const current = userProblems[key];

  if (current) {
    current.revision_count = (current.revision_count || 1) + 1;
    current.last_revised_at = new Date().toISOString();
  } else {
    userProblems[key] = {
      id: `up-${Date.now()}`,
      user_id: userId,
      problem_id: problemId,
      status: "done",
      solved_at: new Date().toISOString(),
      revision_count: 1,
      last_revised_at: new Date().toISOString(),
    };
  }

  saveToStorage(STORAGE_KEYS.USER_PROBLEMS, userProblems);
  return userProblems[key];
}

export function saveProblemNote(problemId: string, noteText: string) {
  const problems = getFromStorage<Problem[]>(STORAGE_KEYS.PROBLEMS, INITIAL_PROBLEMS);
  const prob = problems.find((p) => p.id === problemId);
  if (prob) {
    prob.notes = noteText;
    saveToStorage(STORAGE_KEYS.PROBLEMS, problems);
  }
  return prob;
}

export function deleteProblem(problemId: string) {
  let problems = getFromStorage<Problem[]>(STORAGE_KEYS.PROBLEMS, INITIAL_PROBLEMS);
  problems = problems.filter((p) => p.id !== problemId);
  saveToStorage(STORAGE_KEYS.PROBLEMS, problems);

  const userProblems = getFromStorage<Record<string, any>>(STORAGE_KEYS.USER_PROBLEMS, INITIAL_USER_PROBLEMS);
  delete userProblems[`user_shreya_${problemId}`];
  delete userProblems[`user_shivam_${problemId}`];
  saveToStorage(STORAGE_KEYS.USER_PROBLEMS, userProblems);

  return true;
}

export function addExtractedProblems(newProblems: any[], sheetName: string = "Custom DSA Sheet") {
  const problems = getFromStorage<Problem[]>(STORAGE_KEYS.PROBLEMS, INITIAL_PROBLEMS);
  const added: Problem[] = [];

  const existingSheetProblems = problems.filter((p) => (p.sheet_name || "Curated Top DSA 75") === sheetName);
  const baseOrder = existingSheetProblems.length;

  newProblems.forEach((item, idx) => {
    const existsIndex = problems.findIndex((p) => p.slug === item.slug);
    const assignedOrder = typeof item.order_index === "number" ? item.order_index : baseOrder + idx + 1;

    if (existsIndex === -1) {
      const prob: Problem = {
        id: `p-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 8)}`,
        title: item.title,
        slug: item.slug,
        leetcode_url: item.leetcode_url || `https://leetcode.com/problems/${item.slug}/`,
        difficulty: (item.difficulty as any) || "Medium",
        topic: item.topic || "General DSA",
        sheet_name: item.sheet_name || sheetName,
        order_index: assignedOrder,
        source: "PDF Upload",
      };
      problems.push(prob);
      added.push(prob);
    } else {
      problems[existsIndex].sheet_name = item.sheet_name || sheetName;
      problems[existsIndex].order_index = assignedOrder;
    }
  });

  saveToStorage(STORAGE_KEYS.PROBLEMS, problems);
  return added;
}

// ---------------- COINS & WEEKLY CHALLENGE ----------------

export function getCoins(): { shivam: number; shreya: number } {
  return getFromStorage<{ shivam: number; shreya: number }>(STORAGE_KEYS.COINS, INITIAL_COINS);
}

export function getWeeklyStats() {
  const coins = getCoins();
  const shivam = coins.shivam || 0;
  const shreya = coins.shreya || 0;

  let winner: "shreya" | "shivam" | "tie" = "tie";
  if (shivam > shreya) winner = "shivam";
  else if (shreya > shivam) winner = "shreya";

  return {
    week_start: "Monday, 9:00 AM",
    shivam_coins: shivam,
    shreya_coins: shreya,
    winner,
    shivam_total_wins: 3,
    shreya_total_wins: 4,
  };
}

// ---------------- BATTLES ----------------

export function getBattles(): Battle[] {
  return getFromStorage<Battle[]>(STORAGE_KEYS.BATTLES, INITIAL_BATTLES);
}

export function createBattle(battleData: Partial<Battle>): Battle {
  const battles = getFromStorage<Battle[]>(STORAGE_KEYS.BATTLES, INITIAL_BATTLES);
  const problems = getFromStorage<Problem[]>(STORAGE_KEYS.PROBLEMS, INITIAL_PROBLEMS);
  const prob = problems.find((p) => p.id === battleData.problem_id);

  const newBattle: Battle = {
    id: `b-${Date.now()}`,
    problem_id: battleData.problem_id || "",
    problem_title: prob?.title || "DSA Challenge",
    problem_slug: prob?.slug || "",
    problem_difficulty: prob?.difficulty || "Medium",
    scheduled_at: battleData.scheduled_at || new Date().toISOString(),
    duration_minutes: battleData.duration_minutes || 45,
    status: "scheduled",
    created_by: battleData.created_by || "user_shivam",
    notes: battleData.notes || "",
    created_at: new Date().toISOString(),
  };

  battles.unshift(newBattle);
  saveToStorage(STORAGE_KEYS.BATTLES, battles);
  return newBattle;
}

export function recordBattleWinner(battleId: string, winnerId: string, winnerName: string): Battle | null {
  const battles = getFromStorage<Battle[]>(STORAGE_KEYS.BATTLES, INITIAL_BATTLES);
  const battle = battles.find((b) => b.id === battleId);
  if (battle) {
    battle.status = "completed";
    battle.winner_id = winnerId;
    battle.winner_name = winnerName;
    saveToStorage(STORAGE_KEYS.BATTLES, battles);
    return battle;
  }
  return null;
}

// ---------------- THEORY NOTES ----------------

export function getTheoryNotes(): Note[] {
  return getFromStorage<Note[]>(STORAGE_KEYS.THEORY_NOTES, INITIAL_THEORY_NOTES);
}

export function saveTheoryNote(noteData: Partial<Note>): Note {
  const notes = getFromStorage<Note[]>(STORAGE_KEYS.THEORY_NOTES, INITIAL_THEORY_NOTES);

  if (noteData.id) {
    const index = notes.findIndex((n) => n.id === noteData.id);
    if (index !== -1) {
      notes[index] = {
        ...notes[index],
        ...noteData,
        updated_at: new Date().toISOString(),
      } as Note;
      saveToStorage(STORAGE_KEYS.THEORY_NOTES, notes);
      return notes[index];
    }
  }

  const newNote: Note = {
    id: `note-${Date.now()}`,
    user_id: noteData.user_id || "user_shivam",
    title: noteData.title || "Untitled Topic",
    topic: noteData.topic || "General DSA",
    content: noteData.content || "",
    images: noteData.images || [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  notes.unshift(newNote);
  saveToStorage(STORAGE_KEYS.THEORY_NOTES, notes);
  return newNote;
}

export function deleteTheoryNote(id: string): boolean {
  let notes = getFromStorage<Note[]>(STORAGE_KEYS.THEORY_NOTES, INITIAL_THEORY_NOTES);
  notes = notes.filter((n) => n.id !== id);
  saveToStorage(STORAGE_KEYS.THEORY_NOTES, notes);
  return true;
}

// ---------------- ROUGH CODE ----------------

export function getRoughFiles(): CodeFile[] {
  return getFromStorage<CodeFile[]>(STORAGE_KEYS.ROUGH_FILES, INITIAL_ROUGH_FILES);
}

export function saveRoughFile(fileData: Partial<CodeFile>): CodeFile {
  const files = getFromStorage<CodeFile[]>(STORAGE_KEYS.ROUGH_FILES, INITIAL_ROUGH_FILES);

  if (fileData.id) {
    const idx = files.findIndex((f) => f.id === fileData.id);
    if (idx !== -1) {
      files[idx] = {
        ...files[idx],
        ...fileData,
        updated_at: new Date().toISOString(),
      } as CodeFile;
      saveToStorage(STORAGE_KEYS.ROUGH_FILES, files);
      return files[idx];
    }
  }

  const newFile: CodeFile = {
    id: `code-${Date.now()}`,
    user_id: fileData.user_id || "user_shivam",
    title: fileData.title || "solution.cpp",
    language: fileData.language || "cpp",
    code: fileData.code || "// Write your rough code here\n",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  files.unshift(newFile);
  saveToStorage(STORAGE_KEYS.ROUGH_FILES, files);
  return newFile;
}

export function deleteRoughFile(id: string): boolean {
  let files = getFromStorage<CodeFile[]>(STORAGE_KEYS.ROUGH_FILES, INITIAL_ROUGH_FILES);
  files = files.filter((f) => f.id !== id);
  saveToStorage(STORAGE_KEYS.ROUGH_FILES, files);
  return true;
}

// ---------------- TIMETABLE ----------------

export function getTimetable(userId: string): TimetableSlot[] {
  const all = getFromStorage<TimetableSlot[]>(STORAGE_KEYS.TIMETABLE, INITIAL_TIMETABLE);
  return all.filter((s) => s.user_id === userId);
}

export function saveTimetableSlot(slotData: Partial<TimetableSlot>): TimetableSlot {
  const all = getFromStorage<TimetableSlot[]>(STORAGE_KEYS.TIMETABLE, INITIAL_TIMETABLE);
  const newSlot: TimetableSlot = {
    id: `slot-${Date.now()}`,
    user_id: slotData.user_id || "user_shivam",
    day_of_week: slotData.day_of_week || "Monday",
    start_time: slotData.start_time || "10:00 AM",
    end_time: slotData.end_time || "12:00 PM",
    title: slotData.title || "DSA Study Session",
    tag: slotData.tag || "LeetCode",
    color: slotData.color || "emerald",
  };

  all.push(newSlot);
  saveToStorage(STORAGE_KEYS.TIMETABLE, all);
  return newSlot;
}

export function deleteTimetableSlot(id: string): boolean {
  let all = getFromStorage<TimetableSlot[]>(STORAGE_KEYS.TIMETABLE, INITIAL_TIMETABLE);
  all = all.filter((s) => s.id !== id);
  saveToStorage(STORAGE_KEYS.TIMETABLE, all);
  return true;
}

// ---------------- CHAT MESSAGES ----------------

export function getChatMessages(): ChatMessage[] {
  return getFromStorage<ChatMessage[]>(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
}

export function sendChatMessage(content: string, senderId: string, receiverId: string): ChatMessage {
  const messages = getFromStorage<ChatMessage[]>(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
  const newMsg: ChatMessage = {
    id: `msg-${Date.now()}`,
    sender_id: senderId,
    receiver_id: receiverId,
    content,
    is_read: false,
    created_at: new Date().toISOString(),
  };

  messages.push(newMsg);
  saveToStorage(STORAGE_KEYS.MESSAGES, messages);
  return newMsg;
}

// ---------------- ACTIVITIES ----------------

export function getActivities(): ActivityNotification[] {
  return getFromStorage<ActivityNotification[]>(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
}

// ---------------- PDF STORAGE (Client-side) ----------------

export function saveUploadedPdfDoc(base64: string, name: string, textSnippet?: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      STORAGE_KEYS.PDF_DOC,
      JSON.stringify({
        name,
        base64,
        textSnippet: textSnippet || "",
        uploadedAt: new Date().toISOString(),
      })
    );
  } catch (e) {
    console.warn("PDF store warning (large file stored in memory):", e);
  }
}

export function getUploadedPdfDoc(): { name: string; base64: string; textSnippet: string } | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEYS.PDF_DOC);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

