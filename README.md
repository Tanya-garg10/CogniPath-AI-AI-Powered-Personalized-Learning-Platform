<div align="center">
  <img src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" width="100%" alt="CogniPath AI Banner" />
  <h1>CogniPath AI</h1>
  <p><strong>AI-Powered Personalized Learning Platform & Cognitive Diagnostic Engine</strong></p>
</div>

CogniPath AI is an intelligent, personalized learning platform that adapts to a student's learning pace and style. By utilizing advanced AI models (Groq Llama-3.3 and Google Gemini), it dynamically identifies cognitive misconceptions, tracks learning analytics, and provides tailored educational paths to help users achieve their learning goals more effectively.

---

## 🚀 Key Features

- **🧠 Real-Time Cognitive Diagnostic Engine**
  - Analyzes step-by-step problem-solving (written and dictated verbal reasoning).
  - Categorizes mistakes into specific cognitive misconceptions (e.g., *Sign Error*, *Distribution Error*, *Conceptual Misunderstanding*).
- **🎓 AI Tutor Studio & Problem Solver**
  - Interactive environments for students to solve math problems with live AI guidance.
- **📊 Comprehensive Dashboards**
  - **Student Dashboard:** View learning paths, analytics, and track progress.
  - **Teacher Dashboard:** Monitor student performance, identify class-wide misconceptions, and adapt teaching strategies.
  - **Admin Dashboard:** Platform management and insights.
- **🎮 Gamification & Study Rooms**
  - Built-in gamified elements to keep students engaged.
  - Virtual study rooms for focused, collaborative, or guided learning.
- **⚡ Dual AI Engine Architecture**
  - Uses **Groq Llama-3.3-70B** for lightning-fast primary cognitive analysis.
  - Gracefully falls back to **Google Gemini** for robust multimodal generation.

---

## 🛠️ Technology Stack

- **Frontend:** React, Vite, Tailwind CSS, TypeScript, Framer Motion, Recharts, Lucide Icons.
- **Backend:** Node.js, Express, WebSockets (for real-time communication).
- **AI/LLMs:** 
  - `@google/genai` (Google Gemini API)
  - `groq-sdk` (Groq Llama API)

---

## 🚦 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v18+ recommended)
- A Groq API Key and/or Google Gemini API Key.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Tanya-garg10/CogniPath-AI-AI-Powered-Personalized-Learning-Platform.git
   cd CogniPath-AI-AI-Powered-Personalized-Learning-Platform
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` or `.env.local` file in the root directory (you can use `.env.example` as a reference) and add your API keys:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   GROQ_API_KEY=your_groq_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   Open your browser and navigate to `http://localhost:3000` (or the port specified in your console).

---

## 📂 Project Structure

- `/src/pages`: Contains the main views (`StudentDashboard`, `TeacherDashboardView`, `ProblemSolverView`, `GamificationView`, etc.)
- `/src/components`: Reusable UI components.
- `/server.ts`: Express backend serving the API and WebSocket connections.
- `/src/App.tsx`: Main routing and layout.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
