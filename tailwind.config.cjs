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
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
          },
        },
        semantic: {
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6',
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
          background: 'linear-gradient(to right, #06b6d4, #2563eb)',
          '&:hover': {
            background: 'linear-gradient(to right, #0891b2, #1d4ed8)',
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