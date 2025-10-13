/**
 * Application Constants
 * 
 * Centralized application state, scenes, and business logic constants
 */

export const APP_SCENES = {
  SERIES: 'series',
  MOVIES: 'movies', 
  SEARCH: 'search',
  MY_FAVORITES: 'myfavorites'
} as const;

export const MEDIA_TYPES = {
  MOVIE: 'movie',
  TV: 'tv'
} as const;

export const GENRE_IDS = {
  RESET: 0,
  ACTION: 28,
  ADVENTURE: 12,
  ANIMATION: 16,
  COMEDY: 35,
  CRIME: 80,
  DOCUMENTARY: 99,
  DRAMA: 18,
  FAMILY: 10751,
  FANTASY: 14,
  HISTORY: 36,
  HORROR: 27,
  MUSIC: 10402,
  MYSTERY: 9648,
  ROMANCE: 10749,
  SCIENCE_FICTION: 878,
  TV_MOVIE: 10770,
  THRILLER: 53,
  WAR: 10752,
  WESTERN: 37,
  // TV Series specific
  ACTION_ADVENTURE: 10759,
  KIDS: 10762,
  NEWS: 10763,
  REALITY: 10764,
  SCI_FI_FANTASY: 10765,
  SOAP: 10766,
  TALK: 10767,
  WAR_POLITICS: 10768
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  ITEMS_PER_PAGE: 20,
  MAX_PAGES: 1000
} as const;

export const SEARCH = {
  MIN_QUERY_LENGTH: 2,
  DEBOUNCE_DELAY: 300,
  MAX_RESULTS: 1000
} as const;

export const STORAGE_KEYS = {
  FAVORITES: 'myFavorites',
  WATCHED_CHAPTERS: 'chaptersWatched',
  LANGUAGE: 'language',
  THEME: 'theme'
} as const;

export const THRESHOLDS = {
  SCROLL_TO_TOP: 100,
  MIN_ITEMS_FOR_SCROLL: 10
} as const;
