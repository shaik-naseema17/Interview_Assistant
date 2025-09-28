# Swipe Internship — AI-Powered Interview Assistant (Crisp)

## What this scaffold includes
- React + Vite app
- Redux + redux-persist for local persistence (IndexedDB / localStorage)
- Resume upload (PDF/DOCX) using `pdfjs-dist` for PDFs and `mammoth` for DOCX
- Interviewee chat with timers, 6 questions (2 easy, 2 medium, 2 hard)
- Interviewer dashboard listing candidates, scores, and detailed view
- Welcome Back modal for unfinished sessions
- Simple rule-based "AI" grader (keyword matching) so the app runs without an external API

## Setup
1. Extract the zip, `cd swipe-interview-assistant`
2. Install deps: `npm install`
3. Run dev server: `npm run dev`
4. Open the app at `http://localhost:5173`

## Notes
- The AI grading is a simple heuristic so the app works without API keys. Replace `src/utils/ai.js` with OpenAI calls if you want real LLM judgment.
- Persistence is managed by redux-persist; clearing browser storage will remove saved state.
