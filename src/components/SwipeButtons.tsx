'use client';

import { motion } from 'framer-motion';
import { X, Heart } from 'lucide-react';

interface SwipeButtonsProps {
  onLike: () => void;
  onPass: () => void;
  disabled?: boolean;
}

export function SwipeButtons({ onLike, onPass, disabled }: SwipeButtonsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex items-center justify-center gap-6 py-5"
    >
      {/* Pass button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.9 }}
        onClick={onPass}
        disabled={disabled}
        className="w-14 h-14 rounded-full bg-white card-shadow flex items-center justify-center border border-gray-100 text-gray-400 hover:text-red-400 hover:border-red-200 transition-colors duration-200 disabled:opacity-50"
        aria-label="Pass"
      >
        <X size={24} strokeWidth={2.5} />
      </motion.button>

      {/* Like button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.9 }}
        onClick={onLike}
        disabled={disabled}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-coral-400 to-rose-500 shadow-lg shadow-coral-500/30 flex items-center justify-center text-white hover:shadow-xl hover:shadow-coral-500/40 transition-shadow duration-200 disabled:opacity-50"
        aria-label="Like"
      >
        <Heart size={28} fill="currentColor" strokeWidth={0} />
      </motion.button>
    </motion.div>
  );
}
