import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Crown, 
  Target, 
  Flame, 
  ChevronRight, 
  Lock, 
  Star,
  BookOpen,
  Trophy,
  ArrowRight,
  X,
  HelpCircle
} from 'lucide-react';
import { User } from '../types';

export interface MasteryCategoryBadge {
  id: string;
  category: string;
  title: string;
  description: string;
  iconName: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
  requiredCount: number;
  currentCount: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  colorGradient: string;
  borderColor: string;
  shadowColor: string;
  sampleQuestion: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

const DEFAULT_MASTERY_BADGES: MasteryCategoryBadge[] = [
  {
    id: 'mb_distrib',
    category: 'Distributive Law',
    title: 'Distribution Sentinel',
    description: 'Accurately expanded negative signs and coefficients across parentheses in 5/5 problems.',
    iconName: 'ShieldCheck',
    tier: 'Gold',
    requiredCount: 5,
    currentCount: 5,
    isUnlocked: true,
    unlockedAt: 'Today',
    colorGradient: 'from-amber-500 via-orange-500 to-yellow-400',
    borderColor: 'border-amber-400/50',
    shadowColor: 'shadow-amber-500/20',
    sampleQuestion: {
      question: 'Expand and simplify: -3(x - 4)',
      options: ['-3x - 12', '-3x + 12', '3x - 12', '-3x + 7'],
      correctIndex: 1,
      explanation: 'Multiplying -3 by x gives -3x, and -3 by -4 gives +12.'
    }
  },
  {
    id: 'mb_linear',
    category: 'Linear Equations',
    title: 'Linear Champion',
    description: 'Mastered multi-step isolated variable balancing without sign errors.',
    iconName: 'Zap',
    tier: 'Silver',
    requiredCount: 5,
    currentCount: 4,
    isUnlocked: false,
    colorGradient: 'from-purple-500 via-indigo-500 to-blue-500',
    borderColor: 'border-purple-400/50',
    shadowColor: 'shadow-purple-500/20',
    sampleQuestion: {
      question: 'Solve for x: 2x + 5 = 15',
      options: ['x = 10', 'x = 5', 'x = 20', 'x = 7.5'],
      correctIndex: 1,
      explanation: 'Subtract 5 from both sides (2x = 10), then divide by 2 to get x = 5.'
    }
  },
  {
    id: 'mb_fraction',
    category: 'Fraction Operations',
    title: 'Fraction Wizard',
    description: 'Cleared denominators across complex equations using Least Common Multiples.',
    iconName: 'Sparkles',
    tier: 'Silver',
    requiredCount: 4,
    currentCount: 3,
    isUnlocked: false,
    colorGradient: 'from-emerald-500 via-teal-500 to-cyan-400',
    borderColor: 'border-emerald-400/50',
    shadowColor: 'shadow-emerald-500/20',
    sampleQuestion: {
      question: 'Clear fractions for: (1/2)x + 3 = 7 by multiplying all terms by 2',
      options: ['x + 3 = 14', 'x + 6 = 14', 'x + 6 = 7', '2x + 6 = 14'],
      correctIndex: 1,
      explanation: 'When multiplying by 2, every term (including 3 and 7) must be multiplied by 2: x + 6 = 14.'
    }
  },
  {
    id: 'mb_quadratic',
    category: 'Quadratic Expressions',
    title: 'Quadratic Conqueror',
    description: 'Mastered factoring trinomials and completing the square.',
    iconName: 'Crown',
    tier: 'Bronze',
    requiredCount: 5,
    currentCount: 2,
    isUnlocked: false,
    colorGradient: 'from-rose-500 via-pink-500 to-purple-500',
    borderColor: 'border-rose-400/50',
    shadowColor: 'shadow-rose-500/20',
    sampleQuestion: {
      question: 'Factor x² + 5x + 6',
      options: ['(x + 1)(x + 6)', '(x + 2)(x + 3)', '(x - 2)(x - 3)', '(x + 5)(x + 1)'],
      correctIndex: 1,
      explanation: 'Find two numbers that multiply to 6 and add up to 5: 2 and 3.'
    }
  },
  {
    id: 'mb_polynomial',
    category: 'Polynomials',
    title: 'Polynomial Titan',
    description: 'Demonstrated speed & precision in grouping like polynomial terms.',
    iconName: 'Flame',
    tier: 'Bronze',
    requiredCount: 4,
    currentCount: 1,
    isUnlocked: false,
    colorGradient: 'from-blue-500 via-cyan-500 to-teal-400',
    borderColor: 'border-blue-400/50',
    shadowColor: 'shadow-blue-500/20',
    sampleQuestion: {
      question: 'Simplify (3x² + 2x) + (x² - 5x)',
      options: ['4x² - 3x', '3x² - 3x', '4x² + 7x', '4x⁴ - 3x²'],
      correctIndex: 0,
      explanation: 'Combine like terms: (3x² + x²) = 4x² and (2x - 5x) = -3x.'
    }
  },
  {
    id: 'mb_systems',
    category: 'Systems of Equations',
    title: 'Systems Architect',
    description: 'Solved simultaneous equations using substitution and elimination.',
    iconName: 'Target',
    tier: 'Diamond',
    requiredCount: 5,
    currentCount: 0,
    isUnlocked: false,
    colorGradient: 'from-cyan-400 via-sky-500 to-indigo-600',
    borderColor: 'border-cyan-400/50',
    shadowColor: 'shadow-cyan-500/20',
    sampleQuestion: {
      question: 'If x + y = 10 and x - y = 2, what is x?',
      options: ['x = 4', 'x = 6', 'x = 8', 'x = 5'],
      correctIndex: 1,
      explanation: 'Add the two equations together: 2x = 12 => x = 6.'
    }
  }
];

interface MasteryBadgeSystemProps {
  user: User;
  onGainXP?: (amount: number) => void;
  onNavigateToPractice?: () => void;
}

export const MasteryBadgeSystem: React.FC<MasteryBadgeSystemProps> = ({
  user,
  onGainXP,
  onNavigateToPractice
}) => {
  const [badges, setBadges] = useState<MasteryCategoryBadge[]>(() => {
    try {
      const saved = localStorage.getItem('cognipath_mastery_badges');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved mastery badges', e);
    }
    return DEFAULT_MASTERY_BADGES;
  });

  const [featuredBadgeId, setFeaturedBadgeId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('cognipath_featured_badge');
      if (saved) return saved;
    } catch (e) {
      console.warn('Failed to parse featured badge', e);
    }
    return 'mb_distrib';
  });

  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [activeTestBadge, setActiveTestBadge] = useState<MasteryCategoryBadge | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [testResult, setTestResult] = useState<'success' | 'fail' | null>(null);
  const [unlockedCelebrationBadge, setUnlockedCelebrationBadge] = useState<MasteryCategoryBadge | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cognipath_mastery_badges', JSON.stringify(badges));
    } catch (e) {
      console.warn('Failed to save mastery badges', e);
    }
  }, [badges]);

  useEffect(() => {
    try {
      localStorage.setItem('cognipath_featured_badge', featuredBadgeId);
    } catch (e) {
      console.warn('Failed to save featured badge', e);
    }
  }, [featuredBadgeId]);

  const unlockedCount = badges.filter((b) => b.isUnlocked).length;
  const totalCount = badges.length;
  const overallMasteryPercent = Math.round((unlockedCount / totalCount) * 100);

  const featuredBadge = badges.find((b) => b.id === featuredBadgeId) || badges[0];

  const handleTestOptionClick = (index: number) => {
    if (!activeTestBadge || testResult !== null) return;
    setSelectedAnswer(index);

    if (index === activeTestBadge.sampleQuestion.correctIndex) {
      setTestResult('success');
      
      // Unlock badge & update count
      setTimeout(() => {
        const updated = badges.map((b) => {
          if (b.id === activeTestBadge.id) {
            return {
              ...b,
              currentCount: b.requiredCount,
              isUnlocked: true,
              unlockedAt: 'Just now'
            };
          }
          return b;
        });

        setBadges(updated);
        setUnlockedCelebrationBadge(activeTestBadge);
        setActiveTestBadge(null);
        setSelectedAnswer(null);
        setTestResult(null);

        if (onGainXP) {
          onGainXP(150);
        }
      }, 1200);
    } else {
      setTestResult('fail');
    }
  };

  const handleSetFeatured = (badgeId: string) => {
    setFeaturedBadgeId(badgeId);
  };

  const renderIcon = (iconName: string, className = "w-6 h-6") => {
    switch (iconName) {
      case 'ShieldCheck': return <ShieldCheck className={className} />;
      case 'Zap': return <Zap className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      case 'Crown': return <Crown className={className} />;
      case 'Flame': return <Flame className={className} />;
      case 'Target': return <Target className={className} />;
      default: return <Award className={className} />;
    }
  };

  const filteredBadges = badges.filter((b) => {
    if (filter === 'unlocked') return b.isUnlocked;
    if (filter === 'locked') return !b.isUnlocked;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* PROFILE DISPLAY INTEGRATION HEADER & MASTERY STATUS */}
      <div className="glass-card rounded-3xl p-6 border border-purple-500/30 relative overflow-hidden space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left: Dynamic Profile Display Showcase */}
          <div className="flex items-center space-x-4">
            <div className="relative shrink-0">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                alt={user.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-purple-500/40 shadow-xl"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-500 p-0.5 shadow-lg flex items-center justify-center">
                <Crown className="w-4 h-4 text-slate-950 fill-slate-950" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-poppins font-extrabold text-lg sm:text-xl text-white">
                  {user.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30 font-mono">
                  Lvl {user.level} Math Scholar
                </span>
              </div>

              {/* Featured Profile Badge Tag */}
              <div className="flex items-center space-x-2 pt-0.5">
                <span className="text-xs text-slate-400 font-semibold">Featured Badge:</span>
                <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-bold text-white bg-gradient-to-r ${featuredBadge.colorGradient} shadow-md border border-white/20`}>
                  {renderIcon(featuredBadge.iconName, "w-3.5 h-3.5")}
                  <span>★ {featuredBadge.title}</span>
                </span>
              </div>

              <p className="text-xs text-slate-400">
                Category Proficiency: <span className="text-amber-300 font-bold">{unlockedCount}/{totalCount} Badges Unlocked</span> ({overallMasteryPercent}%)
              </p>
            </div>
          </div>

          {/* Right: Unlocked Mastery Row Bar */}
          <div className="w-full md:w-auto bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 flex items-center space-x-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Unlocked Profile Badges</span>
              </span>
              <span className="text-[11px] font-mono text-purple-300 font-bold">
                {unlockedCount} / {totalCount}
              </span>
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-1">
              {badges.map((b) => (
                <button
                  key={b.id}
                  onClick={() => b.isUnlocked && handleSetFeatured(b.id)}
                  className={`relative p-2 rounded-xl transition-all shrink-0 ${
                    b.isUnlocked
                      ? `bg-gradient-to-br ${b.colorGradient} shadow-lg ring-2 ${
                          featuredBadgeId === b.id ? 'ring-amber-300 scale-105' : 'ring-white/20 hover:scale-105'
                        }`
                      : 'bg-slate-950/80 border border-slate-800 opacity-40 cursor-not-allowed'
                  }`}
                  title={b.isUnlocked ? `Click to set "${b.title}" as Featured Badge` : `Locked: ${b.category}`}
                >
                  <div className="text-white">
                    {renderIcon(b.iconName, "w-4 h-4")}
                  </div>
                  {featuredBadgeId === b.id && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 border border-slate-900 flex items-center justify-center text-[8px] font-black text-slate-950">
                      ★
                    </span>
                  )}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 text-center">
              Click any unlocked badge above to display as your Featured Profile Badge
            </p>
          </div>
        </div>
      </div>

      {/* MASTERY BADGES GRID & CATEGORY PROFICIENCY */}
      <div className="glass-card rounded-3xl p-6 border border-purple-500/20 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-poppins font-bold text-lg text-white flex items-center space-x-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Category Mastery Badges</span>
            </h3>
            <p className="text-xs text-slate-400">
              Demonstrate proficiency in specific math topics to unlock category badges and earn +150 XP
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-2 bg-slate-900/90 p-1 rounded-2xl border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filter === 'all' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setFilter('unlocked')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filter === 'unlocked' ? 'bg-amber-500 text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Unlocked ({unlockedCount})
            </button>
            <button
              onClick={() => setFilter('locked')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filter === 'locked' ? 'bg-purple-600/30 text-purple-200 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              In Progress ({totalCount - unlockedCount})
            </button>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBadges.map((badge) => {
            const progressPercent = Math.min(100, Math.round((badge.currentCount / badge.requiredCount) * 100));
            const isFeatured = featuredBadgeId === badge.id;

            return (
              <motion.div
                key={badge.id}
                whileHover={{ y: -4 }}
                className={`p-5 rounded-2xl border relative overflow-hidden transition-all flex flex-col justify-between space-y-4 ${
                  badge.isUnlocked
                    ? `bg-slate-900/90 ${badge.borderColor} shadow-xl ${badge.shadowColor}`
                    : 'bg-slate-950/60 border-slate-800/80 opacity-90'
                }`}
              >
                {/* Header Tag */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                      badge.isUnlocked
                        ? `bg-gradient-to-tr ${badge.colorGradient}`
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}>
                      {badge.isUnlocked ? (
                        renderIcon(badge.iconName, "w-6 h-6")
                      ) : (
                        <Lock className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 font-mono">
                        {badge.category}
                      </span>
                      <h4 className="font-poppins font-bold text-sm text-white flex items-center space-x-1.5">
                        <span>{badge.title}</span>
                        {isFeatured && (
                          <span className="text-amber-400 text-xs" title="Featured on Profile">★</span>
                        )}
                      </h4>
                    </div>
                  </div>

                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                    badge.tier === 'Gold' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                    badge.tier === 'Diamond' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' :
                    badge.tier === 'Silver' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' :
                    'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {badge.tier}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {badge.description}
                </p>

                {/* Proficiency Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center text-[11px] font-mono">
                    <span className="text-slate-400">Category Proficiency:</span>
                    <span className={badge.isUnlocked ? 'text-amber-300 font-bold' : 'text-purple-300 font-bold'}>
                      {badge.currentCount} / {badge.requiredCount} ({progressPercent}%)
                    </span>
                  </div>

                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        badge.isUnlocked
                          ? `bg-gradient-to-r ${badge.colorGradient}`
                          : 'bg-purple-600'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  {badge.isUnlocked ? (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[11px] text-emerald-400 font-semibold flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mastery Unlocked ({badge.unlockedAt || 'Active'})</span>
                      </span>

                      <button
                        onClick={() => handleSetFeatured(badge.id)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                          isFeatured
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        }`}
                      >
                        {isFeatured ? '★ Featured' : 'Set as Featured'}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[11px] text-slate-400 font-medium">
                        +150 XP & Badge
                      </span>

                      <button
                        onClick={() => {
                          setActiveTestBadge(badge);
                          setSelectedAnswer(null);
                          setTestResult(null);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all flex items-center space-x-1"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                        <span>Test Proficiency</span>
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* PROFICIENCY TEST MODAL */}
      <AnimatePresence>
        {activeTestBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg glass-card rounded-3xl p-6 border border-purple-500/30 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-xl bg-gradient-to-r ${activeTestBadge.colorGradient} text-white`}>
                    {renderIcon(activeTestBadge.iconName, "w-4 h-4")}
                  </div>
                  <div>
                    <h4 className="font-poppins font-bold text-base text-white">
                      Proficiency Check: {activeTestBadge.category}
                    </h4>
                    <p className="text-xs text-slate-400">Answer correctly to unlock {activeTestBadge.title} (+150 XP)</p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTestBadge(null)}
                  className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
                  Question
                </span>
                <p className="font-poppins font-semibold text-sm text-white">
                  {activeTestBadge.sampleQuestion.question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2">
                {activeTestBadge.sampleQuestion.options.map((opt, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isCorrect = activeTestBadge.sampleQuestion.correctIndex === idx;

                  let optStyle = "bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-200";
                  if (isSelected) {
                    if (testResult === 'success') {
                      optStyle = "bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/40";
                    } else if (testResult === 'fail') {
                      optStyle = "bg-rose-950/80 border-rose-500 text-rose-200 ring-2 ring-rose-500/40";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleTestOptionClick(idx)}
                      disabled={testResult !== null}
                      className={`w-full p-3.5 rounded-2xl border text-left font-mono text-xs transition-all flex items-center justify-between ${optStyle}`}
                    >
                      <span>{opt}</span>
                      {isSelected && testResult === 'success' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {isSelected && testResult === 'fail' && (
                        <X className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {testResult === 'fail' && (
                <div className="p-3 rounded-2xl bg-rose-950/50 border border-rose-500/30 text-xs text-rose-200 flex items-start space-x-2">
                  <HelpCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Incorrect Attempt</p>
                    <p className="text-[11px] text-slate-300">{activeTestBadge.sampleQuestion.explanation}</p>
                    <button
                      onClick={() => {
                        setSelectedAnswer(null);
                        setTestResult(null);
                      }}
                      className="mt-2 text-[11px] font-bold text-purple-300 underline"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MASTERY BADGE UNLOCKED CELEBRATION MODAL */}
      <AnimatePresence>
        {unlockedCelebrationBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-full max-w-md glass-card rounded-3xl p-8 border border-amber-500/50 shadow-2xl text-center space-y-6 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

              <motion.div
                animate={{ rotate: [0, -10, 10, -5, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1 }}
                className={`w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr ${unlockedCelebrationBadge.colorGradient} p-1 shadow-2xl shadow-amber-500/40 flex items-center justify-center`}
              >
                <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-amber-300">
                  {renderIcon(unlockedCelebrationBadge.iconName, "w-12 h-12")}
                </div>
              </motion.div>

              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40 uppercase tracking-widest">
                  ★ Mastery Badge Unlocked!
                </span>

                <h3 className="font-poppins font-black text-2xl text-white">
                  {unlockedCelebrationBadge.title}
                </h3>

                <p className="text-xs text-slate-300">
                  You demonstrated proficiency in <span className="text-amber-300 font-bold">{unlockedCelebrationBadge.category}</span> and earned <span className="text-emerald-400 font-bold">+150 XP</span>!
                </p>
              </div>

              <button
                onClick={() => {
                  handleSetFeatured(unlockedCelebrationBadge.id);
                  setUnlockedCelebrationBadge(null);
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-poppins font-extrabold text-sm shadow-xl shadow-amber-500/30 transition-all flex items-center justify-center space-x-2"
              >
                <Crown className="w-4 h-4 fill-slate-950" />
                <span>Set as Featured Profile Badge & Continue</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
