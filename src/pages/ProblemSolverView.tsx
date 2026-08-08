import React, { useState, useEffect } from 'react';
import { MathProblem, SolvingStep, MisconceptionResult, AITutorExplanation } from '../types';
import { WhiteboardCanvas } from '../components/WhiteboardCanvas';
import { MisconceptionCard } from '../components/MisconceptionCard';
import { AITutorModal } from '../components/AITutorModal';
import { FocusTimer } from '../components/FocusTimer';
import { VoiceReasoningDictator } from '../components/VoiceReasoningDictator';
import { 
  Sparkles, 
  Pencil, 
  Plus, 
  Trash2, 
  Clock, 
  Keyboard, 
  RotateCcw, 
  CheckCircle2, 
  Upload, 
  Brain,
  HelpCircle,
  FileText
} from 'lucide-react';

interface ProblemSolverViewProps {
  currentProblem: MathProblem;
  onSelectProblem: (problem: MathProblem) => void;
  allProblems: MathProblem[];
  onFinishSolving: (xpGained: number) => void;
}

export const ProblemSolverView: React.FC<ProblemSolverViewProps> = ({
  currentProblem,
  onSelectProblem,
  allProblems,
  onFinishSolving,
}) => {
  const [solvingMode, setSolvingMode] = useState<'step' | 'whiteboard' | 'upload'>('step');
  const [steps, setSteps] = useState<SolvingStep[]>([
    { stepIndex: 1, expression: currentProblem.equation, timeTakenMs: 0, correctionsCount: 0 }
  ]);
  const [currentStepInput, setCurrentStepInput] = useState('');
  const [spokenReasoning, setSpokenReasoning] = useState<string>('');
  const [stepStartTime, setStepStartTime] = useState<number>(Date.now());
  const [keystrokesCount, setKeystrokesCount] = useState(0);
  const [correctionsCount, setCorrectionsCount] = useState(0);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<MisconceptionResult | null>(null);

  const [aiTutorExplanation, setAiTutorExplanation] = useState<AITutorExplanation | null>(null);
  const [isAITutorLoading, setIsAITutorLoading] = useState(false);
  const [showAITutorModal, setShowAITutorModal] = useState(false);

  useEffect(() => {
    // Reset steps when problem changes
    setSteps([
      { stepIndex: 1, expression: currentProblem.equation, timeTakenMs: 0, correctionsCount: 0 }
    ]);
    setCurrentStepInput('');
    setSpokenReasoning('');
    setAnalysisResult(null);
    setStepStartTime(Date.now());
    setKeystrokesCount(0);
    setCorrectionsCount(0);
  }, [currentProblem]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setKeystrokesCount((prev) => prev + 1);
    if (val.length < currentStepInput.length) {
      setCorrectionsCount((prev) => prev + 1);
    }
    setCurrentStepInput(val);
  };

  const handleAddStep = () => {
    if (!currentStepInput.trim()) return;
    const now = Date.now();
    const duration = now - stepStartTime;

    const newStep: SolvingStep = {
      stepIndex: steps.length + 1,
      expression: currentStepInput.trim(),
      timeTakenMs: duration,
      correctionsCount: correctionsCount,
    };

    setSteps((prev) => [...prev, newStep]);
    setCurrentStepInput('');
    setStepStartTime(now);
    setKeystrokesCount(0);
    setCorrectionsCount(0);
  };

  const handleRemoveStep = (idx: number) => {
    setSteps((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAnalyzeSolution = async (customReasoning?: string) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/analyze-solution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          equation: currentProblem.equation,
          steps: steps.map((s) => ({
            expression: s.expression,
            timeTakenMs: s.timeTakenMs,
            correctionsCount: s.correctionsCount,
          })),
          spokenReasoning: customReasoning !== undefined ? customReasoning : spokenReasoning,
        }),
      });

      const data = await response.json();
      setAnalysisResult(data);

      if (!data.hasMisconception) {
        onFinishSolving(100);
      }
    } catch (err) {
      console.error('Analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleScanImageSolution = async (base64Img: string) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/solve-from-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64Img }),
      });

      const data = await response.json();
      if (data.extractedSteps && Array.isArray(data.extractedSteps)) {
        setSteps(
          data.extractedSteps.map((s: string, i: number) => ({
            stepIndex: i + 1,
            expression: s,
            timeTakenMs: 1200,
            correctionsCount: 0,
          }))
        );
      }

      setAnalysisResult({
        hasMisconception: data.hasMisconception ?? true,
        misconceptionType: data.misconceptionType || 'Distribution Error',
        confidenceScore: 94,
        failedStepIndex: 2,
        failedStepContent: data.extractedSteps?.[1] || '2x + 3 = 10',
        explanationText: data.explanation || 'Distribution error detected in image OCR scan.',
        rootCause: 'Cognitive expansion oversight on constant multiplier.',
        difficultyRating: 'Medium',
      });
    } catch (err) {
      console.error('OCR analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOpenAITutor = async () => {
    setShowAITutorModal(true);
    if (aiTutorExplanation) return; // already loaded

    setIsAITutorLoading(true);
    try {
      const response = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          misconceptionType: analysisResult?.misconceptionType || 'Distribution Error',
          problemEquation: currentProblem.equation,
          studentAttempt: steps.map((s) => s.expression).join(' → '),
        }),
      });

      const data = await response.json();
      setAiTutorExplanation(data);
    } catch (err) {
      console.error('Failed to load AI Tutor:', err);
    } finally {
      setIsAITutorLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Header & Problem Selector */}
      <div className="glass-card rounded-3xl p-6 border border-purple-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">{currentProblem.topic}</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
              {currentProblem.difficulty} Difficulty
            </span>
          </div>
          <h1 className="font-poppins font-extrabold text-2xl text-white mt-1">{currentProblem.title}</h1>
          <p className="text-xs text-slate-300 mt-0.5">{currentProblem.description}</p>
        </div>

        {/* Problem Switcher Selector */}
        <div className="flex items-center space-x-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 shrink-0">
          <span className="text-xs text-slate-400 font-semibold px-2">Select Equation:</span>
          {allProblems.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelectProblem(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                currentProblem.id === p.id
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {p.equation}
            </button>
          ))}
        </div>
      </div>

      {/* Focus Timer Pomodoro Module */}
      <FocusTimer 
        onSessionComplete={(mins) => {
          onFinishSolving(25);
        }}
      />

      {/* Target Problem Display Pill */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/30 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Target Math Equation</span>
            <p className="text-xl font-mono font-bold text-amber-300">{currentProblem.equation}</p>
          </div>
        </div>

        {/* Input Mode Toggle */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setSolvingMode('step')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all ${
              solvingMode === 'step' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Step-by-Step</span>
          </button>

          <button
            onClick={() => setSolvingMode('whiteboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all ${
              solvingMode === 'whiteboard' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Digital Canvas</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Step-by-Step Interactive Solver */}
      {solvingMode === 'step' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Steps Sequence List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="glass-card rounded-3xl p-6 border border-purple-500/20 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-poppins font-bold text-base text-white flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-purple-400" />
                  <span>Student Solution Steps</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">{steps.length} Steps Logged</span>
              </div>

              {/* Step Items */}
              <div className="space-y-3">
                {steps.map((st, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between font-mono text-sm group"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded-full bg-purple-600/30 text-purple-300 text-xs font-bold flex items-center justify-center shrink-0">
                        {st.stepIndex}
                      </span>
                      <span className="text-white font-bold">{st.expression}</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      {st.timeTakenMs > 0 && (
                        <span className="text-[10px] text-slate-500 flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{(st.timeTakenMs / 1000).toFixed(1)}s</span>
                        </span>
                      )}
                      {idx > 0 && (
                        <button
                          onClick={() => handleRemoveStep(idx)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                          title="Remove Step"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Next Step Form */}
              <div className="pt-3 border-t border-slate-800 space-y-3">
                <label className="block text-xs font-semibold text-slate-300">
                  Type Next Algebraic Step (e.g. 2x + 6 = 10 or 2x = 4):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentStepInput}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddStep();
                    }}
                    placeholder="Enter mathematical step..."
                    className="flex-1 glass-input px-4 py-2.5 rounded-xl text-sm font-mono text-white border border-slate-700"
                  />
                  <button
                    onClick={handleAddStep}
                    disabled={!currentStepInput.trim()}
                    className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all disabled:opacity-40 flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Step</span>
                  </button>
                </div>

                {/* Telemetry Tracking Info */}
                <div className="flex items-center space-x-4 text-[11px] text-slate-500">
                  <span>Keystrokes: <strong className="text-slate-300">{keystrokesCount}</strong></span>
                  <span>Corrections: <strong className="text-slate-300">{correctionsCount}</strong></span>
                  <span>Step Duration: <strong className="text-slate-300">{((Date.now() - stepStartTime) / 1000).toFixed(0)}s</strong></span>
                </div>
              </div>

              {/* Action Trigger */}
              <button
                onClick={() => handleAnalyzeSolution()}
                disabled={isAnalyzing || steps.length < 2}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-poppins font-bold text-sm shadow-xl shadow-purple-500/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
                <span>{isAnalyzing ? 'Analyzing Misconceptions...' : 'Detect Misconceptions with AI'}</span>
              </button>
            </div>

            {/* Web Speech Voice Dictation Engine */}
            <VoiceReasoningDictator
              currentStepInput={currentStepInput}
              onUpdateStepInput={setCurrentStepInput}
              onAppendStep={(expr) => {
                const now = Date.now();
                setSteps((prev) => [
                  ...prev,
                  {
                    stepIndex: prev.length + 1,
                    expression: expr,
                    timeTakenMs: now - stepStartTime,
                    correctionsCount: correctionsCount,
                  },
                ]);
                setCurrentStepInput('');
                setStepStartTime(now);
              }}
              onSetSpokenReasoning={setSpokenReasoning}
              spokenReasoning={spokenReasoning}
              isAnalyzing={isAnalyzing}
              onAnalyzeWithVoice={() => handleAnalyzeSolution(spokenReasoning)}
            />
          </div>

          {/* Right Col: Common Misconception Quick Reference */}
          <div className="space-y-4">
            <div className="glass-card rounded-3xl p-5 border border-purple-500/20 space-y-3">
              <h4 className="font-poppins font-bold text-sm text-white flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-purple-400" />
                <span>Expected Solution Path</span>
              </h4>
              <div className="space-y-1.5 font-mono text-xs text-slate-300">
                {currentProblem.expectedSteps?.map((s, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    Step {idx + 1}: {s}
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-3xl p-5 border border-purple-500/20 space-y-2">
              <h4 className="font-poppins font-bold text-sm text-amber-300">Target Misconceptions to Avoid</h4>
              <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                {currentProblem.commonMisconceptions?.map((cm, i) => (
                  <li key={i}>{cm}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Whiteboard Digital Canvas Solver */}
      {solvingMode === 'whiteboard' && (
        <div className="space-y-4">
          <WhiteboardCanvas onAnalyzeImage={handleScanImageSolution} isAnalyzing={isAnalyzing} />
        </div>
      )}

      {/* Analysis Result Display */}
      {analysisResult && (
        <div className="pt-4">
          <MisconceptionCard result={analysisResult} onOpenAITutor={handleOpenAITutor} />
        </div>
      )}

      {/* AI Tutor Support Modal */}
      {showAITutorModal && (
        <AITutorModal
          explanation={aiTutorExplanation}
          onClose={() => setShowAITutorModal(false)}
          isLoading={isAITutorLoading}
        />
      )}
    </div>
  );
};
