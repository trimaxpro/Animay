/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#0A0A0F',
        surface: '#111118',
        elevated: '#1A1A26',
        'accent-primary': '#7C3AED',
        'accent-glow': '#A78BFA',
        'accent-rose': '#F43F5E',
        'accent-amber': '#F59E0B',
        'text-primary': '#F8F8FF',
        'text-secondary': '#A8A8C0',
        'text-muted': '#52526E',
        'border-subtle': '#1E1E2E',
        'border-glow': 'rgba(124,58,237,0.4)',
      },
      fontFamily: {
        display: ['Oswald', 'Inter', 'sans-serif'],
        body: ['Inter', 'Nunito Sans', 'Lato', 'Roboto', 'sans-serif'],
        mono: ['Ubuntu Mono', 'JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        input: '4px',
        card: '8px',
        modal: '12px',
        hero: '16px',
      },
      boxShadow: {
        glow: '0 0 24px rgba(124,58,237,0.3)',
        'glow-sm': '0 0 12px rgba(124,58,237,0.2)',
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
