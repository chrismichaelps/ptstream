/**
 * TMDB IPC contract
 *
 * The single source of truth shared by the three processes:
 *  - main  (src/ipc/tmdb-ipc.ts) registers `ipcMain.handle` for each channel,
 *  - preload (src/preload.ts) exposes a typed `window.tmdbApi` bridge,
 *  - renderer (src/hooks/*) calls that bridge through React Query.
 *
 * All TMDB network access now happens in the main process ("server side" for a
 * desktop app), so this file deliberately uses TYPE-ONLY imports of the Effect
 * service argument types — pulling no service code (or API keys) into the
 * renderer bundle.
 */
import type {
  ChapterLookup,
  DiscoverMoviesFilter,
  DiscoverSeriesFilter,
} from "../../packages/services";
import type {
  MovieReturnType,
  PromoReturnType,
  SeasonChapters,
  SerieReturnType,
  SerieSeasonsResult,
  UniqueMovie,
  UniqueSerie,
} from "../types";

/**
 * Raw multi-search result: TMDB also returns `person` entries, which the app
 * filters out before storing. (Lives here, not in the hook, so both the main
 * handler and the renderer share one definition.)
 */
export type RawSearchMediaItem = (UniqueMovie | UniqueSerie) & {
  media_type: "movie" | "tv" | "person";
};

export type SearchReturnType = {
  page: number;
  results?: ReadonlyArray<RawSearchMediaItem>;
  total_pages: number;
  total_results?: number;
};

/** IPC channel names. Namespaced to avoid collisions with future channels. */
export const TMDB_CHANNELS = {
  discoverMovies: "tmdb:discover-movies",
  discoverSeries: "tmdb:discover-series",
  searchMulti: "tmdb:search-multi",
  getSeasonById: "tmdb:get-season-by-id",
  getChapterBySeasonId: "tmdb:get-chapter-by-season-id",
  getPromoById: "tmdb:get-promo-by-id",
} as const;

export type TmdbChannel = (typeof TMDB_CHANNELS)[keyof typeof TMDB_CHANNELS];

/**
 * The surface exposed to the renderer as `window.tmdbApi`. Every method is a
 * thin `ipcRenderer.invoke` round-trip to the main process, which owns the
 * fetching, retries, and caching.
 */
export interface TmdbBridge {
  discoverMovies(filter: DiscoverMoviesFilter): Promise<MovieReturnType>;
  discoverSeries(filter: DiscoverSeriesFilter): Promise<SerieReturnType>;
  searchMulti(query: string): Promise<SearchReturnType>;
  getSeasonById(serieId: number): Promise<SerieSeasonsResult>;
  getChapterBySeasonId(lookup: ChapterLookup): Promise<SeasonChapters>;
  getPromoById(mediaPath: string): Promise<PromoReturnType>;
}

declare global {
  interface Window {
    /** TMDB bridge injected by the preload script. */
    tmdbApi: TmdbBridge;
  }
}
