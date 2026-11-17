'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageCircle, Heart, ChevronDown } from 'lucide-react';
import type { UserProfile } from '@/types';
import { generateAIInsight } from '@/lib/ai-utils';

interface AIInsightBadgeProps {
  profile: UserProfile;
}

export function AIInsightBadge({ profile }: AIInsightBadgeProps) {
  const [expanded, setExpanded] = useState(false);
  const insight = generateAIInsight(profile);

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setExpanded((prev) => !prev);
        }}
        className="w-full flex items-center justify-between px-3.5 py-2 rounded-2xl bg-gradient-to-r from-violet-50 to-pink-50 border border-violet-100/80 hover:border-violet-200 transition-all text-left shadow-sm"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-violet-500 to-pink-500 flex items-center justify-center text-white shadow-sm">
            <Sparkles size={13} />
          </div>
          <span className="text-xs font-semibold bg-gradient-to-r from-violet-700 to-pink-600 bg-clip-text text-transparent">
            AI Vibe Check
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-white text-violet-700 shadow-xs border border-violet-100">
            <Heart size={10} className="fill-violet-500 text-violet-500" />
            {insight.compatibility}% Match
          </span>
        </div>

        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={14} className="text-violet-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-2 p-3 rounded-2xl bg-white/95 border border-violet-100/90 shadow-sm space-y-2.5">
              {/* Shared Interests */}
              {insight.sharedInterests.length > 0 ? (
                <div>
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Shared Interests
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {insight.sharedInterests.map((interest) => (
                      <span
                        key={interest}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-100"
                      >
                        ✨ {interest}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-gray-500">
                  Different interests mean endless new things to discover together!
                </p>
              )}

              {/* AI Icebreaker */}
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-violet-700 mb-1">
                  <MessageCircle size={12} />
                  <span>AI Suggested Icebreaker</span>
                </div>
                <p className="text-xs text-gray-700 italic bg-violet-50/60 p-2 rounded-xl border border-violet-100/50">
                  &ldquo;{insight.icebreaker}&rdquo;
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
