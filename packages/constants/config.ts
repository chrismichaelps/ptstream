/**
 * Configuration Constants
 * 
 * Application configuration, timeouts, and system constants
 */

export const CONFIG = {
  // Development settings
  DEVELOPMENT: {
    ENABLE_LOGGING: true,
    ENABLE_DEVTOOLS: true,
    LOG_LEVEL: 'debug'
  },
  
  // Production settings
  PRODUCTION: {
    ENABLE_LOGGING: false,
    ENABLE_DEVTOOLS: false,
    LOG_LEVEL: 'error'
  },
  
  // Timeouts
  TIMEOUTS: {
    API_REQUEST: 10000, // 10 seconds
    DEBOUNCE: 300, // 300ms
    RETRY_DELAY: 1000, // 1 second
    STORAGE_OPERATION: 5000 // 5 seconds
  },
  
  // Limits
  LIMITS: {
    MAX_SEARCH_RESULTS: 1000,
    MAX_FAVORITES: 10000,
    MAX_RETRY_ATTEMPTS: 3,
    MAX_CONCURRENT_REQUESTS: 5
  },
  
  // Cache settings
  CACHE: {
    TTL: 300000, // 5 minutes
    MAX_SIZE: 100, // 100 items
    ENABLED: true
  },
  
  // UI Configuration
  UI: {
    ANIMATION_DURATION: 300,
    TOAST_DURATION: 3000,
    LOADING_DELAY: 200
  }
} as const;

export const ENVIRONMENT = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test'
} as const;

export const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn', 
  INFO: 'info',
  DEBUG: 'debug'
} as const;
