import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import TextReveal from '../components/TextReveal';

import postsData from '../data/posts.json';

import Seo from '../components/Seo';

const BlogPage = () => {
    // Static filter for published posts
    // @ts-ignore - Importing json directly
    const posts = postsData.filter((p: any) => p.status === 'published');
    // const [loading, setLoading] = useState(true); // No longer needed


    return (
        <div className="min-h-screen pt-32 pb-20 px-6 md:px-12 max-w-5xl mx-auto">
            <Seo
                title="Research Log - Saurabh Lokhande"
                description="Internal engineering notes, architectural decisions, and failure postmortems on AI and Software Engineering."
                keywords="AI Blog, Software Engineering, Research Log, Saurabh Lokhande"
            />
            <div className="mb-16 border-b border-black/10 pb-8">
                <TextReveal el="h1" className="text-5xl md:text-7xl font-bold tracking-tighter uppercase mb-4">
                    Research Log
                </TextReveal>
                <p className="text-gray-500 text-lg md:text-xl max-w-2xl mt-4 font-light">
                    Internal engineering notes, architectural decisions, and failure postmortems.
                </p>
            </div>

            <div className="space-y-12">
                {posts.map((post, index) => (
                    <motion.div
                        key={post.slug}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link to={`/blog/${post.slug}`} className="group block">
                            <div className="flex flex-col md:flex-row md:items-baseline gap-4 mb-2">
                                <span className="text-sm font-mono text-gray-400 min-w-[120px]">
                                    {post.publishedAt}
                                </span>
                                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight group-hover:underline decoration-1 underline-offset-4 transition-all">
                                    {post.title}
                                </h2>
                            </div>

                            <div className="md:ml-[136px]">
                                <p className="text-gray-600 text-lg mb-4 leading-relaxed max-w-2xl">
                                    {post.excerpt}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {post.tags?.map(tag => (
                                        <span key={tag} className="text-xs font-bold uppercase tracking-wider border border-black/10 px-2 py-1 rounded-sm text-gray-500">
                                            {tag}
                                        </span>
                                    ))}
                                    <span className="text-xs text-gray-400 py-1 ml-2">
                                        {post.readTime} read
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}

                {posts.length === 0 && (
                    <div className="text-gray-400 italic">No public posts found.</div>
                )}
            </div>
        </div>
    );
};

export default BlogPage;
