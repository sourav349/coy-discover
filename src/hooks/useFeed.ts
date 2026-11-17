'use client';

import { useState, useEffect, useCallback } from 'react';
import type { UserProfile, FeedResponse } from '@/types';

export function useFeed() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeed = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/feed');
      if (!res.ok) {
        throw new Error(`Failed to fetch feed (${res.status})`);
      }
      const data: FeedResponse = await res.json();
      setProfiles(data.profiles || []);
    } catch (err) {
      console.error('Feed fetch error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong fetching profiles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const removeTopProfile = useCallback(() => {
    setProfiles((prev) => prev.slice(1));
  }, []);

  const currentProfile = profiles.length > 0 ? profiles[0] : null;
  const hasMore = profiles.length > 0;

  return {
    profiles,
    currentProfile,
    hasMore,
    loading,
    error,
    removeTopProfile,
    refreshFeed: fetchFeed,
  };
}
