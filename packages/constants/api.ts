/**
 * TMDB API Constants
 *
 * Endpoint paths and discovery defaults for the TMDB v3 API.
 * Credentials and tuning knobs live in `packages/config`.
 */

export const TMDB_PATHS = {
  DISCOVER_MOVIES: "/discover/movie",
  DISCOVER_SERIES: "/discover/tv",
  SEARCH_MULTI: "/search/multi",
  serieDetails: (serieId: number) => `/tv/${serieId}`,
  seasonDetails: (serieId: number, seasonId: number) =>
    `/tv/${serieId}/season/${seasonId}`,
  /** `mediaPath` is a TMDB media path such as `movie/603` or `tv/1399`. */
  videos: (mediaPath: string) => `/${mediaPath}/videos`
} as const;

/** TMDB `with_type: 4` filters series down to scripted shows. */
export const TMDB_SERIE_TYPE_SCRIPTED = 4;

/** TMDB keyword ids excluded from movie discovery (e.g. softcore, talk show). */
export const TMDB_MOVIE_EXCLUDED_KEYWORDS = "478,210024";

/** TMDB keyword ids excluded from series discovery. */
export const TMDB_SERIE_EXCLUDED_KEYWORDS =
  "210024,9755,272877,197251,6513,287501,290799";

/** Extra payloads appended to season detail responses. */
export const TMDB_SEASON_APPEND_TO_RESPONSE = "keywords,external_ids";

/** Query parameters shared by every discovery request. */
export const TMDB_DISCOVERY_DEFAULTS = {
  sort_by: "popularity.desc",
  include_adult: false,
  with_original_language: "en"
} as const;

/** Discovery defaults specific to movies. */
export const TMDB_MOVIE_DISCOVERY_DEFAULTS = {
  ...TMDB_DISCOVERY_DEFAULTS,
  include_video: true,
  without_keywords: TMDB_MOVIE_EXCLUDED_KEYWORDS
} as const;

/** Discovery defaults specific to series. */
export const TMDB_SERIE_DISCOVERY_DEFAULTS = {
  ...TMDB_DISCOVERY_DEFAULTS,
  with_type: TMDB_SERIE_TYPE_SCRIPTED,
  without_keywords: TMDB_SERIE_EXCLUDED_KEYWORDS
} as const;
