import React from 'react';
import { UserRole } from '../types';
import { 
  LayoutDashboard, 
  Sparkles, 
  Bot, 
  BarChart3, 
  Compass, 
  Trophy, 
  Users, 
  Settings as SettingsIcon,
  Home,
  Flame,
  Award,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  userRole: UserRole;
  streak: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onNavigate,
  userRole,
  streak,
}) => {
  const studentItems = [
    { id: 'dashboard', label: 'Student Hub', icon: LayoutDashboard },
    { id: 'solver', label: 'AI Problem Solver', icon: Sparkles, badge: 'AI' },
    { id: 'tutor', label: 'AI Tutor Studio', icon: Bot },
    { id: 'studyroom', label: 'Virtual Study Room', icon: Users, badge: 'LIVE' },
    { id: 'analytics', label: 'My Analytics', icon: BarChart3 },
    { id: 'recommendations', label: 'Adaptive Path', icon: Compass },
    { id: 'gamification', label: 'Streak & Badges', icon: Trophy },
  ];

  const teacherItems = [
    { id: 'teacher', label: 'Class Performance', icon: Users },
    { id: 'analytics', label: 'Misconception Matrix', icon: BarChart3 },
    { id: 'recommendations', label: 'Assignments Engine', icon: Compass },
  ];

  const adminItems = [
    { id: 'admin', label: 'System Overview', icon: LayoutDashboard },
    { id: 'settings', label: 'AI Model Config', icon: SettingsIcon },
  ];

  let currentItems = studentItems;
  if (userRole === 'teacher') currentItems = teacherItems;
  if (userRole === 'admin') currentItems = adminItems;

  return (
    <aside className="w-64 glass-card border-r border-white/5 flex flex-col justify-between hidden lg:flex shrink-0 min-h-[calc(100vh-65px)]">
      <div className="p-4 space-y-6">
        {/* Navigation Group */}
        <div>
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Main Navigation ({userRole})
          </p>
          <nav className="space-y-1">
            <button
              onClick={() => onNavigate('landing')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeView === 'landing'
                  ? 'bg-purple-600/30 text-purple-200 border border-purple-500/30 shadow-lg shadow-purple-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Home className="w-4 h-4 text-purple-400" />
                <span>Landing Overview</span>
              </div>
            </button>

            {currentItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600/40 to-indigo-600/40 text-white border border-purple-500/40 shadow-lg shadow-purple-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-purple-300' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-purple-500 text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Tools */}
        <div>
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Preferences & System
          </p>
          <nav className="space-y-1">
            <button
              onClick={() => onNavigate('settings')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeView === 'settings'
                  ? 'bg-purple-600/30 text-purple-200 border border-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <SettingsIcon className="w-4 h-4 text-slate-500" />
              <span>AI Models & Settings</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="p-4 border-t border-slate-800/80">
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-500/30 shadow-inner text-center">
          <div className="flex items-center justify-center space-x-1.5 text-amber-400 mb-1">
            <Flame className="w-4 h-4 animate-bounce" />
            <span className="text-xs font-bold">{streak}-Day Learning Streak!</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-tight">
            "Wrong answers are learning signals."
          </p>
          <button
            onClick={() => onNavigate('solver')}
            className="mt-2.5 w-full py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-all flex items-center justify-center space-x-1"
          >
            <span>Solve New Problem</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
