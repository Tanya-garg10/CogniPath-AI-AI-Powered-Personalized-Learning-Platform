import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, CheckCircle2, Plus, Minus, Sparkles, Flame, Trophy, Zap, RefreshCw } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DailyStudyGoalProps {
  initialTarget?: number;
  initialCompleted?: number;
  onGoalComplete?: () => void;
  onNavigateToPractice?: () => void;
}

export const DailyStudyGoal: React.FC<DailyStudyGoalProps> = ({
  initialTarget = 5,
  initialCompleted = 3,
  onGoalComplete,
  onNavigateToPractice,
}) => {
  const [dailyTarget, setDailyTarget] = useState<number>(initialTarget);
  const [completedCount, setCompletedCount] = useState<number>(initialCompleted);
  const [isEditingTarget, setIsEditingTarget] = useState<boolean>(false);

  const percent = Math.min(100, Math.round((completedCount / dailyTarget) * 100));
  const isGoalReached = completedCount >= dailyTarget;

  // Preset options for quick selection
  const targetPresets = [3, 5, 8, 10, 15];

  const handleIncrementSolved = () => {
    const nextCompleted = completedCount + 1;
    setCompletedCount(nextCompleted);
    if (nextCompleted === dailyTarget && onGoalComplete) {
      onGoalComplete();
    }
  };

  const handleDecrementSolved = () => {
    if (completedCount > 0) {
      setCompletedCount(completedCount - 1);
    }
  };

  const handleSetTarget = (newTarget: number) => {
    if (newTarget >= 1 && newTarget <= 30) {
      setDailyTarget(newTarget);
    }
  };

  // Recharts Donut Data Slices
  const pieData = [
    { name: 'Completed', value: Math.min(completedCount, dailyTarget), color: isGoalReached ? '#34d399' : '#a855f7' },
    { name: 'Remaining', value: Math.max(0, dailyTarget - completedCount), color: '#1e293b' },
  ];

  return (
    <div className="glass-card rounded-3xl p-6 border border-purple-500/30 relative overflow-hidden space-y-5 shadow-2xl">
      {/* Background Ambient Glow */}
      <div 
        className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
          isGoalReached ? 'bg-emerald-500/20' : 'bg-purple-500/20'
        }`} 
      />

      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className={`p-2 rounded-2xl border transition-colors ${
            isGoalReached 
              ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' 
              : 'bg-purple-500/20 border-purple-500/30 text-purple-300'
          }`}>
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-poppins font-bold text-base text-white flex items-center space-x-2">
              <span>Daily Study Goal</span>
              {isGoalReached && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                  Smashed! 🎉
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">Target problems solved today</p>
          </div>
        </div>

        <button
          onClick={() => setIsEditingTarget(!isEditingTarget)}
          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold transition-all"
        >
          {isEditingTarget ? 'Done' : 'Change Goal'}
        </button>
      </div>

      {/* Edit Target Overlay Drawer if active */}
      <AnimatePresence>
        {isEditingTarget && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 rounded-2xl bg-slate-950/80 border border-purple-500/30 space-y-3 overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-200">Adjust Target Problems / Day</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleSetTarget(dailyTarget - 1)}
                  disabled={dailyTarget <= 1}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-40"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono font-bold text-sm text-amber-300 px-2">{dailyTarget}</span>
                <button
                  onClick={() => handleSetTarget(dailyTarget + 1)}
                  disabled={dailyTarget >= 30}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-40"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <span className="text-[11px] text-slate-400">Presets:</span>
              {targetPresets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => handleSetTarget(preset)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                    dailyTarget === preset
                      ? 'bg-purple-600 text-white border-purple-400'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center Layout: Recharts Ring & Key Metrics */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
        {/* Recharts Progress Ring */}
        <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={54}
                outerRadius={72}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                stroke="none"
                animationDuration={1000}
              >
                {pieData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    style={{
                      filter: index === 0 && isGoalReached ? 'drop-shadow(0px 0px 8px rgba(52, 211, 153, 0.6))' : 'none'
                    }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Ring Stats Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none space-y-0.5">
            <motion.div
              key={completedCount}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <span className="font-poppins font-black text-2xl sm:text-3xl text-white">
                {completedCount}<span className="text-slate-500 font-medium text-lg">/{dailyTarget}</span>
              </span>
            </motion.div>
            <span className={`text-[11px] font-bold uppercase tracking-wider ${
              isGoalReached ? 'text-emerald-400' : 'text-purple-300'
            }`}>
              {percent}% Done
            </span>
          </div>
        </div>

        {/* Dynamic Goal Status Card & Controls */}
        <div className="flex-1 space-y-3.5 w-full">
          {/* Status Badge */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isGoalReached 
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200' 
              : 'bg-slate-900/80 border-slate-800 text-slate-300'
          }`}>
            <div className="flex items-center space-x-2 pb-1">
              {isGoalReached ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <Flame className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />
              )}
              <h4 className="font-poppins font-bold text-sm text-white">
                {isGoalReached ? 'Daily Target Completed!' : `${dailyTarget - completedCount} more to hit today's target!`}
              </h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isGoalReached
                ? 'Fantastic work! Solving daily problems builds long-term mathematical fluency and keeps your streak alive.'
                : 'Solve recommended step-by-step math equations in the Problem Solver to complete today\'s ring!'}
            </p>
          </div>

          {/* Interactive Simulation Controls */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] text-slate-400 font-semibold hidden sm:inline">Log Solved:</span>
              <button
                onClick={handleDecrementSolved}
                disabled={completedCount <= 0}
                className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 disabled:opacity-30 transition-all"
                title="Decrement completed count"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={handleIncrementSolved}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center space-x-1"
                title="Mark 1 problem solved today"
              >
                <Plus className="w-4 h-4" />
                <span>+1 Solved</span>
              </button>
            </div>

            {onNavigateToPractice && (
              <button
                onClick={onNavigateToPractice}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center space-x-1 shrink-0"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Practice Equations</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
