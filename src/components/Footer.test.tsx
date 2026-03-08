import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Footer from './Footer';
import { BrowserRouter } from 'react-router-dom';

// Mock dependencies
vi.mock('./ScrollReveal', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

// Mock Magnetic to pass-through children and avoid framer-motion props on DOM
vi.mock('./Magnetic', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="magnetic-mock">{children}</div>
}));

// Mock framer-motion to avoid complex animation handling in tests
vi.mock('framer-motion', () => ({
    motion: {
        div: React.forwardRef(({ children, className, style, whileHover, whileTap, ...props }: any, ref: any) =>
            <div ref={ref} className={className} style={style} {...props}>{children}</div>
        ),
        span: ({ children, className, ...props }: any) =>
            <span className={className} {...props}>{children}</span>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('Footer Component', () => {

    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    const renderFooter = () => {
        return render(
            <BrowserRouter>
                <Footer />
            </BrowserRouter>
        );
    };

    it('renders the marquee text', () => {
        renderFooter();
        expect(screen.getAllByText(/SAURABH LOKHANDE/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/AI\/ML ENGINEER/i).length).toBeGreaterThan(0);
    });

    it('renders the GitHub link', () => {
        renderFooter();
        const githubLink = screen.getByText('GitHub').closest('a');
        expect(githubLink).toBeInTheDocument();
        expect(githubLink).toHaveAttribute('href', 'https://github.com/saurabhmj11');
    });

    it('renders the LinkedIn link', () => {
        renderFooter();
        const linkedinLink = screen.getByText('LinkedIn').closest('a');
        expect(linkedinLink).toBeInTheDocument();
        expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/saurabhsl/');
    });

    it('renders the Resume link', () => {
        renderFooter();
        const resumeLink = screen.getByText('Resume').closest('a');
        expect(resumeLink).toBeInTheDocument();
        expect(resumeLink).toHaveAttribute('href', '/resume');
    });

    it('renders system status bar with location and version', async () => {
        // Mock fetch for location using spyOn
        const spy = vi.spyOn(globalThis, 'fetch').mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ city: 'NEW YORK', region_code: 'NY' }),
            } as Response)
        );

        renderFooter();

        // Should wait for the dynamic text to appear
        const locElement = await screen.findByText(/NEW YORK, NY/i);
        expect(locElement).toBeInTheDocument();
        expect(screen.getByText(/V_2026\.1/i)).toBeInTheDocument();
        expect(screen.getByText(/DEPLOYMENT READY/i)).toBeInTheDocument();

        spy.mockRestore();
    });

    it('renders the live clock element', () => {
        renderFooter();
        expect(screen.getByTestId('live-clock')).toBeInTheDocument();
    });
});
