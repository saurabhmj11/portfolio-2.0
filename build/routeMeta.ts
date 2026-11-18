/**
 * Build step: per-route HTML + sitemap.
 *
 * The app renders client-side, so link unfurlers (LinkedIn, Slack, X, iMessage)
 * and non-JS crawlers only ever see index.html. After the bundle is written,
 * this copies dist/index.html to dist/<route>/index.html for every real route,
 * with that route's <title>, description, canonical, Open Graph and Twitter
 * tags baked in, then generates sitemap.xml from the same route list.
 * Netlify serves these files before the SPA fallback.
 */
import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';
import projectsData from '../src/data/projectsData';
import posts from '../src/data/posts.json';

export const SITE = 'https://saurabh-a-lokhande.netlify.app';
const NAME = 'Saurabh Lokhande';

interface RouteMeta { path: string; title: string; description: string; type: 'website' | 'article'; lastmod?: string }

type Post = { slug: string; title: string; excerpt?: string; publishedAt?: string; status?: string };

export function routes(): RouteMeta[] {
    const published = (posts as Post[]).filter(p => !p.status || p.status === 'published');
    return [
        { path: '/', title: `${NAME} — AI Engineer & Generative AI Specialist`, description: 'AI engineer building retrieval and agent systems since 2022. Case studies with measured evaluations, live demos and source code.', type: 'website' },
        { path: '/resume', title: `Résumé — ${NAME}`, description: `Résumé of ${NAME}, AI engineer: Gen AI / LLM Engineer at OneOfficeAutomation, RAG and multi-agent systems.`, type: 'website' },
        { path: '/blog', title: `Research Log — ${NAME}`, description: 'Engineering notes on retrieval, agents and production AI.', type: 'website' },
        ...projectsData.map(p => ({
            path: `/project/${p.id}`,
            title: `${p.title} — Case Study — ${NAME}`,
            description: p.description,
            type: 'article' as const,
        })),
        ...published.map(p => ({
            path: `/blog/${p.slug}`,
            title: `${p.title} — ${NAME}`,
            description: p.excerpt ?? '',
            type: 'article' as const,
            lastmod: p.publishedAt,
        })),
    ];
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Replace the content="" of a meta tag identified by an attribute (multi-line safe). */
function setMeta(html: string, attr: 'name' | 'property', key: string, value: string): string {
    // Keys only contain [a-z:], which need no escaping in a RegExp.
    const re = new RegExp(String.raw`(<meta\s+${attr}="${key}"\s+content=")[^"]*(")`);
    if (!re.test(html)) throw new Error(`route-meta: <meta ${attr}="${key}"> not found in index.html`);
    return html.replace(re, (_m, a: string, b: string) => a + esc(value) + b);
}

export function renderRouteHtml(template: string, r: RouteMeta): string {
    const url = r.path === '/' ? `${SITE}/` : `${SITE}${r.path}`;
    let html = template.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${esc(r.title)}</title>`);
    html = setMeta(html, 'name', 'description', r.description);
    html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, (_m, a: string, b: string) => a + url + b);
    html = setMeta(html, 'property', 'og:type', r.type);
    html = setMeta(html, 'property', 'og:url', url);
    html = setMeta(html, 'property', 'og:title', r.title);
    html = setMeta(html, 'property', 'og:description', r.description);
    html = setMeta(html, 'property', 'og:image:alt', r.title);
    html = setMeta(html, 'name', 'twitter:title', r.title);
    html = setMeta(html, 'name', 'twitter:description', r.description);
    return html;
}

export function sitemapXml(rs: RouteMeta[], today: string): string {
    const urls = rs.map(r => `  <url>\n    <loc>${r.path === '/' ? `${SITE}/` : SITE + r.path}</loc>\n    <lastmod>${r.lastmod ?? today}</lastmod>\n  </url>`);
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}

export default function routeMeta(): Plugin {
    let outDir = 'dist';
    return {
        name: 'route-meta',
        apply: 'build',
        configResolved(config) { outDir = path.resolve(config.root, config.build.outDir); },
        closeBundle() {
            const templatePath = path.join(outDir, 'index.html');
            if (!fs.existsSync(templatePath)) return;
            const template = fs.readFileSync(templatePath, 'utf8');
            const rs = routes();
            for (const r of rs) {
                const html = renderRouteHtml(template, r);
                const file = r.path === '/' ? templatePath : path.join(outDir, r.path, 'index.html');
                fs.mkdirSync(path.dirname(file), { recursive: true });
                fs.writeFileSync(file, html);
            }
            fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemapXml(rs, new Date().toISOString().slice(0, 10)));
            this.info?.(`route-meta: wrote ${rs.length} route pages + sitemap.xml`);
        },
    };
}
