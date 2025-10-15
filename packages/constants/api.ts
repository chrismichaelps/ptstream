/**
 * API Constants
 * 
 * Centralized API configuration and endpoints
 */

export const API_CONFIG = {
  // TMDB API Configuration
  TMDB: {
    BASE_URL: 'https://api.themoviedb.org/3',
    API_KEY: 'a0a7e40dc8162ed7e37aa2fc97db5654',
    API_KEY_ALT: '7ac6de5ca5060c7504e05da7b218a30c', // Alternative API key
    ENDPOINTS: {
      DISCOVER_MOVIE: '/discover/movie',
      DISCOVER_TV: '/discover/tv',
      SEARCH_MULTI: '/search/multi',
      TV_DETAILS: '/tv',
      MOVIE_DETAILS: '/movie',
      SEASON_DETAILS: '/tv/{id}/season/{seasonId}',
      VIDEOS: '/{id}/videos'
    }
  },

  // Request Configuration
  REQUEST: {
    TIMEOUT: 10000, // 10 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000 // 1 second
  },

  // Query Parameters
  QUERY_PARAMS: {
    DEFAULT_SORT: 'popularity.desc',
    INCLUDE_ADULT: false,
    INCLUDE_VIDEO: true,
    WITHOUT_KEYWORDS: '478,210024',
    ORIGINAL_LANGUAGE: 'en'
  }
} as const;

export const API_ENDPOINTS = {
  MOVIES: {
    DISCOVER: `${API_CONFIG.TMDB.BASE_URL}${API_CONFIG.TMDB.ENDPOINTS.DISCOVER_MOVIE}?`,
    SEARCH: `${API_CONFIG.TMDB.BASE_URL}${API_CONFIG.TMDB.ENDPOINTS.SEARCH_MULTI}?`
  },
  SERIES: {
    DISCOVER: `${API_CONFIG.TMDB.BASE_URL}${API_CONFIG.TMDB.ENDPOINTS.DISCOVER_TV}?`,
    SEARCH: `${API_CONFIG.TMDB.BASE_URL}${API_CONFIG.TMDB.ENDPOINTS.SEARCH_MULTI}?`
  },
  SEARCH: {
    MULTI: `${API_CONFIG.TMDB.BASE_URL}${API_CONFIG.TMDB.ENDPOINTS.SEARCH_MULTI}?`
  }
} as const;
