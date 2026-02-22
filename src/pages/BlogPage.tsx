import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock, Tag } from 'lucide-react';
import Seo from '../components/Seo';
import ScrambleText from '../components/ScrambleText';

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

// Scrolling marquee
const Marquee = ({ items }: { items: string[] }) => (
    <div className="relative overflow-hidden border-y border-white/8 py-3 select-none">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#020202] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#020202] to-transparent z-10" />
        <motion.div
            className="flex gap-16 whitespace-nowrap"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        >
            {[...items, ...items].map((item, i) => (
                <span key={i} className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em]">
                    ◆ {item}
                </span>
            ))}
        </motion.div>
    </div>
);

const ArticleCard = ({ post, index }: { post: PostData & { num: string }; index: number }) => {
    const [hovered, setHovered] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-50px' });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
            <Link
                to={`/blog/${post.slug}`}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className="group relative flex flex-col md:flex-row md:items-start gap-8 py-10 border-b border-white/8 overflow-hidden"
            >
                {/* Bg flood */}
                <motion.div
                    className="absolute inset-0 bg-white/[0.025] pointer-events-none"
                    animate={{ opacity: hovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                />
                {/* Left accent bar */}
                <motion.div
                    className="absolute left-0 top-0 bottom-0 w-[2px] bg-white pointer-events-none"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: hovered ? 1 : 0 }}
                    style={{ originY: 0 }}
                    transition={{ duration: 0.35 }}
                />

                {/* Left: num + meta */}
                <div className="flex md:flex-col items-start gap-4 md:gap-2 shrink-0 w-full md:w-28 relative z-10">
                    <span className="font-mono text-[10px] text-white/20 tracking-widest">{post.num}</span>
                    <div className="flex flex-wrap gap-2">
                        {post.tags?.slice(0, 1).map(tag => (
                            <span key={tag} className="inline-flex items-center gap-1 font-mono text-[9px] text-white/30 border border-white/10 px-2 py-1 uppercase tracking-widest">
                                <Tag className="w-2.5 h-2.5" />
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Middle: title + excerpt */}
                <div className="flex-1 min-w-0 relative z-10">
                    <motion.h2
                        animate={{ x: hovered ? 8 : 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        className="font-display font-bold text-2xl md:text-4xl tracking-tight text-white leading-tight mb-4"
                    >
                        {post.title}
                    </motion.h2>
                    {post.excerpt && (
                        <motion.p
                            animate={{ opacity: hovered ? 1 : 0.45 }}
                            transition={{ duration: 0.3 }}
                            className="text-white/45 text-sm md:text-base leading-relaxed font-light max-w-2xl"
                        >
                            {post.excerpt}
                        </motion.p>
                    )}
                </div>

                {/* Right: date + readtime + arrow */}
                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-3 shrink-0 relative z-10 -md:pt-0 pt-0">
                    <div className="flex flex-col items-end gap-1">
                        <span className="font-mono text-[9px] text-white/25 tracking-widest">
                            {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="inline-flex items-center gap-1 font-mono text-[9px] text-white/20 tracking-widest">
                            <Clock className="w-2.5 h-2.5" />
                            {post.readTime || '5 min'}
                        </span>
                    </div>
                    <motion.div
                        animate={{ x: hovered ? 0 : -4, y: hovered ? 0 : 4, opacity: hovered ? 1 : 0.3 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center shrink-0"
                    >
                        <ArrowUpRight className="w-4 h-4 text-white" />
                    </motion.div>
                </div>
            </Link>
        </motion.div>
    );
};

const BlogPage = () => {
    const headerRef = useRef<HTMLDivElement>(null);
    const inView = useInView(headerRef, { once: true });

    const posts = (postsData as PostData[])
        .filter(p => p.status === 'published')
        .map((p, i) => ({ ...p, num: String(i + 1).padStart(2, '0') }));

    const tags = Array.from(new Set(posts.flatMap(p => p.tags || [])));
    const marqueeItems = [...tags, 'Engineering', 'Production AI', 'Architecture', 'Research', 'LLMs', 'Systems'];

    return (
        <div className="min-h-screen bg-[#020202] text-white">
            <Seo
                title="Research Log — Saurabh Lokhande"
                description="Internal engineering notes, architectural decisions, and failure postmortems on AI and Software Engineering."
                keywords="AI Blog, Software Engineering, Research Log, Saurabh Lokhande"
            />

            {/* ── HEADER ── */}
            <div ref={headerRef} className="pt-32 pb-0 px-6 md:px-12 max-w-7xl mx-auto">
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5 }}
                    className="font-mono text-xs text-white/25 uppercase tracking-[0.5em] mb-8"
                >
                    // Research Log
                </motion.p>

                <div className="overflow-hidden mb-0">
                    <motion.h1
                        initial={{ y: '110%' }}
                        animate={inView ? { y: 0 } : {}}
                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        className="font-display font-black uppercase tracking-tighter leading-[0.82] text-white"
                        style={{ fontSize: 'clamp(3.5rem, 11vw, 10rem)' }}
                    >
                        All{' '}
                        <em className="not-italic text-white/15">
                            <ScrambleText text="Articles" />
                        </em>
                    </motion.h1>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.7, delay: 0.5 }}
                    className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-t border-white/10 pt-6 mt-8 pb-8"
                >
                    <p className="text-white/35 text-base md:text-lg font-light max-w-xl leading-relaxed">
                        Engineering notes, architectural decisions, and production failures — documented as they happened.
                    </p>
                    <div className="flex items-center gap-3 shrink-0">
                        <span className="font-mono text-3xl font-black text-white">{posts.length}</span>
                        <div className="flex flex-col">
                            <span className="font-mono text-[9px] text-white/30 uppercase tracking-widest">Articles</span>
                            <span className="font-mono text-[9px] text-white/20 uppercase tracking-widest">Published</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Marquee */}
            <Marquee items={marqueeItems} />

            {/* ── ARTICLE LIST ── */}
            <div className="px-6 md:px-12 max-w-7xl mx-auto pb-32 pt-4">
                {posts.length === 0 ? (
                    <div className="py-24 text-center">
                        <p className="font-mono text-white/20 uppercase tracking-widest text-sm">No public posts found.</p>
                    </div>
                ) : (
                    posts.map((post, index) => (
                        <ArticleCard key={post.slug} post={post} index={index} />
                    ))
                )}
            </div>
        </div>
    );
};

export default BlogPage;
