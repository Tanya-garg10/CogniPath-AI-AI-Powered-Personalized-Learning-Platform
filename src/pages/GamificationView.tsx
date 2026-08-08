import React from 'react';
import { User, Badge } from '../types';
import { Trophy, Flame, Award, Star, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

interface GamificationViewProps {
  user: User;
}

export const GamificationView: React.FC<GamificationViewProps> = ({ user }) => {
  const leaderboard = [
    { rank: 1, name: 'Chloe Bennett', level: 6, xp: 2450, streak: 12, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' },
    { rank: 2, name: 'Alex Rivera (You)', level: 4, xp: 1420, streak: 7, avatar: user.avatar, isUser: true },
    { rank: 3, name: 'Jordan Vance', level: 4, xp: 1380, streak: 5, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
    { rank: 4, name: 'Maya Lin', level: 3, xp: 980, streak: 3, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150' },
    { rank: 5, name: 'Liam Patel', level: 2, xp: 750, streak: 2, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' },
  ];

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 border border-purple-500/30 flex items-center justify-between">
        <div>
          <h1 className="font-poppins font-extrabold text-2xl text-white flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <span>Gamification & Learning Streak</span>
          </h1>
          <p className="text-xs text-slate-300">Earn XP and unlock badges by overcoming math misconceptions</p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900 px-4 py-2 rounded-2xl border border-slate-800 text-amber-400 font-bold">
          <Flame className="w-5 h-5 animate-bounce" />
          <span>{user.streak}-Day Streak Active!</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-purple-500/20 text-center space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase">Mastery Level</p>
          <p className="font-poppins font-extrabold text-3xl text-purple-300">Level {user.level}</p>
          <p className="text-[11px] text-purple-400">Next Level in 380 XP</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-purple-500/20 text-center space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase">Total XP Points</p>
          <p className="font-poppins font-extrabold text-3xl text-emerald-400">{user.xp} XP</p>
          <p className="text-[11px] text-emerald-400">Rank #2 in Class 9A</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-purple-500/20 text-center space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase">Badges Unlocked</p>
          <p className="font-poppins font-extrabold text-3xl text-amber-400">{user.badges.length} Badges</p>
          <p className="text-[11px] text-slate-400">2 pending unlock</p>
        </div>
      </div>

      {/* Row 2: Unlocked Badges & Global Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Badges Gallery */}
        <div className="glass-card rounded-3xl p-6 border border-purple-500/20 space-y-4">
          <h3 className="font-poppins font-bold text-base text-white flex items-center space-x-2">
            <Award className="w-5 h-5 text-purple-400" />
            <span>Unlocked Badges & Achievements</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {user.badges.map((b) => (
              <div key={b.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start space-x-3">
                <span className="text-2xl p-2 rounded-xl bg-purple-950 border border-purple-500/30">{b.icon}</span>
                <div>
                  <h4 className="font-poppins font-bold text-sm text-white">{b.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{b.description}</p>
                  <span className="text-[10px] text-purple-400 font-semibold mt-1 inline-block">Unlocked {b.unlockedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Class Leaderboard */}
        <div className="glass-card rounded-3xl p-6 border border-purple-500/20 space-y-4">
          <h3 className="font-poppins font-bold text-base text-white flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>Class 9A Leaderboard</span>
          </h3>

          <div className="space-y-2">
            {leaderboard.map((lb) => (
              <div
                key={lb.rank}
                className={`p-3 rounded-2xl border flex items-center justify-between text-xs transition-all ${
                  lb.isUser
                    ? 'bg-purple-950/60 border-purple-500/50 shadow-lg shadow-purple-500/10'
                    : 'bg-slate-900/60 border-slate-800/80'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={`w-6 h-6 rounded-full font-bold flex items-center justify-center text-xs ${
                    lb.rank === 1 ? 'bg-amber-400 text-slate-950' :
                    lb.rank === 2 ? 'bg-slate-300 text-slate-950' :
                    lb.rank === 3 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {lb.rank}
                  </span>
                  <img src={lb.avatar} alt={lb.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-500/30" />
                  <div>
                    <p className={`font-bold ${lb.isUser ? 'text-purple-300' : 'text-white'}`}>{lb.name}</p>
                    <p className="text-[10px] text-slate-400">Level {lb.level}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-extrabold text-emerald-400">{lb.xp} XP</p>
                  <p className="text-[10px] text-amber-400 font-semibold">{lb.streak}d streak</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
