/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      // Custom Color Palette
      colors: {
        primary: {
          cyan: '#00bcd4',
          dark: '#1e293b',
          gray: '#64748b',
          light: '#f8fafc',
        },
        brand: {
          cyan: {
            50: '#ecfeff',
            100: '#cffafe',
            200: '#a5f3fc',
            300: '#67e8f9',
            400: '#22d3ee',
            500: '#06b6d4',
            600: '#0891b2',
            700: '#0e7490',
            800: '#155e75',
            900: '#164e63',
          },
          blue: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
          },
        },
        semantic: {
          success: '#22c55e',
          'success-dark': '#16a34a',
          'success-light': '#dcfce7',
          warning: '#f59e0b',
          'warning-dark': '#d97706',
          'warning-light': '#fef9c3',
          error: '#ef4444',
          'error-dark': '#dc2626',
          'error-light': '#fee2e2',
          info: '#3b82f6',
          'info-dark': '#2563eb',
          'info-light': '#dbeafe',
        },
        // Category colors for course types, activities, and badges
        // These mirror Tailwind defaults but are explicit theme tokens
        category: {
          green: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
          },
          purple: {
            50: '#faf5ff',
            100: '#f3e8ff',
            200: '#e9d5ff',
            300: '#d8b4fe',
            400: '#c084fc',
            500: '#a855f7',
            600: '#9333ea',
            700: '#7e22ce',
            800: '#6b21a8',
            900: '#581c87',
          },
          orange: {
            50: '#fff7ed',
            100: '#ffedd5',
            200: '#fed7aa',
            300: '#fdba74',
            400: '#fb923c',
            500: '#f97316',
            600: '#ea580c',
            700: '#c2410c',
            800: '#9a3412',
            900: '#7c2d12',
          },
          red: {
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fecaca',
            300: '#fca5a5',
            400: '#f87171',
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c',
            800: '#991b1b',
            900: '#7f1d1d',
          },
          yellow: {
            50: '#fefce8',
            100: '#fef9c3',
            200: '#fef08a',
            300: '#fde047',
            400: '#facc15',
            500: '#eab308',
            600: '#ca8a04',
            700: '#a16207',
            800: '#854d0e',
            900: '#713f12',
          },
          pink: {
            50: '#fdf2f8',
            100: '#fce7f3',
            200: '#fbcfe8',
            300: '#f9a8d4',
            400: '#f472b6',
            500: '#ec4899',
            600: '#db2777',
            700: '#be185d',
            800: '#9d174d',
            900: '#831843',
          },
          indigo: {
            50: '#eef2ff',
            100: '#e0e7ff',
            200: '#c7d2fe',
            300: '#a5b4fc',
            400: '#818cf8',
            500: '#6366f1',
            600: '#4f46e5',
            700: '#4338ca',
            800: '#3730a3',
            900: '#312e81',
          },
          teal: {
            50: '#f0fdfa',
            100: '#ccfbf1',
            200: '#99f6e4',
            300: '#5eead4',
            400: '#2dd4bf',
            500: '#14b8a6',
            600: '#0d9488',
            700: '#0f766e',
            800: '#115e59',
            900: '#134e4a',
          },
        },
      },
      
      // Custom Font Family
      fontFamily: {
        sans: ['Noto Sans TC', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      
      // Container Configuration
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          lg: '2rem',
          xl: '2.5rem',
          '2xl': '3rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1200px',
          '2xl': '1200px',
        },
      },
      
      // Custom Spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      
      // Custom Border Radius
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      
      // Custom Box Shadow
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.05)',
        'card': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 8px 16px rgba(0, 0, 0, 0.15)',
        'hero': '0 10px 30px rgba(0, 0, 0, 0.2)',
      },
      
      // Typography Extensions
      typography: {
        DEFAULT: {
          css: {
            'max-width': 'none',
            color: 'inherit',
            a: {
              color: '#06b6d4',
              textDecoration: 'underline',
              fontWeight: '500',
              '&:hover': {
                color: '#0891b2',
              },
            },
            strong: {
              color: 'inherit',
              fontWeight: '600',
            },
            h1: {
              color: '#1e293b',
              fontWeight: '700',
            },
            h2: {
              color: '#1e293b',
              fontWeight: '700',
            },
            h3: {
              color: '#1e293b',
              fontWeight: '600',
            },
            h4: {
              color: '#334155',
              fontWeight: '600',
            },
          },
        },
      },
      
      // Custom Animations
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      
      // Custom Transitions
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // Add custom utility classes
    function({ addComponents, theme }) {
      addComponents({
        // Section Utilities
        '.section-padding': {
          paddingTop: theme('spacing.16'),
          paddingBottom: theme('spacing.16'),
        },
        '.section-padding-sm': {
          paddingTop: theme('spacing.12'),
          paddingBottom: theme('spacing.12'),
        },
        '.section-padding-lg': {
          paddingTop: theme('spacing.24'),
          paddingBottom: theme('spacing.24'),
        },
        
        // Container Utilities
        '.container-standard': {
          maxWidth: '1200px',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: theme('spacing.4'),
          paddingRight: theme('spacing.4'),
        },
        '.container-narrow': {
          maxWidth: '800px',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: theme('spacing.4'),
          paddingRight: theme('spacing.4'),
        },
        
        // Card Utilities
        '.card-base': {
          backgroundColor: theme('colors.white'),
          borderRadius: theme('borderRadius.lg'),
          boxShadow: theme('boxShadow.card'),
          overflow: 'hidden',
          transition: 'all 0.3s ease',
        },
        '.card-hover': {
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: theme('boxShadow.card-hover'),
          },
        },
        
        // Hero Utilities
        '.hero-overlay': {
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        
        // Button Utilities
        '.btn-primary': {
          display: 'inline-flex',
          alignItems: 'center',
          padding: `${theme('spacing.3')} ${theme('spacing.8')}`,
          backgroundColor: theme('colors.brand.cyan.600'),
          color: theme('colors.white'),
          fontWeight: theme('fontWeight.semibold'),
          borderRadius: theme('borderRadius.lg'),
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: theme('colors.brand.cyan.700'),
            transform: 'translateY(-2px)',
            boxShadow: theme('boxShadow.lg'),
          },
        },
        '.btn-gradient': {
          background: `linear-gradient(to right, ${theme('colors.brand.cyan.500')}, ${theme('colors.brand.blue.600')})`,
          '&:hover': {
            background: `linear-gradient(to right, ${theme('colors.brand.cyan.600')}, ${theme('colors.brand.blue.700')})`,
          },
        },
        
        // Grid Utilities
        '.grid-auto-fit': {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: theme('spacing.8'),
        },
        '.grid-auto-fill': {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: theme('spacing.6'),
        },
        
        // Feature Card Grid
        '.feature-grid': {
          display: 'grid',
          gridTemplateColumns: 'repeat(1, 1fr)',
          gap: theme('spacing.8'),
          '@media (min-width: 768px)': {
            gridTemplateColumns: 'repeat(2, 1fr)',
          },
          '@media (min-width: 1024px)': {
            gridTemplateColumns: 'repeat(4, 1fr)',
          },
        },
        
        // Content Grid
        '.content-grid': {
          display: 'grid',
          gridTemplateColumns: 'repeat(1, 1fr)',
          gap: theme('spacing.8'),
          '@media (min-width: 1024px)': {
            gridTemplateColumns: 'repeat(2, 1fr)',
          },
        },
      })
    },
  ],
} 
