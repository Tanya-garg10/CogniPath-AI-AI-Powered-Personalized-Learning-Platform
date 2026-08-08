import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Sparkles, 
  Send, 
  Clock, 
  Plus, 
  Flame, 
  CheckCircle2, 
  HelpCircle, 
  Bot, 
  ArrowRight, 
  MessageSquare, 
  Crown, 
  Volume2, 
  Share2, 
  Radio, 
  X, 
  Play, 
  Pause, 
  RotateCcw,
  Zap,
  Smile,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { User } from '../types';

interface StudyRoomMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  currentStepIndex: number;
  totalSteps: number;
  isCompleted: boolean;
  statusText: string;
  score: number;
  joinedAt: string;
}

interface StudyRoomMessage {
  id: string;
  senderName: string;
  avatar?: string;
  text: string;
  timestamp: string;
  type: 'chat' | 'system' | 'reaction' | 'hint';
}

interface StudyRoomProblem {
  id: string;
  equation: string;
  topic: string;
  expectedSteps: string[];
  currentHintIndex: number;
}

interface StudyRoom {
  id: string;
  name: string;
  topic: string;
  hostName: string;
  maxMembers: number;
  members: StudyRoomMember[];
  messages: StudyRoomMessage[];
  currentProblem: StudyRoomProblem;
  timer: {
    isActive: boolean;
    timeLeftSeconds: number;
    initialSeconds: number;
  };
  isPrivate: boolean;
}

interface StudyRoomViewProps {
  user: User;
  onNavigate?: (view: string) => void;
  onGainXP?: (amount: number) => void;
}

