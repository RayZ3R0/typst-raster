/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: 'var(--color-primary)',
                    light: 'var(--color-primary-light)',
                    dark: 'var(--color-primary-dark)',
                },
                secondary: {
                    DEFAULT: 'var(--color-secondary)',
                    light: 'var(--color-secondary-light)',
                    dark: 'var(--color-secondary-dark)',
                },
                background: {
                    DEFAULT: 'var(--color-background)',
                    alt: 'var(--color-background-alt)',
                },
                surface: {
                    DEFAULT: 'var(--color-surface)',
                    alt: 'var(--color-surface-alt)',
                },
                text: {
                    DEFAULT: 'var(--color-text)',
                    muted: 'var(--color-text-muted)',
                },
                border: {
                    DEFAULT: 'var(--color-border)',
                    light: 'var(--color-border-light)',
                },
            },
        },
    },
    plugins: [],
}
