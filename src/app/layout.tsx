import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'Coy Discover',
  description: 'Find your perfect match — swipe, match, connect.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-cream-50 min-h-screen">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
