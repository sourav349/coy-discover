'use client';

import { useState, useMemo } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence, type PanInfo } from 'framer-motion';
import { MapPin, Briefcase } from 'lucide-react';
import type { UserProfile } from '@/types';
import { AIInsightBadge } from './AIInsightBadge';

export interface ProfileCardProps {
  profile: UserProfile;
  onSwipe?: (action: 'like' | 'pass') => void;
  onLike?: () => void;
  onPass?: () => void;
  isTop?: boolean;
}

export function ProfileCard({ profile, onSwipe, onLike, onPass, isTop = true }: ProfileCardProps) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18]);
  const likeOpacity = useTransform(x, [0, 60, 140], [0, 0.6, 1]);
  const nopeOpacity = useTransform(x, [-140, -60, 0], [1, 0.6, 0]);

  const initial = useMemo(() => profile.name.charAt(0).toUpperCase(), [profile.name]);

  const triggerLike = () => {
    setExitDirection('right');
    if (onLike) onLike();
    if (onSwipe) onSwipe('like');
  };

  const triggerPass = () => {
    setExitDirection('left');
    if (onPass) onPass();
    if (onSwipe) onSwipe('pass');
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 80;
    if (info.offset.x > threshold || info.velocity.x > 500) {
      triggerLike();
    } else if (info.offset.x < -threshold || info.velocity.x < -500) {
      triggerPass();
    }
  };

  const interests = useMemo(() => {
    if (Array.isArray(profile.interests)) return profile.interests;
    if (typeof profile.interests === 'string') {
      try {
        return JSON.parse(profile.interests) as string[];
      } catch {
        return [];
      }
    }
    return [];
  }, [profile.interests]);

  return (
    <AnimatePresence mode="popLayout">
      {!exitDirection && (
        <motion.div
          key={profile.id}
          className="relative w-full cursor-grab active:cursor-grabbing select-none"
          style={{ x, rotate, zIndex: isTop ? 10 : 0 }}
          drag={isTop ? 'x' : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.8}
          onDragEnd={handleDragEnd}
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{
            x: exitDirection === 'right' ? 600 : -600,
            opacity: 0,
            rotate: exitDirection === 'right' ? 30 : -30,
            transition: { duration: 0.35, ease: 'easeOut' },
          }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        >
          <div className="relative w-full overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-black/5 flex flex-col">
            {/* Photo Section */}
            <div className="relative aspect-[4/4.5] w-full overflow-hidden rounded-t-[2rem] bg-gray-100">
              {/* Loading skeleton */}
              {!imgLoaded && !imgError && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200" />
              )}

              {/* Image or fallback */}
              {imgError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-coral-400 via-rose-400 to-pink-500 text-white">
                  <span className="text-7xl font-black opacity-90">{initial}</span>
                  <span className="text-xs uppercase tracking-widest mt-2 font-medium opacity-80">Photo Unavailable</span>
                </div>
              ) : (
                <img
                  src={profile.photo}
                  alt={profile.name}
                  className="h-full w-full object-cover pointer-events-none"
                  onError={() => setImgError(true)}
                  onLoad={() => setImgLoaded(true)}
                  draggable={false}
                />
              )}

              {/* Gradient overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

              {/* Name & age over photo */}
              <div className="absolute bottom-4 left-5 right-5 pointer-events-none text-white">
                <div className="flex items-baseline gap-2">
                  <h2 className="text-2xl font-black drop-shadow-md tracking-tight">
                    {profile.name}
                  </h2>
                  <span className="text-xl font-light text-white/90 drop-shadow-sm">
                    {profile.age}
                  </span>
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-3 text-white/90 text-xs">
                  {profile.city && (
                    <span className="flex items-center gap-1 font-medium bg-black/30 backdrop-blur-md px-2 py-0.5 rounded-full">
                      <MapPin size={11} className="text-coral-300" />
                      {profile.city}
                    </span>
                  )}
                  {profile.occupation && (
                    <span className="flex items-center gap-1 font-medium bg-black/30 backdrop-blur-md px-2 py-0.5 rounded-full">
                      <Briefcase size={11} className="text-coral-300" />
                      {profile.occupation}
                    </span>
                  )}
                </div>
              </div>

              {/* LIKE stamp */}
              <motion.div
                className="absolute left-6 top-8 rounded-2xl border-4 border-emerald-400 bg-emerald-500/20 backdrop-blur-xs px-4 py-1.5 pointer-events-none shadow-lg"
                style={{ opacity: likeOpacity, rotate: -16 }}
              >
                <span className="text-2xl font-black tracking-widest text-emerald-400">
                  LIKE
                </span>
              </motion.div>

              {/* NOPE stamp */}
              <motion.div
                className="absolute right-6 top-8 rounded-2xl border-4 border-rose-500 bg-rose-500/20 backdrop-blur-xs px-4 py-1.5 pointer-events-none shadow-lg"
                style={{ opacity: nopeOpacity, rotate: 16 }}
              >
                <span className="text-2xl font-black tracking-widest text-rose-500">
                  NOPE
                </span>
              </motion.div>
            </div>

            {/* Info & AI Insight Section */}
            <div className="p-4 bg-white flex flex-col gap-3">
              {/* AI Vibe Check Badge */}
              <AIInsightBadge profile={profile} />

              {/* Bio */}
              {profile.bio && (
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed font-normal">
                  {profile.bio}
                </p>
              )}

              {/* Interest tags */}
              {interests.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {interests.slice(0, 5).map((interest) => (
                    <span
                      key={interest}
                      className="rounded-full bg-coral-50/80 border border-coral-100/60 px-2.5 py-0.5 text-[11px] font-medium text-coral-600"
                    >
                      #{interest}
                    </span>
                  ))}
                  {interests.length > 5 && (
                    <span className="text-[11px] text-gray-400 px-1 py-0.5 font-medium">
                      +{interests.length - 5}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
