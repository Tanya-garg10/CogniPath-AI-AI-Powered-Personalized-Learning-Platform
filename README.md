<div align="center">

# 🧠 CogniPath AI
### *AI-Powered Personalized Learning Platform & Cognitive Diagnostic Engine*

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Groq](https://img.shields.io/badge/AI_Engine-Groq_Llama--3.3-f34f29?logo=groq&logoColor=white)](https://groq.com/)
[![Gemini](https://img.shields.io/badge/AI_Engine-Google_Gemini_3.6-8E75B2?logo=google&logoColor=white)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

<br />

*CogniPath AI is an next-generation adaptive educational platform that diagnoses student mathematical & conceptual misconceptions in real-time using advanced Multimodal Large Language Models.*

</div>

## 🌟 Overview

Traditional learning platforms treat errors as simple right/wrong binary states. **CogniPath AI** goes deeper by identifying the **exact cognitive misconception** behind a student's mistake—whether it's a *Sign Error*, *Distribution Error*, *Formula Misuse*, or a fundamental *Conceptual Misunderstanding*.

By combining real-time step analysis, voice-dictated reasoning, dynamic gamification, and interactive study rooms, CogniPath AI delivers a truly personalized learning journey for students while giving teachers actionable classroom insights.

## 🏗️ System Architecture

```
                                  +---------------------------------------+
                                  |         CogniPath Frontend            |
                                  |  (React 19, Vite, Tailwind, Motion)   |
                                  +-------------------+-------------------+
                                                      |
                                       HTTP / REST    |   WebSockets
                                                      v
                                  +-------------------+-------------------+
                                  |         CogniPath Express Server      |
                                  |            (TypeScript / Node)        |
                                  +---------+-------------------+---------+
                                            |                   |
                           Primary Engine   |                   |  Fallback Engine
                                            v                   v
                               +------------+----+     +--------+------------+
                               |   Groq AI API   |     |  Google Gemini API  |
                               | (Llama-3.3-70B) |     |  (Gemini-3.6-Flash) |
                               +-----------------+     +---------------------+
```

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| 🧩 **Cognitive Diagnostic Engine** | Evaluates student problem-solving steps & voice reasoning to detect exact error categories (Sign Error, Distribution Error, etc.). |
| 🤖 **AI Tutor Studio** | Conversational AI math tutor providing step-by-step hints without spoiling answers directly. |
| ✏️ **Interactive Problem Solver** | Workspace for step-by-step mathematical problem solving with real-time feedback. |
| 📊 **Student Dashboard & Analytics** | Tracks progress, mastery levels, streak counters, and skill proficiency over time. |
| 👩‍🏫 **Teacher Dashboard** | View class-wide analytics, identify common misconceptions, and generate targeted assignments. |
| 🏆 **Gamification System** | Points, badges, achievements, and leaderboard mechanics to keep students motivated. |
| 👥 **Virtual Study Rooms** | Real-time collaborative environments with WebSocket support for group learning sessions. |

## 🔬 Diagnostic Categories

The AI Diagnostic Engine classifies student errors into 7 precise categories:

1. ➕ **Sign Error** – Incorrect handling of positive/negative signs (e.g., $-2 \times -3 = -6$).
2. 📐 **Formula Misuse** – Misapplying algebraic identities or equations.
3. 🔤 **Variable Confusion** – Combining non-like terms (e.g., $2x + 3 = 5x$).
4. 🔢 **Arithmetic Error** – Basic calculation mistakes (e.g., $7 \times 8 = 54$).
5. ✖️ **Distribution Error** – Failing to distribute across parentheses (e.g., $2(x+3) \to 2x+3$).
6. 💡 **Conceptual Misunderstanding** – Invalid operations like dividing by zero or illegal exponent rules.
7. ✅ **None** – Fully correct step execution.

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check & service status. |
| `POST` | `/api/analyze-solution` | Analyzes student solution steps & voice dictation for cognitive misconceptions. |

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite 6, Tailwind CSS 4, TypeScript, Recharts, Framer Motion, Lucide Icons
- **Backend:** Node.js, Express, WebSockets (`ws`)
- **AI Integrations:** `@google/genai` (Gemini API), `groq-sdk` (Groq API)
- **Tooling:** `tsx`, `esbuild`, `dotenv`

## 🚦 Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **bun** / **yarn**
- **API Keys**: At least one of the following:
  - [Groq API Key](https://console.groq.com/) *(Recommended for ultra-fast diagnostics)*
  - [Google Gemini API Key](https://aistudio.google.com/)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Tanya-garg10/CogniPath-AI-AI-Powered-Personalized-Learning-Platform.git
   cd CogniPath-AI-AI-Powered-Personalized-Learning-Platform
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the project root:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```

5. **Open in Browser:**
   Navigate to `http://localhost:3000`

## 📂 Directory Structure

```
CogniPath-AI/
├── src/
│   ├── components/        # Reusable UI components
│   ├── data/              # Mock datasets & initial states
│   ├── pages/             # Main application views
│   │   ├── AITutorStudioView.tsx
│   │   ├── AdminDashboardView.tsx
│   │   ├── GamificationView.tsx
│   │   ├── LandingPage.tsx
│   │   ├── ProblemSolverView.tsx
│   │   ├── StudentAnalyticsView.tsx
│   │   ├── StudentDashboard.tsx
│   │   ├── StudyRoomView.tsx
│   │   └── TeacherDashboardView.tsx
│   ├── App.tsx            # Main application router & state manager
│   ├── main.tsx           # React DOM entry point
│   ├── types.ts           # Global TypeScript interfaces
│   └── index.css          # Tailwind CSS imports & global styles
├── server.ts              # Express API & WebSocket backend
├── package.json           # Scripts & project dependencies
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite build settings
```

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

<div align="center">
  <sub>Built with ❤️ for personalized AI education.</sub>
</div>
