'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Heart, X, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface MatchModalProps {
  user: {
    id: string;
    name: string;
    photo: string;
  } | null;
  currentUserPhoto?: string;
  onClose: () => void;
  onViewMatches?: () => void;
}

// Confetti particle generator
const CONFETTI_COLORS = ['#ff4d6d', '#ff758f', '#ffb3c1', '#7209b7', '#f72585', '#4cc9f0', '#ffd166', '#06d6a0'];

export function MatchModal({
  user,
  currentUserPhoto = 'https://i.pravatar.cc/400?img=68',
  onClose,
  onViewMatches,
}: MatchModalProps) {
  return (
    <AnimatePresence>
      {user && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-6 overflow-hidden"
          onClick={onClose}
        >
          {/* Confetti particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 32 }).map((_, i) => {
              const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
              const startX = 50 + (Math.random() * 40 - 20);
              const startY = 40 + (Math.random() * 20 - 10);
              const destX = (Math.random() - 0.5) * 450;
              const destY = -150 - Math.random() * 350;
              const size = 6 + Math.random() * 8;
              const isCircle = i % 2 === 0;

              return (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${startX}%`,
                    top: `${startY}%`,
                    width: size,
                    height: isCircle ? size : size * 1.5,
                    backgroundColor: color,
                    borderRadius: isCircle ? '50%' : '2px',
                  }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 0, rotate: 0 }}
                  animate={{
                    x: destX,
                    y: destY,
                    opacity: [0, 1, 1, 0],
                    scale: [0, 1.2, 1, 0.5],
                    rotate: Math.random() * 720 - 360,
                  }}
                  transition={{
                    duration: 2 + Math.random() * 1.5,
                    ease: 'easeOut',
                    delay: 0.1 + Math.random() * 0.2,
                  }}
                />
              );
            })}
          </div>

          <motion.div
            initial={{ scale: 0.7, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.7, y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-[2.5rem] bg-gradient-to-b from-white via-cream-50 to-coral-50/50 p-6 text-center relative overflow-hidden shadow-2xl border border-white/60"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors z-20"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Sparkle badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 400 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral-50 border border-coral-100 text-coral-600 text-xs font-semibold mb-3 shadow-xs"
            >
              <Sparkles size={13} className="text-coral-500" />
              <span>Mutual Attraction</span>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-extrabold tracking-tight mb-6"
            >
              <span className="bg-gradient-to-r from-coral-500 via-rose-500 to-pink-600 bg-clip-text text-transparent">
                It&apos;s a Match!
              </span>
            </motion.h2>

            {/* Overlapping profile photos with heart */}
            <div className="relative flex items-center justify-center my-4 h-32">
              {/* Current user photo (left) */}
              <motion.div
                initial={{ x: -60, opacity: 0, rotate: -10 }}
                animate={{ x: -28, opacity: 1, rotate: -6 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
                className="w-24 h-24 rounded-3xl overflow-hidden ring-4 ring-white shadow-xl bg-gray-100 relative z-10"
              >
                <img
                  src={currentUserPhoto}
                  alt="You"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Heart badge between them */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.25, 1] }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute z-20 w-11 h-11 rounded-full bg-gradient-to-tr from-coral-500 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-coral-500/40 ring-4 ring-white"
              >
                <Heart size={20} fill="currentColor" strokeWidth={0} />
              </motion.div>

              {/* Matched user photo (right) */}
              <motion.div
                initial={{ x: 60, opacity: 0, rotate: 10 }}
                animate={{ x: 28, opacity: 1, rotate: 6 }}
                transition={{ delay: 0.35, type: 'spring', stiffness: 300 }}
                className="w-24 h-24 rounded-3xl overflow-hidden ring-4 ring-white shadow-xl bg-gray-100 relative z-10"
              >
                <img
                  src={user.photo}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="text-gray-600 text-sm mb-6 mt-2"
            >
              You and <span className="font-bold text-gray-900">{user.name}</span> have liked each other.
            </motion.p>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="flex flex-col gap-2.5"
            >
              <Link
                href="/matches"
                onClick={() => {
                  onClose();
                  onViewMatches?.();
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-coral-500 to-rose-500 hover:from-coral-600 hover:to-rose-600 text-white font-semibold text-sm shadow-lg shadow-coral-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} />
                <span>View Matches</span>
                <ArrowRight size={16} />
              </Link>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 px-6 rounded-2xl bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm border border-gray-200 active:scale-95 transition-all"
              >
                Keep Discovering
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
