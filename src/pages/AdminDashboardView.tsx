import React, { useState } from 'react';
import { AIModelConfig } from '../types';
import { 
  ShieldCheck, 
  Cpu, 
  Users, 
  BookOpen, 
  Sliders, 
  CheckCircle2, 
  Activity, 
  Database,
  Save
} from 'lucide-react';

interface AdminDashboardViewProps {
  aiConfig: AIModelConfig;
  onUpdateAIConfig: (config: AIModelConfig) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  aiConfig,
  onUpdateAIConfig,
}) => {
  const [model, setModel] = useState(aiConfig.activeModel);
  const [temp, setTemp] = useState(aiConfig.temperature);
  const [topP, setTopP] = useState(aiConfig.topP);
  const [enableThinking, setEnableThinking] = useState(aiConfig.enableThinking);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAIConfig({
      activeModel: model,
      temperature: temp,
      topP: topP,
      enableThinking: enableThinking,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 border border-emerald-500/30 flex items-center justify-between">
        <div>
          <h1 className="font-poppins font-extrabold text-2xl text-white flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <span>Admin System & AI Model Management</span>
          </h1>
          <p className="text-xs text-slate-300">Configure Gemini model parameters, telemetry, user roles, and subjects</p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-emerald-300 font-mono">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>System Healthy • Latency 180ms</span>
        </div>
      </div>

      {/* System Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-emerald-500/20 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Total Active Users</span>
          <p className="font-poppins font-extrabold text-2xl text-white">1,420</p>
          <p className="text-[11px] text-emerald-400">1,280 Students • 140 Teachers</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-emerald-500/20 space-y-1">
          <span className="text-xs font-semibold text-slate-400">AI Diagnostics Run</span>
          <p className="font-poppins font-extrabold text-2xl text-purple-300">18,450</p>
          <p className="text-[11px] text-slate-400">99.8% Success Rate</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-emerald-500/20 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Configured Subjects</span>
          <p className="font-poppins font-extrabold text-2xl text-blue-300">4 Subjects</p>
          <p className="text-[11px] text-slate-400">Algebra, Geometry, Calculus, Physics</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-emerald-500/20 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Active AI Model</span>
          <p className="font-poppins font-bold text-base text-amber-300 truncate">{model}</p>
          <p className="text-[11px] text-slate-400">Gemini 3.6 Flash Engine</p>
        </div>
      </div>

      {/* AI Model Parameters Tuner */}
      <div className="glass-card rounded-3xl p-6 border border-emerald-500/20 space-y-6">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
          <Cpu className="w-5 h-5 text-emerald-400" />
          <h3 className="font-poppins font-bold text-base text-white">Gemini AI Model Hyperparameters</h3>
        </div>

        <form onSubmit={handleSaveConfig} className="space-y-6 max-w-2xl">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">AI Model Selector:</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full glass-input px-4 py-2.5 rounded-xl text-xs text-white border border-slate-700 font-mono"
            >
              <option value="gemini-3.6-flash">gemini-3.6-flash (Recommended for STEM Diagnostic & Reasoning)</option>
              <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Complex Mathematical Proofs)</option>
              <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Ultra Fast Latency)</option>
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Temperature (Creativity vs Determinism):</span>
              <span className="text-emerald-400 font-mono">{temp}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={temp}
              onChange={(e) => setTemp(parseFloat(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <p className="text-[11px] text-slate-500">Lower temperature (0.1 - 0.3) ensures precise mathematical evaluation.</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Top-P Sampling:</span>
              <span className="text-emerald-400 font-mono">{topP}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={topP}
              onChange={(e) => setTopP(parseFloat(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <input
              type="checkbox"
              id="thinking"
              checked={enableThinking}
              onChange={(e) => setEnableThinking(e.target.checked)}
              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
            />
            <label htmlFor="thinking" className="text-xs text-slate-300 font-semibold cursor-pointer">
              Enable Gemini Thinking / Deep Reasoning Mode for Complex Step Corrections
            </label>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center space-x-2 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{savedSuccess ? 'Settings Saved Successfully!' : 'Save AI Model Configuration'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
