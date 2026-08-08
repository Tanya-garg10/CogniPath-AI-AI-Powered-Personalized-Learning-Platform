import React, { useState } from 'react';
import { User, AIModelConfig } from '../types';
import { Settings as SettingsIcon, User as UserIcon, Volume2, Moon, Sun, Bell, Save, Check } from 'lucide-react';

interface SettingsViewProps {
  user: User;
  aiConfig: AIModelConfig;
  theme: 'midnight' | 'eclipse';
  onThemeChange: (theme: 'midnight' | 'eclipse') => void;
  onUpdateUser: (updated: Partial<User>) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ 
  user, 
  aiConfig, 
  theme, 
  onThemeChange, 
  onUpdateUser 
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [grade, setGrade] = useState(user.grade || 'Grade 9 - Algebra I');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ name, email, grade });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 border border-purple-500/30 flex items-center justify-between">
        <div>
          <h1 className="font-poppins font-extrabold text-2xl text-white flex items-center space-x-2">
            <SettingsIcon className="w-6 h-6 text-purple-400" />
            <span>Profile & Application Settings</span>
          </h1>
          <p className="text-xs text-slate-300">Manage persona account information and AI tutor accessibility</p>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="glass-card rounded-3xl p-6 sm:p-8 border border-purple-500/20 space-y-6">
        <div className="space-y-4">
          <h3 className="font-poppins font-bold text-base text-white flex items-center space-x-2 border-b border-slate-800 pb-2">
            <UserIcon className="w-4 h-4 text-purple-400" />
            <span>Personal Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Full Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-white border border-slate-700"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Email Address:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-white border border-slate-700"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="font-semibold text-slate-300">Grade / Course Enrolled:</label>
              <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-white border border-slate-700"
              />
            </div>
          </div>
        </div>

        {/* Accessibility Theme Preference */}
        <div className="space-y-4 pt-2">
          <h3 className="font-poppins font-bold text-base text-white flex items-center space-x-2 border-b border-slate-800 pb-2">
            <Moon className="w-4 h-4 text-purple-400" />
            <span>Display Contrast & Accessibility Theme</span>
          </h3>
          <p className="text-xs text-slate-300">
            Select your preferred viewing contrast mode. Your choice is automatically saved and persisted across study sessions.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Midnight Mode Card */}
            <button
              type="button"
              onClick={() => onThemeChange('midnight')}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between space-y-3 cursor-pointer ${
                theme === 'midnight'
                  ? 'bg-slate-950 border-purple-500 ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/20'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Midnight Mode</h4>
                    <span className="text-[10px] font-mono text-purple-400 font-semibold">High Contrast</span>
                  </div>
                </div>
                {theme === 'midnight' && (
                  <span className="p-1 rounded-full bg-purple-600 text-white">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Deep space black canvas with crisp, vivid borders and maximum legibility text for clear contrast.
              </p>
              <div className="p-2.5 rounded-xl bg-[#030712] border border-purple-500/40 text-[11px] font-mono flex items-center justify-between text-slate-200">
                <span>Canvas: #030712</span>
                <span className="text-purple-300 font-bold">Contrast 14:1</span>
              </div>
            </button>

            {/* Eclipse Mode Card */}
            <button
              type="button"
              onClick={() => onThemeChange('eclipse')}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between space-y-3 cursor-pointer ${
                theme === 'eclipse'
                  ? 'bg-slate-800/90 border-indigo-400 ring-2 ring-indigo-400/50 shadow-lg shadow-indigo-500/20'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Eclipse Mode</h4>
                    <span className="text-[10px] font-mono text-indigo-300 font-semibold">Softer Eye Care</span>
                  </div>
                </div>
                {theme === 'eclipse' && (
                  <span className="p-1 rounded-full bg-indigo-500 text-white">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Soft slate background with gentle gradient tones and reduced contrast glare for relaxed low-eyestrain studying.
              </p>
              <div className="p-2.5 rounded-xl bg-[#1e293b] border border-slate-600/50 text-[11px] font-mono flex items-center justify-between text-slate-200">
                <span>Canvas: #1e293b</span>
                <span className="text-indigo-300 font-bold">Soft Comfort</span>
              </div>
            </button>
          </div>
        </div>

        {/* Accessibility & Voice Preferences */}
        <div className="space-y-4 pt-2">
          <h3 className="font-poppins font-bold text-base text-white flex items-center space-x-2 border-b border-slate-800 pb-2">
            <Volume2 className="w-4 h-4 text-purple-400" />
            <span>Accessibility & Voice Assistant</span>
          </h3>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
            <div>
              <p className="font-semibold text-white">Speech Synthesis Audio Explanations</p>
              <p className="text-slate-400 mt-0.5">Allow AI Tutor to read micro-lessons and feedback out loud</p>
            </div>
            <input
              type="checkbox"
              checked={voiceEnabled}
              onChange={(e) => setVoiceEnabled(e.target.checked)}
              className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* AI Engine & API Status */}
        <div className="space-y-4 pt-2">
          <h3 className="font-poppins font-bold text-base text-white flex items-center space-x-2 border-b border-slate-800 pb-2">
            <SettingsIcon className="w-4 h-4 text-emerald-400" />
            <span>AI Diagnostic Engine Integration</span>
          </h3>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-white text-sm">Groq AI API Active</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 font-mono text-[11px] border border-emerald-500/30 font-semibold">
                GROQ_API_KEY
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              All diagnostic step evaluations, misconception analysis, and interactive tutoring hints are powered by Groq SDK using <strong>llama-3.3-70b-versatile</strong> and <strong>llama-3.2-11b-vision-preview</strong> models.
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 flex items-center space-x-2 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{savedSuccess ? 'Profile Updated!' : 'Save Settings'}</span>
        </button>
      </form>
    </div>
  );
};