export const StudyRoomView: React.FC<StudyRoomViewProps> = ({
  user,
  onNavigate,
  onGainXP,
}) => {
  const [rooms, setRooms] = useState<StudyRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<StudyRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatTab, setChatTab] = useState<'members' | 'chat'>('members');
  const [chatInput, setChatInput] = useState('');
  const [userStepInput, setUserStepInput] = useState('');
  const [userCurrentStep, setUserCurrentStep] = useState(1);
  const [userCompleted, setUserCompleted] = useState(false);
  const [activeReactionPopup, setActiveReactionPopup] = useState<string | null>(null);

  // Timer state for active room session
  const [timerSeconds, setTimerSeconds] = useState(1500);
  const [timerRunning, setTimerRunning] = useState(false);

  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomTopic, setNewRoomTopic] = useState('Algebra & Distribution');
  const [newRoomEquation, setNewRoomEquation] = useState('2(x + 4) = 18');

  // WebSocket reference
  const socketRef = useRef<WebSocket | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Fetch initial rooms
  const fetchRooms = async () => {
    try {
      const res = await fetch('/api/study-rooms');
      if (res.ok) {
        const data = await res.json();
        setRooms(data);
      }
    } catch (e) {
      console.error('Failed to fetch study rooms:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // WebSocket Connection when activeRoom is selected
  useEffect(() => {
    if (!activeRoom) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      // Join room event
      ws.send(
        JSON.stringify({
          type: 'join_room',
          payload: {
            roomId: activeRoom.id,
            user: {
              id: user.id || `u_${user.name.toLowerCase().replace(/\s+/g, '')}`,
              name: user.name,
              avatar: user.avatar,
            },
          },
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const { type, payload } = JSON.parse(event.data);
        if (type === 'room_state' || type === 'room_updated') {
          setActiveRoom(payload);
          // Sync timer
          if (payload.timer) {
            setTimerSeconds(payload.timer.timeLeftSeconds);
            setTimerRunning(payload.timer.isActive);
          }
        } else if (type === 'new_message') {
          setActiveRoom((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              messages: [...prev.messages, payload],
            };
          });
        }
      } catch (e) {
        console.error('WebSocket parse error:', e);
      }
    };

    return () => {
      ws.close();
    };
  }, [activeRoom?.id, user.id, user.name, user.avatar]);

  // Auto-scroll chat to bottom on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeRoom?.messages]);

  // Timer countdown interval
  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const handleJoinRoom = (room: StudyRoom) => {
    setActiveRoom(room);
    setUserCurrentStep(1);
    setUserCompleted(false);
    setUserStepInput('');
  };

  const handleLeaveRoom = () => {
    if (socketRef.current) {
      socketRef.current.close();
    }
    setActiveRoom(null);
    fetchRooms();
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName || !newRoomTopic) return;

    try {
      const res = await fetch('/api/study-rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newRoomName,
          topic: newRoomTopic,
          hostName: user.name,
          equation: newRoomEquation,
          steps: [newRoomEquation, 'Step 1: Expand parentheses', 'Step 2: Isolate term', 'Step 3: Solve x'],
        }),
      });

      if (res.ok) {
        const createdRoom = await res.json();
        setIsCreateModalOpen(false);
        setNewRoomName('');
        handleJoinRoom(createdRoom);
      }
    } catch (err) {
      console.error('Failed to create room:', err);
    }
  };

  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || !activeRoom || !socketRef.current) return;

    socketRef.current.send(
      JSON.stringify({
        type: 'send_chat',
        payload: {
          roomId: activeRoom.id,
          text: chatInput,
          senderName: user.name,
          avatar: user.avatar,
          messageType: 'chat',
        },
      })
    );

    setChatInput('');
  };

  const handleSendReaction = (emoji: string, targetUserName?: string) => {
    if (!activeRoom || !socketRef.current) return;

    socketRef.current.send(
      JSON.stringify({
        type: 'send_reaction',
        payload: {
          roomId: activeRoom.id,
          fromName: user.name,
          toUserName: targetUserName,
          reactionEmoji: emoji,
        },
      })
    );

    setActiveReactionPopup(`${emoji} sent to ${targetUserName || 'Room'}!`);
    setTimeout(() => setActiveReactionPopup(null), 2500);
  };

  const handleRequestAIHint = () => {
    if (!activeRoom || !socketRef.current) return;

    socketRef.current.send(
      JSON.stringify({
        type: 'request_ai_hint',
        payload: {
          roomId: activeRoom.id,
        },
      })
    );
  };

  const handleSubmitStep = () => {
    if (!userStepInput.trim() || !activeRoom || !socketRef.current) return;

    const totalSteps = activeRoom.currentProblem.expectedSteps.length;
    const nextStepIndex = Math.min(totalSteps, userCurrentStep + 1);
    const isNowCompleted = nextStepIndex === totalSteps && userCurrentStep === totalSteps - 1;

    setUserCurrentStep(nextStepIndex);
    if (isNowCompleted) {
      setUserCompleted(true);
      if (onGainXP) onGainXP(150);
    }

    socketRef.current.send(
      JSON.stringify({
        type: 'update_progress',
        payload: {
          roomId: activeRoom.id,
          userId: user.id || `u_${user.name.toLowerCase().replace(/\s+/g, '')}`,
          currentStepIndex: nextStepIndex,
          isCompleted: isNowCompleted,
          statusText: isNowCompleted
            ? `Problem Solved! (${userStepInput})`
            : `Working on Step ${nextStepIndex}: ${userStepInput}`,
        },
      })
    );

    setUserStepInput('');
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* HEADER BAR */}
      <div className="glass-card rounded-3xl p-6 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 font-mono">
              Live Collaborative Study Rooms
            </span>
          </div>
          <h1 className="font-poppins font-extrabold text-2xl text-white">
            {activeRoom ? activeRoom.name : 'Virtual Study Rooms'}
          </h1>
          <p className="text-xs text-slate-300">
            {activeRoom
              ? `Topic: ${activeRoom.topic} • Host: ${activeRoom.hostName}`
              : 'Join a live room or create a custom space to solve math problems collaboratively in real-time'}
          </p>
        </div>

        {activeRoom ? (
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Pomodoro Timer Badge */}
            <div className="flex items-center space-x-2 bg-slate-900 px-3.5 py-1.5 rounded-2xl border border-slate-800 text-xs font-mono text-amber-300">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-sm">{formatTime(timerSeconds)}</span>
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title={timerRunning ? 'Pause Session' : 'Start Session'}
              >
                {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            </div>

            <button
              onClick={handleLeaveRoom}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center space-x-1.5"
            >
              <X className="w-4 h-4 text-rose-400" />
              <span>Leave Room</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-poppins font-bold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center space-x-2"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>Create New Study Room</span>
          </button>
        )}
      </div>

      {/* LOBBY VIEW (WHEN NO ACTIVE ROOM SELECTED) */}
      {!activeRoom && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rooms.map((room) => {
              const memberCount = room.members.length;
              return (
                <motion.div
                  key={room.id}
                  whileHover={{ y: -4 }}
                  className="glass-card rounded-3xl p-6 border border-purple-500/20 hover:border-purple-500/50 transition-all flex flex-col justify-between space-y-4 shadow-xl relative overflow-hidden"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 font-mono px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30">
                        {room.topic}
                      </span>
                      <span className="text-xs text-emerald-400 font-bold flex items-center space-x-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>{memberCount} / {room.maxMembers}</span>
                      </span>
                    </div>

                    <h3 className="font-poppins font-bold text-lg text-white">
                      {room.name}
                    </h3>

                    <p className="text-xs text-slate-300">
                      Current Target: <span className="font-mono text-amber-300 font-bold">{room.currentProblem.equation}</span>
                    </p>
                  </div>

                  {/* Active Avatars */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <div className="flex -space-x-2 overflow-hidden">
                      {room.members.map((m) => (
                        <img
                          key={m.id}
                          src={m.avatar}
                          alt={m.name}
                          className="inline-block h-7 w-7 rounded-full ring-2 ring-slate-900 object-cover"
                          title={`${m.name} (${m.role})`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => handleJoinRoom(room)}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition-all flex items-center space-x-1"
                    >
                      <span>Join Space</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* ACTIVE STUDY ROOM WORKSPACE */}
      {activeRoom && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT 2 COLUMNS: COLLABORATIVE PROBLEM SOLVING WORKSPACE */}
          <div className="lg:col-span-2 space-y-6">
            {/* Target Math Problem Banner */}
            <div className="glass-card rounded-3xl p-6 border border-amber-500/30 space-y-4 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Room Active Problem</span>
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Topic: {activeRoom.currentProblem.topic}
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-2">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  Solve for variables collaboratively
                </p>
                <div className="font-mono font-extrabold text-2xl sm:text-3xl text-amber-300 tracking-wider">
                  {activeRoom.currentProblem.equation}
                </div>
              </div>

              {/* Step Progress Visualizer */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-300 font-bold">Your Progress Status:</span>
                  <span className={userCompleted ? 'text-emerald-400 font-bold' : 'text-purple-300 font-bold'}>
                    Step {userCurrentStep} / {activeRoom.currentProblem.expectedSteps.length}
                  </span>
                </div>

                <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full transition-all duration-500 ${
                      userCompleted
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-500'
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        (userCurrentStep / activeRoom.currentProblem.expectedSteps.length) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Interactive Step Input for User */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-slate-300 block">
                  Submit Your Next Algebraic Step:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={userStepInput}
                    onChange={(e) => setUserStepInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmitStep()}
                    placeholder={
                      userCompleted
                        ? 'You solved this problem! Type additional thoughts...'
                        : `e.g., -3x + 12 = 15`
                    }
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                  />
                  <button
                    onClick={handleSubmitStep}
                    disabled={!userStepInput.trim()}
                    className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs transition-all flex items-center space-x-1"
                  >
                    <span>Submit</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Helper Tools */}
              <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-800 gap-2">
                <button
                  onClick={handleRequestAIHint}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-purple-300 border border-purple-500/30 text-xs font-bold transition-all flex items-center space-x-1.5"
                >
                  <Bot className="w-4 h-4 text-purple-400" />
                  <span>Ask AI Tutor Room Hint</span>
                </button>

                <div className="flex items-center space-x-2">
                  <span className="text-[11px] text-slate-400 font-semibold">Send Encouragement:</span>
                  {['👏', '🔥', '🧠', '🚀', '✋'].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleSendReaction(emoji)}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-sm transition-transform hover:scale-125"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Expected Steps & Solution Guide */}
            <div className="glass-card rounded-3xl p-6 border border-purple-500/20 space-y-4">
              <h3 className="font-poppins font-bold text-base text-white flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
                <span>Problem Reference Steps</span>
              </h3>

              <div className="space-y-2">
                {activeRoom.currentProblem.expectedSteps.map((stepStr, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-2xl border font-mono text-xs flex items-center justify-between ${
                      idx + 1 <= userCurrentStep
                        ? 'bg-slate-900/90 border-purple-500/40 text-purple-200'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <span>{stepStr}</span>
                    </div>

                    {idx + 1 <= userCurrentStep && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT 1 COLUMN: REAL-TIME MEMBERS & CHAT */}
          <div className="space-y-6">
            <div className="glass-card rounded-3xl p-5 border border-purple-500/20 space-y-4 flex flex-col h-[620px]">
              {/* Tab Selector */}
              <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-2xl border border-slate-800">
                <button
                  onClick={() => setChatTab('members')}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                    chatTab === 'members'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Members ({activeRoom.members.length})</span>
                </button>

                <button
                  onClick={() => setChatTab('chat')}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                    chatTab === 'chat'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Room Chat</span>
                </button>
              </div>

              {/* Popup Reaction Toast */}
              <AnimatePresence>
                {activeReactionPopup && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs text-center font-bold"
                  >
                    {activeReactionPopup}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* TAB 1: REAL-TIME MEMBERS LIST */}
              {chatTab === 'members' && (
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {activeRoom.members.map((member) => (
                    <div
                      key={member.id}
                      className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-8 h-8 rounded-xl object-cover ring-2 ring-purple-500/30"
                          />
                          <div>
                            <div className="flex items-center space-x-1">
                              <span className="font-bold text-xs text-white">{member.name}</span>
                              {member.role === 'Host' && (
                                <Crown className="w-3 h-3 text-amber-400 fill-amber-400" title="Room Host" />
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {member.statusText}
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold text-amber-300 font-mono bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                          {member.score} XP
                        </span>
                      </div>

                      {/* Member Step Progress */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                          <span>Progress:</span>
                          <span>
                            Step {member.currentStepIndex} / {member.totalSteps}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              member.isCompleted ? 'bg-emerald-400' : 'bg-purple-500'
                            }`}
                            style={{
                              width: `${Math.min(
                                100,
                                (member.currentStepIndex / member.totalSteps) * 100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Direct Reaction Button */}
                      <div className="flex justify-end space-x-1 pt-1">
                        {['✋', '🔥', '👏'].map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => handleSendReaction(emoji, member.name)}
                            className="text-xs p-1 rounded hover:bg-slate-800 transition-colors"
                            title={`Send ${emoji} to ${member.name}`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 2: ROOM LIVE CHAT */}
              {chatTab === 'chat' && (
                <div className="flex-1 flex flex-col justify-between overflow-hidden space-y-3">
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                    {activeRoom.messages.map((msg) => (
                      <div key={msg.id} className="space-y-1 text-xs">
                        {msg.type === 'system' && (
                          <div className="p-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-200 text-[11px] text-center font-medium">
                            {msg.text}
                          </div>
                        )}

                        {msg.type === 'hint' && (
                          <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-200 space-y-1">
                            <span className="font-bold flex items-center space-x-1 text-amber-400">
                              <Bot className="w-3.5 h-3.5" />
                              <span>{msg.senderName}</span>
                            </span>
                            <p className="text-xs leading-relaxed">{msg.text}</p>
                          </div>
                        )}

                        {msg.type === 'reaction' && (
                          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-amber-300 font-mono">
                            <span className="font-bold text-white">{msg.senderName}</span> {msg.text}
                          </div>
                        )}

                        {msg.type === 'chat' && (
                          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white text-[11px]">{msg.senderName}</span>
                              <span className="text-[9px] text-slate-500 font-mono">{msg.timestamp}</span>
                            </div>
                            <p className="text-slate-300 text-xs leading-relaxed">{msg.text}</p>
                          </div>
                        )}
                      </div>
                    ))}
                    <div ref={chatBottomRef} />
                  </div>

                  {/* Chat Input */}
                  <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-slate-800">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Discuss strategy or ask peers..."
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                    <button
                      type="submit"
                      className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW STUDY ROOM MODAL */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md glass-card rounded-3xl p-6 border border-purple-500/30 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-poppins font-bold text-lg text-white flex items-center space-x-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span>Create Collaborative Study Room</span>
                </h3>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateRoom} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Room Name</label>
                  <input
                    type="text"
                    required
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder="e.g., Geometry & Trig Masters"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Math Topic</label>
                  <select
                    value={newRoomTopic}
                    onChange={(e) => setNewRoomTopic(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Algebra & Distribution">Algebra & Distribution</option>
                    <option value="Linear Systems">Linear Systems</option>
                    <option value="Quadratic Equations">Quadratic Equations</option>
                    <option value="Calculus Derivatives">Calculus Derivatives</option>
                    <option value="Trigonometric Functions">Trigonometric Functions</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Target Problem Equation</label>
                  <input
                    type="text"
                    required
                    value={newRoomEquation}
                    onChange={(e) => setNewRoomEquation(e.target.value)}
                    placeholder="e.g., 3(x - 2) = 15"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-poppins font-bold text-xs shadow-lg shadow-purple-600/30 transition-all"
                >
                  Launch Room Space
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
