'use client';

import { motion } from 'framer-motion';
import { Sparkles, Heart, RefreshCw, Compass } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  onRefresh?: () => void;
}

export function EmptyState({ onRefresh }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-coral-100 to-pink-100 flex items-center justify-center mb-6 shadow-inner"
      >
        <Compass size={44} className="text-coral-500" strokeWidth={1.5} />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-coral-500 flex items-center justify-center text-white shadow-md"
        >
          <Sparkles size={16} />
        </motion.div>
      </motion.div>

      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        You&apos;ve explored everyone for now!
      </h3>
      <p className="text-sm text-gray-500 max-w-xs mb-8 leading-relaxed">
        You&apos;ve seen all eligible profiles in your area. New members join every day, so check back soon!
      </p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Link
          href="/matches"
          className="btn-primary w-full flex items-center justify-center gap-2 text-sm shadow-md shadow-coral-500/20"
        >
          <Heart size={16} fill="currentColor" />
          <span>View Your Matches</span>
        </Link>

        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="btn-secondary w-full flex items-center justify-center gap-2 text-sm"
          >
            <RefreshCw size={15} />
            <span>Check for New Profiles</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}
