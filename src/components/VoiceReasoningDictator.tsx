import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  Plus, 
  Brain, 
  HelpCircle, 
  Send,
  AlertCircle,
  Radio
} from 'lucide-react';

interface VoiceReasoningDictatorProps {
  currentStepInput: string;
  onUpdateStepInput: (text: string) => void;
  onAppendStep: (expression: string) => void;
  onSetSpokenReasoning: (reasoningText: string) => void;
  spokenReasoning: string;
  isAnalyzing: boolean;
  onAnalyzeWithVoice: () => void;
}

export const VoiceReasoningDictator: React.FC<VoiceReasoningDictatorProps> = ({
  currentStepInput,
  onUpdateStepInput,
  onAppendStep,
  onSetSpokenReasoning,
  spokenReasoning,
  isAnalyzing,
  onAnalyzeWithVoice,
}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [isSpeechSupported, setIsSpeechSupported] = useState<boolean>(true);
  const [dictationMode, setDictationMode] = useState<'step' | 'reasoning'>('step');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let finalTranscriptChunk = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptText = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscriptChunk += transcriptText + ' ';
          } else {
            currentInterim += transcriptText;
          }
        }

        setInterimTranscript(currentInterim);

        if (finalTranscriptChunk) {
          const cleanChunk = finalTranscriptChunk.trim();
          if (dictationMode === 'step') {
            // Normalize math voice speech if user said e.g. "two x plus five equals ten"
            const normalizedMath = normalizeMathSpeech(cleanChunk);
            onUpdateStepInput(
              currentStepInput ? `${currentStepInput} ${normalizedMath}` : normalizedMath
            );
          } else {
            onSetSpokenReasoning(
              spokenReasoning ? `${spokenReasoning} ${cleanChunk}` : cleanChunk
            );
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Web Speech API error:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMessage('Microphone access was denied. Please allow microphone permissions in browser settings.');
        } else if (event.error !== 'no-speech') {
          setErrorMessage(`Speech recognition notice: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.error('Failed to setup SpeechRecognition:', e);
      setIsSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore cleanup errors
        }
      }
    };
  }, [dictationMode, currentStepInput, spokenReasoning]);

  // Helper to normalize common spoken math phrases to algebraic notation
  const normalizeMathSpeech = (speech: string): string => {
    let result = speech.toLowerCase();

    // Map common words to math symbols
    const mathReplacements: [RegExp, string][] = [
      [/\bequals\b/g, '='],
      [/\bplus\b/g, '+'],
      [/\bminus\b/g, '-'],
      [/\btimes\b/g, '*'],
      [/\bdivided by\b/g, '/'],
      [/\bsquared\b/g, '²'],
      [/\bnegative\b/g, '-'],
      [/\bzero\b/g, '0'],
      [/\bone\b/g, '1'],
      [/\btwo\b/g, '2'],
      [/\bthree\b/g, '3'],
      [/\bfour\b/g, '4'],
      [/\bfive\b/g, '5'],
      [/\bsix\b/g, '6'],
      [/\bseven\b/g, '7'],
      [/\beight\b/g, '8'],
      [/\bnine\b/g, '9'],
      [/\bten\b/g, '10'],
      [/\bopen parenthesis\b/g, '('],
      [/\bclose parenthesis\b/g, ')'],
    ];

    mathReplacements.forEach(([pattern, replacement]) => {
      result = result.replace(pattern, replacement);
    });

    // Clean up spaces around operators e.g. "2 x + 3 = 10" -> "2x + 3 = 10"
    result = result.replace(/(\d)\s+([a-zA-Z])/g, '$1$2');
    return result;
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        setIsListening(false);
      }
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error('Error starting speech recognition:', e);
      }
    }
  };

  const handleClearReasoning = () => {
    onSetSpokenReasoning('');
  };

  return (
    <div className="glass-card rounded-3xl p-5 border border-purple-500/30 space-y-4 shadow-xl relative overflow-hidden">
      {/* Ambient background pulse when mic is active */}
      <div 
        className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
          isListening ? 'bg-rose-500/30 animate-pulse' : 'bg-purple-500/15'
        }`} 
      />

      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className={`p-2 rounded-2xl border transition-all ${
            isListening 
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 shadow-lg shadow-rose-500/30' 
              : 'bg-purple-500/20 border-purple-500/30 text-purple-300'
          }`}>
            <Mic className={`w-4 h-4 ${isListening ? 'animate-bounce text-rose-400' : ''}`} />
          </div>
          <div>
            <h4 className="font-poppins font-bold text-xs sm:text-sm text-white flex items-center space-x-2">
              <span>Web Speech Math Dictation</span>
              {isListening && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold flex items-center space-x-1 animate-pulse">
                  <Radio className="w-3 h-3 text-rose-400" />
                  <span>Listening Live</span>
                </span>
              )}
            </h4>
            <p className="text-[11px] text-slate-400">
              Dictate math steps & verbal reasoning out loud for AI misconception mapping
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setDictationMode('step')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              dictationMode === 'step' 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Dictate Step
          </button>
          <button
            onClick={() => setDictationMode('reasoning')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              dictationMode === 'reasoning' 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Dictate Reasoning
          </button>
        </div>
      </div>

      {/* Unsupported Browser Alert */}
      {!isSpeechSupported && (
        <div className="p-3 rounded-2xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Web Speech API is not supported in this browser. You can still type your reasoning manually below.</span>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center justify-between space-x-2">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="text-slate-400 hover:text-white text-xs font-bold">✕</button>
        </div>
      )}

      {/* Mic Main Control Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            onClick={toggleListening}
            disabled={!isSpeechSupported}
            className={`px-5 py-2.5 rounded-2xl font-poppins font-extrabold text-xs shadow-xl flex items-center justify-center space-x-2 transition-all w-full sm:w-auto ${
              isListening
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/40 animate-pulse'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/30'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4 text-white" />
                <span>Stop Dictation</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-amber-300" />
                <span>Start Dictating ({dictationMode === 'step' ? 'Step' : 'Reasoning'})</span>
              </>
            )}
          </button>

          {/* Audio Waveform Visualizer simulation during speech */}
          {isListening && (
            <div className="flex items-center space-x-1 h-6">
              {[0.4, 0.8, 1, 0.6, 0.9, 0.5, 0.7].map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ height: ['8px', `${h * 24}px`, '8px'] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                  className="w-1 bg-rose-400 rounded-full"
                />
              ))}
            </div>
          )}
        </div>

        {/* Quick Voice Phrases chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto max-w-full pb-1 text-[10px]">
          <span className="text-slate-500 font-semibold shrink-0">Quick terms:</span>
          {['"2x + 6 = 10"', '"subtract 6"', '"divide by 2"', '"distributed incorrectly"'].map((phrase) => (
            <button
              key={phrase}
              onClick={() => {
                const clean = phrase.replace(/"/g, '');
                if (dictationMode === 'step') {
                  onUpdateStepInput(currentStepInput ? `${currentStepInput} ${clean}` : clean);
                } else {
                  onSetSpokenReasoning(spokenReasoning ? `${spokenReasoning} ${clean}` : clean);
                }
              }}
              className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white shrink-0 font-mono"
            >
              {phrase}
            </button>
          ))}
        </div>
      </div>

      {/* Interim Live Speech Transcript Feedback */}
      <AnimatePresence>
        {interimTranscript && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs italic font-mono flex items-center space-x-2"
          >
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse shrink-0" />
            <span className="truncate">Hearing: "{interimTranscript}..."</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dictated Verbal Reasoning Display Box */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
          <span className="flex items-center space-x-1.5">
            <Brain className="w-3.5 h-3.5 text-purple-400" />
            <span>Dictated Verbal Rationale / Thought Process:</span>
          </span>
          {spokenReasoning && (
            <button
              onClick={handleClearReasoning}
              className="text-[10px] text-slate-400 hover:text-rose-400 transition-colors"
            >
              Clear Text
            </button>
          )}
        </div>

        <textarea
          value={spokenReasoning}
          onChange={(e) => onSetSpokenReasoning(e.target.value)}
          placeholder="Speak or type your reasoning out loud e.g. 'I distributed 2 to x and 3, but I forgot that -3 multiplied by -4 becomes positive 12 because...'"
          rows={2}
          className="w-full glass-input p-3 rounded-2xl text-xs text-white border border-slate-800 focus:border-purple-500 resize-none"
        />
      </div>

      {/* Integrated Analyze Button with Voice Rationale */}
      {spokenReasoning.trim() && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-1 flex justify-end"
        >
          <button
            onClick={onAnalyzeWithVoice}
            disabled={isAnalyzing}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-slate-950 font-poppins font-extrabold text-xs shadow-lg shadow-purple-600/30 flex items-center space-x-2 transition-all"
          >
            <Sparkles className="w-4 h-4 text-slate-950 animate-spin-slow" />
            <span>Analyze Steps + Voice Rationale with AI</span>
          </button>
        </motion.div>
      )}
    </div>
  );
};
