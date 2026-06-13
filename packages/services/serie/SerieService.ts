import { Effect } from "effect";

import {
  TMDB_PATHS,
  TMDB_SEASON_APPEND_TO_RESPONSE,
  TMDB_SERIE_DISCOVERY_DEFAULTS
} from "../../constants";
import { TmdbClient } from "../tmdb";

export interface DiscoverSeriesFilter {
  readonly page: number;
  readonly with_genres?: number;
}

export interface ChapterLookup {
  readonly serieId: number;
  readonly seasonId: number;
}

/** Series catalog and season/chapter details backed by the TMDB API. */
export class SerieService extends Effect.Service<SerieService>()(
  "SerieService",
  {
    accessors: true,
    dependencies: [TmdbClient.Default],
    effect: Effect.gen(function* () {
      const tmdb = yield* TmdbClient;

      const discover = (filter: DiscoverSeriesFilter) =>
        tmdb
          .get(TMDB_PATHS.DISCOVER_SERIES, {
            ...TMDB_SERIE_DISCOVERY_DEFAULTS,
            ...filter
          })
          .pipe(Effect.withSpan("SerieService.discover", { attributes: { ...filter } }));

      const getSeasonById = (serieId: number) =>
        tmdb
          .get(TMDB_PATHS.serieDetails(serieId))
          .pipe(
            Effect.withSpan("SerieService.getSeasonById", {
              attributes: { serieId }
            })
          );

      const getChapterBySeasonId = ({ serieId, seasonId }: ChapterLookup) =>
        tmdb
          .get(
            TMDB_PATHS.seasonDetails(serieId, seasonId),
            { append_to_response: TMDB_SEASON_APPEND_TO_RESPONSE },
            { apiKeyVariant: "alternate" }
          )
          .pipe(
            Effect.withSpan("SerieService.getChapterBySeasonId", {
              attributes: { serieId, seasonId }
            })
          );

      return { discover, getSeasonById, getChapterBySeasonId } as const;
    })
  }
) {}
