import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'DEVKIT', template: '%s | DEVKIT' },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex">
      {/* ── Left panel — branding ─────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{ background: 'linear-gradient(135deg, #0d0820 0%, #1a0f3a 50%, #0a0a0f 100%)' }}>

        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <a href="/" className="flex items-center gap-2 w-fit">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
              DK
            </div>
            <span className="text-xl font-bold tracking-tight" style={{ color: '#f0f0ff' }}>
              DEV<span style={{ color: '#7c3aed' }}>KIT</span>
            </span>
          </a>
        </div>

        {/* Hero text */}
        <div className="relative z-10 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa' }}>
              ⚔️ Begin your quest
            </div>
            <h1 className="text-4xl xl:text-5xl font-black leading-tight" style={{ color: '#f0f0ff' }}>
              Learn like you're{' '}
              <span style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                playing.
              </span>
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: '#8b8ba8' }}>
              Master CSE through quests, forge legendary weapons, defeat boss challenges, and build your developer legend.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: '12+', label: 'Career Paths' },
              { value: '500+', label: 'Quests' },
              { value: '∞', label: 'XP to Earn' },
            ].map((s) => (
              <div key={s.label} className="devkit-card text-center py-4" style={{ padding: '16px' }}>
                <div className="text-2xl font-black gradient-text">{s.value}</div>
                <div className="text-xs mt-1" style={{ color: '#8b8ba8' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10">
          <p className="text-sm italic" style={{ color: '#4a4a6a' }}>
            "Every master was once a beginner with a single quest."
          </p>
          <p className="text-xs mt-1" style={{ color: '#3a3a5a' }}>— AXIOM, DEVKIT Guide</p>
        </div>
      </div>

      {/* ── Right panel — form ───────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
              DK
            </div>
            <span className="text-lg font-bold tracking-tight">
              DEV<span style={{ color: '#7c3aed' }}>KIT</span>
            </span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
