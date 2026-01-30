import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: '#1a1a1a',
        background: '#000000',
        foreground: '#ffffff',
        'background-secondary': '#0a0a0a',
        'card-bg': '#111111',
        'accent-green': '#a4fc3c',
        'accent-green-dim': '#6b9b2f',
        'text-secondary': '#a1a1a1',
        'text-tertiary': '#737373',
        'status-in-progress': '#a4fc3c',
        'status-done': '#4ade80',
        'status-todo': '#737373',
      },
      fontFamily: {
        sans: ['Inter Tight', 'sans-serif'],
        serif: ['Libre Baskerville', 'serif'],
      },
      borderRadius: {
        lg: '12px',
        md: '8px',
        sm: '4px',
      },
    },
  },
  plugins: [],
};

export default config;