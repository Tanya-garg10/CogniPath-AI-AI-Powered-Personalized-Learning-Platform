import React, { useState } from 'react';
import { 
  Sparkles, 
  Brain, 
  Target, 
  CheckCircle2, 
  ArrowRight, 
  GraduationCap, 
  Users, 
  ShieldCheck, 
  Flame, 
  BarChart3, 
  Layers, 
  BookOpen,
  Play
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: string) => void;
  onRoleSelect: (role: 'student' | 'teacher' | 'admin') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onRoleSelect,
}) => {
  const [demoInput, setDemoInput] = useState('2x + 3 = 10');
  const [demoResult, setDemoResult] = useState<string | null>(null);

  const handleTestDemo = () => {
    if (demoInput.includes('2x + 3')) {
      setDemoResult('Distribution Error detected! You expanded 2(x+3) into 2x+3 instead of 2x+6.');
    } else if (demoInput.includes('-6x - 12')) {
      setDemoResult('Sign Error detected! (-3) × (-4) should equal +12, not -12.');
    } else {
      setDemoResult('Solution step analyzed! AI Tutor is ready to map cognitive pathways.');
    }
  };

  return (
    <div className="space-y-16 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 text-center space-y-6">
        {/* Background Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-card border border-purple-500/30 text-purple-300 text-xs font-semibold shadow-lg shadow-purple-500/10">
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
          <span>Next-Gen Adaptive Learning Platform</span>
        </div>

        <h1 className="font-poppins font-extrabold text-4xl sm:text-6xl tracking-tight text-white max-w-4xl mx-auto leading-tight">
          "Wrong answers are <span className="gradient-text">learning signals</span>."
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          CogniPath goes beyond simple right or wrong checks. We detect <span className="text-purple-300 font-semibold">WHY</span> students make mistakes by identifying cognitive misconceptions in real-time.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => {
              onRoleSelect('student');
              onNavigate('solver');
            }}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-poppins font-bold text-sm shadow-xl shadow-purple-500/25 flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>Try AI Problem Solver</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              onRoleSelect('student');
              onNavigate('dashboard');
            }}
            className="px-6 py-3.5 rounded-2xl glass-card hover:bg-slate-800 text-slate-200 font-poppins font-semibold text-sm border border-slate-700 transition-all"
          >
            Explore Student Hub
          </button>
        </div>
      </section>

      {/* Interactive Mini Demo */}
      <section className="glass-card rounded-3xl p-6 sm:p-8 border border-purple-500/30 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="w-6 h-6 text-purple-400" />
              <h3 className="font-poppins font-bold text-lg text-white">Live Misconception Mapper Playground</h3>
            </div>
            <span className="text-xs text-purple-400 font-mono">Problem: 2(x + 3) = 10</span>
          </div>

          <p className="text-xs text-slate-400">Type a student's step 1 expansion below to simulate real-time AI misconception detection:</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={demoInput}
              onChange={(e) => setDemoInput(e.target.value)}
              placeholder="e.g. 2x + 3 = 10"
              className="flex-1 glass-input px-4 py-3 rounded-xl text-sm font-mono border border-slate-700 focus:border-purple-500 text-white"
            />
            <button
              onClick={handleTestDemo}
              className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all flex items-center justify-center space-x-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Analyze Step</span>
            </button>
          </div>

          {demoResult && (
            <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/40 text-xs text-purple-200 animate-in fade-in">
              <span className="font-bold text-amber-300 mr-2">⚡ AI Misconception Diagnosis:</span>
              {demoResult}
            </div>
          )}
        </div>
      </section>

      {/* Core Misconception Categories Grid */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="font-poppins font-bold text-2xl text-white">6 Core Cognitive Misconceptions Mapped</h2>
          <p className="text-xs text-slate-400">Precision diagnostics across fundamental mathematical operations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'Distribution Error', desc: 'Forgetting to multiply all terms inside brackets, e.g. 2(x+3) → 2x + 3', color: 'border-purple-500/30' },
            { title: 'Sign Error', desc: 'Flipping signs during expansion or equation balancing, e.g. (-3) × (-4) = -12', color: 'border-amber-500/30' },
            { title: 'Variable Confusion', desc: 'Combining non-like terms incorrectly, e.g. 2x + 3 = 5x', color: 'border-blue-500/30' },
            { title: 'Formula Misuse', desc: 'Applying quadratic or algebraic identity formulas incorrectly', color: 'border-rose-500/30' },
            { title: 'Arithmetic Error', desc: 'Basic computation slips like 7 × 8 = 54', color: 'border-indigo-500/30' },
            { title: 'Conceptual Misunderstanding', desc: 'Flawed logic when isolating variables or handling division', color: 'border-emerald-500/30' },
          ].map((m, idx) => (
            <div key={idx} className={`glass-card glass-card-hover rounded-2xl p-5 border ${m.color} space-y-2`}>
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-purple-400" />
                <h4 className="font-poppins font-bold text-sm text-white">{m.title}</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Role Selection Gateway */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="font-poppins font-bold text-2xl text-white">Experience CogniPath by Role</h2>
          <p className="text-xs text-slate-400">Switch instantly to explore student, teacher, or admin features</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={() => {
              onRoleSelect('student');
              onNavigate('dashboard');
            }}
            className="glass-card glass-card-hover rounded-3xl p-6 border border-purple-500/30 cursor-pointer space-y-4 text-center group"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center mx-auto text-purple-300 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-poppins font-bold text-base text-white">Student Dashboard</h3>
              <p className="text-xs text-slate-400 mt-1">Interactive whiteboard, step-by-step solver, streaks, and AI tutor support.</p>
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-purple-400 group-hover:translate-x-1 transition-transform">
              Launch Student Mode <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </span>
          </div>

          <div
            onClick={() => {
              onRoleSelect('teacher');
              onNavigate('teacher');
            }}
            className="glass-card glass-card-hover rounded-3xl p-6 border border-blue-500/30 cursor-pointer space-y-4 text-center group"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center mx-auto text-blue-300 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-poppins font-bold text-base text-white">Teacher Portal</h3>
              <p className="text-xs text-slate-400 mt-1">Class misconception heatmaps, individual student reports, and practice assigner.</p>
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">
              Launch Teacher Portal <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </span>
          </div>

          <div
            onClick={() => {
              onRoleSelect('admin');
              onNavigate('admin');
            }}
            className="glass-card glass-card-hover rounded-3xl p-6 border border-emerald-500/30 cursor-pointer space-y-4 text-center group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-300 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-poppins font-bold text-base text-white">Admin Hub</h3>
              <p className="text-xs text-slate-400 mt-1">Manage users, subjects, tune Gemini model parameters, and monitor system metrics.</p>
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
              Launch Admin Hub <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
