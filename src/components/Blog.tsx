import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import ScrambleText from './ScrambleText';

import postsData from '../data/posts.json';

interface PostData {
    status: string;
    title: string;
    publishedAt: string;
    tags?: string[];
    slug: string;
    readTime?: string;
    excerpt?: string;
}

const Blog = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const inView = useInView(headerRef, { once: true });

    const posts = (postsData as PostData[])
        .filter(p => p.status === 'published')
        .slice(0, 3)
        .map((p, i) => ({
            title: p.title,
            date: new Date(p.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            category: p.tags?.[0] || 'Research',
            excerpt: p.excerpt || '',
            link: `/blog/${p.slug}`,
            readTime: p.readTime || `${5 + i * 2} min`,
            index: i,
        }));

    return (
        <section id="insights" className="bg-[#020202] text-white relative z-10 overflow-hidden">

            {/* Top border accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">

                {/* ── Cinematic Header ── */}
                <div ref={headerRef} className="pt-28 pb-0">

                    {/* Eyebrow */}
                    <motion.p
                        initial={{ opacity: 0, x: -10 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5 }}
                        className="font-mono text-xs text-white/25 uppercase tracking-[0.5em] mb-8"
                    >
                        // Thought Leadership
                    </motion.p>

                    {/* Full-bleed oversized title */}
                    <div className="relative overflow-hidden mb-0">
                        <motion.h2
                            initial={{ y: '110%' }}
                            animate={inView ? { y: 0 } : {}}
                            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                            className="font-display font-black uppercase tracking-tighter leading-[0.82] text-white"
                            style={{ fontSize: 'clamp(4rem, 13vw, 12rem)' }}
                        >
                            Selected{' '}
                            <em className="not-italic text-white/15">
                                <ScrambleText text="Insights" />
                            </em>
                        </motion.h2>
                    </div>

                    {/* Divider + sub-copy row */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.7, delay: 0.5 }}
                        className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-t border-white/10 pt-6 mt-8 pb-16"
                    >
                        <p className="text-white/35 text-base md:text-lg font-light max-w-lg leading-relaxed">
                            Notes on building AI systems — architecture trade-offs, production insights, and failure postmortems.
                        </p>
                        <a
                            href="/blog"
                            className="self-start md:self-auto inline-flex items-center gap-2 border border-white/15 px-6 py-3 font-mono text-xs text-white/50 hover:text-white hover:border-white/40 uppercase tracking-widest transition-all group"
                        >
                            <ScrambleText text="All Articles" />
                            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </a>
                    </motion.div>
                </div>

                {/* ── Featured Post Cards (Asymmetric) ── */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-28">

                    {/* Hero card - spans 7 cols */}
                    {posts[0] && (
                        <motion.a
                            href={posts[0].link}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                            onMouseEnter={() => setHoveredIndex(0)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className={`group md:col-span-7 relative border border-white/8 bg-white/[0.02] overflow-hidden min-h-[380px] flex flex-col justify-between p-8 md:p-10 transition-all duration-500 ${hoveredIndex !== null && hoveredIndex !== 0 ? 'opacity-40' : 'opacity-100'}`}
                        >
                            {/* Active border */}
                            <motion.div className="absolute inset-0 border border-white/20 pointer-events-none" animate={{ opacity: hoveredIndex === 0 ? 1 : 0 }} />

                            <div className="flex justify-between items-start">
                                <div className="flex flex-col gap-1">
                                    <span className="font-mono text-[9px] text-white/30 uppercase tracking-[0.3em]">{posts[0].category}</span>
                                    <span className="font-mono text-[9px] text-white/20 tracking-widest">{posts[0].date}</span>
                                </div>
                                <motion.div
                                    animate={{ x: hoveredIndex === 0 ? 0 : -4, opacity: hoveredIndex === 0 ? 1 : 0.3 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                >
                                    <ArrowUpRight className="w-5 h-5 text-white" />
                                </motion.div>
                            </div>

                            <div>
                                <span className="text-[10px] font-mono text-white/20 tracking-widest mb-4 block">01</span>
                                <h3 className="font-display font-black text-3xl md:text-5xl tracking-tighter leading-[0.9] text-white uppercase mb-4">
                                    {posts[0].title}
                                </h3>
                                {posts[0].excerpt && (
                                    <p className="text-white/40 text-sm leading-relaxed font-light max-w-md">{posts[0].excerpt}</p>
                                )}
                                <div className="flex items-center gap-3 mt-6">
                                    <span className="font-mono text-[9px] text-white/25 uppercase tracking-widest border border-white/10 px-3 py-1">{posts[0].readTime} read</span>
                                </div>
                            </div>

                            {/* Hover gradient sweep */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"
                                animate={{ opacity: hoveredIndex === 0 ? 1 : 0 }}
                                transition={{ duration: 0.4 }}
                            />
                        </motion.a>
                    )}

                    {/* Two stacked side cards - spans 5 cols */}
                    <div className="md:col-span-5 flex flex-col gap-4">
                        {posts.slice(1).map((post, i) => (
                            <motion.a
                                key={post.link}
                                href={post.link}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: (i + 1) * 0.1, ease: [0.22, 1, 0.36, 1] }}
                                onMouseEnter={() => setHoveredIndex(i + 1)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                className={`group relative border border-white/8 bg-white/[0.02] overflow-hidden flex flex-col justify-between p-7 min-h-[175px] transition-all duration-500 ${hoveredIndex !== null && hoveredIndex !== i + 1 ? 'opacity-40' : 'opacity-100'}`}
                            >
                                {/* Active border */}
                                <motion.div className="absolute inset-0 border border-white/20 pointer-events-none" animate={{ opacity: hoveredIndex === i + 1 ? 1 : 0 }} />

                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="font-mono text-[9px] text-white/30 uppercase tracking-[0.3em]">{post.category}</span>
                                        <span className="font-mono text-[9px] text-white/20 tracking-widest">{post.date}</span>
                                    </div>
                                    <motion.div
                                        animate={{ x: hoveredIndex === i + 1 ? 0 : -4, opacity: hoveredIndex === i + 1 ? 1 : 0.3 }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                    >
                                        <ArrowUpRight className="w-4 h-4 text-white" />
                                    </motion.div>
                                </div>

                                <div>
                                    <span className="text-[10px] font-mono text-white/20 tracking-widest mb-2 block">0{i + 2}</span>
                                    <h3 className="font-display font-bold text-xl md:text-2xl tracking-tight text-white leading-tight">
                                        {post.title}
                                    </h3>
                                </div>

                                {/* Hover gradient */}
                                <motion.div
                                    className="absolute inset-0 bg-white/[0.03] pointer-events-none"
                                    animate={{ opacity: hoveredIndex === i + 1 ? 1 : 0 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </motion.a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Blog;
