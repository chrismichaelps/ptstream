import { Effect } from "effect";

import { TMDB_DISCOVERY_DEFAULTS, TMDB_PATHS } from "../../constants";
import { TmdbClient } from "../tmdb";

export interface MultiSearchQuery {
  readonly query: string;
}

/** Cross-media (movies, series, people) search backed by the TMDB API. */
export class SearchService extends Effect.Service<SearchService>()(
  "SearchService",
  {
    accessors: true,
    dependencies: [TmdbClient.Default],
    effect: Effect.gen(function* () {
      const tmdb = yield* TmdbClient;

      const multi = ({ query }: MultiSearchQuery) =>
        tmdb
          .get(TMDB_PATHS.SEARCH_MULTI, {
            query,
            include_adult: TMDB_DISCOVERY_DEFAULTS.include_adult
          })
          .pipe(
            Effect.withSpan("SearchService.multi", { attributes: { query } })
          );

      return { multi } as const;
    })
  }
) {}
