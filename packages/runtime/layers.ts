import { Layer } from "effect";

import {
  MovieService,
  PromoService,
  SearchService,
  SerieService,
  StorageService
} from "../services";

/**
 * Application dependency graph.
 *
 * Each domain service declares its own dependencies (`dependencies: [...]`
 * in its `Effect.Service` definition), so composing the top of the graph is
 * enough — Effect wires and memoizes the rest:
 *
 *   tmdbConfig ─┐                  ┌─ httpConfig
 *               ▼                  ▼
 *               │             HttpClient
 *               │                  │
 *               └────► TmdbClient ◄┘
 *        ┌────────────┬─────┴──────┬────────────┐
 *        ▼            ▼            ▼            ▼
 *  MovieService  SerieService  SearchService  PromoService    StorageService
 *
 * `HttpClient` and `TmdbClient` are shared singletons: Layer memoization
 * guarantees a single instance regardless of how many services depend on them.
 */
export const AppLayer = Layer.mergeAll(
  MovieService.Default,
  SerieService.Default,
  SearchService.Default,
  PromoService.Default,
  StorageService.Default
);

export type AppServices = Layer.Layer.Success<typeof AppLayer>;
