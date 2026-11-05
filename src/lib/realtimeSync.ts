import { ProblemStatus, ChatMessage, ActivityNotification } from "@/types";

const SYNC_TOPIC = "meadowbell-dsa-sync-shreya-shivam-8821";
const NTFY_BASE_URL = `https://ntfy.sh/${SYNC_TOPIC}`;

let eventSourceInstance: EventSource | null = null;
let isInitialized = false;

function getCurrentUserId(): string {
  if (typeof window === "undefined") return "user_shivam";
  try {
    const raw = localStorage.getItem("dsa_current_user");
    if (raw) {
      const u = JSON.parse(raw);
      return u?.id || "user_shivam";
    }
  } catch {}
  return "user_shivam";
}

// Helper: Broadcast to cloud real-time channel
export async function broadcastToCloud(payload: any) {
  try {
    await fetch(NTFY_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.warn("Failed to broadcast real-time event:", err);
  }
}

// 1. Broadcast Problem Status Update
export function broadcastProblemStatus(
  userId: string,
  userName: string,
  problemId: string,
  problemTitle: string,
  status: ProblemStatus,
  bothDone: boolean = false
) {
  broadcastToCloud({
    type: "PROBLEM_STATUS",
    userId,
    userName,
    problemId,
    problemTitle,
    status,
    bothDone,
    timestamp: Date.now(),
  });
}

// 2. Broadcast Chat Message
export function broadcastChatMessage(message: ChatMessage) {
  broadcastToCloud({
    type: "CHAT_MESSAGE",
    message,
    timestamp: Date.now(),
  });
}

// 3. Process incoming real-time payload
function handleIncomingPayload(payload: any) {
  if (!payload || !payload.type) return;

  const currentUserId = getCurrentUserId();

  if (payload.type === "PROBLEM_STATUS") {
    // Only process updates from the partner (not ourselves)
    if (payload.userId !== currentUserId) {
      try {
        const STORAGE_KEY = "dsa_user_problems_v1";
        const raw = localStorage.getItem(STORAGE_KEY);
        const userProblems = raw ? JSON.parse(raw) : {};

        const key = `${payload.userId}_${payload.problemId}`;
        const prev = userProblems[key];
        const prevRev = prev?.revision_count || 0;

        userProblems[key] = {
          id: prev?.id || `up-${Date.now()}`,
          user_id: payload.userId,
          problem_id: payload.problemId,
          status: payload.status,
          solved_at: prev?.solved_at || new Date().toISOString(),
          revision_count: payload.status === "done" ? prevRev + 1 : prevRev,
          last_revised_at: new Date().toISOString(),
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(userProblems));

        // If partner solved, trigger celebratory popup toast
        if (payload.status === "done") {
          const activity: ActivityNotification = {
            id: `act-cloud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            user_id: payload.userId,
            user_name: payload.userName,
            problem_id: payload.problemId,
            problem_title: payload.problemTitle,
            action: "solved",
            both_done: payload.bothDone || false,
            created_at: new Date().toISOString(),
          };

          // Save to activities in storage
          try {
            const actRaw = localStorage.getItem("dsa_activities_v1");
            const activities = actRaw ? JSON.parse(actRaw) : [];
            activities.unshift(activity);
            if (activities.length > 50) activities.pop();
            localStorage.setItem("dsa_activities_v1", JSON.stringify(activities));
          } catch {}

          // Dispatch pop-up toast event
          window.dispatchEvent(
            new CustomEvent("partner_solved_problem", { detail: activity })
          );
        }

        // Notify store listeners to update problems table in real time
        window.dispatchEvent(new Event("dsa_store_changed"));
      } catch (e) {
        console.error("Failed to apply remote problem status:", e);
      }
    }
  } else if (payload.type === "CHAT_MESSAGE") {
    // Only process incoming messages from partner
    if (payload.message && payload.message.sender_id !== currentUserId) {
      try {
        const STORAGE_KEY = "dsa_messages_v1";
        const raw = localStorage.getItem(STORAGE_KEY);
        const messages: ChatMessage[] = raw ? JSON.parse(raw) : [];

        // Check if already exists to prevent duplicate additions
        const exists = messages.some((m) => m.id === payload.message.id);
        if (!exists) {
          messages.push(payload.message);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
          window.dispatchEvent(new Event("dsa_store_changed"));
        }
      } catch (e) {
        console.error("Failed to apply remote chat message:", e);
      }
    }
  }
}

// 4. Initialize Cloud Real-time Listener (SSE)
export function initRealtimeSync() {
  if (typeof window === "undefined" || isInitialized) return;
  isInitialized = true;

  // Catch up on recent messages (poll recent 12 hours)
  try {
    fetch(`${NTFY_BASE_URL}/json?poll=1&since=12h`)
      .then((res) => res.text())
      .then((text) => {
        const lines = text.trim().split("\n");
        for (const line of lines) {
          if (!line) continue;
          try {
            const data = JSON.parse(line);
            if (data.event === "message" && data.message) {
              const payload = JSON.parse(data.message);
              handleIncomingPayload(payload);
            }
          } catch {}
        }
      })
      .catch((err) => console.warn("Failed to catch up missed sync:", err));
  } catch {}

  // Open persistent SSE channel for instant push (<100ms)
  try {
    const sseUrl = `${NTFY_BASE_URL}/sse`;
    eventSourceInstance = new EventSource(sseUrl);

    eventSourceInstance.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event === "message" && data.message) {
          const payload = JSON.parse(data.message);
          handleIncomingPayload(payload);
        }
      } catch (err) {
        // Heartbeat or parse skip
      }
    };

    eventSourceInstance.onerror = () => {
      // EventSource auto-reconnects on disconnection
    };
  } catch (e) {
    console.warn("EventSource setup error:", e);
  }
}
