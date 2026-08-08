import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertTriangle, 
  Brain, 
  CheckCircle2, 
  Flame, 
  Sparkles, 
  Target, 
  Zap, 
  ChevronRight, 
  ArrowUpRight, 
  Info,
  Filter,
  RefreshCw,
  BookOpen
} from 'lucide-react';

export interface ConceptGap {
  id: string;
  category: 'Linear Algebra' | 'Negatives & Signs' | 'Fractions & Ratios' | 'Exponents & Radicals' | 'Quadratics';
  topic: string;
  errorRate: number; // 0 - 100 percentage
  totalAttempts: number;
  errorCount: number;
  severity: 'critical' | 'moderate' | 'minor' | 'mastered';
  topMisconception: string;
  sampleEquation: string;
  sampleErrorText: string;
  aiRemediationTip: string;
}

interface KnowledgeGapsMapProps {
  onPracticeConcept?: (conceptTopic: string) => void;
}

export const KnowledgeGapsMap: React.FC<KnowledgeGapsMapProps> = ({ onPracticeConcept }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedConcept, setSelectedConcept] = useState<ConceptGap | null>(null);

  // Mock comprehensive data for past student mistake logs aggregated into concept gaps
  const conceptGapsData: ConceptGap[] = [
    {
      id: 'gap_1',
      category: 'Linear Algebra',
      topic: 'Distributive Property with Negatives',
      errorRate: 68,
      totalAttempts: 25,
      errorCount: 17,
      severity: 'critical',
      topMisconception: 'Fails to distribute negative sign to the second term inside parentheses',
      sampleEquation: '-3(x - 4) = 15',
      sampleErrorText: 'Student wrote -3x - 12 = 15 instead of -3x + 12 = 15',
      aiRemediationTip: 'Visualize -3 as multiplying both terms separately: (-3 · x) + (-3 · -4). Double negatives yield positive +12.',
    },
    {
      id: 'gap_2',
      category: 'Negatives & Signs',
      topic: 'Subtracting Negative Integers',
      errorRate: 52,
      totalAttempts: 31,
      errorCount: 16,
      severity: 'critical',
      topMisconception: 'Treats subtraction of negative as standard subtraction rather than addition',
      sampleEquation: '7 - (-5) = ?',
      sampleErrorText: 'Student calculated 7 - 5 = 2',
      aiRemediationTip: 'Subtracting a negative means taking away a deficit, which increases the total value: 7 + 5 = 12.',
    },
    {
      id: 'gap_3',
      category: 'Fractions & Ratios',
      topic: 'Clearing Fractional Coefficients',
      errorRate: 44,
      totalAttempts: 18,
      errorCount: 8,
      severity: 'moderate',
      topMisconception: 'Forgets to multiply terms without fractions by the Least Common Denominator',
      sampleEquation: '(1/2)x + 3 = 7',
      sampleErrorText: 'Student multiplied 1/2x by 2 to get x, but kept +3 without multiplying it by 2',
      aiRemediationTip: 'Golden Rule of Equations: Every single term on BOTH sides must be multiplied by the LCD (2): x + 6 = 14.',
    },
    {
      id: 'gap_4',
      category: 'Linear Algebra',
      topic: 'Variable Isolation across Equals Sign',
      errorRate: 35,
      totalAttempts: 40,
      errorCount: 14,
      severity: 'moderate',
      topMisconception: 'Adds variable to both sides instead of subtracting to isolate',
      sampleEquation: '5x + 2 = 3x + 10',
      sampleErrorText: 'Student calculated 8x + 2 = 10',
      aiRemediationTip: 'Apply the inverse operation: subtract 3x from both sides to cancel 3x on the right side.',
    },
    {
      id: 'gap_5',
      category: 'Exponents & Radicals',
      topic: 'Negative Exponents Conversion',
      errorRate: 28,
      totalAttempts: 22,
      errorCount: 6,
      severity: 'minor',
      topMisconception: 'Assumes negative exponent turns the base into a negative number',
      sampleEquation: '2⁻³ = ?',
      sampleErrorText: 'Student answered -8',
      aiRemediationTip: 'A negative exponent indicates a reciprocal fraction: 2⁻³ = 1/(2³) = 1/8.',
    },
    {
      id: 'gap_6',
      category: 'Quadratics',
      topic: 'Factoring Trinomials (a = 1)',
      errorRate: 22,
      totalAttempts: 18,
      errorCount: 4,
      severity: 'minor',
      topMisconception: 'Confuses factors that add vs multiply to middle and constant terms',
      sampleEquation: 'x² + 5x + 6 = 0',
      sampleErrorText: 'Student picked factors +1 and +6 instead of +2 and +3',
      aiRemediationTip: 'Find two numbers that multiply to 6 AND add to 5. Since 2·3=6 and 2+3=5, factors are (x+2)(x+3).',
    },
    {
      id: 'gap_7',
      category: 'Linear Algebra',
      topic: 'One-Step Addition & Subtraction',
      errorRate: 5,
      totalAttempts: 50,
      errorCount: 2,
      severity: 'mastered',
      topMisconception: 'Occasional minor calculation slips under time pressure',
      sampleEquation: 'x + 4 = 9',
      sampleErrorText: 'x = 5',
      aiRemediationTip: 'Solid mastery! Subtract 4 from both sides.',
    },
    {
      id: 'gap_8',
      category: 'Fractions & Ratios',
      topic: 'Multiplying Simple Fractions',
      errorRate: 8,
      totalAttempts: 38,
      errorCount: 3,
      severity: 'mastered',
      topMisconception: 'Rare oversight in cross-canceling fractions',
      sampleEquation: '(2/3) · (3/4)',
      sampleErrorText: 'Answered 6/12 without simplifying to 1/2',
      aiRemediationTip: 'Remember to simplify fractions to lowest terms!',
    },
  ];

  const categories = ['All', 'Linear Algebra', 'Negatives & Signs', 'Fractions & Ratios', 'Exponents & Radicals', 'Quadratics'];

  const filteredGaps = conceptGapsData.filter(
    (gap) => selectedCategory === 'All' || gap.category === selectedCategory
  );

  // Helper styling based on severity level
  const getSeverityStyle = (severity: ConceptGap['severity'], errorRate: number) => {
    if (severity === 'critical') {
      return {
        bg: 'bg-rose-950/70 border-rose-500/50 hover:border-rose-400',
        text: 'text-rose-400',
        badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        intensityBar: 'bg-gradient-to-r from-rose-600 to-red-500',
        label: 'Critical Gap',
      };
    }
    if (severity === 'moderate') {
      return {
        bg: 'bg-amber-950/70 border-amber-500/50 hover:border-amber-400',
        text: 'text-amber-400',
        badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        intensityBar: 'bg-gradient-to-r from-amber-600 to-orange-500',
        label: 'Moderate Friction',
      };
    }
    if (severity === 'minor') {
      return {
        bg: 'bg-yellow-950/50 border-yellow-500/40 hover:border-yellow-300',
        text: 'text-yellow-300',
        badgeBg: 'bg-yellow-500/20 text-yellow-200 border-yellow-500/30',
        intensityBar: 'bg-gradient-to-r from-yellow-600 to-amber-400',
        label: 'Minor Slips',
      };
    }
    return {
      bg: 'bg-emerald-950/50 border-emerald-500/30 hover:border-emerald-400',
      text: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      intensityBar: 'bg-gradient-to-r from-emerald-600 to-teal-400',
      label: 'Strong Mastery',
    };
  };

  return (
    <div className="glass-card rounded-3xl p-6 border border-purple-500/30 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 via-purple-600 to-amber-400 p-0.5 shadow-lg shadow-rose-500/20 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Brain className="w-6 h-6 text-rose-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-poppins font-extrabold text-xl text-white">Knowledge Gaps Heatmap</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1">
                <AlertTriangle className="w-3 h-3 text-rose-400" />
                <span>Misconception Diagnostic</span>
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Color-coded analysis of past mistakes to target weak concepts and prevent recurring error patterns.
            </p>
          </div>
        </div>

        {/* Legend Pills */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
          <span className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Critical (&gt;50% error)</span>
          </span>
          <span className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Moderate (30-50%)</span>
          </span>
          <span className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-yellow-500/20 text-yellow-200 border border-yellow-500/30">
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            <span>Minor (10-30%)</span>
          </span>
          <span className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Mastered (&lt;10%)</span>
          </span>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
              selectedCategory === cat
                ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30'
                : 'bg-slate-900/80 text-slate-400 border-white/5 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Heatmap Matrix Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredGaps.map((gap) => {
          const style = getSeverityStyle(gap.severity, gap.errorRate);
          const isSelected = selectedConcept?.id === gap.id;

          return (
            <motion.div
              key={gap.id}
              whileHover={{ scale: 1.02, y: -2 }}
              onClick={() => setSelectedConcept(gap)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-3 relative overflow-hidden shadow-lg flex flex-col justify-between ${
                style.bg
              } ${isSelected ? 'ring-2 ring-purple-400 shadow-purple-500/30' : ''}`}
            >
              {/* Category & Severity Tag */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    {gap.category}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${style.badgeBg}`}>
                    {style.label}
                  </span>
                </div>

                <h3 className="font-poppins font-extrabold text-sm text-white line-clamp-2">
                  {gap.topic}
                </h3>
              </div>

              {/* Heat Error Bar & Stats */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Error Frequency</span>
                  <span className={`font-bold ${style.text}`}>
                    {gap.errorCount}/{gap.totalAttempts} ({gap.errorRate}%)
                  </span>
                </div>

                <div className="w-full h-2.5 bg-slate-950/80 rounded-full p-0.5 border border-white/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${gap.errorRate}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full rounded-full ${style.intensityBar}`}
                  />
                </div>
              </div>

              {/* Bottom Quick Trigger */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-semibold text-slate-300">
                <span className="flex items-center space-x-1">
                  <Info className="w-3.5 h-3.5 text-purple-300" />
                  <span>View Diagnostic</span>
                </span>
                <ChevronRight className="w-4 h-4 text-purple-400" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* DETAILED DIAGNOSTIC MODAL DRAWER FOR SELECTED CONCEPT */}
      <AnimatePresence>
        {selectedConcept && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-purple-500/40 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-purple-300 uppercase">
                    {selectedConcept.category} Diagnostic
                  </span>
                  <h3 className="font-poppins font-extrabold text-xl text-white">
                    {selectedConcept.topic}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedConcept(null)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Error Severity Metrics */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/80 border border-white/10">
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Error Rate</p>
                  <p className="text-lg font-mono font-black text-rose-400">{selectedConcept.errorRate}%</p>
                </div>
                <div className="text-center border-x border-white/10">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Times Triggered</p>
                  <p className="text-lg font-mono font-black text-amber-300">{selectedConcept.errorCount} logs</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Total Attempts</p>
                  <p className="text-lg font-mono font-black text-purple-300">{selectedConcept.totalAttempts}</p>
                </div>
              </div>

              {/* Primary Misconception Breakdown */}
              <div className="space-y-2 p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30">
                <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Primary Root Misconception Pattern</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {selectedConcept.topMisconception}
                </p>
              </div>

              {/* Sample Mistake Log */}
              <div className="space-y-2 p-4 rounded-2xl bg-slate-950/90 border border-white/10">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Past Mistake Log Sample</span>
                <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-300 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <span>Equation: {selectedConcept.sampleEquation}</span>
                </div>
                <p className="text-xs text-slate-300 italic pt-1">
                  "{selectedConcept.sampleErrorText}"
                </p>
              </div>

              {/* AI Remediation Insight */}
              <div className="space-y-2 p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30">
                <div className="flex items-center space-x-2 text-purple-300 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>AI Tutor Remediation Strategy</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {selectedConcept.aiRemediationTip}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  onClick={() => setSelectedConcept(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const topic = selectedConcept.topic;
                    setSelectedConcept(null);
                    if (onPracticeConcept) {
                      onPracticeConcept(topic);
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-poppins font-extrabold text-xs shadow-lg shadow-purple-600/30 flex items-center space-x-2"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Practice This Gap Now</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
