'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { RewardCard } from '@/components/Card';
import type { MaterialDrop } from '@/types';

interface QuestCompleteProps {
  questTitle: string;
  xpEarned: number;
  goldEarned?: number;
  materialDrops?: MaterialDrop[];
  score: number;
  regionSlug?: string;
  onReturn?: () => void;
}

export default function QuestComplete({
  questTitle,
  xpEarned,
  goldEarned = 50,
  materialDrops = [],
  score,
  regionSlug = 'logic-forest',
}: QuestCompleteProps) {
  const isPassed = score >= 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(5,5,8,0.9)] backdrop-blur-md animate-fade-in">
      <div className="devkit-panel max-w-md w-full p-8 text-center space-y-6 animate-fade-in-scale border-[var(--border-muted)] shadow-[0_0_50px_rgba(124,58,237,0.2)]">
        
        {/* Animated Trophy / Skull Icon */}
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl border text-4xl shadow-2xl ${
          isPassed
            ? 'bg-[var(--primary-subtle)] border-[var(--primary-border)] shadow-[0_0_30px_var(--primary-glow)] text-[var(--text-gold)]'
            : 'bg-[var(--danger-subtle)] border-[rgba(239,68,68,0.3)] shadow-[0_0_30px_rgba(239,68,68,0.2)] text-[var(--text-danger)]'
        }`}>
          {isPassed ? '🏆' : '💀'}
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)]">
            Encounter Resolution
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-display gradient-text">
            {isPassed ? 'QUEST CONQUERED!' : 'TRIAL FAILED'}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] font-medium">
            {questTitle}
          </p>
        </div>

        {/* Reward Stat Blocks */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="stat-block p-3 rounded-xl bg-[var(--bg-void)] border border-[var(--border-subtle)]">
            <div className="stat-value text-base font-black text-[var(--text-gold)]">
              +{xpEarned}
            </div>
            <div className="stat-label text-[9px]">XP REWARD</div>
          </div>
          <div className="stat-block p-3 rounded-xl bg-[var(--bg-void)] border border-[var(--border-subtle)]">
            <div className="stat-value text-base font-black text-[#f59e0b]">
              +{goldEarned}g
            </div>
            <div className="stat-label text-[9px]">GOLD BOUNTY</div>
          </div>
          <div className="stat-block p-3 rounded-xl bg-[var(--bg-void)] border border-[var(--border-subtle)]">
            <div className={`stat-value text-base font-black ${isPassed ? 'text-[var(--text-success)]' : 'text-[var(--text-danger)]'}`}>
              {score}%
            </div>
            <div className="stat-label text-[9px]">ACCURACY</div>
          </div>
        </div>

        {/* Loot Drops */}
        {materialDrops.length > 0 && isPassed && (
          <div className="space-y-2 text-left pt-1">
            <p className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">
              💎 Loot Excavated
            </p>
            <div className="grid grid-cols-1 gap-2">
              {materialDrops.map((drop) => (
                <RewardCard
                  key={drop.id}
                  icon="💠"
                  label={drop.materialType.replace('_', ' ').toUpperCase()}
                  amount={drop.amount}
                />
              ))}
            </div>
          </div>
        )}

        {/* Action CTAs */}
        <div className="pt-2 flex flex-col gap-2.5">
          <Link href="/quests" className="w-full">
            <Button variant="primary" size="lg" className="w-full font-bold shadow-[0_0_20px_var(--primary-glow)]">
              📜 Return to Quest Board
            </Button>
          </Link>
          <div className="grid grid-cols-2 gap-2">
            <Link href={`/regions/${regionSlug}`} className="w-full">
              <Button variant="ghost" size="sm" className="w-full text-xs border-[var(--border-default)]">
                🌲 Region Hub
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full">
              <Button variant="ghost" size="sm" className="w-full text-xs border-[var(--border-default)]">
                ⚡ Dashboard
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
