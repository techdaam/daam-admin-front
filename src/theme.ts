import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      // Primary color from landing page
      primary: '#1e3a8a',
      'primary-dark': '#172e6b',
      'primary-light': '#2e4a9e',
      // Accent color
      accent: '#f59e0b',
      'accent-dark': '#d97706',
      'accent-light': '#fbbf24',
      // Neutral colors
      'neutral-light': '#f8fafc',
      white: '#ffffff',
    },
  },
  fonts: {
    heading: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Cairo', sans-serif`,
    body: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Cairo', sans-serif`,
  },
  direction: 'rtl',
  styles: {
    global: {
      body: {
        bg: 'white',
        color: 'gray.800',
      },
      ':root': {
        // Background Gradients
        '--bg-gradient-hero': 'linear-gradient(to bottom right, rgba(30, 58, 138, 0.1), rgba(245, 158, 11, 0.1))',
        '--bg-gradient-feature': 'linear-gradient(143.94deg, rgba(30, 58, 138, 0.9) 1.2%, rgba(30, 58, 138, 0.6) 35.59%, rgba(245, 158, 11, 0.3) 80.16%)',
        
        // Radial Gradient Effects
        '--bg-radial-primary': 'radial-gradient(circle, rgba(30, 58, 138, 0.8) 0%, rgba(30, 58, 138, 0) 100%)',
        '--bg-radial-accent': 'radial-gradient(circle, rgba(245, 158, 11, 0.8) 0%, rgba(245, 158, 11, 0) 100%)',
        '--bg-radial-soft': 'radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, rgba(245, 158, 11, 0) 100%)',
        
        // Text Gradients
        '--text-gradient-primary': 'linear-gradient(180deg, rgba(30, 58, 138, 0.9) -38.79%, rgba(245, 158, 11, 0.8) 262.92%)',
        
        // Blur Effects
        '--blur-soft': 'blur(80px)',
        '--blur-medium': 'blur(100px)',
        '--blur-heavy': 'blur(120px)',
        
        // Opacity Levels
        '--opacity-pattern': '0.08',
        '--opacity-subtle': '0.2',
        '--opacity-medium': '0.4',
        '--opacity-visible': '0.7',
        '--opacity-strong': '0.8',
        
        // Pattern Background Color
        '--bg-blur-rect-accent': 'rgba(245, 158, 11, 0.3)',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: 'lg',
      },
      variants: {
        solid: {
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          _hover: {
            transform: 'translateY(-2px)',
            shadow: 'lg',
          },
          _active: {
            transform: 'translateY(0)',
          },
        },
      },
    },
    Input: {
      variants: {
        filled: {
          field: {
            bg: 'gray.50',
            _hover: {
              bg: 'gray.100',
            },
            _focus: {
              bg: 'white',
              borderColor: 'brand.primary',
            },
          },
        },
      },
    },
  },
});

// Background tokens for direct use in components
export const backgroundTokens = {
  gradients: {
    hero: 'linear(to-br, rgba(30, 58, 138, 0.1), rgba(245, 158, 11, 0.1))',
    feature: 'linear(143.94deg, rgba(30, 58, 138, 0.9) 1.2%, rgba(30, 58, 138, 0.6) 35.59%, rgba(245, 158, 11, 0.3) 80.16%)',
    featureMobile: 'linear(143.94deg, rgba(245, 158, 11, 0.6) 40.59%, rgba(245, 158, 11, 0.3) 80.16%)',
  },
  radial: {
    primary: 'radial-gradient(circle, rgba(30, 58, 138, 0.8) 0%, rgba(30, 58, 138, 0) 100%)',
    light: 'radial-gradient(circle, rgba(30, 58, 138, 0.4) 0%, rgba(30, 58, 138, 0) 100%)',
    dark: 'radial-gradient(circle, rgba(30, 58, 138, 1) 0%, rgba(30, 58, 138, 0) 100%)',
  },
  blur: {
    soft: 'blur(80px)',
    medium: 'blur(100px)',
    heavy: 'blur(120px)',
  },
  opacity: {
    pattern: 0.08,
    subtle: 0.2,
    medium: 0.4,
    visible: 0.7,
    strong: 0.8,
  },
  colors: {
    primary: 'rgba(30, 58, 138, 1)',
    primaryLight: 'rgba(30, 58, 138, 0.8)',
    primaryMedium: 'rgba(30, 58, 138, 0.3)',
    primarySubtle: 'rgba(30, 58, 138, 0.08)',
    blurRect: 'rgba(30, 58, 138, 0.3)',
  },
};

export default theme;
