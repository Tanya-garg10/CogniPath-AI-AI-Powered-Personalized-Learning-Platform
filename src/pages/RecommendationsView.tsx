import React from 'react';
import { Compass, Target, Calendar, CheckCircle2, Zap, ArrowRight, BookOpen } from 'lucide-react';

interface RecommendationsViewProps {
  onNavigate: (view: string) => void;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({ onNavigate }) => {
  const recommendations = [
    {
      id: 1,
      title: 'Distributive Expansion with Negative Terms',
      reason: 'Based on recent 2(x+3)=10 error, master negative multipliers like -3(2x-4).',
      difficulty: 'Medium',
      estTime: '10 mins',
      xpReward: 150,
      status: 'Recommended Next',
    },
    {
      id: 2,
      title: 'Sign Operations across Equal Signs',
      reason: 'Flipping positive and negative terms when isolating variables.',
      difficulty: 'Easy',
      estTime: '8 mins',
      xpReward: 100,
      status: 'Queued',
    },
    {
      id: 3,
      title: 'Combining Like Terms in Polynomials',
      reason: 'Prevent variable confusion when dealing with coefficients.',
      difficulty: 'Hard',
      estTime: '15 mins',
      xpReward: 250,
      status: 'Queued',
    },
  ];

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 border border-purple-500/30 flex items-center justify-between">
        <div>
          <h1 className="font-poppins font-extrabold text-2xl text-white flex items-center space-x-2">
            <Compass className="w-6 h-6 text-purple-400" />
            <span>AI Adaptive Path & Recommendations</span>
          </h1>
          <p className="text-xs text-slate-300">Dynamically generated based on your misconception logs and response times</p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-200 text-xs font-bold">
          Daily Goal: 3/5 Exercises
        </div>
      </div>

      {/* Recommended Queue */}
      <div className="space-y-4">
        <h3 className="font-poppins font-bold text-lg text-white">Personalized Exercise Queue</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map((rec) => (
            <div key={rec.id} className="glass-card glass-card-hover rounded-3xl p-6 border border-purple-500/30 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {rec.status}
                  </span>
                  <span className="text-xs text-amber-400 font-bold">+{rec.xpReward} XP</span>
                </div>
                <h4 className="font-poppins font-bold text-base text-white">{rec.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{rec.reason}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Difficulty: {rec.difficulty}</span>
                  <span>Est. Time: {rec.estTime}</span>
                </div>
                <button
                  onClick={() => onNavigate('solver')}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 flex items-center justify-center space-x-1.5 transition-all"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Start Practice Exercise</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revision Schedule */}
      <div className="glass-card rounded-3xl p-6 border border-purple-500/20 space-y-4">
        <h3 className="font-poppins font-bold text-base text-white flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-purple-400" />
          <span>Spaced Repetition Revision Schedule</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-emerald-400 font-bold">Today</span>
            <p className="font-semibold text-white">Review Distribution Errors</p>
            <p className="text-slate-400">3 practice problems scheduled</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-purple-400 font-bold">Tomorrow</span>
            <p className="font-semibold text-white">Review Sign Flipping in Equations</p>
            <p className="text-slate-400">2 practice problems scheduled</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-blue-400 font-bold">In 3 Days</span>
            <p className="font-semibold text-white">Fraction Equation Isolations</p>
            <p className="text-slate-400">4 practice problems scheduled</p>
          </div>
        </div>
      </div>
    </div>
  );
};
