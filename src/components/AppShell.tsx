'use client';

import { BottomNav } from './BottomNav';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-lg min-h-screen flex flex-col relative">
      <main className="flex-1 pb-24 overflow-hidden">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
