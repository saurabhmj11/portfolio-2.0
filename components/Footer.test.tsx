import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Footer from './Footer';
import { BrowserRouter } from 'react-router-dom';

// Mock dependencies
vi.mock('./ScrollReveal', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

// Mock the 3D component since we don't need to test Three.js rendering here
vi.mock('./Robot3D', () => ({
    default: () => <div data-testid="robot-3d">Robot3D Mock</div>
}));

// Mock framer-motion to avoid complex animation handling in tests
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, ...props }: any) => <div className={className} {...props}>{children}</div>,
        header: ({ children, className, ...props }: any) => <header className={className} {...props}>{children}</header>,
        a: ({ children, className, href, ...props }: any) => <a href={href} className={className} {...props}>{children}</a>
    }
}));

describe('Footer Component', () => {
    const renderFooter = () => {
        return render(
            <BrowserRouter>
                <Footer />
            </BrowserRouter>
        );
    };

    it('renders without crashing', () => {
        renderFooter();
        expect(screen.getByText(/© 2025 Saurabh Lokhande/i)).toBeInTheDocument();
    });

    it('renders the GitHub link', () => {
        renderFooter();
        const githubLink = screen.getByText('GITHUB').closest('a');
        expect(githubLink).toBeInTheDocument();
        expect(githubLink).toHaveAttribute('href', 'https://github.com/saurabhmj11');
    });

    it('renders the LinkedIn link', () => {
        renderFooter();
        const linkedinLink = screen.getByText('LINKEDIN').closest('a');
        expect(linkedinLink).toBeInTheDocument();
        expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/saurabhsl/');
    });

    it('renders the Resume link', () => {
        renderFooter();
        const resumeLink = screen.getByText('RESUME').closest('a');
        expect(resumeLink).toBeInTheDocument();
        // Since it's a React Router Link, checking the href might be tricky directly depending on how it's mocked, 
        // but checking presence is good. 
        expect(resumeLink).toHaveAttribute('href', '/resume');
    });
});
