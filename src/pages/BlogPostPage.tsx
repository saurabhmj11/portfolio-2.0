import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { ArrowLeft, Clock, Calendar, ArrowUp } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';

import postsData from '../data/posts.json';
import Seo from '../components/Seo';
import ScrambleText from '../components/ScrambleText';

interface PostData {
    slug: string;
    title: string;
    publishedAt: string;
    readTime?: string;
    tags?: string[];
    excerpt?: string;
    content?: string;
    status: string;
}

// Reading progress bar at the top
const ReadingProgress = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
    return (
        <motion.div
            style={{ scaleX, transformOrigin: 'left' }}
            className="fixed top-0 left-0 right-0 h-[2px] bg-white z-[200] pointer-events-none"
        />
    );
};

// Scroll to top button
const ScrollToTop = () => {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 600);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    return (
        <motion.button
            initial={false}
            animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 16 }}
            transition={{ duration: 0.3 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full border border-white/20 bg-black/80 backdrop-blur flex items-center justify-center hover:border-white/50 transition-colors"
            aria-label="Scroll to top"
        >
            <ArrowUp className="w-4 h-4 text-white" />
        </motion.button>
    );
};

const BlogPostPage = () => {
    const { slug } = useParams();
    const articleRef = useRef<HTMLDivElement>(null);

    const post = (postsData as PostData[]).find(p => p.slug === slug);

    if (!post) {
        return (
            <div className="min-h-screen bg-[#020202] text-white flex items-center justify-center">
                <div className="text-center">
                    <p className="font-mono text-white/30 text-xs uppercase tracking-widest mb-4">404</p>
                    <h1 className="font-display font-black text-5xl uppercase tracking-tighter mb-8">Post not found</h1>
                    <Link to="/blog" className="font-mono text-xs text-white/50 hover:text-white uppercase tracking-widest transition-colors">
                        ← Back to log
                    </Link>
                </div>
            </div>
        );
    }

    const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="min-h-screen bg-[#020202] text-white">
            <ReadingProgress />
            <ScrollToTop />

            <Seo
                title={`${post.title} — Research Log`}
                description={post.excerpt || ''}
                keywords={post.tags?.join(', ')}
                type="article"
            />

            {/* ── HERO HEADER ── */}
            <header className="relative pt-28 pb-0 overflow-hidden border-b border-white/10">

                {/* Subtle grid */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-[0.025]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                        backgroundSize: '80px 80px',
                    }}
                />

                <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10">

                    {/* Back link */}
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-12"
                    >
                        <Link
                            to="/blog"
                            className="inline-flex items-center gap-2 font-mono text-xs text-white/30 hover:text-white uppercase tracking-widest transition-colors group"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                            Research Log
                        </Link>
                    </motion.div>

                    {/* Meta row */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex flex-wrap items-center gap-4 mb-8"
                    >
                        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-white/30 uppercase tracking-widest">
                            <Calendar className="w-3 h-3" />
                            {formattedDate}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-white/30 uppercase tracking-widest">
                            <Clock className="w-3 h-3" />
                            {post.readTime || '5 min'} read
                        </span>
                        <div className="flex flex-wrap gap-2 ml-auto">
                            {post.tags?.map(tag => (
                                <span key={tag} className="font-mono text-[9px] text-white/40 border border-white/10 px-3 py-1 uppercase tracking-widest">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </motion.div>

                    {/* Title */}
                    <div className="overflow-hidden mb-10">
                        <motion.h1
                            initial={{ y: '110%' }}
                            animate={{ y: 0 }}
                            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                            className="font-display font-black tracking-tighter leading-[0.88] text-white uppercase"
                            style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)' }}
                        >
                            {post.title}
                        </motion.h1>
                    </div>

                    {/* Excerpt / lede */}
                    {post.excerpt && (
                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-white/40 text-lg md:text-xl font-light leading-relaxed border-l-2 border-white/15 pl-6 mb-12 max-w-2xl"
                        >
                            {post.excerpt}
                        </motion.p>
                    )}

                    {/* Separator line animation */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        style={{ transformOrigin: 'left' }}
                        className="h-px w-full bg-white/10 mb-0"
                    />
                </div>
            </header>

            {/* ── ARTICLE BODY ── */}
            <motion.div
                ref={articleRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="max-w-3xl mx-auto px-6 md:px-12 py-16 md:py-24"
            >
                <div className="
                    prose prose-invert max-w-none
                    prose-p:text-white/65 prose-p:leading-[1.85] prose-p:text-[1.05rem] prose-p:font-light
                    prose-headings:font-display prose-headings:font-black prose-headings:tracking-tight prose-headings:text-white prose-headings:uppercase
                    prose-h1:text-5xl prose-h1:leading-[0.9]
                    prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:border-t prose-h2:border-white/10 prose-h2:pt-8
                    prose-h3:text-xl prose-h3:mt-10
                    prose-strong:text-white prose-strong:font-bold
                    prose-em:text-white/80 prose-em:not-italic prose-em:font-medium
                    prose-a:text-white prose-a:underline prose-a:decoration-white/30 prose-a:underline-offset-4 hover:prose-a:decoration-white/80
                    prose-code:text-emerald-400 prose-code:font-mono prose-code:text-[0.88em] prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-sm prose-code:before:content-none prose-code:after:content-none
                    prose-pre:bg-[#0d0d0d] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl prose-pre:shadow-2xl
                    prose-blockquote:border-l-2 prose-blockquote:border-white/20 prose-blockquote:pl-6 prose-blockquote:text-white/50 prose-blockquote:italic prose-blockquote:not-italic prose-blockquote:font-light
                    prose-ul:text-white/60 prose-ol:text-white/60
                    prose-li:marker:text-white/30
                    prose-hr:border-white/10
                    prose-img:rounded-xl prose-img:border prose-img:border-white/10
                ">
                    <Markdown rehypePlugins={[rehypeHighlight]}>
                        {post.content}
                    </Markdown>
                </div>
            </motion.div>

            {/* ── FOOTER NAV ── */}
            <div className="border-t border-white/10 py-12 px-6 md:px-12 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                <Link
                    to="/blog"
                    className="inline-flex items-center gap-2 font-mono text-xs text-white/30 hover:text-white uppercase tracking-widest transition-colors group"
                >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    Back to Research Log
                </Link>
                <p className="font-mono text-[10px] text-white/15 uppercase tracking-widest">
                    <ScrambleText text="End of article" />
                </p>
            </div>
        </div>
    );
};

export default BlogPostPage;
