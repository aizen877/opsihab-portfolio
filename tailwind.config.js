module.exports = {
  content: ["./*.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        bengali: ['Hind Siliguri', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
        space: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        obsidian: {
          50: '#f0f4f8',
          100: '#dbeafe',
          900: '#030712',
          950: '#010409',
        },
        slateDark: {
          900: '#030712',
          950: '#010409',
          800: '#0f172a',
          700: '#1e293b',
        },
        accent: {
          blue: 'rgb(var(--accent-blue-rgb) / <alpha-value>)',
          sky: 'rgb(var(--accent-sky-rgb) / <alpha-value>)',
          'blue-solid': 'var(--color-accent-blue)',
          'sky-solid': 'var(--color-accent-sky)',
          white: '#ffffff',
          slate: '#94a3b8',
          purple: '#8b5cf6',
        }
      },
      boxShadow: {
        'glow-blue': '0 0 25px rgba(var(--accent-blue-rgb), 0.25)',
        'glow-sky': '0 0 25px rgba(var(--accent-sky-rgb), 0.25)',
        'glass': '0 8px 32px 0 rgba(1, 4, 9, 0.7)',
      }
    }
  },
  plugins: [],
}
