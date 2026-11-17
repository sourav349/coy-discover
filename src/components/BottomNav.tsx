'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const tabs = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/discover', label: 'Discover', icon: Compass },
  { href: '/matches', label: 'Matches', icon: Heart },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg z-50">
      <div className="bg-white/95 backdrop-blur-lg border-t border-gray-100 rounded-t-2xl shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-around px-2 py-2">
          {tabs.map((tab) => {
            const active = isActive(tab.href);
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`
                  relative flex flex-col items-center gap-0.5 py-2 px-5 rounded-xl
                  transition-colors duration-200
                  ${active ? 'text-coral-500' : 'text-gray-400 hover:text-gray-600'}
                `}
              >
                <div className="relative">
                  <Icon
                    size={22}
                    strokeWidth={active ? 2.5 : 2}
                    className="transition-all duration-200"
                  />
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-coral-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </div>
                <span
                  className={`text-[10px] font-medium transition-all duration-200 ${
                    active ? 'font-semibold' : ''
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
