/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#191919',
        surface: '#1F1F1F',
        elevated: '#2A2A2A',
        'accent-primary': '#3B82F6',
        'accent-glow': '#60A5FA',
        'accent-rose': '#F43F5E',
        'accent-amber': '#F59E0B',
        'text-primary': '#EBEBEB',
        'text-secondary': '#9B9B9B',
        'text-muted': '#5E5E5E',
        'border-subtle': '#333333',
        'border-glow': 'rgba(59,130,246,0.3)',
      },
      fontFamily: {
        display: ['Oswald', 'Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        input: '4px',
        card: '8px',
        modal: '12px',
        hero: '16px',
      },
      boxShadow: {
        glow: '0 0 24px rgba(59,130,246,0.25)',
        'glow-sm': '0 0 12px rgba(59,130,246,0.15)',
      },
      animation: {
        shimmer: 'shimmer 2s infinite linear',
        'fade-in': 'fadeIn 0.3s ease',
        'slide-up': 'slideUp 0.3s ease',
        'slide-in-right': 'slideInRight 0.3s ease',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
