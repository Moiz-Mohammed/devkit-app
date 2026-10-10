'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { getSynchronizedRegions, type SynchronizedRegionView } from '@/lib/progression';
import { Button } from '@/components/Button';
import { Badge, DifficultyBadge } from '@/components/Badge';

const REGION_COORDINATES: Record<string, { xPct: number; yPct: number }> = {
  'python-village': { xPct: 15, yPct: 75 },
  'logic-forest': { xPct: 35, yPct: 50 },
  'function-wastes': { xPct: 58, yPct: 65 },
  'data-mines': { xPct: 75, yPct: 40 },
  'oop-citadel': { xPct: 88, yPct: 68 },
  'python-summit': { xPct: 52, yPct: 18 },
};

export default function WorldMapPage() {
  const { user } = useAuth();
  const regions = getSynchronizedRegions(user);

  const [selectedRegionId, setSelectedRegionId] = useState<string>('logic-forest');

  const selectedRegion: SynchronizedRegionView =
    regions.find((r) => r.slug === selectedRegionId) || regions[1];

  const username = user?.username || 'Moiz';
  const level = user?.xp?.level || 7;

  // Region statuses for dynamic path illumination
  const pythonVillageStatus = regions.find((r) => r.slug === 'python-village')?.dynamicStatus;
  const logicForestStatus = regions.find((r) => r.slug === 'logic-forest')?.dynamicStatus;
  const functionWastesStatus = regions.find((r) => r.slug === 'function-wastes')?.dynamicStatus;
  const dataMinesStatus = regions.find((r) => r.slug === 'data-mines')?.dynamicStatus;
  const oopCitadelStatus = regions.find((r) => r.slug === 'oop-citadel')?.dynamicStatus;
  const pythonSummitStatus = regions.find((r) => r.slug === 'python-summit')?.dynamicStatus;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* ── Top Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-default)] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-[var(--text-accent)] font-mono uppercase tracking-wider">
              Python Realm Cartography
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-400)]" />
            <span className="text-xs text-[var(--text-muted)]">Live World State</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-[var(--text-primary)]">
            THE WORLD OF PYTHON
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/practice">
            <Button variant="ghost" size="sm" className="text-xs border-[var(--border-default)]">
              💻 Practice
            </Button>
          </Link>
          <Link href="/learn">
            <Button variant="ghost" size="sm" className="text-xs border-[var(--border-default)]">
              📖 Grimoire
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-xs">
              ← Dashboard
            </Button>
          </Link>
          <Link href="/quests">
            <Button variant="primary" size="sm" className="text-xs font-bold shadow-[0_0_16px_var(--primary-glow)]">
              ⚔️ Active Quests
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Main Map Canvas Frame ────────────────────────────────────── */}
      <div className="devkit-panel p-4 sm:p-6 rounded-3xl border-[var(--border-muted)] bg-[var(--bg-void)] relative overflow-hidden shadow-2xl">
        
        {/* Map Canvas Scroll Wrapper for Mobile */}
        <div className="relative w-full overflow-x-auto overflow-y-hidden rounded-2xl border border-[var(--border-subtle)] bg-[radial-gradient(ellipse_at_center,#0f0f20_0%,#05050a_100%)]">
          
          <div className="relative min-w-[760px] md:min-w-full aspect-[16/9] min-h-[460px] sm:min-h-[520px] p-6 select-none">
            
            {/* Ambient Background Nebula Orbs */}
            <div className="absolute top-[10%] left-[45%] w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(220,38,38,0.12)_0%,transparent_70%)] blur-[60px] pointer-events-none" />
            <div className="absolute bottom-[20%] left-[25%] w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.15)_0%,transparent_70%)] blur-[70px] pointer-events-none" />
            <div className="absolute bottom-[15%] right-[15%] w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.12)_0%,transparent_70%)] blur-[70px] pointer-events-none" />

            {/* SVG Connecting Paths */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="unlockedPathGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.85" />
                </linearGradient>
                <linearGradient id="activePathGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="lockedPathGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
                </linearGradient>
              </defs>

              {/* Path 1: Python Village -> Logic Forest */}
              <path
                d="M 114 390 Q 190 320 266 260"
                fill="none"
                stroke={pythonVillageStatus === 'completed' ? 'url(#unlockedPathGrad)' : 'url(#lockedPathGrad)'}
                strokeWidth="3.5"
                strokeDasharray="6 4"
                className={logicForestStatus === 'active' ? 'animate-pulse' : ''}
              />

              {/* Path 2: Logic Forest -> Function Wastes */}
              <path
                d="M 266 260 Q 340 310 440 338"
                fill="none"
                stroke={functionWastesStatus !== 'locked' ? 'url(#activePathGrad)' : 'url(#lockedPathGrad)'}
                strokeWidth="3"
                strokeDasharray="4 4"
                className={functionWastesStatus === 'available' ? 'animate-pulse' : ''}
              />

              {/* Path 3: Function Wastes -> Data Mines */}
              <path
                d="M 440 338 Q 500 240 570 208"
                fill="none"
                stroke={dataMinesStatus !== 'locked' ? 'url(#activePathGrad)' : 'url(#lockedPathGrad)'}
                strokeWidth="2.5"
                strokeDasharray="4 4"
              />

              {/* Path 4: Data Mines -> OOP Citadel */}
              <path
                d="M 570 208 Q 630 310 668 353"
                fill="none"
                stroke={oopCitadelStatus !== 'locked' ? 'url(#activePathGrad)' : 'url(#lockedPathGrad)'}
                strokeWidth="2.5"
                strokeDasharray="4 4"
              />

              {/* Path 5: Logic Forest -> Python Summit */}
              <path
                d="M 266 260 Q 320 120 395 93"
                fill="none"
                stroke={pythonSummitStatus !== 'locked' ? 'rgba(220,38,38,0.8)' : 'rgba(220,38,38,0.2)'}
                strokeWidth="2"
                strokeDasharray="5 5"
              />

              {/* Path 6: Data Mines -> Python Summit */}
              <path
                d="M 570 208 Q 480 120 395 93"
                fill="none"
                stroke={pythonSummitStatus !== 'locked' ? 'rgba(220,38,38,0.8)' : 'rgba(220,38,38,0.2)'}
                strokeWidth="2"
                strokeDasharray="5 5"
              />
            </svg>

            {/* Region Interactive Nodes */}
            {regions.map((region) => {
              const coords = REGION_COORDINATES[region.slug] || { xPct: 50, yPct: 50 };
              const isSelected = region.slug === selectedRegionId;
              const isCompleted = region.dynamicStatus === 'completed';
              const isActive = region.dynamicStatus === 'active';
              const isAvailable = region.dynamicStatus === 'available';
              const isLocked = region.dynamicStatus === 'locked';

              return (
                <div
                  key={region.slug}
                  style={{ left: `${coords.xPct}%`, top: `${coords.yPct}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center group cursor-pointer"
                  onClick={() => setSelectedRegionId(region.slug)}
                >
                  
                  {/* Player Avatar Pin over Active Node */}
                  {isActive && (
                    <div className="absolute -top-11 flex flex-col items-center animate-float z-30 pointer-events-none">
                      <div className="px-2 py-0.5 rounded-full bg-[var(--primary-600)] border border-[var(--primary-border)] shadow-[0_0_12px_var(--primary-glow)] text-[9px] font-black font-mono text-white flex items-center gap-1">
                        <span>🧙‍♂️</span> {username.toUpperCase()} (LVL {level.toString().padStart(2, '0')})
                      </div>
                      <div className="w-2 h-2 bg-[var(--primary-600)] rotate-45 -mt-1" />
                    </div>
                  )}

                  {/* Available Quest Pulse Notification */}
                  {isAvailable && (
                    <div className="absolute -top-7 px-2 py-0.5 rounded-full bg-[var(--accent-subtle)] border border-[var(--accent-border)] text-[9px] font-black text-[var(--text-cyan)] uppercase animate-pulse flex items-center gap-1">
                      <span>✨</span> Unlocked
                    </div>
                  )}

                  {/* Boss Warning Indicator for Python Summit */}
                  {region.slug === 'python-summit' && (
                    <div className="absolute -top-7 px-2 py-0.5 rounded-full bg-[rgba(220,38,38,0.2)] border border-[rgba(220,38,38,0.4)] text-[9px] font-black text-[var(--boss-red)] uppercase animate-pulse flex items-center gap-1">
                      <span>💀</span> Boss Apex
                    </div>
                  )}

                  {/* Region Node Circle Button */}
                  <button
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl transition-all duration-300 relative focus:outline-none ${
                      isSelected
                        ? 'bg-[var(--primary-500)] text-white shadow-[0_0_30px_var(--primary-glow)] scale-115 ring-4 ring-[var(--primary-subtle)]'
                        : isActive
                        ? 'bg-[var(--bg-elevated)] border-2 border-[var(--accent-400)] text-[var(--accent-400)] shadow-[0_0_20px_var(--accent-glow)]'
                        : isAvailable
                        ? 'bg-[var(--bg-elevated)] border-2 border-[var(--gold-400)] text-[var(--gold-400)] shadow-[0_0_20px_var(--gold-glow)]'
                        : isCompleted
                        ? 'bg-[var(--bg-elevated)] border-2 border-[var(--success)] text-[var(--success)] shadow-[0_0_16px_var(--success-subtle)]'
                        : 'bg-[var(--bg-surface)] border border-[var(--border-subtle)] opacity-45 grayscale hover:grayscale-0 hover:opacity-80'
                    }`}
                  >
                    <span>{region.icon}</span>

                    {/* Checkmark for completed */}
                    {isCompleted && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--success)] text-white flex items-center justify-center text-xs font-bold shadow-md">
                        ✓
                      </span>
                    )}

                    {/* Available gold sparkle */}
                    {isAvailable && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--gold-500)] text-black flex items-center justify-center text-[10px] font-bold shadow-md">
                        ★
                      </span>
                    )}

                    {/* Padlock for locked */}
                    {isLocked && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--bg-void)] border border-[var(--border-muted)] text-[var(--text-muted)] flex items-center justify-center text-[10px]">
                        🔒
                      </span>
                    )}
                  </button>

                  {/* Region Title Plate */}
                  <div className={`mt-2 px-2.5 py-1 rounded-lg border text-center transition-all ${
                    isSelected
                      ? 'bg-[var(--primary-600)] text-white border-transparent shadow-lg scale-105'
                      : 'bg-[rgba(10,10,15,0.9)] border-[var(--border-default)] text-[var(--text-secondary)] group-hover:border-[var(--primary-border)]'
                  }`}>
                    <p className="text-xs font-bold leading-tight whitespace-nowrap">{region.name}</p>
                    <p className="text-[9px] font-mono text-[var(--text-faint)] group-hover:text-[var(--text-muted)]">{region.recommendedLevel}</p>
                  </div>

                </div>
              );
            })}

            {/* Map Legend Overlay */}
            <div className="absolute top-4 right-4 bg-[rgba(10,10,15,0.9)] backdrop-blur-md p-3.5 rounded-2xl border border-[var(--border-default)] shadow-xl z-10 hidden sm:block">
              <p className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Cartographic Legend
              </p>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--success)]" />
                  <span className="text-[var(--text-secondary)]">Conquered Sanctuary</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-400)] animate-pulse" />
                  <span className="text-[var(--text-cyan)] font-semibold">Active Encounter</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--gold-400)]" />
                  <span className="text-[var(--text-gold)]">Newly Unlocked Realm</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--border-muted)]" />
                  <span className="text-[var(--text-muted)]">Unexplored / Locked</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ── Section 3: REGION INTERACTIVE CONTEXT PANEL ──────────────── */}
      <section className="devkit-card p-6 sm:p-8 rounded-3xl border-[var(--border-muted)] bg-gradient-to-br from-[var(--bg-surface)] via-[var(--bg-elevated)] to-[var(--bg-surface)] relative overflow-hidden shadow-2xl">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Region Summary & Lore */}
          <div className="lg:col-span-8 space-y-4">
            
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-3xl">{selectedRegion.icon}</span>
              <h2 className="text-2xl sm:text-3xl font-black font-display text-[var(--text-primary)]">
                {selectedRegion.name}
              </h2>
              <Badge variant={
                selectedRegion.dynamicStatus === 'completed'
                  ? 'success'
                  : selectedRegion.dynamicStatus === 'active'
                  ? 'accent'
                  : selectedRegion.dynamicStatus === 'available'
                  ? 'gold'
                  : 'muted'
              }>
                {selectedRegion.dynamicStatus === 'active' ? '● CURRENT DOMAIN' : selectedRegion.dynamicStatus.toUpperCase()}
              </Badge>
              <Badge variant="primary">{selectedRegion.recommendedLevel}</Badge>
            </div>

            <p className="text-xs font-mono text-[var(--text-accent)] font-semibold">
              {selectedRegion.subtitle}
            </p>

            <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-3xl">
              {selectedRegion.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              <div className="bg-[var(--bg-void)] p-3 rounded-xl border border-[var(--border-subtle)]">
                <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Quest Combat</div>
                <div className="text-sm font-bold text-[var(--text-primary)]">
                  {selectedRegion.completedQuestsCount} / {selectedRegion.totalQuestsCount} Cleared
                </div>
              </div>
              <div className="bg-[var(--bg-void)] p-3 rounded-xl border border-[var(--border-subtle)]">
                <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Knowledge Lore</div>
                <div className="text-sm font-bold text-[var(--text-gold)]">
                  {selectedRegion.totalLessonsCount > 0 
                    ? `${selectedRegion.completedLessonsCount} / ${selectedRegion.totalLessonsCount} Tomes`
                    : 'Ancient Lore'}
                </div>
              </div>
              <div className="bg-[var(--bg-void)] p-3 rounded-xl border border-[var(--border-subtle)]">
                <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Code Practice</div>
                <div className="text-sm font-bold text-[var(--text-cyan)]">
                  {selectedRegion.totalChallengesCount > 0 
                    ? `${selectedRegion.completedChallengesCount} / ${selectedRegion.totalChallengesCount} Solved`
                    : 'Code Trials'}
                </div>
              </div>
              <div className="bg-[var(--bg-void)] p-3 rounded-xl border border-[var(--border-subtle)]">
                <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Dungeon Boss</div>
                <div className="text-sm font-bold text-[var(--boss-red)] truncate">{selectedRegion.bossName}</div>
              </div>
              <div className="bg-[var(--bg-void)] p-3 rounded-xl border border-[var(--border-subtle)] col-span-2 sm:col-span-1">
                <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Domain Status</div>
                <div className="text-sm font-bold text-[var(--text-gold)]">
                  {selectedRegion.dynamicStatus === 'completed'
                    ? 'Cleared 100%'
                    : selectedRegion.dynamicStatus === 'active'
                    ? 'Active Combat'
                    : selectedRegion.dynamicStatus === 'available'
                    ? 'Available'
                    : 'Prerequisite'}
                </div>
              </div>
            </div>

          </div>

          {/* Right: Direct Region Action CTA */}
          <div className="lg:col-span-4 flex flex-col items-stretch justify-center gap-3 p-6 rounded-2xl bg-[var(--bg-void)] border border-[var(--border-default)] text-center">
            
            <p className="text-xs font-mono text-[var(--text-muted)]">
              {selectedRegion.dynamicStatus === 'locked' 
                ? '🔒 Defeat previous guardians to unlock this domain.'
                : '⚔️ Ready to initiate regional encounters.'
              }
            </p>

            {selectedRegion.dynamicStatus !== 'locked' ? (
              <Link href={`/regions/${selectedRegion.slug}`} className="w-full">
                <Button
                  variant={selectedRegion.dynamicStatus === 'active' ? 'primary' : 'accent'}
                  size="lg"
                  className="w-full font-bold shadow-[0_0_24px_var(--primary-glow)]"
                >
                  {selectedRegion.dynamicStatus === 'completed' ? '🏡 Revisit Domain →' : `${selectedRegion.icon} Enter Region →`}
                </Button>
              </Link>
            ) : (
              <Button variant="ghost" size="lg" disabled className="w-full font-mono text-xs opacity-50">
                🔒 Locked Territory
              </Button>
            )}

            <Link href="/quests" className="text-xs text-[var(--text-accent)] hover:underline pt-1">
              Open Global Quest Log →
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}
