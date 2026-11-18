import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { routes, renderRouteHtml, sitemapXml, SITE } from '../routeMeta';
import projectsData from '../../src/data/projectsData';

const template = fs.readFileSync(path.resolve(__dirname, '../../index.html'), 'utf8');

describe('route-meta build step', () => {
    it('covers home, résumé, blog and every case study', () => {
        const paths = routes().map(r => r.path);
        expect(paths).toEqual(expect.arrayContaining(['/', '/resume', '/blog', ...projectsData.map(p => `/project/${p.id}`)]));
        expect(new Set(paths).size).toBe(paths.length);
    });

    it('bakes route-specific, escaped tags into the HTML', () => {
        const r = routes().find(x => x.path === '/project/doc-ai')!;
        const html = renderRouteHtml(template, r);
        expect(html).toContain(`<link rel="canonical" href="${SITE}/project/doc-ai"`);
        expect(html).toContain(`content="${SITE}/project/doc-ai"`);
        expect(html).toContain('<title>Doc AI — Case Study — Saurabh Lokhande</title>');
        expect(html).toMatch(/property="og:type" content="article"/);
        // only one canonical, and no homepage canonical left behind
        expect(html.match(/rel="canonical"/g)).toHaveLength(1);
        expect(renderRouteHtml(template, { path: '/x', title: 'a "b" <c> & d', description: 'e', type: 'website' }))
            .toContain('<title>a &quot;b&quot; &lt;c&gt; &amp; d</title>');
        // replacement patterns in content must be literal, not interpreted
        const tricky = renderRouteHtml(template, { path: '/y', title: 't', description: "costs $1 $& $' $`", type: 'website' });
        expect(tricky).toContain("content=\"costs $1 $&amp; $' $`\"");
    });

    it('writes a valid sitemap with one <url> per route', () => {
        const xml = sitemapXml(routes(), '2026-01-01');
        expect(xml.match(/<url>/g)).toHaveLength(routes().length);
        expect(xml).toContain(`<loc>${SITE}/project/doc-ai</loc>`);
        expect(xml).not.toContain('changefreq');
    });
});
