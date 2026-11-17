'use client';

import { useState, useEffect, useCallback } from 'react';
import type { MatchData, MatchesResponse } from '@/types';

export function useMatches() {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/matches');
      if (!res.ok) {
        throw new Error(`Failed to fetch matches (${res.status})`);
      }
      const data: MatchesResponse = await res.json();
      setMatches(data.matches || []);
    } catch (err) {
      console.error('Fetch matches error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong fetching matches');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return {
    matches,
    isLoading,
    error,
    refetch: fetchMatches,
  };
}
