/**
 * TMDB IPC handlers (MAIN PROCESS).
 *
 * Registers one `ipcMain.handle` per channel in the contract. Each handler runs
 * the corresponding Effect on the shared main-process runtime, wrapped in the
 * TTL cache + in-flight de-duplication. This is the "server side" the renderer
 * now calls instead of fetching TMDB directly.
 */
import { ipcMain } from "electron";
import type { IpcMainInvokeEvent } from "electron";
import { Effect } from "effect";

import { TmdbRuntime, type TmdbServices } from "../../packages/runtime/tmdb";
import {
  MovieService,
  PromoService,
  SearchService,
  SerieService,
  type ChapterLookup,
  type DiscoverMoviesFilter,
  type DiscoverSeriesFilter,
} from "../../packages/services";
import { TMDB_CHANNELS, type TmdbChannel } from "./contract";
import { RequestCache } from "./request-cache";

const MINUTE = 60_000;

/**
 * Per-endpoint cache TTLs. Catalog/detail data on TMDB changes slowly, so even
 * short-lived caching collapses the bursty refetching (genre switches, pagination,
 * re-opening a title) that made the client-side version feel slow.
 */
const TTL = {
  discover: 10 * MINUTE,
  search: 5 * MINUTE,
  details: 30 * MINUTE,
} as const;

const cache = new RequestCache({ maxEntries: 300 });

/** Run an Effect on the main-process runtime, surfacing a clean Error over IPC. */
const run = <A>(effect: Effect.Effect<A, unknown, TmdbServices>): Promise<A> =>
  TmdbRuntime.runPromise(
    effect.pipe(
      Effect.mapError((error) =>
        error instanceof Error ? error : new Error(String(error))
      )
    ) as Effect.Effect<A, Error, TmdbServices>
  );

/**
 * Register a cached invoke handler. `key` derives a stable cache key from the
 * request payload; `load` produces the promise to run on a cache miss.
 */
const handle = <Payload, Result>(
  channel: TmdbChannel,
  ttlMillis: number,
  key: (payload: Payload) => string,
  load: (payload: Payload) => Promise<Result>
): void => {
  ipcMain.handle(channel, (_event: IpcMainInvokeEvent, payload: Payload) =>
    cache.resolve(`${channel}|${key(payload)}`, ttlMillis, () => load(payload))
  );
};

/** Wire up every TMDB channel. Call once, after `app` is ready. */
export function registerTmdbIpc(): void {
  handle(
    TMDB_CHANNELS.discoverMovies,
    TTL.discover,
    (filter: DiscoverMoviesFilter) => `${filter.page}:${filter.with_genres ?? ""}`,
    (filter) => run(MovieService.discover(filter))
  );

  handle(
    TMDB_CHANNELS.discoverSeries,
    TTL.discover,
    (filter: DiscoverSeriesFilter) => `${filter.page}:${filter.with_genres ?? ""}`,
    (filter) => run(SerieService.discover(filter))
  );

  handle(
    TMDB_CHANNELS.searchMulti,
    TTL.search,
    (query: string) => query.trim().toLowerCase(),
    (query) => run(SearchService.multi({ query }))
  );

  handle(
    TMDB_CHANNELS.getSeasonById,
    TTL.details,
    (serieId: number) => String(serieId),
    (serieId) => run(SerieService.getSeasonById(serieId))
  );

  handle(
    TMDB_CHANNELS.getChapterBySeasonId,
    TTL.details,
    (lookup: ChapterLookup) => `${lookup.serieId}:${lookup.seasonId}`,
    (lookup) => run(SerieService.getChapterBySeasonId(lookup))
  );

  handle(
    TMDB_CHANNELS.getPromoById,
    TTL.details,
    (mediaPath: string) => mediaPath,
    (mediaPath) => run(PromoService.getPromoById(mediaPath))
  );
}
