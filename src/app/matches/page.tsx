'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MapPin, Calendar, Sparkles, MessageCircle, X, Compass } from 'lucide-react';
import Link from 'next/link';
import { useMatches } from '@/hooks/useMatches';
import type { MatchData, UserProfile } from '@/types';
import { generateAIInsight } from '@/lib/ai-utils';

function MatchCardSkeleton() {
  return (
    <div className="animate-pulse flex gap-4 p-4 rounded-3xl bg-white shadow-sm border border-gray-100">
      <div className="w-16 h-16 rounded-2xl bg-gray-200 shrink-0" />
      <div className="flex-1 space-y-2 py-1">
        <div className="h-4 bg-gray-200 rounded-lg w-2/3" />
        <div className="h-3 bg-gray-200 rounded-lg w-1/2" />
        <div className="h-3 bg-gray-200 rounded-lg w-1/3" />
      </div>
    </div>
  );
}

function MatchDetailModal({
  match,
  onClose,
}: {
  match: MatchData | null;
  onClose: () => void;
}) {
  if (!match) return null;
  const user = match.matchedUser;
  const insight = generateAIInsight(user);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm rounded-[2rem] bg-white p-6 relative overflow-hidden shadow-2xl border border-gray-100"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800"
          >
            <X size={16} />
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-coral-200 shrink-0">
              <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{user.name}, {user.age}</h3>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                <MapPin size={12} className="text-coral-500" />
                {user.city}
              </p>
              {user.occupation && (
                <p className="text-xs text-gray-400 mt-0.5">{user.occupation}</p>
              )}
            </div>
          </div>

          {user.bio && (
            <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-2xl mb-4 italic leading-relaxed">
              &ldquo;{user.bio}&rdquo;
            </p>
          )}

          {/* AI Icebreaker */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-violet-50 to-pink-50 border border-violet-100 mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-violet-700 flex items-center gap-1">
                <Sparkles size={12} />
                AI Conversation Starter
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-violet-700">
                {insight.compatibility}% Match
              </span>
            </div>
            <p className="text-xs text-gray-800 font-medium">
              &ldquo;{insight.icebreaker}&rdquo;
            </p>
          </div>

          {/* Interests */}
          {user.interests.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Interests
              </p>
              <div className="flex flex-wrap gap-1">
                {user.interests.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-coral-50 text-coral-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function MatchCard({
  match,
  index,
  onSelect,
}: {
  match: MatchData;
  index: number;
  onSelect: () => void;
}) {
  const [imgError, setImgError] = useState(false);
  const { matchedUser, createdAt } = match;
  const matchDate = new Date(createdAt);
  const formattedDate = matchDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      onClick={onSelect}
      className="flex items-center gap-3.5 p-3.5 rounded-3xl bg-white shadow-sm border border-gray-100 hover:shadow-md hover:border-coral-100 transition-all cursor-pointer group"
    >
      {/* Photo */}
      <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-coral-100 ring-2 ring-coral-100/60">
        {imgError ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-coral-400 to-pink-400 text-white font-bold text-xl">
            {matchedUser.name.charAt(0)}
          </div>
        ) : (
          <img
            src={matchedUser.photo}
            alt={matchedUser.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1.5">
          <h3 className="font-bold text-gray-900 truncate text-sm">
            {matchedUser.name}
          </h3>
          <span className="text-xs text-gray-500 font-normal">{matchedUser.age}</span>
        </div>

        <div className="flex items-center gap-2.5 mt-1 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <MapPin size={11} className="text-coral-500" />
            <span className="truncate">{matchedUser.city}</span>
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Calendar size={11} />
            <span>{formattedDate}</span>
          </span>
        </div>

        {matchedUser.interests.length > 0 && (
          <div className="flex gap-1 mt-1.5 overflow-hidden">
            {matchedUser.interests.slice(0, 2).map((interest) => (
              <span
                key={interest}
                className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-50 text-gray-500 truncate"
              >
                {interest}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Heart indicator / Chat bubble */}
      <div className="w-9 h-9 rounded-2xl bg-coral-50 group-hover:bg-coral-500 text-coral-500 group-hover:text-white flex items-center justify-center transition-colors shrink-0 shadow-xs">
        <MessageCircle size={16} />
      </div>
    </motion.div>
  );
}

function EmptyMatches() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-coral-50 to-pink-50 flex items-center justify-center mb-5 ring-4 ring-coral-50/50">
        <Heart size={36} className="text-coral-400" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">No matches yet</h3>
      <p className="text-xs text-gray-500 max-w-xs mb-6 leading-relaxed">
        Start swiping on Discover! When someone you like likes you back, they will appear here instantly.
      </p>
      <Link
        href="/discover"
        className="btn-primary flex items-center gap-2 text-xs py-3 px-5 shadow-md shadow-coral-500/20"
      >
        <Compass size={15} />
        <span>Start Discovering</span>
      </Link>
    </motion.div>
  );
}

export default function MatchesPage() {
  const { matches, isLoading } = useMatches();
  const [selectedMatch, setSelectedMatch] = useState<MatchData | null>(null);

  return (
    <div className="flex flex-col min-h-screen px-4 pt-4 pb-24 max-w-md mx-auto">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between py-2 mb-3"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-coral-500 to-rose-400 flex items-center justify-center text-white shadow-sm">
            <Heart size={16} fill="currentColor" />
          </div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">Your Matches</h1>
        </div>

        {matches.length > 0 && (
          <span className="text-xs font-bold text-coral-600 bg-coral-50 border border-coral-100 px-2.5 py-1 rounded-full shadow-xs">
            {matches.length} {matches.length === 1 ? 'Match' : 'Matches'}
          </span>
        )}
      </motion.header>

      {/* Content */}
      <div className="flex-1 space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <MatchCardSkeleton key={i} />
            ))}
          </div>
        ) : matches.length === 0 ? (
          <EmptyMatches />
        ) : (
          <div className="space-y-3">
            {matches.map((match, index) => (
              <MatchCard
                key={match.id}
                match={match}
                index={index}
                onSelect={() => setSelectedMatch(match)}
              />
            ))}
          </div>
        )}
      </div>

      <MatchDetailModal
        match={selectedMatch}
        onClose={() => setSelectedMatch(null)}
      />
    </div>
  );
}
