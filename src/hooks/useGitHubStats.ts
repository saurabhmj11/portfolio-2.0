import { useState, useEffect } from 'react';

export interface GitHubStats {
    publicRepos: number;
    followers: number;
    following: number;
    totalStars: number;
    recentCommits: number;
}

const CACHE_KEY = 'gh_stats_cache';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

interface CacheData {
    stats: GitHubStats;
    timestamp: number;
}

export const useGitHubStats = (username: string = 'saurabhmj11') => {
    const [stats, setStats] = useState<GitHubStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchStats = async () => {
            try {
                // Check cache first
                const cached = localStorage.getItem(CACHE_KEY);
                if (cached) {
                    const parsed: CacheData = JSON.parse(cached);
                    const isExpired = Date.now() - parsed.timestamp > CACHE_TTL_MS;
                    if (!isExpired) {
                        if (isMounted) {
                            setStats(parsed.stats);
                            setLoading(false);
                        }
                        return; // Use cached data
                    }
                }

                // If not cached or expired, fetch from network
                const [userRes, reposRes, eventsRes] = await Promise.all([
                    fetch(`https://api.github.com/users/${username}`),
                    fetch(`https://api.github.com/users/${username}/repos?per_page=100`),
                    fetch(`https://api.github.com/users/${username}/events/public?per_page=30`)
                ]);

                if (!userRes.ok) throw new Error('Failed to fetch user');

                const userData = await userRes.json();
                
                let totalStars = 0;
                if (reposRes.ok) {
                    const reposData = await reposRes.json();
                    totalStars = reposData.reduce((acc: number, repo: { stargazers_count?: number }) => acc + (repo.stargazers_count || 0), 0);
                }

                let recentCommits = 0;
                if (eventsRes.ok) {
                    const eventsData = await eventsRes.json();
                    recentCommits = eventsData.filter((event: { type: string }) => event.type === 'PushEvent').length;
                }

                const newStats: GitHubStats = {
                    publicRepos: userData.public_repos || 0,
                    followers: userData.followers || 0,
                    following: userData.following || 0,
                    totalStars,
                    recentCommits: recentCommits * 3 // Simulated activity multiplier
                };

                // Save to cache
                localStorage.setItem(CACHE_KEY, JSON.stringify({
                    stats: newStats,
                    timestamp: Date.now()
                }));

                if (isMounted) {
                    setStats(newStats);
                    setLoading(false);
                }

            } catch (err) {
                console.error("Error fetching GitHub stats:", err);
                if (isMounted) {
                    // If network fails, try to serve stale cache if available
                    const cached = localStorage.getItem(CACHE_KEY);
                    if (cached) {
                        setStats(JSON.parse(cached).stats);
                        setError(true); // Flag error but serve stale
                    } else {
                        setError(true);
                    }
                    setLoading(false);
                }
            }
        };

        fetchStats();

        return () => {
            isMounted = false;
        };
    }, [username]);

    return { stats, loading, error };
};
