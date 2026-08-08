import React from 'react';
import { MisconceptionResult } from '../types';
import { AlertTriangle, Sparkles, Brain, CheckCircle2, ArrowRight, ShieldAlert, Target } from 'lucide-react';

interface MisconceptionCardProps {
  result: MisconceptionResult;
  onOpenAITutor: () => void;
}

export const MisconceptionCard: React.FC<MisconceptionCardProps> = ({
  result,
  onOpenAITutor,
}) => {
  if (!result.hasMisconception) {
    return (
      <div className="glass-card rounded-2xl p-5 border border-emerald-500/30 bg-emerald-950/20 shadow-xl">
        <div className="flex items-center space-x-3 text-emerald-400">
          <CheckCircle2 className="w-6 h-6" />
          <div>
            <h4 className="font-poppins font-bold text-base text-white">All Steps Mathematically Correct!</h4>
            <p className="text-xs text-slate-300">No misconceptions detected. Great execution and accuracy!</p>
          </div>
        </div>
      </div>
    );
  }

  const misconceptionColors: Record<string, { badge: string; border: string; glow: string }> = {
    'Distribution Error': { badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40', border: 'border-purple-500/40', glow: 'shadow-purple-500/10' },
    'Sign Error': { badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40', border: 'border-amber-500/40', glow: 'shadow-amber-500/10' },
    'Variable Confusion': { badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40', border: 'border-blue-500/40', glow: 'shadow-blue-500/10' },
    'Formula Misuse': { badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40', border: 'border-rose-500/40', glow: 'shadow-rose-500/10' },
    'Arithmetic Error': { badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40', border: 'border-indigo-500/40', glow: 'shadow-indigo-500/10' },
    'Conceptual Misunderstanding': { badge: 'bg-pink-500/20 text-pink-300 border-pink-500/40', border: 'border-pink-500/40', glow: 'shadow-pink-500/10' },
  };

  const style = misconceptionColors[result.misconceptionType] || {
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    border: 'border-purple-500/40',
    glow: 'shadow-purple-500/10',
  };

  return (
    <div className={`glass-card rounded-2xl p-5 border ${style.border} shadow-2xl ${style.glow} relative overflow-hidden transition-all animate-in fade-in slide-in-from-bottom-2`}>
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Badge Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center space-x-1.5 ${style.badge}`}>
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Misconception Detected: {result.misconceptionType}</span>
          </span>
          <span className="px-2.5 py-1 rounded-full bg-slate-900/80 text-slate-300 text-xs font-semibold border border-slate-800">
            Step {result.failedStepIndex} Mistake
          </span>
        </div>

        {/* Confidence Score Bar */}
        <div className="flex items-center space-x-2 bg-slate-950/80 px-3 py-1 rounded-full border border-slate-800">
          <Brain className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-[11px] font-semibold text-slate-400">AI Confidence:</span>
          <span className="text-xs font-bold text-purple-300">{result.confidenceScore}%</span>
        </div>
      </div>

      {/* Main Content Details */}
      <div className="space-y-3 mt-2">
        {result.failedStepContent && (
          <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800/80 font-mono text-xs text-rose-300">
            <span className="text-slate-500 mr-2">Failed Step Output:</span>
            "{result.failedStepContent}"
          </div>
        )}

        <div>
          <p className="text-sm text-slate-200 font-medium leading-relaxed">{result.explanationText}</p>
          <div className="mt-2 flex items-start space-x-2 text-xs text-slate-400">
            <Target className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <p><span className="font-semibold text-purple-300">Cognitive Root Cause:</span> {result.rootCause}</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <span className="text-xs text-slate-400">Personalized AI Tutor micro-lesson ready</span>
          <button
            onClick={onOpenAITutor}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-purple-500/20 flex items-center space-x-2 transition-all group"
          >
            <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
            <span>Launch AI Tutor Support</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
