import React, { useState } from 'react';
import { User, UserRole, MathProblem, StudentMistakeLog, NotificationItem, AIModelConfig, MisconceptionResult, AITutorExplanation } from './types';
import { INITIAL_USER, SAMPLE_PROBLEMS, MOCK_MISTAKE_LOGS, MOCK_CLASS_STATS, INITIAL_NOTIFICATIONS, INITIAL_AI_CONFIG } from './data/mockData';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { ProblemSolverView } from './pages/ProblemSolverView';
import { AITutorStudioView } from './pages/AITutorStudioView';
import { StudentAnalyticsView } from './pages/StudentAnalyticsView';
import { TeacherDashboardView } from './pages/TeacherDashboardView';
import { AdminDashboardView } from './pages/AdminDashboardView';
import { RecommendationsView } from './pages/RecommendationsView';
import { GamificationView } from './pages/GamificationView';
import { SettingsView } from './pages/SettingsView';
import { StudyRoomView } from './pages/StudyRoomView';
import { AITutorModal } from './components/AITutorModal';

export default function App() {
  const [activeView, setActiveView] = useState<string>('landing');
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USER);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [aiConfig, setAiConfig] = useState<AIModelConfig>(INITIAL_AI_CONFIG);

  // Persistent Theme State ('midnight' | 'eclipse')
  const [theme, setTheme] = useState<'midnight' | 'eclipse'>(() => {
    const saved = localStorage.getItem('cognipath_theme');
    return saved === 'eclipse' ? 'eclipse' : 'midnight';
  });

  const handleThemeChange = (newTheme: 'midnight' | 'eclipse') => {
    setTheme(newTheme);
    localStorage.setItem('cognipath_theme', newTheme);
  };

  const [currentProblem, setCurrentProblem] = useState<MathProblem>(SAMPLE_PROBLEMS[0]);
  const [mistakeLogs, setMistakeLogs] = useState<StudentMistakeLog[]>(MOCK_MISTAKE_LOGS);

  // Global AI Tutor Modal state (e.g. launched from dashboard or recent mistakes)
  const [globalTutorExplanation, setGlobalTutorExplanation] = useState<AITutorExplanation | null>(null);
  const [isGlobalTutorLoading, setIsGlobalTutorLoading] = useState<boolean>(false);
  const [showGlobalTutorModal, setShowGlobalTutorModal] = useState<boolean>(false);

  const handleRoleChange = (role: UserRole) => {
    setCurrentUser((prev) => ({
      ...prev,
      role: role,
      name: role === 'student' ? 'Alex Rivera' : role === 'teacher' ? 'Dr. Sarah Connor' : 'System Admin',
    }));

    if (role === 'student' && activeView !== 'solver') setActiveView('dashboard');
    if (role === 'teacher') setActiveView('teacher');
    if (role === 'admin') setActiveView('admin');
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleFinishSolving = (xpGained: number) => {
    setCurrentUser((prev) => ({
      ...prev,
      xp: prev.xp + xpGained,
    }));
  };

  const handleOpenAITutorForMistake = async (log: StudentMistakeLog) => {
    setShowGlobalTutorModal(true);
    setIsGlobalTutorLoading(true);

    try {
      const response = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          misconceptionType: log.misconceptionType,
          problemEquation: log.problemTitle,
          studentAttempt: log.stepDetails,
        }),
      });

      const data = await response.json();
      setGlobalTutorExplanation(data);
    } catch (err) {
      console.error('Failed to load tutor for log:', err);
    } finally {
      setIsGlobalTutorLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${
      theme === 'midnight'
        ? 'bg-gradient-to-br from-[#030712] via-[#090d16] to-[#0f172a] text-slate-100'
        : 'bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] text-slate-200'
    } theme-${theme} font-['Inter',sans-serif] flex flex-col selection:bg-purple-500 selection:text-white transition-colors duration-300`}>
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onRoleChange={handleRoleChange}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        activeView={activeView}
        onNavigate={setActiveView}
      />

      {/* Main Container Layout */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <Sidebar
          activeView={activeView}
          onNavigate={setActiveView}
          userRole={currentUser.role}
          streak={currentUser.streak}
        />

        {/* Page View Body */}
        <main className="flex-1 py-6 overflow-y-auto min-h-[calc(100vh-65px)]">
          {activeView === 'landing' && (
            <LandingPage
              onNavigate={setActiveView}
              onRoleSelect={handleRoleChange}
            />
          )}

          {activeView === 'dashboard' && (
            <StudentDashboard
              user={currentUser}
              mistakeLogs={mistakeLogs}
              sampleProblems={SAMPLE_PROBLEMS}
              onNavigate={setActiveView}
              onSelectProblem={setCurrentProblem}
              onOpenAITutorForMistake={handleOpenAITutorForMistake}
              onGainXP={handleFinishSolving}
            />
          )}

          {activeView === 'solver' && (
            <ProblemSolverView
              currentProblem={currentProblem}
              onSelectProblem={setCurrentProblem}
              allProblems={SAMPLE_PROBLEMS}
              onFinishSolving={handleFinishSolving}
            />
          )}

          {activeView === 'tutor' && (
            <AITutorStudioView
              user={currentUser}
              onNavigate={setActiveView}
            />
          )}

          {activeView === 'studyroom' && (
            <StudyRoomView
              user={currentUser}
              onNavigate={setActiveView}
              onGainXP={handleFinishSolving}
            />
          )}

          {activeView === 'analytics' && <StudentAnalyticsView onNavigate={setActiveView} />}

          {activeView === 'teacher' && (
            <TeacherDashboardView
              stats={MOCK_CLASS_STATS}
              mistakeLogs={mistakeLogs}
            />
          )}

          {activeView === 'admin' && (
            <AdminDashboardView
              aiConfig={aiConfig}
              onUpdateAIConfig={setAiConfig}
            />
          )}

          {activeView === 'recommendations' && (
            <RecommendationsView onNavigate={setActiveView} />
          )}

          {activeView === 'gamification' && <GamificationView user={currentUser} />}

          {activeView === 'settings' && (
            <SettingsView
              user={currentUser}
              aiConfig={aiConfig}
              theme={theme}
              onThemeChange={handleThemeChange}
              onUpdateUser={(updated) => setCurrentUser((prev) => ({ ...prev, ...updated }))}
            />
          )}
        </main>
      </div>

      {/* Global AI Tutor Modal */}
      {showGlobalTutorModal && (
        <AITutorModal
          explanation={globalTutorExplanation}
          onClose={() => setShowGlobalTutorModal(false)}
          isLoading={isGlobalTutorLoading}
        />
      )}
    </div>
  );
}

