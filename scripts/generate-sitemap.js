import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '../src/data/posts.json');
const PUBLIC_DIR = path.join(__dirname, '../public');
const BASE_URL = 'https://saurabh-anil-lokhande.netlify.app';

const generateSitemap = () => {
  // Read posts
  let posts = [];
  if (fs.existsSync(DATA_FILE)) {
    posts = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  }

  const today = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Routes -->
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
`;

  // Dynamic Blog Routes
  posts.filter(p => p.status === 'published').forEach(post => {
    xml += `  <url>
    <loc>${BASE_URL}/blog/${post.slug}</loc>
    <lastmod>${post.publishedAt || today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
  });

  xml += `</urlset>`;

  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), xml);
  console.log(`✅ Sitemap generated with ${posts.length} posts at public/sitemap.xml`);
};

generateSitemap();
