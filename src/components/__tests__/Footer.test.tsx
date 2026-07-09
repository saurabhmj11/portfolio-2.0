import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Footer from '../Footer';
import { BrowserRouter } from 'react-router-dom';

// Mock dependencies — paths are relative to the component under test (Footer.tsx)
vi.mock('../ScrollReveal', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

// Mock Magnetic to pass-through children and avoid framer-motion props on DOM
vi.mock('../Magnetic', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="magnetic-mock">{children}</div>
}));

// Mock framer-motion to avoid complex animation handling in tests
type MotionDivProps = {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    whileHover?: unknown;
    whileTap?: unknown;
    [key: string]: unknown;
};
type MotionSpanProps = { children?: React.ReactNode; className?: string; [key: string]: unknown };
type AnimatePresenceProps = { children?: React.ReactNode };

vi.mock('framer-motion', () => ({
    motion: {
        div: React.forwardRef(({ children, className, style, whileHover: _wh, whileTap: _wt, ...props }: MotionDivProps, ref: React.Ref<HTMLDivElement>) => {
            void _wh; void _wt;
            return <div ref={ref} className={className} style={style} {...props}>{children}</div>;
        }),
        span: ({ children, className, ...props }: MotionSpanProps) =>
            <span className={className} {...props}>{children}</span>,
    },
    AnimatePresence: ({ children }: AnimatePresenceProps) => <>{children}</>,
}));

describe('Footer Component', () => {

    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
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
        // Use real timers for this test so Promises resolve normally
        vi.useRealTimers();

        const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ city: 'NEW YORK', region_code: 'NY' }),
        } as Response);

        renderFooter();

        // Wait for the async fetch to resolve and state to update
        await waitFor(() => {
            expect(screen.getByText(/NEW YORK, NY/i)).toBeInTheDocument();
        }, { timeout: 5000 });

        expect(screen.getByText(/V_2026\.1/i)).toBeInTheDocument();
        expect(screen.getByText(/DEPLOYMENT READY/i)).toBeInTheDocument();

        spy.mockRestore();
    });

    it('renders the live clock element', () => {
        renderFooter();
        expect(screen.getByTestId('live-clock')).toBeInTheDocument();
    });
});
