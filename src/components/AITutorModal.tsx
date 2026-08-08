import React, { useState, useEffect } from 'react';
import { AITutorExplanation } from '../types';
import { 
  Sparkles, 
  X, 
  Volume2, 
  VolumeX, 
  Lightbulb, 
  Eye, 
  Globe, 
  CheckCircle2, 
  HelpCircle, 
  BookOpen, 
  Compass, 
  Heart,
  ChevronRight,
  RotateCcw,
  History,
  Clock,
  Trash2,
  ArrowRight,
  Bookmark
} from 'lucide-react';

export interface TutorHistoryItem {
  id: string;
  timestamp: string;
  problemEquation?: string;
  misconceptionType?: string;
  explanation: AITutorExplanation;
}

interface AITutorModalProps {
  explanation: AITutorExplanation | null;
  onClose: () => void;
  isLoading?: boolean;
}

const defaultHistoryItems: TutorHistoryItem[] = [
  {
    id: 'hist_1',
    timestamp: 'Today at 6:45 AM',
    problemEquation: '-3(x - 4) = 15',
    misconceptionType: 'Distribution Error',
    explanation: {
      simpleExplanation: 'When distributing a negative number like -3 across parentheses (x - 4), you must multiply BOTH terms inside by -3. -3 times x gives -3x, and -3 times -4 gives +12.',
      visualExplanation: {
        title: 'Distribution Breakdown',
        stepsDiagram: [
          { step: '-3 · (x)', note: 'Yields -3x', highlight: false },
          { step: '-3 · (-4)', note: 'Negative times negative yields +12', highlight: true },
          { step: '-3x + 12 = 15', note: 'Correct expanded equation', highlight: false },
        ]
      },
      realLifeAnalogy: 'Think of cancelling a $4 debt 3 times. Taking away a debt gives you $12 in credit!',
      solvedExample: {
        problem: 'Solve -2(y - 5) = 18',
        steps: [
          '-2(y - 5) = 18',
          '-2y + 10 = 18',
          '-2y = 8',
          'y = -4'
        ]
      },
      practiceQuestions: [
        {
          id: 'pq_hist_1',
          question: 'What is the expanded form of -4(a - 3)?',
          options: ['-4a - 12', '-4a + 12', '4a - 12', '-4a - 7'],
          correctIndex: 1,
          explanation: 'Multiplying -4 by -3 produces +12, resulting in -4a + 12.'
        }
      ],
      microLesson: {
        title: 'Mastering Negative Parentheses',
        content: 'Negative signs outside parentheses act as a sign flipper for every single term inside.',
        keyTakeaway: '-a(b - c) = -ab + ac'
      },
      nextRecommendation: {
        topic: 'Multi-Step Linear Equations',
        reason: 'Consolidate sign distribution skills.'
      },
      motivationalFeedback: 'Great effort! Double-check negative signs before proceeding.'
    }
  },
  {
    id: 'hist_2',
    timestamp: 'Yesterday at 4:15 PM',
    problemEquation: '(1/2)x + 3 = 7',
    misconceptionType: 'Fractional Coefficients',
    explanation: {
      simpleExplanation: 'When clearing fractions by multiplying by the denominator (2), every term on both sides must be multiplied by 2, including whole numbers like +3.',
      visualExplanation: {
        title: 'Clearing Denominators',
        stepsDiagram: [
          { step: '2 · (1/2)x', note: 'Yields 1x', highlight: false },
          { step: '2 · 3', note: 'Must multiply non-fraction term too -> 6', highlight: true },
          { step: '2 · 7', note: 'Multiply right hand side -> 14', highlight: false },
        ]
      },
      realLifeAnalogy: 'If you double a cake recipe, you must double every ingredient, not just the flour!',
      solvedExample: {
        problem: 'Solve (1/3)x + 2 = 5',
        steps: [
          'Multiply all by 3: x + 6 = 15',
          'Subtract 6: x = 9'
        ]
      },
      practiceQuestions: [],
      microLesson: {
        title: 'The Golden Rule of Equations',
        content: 'Whatever operation you apply to clear a fraction must touch every isolated term.',
        keyTakeaway: 'Always distribute the LCD to ALL terms.'
      },
      nextRecommendation: {
        topic: 'Equations with Mixed Denominators',
        reason: 'Practice finding Least Common Denominator.'
      },
      motivationalFeedback: 'Fraction clearing is a powerful technique once mastered!'
    }
  }
];

