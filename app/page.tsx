'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DevkitLogo } from '@/components/DevkitLogo';
import { Button } from '@/components/Button';
import { Badge, DifficultyBadge } from '@/components/Badge';
import { XPBar } from '@/components/XPBar';
import { Card, RewardCard } from '@/components/Card';

export default function LandingPage() {
  const [selectedRegion, setSelectedRegion] = useState<number>(1);
  const [activeHintTab, setActiveHintTab] = useState<'dialogue' | 'code'>('dialogue');

  const regions = [
    {
      id: 0,
      name: 'Python Village',
      status: 'completed',
      level: 'Lvl 01-03',
      desc: 'The peaceful starting sanctuary. Master print, variables, and primitive types.',
      icon: '🏡',
      coords: 'left-[10%] top-[70%]',
    },
    {
      id: 1,
      name: 'Logic Forest',
      status: 'active',
      level: 'Lvl 04-07',
      desc: 'Dreaded conditionals, booleans, and nested branching structures lurk among the trees.',
      icon: '🌲',
      coords: 'left-[32%] top-[45%]',
    },
    {
      id: 2,
      name: 'Function Wastes',
      status: 'available',
      level: 'Lvl 08-12',
      desc: 'Arid valleys of reusable scope, parameter binding, and return statements.',
      icon: '⚡',
      coords: 'left-[55%] top-[60%]',
    },
    {
      id: 3,
      name: 'Data Mines',
      status: 'locked',
      level: 'Lvl 13-18',
      desc: 'Deep subterranean vaults holding lists, dictionaries, tuples, and sets.',
      icon: '💎',
      coords: 'left-[70%] top-[30%]',
    },
    {
      id: 4,
      name: 'OOP Citadel',
      status: 'locked',
      level: 'Lvl 19-25',
      desc: 'The monolithic stronghold of Classes, Inheritance, and Polymorphic magic.',
      icon: '🏰',
      coords: 'left-[85%] top-[55%]',
    },
    {
      id: 5,
      name: 'Python Summit',
      status: 'locked',
      level: 'Lvl 26+',
      desc: 'The storm-shrouded peak where Master Architects face the Legendary Boss.',
      icon: '🌋',
      coords: 'left-[50%] top-[15%]',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-void)] text-[var(--text-primary)] relative overflow-x-hidden selection:bg-[var(--primary-glow)] selection:text-[var(--primary-200)]">
      
      {/* ── Ambient Background Glows & Grid ───────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.18)_0%,transparent_70%)] blur-[100px]" />
        <div className="absolute top-[40%] -right-40 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.14)_0%,transparent_70%)] blur-[100px]" />
        <div className="absolute -bottom-40 left-[30%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.12)_0%,transparent_70%)] blur-[120px]" />
        <div className="absolute inset-0 bg-grid opacity-20" />
      </div>

      {/* ── 0. STICKY NAVBAR ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[rgba(5,5,8,0.8)] backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <DevkitLogo size="md" href="/" />

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-muted)]">
            <a href="#problem" className="hover:text-[var(--text-primary)] transition-colors">Philosophy</a>
            <a href="#core-loop" className="hover:text-[var(--text-primary)] transition-colors">Core Loop</a>
            <a href="#world" className="hover:text-[var(--text-primary)] transition-colors">The Realm</a>
            <a href="#progression" className="hover:text-[var(--text-primary)] transition-colors">Progression</a>
            <a href="#axiom" className="hover:text-[var(--text-primary)] transition-colors">AXIOM AI</a>
            <a href="#dungeons" className="hover:text-[var(--text-primary)] transition-colors">Dungeons</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                Sign In
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="primary" size="sm">
                Enter DEVKIT →
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">

        {/* ── 1. HERO SECTION ────────────────────────────────────────────── */}
        <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 py-12 md:py-20">
          <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[var(--primary-subtle)] border border-[var(--primary-border)] shadow-[0_0_16px_var(--primary-glow)]">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-400)] animate-pulse" />
                <span className="text-xs font-semibold tracking-wide uppercase text-[var(--primary-200)]">
                  Python Realm • Chapter 1 Available Now
                </span>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black font-display tracking-tight leading-[1.05]">
                  MASTER THE CODE.<br />
                  <span className="gradient-text">CONQUER THE WORLD.</span>
                </h1>
                <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Learn Python through quests, challenges, RPG progression, and an ancient AI mentor. Forget dry tutorials—your dev career is now an adventure.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link href="/login" className="w-full sm:w-auto">
                  <Button variant="primary" size="xl" className="w-full sm:w-auto font-bold tracking-wide shadow-[0_0_30px_var(--primary-glow)]">
                    ⚔️ ENTER DEVKIT
                  </Button>
                </Link>
                <Link href="/world-map" className="w-full sm:w-auto">
                  <Button variant="ghost" size="xl" className="w-full sm:w-auto border-[var(--border-muted)] hover:border-[var(--accent-border)]">
                    🗺️ EXPLORE THE WORLD
                  </Button>
                </Link>
              </div>

              {/* Mini Social/Stat Proof */}
              <div className="pt-6 border-t border-[var(--border-subtle)] grid grid-cols-3 gap-6 max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
                <div>
                  <div className="text-2xl font-black font-display text-[var(--text-primary)]">100%</div>
                  <div className="text-xs text-[var(--text-muted)] font-medium">Interactive Python</div>
                </div>
                <div>
                  <div className="text-2xl font-black font-display gradient-text">6 REALMS</div>
                  <div className="text-xs text-[var(--text-muted)] font-medium">Curriculum Regions</div>
                </div>
                <div>
                  <div className="text-2xl font-black font-display text-[var(--text-gold)]">AXIOM AI</div>
                  <div className="text-xs text-[var(--text-muted)] font-medium">Real-Time Guidance</div>
                </div>
              </div>

            </div>

            {/* Right Column: Visual Game Atmosphere Mockup */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              
              {/* Outer decorative glowing ring */}
              <div className="relative w-full max-w-md aspect-square rounded-3xl p-1 bg-gradient-to-tr from-[var(--primary-600)] via-[var(--accent-500)] to-[var(--gold-500)] shadow-[0_0_50px_rgba(124,58,237,0.25)]">
                <div className="w-full h-full rounded-[22px] bg-[var(--bg-surface)] p-6 flex flex-col justify-between overflow-hidden relative border border-[var(--border-subtle)]">
                  
                  {/* Subtle code pattern overlay */}
                  <div className="absolute inset-0 opacity-10 font-mono text-[10px] leading-4 text-[var(--accent-400)] pointer-events-none p-4 select-none">
                    {`def summon_warrior(player):
    xp = player.calculate_mastery()
    weapon = Weapon("Python Blade", power=72)
    return Hero(name=player.name, level=7, weapon=weapon)
# Objective: Defeat The Debugger
while boss.is_alive():
    hero.execute_turn()`}
                  </div>

                  {/* Header in Mockup */}
                  <div className="flex items-center justify-between z-10 border-b border-[var(--border-default)] pb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[var(--danger)]" />
                      <span className="w-3 h-3 rounded-full bg-[var(--warning)]" />
                      <span className="w-3 h-3 rounded-full bg-[var(--success)]" />
                      <span className="text-xs font-mono text-[var(--text-muted)] ml-2">devkit://realm/python</span>
                    </div>
                    <Badge variant="accent">LIVE INSTANCE</Badge>
                  </div>

                  {/* Avatar & Path Graphic */}
                  <div className="my-auto py-6 flex flex-col items-center justify-center z-10 space-y-4">
                    
                    {/* Glowing Avatar Node */}
                    <div className="relative">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--accent-600)] p-0.5 animate-float shadow-[0_0_24px_var(--primary-glow)]">
                        <div className="w-full h-full rounded-2xl bg-[var(--bg-elevated)] flex flex-col items-center justify-center">
                          <span className="text-3xl">🧙‍♂️</span>
                        </div>
                      </div>
                      <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-[var(--gold-500)] text-[9px] font-black text-black">
                        LVL 07
                      </span>
                    </div>

                    <div className="text-center space-y-1">
                      <div className="font-bold text-sm text-[var(--text-primary)]">Python Adventurer</div>
                      <div className="text-xs text-[var(--text-muted)]">Current Quest: <span className="text-[var(--text-cyan)] font-mono">Loop Mastery</span></div>
                    </div>

                    {/* Quest Card preview in Hero */}
                    <div className="w-full bg-[var(--bg-elevated)] border border-[var(--primary-border)] rounded-xl p-3.5 space-y-2 shadow-lg">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[var(--text-gold)] font-bold flex items-center gap-1">
                          ⚔️ Active Encounter
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)]">Quest #04</span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] font-mono line-clamp-2">
                        for enemy in boss.defenses:
                            hero.strike(enemy)
                      </p>
                      <XPBar current={450} max={600} level={7} size="sm" showLabel={true} />
                    </div>

                  </div>

                  {/* Bottom info bar */}
                  <div className="z-10 flex items-center justify-between text-xs text-[var(--text-muted)] pt-3 border-t border-[var(--border-default)]">
                    <span className="flex items-center gap-1">📍 Logic Forest</span>
                    <span className="text-[var(--text-success)] font-mono">● Systems Operational</span>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </section>


        {/* ── 2. PROBLEM SECTION ─────────────────────────────────────────── */}
        <section id="problem" className="py-20 md:py-28 border-t border-[var(--border-subtle)] bg-[rgba(10,10,15,0.4)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <Badge variant="danger">THE TUTORIAL HELL TRAP</Badge>
              <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight">
                STOP WATCHING.<br />
                <span className="gradient-text">START PLAYING.</span>
              </h2>
              <p className="text-[var(--text-secondary)] text-base sm:text-lg">
                Traditional video courses put you in a spectator seat. DEVKIT puts the controller directly in your hands.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              
              {/* Card 1: Watch */}
              <div className="devkit-card p-8 rounded-2xl border-[var(--border-default)] relative group hover:border-[var(--danger)] transition-all">
                <div className="w-12 h-12 rounded-xl bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] flex items-center justify-center text-2xl mb-6 text-[var(--danger)]">
                  📺
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-[var(--text-primary)]">WATCH</h3>
                  <p className="text-sm font-mono text-[var(--text-muted)]">"Tutorial after tutorial."</p>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed pt-2">
                    Hours of passive video watching create the illusion of competence without building muscle memory.
                  </p>
                </div>
              </div>

              {/* Card 2: Forget */}
              <div className="devkit-card p-8 rounded-2xl border-[var(--border-default)] relative group hover:border-[var(--warning)] transition-all">
                <div className="w-12 h-12 rounded-xl bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.2)] flex items-center justify-center text-2xl mb-6 text-[var(--warning)]">
                  🧠
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-[var(--text-primary)]">FORGET</h3>
                  <p className="text-sm font-mono text-[var(--text-muted)]">"Knowledge disappears without practice."</p>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed pt-2">
                    When you close the video, you face a blank IDE. Syntax fades, confusion sets in, and motivation dies.
                  </p>
                </div>
              </div>

              {/* Card 3: Play (Hero Highlight) */}
              <div className="devkit-card p-8 rounded-2xl border-[var(--primary-border)] bg-[rgba(124,58,237,0.06)] relative group hover:border-[var(--accent-border)] transition-all shadow-[0_0_30px_rgba(124,58,237,0.12)]">
                <div className="w-12 h-12 rounded-xl bg-[var(--primary-subtle)] border border-[var(--primary-border)] flex items-center justify-center text-2xl mb-6 text-[var(--primary-300)]">
                  🎮
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold gradient-text">PLAY</h3>
                    <Badge variant="accent">THE DEVKIT WAY</Badge>
                  </div>
                  <p className="text-sm font-mono text-[var(--accent-400)]">"Learn by doing, solving, and progressing."</p>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed pt-2">
                    Every lesson is an actionable quest. You code, defeat bosses, earn XP, forge weapons, and build real mastery.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </section>


        {/* ── 3. DEVKIT CORE LOOP ────────────────────────────────────────── */}
        <section id="core-loop" className="py-20 md:py-28 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <Badge variant="gold">PROGRESSION MECHANICS</Badge>
              <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight">
                YOUR LEARNING BECOMES<br />
                <span className="gradient-text-gold">THE GAME.</span>
              </h2>
              <p className="text-[var(--text-secondary)] text-base sm:text-lg">
                Six interconnected stages transform abstract Computer Science into an addictive feedback loop.
              </p>
            </div>

            {/* Loop Diagram */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              
              {[
                { step: '01', title: 'LEARN', icon: '📖', desc: 'Bite-sized core concept introductions.', color: 'var(--accent-400)' },
                { step: '02', title: 'QUEST', icon: '⚔️', desc: 'Active challenges requiring immediate code solutions.', color: 'var(--primary-400)' },
                { step: '03', title: 'CODE', icon: '💻', desc: 'Execute live Python syntax in interactive runs.', color: 'var(--accent-500)' },
                { step: '04', title: 'XP + REWARDS', icon: '💎', desc: 'Gain experience and rare crafting material drops.', color: 'var(--gold-400)' },
                { step: '05', title: 'UNLOCK', icon: '🔓', desc: 'Open advanced skill tree nodes & powerful gear.', color: 'var(--primary-300)' },
                { step: '06', title: 'PROGRESS', icon: '👑', desc: 'Level up your character and enter dungeon raids.', color: 'var(--success)' },
              ].map((item, idx) => (
                <div
                  key={item.step}
                  className="devkit-card p-5 rounded-xl border-[var(--border-default)] flex flex-col items-center text-center space-y-3 relative group hover:border-[var(--primary-border)] hover:bg-[var(--bg-elevated)] transition-all"
                >
                  <div className="text-xs font-mono font-bold text-[var(--text-muted)] group-hover:text-[var(--accent-400)] transition-colors">
                    {item.step}
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-muted)] flex items-center justify-center text-2xl shadow-inner">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-sm tracking-wider" style={{ color: item.color }}>
                    {item.title}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] leading-normal">
                    {item.desc}
                  </p>
                  {idx < 5 && (
                    <div className="hidden lg:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 text-[var(--border-muted)] font-mono text-sm">
                      →
                    </div>
                  )}
                </div>
              ))}

            </div>

          </div>
        </section>


        {/* ── 4. ENTER THE PYTHON REALM (Interactive Map) ───────────────── */}
        <section id="world" className="py-20 md:py-28 border-t border-[var(--border-subtle)] bg-[rgba(10,10,15,0.6)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
              <Badge variant="accent">WORLD MAP PREVIEW</Badge>
              <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight">
                THE PYTHON REALM
              </h2>
              <p className="text-[var(--text-secondary)] text-base sm:text-lg">
                Your journey begins here. Explore distinct territories designed around Python fundamentals.
              </p>
            </div>

            {/* Map Frame */}
            <div className="devkit-panel p-6 sm:p-8 rounded-3xl border-[var(--border-muted)] relative overflow-hidden">
              
              {/* Map Canvas Visual */}
              <div className="relative w-full aspect-[16/9] min-h-[380px] sm:min-h-[460px] bg-[var(--bg-void)] rounded-2xl border border-[var(--border-default)] p-6 overflow-hidden flex items-center justify-center">
                
                {/* Visual Topography Lines / Path Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 80 320 Q 250 200 420 280 T 750 140 T 950 240" fill="none" stroke="rgba(124,58,237,0.5)" strokeWidth="3" strokeDasharray="6 6" />
                  <path d="M 250 200 Q 400 80 500 70" fill="none" stroke="rgba(6,182,212,0.4)" strokeWidth="2" strokeDasharray="4 4" />
                </svg>

                {/* Region Markers */}
                {regions.map((r) => {
                  const isSelected = selectedRegion === r.id;
                  const isLocked = r.status === 'locked';
                  const isActive = r.status === 'active';

                  return (
                    <button
                      key={r.id}
                      onClick={() => setSelectedRegion(r.id)}
                      className={`absolute ${r.coords} -translate-x-1/2 -translate-y-1/2 transition-all group flex flex-col items-center gap-1.5 focus:outline-none`}
                    >
                      {/* Node Avatar Icon */}
                      <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-xl sm:text-2xl transition-all ${
                        isSelected
                          ? 'bg-[var(--primary-500)] text-white shadow-[0_0_24px_var(--primary-glow)] scale-110 ring-4 ring-[var(--primary-subtle)]'
                          : isActive
                          ? 'bg-[var(--bg-elevated)] border-2 border-[var(--accent-400)] text-[var(--accent-400)] animate-pulse-glow'
                          : isLocked
                          ? 'bg-[var(--bg-surface)] border border-[var(--border-subtle)] opacity-50 grayscale'
                          : 'bg-[var(--bg-surface)] border border-[var(--border-default)] hover:border-[var(--primary-border)]'
                      }`}>
                        {r.icon}
                        {isActive && (
                          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[var(--accent-400)] rounded-full border-2 border-[var(--bg-void)] animate-ping" />
                        )}
                      </div>

                      {/* Label Tag */}
                      <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md border ${
                        isSelected
                          ? 'bg-[var(--primary-600)] text-white border-transparent'
                          : 'bg-[rgba(10,10,15,0.9)] text-[var(--text-secondary)] border-[var(--border-default)]'
                      }`}>
                        {r.name}
                      </span>
                    </button>
                  );
                })}

                {/* Floating Map Legend info box */}
                <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs bg-[rgba(15,15,26,0.95)] backdrop-blur-md p-4 rounded-xl border border-[var(--border-muted)] shadow-xl z-20">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-[var(--text-primary)]">
                      {regions[selectedRegion].icon} {regions[selectedRegion].name}
                    </span>
                    <Badge variant={regions[selectedRegion].status === 'locked' ? 'muted' : regions[selectedRegion].status === 'active' ? 'accent' : 'success'}>
                      {regions[selectedRegion].status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-2">
                    {regions[selectedRegion].desc}
                  </p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-faint)]">
                    <span>Target: {regions[selectedRegion].level}</span>
                    <Link href="/world-map" className="text-[var(--text-accent)] hover:underline">
                      Open Map Details →
                    </Link>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>


        {/* ── 5. CHARACTER PROGRESSION ───────────────────────────────────── */}
        <section id="progression" className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Context */}
              <div className="lg:col-span-6 space-y-6">
                <Badge variant="primary">RPG SKILL TREES</Badge>
                <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight leading-tight">
                  EVERYTHING YOU LEARN<br />
                  <span className="gradient-text">MAKES YOU STRONGER.</span>
                </h2>
                <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed">
                  Forget vague completion certificates. Your progress is measured in character levels, combat stats, mastered skill branches, and weapon enhancements.
                </p>

                <div className="space-y-4 pt-2">
                  {[
                    { title: 'Level Progression', desc: 'Earn XP on every correct syntax line to level up your character.' },
                    { title: 'Granular Skill Mastery', desc: 'Branching nodes for conditionals, loops, functions, lists, and classes.' },
                    { title: 'Equipment Buffs', desc: 'Equip forged code weapons that grant bonus XP modifiers in battles.' },
                  ].map((f, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-8 h-8 rounded-lg bg-[var(--primary-subtle)] border border-[var(--primary-border)] flex items-center justify-center text-sm font-bold text-[var(--primary-300)] shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[var(--text-primary)]">{f.title}</h3>
                        <p className="text-xs text-[var(--text-muted)] leading-relaxed">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Character Sheet UI */}
              <div className="lg:col-span-6">
                <div className="devkit-panel p-6 sm:p-8 rounded-3xl border-[var(--border-muted)] space-y-6 shadow-2xl">
                  
                  {/* Top Character Header */}
                  <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[var(--primary-600)] to-[var(--accent-500)] flex items-center justify-center text-2xl">
                        🧙‍♂️
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[var(--text-primary)]">Ada Lovelace</div>
                        <div className="text-xs text-[var(--text-muted)]">Class: <span className="text-[var(--text-accent)] font-semibold">Python Developer</span></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono text-[var(--text-muted)]">RANK</div>
                      <div className="text-lg font-black font-display text-[var(--text-gold)]">JOURNEYMAN</div>
                    </div>
                  </div>

                  {/* Level & XP Bar Component */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[var(--text-accent)]">CURRENT MASTERY</span>
                      <span className="font-mono text-[var(--text-muted)]">750 / 1,000 XP</span>
                    </div>
                    <XPBar current={750} max={1000} level={7} size="lg" showLabel={false} />
                  </div>

                  {/* Skill Progress Meters */}
                  <div className="space-y-3 pt-2">
                    <p className="text-xs font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">
                      Subject Skill Attributes
                    </p>

                    {[
                      { name: 'PYTHON SYNTAX', pct: 85, color: 'from-violet-600 to-violet-400' },
                      { name: 'LOGIC & CONDITIONS', pct: 65, color: 'from-cyan-600 to-cyan-400' },
                      { name: 'LOOPS & ITERATION', pct: 40, color: 'from-amber-600 to-amber-400' },
                      { name: 'FUNCTIONS & SCOPE', pct: 20, color: 'from-emerald-600 to-emerald-400' },
                    ].map((s) => (
                      <div key={s.name} className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-[var(--text-secondary)] font-semibold">{s.name}</span>
                          <span className="text-[var(--text-muted)]">{s.pct}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[var(--bg-void)] overflow-hidden border border-[var(--border-subtle)]">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${s.color}`}
                            style={{ width: `${s.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Equipment Mini Slot */}
                  <div className="pt-2 flex items-center justify-between p-3.5 rounded-xl bg-[var(--bg-void)] border border-[var(--border-subtle)]">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">🗡️</span>
                      <div>
                        <div className="text-xs font-bold text-[var(--text-primary)]">Python Blade (Forged)</div>
                        <div className="text-[10px] text-[var(--text-gold)]">+10% Python XP Bonus Equipped</div>
                      </div>
                    </div>
                    <Badge variant="gold">POWER 72</Badge>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </section>


        {/* ── 6. KNOWLEDGE IS YOUR WEAPON ───────────────────────────────── */}
        <section id="weapons" className="py-20 md:py-28 border-t border-[var(--border-subtle)] bg-[rgba(10,10,15,0.4)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <Badge variant="gold">ARMORY & EQUIPMENT</Badge>
              <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight">
                KNOWLEDGE IS YOUR WEAPON.
              </h2>
              <p className="text-[var(--text-secondary)] text-base sm:text-lg">
                Craft and evolve specialized coding armaments using materials earned by passing dungeon challenges.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              
              {/* Weapon 1: Python Blade */}
              <div className="devkit-card p-6 rounded-2xl border-[var(--border-default)] hover:border-[var(--primary-border)] transition-all space-y-4">
                <div className="w-full aspect-[4/3] rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex flex-col items-center justify-center text-5xl relative overflow-hidden group">
                  <span className="transform group-hover:scale-110 transition-transform duration-300">🗡️</span>
                  <div className="absolute top-3 right-3">
                    <Badge variant="primary">POWER 72</Badge>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">PYTHON BLADE</h3>
                  <p className="text-xs text-[var(--text-gold)] font-mono font-semibold">+10% Python XP Gain</p>
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Tempered with pristine PEP8 syntax. Slices through convoluted indentation and variable naming errors.
                </p>
              </div>

              {/* Weapon 2: Logic Staff */}
              <div className="devkit-card p-6 rounded-2xl border-[var(--border-default)] hover:border-[var(--accent-border)] transition-all space-y-4">
                <div className="w-full aspect-[4/3] rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex flex-col items-center justify-center text-5xl relative overflow-hidden group">
                  <span className="transform group-hover:scale-110 transition-transform duration-300">🪄</span>
                  <div className="absolute top-3 right-3">
                    <Badge variant="accent">POWER 58</Badge>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">LOGIC STAFF</h3>
                  <p className="text-xs text-[var(--text-cyan)] font-mono font-semibold">+5% Logic XP Gain</p>
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Infused with Boolean clarity. Illuminates truth tables and unravels even the most tangled nested conditionals.
                </p>
              </div>

              {/* Weapon 3: The Debugger */}
              <div className="devkit-card p-6 rounded-2xl border-[var(--border-default)] hover:border-[var(--gold-500)] transition-all space-y-4">
                <div className="w-full aspect-[4/3] rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex flex-col items-center justify-center text-5xl relative overflow-hidden group">
                  <span className="transform group-hover:scale-110 transition-transform duration-300">🔨</span>
                  <div className="absolute top-3 right-3">
                    <Badge variant="gold">POWER 81</Badge>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">THE DEBUGGER</h3>
                  <p className="text-xs text-[var(--text-gold)] font-mono font-semibold">+8% Challenge XP Gain</p>
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  A heavy warhammer forged to crush off-by-one errors and stack trace horrors with pinpoint precision.
                </p>
              </div>

            </div>

          </div>
        </section>


        {/* ── 7. AXIOM AI COMPANION ──────────────────────────────────────── */}
        <section id="axiom" className="py-20 md:py-28 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Interactive AI Terminal Frame */}
              <div className="lg:col-span-7">
                <div className="devkit-panel p-6 sm:p-8 rounded-3xl border-[var(--accent-border)] shadow-[0_0_40px_rgba(6,182,212,0.12)] space-y-6">
                  
                  {/* AXIOM Terminal Header */}
                  <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--accent-subtle)] border border-[var(--accent-border)] flex items-center justify-center text-xl shadow-[0_0_12px_var(--accent-glow)]">
                        🤖
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-2">
                          AXIOM AI MENTOR
                          <span className="w-2 h-2 rounded-full bg-[var(--success)]" />
                        </div>
                        <div className="text-[11px] text-[var(--text-muted)] font-mono">Status: Connected • Llama-3.1 70B</div>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setActiveHintTab('dialogue')}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          activeHintTab === 'dialogue'
                            ? 'bg-[var(--accent-subtle)] text-[var(--text-cyan)] border border-[var(--accent-border)]'
                            : 'text-[var(--text-muted)] hover:text-white'
                        }`}
                      >
                        Guidance
                      </button>
                      <button
                        onClick={() => setActiveHintTab('code')}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          activeHintTab === 'code'
                            ? 'bg-[var(--accent-subtle)] text-[var(--text-cyan)] border border-[var(--accent-border)]'
                            : 'text-[var(--text-muted)] hover:text-white'
                        }`}
                      >
                        Code Analysis
                      </button>
                    </div>
                  </div>

                  {/* Dialogue Bubble */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-[var(--bg-void)] border border-[var(--border-default)] space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-accent)]">
                        <span>💬</span> AXIOM says:
                      </div>
                      {activeHintTab === 'dialogue' ? (
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed italic">
                          "You're close, Adventurer. Look at what happens after the first iteration of your <code className="text-[var(--accent-400)] font-mono">for</code> loop. Are you modifying the list while traversing it?"
                        </p>
                      ) : (
                        <div className="font-mono text-xs text-[var(--text-cyan)] space-y-1">
                          <p># Inspecting current line:</p>
                          <p className="text-[var(--text-danger)]">- for item in inventory: inventory.remove(item)</p>
                          <p className="text-[var(--text-success)]">+ for item in inventory[:]: inventory.remove(item)  # Safe slice copy</p>
                        </div>
                      )}
                    </div>

                    {/* Interactive Action Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="flex gap-2">
                        <Button variant="accent" size="sm">
                          ✨ ASK AXIOM
                        </Button>
                        <Button variant="ghost" size="sm">
                          💡 GET A HINT (-15 XP)
                        </Button>
                      </div>
                      <span className="text-[11px] font-mono text-[var(--text-faint)]">
                        Socratic Mode Active
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Right Column: Copy & Explanation */}
              <div className="lg:col-span-5 space-y-6">
                <Badge variant="accent">SOCRATIC AI COMPANION</Badge>
                <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight leading-tight">
                  YOU DON'T<br />
                  <span className="gradient-text">LEARN ALONE.</span>
                </h2>
                <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed">
                  An AI mentor that helps you understand concepts, solve challenges, and progress without simply handing you the answer.
                </p>

                <div className="space-y-3 text-sm text-[var(--text-muted)]">
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--success)] font-bold">✓</span> No copy-paste spoiler answers
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--success)] font-bold">✓</span> Guided Socratic hints when you get stuck
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--success)] font-bold">✓</span> Deeply tailored to your level and active quest
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>


        {/* ── 8. DUNGEONS & BOSSES ───────────────────────────────────────── */}
        <section id="dungeons" className="py-20 md:py-28 border-t border-[var(--border-subtle)] bg-[rgba(10,10,15,0.6)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <Badge variant="danger">FINAL EXAM ENCOUNTERS</Badge>
              <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight">
                PROVE WHAT YOU LEARNED.
              </h2>
              <p className="text-[var(--text-secondary)] text-base sm:text-lg">
                When you finish a subject, you don't take a multiple-choice quiz. You enter a Dungeon to defeat a Boss.
              </p>
            </div>

            {/* Boss Raid Card Frame */}
            <div className="max-w-4xl mx-auto devkit-panel p-8 sm:p-12 rounded-3xl border-[rgba(220,38,38,0.3)] bg-gradient-to-br from-[rgba(220,38,38,0.06)] to-[rgba(10,10,15,0.9)] relative overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.15)]">
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                
                {/* Boss Artwork & Level Badge */}
                <div className="md:col-span-5 flex flex-col items-center justify-center p-8 rounded-2xl bg-[var(--bg-void)] border border-[rgba(220,38,38,0.2)] text-center space-y-3">
                  <div className="text-7xl animate-float">
                    👾
                  </div>
                  <div>
                    <h3 className="text-xl font-black font-display text-[var(--boss-red)]">THE DEBUGGER</h3>
                    <p className="text-xs text-[var(--text-muted)] font-mono">Logic Dungeon Boss</p>
                  </div>
                  <Badge variant="danger">RECOMMENDED LEVEL 07</Badge>
                </div>

                {/* Encounter Details & Rewards */}
                <div className="md:col-span-7 space-y-6">
                  
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[var(--text-gold)] uppercase tracking-wider">
                      Dungeon Challenge #01
                    </span>
                    <h3 className="text-2xl font-black font-display text-[var(--text-primary)]">
                      The Labyrinth of Logic Faults
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      Find and repair 5 critical syntax and runtime errors in live algorithmic code before the timer expires.
                    </p>
                  </div>

                  {/* Rewards Breakdown */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="stat-block p-3">
                      <div className="stat-value text-sm text-[var(--text-gold)]">+1,000</div>
                      <div className="stat-label text-[9px]">XP REWARD</div>
                    </div>
                    <div className="stat-block p-3">
                      <div className="stat-value text-sm text-[var(--text-cyan)]">x5 Pure</div>
                      <div className="stat-label text-[9px]">RARE CRYSTALS</div>
                    </div>
                    <div className="stat-block p-3">
                      <div className="stat-value text-sm text-[var(--text-accent)]">Unlocks</div>
                      <div className="stat-label text-[9px]">OOP CITADEL</div>
                    </div>
                  </div>

                  {/* Action */}
                  <Link href="/login" className="block">
                    <Button variant="danger" size="lg" className="w-full font-bold tracking-wider shadow-[0_0_20px_var(--boss-glow)]">
                      ⚔️ ENTER DUNGEON
                    </Button>
                  </Link>

                </div>

              </div>

            </div>

          </div>
        </section>


        {/* ── 9. FINAL CTA ───────────────────────────────────────────────── */}
        <section className="py-24 md:py-32 relative overflow-hidden border-t border-[var(--border-subtle)] text-center">
          
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.18)_0%,transparent_70%)] pointer-events-none" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-8">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--primary-subtle)] border border-[var(--primary-border)] shadow-[0_0_20px_var(--primary-glow)]">
              <span className="text-xs font-bold text-[var(--primary-200)]">READY TO CODE?</span>
            </div>

            <h2 className="text-4xl sm:text-6xl font-black font-display tracking-tight leading-tight">
              YOUR JOURNEY<br />
              <span className="gradient-text">STARTS HERE.</span>
            </h2>

            <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-xl mx-auto">
              Learn Python. Build your skills. Conquer the realm. Free during the prototype release.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login" className="w-full sm:w-auto">
                <Button variant="primary" size="xl" className="w-full sm:w-auto font-bold tracking-wider shadow-[0_0_40px_var(--primary-glow)]">
                  ENTER DEVKIT NOW 🚀
                </Button>
              </Link>
            </div>

          </div>
        </section>

      </main>


      {/* ── 10. FOOTER ─────────────────────────────────────────────────── */}
      <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-void)] py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <DevkitLogo size="sm" />

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[var(--text-muted)]">
            <Link href="/world-map" className="hover:text-[var(--text-primary)] transition-colors">World</Link>
            <a href="#problem" className="hover:text-[var(--text-primary)] transition-colors">About</a>
            <a href="#axiom" className="hover:text-[var(--text-primary)] transition-colors">AI Mentor</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--text-primary)] transition-colors">GitHub</a>
            <a href="mailto:contact@devkit.dev" className="hover:text-[var(--text-primary)] transition-colors">Contact</a>
          </div>

          <p className="text-xs text-[var(--text-faint)] font-mono">
            © {new Date().getFullYear()} DEVKIT. Python RPG Learning Platform.
          </p>

        </div>
      </footer>

    </div>
  );
}
