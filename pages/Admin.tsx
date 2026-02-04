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
        const isNew = !posts.find(p => p.slug === editingPost.slug); // Basic check, slightly flawed if slug changes but ok for now
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
            <div className="min-h-screen pt-32 px-6 max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <div className="gap-4 flex">
                        <button onClick={handleNew} className="bg-black text-white px-4 py-2 rounded">New Post</button>
                        <button onClick={handleLogout} className="bg-gray-200 text-black px-4 py-2 rounded">Logout</button>
                    </div>
                </div>
                <div className="bg-white rounded shadow text-black/80">
                    {posts.map(post => (
                        <div key={post.slug} className="flex items-center justify-between p-4 border-b">
                            <div>
                                <div className="font-bold flex items-center gap-2">
                                    {post.title}
                                    <span className={`text-xs px-2 py-0.5 rounded ${post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {post.status}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-500">{post.slug}</div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(post)} className="text-blue-600 hover:underline">Edit</button>
                                <button onClick={() => handleDelete(post.slug)} className="text-red-600 hover:underline">Delete</button>
                            </div>
                        </div>
                    ))}
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
