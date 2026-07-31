import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        surface: '#f6fbf3',
        'surface-dim': '#d7dbd4',
        'surface-bright': '#f6fbf3',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f0f5ee',
        'surface-container': '#ebefe8',
        'surface-container-high': '#e5e9e2',
        'surface-container-highest': '#dfe4dd',
        'on-surface': '#181d19',
        'on-surface-variant': '#3f4941',
        'on-background': '#181d19',
        'inverse-surface': '#2d322d',
        'inverse-on-surface': '#edf2eb',
        outline: '#6f7a70',
        'outline-variant': '#becabe',
        'primary-container': '#268451',
        'on-primary-container': '#f6fff4',
        'secondary-container': '#39b8fd',
        'on-secondary-container': '#004666',
        tertiary: '#0051d5',
        'tertiary-container': '#316bf3',
        'on-tertiary-container': '#fefcff',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: '2rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        soft: '0 8px 30px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [animate],
} satisfies Config;
