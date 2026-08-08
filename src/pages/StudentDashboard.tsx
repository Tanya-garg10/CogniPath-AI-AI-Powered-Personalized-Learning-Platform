import React, { useState, useEffect } from 'react';
import { User, StudentMistakeLog, MathProblem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { DailyStudyGoal } from '../components/DailyStudyGoal';
import { MathChallengeSection } from '../components/MathChallengeSection';
import { MasteryBadgeSystem } from '../components/MasteryBadgeSystem';
import { 
  Flame, 
  Award, 
  TrendingUp, 
  AlertTriangle, 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Brain,
  Zap,
  Trophy,
  ChevronRight,
  Radio,
  Users
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface StudentDashboardProps {
  user: User;
  mistakeLogs: StudentMistakeLog[];
  sampleProblems: MathProblem[];
  onNavigate: (view: string) => void;
  onSelectProblem: (problem: MathProblem) => void;
  onOpenAITutorForMistake: (log: StudentMistakeLog) => void;
  onGainXP?: (amount: number) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  mistakeLogs,
  sampleProblems,
  onNavigate,
  onSelectProblem,
  onOpenAITutorForMistake,
  onGainXP,
}) => {
  const XP_PER_LEVEL = 500;
  const currentLevel = Math.floor(user.xp / XP_PER_LEVEL) + 1;
  const currentLevelXp = user.xp % XP_PER_LEVEL;
  const xpPercent = Math.min(100, Math.max(0, (currentLevelXp / XP_PER_LEVEL) * 100));
  const xpNeededForNext = XP_PER_LEVEL - currentLevelXp;

  const [prevXp, setPrevXp] = useState(user.xp);
  const [xpGainedBadge, setXpGainedBadge] = useState<number | null>(null);
  const [isGainingXP, setIsGainingXP] = useState(false);

  useEffect(() => {
    if (user.xp > prevXp) {
      const diff = user.xp - prevXp;
      setXpGainedBadge(diff);
      setIsGainingXP(true);

      const timer = setTimeout(() => {
        setXpGainedBadge(null);
        setIsGainingXP(false);
      }, 3500);

      setPrevXp(user.xp);
      return () => clearTimeout(timer);
    } else if (user.xp !== prevXp) {
      setPrevXp(user.xp);
    }
  }, [user.xp, prevXp]);

  const chartData = [
    { day: 'Mon', accuracy: 68, xp: 120 },
    { day: 'Tue', accuracy: 74, xp: 210 },
    { day: 'Wed', accuracy: 72, xp: 180 },
    { day: 'Thu', accuracy: 82, xp: 290 },
    { day: 'Fri', accuracy: 88, xp: 340 },
    { day: 'Sat', accuracy: 85, xp: 220 },
    { day: 'Sun', accuracy: 91, xp: 260 },
  ];

  const weakConcepts = [
    { title: 'Distribution Error', count: 4, severity: 'High', color: 'text-purple-400 bg-purple-500/20' },
    { title: 'Sign Error', count: 2, severity: 'Medium', color: 'text-amber-400 bg-amber-500/20' },
    { title: 'Variable Confusion', count: 1, severity: 'Low', color: 'text-blue-400 bg-blue-500/20' },
  ];

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Welcome Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-purple-500/30 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Adaptive Learning Active</span>
          </div>

          <h1 className="font-poppins font-extrabold text-2xl sm:text-3xl text-white">
            Welcome back, <span className="gradient-text">{user.name}</span>!
          </h1>

          <p className="text-xs sm:text-sm text-slate-300">
            You are on a <span className="text-amber-400 font-bold">{user.streak}-day streak</span>! You reduced Distribution Errors by <span className="text-emerald-400 font-bold">40%</span> this week.
          </p>
        </div>

        {/* Quick Practice Jump CTA */}
        <button
          onClick={() => onNavigate('solver')}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-poppins font-bold text-xs shadow-xl shadow-purple-600/30 flex items-center space-x-2 shrink-0 transition-all z-10"
        >
          <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
          <span>Solve Equations & Earn XP</span>
        </button>
      </div>

      {/* Framer Motion Animated XP Progress Bar Card */}
      <motion.div
        animate={isGainingXP ? {
          boxShadow: [
            '0 0 0px rgba(168, 85, 247, 0)',
            '0 0 35px rgba(52, 211, 153, 0.6)',
            '0 0 0px rgba(168, 85, 247, 0)'
          ],
          borderColor: ['rgba(168, 85, 247, 0.3)', 'rgba(52, 211, 153, 0.8)', 'rgba(168, 85, 247, 0.3)']
        } : {}}
        transition={{ duration: 1.8, repeat: isGainingXP ? 1 : 0 }}
        className="glass-card rounded-3xl p-6 sm:p-7 border border-purple-500/30 relative overflow-hidden space-y-4 shadow-2xl"
      >
        {/* Floating XP Gain Badge Popup */}
        <AnimatePresence>
          {xpGainedBadge && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.5, rotate: -6 }}
              animate={{ opacity: 1, y: -28, scale: 1.15, rotate: 0 }}
              exit={{ opacity: 0, y: -50, scale: 0.7 }}
              transition={{ type: 'spring', stiffness: 350, damping: 18 }}
              className="absolute right-6 top-3 z-30 px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 text-slate-950 font-poppins font-black text-xs sm:text-sm shadow-2xl shadow-emerald-500/50 flex items-center space-x-2 border border-emerald-200"
            >
              <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950 animate-spin" />
              <span>+{xpGainedBadge} XP GAINED!</span>
              <span className="text-[10px] bg-slate-950/20 px-1.5 py-0.5 rounded-md text-slate-950 uppercase font-mono">Problem Solved</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Level Header & Numerical Stat Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={isGainingXP ? { rotate: [0, -15, 15, -10, 0], scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.6 }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-400 p-0.5 shadow-lg shadow-purple-500/30 flex items-center justify-center shrink-0"
            >
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Trophy className="w-6 h-6 text-amber-300" />
              </div>
            </motion.div>

            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-poppins font-extrabold text-base sm:text-lg text-white">
                  Level {user.level} Mastery Progress
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {xpNeededForNext} XP to Level {user.level + 1}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Earn XP by completing problem steps, overcoming misconceptions, and completing daily practice.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 self-end sm:self-auto">
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Experience</p>
              <motion.p
                key={user.xp}
                initial={{ scale: 1 }}
                animate={isGainingXP ? { scale: [1, 1.25, 1], color: ['#34d399', '#a855f7', '#34d399'] } : {}}
                transition={{ duration: 0.6 }}
                className="font-poppins font-black text-2xl text-emerald-400"
              >
                {user.xp} <span className="text-xs font-semibold text-slate-300">XP</span>
              </motion.p>
            </div>

            {onGainXP && (
              <button
                onClick={() => onGainXP(100)}
                className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 hover:text-white border border-purple-500/30 text-xs font-semibold transition-all flex items-center space-x-1 shadow-sm shrink-0"
                title="Simulate gaining +100 XP for solving a problem"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Simulate +100 XP</span>
              </button>
            )}
          </div>
        </div>

        {/* Animated XP Progress Bar Track */}
        <div className="space-y-1.5 pt-1">
          <div className="relative w-full h-6 bg-slate-950/90 rounded-full p-1 border border-white/10 overflow-hidden shadow-inner flex items-center">
            {/* Background Grid Pattern in Track */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px]" />

            {/* Framer Motion Filled Progress Bar */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpPercent}%` }}
              transition={{ type: 'spring', stiffness: 45, damping: 14 }}
              className="h-full rounded-full bg-gradient-to-r from-indigo-600 via-purple-500 to-emerald-400 relative overflow-hidden shadow-lg shadow-purple-500/40"
            >
              {/* Animated Light Sweep Shimmer Effect */}
              <motion.div
                animate={{ x: ['-100%', '250%'] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
              />
            </motion.div>

            {/* Glowing Leading Edge Marker Dot */}
            {xpPercent > 0 && (
              <motion.div
                animate={{ scale: [1, 1.35, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                style={{ left: `calc(${Math.max(2, xpPercent)}% - 10px)` }}
                className="absolute w-4 h-4 rounded-full bg-amber-300 shadow-lg shadow-amber-400 border border-white z-10"
              />
            )}
          </div>

          {/* Bar Label Indicators */}
          <div className="flex justify-between items-center text-[11px] font-mono font-semibold text-slate-400 px-1">
            <span>Level {user.level} (0 XP)</span>
            <span className="text-purple-300 font-bold">{currentLevelXp} / {XP_PER_LEVEL} XP ({Math.round(xpPercent)}%)</span>
            <span>Level {user.level + 1} ({XP_PER_LEVEL} XP)</span>
          </div>
        </div>
      </motion.div>

      {/* Daily Study Goal Component */}
      <DailyStudyGoal 
        initialTarget={5}
        initialCompleted={3}
        onNavigateToPractice={() => onNavigate('solver')}
        onGoalComplete={() => onGainXP && onGainXP(50)}
      />

      {/* Virtual Study Room Banner */}
      <div className="glass-card rounded-3xl p-6 border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-purple-950/40 to-slate-900/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 font-mono bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Live Feature
              </span>
              <span className="text-xs text-slate-400">• 3 Active Rooms</span>
            </div>
            <h3 className="font-poppins font-bold text-lg text-white">
              Join a Collaborative Virtual Study Room
            </h3>
            <p className="text-xs text-slate-300">
              Solve math problems together with peers in real-time, share step progress, and get instant AI Tutor hints.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('studyroom')}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-poppins font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center space-x-2 whitespace-nowrap"
        >
          <Users className="w-4 h-4" />
          <span>Enter Study Room</span>
        </button>
      </div>

      {/* Mastery Badge System Component */}
      <MasteryBadgeSystem 
        user={user}
        onGainXP={onGainXP}
        onNavigateToPractice={() => onNavigate('solver')}
      />

      {/* Friend Math Challenge & Leaderboard Component */}
      <MathChallengeSection 
        currentUser={user}
        onSelectProblem={onSelectProblem}
        onGainXP={onGainXP}
      />

      {/* Top Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-purple-500/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Overall Accuracy</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="font-poppins font-extrabold text-2xl text-white">88.5%</p>
          <p className="text-[11px] text-emerald-400">↑ +6.2% from last week</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-purple-500/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Streak</span>
            <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
          </div>
          <p className="font-poppins font-extrabold text-2xl text-amber-400">{user.streak} Days</p>
          <p className="text-[11px] text-slate-400">Personal Best: 12 Days</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-purple-500/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Resolved Mistakes</span>
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
          </div>
          <p className="font-poppins font-extrabold text-2xl text-purple-300">18 Misconceptions</p>
          <p className="text-[11px] text-purple-400">3 pending review</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-purple-500/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Practice Time</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <p className="font-poppins font-extrabold text-2xl text-blue-300">4.2 Hours</p>
          <p className="text-[11px] text-slate-400">Avg. 3.5 min / problem</p>
        </div>
      </div>

      {/* Main Row: Today's Practice & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Performance Chart & Weak Concepts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Trend Chart */}
          <div className="glass-card rounded-3xl p-6 border border-purple-500/20 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-poppins font-bold text-base text-white">Weekly Accuracy & Mastery Chart</h3>
                <p className="text-xs text-slate-400">Real-time accuracy % tracked after AI misconception corrections</p>
              </div>
              <div className="px-3 py-1 rounded-full bg-slate-900 text-xs text-purple-300 font-semibold border border-slate-800">
                This Week
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} domain={[50, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="accuracy" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorAcc)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weak Concepts Alert Box */}
          <div className="glass-card rounded-3xl p-6 border border-purple-500/20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h3 className="font-poppins font-bold text-base text-white">Detected Weak Concepts</h3>
              </div>
              <button
                onClick={() => onNavigate('recommendations')}
                className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center space-x-1"
              >
                <span>View Full Path</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {weakConcepts.map((wc, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${wc.color}`}>
                      {wc.severity} Priority
                    </span>
                    <span className="text-xs font-semibold text-slate-400">{wc.count} mistakes</span>
                  </div>
                  <h4 className="font-poppins font-bold text-sm text-white">{wc.title}</h4>
                  <button
                    onClick={() => onNavigate('solver')}
                    className="mt-2 w-full py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white text-xs font-semibold border border-purple-500/30 transition-all flex items-center justify-center space-x-1"
                  >
                    <span>Practice Now</span>
                    <Zap className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Today's Practice & Recent Mistakes */}
        <div className="space-y-6">
          {/* Today's Practice Set */}
          <div className="glass-card rounded-3xl p-6 border border-purple-500/20 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-poppins font-bold text-base text-white flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                <span>Today's Practice Set</span>
              </h3>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Recommended
              </span>
            </div>

            <div className="space-y-3">
              {sampleProblems.map((prob) => (
                <div
                  key={prob.id}
                  onClick={() => {
                    onSelectProblem(prob);
                    onNavigate('solver');
                  }}
                  className="p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/40 cursor-pointer transition-all space-y-1.5 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-300">{prob.topic}</span>
                    <span className="text-[10px] text-slate-400 font-mono px-2 py-0.5 rounded-md bg-slate-950">
                      {prob.difficulty}
                    </span>
                  </div>
                  <p className="font-poppins font-semibold text-sm text-white group-hover:text-purple-200">
                    {prob.title}
                  </p>
                  <p className="text-xs text-slate-400 font-mono bg-slate-950 px-2 py-1 rounded-lg border border-slate-800/80">
                    {prob.equation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Mistakes List */}
          <div className="glass-card rounded-3xl p-6 border border-purple-500/20 space-y-4">
            <h3 className="font-poppins font-bold text-base text-white flex items-center space-x-2">
              <Brain className="w-5 h-5 text-amber-400" />
              <span>Recent AI Misconceptions</span>
            </h3>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {mistakeLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-300">{log.misconceptionType}</span>
                    <span className="text-[10px] text-slate-500">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-300 font-mono">{log.problemTitle}</p>
                  <button
                    onClick={() => onOpenAITutorForMistake(log)}
                    className="w-full py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white text-xs font-semibold border border-purple-500/30 transition-all flex items-center justify-center space-x-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Explain with AI Tutor</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
