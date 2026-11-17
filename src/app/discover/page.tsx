'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, Compass } from 'lucide-react';
import { ProfileCard } from '@/components/discover/ProfileCard';
import { SwipeButtons } from '@/components/SwipeButtons';
import { MatchModal } from '@/components/MatchModal';
import { EmptyState } from '@/components/EmptyState';
import { useFeed } from '@/hooks/useFeed';
import { useSwipe } from '@/hooks/useSwipe';

function LoadingSkeleton() {
  return (
    <div className="w-full pt-2">
      <div className="animate-pulse flex flex-col rounded-[2rem] bg-white p-4 shadow-sm border border-gray-100">
        <div className="rounded-[1.7rem] bg-gray-200 aspect-[4/4.5] w-full" />
        <div className="mt-4 space-y-2.5">
          <div className="h-6 bg-gray-200 rounded-xl w-3/5" />
          <div className="h-4 bg-gray-200 rounded-xl w-2/5" />
          <div className="h-10 bg-gray-100 rounded-2xl w-full" />
        </div>
      </div>
    </div>
  );
}

export default function DiscoverPage() {
  const { profiles, currentProfile, hasMore, loading, error, removeTopProfile, refreshFeed } = useFeed();
  const { handleSwipe, matchedUser, clearMatch, isProcessing } = useSwipe();

  const handleAction = useCallback(
    async (action: 'like' | 'pass') => {
      if (!currentProfile || isProcessing) return;
      const targetId = currentProfile.id;
      // Remove immediately from UI for instant snappy feedback
      removeTopProfile();
      // Record swipe in backend and check for mutual match
      await handleSwipe(targetId, action);
    },
    [currentProfile, isProcessing, handleSwipe, removeTopProfile]
  );

  // Keyboard navigation support: ArrowRight = Like, ArrowLeft = Pass
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleAction('like');
      } else if (e.key === 'ArrowLeft') {
        handleAction('pass');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAction]);

  return (
    <div className="flex flex-col min-h-screen px-4 pt-3 pb-24 max-w-md mx-auto">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between py-2 mb-2"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-coral-500 to-rose-400 flex items-center justify-center text-white shadow-sm">
            <Compass size={17} />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-1.5">
              Discover
              <Sparkles size={14} className="text-coral-500" />
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isProcessing && (
            <div className="flex items-center gap-1 text-xs text-coral-500 bg-coral-50 px-2.5 py-1 rounded-full font-medium">
              <Loader2 size={12} className="animate-spin" />
              <span>Saving</span>
            </div>
          )}
          {profiles.length > 0 && (
            <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
              {profiles.length} left
            </span>
          )}
        </div>
      </motion.header>

      {/* Main card or empty state */}
      <div className="flex-1 flex flex-col justify-center relative">
        {loading && profiles.length === 0 ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="p-6 rounded-3xl bg-red-50 border border-red-100 text-center my-auto">
            <p className="text-sm text-red-600 font-medium mb-3">{error}</p>
            <button
              type="button"
              onClick={refreshFeed}
              className="btn-primary text-xs py-2 px-4"
            >
              Try Again
            </button>
          </div>
        ) : !currentProfile || !hasMore ? (
          <EmptyState onRefresh={refreshFeed} />
        ) : (
          <div className="relative w-full">
            {/* Background stack card preview for depth */}
            {profiles.length > 1 && (
              <div
                className="absolute inset-0 w-full rounded-[2rem] bg-gray-200/60 transform scale-[0.93] translate-y-3 pointer-events-none -z-10 shadow-sm"
                aria-hidden="true"
              />
            )}

            <AnimatePresence mode="wait">
              <ProfileCard
                key={currentProfile.id}
                profile={currentProfile}
                onLike={() => handleAction('like')}
                onPass={() => handleAction('pass')}
                isTop={true}
              />
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Swipe buttons */}
      {currentProfile && hasMore && (
        <SwipeButtons
          onLike={() => handleAction('like')}
          onPass={() => handleAction('pass')}
          disabled={isProcessing}
        />
      )}

      {/* Match modal */}
      <MatchModal
        user={matchedUser}
        onClose={clearMatch}
        currentUserPhoto="https://i.pravatar.cc/400?img=68"
      />
    </div>
  );
}
