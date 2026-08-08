import React, { useState } from 'react';
import { User, NotificationItem } from '../types';
import { 
  Sparkles, 
  Flame, 
  Award, 
  Bell, 
  User as UserIcon, 
  Shield, 
  GraduationCap, 
  BookOpen, 
  LogOut, 
  CheckCircle2, 
  ChevronDown,
  Brain,
  Sliders,
  Bot
} from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  onRoleChange: (role: 'student' | 'teacher' | 'admin') => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  activeView: string;
  onNavigate: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onRoleChange,
  notifications,
  onMarkNotificationRead,
  activeView,
  onNavigate,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <nav className="sticky top-0 z-40 glass-nav px-4 lg:px-8 py-3 flex items-center justify-between">
      {/* Brand & Logo */}
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('landing')}>
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 shadow-lg shadow-purple-500/20">
          <Brain className="w-6 h-6 text-white" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-poppins font-bold text-xl tracking-tight text-white">
              Cogni<span className="gradient-text">Path</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              AI Tutor
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium hidden md:block">The Misconception Mapper</p>
        </div>
      </div>

      {/* Center Nav Quick Links */}
      <div className="hidden md:flex items-center space-x-1 bg-slate-900/60 p-1 rounded-xl border border-white/5">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeView === 'dashboard' ? 'bg-purple-600/30 text-purple-200 border border-purple-500/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Student Hub
        </button>
        <button
          onClick={() => onNavigate('solver')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1 ${
            activeView === 'solver' ? 'bg-purple-600/30 text-purple-200 border border-purple-500/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>AI Problem Solver</span>
        </button>
        <button
          onClick={() => onNavigate('tutor')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1 ${
            activeView === 'tutor' ? 'bg-purple-600/30 text-purple-200 border border-purple-500/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bot className="w-3.5 h-3.5 text-purple-400" />
          <span>AI Tutor Studio</span>
        </button>
        <button
          onClick={() => onNavigate('teacher')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeView === 'teacher' ? 'bg-purple-600/30 text-purple-200 border border-purple-500/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Teacher Portal
        </button>
        <button
          onClick={() => onNavigate('admin')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeView === 'admin' ? 'bg-purple-600/30 text-purple-200 border border-purple-500/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Admin
        </button>
      </div>

      {/* Right Stats & Profile Control */}
      <div className="flex items-center space-x-3">
        {/* Streak & XP Counters (for Students) */}
        {currentUser.role === 'student' && (
          <div className="hidden sm:flex items-center space-x-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-1 text-amber-400" title="Daily Streak">
              <Flame className="w-4 h-4 fill-amber-400 animate-bounce" />
              <span className="text-xs font-bold">{currentUser.streak}d</span>
            </div>
            <div className="h-3 w-px bg-slate-800" />
            <div className="flex items-center space-x-1 text-purple-400" title="Total XP">
              <Award className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold">{currentUser.xp} XP</span>
            </div>
          </div>
        )}

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-purple-500/40 transition-all"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 glass-card rounded-2xl shadow-2xl p-4 border border-purple-500/20 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Notifications</span>
                <span className="text-[11px] text-purple-400 font-medium">{unreadCount} unread</span>
              </div>
              <div className="mt-2 space-y-2 max-h-64 overflow-y-auto pr-1">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => onMarkNotificationRead(n.id)}
                    className={`p-2.5 rounded-xl text-xs cursor-pointer transition-all border ${
                      n.read ? 'bg-slate-900/40 border-slate-800/60 text-slate-400' : 'bg-purple-950/30 border-purple-500/30 text-slate-200 font-medium'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-semibold text-purple-300">{n.title}</span>
                      <span className="text-[10px] text-slate-500">{n.timestamp}</span>
                    </div>
                    <p className="mt-1 text-slate-300 leading-snug">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher & User Profile Pill */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center space-x-2 bg-slate-900/90 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-800 transition-all"
          >
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
              alt={currentUser.name}
              className="w-6 h-6 rounded-full object-cover ring-2 ring-purple-500/50"
            />
            <div className="text-left hidden lg:block">
              <p className="text-xs font-semibold text-white leading-tight">{currentUser.name}</p>
              <p className="text-[10px] text-purple-400 capitalize">{currentUser.role} Mode</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-56 glass-card rounded-2xl shadow-2xl p-2 border border-purple-500/20 z-50">
              <div className="px-3 py-2 border-b border-slate-800">
                <p className="text-xs font-bold text-slate-200">{currentUser.name}</p>
                <p className="text-[11px] text-slate-400">{currentUser.email}</p>
              </div>

              <div className="pt-2 text-xs font-semibold text-slate-400 px-3 uppercase tracking-wider text-[10px]">
                Switch Persona Role
              </div>

              <div className="mt-1 space-y-1">
                <button
                  onClick={() => {
                    onRoleChange('student');
                    setShowRoleMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                    currentUser.role === 'student' ? 'bg-purple-600/30 text-purple-200 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-purple-400" />
                    <span>Student View</span>
                  </div>
                  {currentUser.role === 'student' && <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />}
                </button>

                <button
                  onClick={() => {
                    onRoleChange('teacher');
                    setShowRoleMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                    currentUser.role === 'teacher' ? 'bg-purple-600/30 text-purple-200 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-blue-400" />
                    <span>Teacher View</span>
                  </div>
                  {currentUser.role === 'teacher' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                </button>

                <button
                  onClick={() => {
                    onRoleChange('admin');
                    setShowRoleMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                    currentUser.role === 'admin' ? 'bg-purple-600/30 text-purple-200 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>Admin Portal</span>
                  </div>
                  {currentUser.role === 'admin' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    onNavigate('settings');
                    setShowRoleMenu(false);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>AI & System Settings</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
