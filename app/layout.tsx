import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/AuthContext';

export const metadata: Metadata = {
  title: { default: 'DEVKIT — Learn like you\'re playing', template: '%s | DEVKIT' },
  description:
    'DEVKIT is a gamified CSE learning platform. Master programming through quests, forge weapons, defeat bosses, and build your developer character.',
  keywords: ['programming', 'coding', 'learn', 'gamified', 'CSE', 'developer', 'RPG', 'quests'],
  authors: [{ name: 'DEVKIT' }],
  openGraph: {
    title: 'DEVKIT — Learn like you\'re playing',
    description: 'Gamified CSE learning. Master coding through quests and forge your path.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
