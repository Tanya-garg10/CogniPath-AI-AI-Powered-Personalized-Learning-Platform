import React, { useState } from 'react';
import { User } from '../types';
import { 
  Bot, 
  Sparkles, 
  Send, 
  Volume2, 
  VolumeX, 
  Brain, 
  HelpCircle, 
  BookOpen, 
  Lightbulb, 
  Zap, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  MessageSquareText, 
  Flame,
  Layers,
  ArrowRight
} from 'lucide-react';

interface AITutorStudioViewProps {
  user: User;
  onNavigate: (view: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  analogy?: string;
  timestamp: string;
}

export const AITutorStudioView: React.FC<AITutorStudioViewProps> = ({ user, onNavigate }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_1',
      sender: 'tutor',
      text: `Hello ${user.name}! I am your CogniPath AI Socratic Tutor. Instead of just giving answers, I help you discover *why* math works. What concept or equation would you like to explore today?`,
      analogy: '💡 Pro-tip: Ask me "Explain the Distributive Property like a pizza delivery" or "Why does (-3) × (-4) equal positive 12?"',
      timestamp: 'Just now',
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<'distributive' | 'signs' | 'variables' | 'fractions'>('distributive');

  // Quick concept cards
  const conceptTopics = [
    {
      id: 'distributive',
      title: 'Distributive Property',
      summary: '2(x + 3) = 2x + 6',
      misconception: 'Forgetting to multiply the outer constant by the second term.',
      analogy: 'Imagine ordering 2 gift boxes that each contain 1 shirt (x) and 3 candies. You get 2 shirts AND 6 candies, not 3 candies!',
    },
    {
      id: 'signs',
      title: 'Double Negative Signs',
      summary: '(-3) × (-4) = +12',
      misconception: 'Assuming negative times negative remains negative.',
      analogy: 'If someone takes away (negative) 3 debts of $4 (negative $4), you gain +$12 overall!',
    },
    {
      id: 'variables',
      title: 'Combining Like Terms',
      summary: '2x + 3 ≠ 5x',
      misconception: 'Adding coefficients of non-like terms.',
      analogy: '2 Apples + 3 Oranges = 2 Apples + 3 Oranges. You cannot call them 5 Apploranges!',
    },
    {
      id: 'fractions',
      title: 'Equation Fraction Isolations',
      summary: '(x / 4) = 5 ➔ x = 20',
      misconception: 'Adding or subtracting 4 instead of multiplying.',
      analogy: 'If a pizza is cut into 4 slices and each slice weighs 5 oz, the full pizza weighs 4 × 5 = 20 oz.',
    },
  ];

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setIsAsking(true);

    try {
      const response = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          misconceptionType: 'Socratic Conceptual Question',
          problemEquation: 'Concept Query',
          studentAttempt: textToSend,
        }),
      });

      const data = await response.json();

      const tutorMsg: ChatMessage = {
        id: `tut_${Date.now()}`,
        sender: 'tutor',
        text: data.socraticHint || data.conceptualBreakdown || `Great question about "${textToSend}"! Let's think step by step: Why do you think terms behave this way when we isolate them?`,
        analogy: data.realWorldAnalogy ? `🌍 Real-World Analogy: ${data.realWorldAnalogy}` : undefined,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, tutorMsg]);
    } catch (err) {
      console.error('Tutor stream error:', err);
      // Fallback
      setMessages((prev) => [
        ...prev,
        {
          id: `tut_${Date.now()}`,
          sender: 'tutor',
          text: `When working with "${textToSend}", remember that algebra is just balancing scales! Whatever operation you apply to the left side must also be applied symmetrically to the right side.`,
          analogy: '⚖️ Think of an equation like a balanced seesaw. Remove a weight from the left? You must remove the exact same weight from the right!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  const handleToggleSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
        setIsPlayingAudio(true);
      }
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Banner */}
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30">
            <Bot className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Interactive Socratic Learning Studio</span>
          </div>

          <h1 className="font-poppins font-extrabold text-2xl sm:text-3xl text-white">
            AI Tutor Studio & <span className="gradient-text">Concept Studio</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Unlike the <strong>AI Problem Solver</strong> (which evaluates your specific step-by-step equation calculations), the <strong>AI Tutor Studio</strong> is your interactive Socratic space to ask deep conceptual questions, discover mental analogies, and master mathematical core principles.
          </p>
        </div>

        <button
          onClick={() => onNavigate('solver')}
          className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-poppins font-bold text-xs shadow-xl shadow-indigo-600/30 flex items-center space-x-2 shrink-0 transition-all"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Switch to Problem Solver</span>
        </button>
      </div>

      {/* Main Grid: Interactive Chat Studio & Concept Micro-Lessons */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Socratic AI Chat Assistant */}
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl flex flex-col h-[600px]">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-poppins font-bold text-base text-white">Socratic AI Math Assistant</h3>
                <p className="text-[11px] text-slate-400">Powered by Gemini 3.6 Flash Socratic Reasoning</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleToggleSpeech(messages[messages.length - 1]?.text || '')}
                className={`p-2 rounded-xl border text-xs font-semibold transition-all flex items-center space-x-1 ${
                  isPlayingAudio
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 animate-pulse'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
                title="Audio Voice Reader"
              >
                {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span className="hidden sm:inline">{isPlayingAudio ? 'Pause Voice' : 'Read Out Loud'}</span>
              </button>
            </div>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-2xl space-y-2 text-xs leading-relaxed shadow-lg ${
                    m.sender === 'user'
                      ? 'bg-purple-600 text-white rounded-br-none'
                      : 'bg-slate-900/90 border border-white/10 text-slate-200 rounded-bl-none'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] opacity-75 pb-1 border-b border-white/10">
                    <span className="font-bold uppercase">{m.sender === 'user' ? 'You' : 'CogniPath AI Tutor'}</span>
                    <span>{m.timestamp}</span>
                  </div>

                  <p className="font-medium text-sm sm:text-base leading-relaxed">{m.text}</p>

                  {m.analogy && (
                    <div className="p-3 rounded-xl bg-purple-950/70 border border-purple-500/30 text-purple-200 text-xs mt-2">
                      {m.analogy}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isAsking && (
              <div className="flex justify-start">
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 text-xs text-purple-300 animate-pulse flex items-center space-x-2">
                  <Brain className="w-4 h-4 animate-spin" />
                  <span>AI Tutor is crafting a Socratic explanation...</span>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <div className="pt-3 border-t border-white/10 space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                placeholder="Ask any math concept question (e.g. 'Why do we flip signs when dividing by negatives?')..."
                className="flex-1 glass-input px-4 py-3 rounded-xl text-xs sm:text-sm text-white border border-white/15 focus:border-purple-500"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isAsking || !inputQuery.trim()}
                className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all disabled:opacity-40 flex items-center justify-center space-x-1"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Ask AI</span>
              </button>
            </div>

            {/* Quick Prompt Starters */}
            <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
              <span className="text-slate-400 font-semibold self-center">Try asking:</span>
              {[
                'Why is x · x = x²?',
                'Explain 2(x+3) with an analogy',
                'How to isolate y in 3x + 2y = 12?',
              ].map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(qp)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-purple-300 transition-all text-left"
                >
                  "{qp}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Mental Models & Concept Breakdowns */}
        <div className="space-y-6">
          {/* Mental Model Card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 space-y-4 shadow-2xl">
            <div className="flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <h3 className="font-poppins font-bold text-base text-white">Mental Models & Concept Library</h3>
            </div>

            <p className="text-xs text-slate-400">Select a core concept to inspect its cognitive mental model and analogy:</p>

            <div className="space-y-3">
              {conceptTopics.map((ct) => (
                <div
                  key={ct.id}
                  onClick={() => setSelectedTopic(ct.id as any)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                    selectedTopic === ct.id
                      ? 'bg-purple-950/60 border-purple-500/60 shadow-lg shadow-purple-500/15'
                      : 'bg-slate-900/60 border-white/5 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-poppins font-bold text-sm text-white">{ct.title}</h4>
                    <span className="text-xs font-mono font-bold text-amber-300">{ct.summary}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{ct.analogy}</p>

                  <div className="pt-2 flex justify-between items-center text-[10px] text-purple-400">
                    <span>Common Trap: {ct.misconception}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSendMessage(`Explain ${ct.title} in detail`);
                      }}
                      className="font-bold underline hover:text-purple-300"
                    >
                      Ask Tutor →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Quiz Card */}
          <div className="bg-gradient-to-br from-indigo-950/80 via-slate-900 to-purple-950/80 rounded-3xl p-6 border border-indigo-500/30 space-y-3 text-center">
            <Zap className="w-8 h-8 text-amber-400 mx-auto animate-bounce" />
            <h4 className="font-poppins font-bold text-base text-white">Ready to test your concept mastery?</h4>
            <p className="text-xs text-slate-300">Launch step-by-step problem solver to practice real equations!</p>
            <button
              onClick={() => onNavigate('solver')}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-500/30 flex items-center justify-center space-x-2 transition-all"
            >
              <span>Go to AI Problem Solver</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
