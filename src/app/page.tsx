'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Sparkles, ArrowRight, ShieldCheck, Flame, Compass, MessageCircle, Lock } from 'lucide-react';

function FloatingHeart({ delay, x, size }: { delay: number; x: number; size: number }) {
  return (
    <motion.div
      className="absolute text-white/30"
      initial={{ y: 160, x, opacity: 0, scale: 0.5 }}
      animate={{
        y: -40,
        opacity: [0, 0.7, 0],
        scale: [0.5, 1, 0.8],
        rotate: [0, 15, -15, 0],
      }}
      transition={{
        duration: 4.5,
        delay,
        repeat: Infinity,
        ease: 'easeOut',
      }}
    >
      <Heart size={size} fill="currentColor" />
    </motion.div>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col items-center min-h-screen px-5 pt-8 pb-24 max-w-md mx-auto">
      {/* Top Header / Brand */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2 mb-2"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-coral-500 to-rose-400 flex items-center justify-center text-white shadow-md shadow-coral-500/30">
          <Heart size={16} fill="currentColor" />
        </div>
        <span className="text-sm font-bold tracking-widest text-coral-600 uppercase">
          COY DISCOVER
        </span>
      </motion.div>

      {/* Main Title */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-4xl font-black tracking-tight text-gray-900 text-center mb-1"
      >
        Welcome to{' '}
        <span className="bg-gradient-to-r from-coral-500 via-rose-500 to-pink-500 bg-clip-text text-transparent">
          Coy
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-gray-500 text-sm text-center max-w-xs mb-6 font-normal"
      >
        Explore real connections with 100% mutual privacy. Zero awkwardness.
      </motion.p>

      {/* Hero Visual Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="relative w-full aspect-[4/3] rounded-[2.5rem] bg-gradient-to-br from-coral-500 via-rose-500 to-pink-600 p-6 flex flex-col justify-between overflow-hidden shadow-xl shadow-coral-500/20 mb-6 text-white"
      >
        <FloatingHeart delay={0} x={30} size={20} />
        <FloatingHeart delay={1.2} x={140} size={16} />
        <FloatingHeart delay={2.4} x={90} size={24} />
        <FloatingHeart delay={0.8} x={240} size={18} />
        <FloatingHeart delay={2.0} x={180} size={22} />

        <div className="relative z-10 flex justify-between items-start">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
            <Sparkles size={12} />
            <span>Discover Mode</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
            <Lock size={16} />
          </div>
        </div>

        <div className="relative z-10 space-y-1">
          <p className="text-2xl font-black leading-tight drop-shadow-sm">
            Find Someone Who Likes You Back.
          </p>
          <p className="text-xs text-white/80 font-normal">
            Your likes stay completely secret until the feeling is mutual.
          </p>
        </div>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="w-full mb-8"
      >
        <Link
          href="/discover"
          className="btn-primary w-full flex items-center justify-center gap-2 text-base py-3.5 shadow-lg shadow-coral-500/30 font-bold"
        >
          <Compass size={20} />
          <span>Start Discovering</span>
          <ArrowRight size={18} />
        </Link>
      </motion.div>

      {/* Assignment Part A Feature Proposals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45 }}
        className="w-full space-y-4"
      >
        <div className="flex items-center gap-2 px-1">
          <Flame size={18} className="text-coral-500" />
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Part A · Suggested Core Features for Coy
          </h2>
        </div>

        {/* Feature 1 */}
        <div className="p-4 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-coral-50 text-coral-600 flex items-center justify-center font-bold text-xs">
              1
            </div>
            <h3 className="text-sm font-bold text-gray-900">
              Campus / Circle Verification & Discovery Rings
            </h3>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            <span className="font-semibold text-gray-800">Why required:</span> Coy&apos;s superpower is eliminating social friction among people who share real-world overlap (colleges, tech hubs, alumni networks). Verified domain circles (e.g. @iitb.ac.in, @bits-pilani.ac.in) dramatically boost conversion and crush submissions because the likelihood of mutual crushes is 5x higher within trusted social rings.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="p-4 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold text-xs">
              2
            </div>
            <h3 className="text-sm font-bold text-gray-900">
              Double-Blind &ldquo;Warm-Up Hint&rdquo; Notifications
            </h3>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            <span className="font-semibold text-gray-800">Why required:</span> Retention drops if users add a crush and hear nothing for weeks. A zero-knowledge aggregated hint (&ldquo;Someone in your college cohort added you as a crush this week! Add your 3 crushes to see if it&apos;s mutual&rdquo;) generates massive re-engagement and referral loops while strictly preserving individual identity privacy.
          </p>
        </div>

        {/* Privacy badge */}
        <div className="flex items-center justify-center gap-2 py-3 text-xs text-gray-400">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span>Zero-Leakage Cryptographic Privacy Guaranteed</span>
        </div>
      </motion.div>
    </div>
  );
}
