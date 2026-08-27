/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      colors: {
        // ── Dunas Travel Brand Palette ──────────────────────────
        primary: {
          50: '#EEF2FF',
          100: '#DBEAFE',
          300: '#6B8FD4',
          500: '#1E3A8A',   // Primary Blue — header, navbar, buttons, footer
          700: '#152B6B',
          900: '#0C1C48',
        },
        gold: {
          50: '#FEF8EC',
          100: '#FDE9BC',
          300: '#F9C76B',
          500: '#F5A623',   // Accent Gold — highlights, hover, icons, CTAs
          600: '#8A5C00',   // High-Contrast Gold — for text on light backgrounds
          700: '#C07D0A',
          900: '#7A4F04',
        },
        brown: {
          50: '#F5EDE6',
          100: '#E8D0BF',
          300: '#C08060',
          500: '#8B4513',   // Secondary Brown — headings, decorative
          700: '#5E2D0B',
          900: '#321606',
        },
        // Keep obsidian/ivory/sage as neutral fallbacks
        obsidian: {
          50: '#F8F9FF',   // remapped to brand background
          300: '#8C8880',
          500: '#4A4640',
          700: '#28251F',
          900: '#1A1A2E',   // remapped to brand text
        },
        ivory: {
          50: '#FEFCF7',
          300: '#F5EDD6',
          500: '#EAD9A8',
          700: '#C9B36C',
          900: '#6B5A27',
        },
        sage: {
          50: '#EEF3ED',
          300: '#9DB89A',
          500: '#5A8055',
          700: '#2D5229',
          900: '#0F1E0D',
        },
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '28px',
        full: '9999px',
      },
      boxShadow: {
        'gold': '0 0 24px rgba(245,166,35,0.22)',
        'gold-lg': '0 0 48px rgba(245,166,35,0.32)',
        'primary': '0 0 24px rgba(30,58,138,0.22)',
        'card': '0 8px 40px rgba(26,26,46,0.18)',
        'card-lg': '0 16px 64px rgba(26,26,46,0.24)',
        'glass': '0 4px 32px rgba(26,26,46,0.12)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F5A623 0%, #F9C76B 50%, #F5A623 100%)',
        'primary-gradient': 'linear-gradient(180deg, #0C1C48 0%, #1E3A8A 100%)',
        'dark-gradient': 'linear-gradient(180deg, #1A1A2E 0%, #1E3A8A 100%)',
        'hero-overlay': 'linear-gradient(to bottom, rgba(26,26,46,0.3) 0%, rgba(26,26,46,0.65) 100%)',
      },
    },
  },
  plugins: [],
}

