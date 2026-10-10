import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/AuthContext';

export const metadata: Metadata = {
  title: {
    default: 'DEVKIT — Learn to Code Like a Legend',
    template: '%s | DEVKIT',
  },
  description:
    'Master Computer Science through quests, forge legendary weapons, defeat boss challenges, and become a legendary developer.',
  keywords: [
    'learn programming',
    'coding platform',
    'gamified learning',
    'computer science',
    'Python',
    'JavaScript',
    'developer',
  ],
  authors: [{ name: 'DEVKIT' }],
  openGraph: {
    title: 'DEVKIT — Learn to Code Like a Legend',
    description:
      'A gamified Computer Science learning platform. Master code through epic quests.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/*
        suppressHydrationWarning on body:
        Grammarly and other browser extensions inject attributes (data-gr-*)
        into <body> after server render — this silences the false-positive
        React hydration mismatch.
      */}
      <body suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
