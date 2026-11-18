import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { HelmetProvider, type HelmetServerState } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import Seo from '../Seo';

// Collect tags into the context (server mode) instead of writing to document.head.
HelmetProvider.canUseDOM = false;

function titleFor(props: React.ComponentProps<typeof Seo>, path = '/') {
    const ctx: { helmet?: HelmetServerState } = {};
    render(
        <HelmetProvider context={ctx}>
            <MemoryRouter initialEntries={[path]}>
                <Seo {...props} />
            </MemoryRouter>
        </HelmetProvider>,
    );
    return ctx.helmet!;
}

describe('Seo', () => {
    it('never repeats the name in the title', () => {
        const count = (s: string) => s.split('Saurabh Lokhande').length - 1;
        expect(count(titleFor({}).title.toString())).toBe(1);
        expect(count(titleFor({ title: 'Research Log — Saurabh Lokhande' }).title.toString())).toBe(1);
        expect(titleFor({ title: 'Doc AI — Case Study' }).title.toString()).toContain('Doc AI — Case Study — Saurabh Lokhande');
    });

    it('defaults the canonical to the current path and supports noindex', () => {
        const h = titleFor({ noindex: true }, '/blog/');
        expect(h.link.toString()).toContain('href="https://saurabh-a-lokhande.netlify.app/blog"');
        expect(h.meta.toString()).toContain('noindex');
    });
});
