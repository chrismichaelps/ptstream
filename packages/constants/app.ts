/**
 * Application Constants
 *
 * Centralized application-level constants.
 */

/** Keys used to persist application data in `localStorage`. */
export const STORAGE_KEYS = {
  FAVORITES: 'my-favorites',
  CHAPTERS_WATCHED: 'chapters-watched',
  LANGUAGE: 'appLang'
} as const;

/** Scroll-related UI thresholds. */
export const THRESHOLDS = {
  SCROLL_TO_TOP: 100
} as const;
