import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TextReveal from './TextReveal';

interface BlogPost {
    title: string;
    date: string;
    link: string;
    category: string;
    image?: string; // Optional preview image
}

const posts: BlogPost[] = [
    {
        title: "The Future of Generative AI in Software Engineering",
        date: "2024",
        category: "AI",
        link: "https://www.linkedin.com/",
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop"
    },
    {
        title: "Building Scalable Systems with Next.js",
        date: "2024",
        category: "Development",
        link: "https://www.linkedin.com/",
        image: "https://images.unsplash.com/photo-1618477247222-ac5913054c90?q=80&w=1000&auto=format&fit=crop"
    },
    {
        title: "Mastering TypeScript for Enterprise",
        date: "2023",
        category: "Tech",
        link: "https://www.linkedin.com/",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop"
    }
];

const Blog = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <section id="insights" className="py-32 px-6 md:px-12 bg-off-white relative z-10">
            <div className="max-w-7xl mx-auto">
                <div className="mb-20">
                    <TextReveal el="h2" className="text-4xl md:text-6xl font-bold tracking-tighter uppercase mb-4">
                        Selected Insights
                    </TextReveal>
                    <div className="h-[1px] w-full bg-black/10 mt-8" />
                </div>

                <div className="flex flex-col">
                    {posts.map((post, index) => (
                        <motion.a
                            href={post.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative flex flex-col md:flex-row items-baseline md:items-center justify-between py-12 border-b border-black/10 hover:border-black/30 transition-colors cursor-pointer"
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <div className="md:w-1/4 mb-4 md:mb-0">
                                <span className="text-sm font-medium tracking-widest uppercase text-gray-500 group-hover:text-black transition-colors">
                                    {post.category} — {post.date}
                                </span>
                            </div>

                            <div className="md:w-2/4">
                                <h3 className="text-2xl md:text-4xl font-medium tracking-tight group-hover:translate-x-4 transition-transform duration-500 ease-out">
                                    {post.title}
                                </h3>
                            </div>

                            <div className="md:w-1/4 flex justify-end">
                                <span className="text-sm font-medium uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    Read Article
                                </span>
                            </div>

                            {/* Floating Image Preview */}
                            <motion.div
                                className="absolute hidden md:block w-[300px] h-[200px] bg-gray-200 rounded-lg overflow-hidden pointer-events-none z-20 left-1/2 -top-1/2"
                                style={{
                                    x: "-50%",
                                    y: "-10%",
                                }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{
                                    opacity: hoveredIndex === index ? 1 : 0,
                                    scale: hoveredIndex === index ? 1 : 0.8,
                                    rotate: hoveredIndex === index ? Math.random() * 10 - 5 : 0 // Random slight rotation
                                }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                            >
                                {post.image && (
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                )}
                            </motion.div>
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Blog;
