import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Swords, 
  Trophy, 
  Send, 
  Timer, 
  Zap, 
  CheckCircle2, 
  Share2, 
  Crown, 
  Medal, 
  UserPlus, 
  Play, 
  Flame, 
  Sparkles, 
  Copy, 
  Check, 
  ArrowRight, 
  Users,
  X,
  Target
} from 'lucide-react';
import { MathProblem, User } from '../types';
import { SAMPLE_PROBLEMS } from '../data/mockData';

export interface ChallengeParticipant {
  id: string;
  name: string;
  avatar: string;
  solved: boolean;
  timeTakenSec: number;
  completedAt: string;
  xpEarned: number;
}

export interface MathChallenge {
  id: string;
  title: string;
  problem: MathProblem;
  createdBy: {
    id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
  timeLimitSec: number;
  participants: ChallengeParticipant[];
  status: 'active' | 'completed';
}

interface MathChallengeSectionProps {
  currentUser: User;
  onSelectProblem?: (problem: MathProblem) => void;
  onGainXP?: (amount: number) => void;
}

export const MathChallengeSection: React.FC<MathChallengeSectionProps> = ({
  currentUser,
  onSelectProblem,
  onGainXP,
}) => {
  // Mock friends list
  const friendsList = [
    { id: 'f_1', name: 'Maya Lin', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', online: true },
    { id: 'f_2', name: 'Jordan Lee', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', online: true },
    { id: 'f_3', name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150', online: false },
    { id: 'f_4', name: 'Marcus Vance', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150', online: true },
  ];

  // Mock active challenges
  const [challenges, setChallenges] = useState<MathChallenge[]>([
    {
      id: 'ch_101',
      title: '⚡ 15-Second Speed Run: Distributive Property',
      problem: SAMPLE_PROBLEMS[0],
      createdBy: {
        id: 'f_1',
        name: 'Maya Lin',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      },
      createdAt: '10 minutes ago',
      timeLimitSec: 30,
      status: 'active',
      participants: [
        {
          id: 'f_1',
          name: 'Maya Lin',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
          solved: true,
          timeTakenSec: 14.2,
          completedAt: '10m ago',
          xpEarned: 100,
        },
        {
          id: 'f_2',
          name: 'Jordan Lee',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
          solved: true,
          timeTakenSec: 18.7,
          completedAt: '5m ago',
          xpEarned: 75,
        },
        {
          id: 'f_4',
          name: 'Marcus Vance',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
          solved: true,
          timeTakenSec: 22.1,
          completedAt: '2m ago',
          xpEarned: 50,
        },
      ],
    },
    {
      id: 'ch_102',
      title: '🔥 Boss Battle: Double Negatives',
      problem: SAMPLE_PROBLEMS[1],
      createdBy: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      },
      createdAt: '1 hour ago',
      timeLimitSec: 45,
      status: 'active',
      participants: [
        {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
          solved: true,
          timeTakenSec: 12.8,
          completedAt: '1h ago',
          xpEarned: 120,
        },
        {
          id: 'f_3',
          name: 'Sarah Chen',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
          solved: true,
          timeTakenSec: 16.4,
          completedAt: '45m ago',
          xpEarned: 80,
        },
      ],
    },
  ]);

  // Modal State for Sending Challenge
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<MathProblem>(SAMPLE_PROBLEMS[0]);
  const [selectedFriends, setSelectedFriends] = useState<string[]>(['f_1', 'f_2']);
  const [challengeTitle, setChallengeTitle] = useState('⚡ Speed Sprint Challenge');
  const [timeLimitSec, setTimeLimitSec] = useState(30);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);

  // Speed-Run Challenge Playing State Modal
  const [activePlayChallenge, setActivePlayChallenge] = useState<MathChallenge | null>(null);
  const [playTimer, setPlayTimer] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [userAnswerInput, setUserAnswerInput] = useState<string>('');
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [challengeResult, setChallengeResult] = useState<{ isCorrect: boolean; timeSec: number } | null>(null);

  // Toggle friend selection
  const handleToggleFriend = (id: string) => {
    if (selectedFriends.includes(id)) {
      setSelectedFriends(selectedFriends.filter((f) => f !== id));
    } else {
      setSelectedFriends([...selectedFriends, id]);
    }
  };

  // Submit & Send Challenge
  const handleCreateChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!challengeTitle.trim()) return;

    const newChallenge: MathChallenge = {
      id: `ch_${Date.now()}`,
      title: challengeTitle,
      problem: selectedProblem,
      createdBy: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      },
      createdAt: 'Just now',
      timeLimitSec: timeLimitSec,
      status: 'active',
      participants: [
        {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
          solved: false,
          timeTakenSec: 0,
          completedAt: 'Not started',
          xpEarned: 0,
        },
      ],
    };

    setChallenges([newChallenge, ...challenges]);
    setIsCreateModalOpen(false);

    // Trigger XP bonus for initiating a challenge
    if (onGainXP) {
      onGainXP(25);
    }
  };

