'use client';

import { useState, useCallback, useRef } from 'react';
import type { SwipeResponse } from '@/types';

export function useSwipe(onMatchCallback?: (user: { id: string; name: string; photo: string }) => void) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [matchedUser, setMatchedUser] = useState<{ id: string; name: string; photo: string } | null>(null);
  const swipedTargetIds = useRef<Set<string>>(new Set());

  const handleSwipe = useCallback(
    async (targetUserId: string, action: 'like' | 'pass') => {
      // Prevent rapid repeated clicks or duplicate swipes on the same target in the same session
      if (isProcessing || swipedTargetIds.current.has(targetUserId)) {
        return;
      }

      setIsProcessing(true);
      swipedTargetIds.current.add(targetUserId);

      try {
        const res = await fetch('/api/swipe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ targetUserId, action }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          console.warn('Swipe response error:', errData?.error || res.statusText);
          return;
        }

        const data: SwipeResponse = await res.json();

        if (data.matched && data.match) {
          const matchedProfile = data.match.user;
          setMatchedUser(matchedProfile);
          onMatchCallback?.(matchedProfile);
        }
      } catch (err) {
        console.error('Failed to submit swipe:', err);
      } finally {
        setIsProcessing(false);
      }
    },
    [isProcessing, onMatchCallback]
  );

  const clearMatch = useCallback(() => {
    setMatchedUser(null);
  }, []);

  return {
    handleSwipe,
    matchedUser,
    clearMatch,
    isProcessing,
  };
}
