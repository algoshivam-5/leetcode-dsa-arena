# Meadowbell — Shreya & Shivam Private DSA Study Suite 🚀

Ek private DSA & LeetCode preparation platform specifically designed for **Shreya Gaur** and **Shivam Sharma**. Isme full-stack Next.js, Supabase, Gemini AI RAG, aur LeetCode synchronization integrated hai.

---

## 👥 Authorized Users & Passwords

Sirf 2 profiles authorized hain:

| User | Username | LeetCode Username | Password |
| :--- | :--- | :--- | :--- |
| **Shreya Gaur** | `shreya` | `shreya_gaur` | `3005` |
| **Shivam Sharma** | `shivam` | `shivam_sharma` | `1504` |

> 🔒 **Security Notice:** Passwords plain text mein store nahi hote. Seed script mein passwords **bcrypt** se hashed hain aur sessions encrypted JWT cookies se authenticate hote hain.

---

## ✨ Features Implemented

1. **Login & Session Management**:
   - Profile select screen (Shreya / Shivam) with animated PIN/Password prompt.
   - Top-right profile dropdown with verified badges & 1-click **Logout** redirecting to `/login`.
   - Protected routes via Next.js Middleware.

2. **Left Collapsible Sidebar (Hamburger)**:
   - 9 Modules: Problem List, Revision Area, Battle Area, Weekly Challenge, Timetable, DS Theory, Rough Code, Chat, PDF Chat.

3. **Problem List + LeetCode Sync**:
   - Curated Core DSA list + Dynamic PDF Question Extraction.
   - Shivam Status & Shreya Status columns (Done / No Answer).
   - Problem name click opens official `https://leetcode.com/problems/...` in a new tab.
   - Sync button with unofficial LeetCode GraphQL API.
   - Manual "Mark as Done / No Answer" toggle buttons (fallback).
   - Filters: All / Done by both 🤝 / Pending, and difficulty filtering.

4. **Weekly Coin Challenge (Monday - Sunday)**:
   - 1 Solved Problem = 1 Coin.
   - Weekly Head-to-Head score bar and Winner Trophy Banner.
   - Automatic reset on new weeks while keeping historical wins count.

5. **1v1 Coding Battle Area**:
   - Battles can **only** be scheduled on problems that **both** Shreya and Shivam have completed.
   - Date, time, duration, and challenge notes picker.
   - Upcoming matches countdown & Record Winner dialog (Shreya / Shivam / Draw).

6. **Revision Area (Spaced Repetition)**:
   - Tracks already solved problems for retention.
   - "Revise again" button that increments revision count (e.g. `3x 🔥`) and updates last revised date.
   - Toggle view between personal, Shreya's, and Shivam's solved lists.

7. **DS Theory Area**:
   - Topic-wise notes organizing (Arrays, DP, Graphs, etc.).
   - Direct clipboard image paste via **`Ctrl+V` / `Cmd+V`**.
   - Image file upload and markdown editor.

8. **Rough Code Area**:
   - Integrated **Monaco Editor** (VS Code engine).
   - Syntax highlighting for C++, Java, Python, JavaScript, TypeScript.
   - Multi-file management: Create, rename, edit, download, and delete files.

9. **Weekly Timetable**:
   - Monday to Sunday slot organizer.
   - View your own timetable (editable) or view each other's timetable.

10. **Realtime Chat (WhatsApp Style)**:
    - WhatsApp-styled sent/received message bubbles with timestamps and read receipts.
    - Realtime channel updates and database persistence.

11. **PDF Chat (Gemini AI RAG)**:
    - Upload any DSA sheet or notes PDF.
    - Extracts text chunks and queries Google Gemini.
    - Strictly answers from PDF content. If not found in PDF, strictly responds: `"PDF mein nahi mila."`

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router, React 19, TypeScript)
- **Styling:** Tailwind CSS + Lucide Icons + Glassmorphism
- **Database & Storage:** Supabase (PostgreSQL + Realtime + Storage) with local persistent fallback
- **Authentication:** `jose` (JWT) + `bcryptjs`
- **Code Editor:** `@monaco-editor/react`
- **AI:** Google Gemini API (`@google/generative-ai`)
- **PDF Parser:** `pdf-parse`

---

## 🚀 Quick Setup & Run Guide

### 1. Dependencies Install
```bash
npm install
```

### 2. Environment Variables (.env.local)
Create `.env.local` in project root:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google Gemini API Key (for PDF Chat)
GEMINI_API_KEY=your-gemini-api-key

# Session Secret Key
JWT_SECRET=meadowbell_shreya_shivam_dsa_secret_key_2025_secure
```

> 💡 *Note: Agar aapne abhi tak Supabase ya Gemini API keys create nahi ki hain, project tab bhi 100% chalega thanks to built-in local persistent store fallback!*

### 3. Supabase Tables Setup (1-Click SQL)
Supabase dashboard kholiye -> **SQL Editor** mein jaiye -> `supabase/schema.sql` file ka code paste karke **Run** kar dijiye.
Isme saari tables, indexes, realtime publications aur initial seed users (Shreya & Shivam with hashed passwords) automatic ban jayenge!

### 4. Run Development Server
```bash
npm run dev
```
Browser mein open karein: `http://localhost:3000`

Login karke study shuru karein! 🎉

