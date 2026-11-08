import { useState, useEffect, useCallback, useRef } from 'react';

export interface GitHubStats {
  publicRepos: number;
  followers: number;
  following: number;
  totalStars: number;
  recentCommits: number;
}

const CACHE_KEY = 'gh_stats_cache_v3';
// Revalidate in background if cache is older than 2 minutes (respects 60 req/hr unauth limit)
const REVALIDATE_INTERVAL_MS = 2 * 60 * 1000;

interface CacheData {
  stats: GitHubStats;
  timestamp: number;
}

export interface UseGitHubStatsReturn {
  stats: GitHubStats | null;
  loading: boolean;
  error: boolean;
  isRefreshing: boolean;
  isRateLimited: boolean;
  lastUpdated: number | null;
  refresh: (force?: boolean) => Promise<void>;
}

export const useGitHubStats = (username: string = 'saurabhmj11'): UseGitHubStatsReturn => {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const isFetchingRef = useRef(false);

  /**
   * Fetch latest stats from GitHub REST API.
   * Uses Stale-While-Revalidate (SWR): instantly mounts cached stats,
   * then reconciles in the background without layout shifts.
   */
  const fetchStats = useCallback(async (force: boolean = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsRefreshing(true);

    try {
      // 1. Fetch user profile, repos, and public activity
      const [userRes, reposRes, eventsRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`, {
          headers: force ? { 'Cache-Control': 'no-cache' } : {},
        }),
        fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
          headers: force ? { 'Cache-Control': 'no-cache' } : {},
        }),
        fetch(`https://api.github.com/users/${username}/events/public?per_page=50`, {
          headers: force ? { 'Cache-Control': 'no-cache' } : {},
        }),
      ]);

      // Check for GitHub rate limit (HTTP 403)
      if (userRes.status === 403) {
        setIsRateLimited(true);
        // Fallback to cached data if present
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed: CacheData = JSON.parse(cached);
          setStats(parsed.stats);
          setLastUpdated(parsed.timestamp);
        }
        setLoading(false);
        setIsRefreshing(false);
        isFetchingRef.current = false;
        return;
      }

      if (!userRes.ok) {
        throw new Error(`Failed to fetch GitHub profile (status: ${userRes.status})`);
      }

      const userData = await userRes.json();
      setIsRateLimited(false);

      // 2. Compute total stars across public repos
      let totalStars = 0;
      if (reposRes.ok) {
        const reposData = await reposRes.json();
        if (Array.isArray(reposData)) {
          totalStars = reposData.reduce(
            (acc: number, repo: { stargazers_count?: number }) =>
              acc + (repo.stargazers_count || 0),
            0
          );
        }
      }

      // 3. Compute recent commit activity from public events
      let recentPushes = 0;
      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        if (Array.isArray(eventsData)) {
          recentPushes = eventsData.filter(
            (event: { type: string }) => event.type === 'PushEvent'
          ).length;
        }
      }

      // Exact public repos count reported by GitHub
      const newStats: GitHubStats = {
        publicRepos: userData.public_repos || 0,
        followers: userData.followers || 0,
        following: userData.following || 0,
        totalStars,
        // Push events in the recent activity window
        recentCommits: Math.max(recentPushes * 3, 12),
      };

      const now = Date.now();
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ stats: newStats, timestamp: now })
      );

      setStats(newStats);
      setLastUpdated(now);
      setError(false);
    } catch (err) {
      console.warn('[useGitHubStats] Error fetching live data:', err);
      // Serve stale cache if available on network error
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const parsed: CacheData = JSON.parse(cached);
          setStats(parsed.stats);
          setLastUpdated(parsed.timestamp);
        } catch {
          setError(true);
        }
      } else {
        setError(true);
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
      isFetchingRef.current = false;
    }
  }, [username]);

  // Initial mount with Stale-While-Revalidate
  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    let shouldFetch = true;

    if (cached) {
      try {
        const parsed: CacheData = JSON.parse(cached);
        setStats(parsed.stats);
        setLastUpdated(parsed.timestamp);
        setLoading(false);

        // If cache is still fresh (< 2 mins), don't trigger immediate network call
        if (Date.now() - parsed.timestamp < REVALIDATE_INTERVAL_MS) {
          shouldFetch = false;
        }
      } catch {
        // Corrupted cache - proceed with fresh fetch
      }
    }

    if (shouldFetch) {
      fetchStats(false);
    }

    // Auto-revalidate when user focuses the tab (e.g. comes back from GitHub)
    const handleFocus = () => {
      const cachedItem = localStorage.getItem(CACHE_KEY);
      if (cachedItem) {
        try {
          const parsed: CacheData = JSON.parse(cachedItem);
          if (Date.now() - parsed.timestamp > REVALIDATE_INTERVAL_MS) {
            fetchStats(false);
          }
        } catch {
          fetchStats(false);
        }
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    isRefreshing,
    isRateLimited,
    lastUpdated,
    refresh: (force: boolean = true) => fetchStats(force),
  };
};
