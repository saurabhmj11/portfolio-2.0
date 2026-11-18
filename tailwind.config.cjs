/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}'
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Accessible muted greys: every page renders on near-black (#020202–#111),
                // where Tailwind's default gray-500/600 fail WCAG AA (4.2:1 / 2.7:1).
                // These measure ≥ 5.9:1 and ≥ 4.9:1 on all of those backgrounds.
                gray: {
                    500: '#8b919c',
                    600: '#7c828d',
                },
                background: '#030305',
                'off-white': '#f9f9f9',
                'primary-text': '#111111',
                neon: {
                    blue: '#4ade80',
                    purple: '#a855f7',
                    pink: '#ec4899',
                    cyan: '#06b6d4',
                },
                glass: {
                    100: 'rgba(255, 255, 255, 0.1)',
                    200: 'rgba(255, 255, 255, 0.2)',
                }
            },
            fontFamily: {
                sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
                display: ['"Outfit Variable"', 'Outfit', 'system-ui', 'sans-serif'],
                // A real mono, so the many mono labels look the same on every OS.
                mono: ['"JetBrains Mono Variable"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
            },
            letterSpacing: {
                tightest: '-0.02em',
            },
            animation: {
                'spin-slow': 'spin 8s linear infinite',
                'float': 'float 6s ease-in-out infinite',
                'gradient-x': 'gradient-x 15s ease infinite',
                'pulse-glow': 'pulse-glow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'shine': 'shine 1.5s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'gradient-x': {
                    '0%, 100%': {
                        'background-size': '200% 200%',
                        'background-position': 'left center'
                    },
                    '50%': {
                        'background-size': '200% 200%',
                        'background-position': 'right center'
                    },
                },
                'pulse-glow': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '.5' },
                },
                shine: {
                    '100%': { left: '125%' }
                }
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #2a8af6 0deg, #a853ba 180deg, #e92a67 360deg)',
            },
        },
    },
    plugins: [],
};
