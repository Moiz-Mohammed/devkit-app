'use client';

import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();

  const character = user?.character;
  const xp = user?.xp;
  const streak = user?.streak;

  const currentLevelXpNeeded = xp ? xp.xpToNext : 100;
  const currentXpProgress = xp ? xp.totalXP % currentLevelXpNeeded : 0;
  const progressPercent = Math.min(100, Math.max(0, Math.round((currentXpProgress / currentLevelXpNeeded) * 100)));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in-up">
      {/* Welcome Hero Card */}
      <div className="glass-strong rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', filter: 'blur(30px)' }} />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)', filter: 'blur(30px)' }} />
        </div>

        <div className="relative z-10 space-y-4 text-center md:text-left flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold badge-violet">
            ⚔️ Level {xp?.level ?? 1} {character?.class?.name ?? 'Recruit'}
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-[#f0f0ff]">
            Welcome Back,{' '}
            <span className="gradient-text">{user?.username ?? 'Adventurer'}</span>
          </h1>
          <p className="max-w-xl text-sm md:text-base text-[#8b8ba8]">
            Your learning path is calling. Complete daily quests to earn XP, upgrade your weapons, and climb the leaderboard.
          </p>
        </div>

        {/* Level Progression */}
        <div className="relative z-10 w-full md:w-80 devkit-card p-6 space-y-4">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-[#8b8ba8]">Progression</span>
            <span className="text-[#fcd34d]">{currentXpProgress} / {currentLevelXpNeeded} XP</span>
          </div>
          <div className="xp-bar" style={{ height: '8px' }}>
            <div className="xp-bar-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="flex justify-between text-xs text-[#4a4a6a]">
            <span>Level {xp?.level ?? 1}</span>
            <span>Level {(xp?.level ?? 1) + 1}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="devkit-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.2)] flex items-center justify-center text-2xl">
            🐍
          </div>
          <div>
            <div className="text-xs text-[#8b8ba8]">Active Class</div>
            <div className="text-lg font-bold text-[#f0f0ff]">{character?.class?.name ?? 'Not Selected'}</div>
          </div>
        </div>

        <div className="devkit-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.2)] flex items-center justify-center text-2xl">
            🔥
          </div>
          <div>
            <div className="text-xs text-[#8b8ba8]">Daily Streak</div>
            <div className="text-lg font-bold text-[#f0f0ff]">{streak?.currentStreak ?? 0} Days</div>
          </div>
        </div>

        <div className="devkit-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[rgba(6,182,212,0.1)] border border-[rgba(6,182,212,0.2)] flex items-center justify-center text-2xl">
            🗡️
          </div>
          <div>
            <div className="text-xs text-[#8b8ba8]">Weapons Forged</div>
            <div className="text-lg font-bold text-[#f0f0ff]">0 / 12</div>
          </div>
        </div>

        <div className="devkit-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.2)] flex items-center justify-center text-2xl">
            🏆
          </div>
          <div>
            <div className="text-xs text-[#8b8ba8]">Global Ranking</div>
            <div className="text-lg font-bold text-[#f0f0ff]">Unranked</div>
          </div>
        </div>
      </div>

      {/* Main Layout Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Quests & Map Progression */}
        <div className="lg:col-span-2 space-y-6">
          <div className="devkit-card space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#f0f0ff]">Active Quests</h2>
              <Link href="/quests" className="text-xs font-semibold text-[#7c3aed] hover:underline">
                View All Quests
              </Link>
            </div>

            {/* Placeholder Empty State */}
            <div className="border border-dashed border-[#2a2a3d] rounded-2xl p-8 text-center space-y-3">
              <div className="text-3xl">⚔️</div>
              <p className="text-sm text-[#8b8ba8]">No quests currently active. Head to the World Map to start your journey.</p>
              <Link href="/world-map" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                🗺️ Enter World Map
              </Link>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Character Details & Badges */}
        <div className="space-y-6">
          <div className="devkit-card space-y-4">
            <h2 className="text-xl font-bold text-[#f0f0ff]">Your Character</h2>
            
            {/* Visual Character Representation */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden glass flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(13,8,32,0.8)] to-transparent" />
              {/* Retro placeholder graphic */}
              <div className="text-center space-y-3 relative z-10">
                <div className="text-6xl animate-float">👤</div>
                <div className="text-sm font-bold text-[#f0f0ff]">Stage 1: Recruit</div>
                <div className="text-xs text-[#8b8ba8]">Class: {character?.class?.name ?? 'Not Selected'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
