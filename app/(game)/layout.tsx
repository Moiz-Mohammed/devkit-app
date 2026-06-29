'use client';

import { useAuth } from '@/lib/AuthContext';

export default function GameLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 rounded-2xl mx-auto animate-pulse-glow flex items-center justify-center font-black"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
            DK
          </div>
          <p style={{ color: '#8b8ba8' }}>Loading your realm...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Top nav */}
      <header className="sticky top-0 z-50 glass-strong border-b" style={{ borderColor: 'rgba(124,58,237,0.15)' }}>
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <a href="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
              DK
            </div>
            <span className="font-bold tracking-tight">
              DEV<span style={{ color: '#7c3aed' }}>KIT</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-1">
            {[
              { href: '/dashboard',    label: 'Dashboard' },
              { href: '/world-map',    label: 'World Map' },
              { href: '/quests',       label: 'Quests' },
              { href: '/resources',    label: 'Resources' },
              { href: '/leaderboard',  label: 'Leaderboard' },
            ].map((link) => (
              <a key={link.href} href={link.href}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={{ color: '#8b8ba8' }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.color = '#f0f0ff'; (e.target as HTMLElement).style.background = 'var(--bg-elevated)'; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.color = '#8b8ba8'; (e.target as HTMLElement).style.background = 'transparent'; }}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {user?.xp && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                <span className="text-xs" style={{ color: '#fcd34d' }}>⚡ Lv.{user.xp.level}</span>
                <span className="text-xs font-bold gradient-text-gold">{user.xp.totalXP} XP</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
                {user?.username?.[0]?.toUpperCase() ?? '?'}
              </div>
              <button onClick={logout} className="btn-ghost text-xs" style={{ padding: '4px 8px' }}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
