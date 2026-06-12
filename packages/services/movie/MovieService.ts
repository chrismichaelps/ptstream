import { Effect } from "effect";

import {
  TMDB_MOVIE_DISCOVERY_DEFAULTS,
  TMDB_PATHS
} from "../../constants";
import { TmdbClient } from "../tmdb";

export interface DiscoverMoviesFilter {
  readonly page: number;
  readonly with_genres?: number;
}

/** Movie catalog backed by the TMDB discovery API. */
export class MovieService extends Effect.Service<MovieService>()(
  "MovieService",
  {
    accessors: true,
    dependencies: [TmdbClient.Default],
    effect: Effect.gen(function* () {
      const tmdb = yield* TmdbClient;

      const discover = (filter: DiscoverMoviesFilter) =>
        tmdb
          .get(TMDB_PATHS.DISCOVER_MOVIES, {
            ...TMDB_MOVIE_DISCOVERY_DEFAULTS,
            ...filter
          })
          .pipe(Effect.withSpan("MovieService.discover", { attributes: { ...filter } }));

      return { discover } as const;
    })
  }
) {}
