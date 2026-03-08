import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Paths
const CONTENT_DIR = path.join(process.cwd(), 'src', 'content', 'blog');
const OUTPUT_FILE = path.join(process.cwd(), 'src', 'data', 'posts.json');

// Ensure directories exist
if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
}

// Function to calculate read time (approx 200 words per minute)
const calculateReadTime = (text) => {
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min`;
};

// Main generator function
const generateBlogData = () => {
    console.log('🔄 Sourcing Markdown posts...');

    try {
        const files = fs.readdirSync(CONTENT_DIR);
        const mdFiles = files.filter(file => file.endsWith('.md'));

        const posts = mdFiles.map(filename => {
            const filePath = path.join(CONTENT_DIR, filename);
            const fileContent = fs.readFileSync(filePath, 'utf-8');

            // Parse frontmatter and content using gray-matter
            const { data, content } = matter(fileContent);

            return {
                slug: filename.replace('.md', ''),
                title: data.title || 'Untitled Post',
                excerpt: data.excerpt || '',
                content: content,
                tags: data.tags || [],
                publishedAt: data.publishedAt || new Date().toISOString().split('T')[0],
                readTime: data.readTime || calculateReadTime(content),
                status: data.status || 'draft'
            };
        });

        // Sort by date descending
        posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

        // Write to posts.json
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 4));

        console.log(`✅ Successfully generated ${posts.length} posts to src/data/posts.json`);

    } catch (error) {
        console.error('❌ Error generating blog data:', error);
        process.exit(1);
    }
};

generateBlogData();
