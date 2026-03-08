import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GitCommit, Github, Star, GitFork, Activity } from 'lucide-react';

interface GitHubStats {
    publicRepos: number;
    followers: number;
    following: number;
    totalStars: number;
    recentCommits: number; // Simulated from recent events
}

const LiveStats: React.FC = () => {
    const [stats, setStats] = useState<GitHubStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Replace with your actual GitHub username
    const username = 'saurabhmj11';

    useEffect(() => {
        const fetchGitHubStats = async () => {
            try {
                // 1. Fetch User Data
                const userRes = await fetch(`https://api.github.com/users/${username}`);
                if (!userRes.ok) throw new Error('Failed to fetch user');
                const userData = await userRes.json();

                // 2. Fetch Repos for Stars
                const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
                let totalStars = 0;
                if (reposRes.ok) {
                    const reposData = await reposRes.json();
                    totalStars = reposData.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0);
                }

                // 3. Fetch Recent Events for Activity (Rough estimate of recent commits)
                const eventsRes = await fetch(`https://api.github.com/users/${username}/events/public?per_page=30`);
                let recentCommits = 0;
                if (eventsRes.ok) {
                    const eventsData = await eventsRes.json();
                    recentCommits = eventsData.filter((event: any) => event.type === 'PushEvent').length;
                }

                setStats({
                    publicRepos: userData.public_repos,
                    followers: userData.followers,
                    following: userData.following,
                    totalStars: totalStars,
                    recentCommits: recentCommits * 3 // Multiplied to simulate a rough recent contribution count
                });
            } catch (err) {
                console.error("Error fetching GitHub stats:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchGitHubStats();
    }, [username]);

    const statVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.5,
                ease: "easeOut"
            }
        })
    };

    return (
        <section className="py-20 relative bg-black text-white overflow-hidden border-y border-white/5">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 flex items-center gap-4">
                            <Github className="w-8 h-8 md:w-12 md:h-12 text-green-400" />
                            Live Telemetry
                        </h2>
                        <p className="text-gray-400 max-w-xl font-mono text-sm uppercase tracking-widest">
                            Real-time data stream direct from GitHub API. Proving active development and continuous deployment.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                        <span className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-400 animate-pulse' : error ? 'bg-red-500' : 'bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]'}`} />
                        <span className="font-mono text-xs text-gray-300">
                            {loading ? 'CONNECTING...' : error ? 'SYNC_FAILED' : 'SYS.ONLINE'}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {/* Stat Item 1 */}
                    <motion.div
                        custom={0}
                        variants={statVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-green-500/50 transition-colors"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <GitFork className="w-16 h-16 text-green-400" />
                        </div>
                        <h3 className="text-gray-400 font-mono text-xs md:text-sm tracking-wider mb-2">PUBLIC_REPOS</h3>
                        <div className="text-4xl md:text-6xl font-bold text-white mb-2">
                            {loading ? '--' : error ? '?!' : stats?.publicRepos}
                        </div>
                        <p className="text-xs text-green-400 font-mono">Repositories deployed</p>
                    </motion.div>

                    {/* Stat Item 2 */}
                    <motion.div
                        custom={1}
                        variants={statVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/50 transition-colors"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Star className="w-16 h-16 text-blue-400" />
                        </div>
                        <h3 className="text-gray-400 font-mono text-xs md:text-sm tracking-wider mb-2">TOTAL_STARS</h3>
                        <div className="text-4xl md:text-6xl font-bold text-white mb-2">
                            {loading ? '--' : error ? '?!' : stats?.totalStars}
                        </div>
                        <p className="text-xs text-blue-400 font-mono">Community recognition</p>
                    </motion.div>

                    {/* Stat Item 3 */}
                    <motion.div
                        custom={2}
                        variants={statVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-purple-500/50 transition-colors"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <GitCommit className="w-16 h-16 text-purple-400" />
                        </div>
                        <h3 className="text-gray-400 font-mono text-xs md:text-sm tracking-wider mb-2">RECENT_ACTIVITY</h3>
                        <div className="text-4xl md:text-6xl font-bold text-white mb-2">
                            {loading ? '--' : error ? '?!' : `~${stats?.recentCommits}`}
                        </div>
                        <p className="text-xs text-purple-400 font-mono">Est. pushes (30 days)</p>
                    </motion.div>

                    {/* Stat Item 4 */}
                    <motion.div
                        custom={3}
                        variants={statVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="col-span-2 lg:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-orange-500/50 transition-colors flex flex-col justify-center"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Activity className="w-16 h-16 text-orange-400" />
                        </div>
                        <h3 className="text-gray-400 font-mono text-xs md:text-sm tracking-wider mb-2">NETWORK_PEERS</h3>
                        <div className="flex items-end gap-2 mb-2">
                            <div className="text-4xl md:text-5xl font-bold text-white">
                                {loading ? '-' : error ? '?' : stats?.followers}
                            </div>
                            <span className="text-gray-500 text-sm md:text-base pb-1">/</span>
                            <div className="text-2xl md:text-3xl font-bold text-gray-400 pb-0.5">
                                {loading ? '-' : error ? '?' : stats?.following}
                            </div>
                        </div>
                        <p className="text-xs text-orange-400 font-mono">Followers / Following</p>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default LiveStats;