export const AITutorModal: React.FC<AITutorModalProps> = ({
  explanation,
  onClose,
  isLoading = false,
}) => {
  const [activeTab, setActiveTab] = useState<'explanation' | 'visual' | 'analogy' | 'example' | 'practice' | 'microlesson' | 'history'>('explanation');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showQuestionResults, setShowQuestionResults] = useState<Record<string, boolean>>({});
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Tutor Explanation History State
  const [historyItems, setHistoryItems] = useState<TutorHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('cognipath_tutor_history');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse tutor history from localStorage', e);
    }
    return defaultHistoryItems;
  });

  const [activeHistoryEntry, setActiveHistoryEntry] = useState<TutorHistoryItem | null>(null);

  // Automatically save incoming explanation to history if new
  useEffect(() => {
    if (explanation) {
      const exists = historyItems.some(
        (h) => h.explanation.simpleExplanation === explanation.simpleExplanation
      );
      if (!exists) {
        const newEntry: TutorHistoryItem = {
          id: `hist_${Date.now()}`,
          timestamp: 'Just now',
          problemEquation: explanation.microLesson?.title || 'Current Math Problem',
          misconceptionType: 'Targeted Insight',
          explanation,
        };
        const updated = [newEntry, ...historyItems];
        setHistoryItems(updated);
        try {
          localStorage.setItem('cognipath_tutor_history', JSON.stringify(updated));
        } catch (e) {
          console.warn('Failed to save tutor history', e);
        }
      }
    }
  }, [explanation]);

  // Current explanation to display (active historical entry if selected, or live prop explanation)
  const currentExplanation = activeHistoryEntry ? activeHistoryEntry.explanation : explanation;

  if (!currentExplanation && !isLoading && historyItems.length === 0) return null;

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelectAnswer = (qId: string, optionIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
    setShowQuestionResults((prev) => ({ ...prev, [qId]: true }));
  };

  const handleDeleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = historyItems.filter((h) => h.id !== id);
    setHistoryItems(updated);
    if (activeHistoryEntry?.id === id) {
      setActiveHistoryEntry(null);
    }
    try {
      localStorage.setItem('cognipath_tutor_history', JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to update localStorage history', err);
    }
  };

  const handleClearAllHistory = () => {
    setHistoryItems([]);
    setActiveHistoryEntry(null);
    try {
      localStorage.removeItem('cognipath_tutor_history');
    } catch (err) {
      console.warn('Failed to clear localStorage history', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-4xl max-h-[90vh] glass-card rounded-3xl border border-purple-500/30 shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-poppins font-bold text-lg text-white flex items-center space-x-2">
                <span>CogniPath AI Tutor</span>
                {activeHistoryEntry ? (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>Viewing Archived History</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
                    Adaptive Support
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                {activeHistoryEntry 
                  ? `Reviewing saved explanation from ${activeHistoryEntry.timestamp}` 
                  : 'Personalized breakdown tailored to your learning style'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {activeHistoryEntry && (
              <button
                onClick={() => setActiveHistoryEntry(null)}
                className="px-2.5 py-1.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-200 hover:bg-purple-500/30 text-xs font-bold transition-all"
              >
                Return to Latest
              </button>
            )}

            {currentExplanation && (
              <button
                onClick={() => handleSpeak(currentExplanation.simpleExplanation)}
                className={`p-2 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                  isSpeaking
                    ? 'bg-purple-600 text-white border-purple-400 animate-pulse'
                    : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
                }`}
                title="Audio Explanation"
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-purple-400" />}
                <span className="hidden sm:inline">{isSpeaking ? 'Pause Audio' : 'Listen'}</span>
              </button>
            )}

            <button
              onClick={() => {
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {isLoading ? (
          <div className="p-12 text-center space-y-4 my-auto">
            <div className="w-12 h-12 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin mx-auto" />
            <p className="text-sm text-slate-300 font-medium">Generating personalized micro-lesson with Gemini AI...</p>
            <p className="text-xs text-slate-500">Constructing simple explanation, visual diagram, and practice quiz</p>
          </div>
        ) : currentExplanation || activeTab === 'history' ? (
          <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row">
            {/* Left Tab Sidebar */}
            <div className="w-full lg:w-60 p-4 border-b lg:border-b-0 lg:border-r border-slate-800/80 bg-slate-900/40 space-y-1 shrink-0">
              <button
                onClick={() => setActiveTab('explanation')}
                className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'explanation' ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40' : 'text-slate-400 hover:bg-slate-800/60'
                }`}
              >
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>Simple Explanation</span>
              </button>

              <button
                onClick={() => setActiveTab('visual')}
                className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'visual' ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40' : 'text-slate-400 hover:bg-slate-800/60'
                }`}
              >
                <Eye className="w-4 h-4 text-blue-400" />
                <span>Visual Diagram</span>
              </button>

              <button
                onClick={() => setActiveTab('analogy')}
                className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'analogy' ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40' : 'text-slate-400 hover:bg-slate-800/60'
                }`}
              >
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>Real-life Analogy</span>
              </button>

              <button
                onClick={() => setActiveTab('example')}
                className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'example' ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40' : 'text-slate-400 hover:bg-slate-800/60'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                <span>Solved Example</span>
              </button>

              <button
                onClick={() => setActiveTab('practice')}
                className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'practice' ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40' : 'text-slate-400 hover:bg-slate-800/60'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-rose-400" />
                <span>Practice Quiz ({currentExplanation?.practiceQuestions?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab('microlesson')}
                className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'microlesson' ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40' : 'text-slate-400 hover:bg-slate-800/60'
                }`}
              >
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Micro Lesson</span>
              </button>

              {/* TUTOR HISTORY TAB */}
              <div className="pt-2 border-t border-slate-800/80 mt-2">
                <button
                  onClick={() => setActiveTab('history')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'history' 
                      ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40' 
                      : 'text-slate-400 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <History className="w-4 h-4 text-amber-400" />
                    <span>Tutor History</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                    {historyItems.length}
                  </span>
                </button>
              </div>
            </div>

            {/* Right Tab Panel Content */}
            <div className="flex-1 p-6 space-y-6">
              {/* Tab 1: Simple Explanation */}
              {activeTab === 'explanation' && currentExplanation && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-2">
                    <h4 className="font-poppins font-bold text-base text-purple-200 flex items-center space-x-2">
                      <Lightbulb className="w-5 h-5 text-amber-400" />
                      <span>Why This Mistake Happened</span>
                    </h4>
                    <p className="text-sm text-slate-200 leading-relaxed font-sans">
                      {currentExplanation.simpleExplanation}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start space-x-3">
                    <Heart className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-rose-300 uppercase tracking-wider">Motivational AI Feedback</h5>
                      <p className="text-xs text-slate-300 mt-1 leading-snug">{currentExplanation.motivationalFeedback}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Visual Explanation Diagram */}
              {activeTab === 'visual' && currentExplanation && (
                <div className="space-y-4 animate-in fade-in">
                  <h4 className="font-poppins font-bold text-base text-white flex items-center space-x-2">
                    <Eye className="w-5 h-5 text-blue-400" />
                    <span>{currentExplanation.visualExplanation?.title || 'Visual Step Breakdown'}</span>
                  </h4>

                  <div className="space-y-3">
                    {currentExplanation.visualExplanation?.stepsDiagram?.map((st, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs transition-all ${
                          st.highlight
                            ? 'bg-purple-900/40 border-purple-500/50 text-white shadow-lg shadow-purple-500/10'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="font-mono text-sm font-semibold">{st.step}</div>
                        <div className="text-slate-400 text-right max-w-xs">{st.note}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Real-Life Analogy */}
              {activeTab === 'analogy' && currentExplanation && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-3">
                    <h4 className="font-poppins font-bold text-base text-emerald-300 flex items-center space-x-2">
                      <Globe className="w-5 h-5 text-emerald-400" />
                      <span>Real-World Mental Model</span>
                    </h4>
                    <p className="text-sm text-slate-200 leading-relaxed font-sans">
                      "{currentExplanation.realLifeAnalogy}"
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 4: Solved Example */}
              {activeTab === 'example' && currentExplanation && (
                <div className="space-y-4 animate-in fade-in">
                  <h4 className="font-poppins font-bold text-base text-white flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                    <span>Step-by-Step Solved Reference Example</span>
                  </h4>

                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                    <p className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
                      Problem: {currentExplanation.solvedExample?.problem}
                    </p>

                    <div className="space-y-2">
                      {currentExplanation.solvedExample?.steps?.map((s, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-slate-950 font-mono text-xs text-slate-200 border border-slate-800/80">
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: Practice Questions */}
              {activeTab === 'practice' && currentExplanation && (
                <div className="space-y-6 animate-in fade-in">
                  <h4 className="font-poppins font-bold text-base text-white flex items-center space-x-2">
                    <HelpCircle className="w-5 h-5 text-rose-400" />
                    <span>Instant Practice Questions</span>
                  </h4>

                  {currentExplanation.practiceQuestions?.map((q) => {
                    const selectedIdx = selectedAnswers[q.id];
                    const isAnswered = showQuestionResults[q.id];
                    const isCorrect = selectedIdx === q.correctIndex;

                    return (
                      <div key={q.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                        <p className="text-sm font-semibold text-slate-100">{q.question}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options?.map((opt, optIdx) => {
                            let btnStyle = 'bg-slate-950 border-slate-800 hover:border-purple-500/50 text-slate-300';
                            if (isAnswered) {
                              if (optIdx === q.correctIndex) {
                                btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                              } else if (optIdx === selectedIdx) {
                                btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                              }
                            }

                            return (
                              <button
                                key={optIdx}
                                onClick={() => handleSelectAnswer(q.id, optIdx)}
                                disabled={isAnswered}
                                className={`p-3 rounded-xl border text-xs text-left transition-all ${btnStyle}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {isAnswered && (
                          <div className={`p-3 rounded-xl border text-xs ${isCorrect ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-rose-950/40 border-rose-500/40 text-rose-200'}`}>
                            <p className="font-bold">{isCorrect ? '🎉 Correct!' : '❌ Not quite right.'}</p>
                            <p className="mt-1 text-slate-300">{q.explanation}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tab 6: Micro Lesson */}
              {activeTab === 'microlesson' && currentExplanation && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-3">
                    <h4 className="font-poppins font-bold text-base text-cyan-200">
                      {currentExplanation.microLesson?.title || 'Micro Lesson'}
                    </h4>
                    <p className="text-sm text-slate-200 leading-relaxed font-sans">
                      {currentExplanation.microLesson?.content}
                    </p>
                    <div className="pt-2 border-t border-cyan-500/20 text-xs font-semibold text-cyan-300">
                      Key Takeaway: {currentExplanation.microLesson?.keyTakeaway}
                    </div>
                  </div>

                  {currentExplanation.nextRecommendation && (
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-500">Next Learning Path Step</p>
                        <p className="text-xs font-bold text-purple-300 mt-0.5">{currentExplanation.nextRecommendation.topic}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{currentExplanation.nextRecommendation.reason}</p>
                      </div>
                      <Compass className="w-6 h-6 text-purple-400 shrink-0" />
                    </div>
                  )}
                </div>
              )}

              {/* TAB 7: TUTOR HISTORY PANEL */}
              {activeTab === 'history' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <h4 className="font-poppins font-bold text-base text-amber-200 flex items-center space-x-2">
                        <History className="w-5 h-5 text-amber-400" />
                        <span>Previous Tutor Explanations</span>
                      </h4>
                      <p className="text-xs text-slate-400">
                        Review past AI micro-lessons and explanations received for math problem types
                      </p>
                    </div>

                    {historyItems.length > 0 && (
                      <button
                        onClick={handleClearAllHistory}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 border border-slate-700 text-xs font-bold transition-all flex items-center space-x-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Clear History</span>
                      </button>
                    )}
                  </div>

                  {historyItems.length === 0 ? (
                    <div className="p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
                      <Clock className="w-8 h-8 text-slate-500 mx-auto" />
                      <p className="text-sm text-slate-300 font-semibold">No Tutor History Yet</p>
                      <p className="text-xs text-slate-500">
                        Explanations generated when solving math problems will automatically be archived here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {historyItems.map((item) => {
                        const isSelected = activeHistoryEntry?.id === item.id;

                        return (
                          <div
                            key={item.id}
                            onClick={() => {
                              setActiveHistoryEntry(item);
                              setActiveTab('explanation');
                            }}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 hover:border-amber-500/50 ${
                              isSelected
                                ? 'bg-amber-950/40 border-amber-500 text-white ring-2 ring-amber-500/30'
                                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-850'
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center space-x-2">
                                <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-mono font-bold text-[10px] border border-amber-500/30">
                                  {item.problemEquation || 'Math Problem'}
                                </span>
                                {item.misconceptionType && (
                                  <span className="px-2 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 font-bold text-[10px] border border-purple-500/30">
                                    {item.misconceptionType}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-[11px] text-slate-500 font-mono">{item.timestamp}</span>
                                <button
                                  onClick={(e) => handleDeleteHistoryItem(item.id, e)}
                                  className="p-1 rounded-lg hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors"
                                  title="Delete history entry"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <p className="text-xs text-slate-200 line-clamp-2 font-sans pt-1">
                              "{item.explanation.simpleExplanation}"
                            </p>

                            <div className="flex items-center justify-between pt-1 text-[11px] font-semibold text-amber-300">
                              <span className="flex items-center space-x-1">
                                <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                                <span>Includes Diagram, Solved Example & Practice Quiz</span>
                              </span>
                              <span className="flex items-center space-x-1 text-purple-300 hover:text-white">
                                <span>Review Explanation</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : null}

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between text-xs text-slate-400">
          <span>Powered by CogniPath AI Engine</span>
          <button
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-all"
          >
            Got It, Back to Practice
          </button>
        </div>
      </div>
    </div>
  );
};
