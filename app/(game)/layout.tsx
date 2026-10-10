'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { DevkitLogo } from '@/components/DevkitLogo';
import { XPBar } from '@/components/XPBar';
import { PageLoader } from '@/components/LoadingState';
import { Badge } from '@/components/Badge';

const NAV_LINKS = [
  { href: '/dashboard',  label: 'Dashboard', icon: '⚡' },
  { href: '/learn',      label: 'Learn',     icon: '📖' },
  { href: '/quests',     label: 'Quests',    icon: '⚔' },
  { href: '/practice',   label: 'Practice',  icon: '💻' },
  { href: '/world-map',  label: 'World Map', icon: '🗺' },
  { href: '/forge',      label: 'Forge',     icon: '🔥' },
  { href: '/leaderboard',label: 'Rankings',  icon: '🏆' },
];

export default function GameLayout({ children }: { children: React.ReactNode }) {
  const { user, isDemo, isLoading, logout } = useAuth();
  const pathname = usePathname();

  if (isLoading) return <PageLoader message="Loading DEVKIT..." />;

  const xp      = user?.xp?.totalXP     ?? 0;
  const level   = user?.xp?.level        ?? 1;
  const xpToNext = user?.xp?.xpToNext   ?? 100;
  const streak  = user?.streak?.currentStreak ?? 0;
  const username = user?.username ?? 'Adventurer';

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: 'var(--bg-base)' }}>

      {/* ── Top Navigation Bar ─────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-[var(--z-raised)] border-b"
        style={{
          background: 'rgba(10,10,15,0.85)',
          backdropFilter: 'blur(12px)',
          borderColor: 'var(--border-default)',
        }}
      >
        <div className="page-content">
          <div className="flex items-center h-14 gap-6">

            {/* Logo */}
            <div className="flex items-center gap-2">
              <DevkitLogo href="/dashboard" size="sm" />
              {isDemo && (
                <Badge variant="accent" className="hidden sm:inline-flex text-[10px]">
                  DEMO
                </Badge>
              )}
            </div>

            {/* Nav links — hidden on mobile */}
            <nav className="hidden md:flex items-center gap-1 flex-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-item text-xs py-1.5 px-3 ${pathname.startsWith(link.href) ? 'active' : ''}`}
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>

            {/* Right side — stats + user */}
            <div className="ml-auto flex items-center gap-3">

              {/* Streak */}
              {streak > 0 && (
                <div className="streak-fire hidden sm:flex text-sm">
                  🔥 <span>{streak}</span>
                </div>
              )}

              {/* XP + level compact */}
              <div className="hidden lg:flex flex-col items-end gap-0.5" style={{ minWidth: '120px' }}>
                <div className="flex items-center gap-1.5">
                  <span className="level-badge" style={{ width: '22px', height: '22px', fontSize: '10px' }}>
                    {level}
                  </span>
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    {username}
                  </span>
                </div>
                <XPBar current={xp} max={xp + xpToNext} size="sm" showLabel={false} animated={false} />
              </div>

              {/* User menu / Logout button */}
              <button
                onClick={logout}
                className="btn btn-ghost btn-sm text-xs flex items-center gap-1.5"
                title="Logout"
              >
                <span>⏻</span>
                <span className="hidden sm:inline text-[11px]">Exit</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main content area ──────────────────────────────────────────── */}
      <main className="flex-1 page-content py-6">
        {children}
      </main>

      {/* ── Mobile bottom nav ──────────────────────────────────────────── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 border-t grid grid-cols-7 z-[var(--z-raised)]"
        style={{
          background: 'rgba(10,10,15,0.95)',
          backdropFilter: 'blur(12px)',
          borderColor: 'var(--border-default)',
        }}
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center gap-0.5 py-2 text-xs transition-colors ${
              pathname.startsWith(link.href)
                ? 'text-[var(--text-accent)]'
                : 'text-[var(--text-faint)]'
            }`}
          >
            <span className="text-lg leading-none">{link.icon}</span>
            <span className="text-[9px] font-medium">{link.label}</span>
          </Link>
        ))}
      </nav>

      {/* Bottom padding for mobile nav */}
      <div className="md:hidden h-16" />
    </div>
  );
}