  // Copy Challenge Link
  const handleCopyLink = (chId: string) => {
    const link = `${window.location.origin}/challenge/${chId}`;
    navigator.clipboard.writeText(link);
    setCopiedLinkId(chId);
    setTimeout(() => setCopiedLinkId(null), 2500);
  };

  // Start Speed Challenge
  const handleStartPlayChallenge = (ch: MathChallenge) => {
    setActivePlayChallenge(ch);
    setPlayTimer(0);
    setIsTimerRunning(true);
    setUserAnswerInput('');
    setIsAnswerSubmitted(false);
    setChallengeResult(null);
  };

  // Timer Tick
  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setPlayTimer((prev) => prev + 0.1);
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // Submit Answer for Challenge
  const handleSubmitChallengeAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePlayChallenge) return;

    setIsTimerRunning(false);
    const finalTime = parseFloat(playTimer.toFixed(1));
    const cleanInput = userAnswerInput.trim().toLowerCase().replace(/\s+/g, '');
    
    // Check if correct (e.g., x=2 for 2(x+3)=10 or 2)
    const expected = activePlayChallenge.problem.expectedSteps[activePlayChallenge.problem.expectedSteps.length - 1]
      .toLowerCase().replace(/\s+/g, '');
    const isCorrect = cleanInput.includes(expected.split('=')[1] || expected) || cleanInput === expected;

    setChallengeResult({
      isCorrect,
      timeSec: finalTime,
    });
    setIsAnswerSubmitted(true);

    if (isCorrect) {
      const calculatedXp = Math.max(30, 100 - Math.floor(finalTime * 2));
      if (onGainXP) {
        onGainXP(calculatedXp);
      }

      // Update participant record in state
      setChallenges((prev) =>
        prev.map((c) => {
          if (c.id === activePlayChallenge.id) {
            const updatedParticipants = [...c.participants];
            const pIdx = updatedParticipants.findIndex((p) => p.id === currentUser.id);
            const userP: ChallengeParticipant = {
              id: currentUser.id,
              name: currentUser.name,
              avatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
              solved: true,
              timeTakenSec: finalTime,
              completedAt: 'Just now',
              xpEarned: calculatedXp,
            };

            if (pIdx >= 0) {
              updatedParticipants[pIdx] = userP;
            } else {
              updatedParticipants.push(userP);
            }

            // Sort by time taken ascending
            updatedParticipants.sort((a, b) => {
              if (!a.solved) return 1;
              if (!b.solved) return -1;
              return a.timeTakenSec - b.timeTakenSec;
            });

            return { ...c, participants: updatedParticipants };
          }
          return c;
        })
      );
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 border border-purple-500/30 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-purple-600 p-0.5 shadow-lg shadow-purple-500/20 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Swords className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-poppins font-extrabold text-lg text-white">Friend Math Challenges</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1">
                <Flame className="w-3 h-3 text-amber-400" />
                <span>Competitive Leaderboard</span>
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Send equation challenges to friends and race for the fastest time on the live leaderboard!
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-poppins font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center space-x-2 transition-all shrink-0"
        >
          <Send className="w-4 h-4 text-amber-300" />
          <span>Challenge a Friend</span>
        </button>
      </div>

      {/* Challenges List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {challenges.map((ch) => {
          const userParticipant = ch.participants.find((p) => p.id === currentUser.id);
          const userHasSolved = userParticipant && userParticipant.solved;

          return (
            <div
              key={ch.id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-white/10 space-y-4 shadow-xl hover:border-purple-500/40 transition-all relative overflow-hidden flex flex-col justify-between"
            >
              {/* Challenge Title Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src={ch.createdBy.avatar}
                      alt={ch.createdBy.name}
                      className="w-7 h-7 rounded-full border border-purple-400/50 object-cover"
                    />
                    <span className="text-xs font-semibold text-slate-300">
                      Created by <strong className="text-white">{ch.createdBy.name}</strong>
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{ch.createdAt}</span>
                </div>

                <h4 className="font-poppins font-bold text-sm text-white flex items-center justify-between">
                  <span>{ch.title}</span>
                  <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                    {ch.problem.equation}
                  </span>
                </h4>

                <div className="flex items-center space-x-3 text-xs text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Timer className="w-3.5 h-3.5 text-purple-400" />
                    <span>Limit: {ch.timeLimitSec}s</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Target className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{ch.problem.difficulty}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1 text-emerald-400">
                    <Users className="w-3.5 h-3.5" />
                    <span>{ch.participants.length} Players</span>
                  </span>
                </div>
              </div>

              {/* Leaderboard Rankings Box */}
              <div className="space-y-2 pt-2">
                <p className="text-[11px] font-bold text-purple-300 uppercase tracking-wider flex items-center justify-between">
                  <span>🏆 Speed Leaderboard</span>
                  <span className="text-[10px] text-slate-400 lowercase">Fastest time wins</span>
                </p>

                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {ch.participants.map((p, rankIdx) => {
                    const isRank1 = rankIdx === 0;
                    const isRank2 = rankIdx === 1;
                    const isRank3 = rankIdx === 2;

                    return (
                      <div
                        key={p.id}
                        className={`flex items-center justify-between p-2 rounded-xl text-xs border transition-all ${
                          p.id === currentUser.id
                            ? 'bg-purple-950/70 border-purple-500/60 text-white font-semibold'
                            : 'bg-slate-950/60 border-white/5 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          {/* Rank Icon */}
                          <div className="w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs shrink-0">
                            {isRank1 ? (
                              <Crown className="w-4 h-4 text-amber-400" />
                            ) : isRank2 ? (
                              <Medal className="w-4 h-4 text-slate-300" />
                            ) : isRank3 ? (
                              <Medal className="w-4 h-4 text-amber-700" />
                            ) : (
                              <span className="text-slate-500 font-mono">#{rankIdx + 1}</span>
                            )}
                          </div>

                          <img src={p.avatar} alt={p.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
                          <span className="truncate max-w-[110px]">{p.name}</span>
                          {p.id === currentUser.id && (
                            <span className="text-[9px] bg-purple-500/30 text-purple-200 px-1.5 py-0.2 rounded font-mono">
                              YOU
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-3 text-right">
                          {p.solved ? (
                            <>
                              <span className="font-mono font-bold text-emerald-400">{p.timeTakenSec.toFixed(1)}s</span>
                              <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                                +{p.xpEarned} XP
                              </span>
                            </>
                          ) : (
                            <span className="text-[11px] text-slate-500 italic">Pending...</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Action Controls */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleCopyLink(ch.id)}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center space-x-1.5"
                >
                  {copiedLinkId === ch.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share Challenge</span>
                    </>
                  )}
                </button>

                {userHasSolved ? (
                  <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-bold px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Completed! ({userParticipant?.timeTakenSec.toFixed(1)}s)</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleStartPlayChallenge(ch)}
                    className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-poppins font-extrabold text-xs shadow-lg shadow-amber-500/20 flex items-center space-x-1.5 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Accept & Play Challenge</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE CHALLENGE MODAL */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-purple-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 relative"
            >
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30">
                  <Swords className="w-3.5 h-3.5 text-amber-300" />
                  <span>Send Friend Challenge</span>
                </div>
                <h3 className="font-poppins font-extrabold text-xl text-white">Create a Speed Math Challenge</h3>
                <p className="text-xs text-slate-300">
                  Pick a problem, select your classmates, and see who solves it fastest!
                </p>
              </div>

              <form onSubmit={handleCreateChallenge} className="space-y-4">
                {/* Challenge Title Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Challenge Title</label>
                  <input
                    type="text"
                    value={challengeTitle}
                    onChange={(e) => setChallengeTitle(e.target.value)}
                    placeholder="e.g. Speed Sprint: Distributive Property"
                    className="w-full glass-input px-4 py-2.5 rounded-xl text-xs sm:text-sm text-white border border-white/15 focus:border-purple-500"
                    required
                  />
                </div>

                {/* Select Problem */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Select Math Equation</label>
                  <select
                    value={selectedProblem.id}
                    onChange={(e) => {
                      const found = SAMPLE_PROBLEMS.find((p) => p.id === e.target.value);
                      if (found) setSelectedProblem(found);
                    }}
                    className="w-full glass-input px-4 py-2.5 rounded-xl text-xs sm:text-sm text-white border border-white/15 focus:border-purple-500 bg-slate-900"
                  >
                    {SAMPLE_PROBLEMS.map((prob) => (
                      <option key={prob.id} value={prob.id}>
                        {prob.equation} — {prob.title} ({prob.difficulty})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Select Time Limit */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Timer Limit</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[15, 30, 60, 120].map((secs) => (
                      <button
                        type="button"
                        key={secs}
                        onClick={() => setTimeLimitSec(secs)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          timeLimitSec === secs
                            ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30'
                            : 'bg-slate-950 text-slate-400 border-white/10 hover:bg-slate-800'
                        }`}
                      >
                        {secs} sec
                      </button>
                    ))}
                  </div>
                </div>

                {/* Select Friends */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span>Invite Friends</span>
                    <span className="text-[10px] text-purple-300">{selectedFriends.length} selected</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {friendsList.map((f) => {
                      const isSelected = selectedFriends.includes(f.id);
                      return (
                        <div
                          key={f.id}
                          onClick={() => handleToggleFriend(f.id)}
                          className={`p-2 rounded-xl border cursor-pointer transition-all flex items-center space-x-2 ${
                            isSelected
                              ? 'bg-purple-950/80 border-purple-500/60 text-white'
                              : 'bg-slate-950/60 border-white/5 text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          <img src={f.avatar} alt={f.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
                          <span className="text-xs font-medium truncate flex-1">{f.name}</span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-poppins font-extrabold text-xs shadow-lg shadow-purple-600/30 flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4 text-amber-300" />
                    <span>Send Challenge (+25 XP)</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PLAY SPEED-RUN CHALLENGE MODAL */}
      <AnimatePresence>
        {activePlayChallenge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900 border border-purple-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 relative"
            >
              <button
                onClick={() => setActivePlayChallenge(null)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title & Speed Timer Banner */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                  <Zap className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
                  <span>SPEED RUN CHALLENGE</span>
                </div>

                <h3 className="font-poppins font-extrabold text-2xl text-white">
                  {activePlayChallenge.problem.equation}
                </h3>
                <p className="text-xs text-slate-300">{activePlayChallenge.problem.description}</p>

                {/* Live Stopwatch Timer */}
                <div className="py-2">
                  <div className="inline-block px-6 py-2 rounded-2xl bg-slate-950 border border-amber-500/40 shadow-inner">
                    <span className="font-mono font-black text-3xl text-amber-300 tracking-wider">
                      {playTimer.toFixed(1)}s
                    </span>
                  </div>
                </div>
              </div>

              {!isAnswerSubmitted ? (
                <form onSubmit={handleSubmitChallengeAnswer} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      Enter Final Solution for x (or complete equation):
                    </label>
                    <input
                      type="text"
                      value={userAnswerInput}
                      onChange={(e) => setUserAnswerInput(e.target.value)}
                      placeholder="e.g. x = 2 or 2"
                      autoFocus
                      className="w-full glass-input px-4 py-3 rounded-xl text-base text-center font-mono font-bold text-white border border-purple-500/40 focus:border-purple-400"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-poppins font-extrabold text-sm shadow-xl shadow-emerald-500/30 flex items-center justify-center space-x-2"
                  >
                    <CheckCircle2 className="w-5 h-5 fill-slate-950" />
                    <span>Submit & Stop Clock!</span>
                  </button>
                </form>
              ) : (
                /* Result Display */
                <div className="space-y-4 text-center">
                  <div
                    className={`p-5 rounded-2xl border space-y-2 ${
                      challengeResult?.isCorrect
                        ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
                        : 'bg-rose-950/80 border-rose-500/50 text-rose-200'
                    }`}
                  >
                    {challengeResult?.isCorrect ? (
                      <>
                        <Sparkles className="w-8 h-8 text-amber-300 mx-auto animate-spin" />
                        <h4 className="font-poppins font-extrabold text-lg text-white">Correct! Problem Solved!</h4>
                        <p className="text-xs font-mono font-bold text-amber-300">
                          Time Record: {challengeResult.timeSec.toFixed(1)} seconds!
                        </p>
                        <p className="text-xs text-slate-300">You've been added to the live friend leaderboard!</p>
                      </>
                    ) : (
                      <>
                        <X className="w-8 h-8 text-rose-400 mx-auto" />
                        <h4 className="font-poppins font-extrabold text-lg text-white">Incorrect Solution</h4>
                        <p className="text-xs text-slate-300">
                          Expected answer: {activePlayChallenge.problem.expectedSteps[activePlayChallenge.problem.expectedSteps.length - 1]}
                        </p>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => setActivePlayChallenge(null)}
                    className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-poppins font-bold text-xs"
                  >
                    Return to Leaderboard
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
