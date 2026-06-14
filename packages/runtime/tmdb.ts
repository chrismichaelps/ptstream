import { Layer, ManagedRuntime } from "effect";

import {
  MovieService,
  PromoService,
  SearchService,
  SerieService
} from "../services";

/**
 * TMDB service graph — MAIN PROCESS ONLY.
 *
 * These services reach the network and carry the API keys, so they are kept in
 * their own module that the renderer never imports. The renderer talks to them
 * exclusively over IPC (see src/ipc), which keeps TMDB code and credentials out
 * of the renderer bundle.
 *
 * Each service declares its own dependencies (TmdbClient → HttpClient → config),
 * so merging the four leaves is enough — Layer memoization shares the single
 * HttpClient/TmdbClient instance across all of them.
 */
export const TmdbLayer = Layer.mergeAll(
  MovieService.Default,
  SerieService.Default,
  SearchService.Default,
  PromoService.Default
);

export type TmdbServices = Layer.Layer.Success<typeof TmdbLayer>;

/**
 * Shared main-process runtime. Built once so HttpClient/TmdbClient behave as
 * singletons (connection reuse, single config read) across every IPC call.
 */
export const TmdbRuntime = ManagedRuntime.make(TmdbLayer);
