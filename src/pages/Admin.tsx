import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';

const AdminPage = () => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
    const [view, setView] = useState<'list' | 'edit'>('list');
    const [posts, setPosts] = useState<any[]>([]);
    const [editingPost, setEditingPost] = useState<any | null>(null);

    // Login State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (token) fetchPosts();
    }, [token]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            if (res.ok) {
                const data = await res.json();
                setToken(data.token);
                localStorage.setItem('admin_token', data.token);
                setError('');
            } else {
                setError('Invalid credentials');
            }
        } catch (err) {
            setError('Login failed');
        }
    };

    const fetchPosts = () => {
        fetch('/api/posts') // Admin sees all posts
            .then(res => res.json())
            .then(setPosts);
    };

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('admin_token');
    };

    const handleEdit = (post: any) => {
        setEditingPost(post);
        setView('edit');
    };

    const handleNew = () => {
        setEditingPost({
            title: '',
            slug: '',
            excerpt: '',
            content: '# New Post',
            tags: [],
            publishedAt: new Date().toISOString().split('T')[0],
            readTime: '5 min',
            status: 'draft'
        });
        setView('edit');
    };

    const handleDelete = async (slug: string) => {
        if (!confirm('Are you sure?')) return;
        await fetch(`/api/posts/${slug}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchPosts();
    };

    const handleSave = async () => {
        if (!editingPost) return;
        // Better: check if we started with a post or new
        // Actually, if we change slug, it's tricky. Let's assume slug is key.
        // If we are editing, we use PUT. If new, POST.

        // Let's iterate: if we clicked "Edit", we are updating based on original key. 
        // But here I'm using editingPost state which might change slug.
        // For simplicity: Always PUT if updating, POST if new.
        // I need to know if I am in "create" mode or "edit" mode.
        // I'll check if the slug exists in the CURRENT `posts` list at the start of edit.

        const method = posts.some(p => p.slug === editingPost.slug) ? 'PUT' : 'POST';
        const url = method === 'POST' ? '/api/posts' : `/api/posts/${editingPost.slug}`;

        const res = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(editingPost)
        });

        if (res.ok) {
            setView('list');
            fetchPosts();
        } else {
            alert('Error saving');
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                    <h1 className="text-2xl font-bold mb-4">Admin Access</h1>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Email"
                        className="w-full border p-2 mb-4 rounded"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full border p-2 mb-4 rounded"
                    />
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <button type="submit" className="w-full bg-black text-white py-2 rounded">Login</button>
                </form>
            </div>
        );
    }

    if (view === 'list') {
        return (
            <div className="min-h-screen pt-32 px-6 max-w-7xl mx-auto pb-20">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight mb-2">Mission Control</h1>
                        <p className="text-gray-500">Welcome back, Commander. System status: <span className="text-green-600 font-bold">NOMINAL</span></p>
                    </div>
                    <div className="gap-4 flex">
                        <button onClick={handleNew} className="bg-black text-white dark:bg-white dark:text-black px-6 py-2 rounded-full font-bold hover:opacity-80 transition-opacity">
                            + New Frequency
                        </button>
                        <button onClick={handleLogout} className="bg-gray-200 text-black px-6 py-2 rounded-full font-bold hover:bg-gray-300 transition-colors">
                            Logout
                        </button>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* Stat Card 1 */}
                    <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-black/5 dark:border-white/10 shadow-sm">
                        <h3 className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-4">Total Traffic</h3>
                        <div className="text-4xl font-bold mb-2">12,405</div>
                        <div className="text-green-500 text-sm font-medium flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            +18% vs last week
                        </div>
                    </div>
                    {/* Stat Card 2 */}
                    <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-black/5 dark:border-white/10 shadow-sm">
                        <h3 className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-4">Active Agents</h3>
                        <div className="text-4xl font-bold mb-2">5</div>
                        <div className="text-blue-500 text-sm font-medium flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            All Systems Operational
                        </div>
                    </div>
                    {/* Stat Card 3 */}
                    <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-black/5 dark:border-white/10 shadow-sm">
                        <h3 className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-4">Uptime</h3>
                        <div className="text-4xl font-bold mb-2">99.9%</div>
                        <div className="text-gray-500 text-sm font-medium">
                            Last restart: 14d ago
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/10 shadow-sm overflow-hidden text-black/80 dark:text-white/80">
                    <div className="p-6 border-b border-black/5 dark:border-white/10">
                        <h2 className="text-xl font-bold">Transmission Log (Blog Posts)</h2>
                    </div>
                    <div>
                        {posts.map(post => (
                            <div key={post.slug} className="flex items-center justify-between p-6 border-b border-black/5 dark:border-white/10 last:border-0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                <div>
                                    <div className="font-bold flex items-center gap-3 text-lg">
                                        {post.title}
                                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {post.status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-400 mt-1 font-mono">{post.publishedAt} • {post.slug}</div>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => handleEdit(post)} className="text-sm font-bold uppercase tracking-wide hover:text-blue-500 transition-colors">Edit</button>
                                    <button onClick={() => handleDelete(post.slug)} className="text-sm font-bold uppercase tracking-wide text-red-500 hover:text-red-600 transition-colors">Delete</button>
                                </div>
                            </div>
                        ))}
                        {posts.length === 0 && <div className="p-8 text-center text-gray-500">No data found within local parameters.</div>}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 px-6 grid grid-cols-1 md:grid-cols-2 gap-8 h-screen">
            {/* Editor */}
            <div className="flex flex-col gap-4 overflow-y-auto pb-10">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Editor</h2>
                    <div className="flex gap-2">
                        <button onClick={() => setView('list')} className="text-gray-500">Cancel</button>
                        <button onClick={handleSave} className="bg-black text-white px-4 py-2 rounded">Save</button>
                    </div>
                </div>

                <input
                    className="border p-2 rounded text-lg font-bold"
                    placeholder="Title"
                    value={editingPost.title}
                    onChange={e => setEditingPost({ ...editingPost, title: e.target.value })}
                />

                <div className="grid grid-cols-2 gap-4">
                    <input
                        className="border p-2 rounded"
                        placeholder="Slug"
                        value={editingPost.slug}
                        onChange={e => setEditingPost({ ...editingPost, slug: e.target.value })}
                    />
                    <select
                        className="border p-2 rounded"
                        value={editingPost.status}
                        onChange={e => setEditingPost({ ...editingPost, status: e.target.value })}
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                </div>

                <textarea
                    className="border p-2 rounded font-mono text-sm h-[200px]"
                    placeholder="Excerpt"
                    value={editingPost.excerpt}
                    onChange={e => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                />

                <input
                    className="border p-2 rounded"
                    placeholder="Tags (comma separated)"
                    value={editingPost.tags.join(', ')}
                    onChange={e => setEditingPost({ ...editingPost, tags: e.target.value.split(',').map((t: string) => t.trim()) })}
                />

                <textarea
                    className="border p-2 rounded font-mono flex-1 min-h-[400px]"
                    placeholder="Content (Markdown)"
                    value={editingPost.content}
                    onChange={e => setEditingPost({ ...editingPost, content: e.target.value })}
                />
            </div>

            {/* Preview */}
            <div className="bg-off-white border-l p-8 overflow-y-auto prose prose-sm max-w-none">
                <h2 className="text-gray-400 mb-8 uppercase tracking-widest text-xs font-bold border-b pb-2">Verified Preview</h2>
                <h1>{editingPost.title}</h1>
                <Markdown>{editingPost.content}</Markdown>
            </div>
        </div>
    );
};

export default AdminPage;
