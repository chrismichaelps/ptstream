/**
 * UI Constants
 * 
 * Centralized UI dimensions, sizes, and styling constants
 */

export const UI_DIMENSIONS = {
  // Window dimensions
  WINDOW: {
    WIDTH: 900,
    HEIGHT: 720,
    MIN_WIDTH: 800,
    MIN_HEIGHT: 600
  },
  
  // Image dimensions
  IMAGES: {
    POSTER: {
      WIDTH: 80,
      HEIGHT: 120
    },
    BACKDROP: {
      WIDTH: 300,
      HEIGHT: 169
    }
  },
  
  // Icon sizes
  ICONS: {
    SMALL: 20,
    MEDIUM: 24,
    LARGE: 32,
    EXTRA_LARGE: 48
  },
  
  // Spinner sizes
  SPINNERS: {
    SMALL: 'sm',
    MEDIUM: 'md', 
    LARGE: 'lg',
    EXTRA_LARGE: 'xl'
  },
  
  // Button dimensions
  BUTTONS: {
    ICON_SIZE: 32,
    HEIGHT: 40,
    PADDING: 16
  }
} as const;

export const UI_BREAKPOINTS = {
  SM: '640px',
  MD: '768px', 
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px'
} as const;

export const UI_SPACING = {
  XS: '4px',
  SM: '8px',
  MD: '16px',
  LG: '24px',
  XL: '32px',
  '2XL': '48px',
  '3XL': '64px'
} as const;

export const UI_ANIMATIONS = {
  DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500
  },
  EASING: {
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out'
  }
} as const;
