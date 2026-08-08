import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Timer, 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee, 
  Sparkles, 
  Flame, 
  Zap, 
  Brain, 
  Volume2, 
  VolumeX, 
  ChevronDown, 
  ChevronUp,
  CheckCircle2
} from 'lucide-react';

interface FocusTimerProps {
  onSessionComplete?: (focusMinutes: number) => void;
  className?: string;
}

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

const TIMER_PRESETS: Record<TimerMode, { label: string; defaultMinutes: number; color: string; icon: any }> = {
  focus: { label: 'Deep Work Focus', defaultMinutes: 25, color: '#a855f7', icon: Brain },
  shortBreak: { label: 'Short Break', defaultMinutes: 5, color: '#34d399', icon: Coffee },
  longBreak: { label: 'Long Break', defaultMinutes: 15, color: '#38bdf8', icon: Sparkles },
};

export const FocusTimer: React.FC<FocusTimerProps> = ({ onSessionComplete, className = '' }) => {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [targetMinutes, setTargetMinutes] = useState<number>(25);
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [completedSessionsCount, setCompletedSessionsCount] = useState<number>(0);
  const [totalFocusMinutes, setTotalFocusMinutes] = useState<number>(0);
  const [isCompact, setIsCompact] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Synchronize timer duration when mode changes
  const switchMode = (newMode: TimerMode, newMins?: number) => {
    setIsRunning(false);
    setMode(newMode);
    const duration = newMins || TIMER_PRESETS[newMode].defaultMinutes;
    setTargetMinutes(duration);
    setSecondsLeft(duration * 60);
  };

  // Play audio chime synthesised using Web Audio API
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.3); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.6); // G5

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {
      console.log('Audio chime unavailable', e);
    }
  };

  // Countdown Interval Effect
  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;

    if (isRunning && secondsLeft > 0) {
      timerId = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && secondsLeft === 0) {
      setIsRunning(false);
      playChime();

      if (mode === 'focus') {
        setCompletedSessionsCount((c) => c + 1);
        setTotalFocusMinutes((m) => m + targetMinutes);
        setShowCelebration(true);
        if (onSessionComplete) {
          onSessionComplete(targetMinutes);
        }
        setTimeout(() => setShowCelebration(false), 5000);
      }
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isRunning, secondsLeft, mode, targetMinutes]);

  const handleToggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(targetMinutes * 60);
  };

  const handleAdjustMinutes = (delta: number) => {
    const nextMinutes = Math.min(120, Math.max(1, targetMinutes + delta));
    setTargetMinutes(nextMinutes);
    if (!isRunning) {
      setSecondsLeft(nextMinutes * 60);
    }
  };

  // Time calculations
  const totalSeconds = targetMinutes * 60;
  const progressPercent = Math.min(100, Math.max(0, ((totalSeconds - secondsLeft) / totalSeconds) * 100));
  const displayMinutes = Math.floor(secondsLeft / 60);
  const displaySeconds = secondsLeft % 60;
  const formattedTime = `${String(displayMinutes).padStart(2, '0')}:${String(displaySeconds).padStart(2, '0')}`;

  const currentPreset = TIMER_PRESETS[mode];
  const ModeIcon = currentPreset.icon;

  return (
    <motion.div 
      layout
      className={`glass-card rounded-3xl p-5 border border-purple-500/30 relative overflow-hidden shadow-2xl transition-all ${className}`}
    >
      {/* Background Deep Work Active Glow */}
      <div 
        className={`absolute -top-16 -right-16 w-52 h-52 rounded-full blur-3xl pointer-events-none transition-all duration-1000 ${
          isRunning 
            ? mode === 'focus' ? 'bg-purple-500/25 animate-pulse' : 'bg-emerald-500/25 animate-pulse' 
            : 'bg-indigo-500/10'
        }`} 
      />

      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className={`p-2 rounded-2xl border transition-all ${
            isRunning 
              ? 'bg-purple-500/20 border-purple-500/40 text-purple-300 shadow-lg shadow-purple-500/20' 
              : 'bg-white/5 border-white/10 text-slate-400'
          }`}>
            <Timer className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <h3 className="font-poppins font-bold text-xs sm:text-sm text-white flex items-center space-x-2">
              <span>Pomodoro Focus Timer</span>
              {isRunning && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold animate-pulse">
                  Flow State
                </span>
              )}
            </h3>
            <p className="text-[11px] text-slate-400">Deep study session tracker</p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 text-xs transition-all"
            title={soundEnabled ? 'Mute Chime Sound' : 'Enable Chime Sound'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-purple-300" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
          </button>

          <button
            onClick={() => setIsCompact(!isCompact)}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 text-xs transition-all"
            title={isCompact ? 'Expand Focus Timer' : 'Collapse Focus Timer'}
          >
            {isCompact ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Mode Selection Pills */}
      {!isCompact && (
        <div className="flex items-center justify-between gap-1 pt-3 pb-1">
          {(Object.keys(TIMER_PRESETS) as TimerMode[]).map((mKey) => {
            const config = TIMER_PRESETS[mKey];
            const Icon = config.icon;
            const isActive = mode === mKey;
            return (
              <button
                key={mKey}
                onClick={() => switchMode(mKey)}
                className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all flex items-center justify-center space-x-1 ${
                  isActive
                    ? 'bg-purple-600/90 text-white border-purple-400 shadow-md shadow-purple-600/30'
                    : 'bg-slate-900/60 text-slate-400 border-white/5 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span className="truncate">{config.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Display: Timer Ring & Control Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        {/* Countdown Ring & Digital Display */}
        <div className="flex items-center space-x-4">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center shrink-0">
            {/* Circular Progress SVG */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="40%"
                className="stroke-slate-900 fill-none"
                strokeWidth="8"
              />
              <motion.circle
                cx="50%"
                cy="50%"
                r="40%"
                className="fill-none"
                stroke={currentPreset.color}
                strokeWidth="8"
                strokeDasharray="251"
                strokeDashoffset={251 - (251 * progressPercent) / 100}
                strokeLinecap="round"
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            </svg>

            {/* Central Time Readout */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-0">
              <span className="font-mono font-black text-xl sm:text-2xl text-white tracking-wider">
                {formattedTime}
              </span>
              <span className="text-[9px] font-bold uppercase text-purple-300">
                {mode === 'focus' ? 'Focus' : 'Break'}
              </span>
            </div>
          </div>

          {/* Quick Adjustment Controls & Stats */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleAdjustMinutes(-5)}
                disabled={isRunning || targetMinutes <= 5}
                className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-30 text-xs font-mono"
                title="Subtract 5 minutes"
              >
                -5m
              </button>
              <span className="text-xs font-mono font-bold text-amber-300">{targetMinutes} min session</span>
              <button
                onClick={() => handleAdjustMinutes(5)}
                disabled={isRunning || targetMinutes >= 120}
                className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-30 text-xs font-mono"
                title="Add 5 minutes"
              >
                +5m
              </button>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center space-x-1 text-[10px]">
              <span className="text-slate-500">Presets:</span>
              {[15, 25, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => switchMode(mode, mins)}
                  disabled={isRunning}
                  className={`px-1.5 py-0.5 rounded border ${
                    targetMinutes === mins
                      ? 'bg-purple-500/30 text-purple-200 border-purple-500/50 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>

            {/* Session Stats Badges */}
            <div className="flex items-center space-x-3 text-[11px] text-slate-400 pt-0.5">
              <span className="flex items-center space-x-1 text-amber-400 font-semibold">
                <Flame className="w-3.5 h-3.5" />
                <span>{completedSessionsCount} Pomodoros</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center space-x-1 text-emerald-400 font-semibold">
                <Brain className="w-3.5 h-3.5" />
                <span>{totalFocusMinutes}m Focus</span>
              </span>
            </div>
          </div>
        </div>

        {/* Timer Play/Pause Controls */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleToggleTimer}
            className={`px-5 py-3 rounded-2xl font-poppins font-extrabold text-xs shadow-xl flex items-center space-x-2 transition-all ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30'
                : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30'
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
            <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
          </button>

          <button
            onClick={handleResetTimer}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs transition-all"
            title="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Celebration Alert Popup when Pomodoro Completes */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-lg flex items-center justify-between space-x-2"
          >
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-slate-950 shrink-0" />
              <span>Great job! You completed a {targetMinutes}-minute Deep Work session! +25 XP</span>
            </div>
            <button
              onClick={() => switchMode('shortBreak')}
              className="px-2.5 py-1 rounded-xl bg-slate-950 text-emerald-300 text-[10px] uppercase font-mono font-bold hover:bg-slate-900"
            >
              Start 5m Break →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
