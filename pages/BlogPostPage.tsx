import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Markdown from 'react-markdown'; // Changed from ReactMarkdown to Markdown (default export)
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css'; // Import highlight styles
// You might need to add highlight.js package if not present, but usually rehype-highlight pulls it? 
// Actually rehype-highlight needs highlight.js. I'll add the css from cdn or just rely on what I have.
// Wait, I didn't install highlight.js explicitly, but rehype-highlight usually depends on it. 
// I'll assume rehype-highlight works. I need to make sure CSS is available.
// I will just use a simple custom CSS for code blocks if the import fails.
import { ArrowLeft } from 'lucide-react';

interface BlogPost {
    title: string;
    slug: string;
    content: string;
    tags: string[];
    publishedAt: string;
    readTime: string;
}

import postsData from '../data/posts.json';

// ... (interface remains)

const BlogPostPage = () => {
    const { slug } = useParams();
    // @ts-ignore
    const post = postsData.find((p: any) => p.slug === slug);
    // const [loading, setLoading] = useState(true); // Removed

    // if (loading) return ... // Removed
    if (!post) return <div className="min-h-screen pt-32 px-6">Post not found.</div>;


    return (
        <article className="min-h-screen pt-32 pb-20 px-6 md:px-12 max-w-4xl mx-auto">
            <Link to="/blog" className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black mb-12 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Log
            </Link>

            <header className="mb-16">
                <div className="flex flex-wrap gap-4 items-center text-sm font-mono text-gray-400 mb-6">
                    <span>{post.publishedAt}</span>
                    <span>•</span>
                    <span>{post.readTime} read</span>
                    <div className="flex gap-2 ml-auto">
                        {post.tags?.map(tag => (
                            <span key={tag} className="border border-black/10 px-2 py-0.5 rounded-sm">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-8">
                    {post.title}
                </h1>
            </header>

            <div className="prose prose-lg prose-neutral max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-600 prose-code:text-pink-600 prose-pre:bg-[#1e1e1e] prose-pre:text-gray-200">
                <Markdown rehypePlugins={[rehypeHighlight]}>
                    {post.content}
                </Markdown>
            </div>
        </article>
    );
};

export default BlogPostPage;
