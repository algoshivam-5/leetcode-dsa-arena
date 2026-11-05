export type UserRole = "shreya" | "shivam";

export interface User {
  id: string;
  username: UserRole;
  name: string;
  leetcode_username: string;
  avatar_color: string;
  coins: number;
  created_at?: string;
}

export type Difficulty = "Easy" | "Medium" | "Hard";

export type ProblemStatus = "done" | "trying" | "revise" | "todo" | "no_answer";

export interface Problem {
  id: string;
  title: string;
  slug: string;
  leetcode_url: string;
  difficulty: Difficulty;
  topic: string;
  sheet_name?: string;
  source?: string;
  notes?: string;
  order_index?: number;
  shreya_status?: ProblemStatus;
  shivam_status?: ProblemStatus;
  shreya_revision_count?: number;
  shivam_revision_count?: number;
  shreya_last_revised?: string;
  shivam_last_revised?: string;
}

export interface UserProblem {
  id: string;
  user_id: string;
  problem_id: string;
  status: "done" | "no_answer";
  solved_at: string;
  revision_count: number;
  last_revised_at: string;
  notes?: string;
}

export interface Battle {
  id: string;
  problem_id: string;
  problem_title?: string;
  problem_slug?: string;
  problem_difficulty?: Difficulty;
  scheduled_at: string;
  duration_minutes: number;
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  winner_id?: string | null;
  winner_name?: string | null;
  created_by: string;
  notes?: string;
  created_at: string;
}

export interface TimetableSlot {
  id: string;
  user_id: string;
  day_of_week: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  start_time: string;
  end_time: string;
  title: string;
  tag: string;
  color: string;
}

export interface Note {
  id: string;
  user_id: string;
  title: string;
  topic: string;
  content: string;
  images: string[];
  created_at: string;
  updated_at: string;
}

export interface CodeFile {
  id: string;
  user_id: string;
  title: string;
  language: string;
  code: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface ActivityNotification {
  id: string;
  user_id: string;
  user_name: string;
  problem_id: string;
  problem_title: string;
  action: "solved" | "revised";
  both_done?: boolean;
  created_at: string;
}

export interface WeeklyStats {
  week_start: string;
  shreya_coins: number;
  shivam_coins: number;
  winner: "shreya" | "shivam" | "tie";
  shreya_total_wins: number;
  shivam_total_wins: number;
}

