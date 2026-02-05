/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './index.html',
        './*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './pages/**/*.{js,ts,jsx,tsx}',
        './hooks/**/*.{js,ts,jsx,tsx}',
        './routes/**/*.{js,ts,jsx,tsx}'
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                background: '#0a0a0a',
                'off-white': '#f9f9f9',
                'primary-text': '#111111',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            letterSpacing: {
                tightest: '-0.02em',
            },
        },
    },
    plugins: [],
};
