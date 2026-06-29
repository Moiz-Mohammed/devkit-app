'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import api from '@/lib/api';

// ─── Data ─────────────────────────────────────────────────────────────────────

const QUESTIONS = [
  {
    id: 'experience',
    question: 'How long have you been coding?',
    options: [
      { value: 'never',        label: "I'm a complete beginner",    icon: '🌱' },
      { value: 'less_1yr',     label: 'Less than a year',           icon: '⚡' },
      { value: '1_3yr',        label: '1 – 3 years',                icon: '⚔️' },
      { value: '3plus',        label: '3+ years',                   icon: '🔥' },
    ],
  },
  {
    id: 'goal',
    question: 'What is your primary goal?',
    options: [
      { value: 'get_job',      label: 'Land my first dev job',      icon: '💼' },
      { value: 'level_up',     label: 'Level up my existing skills', icon: '📈' },
      { value: 'switch',       label: 'Switch into a new field',     icon: '🔄' },
      { value: 'build',        label: 'Build my own projects',       icon: '🚀' },
    ],
  },
  {
    id: 'time',
    question: 'How much time can you commit per day?',
    options: [
      { value: '15min',        label: '15 minutes',                  icon: '⏱️' },
      { value: '30min',        label: '30 minutes',                  icon: '🕐' },
      { value: '1hr',          label: '1 hour',                      icon: '🕑' },
      { value: '2hr_plus',     label: '2+ hours',                    icon: '💪' },
    ],
  },
];

const CLASSES = [
  { slug: 'python-developer',   name: 'Python Developer',    icon: '🐍', desc: 'Scripting, automation, backends', color: '#22c55e' },
  { slug: 'frontend-engineer',  name: 'Frontend Engineer',   icon: '🌐', desc: 'UI, web interfaces, design systems', color: '#06b6d4' },
  { slug: 'backend-engineer',   name: 'Backend Engineer',    icon: '🔧', desc: 'APIs, servers, databases', color: '#7c3aed' },
  { slug: 'ml-engineer',        name: 'ML Engineer',         icon: '🤖', desc: 'Machine learning, model training', color: '#f59e0b' },
  { slug: 'devops-engineer',    name: 'DevOps Engineer',     icon: '🛡️', desc: 'Docker, CI/CD, cloud infra', color: '#ef4444' },
  { slug: 'data-scientist',     name: 'Data Scientist',      icon: '📊', desc: 'Analysis, visualisation, statistics', color: '#8b5cf6' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();

  const [step, setStep]       = useState(0); // 0-2 = questions, 3 = class pick, 4 = done
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedClass, setSelectedClass] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const totalSteps = QUESTIONS.length + 1; // questions + class pick
  const progress   = Math.round((step / totalSteps) * 100);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setTimeout(() => setStep((s) => s + 1), 300);
  };

  const handleFinish = async () => {
    if (!selectedClass) return;
    setIsLoading(true);
    try {
      await api.post('/characters', {
        classSlug: selectedClass,
        onboardingAnswers: answers,
      });
      await refreshUser();
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-6"
      style={{ background: 'var(--bg-base)' }}>

      {/* Progress bar */}
      <div className="w-full max-w-lg mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold gradient-text">
            {step < QUESTIONS.length ? `Question ${step + 1} of ${QUESTIONS.length}` : 'Choose your class'}
          </span>
          <span className="text-sm" style={{ color: '#8b8ba8' }}>{progress}%</span>
        </div>
        <div className="xp-bar" style={{ height: '8px' }}>
          <div className="xp-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question step */}
      {step < QUESTIONS.length && (
        <div className="w-full max-w-lg space-y-6 animate-fade-in-up">
          <h2 className="text-2xl font-black text-center" style={{ color: '#f0f0ff' }}>
            {QUESTIONS[step].question}
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {QUESTIONS[step].options.map((opt) => (
              <button key={opt.value}
                onClick={() => handleAnswer(QUESTIONS[step].id, opt.value)}
                className="devkit-card flex items-center gap-4 text-left transition-all cursor-pointer"
                style={{
                  padding: '16px 20px',
                  border: answers[QUESTIONS[step].id] === opt.value
                    ? '1px solid rgba(124,58,237,0.6)' : undefined,
                }}>
                <span className="text-2xl">{opt.icon}</span>
                <span className="font-semibold" style={{ color: '#f0f0ff' }}>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Class selection step */}
      {step === QUESTIONS.length && (
        <div className="w-full max-w-2xl space-y-6 animate-fade-in-up">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black" style={{ color: '#f0f0ff' }}>
              Choose your{' '}
              <span style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                class
              </span>
            </h2>
            <p style={{ color: '#8b8ba8' }}>Your class defines your career path. You can multi-class later.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CLASSES.map((cls) => (
              <button key={cls.slug}
                onClick={() => setSelectedClass(cls.slug)}
                className="devkit-card text-left transition-all cursor-pointer"
                style={{
                  padding: '20px',
                  border: selectedClass === cls.slug
                    ? `1px solid ${cls.color}66`
                    : undefined,
                  background: selectedClass === cls.slug
                    ? `${cls.color}11` : undefined,
                }}>
                <div className="text-3xl mb-3">{cls.icon}</div>
                <div className="font-bold" style={{ color: '#f0f0ff' }}>{cls.name}</div>
                <div className="text-sm mt-1" style={{ color: '#8b8ba8' }}>{cls.desc}</div>
                {selectedClass === cls.slug && (
                  <div className="mt-3 text-xs font-bold" style={{ color: cls.color }}>
                    ✓ Selected
                  </div>
                )}
              </button>
            ))}
          </div>

          <button onClick={handleFinish} disabled={!selectedClass || isLoading}
            className="btn-primary w-full" style={{ padding: '16px' }}>
            {isLoading ? 'Forging your path...' : '🗡️ Begin your quest'}
          </button>
        </div>
      )}

      {/* Skip / back */}
      <div className="mt-6 flex gap-4">
        {step > 0 && (
          <button onClick={() => setStep((s) => s - 1)} className="btn-ghost">
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}
