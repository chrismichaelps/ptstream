import { Effect } from "effect";

import { TMDB_PATHS } from "../../constants";
import { TmdbClient } from "../tmdb";

/** Promotional videos (trailers, teasers) backed by the TMDB API. */
export class PromoService extends Effect.Service<PromoService>()(
  "PromoService",
  {
    accessors: true,
    dependencies: [TmdbClient.Default],
    effect: Effect.gen(function* () {
      const tmdb = yield* TmdbClient;

      /** `mediaPath` is a TMDB media path such as `movie/603` or `tv/1399`. */
      const getPromoById = (mediaPath: string) =>
        tmdb
          .get(TMDB_PATHS.videos(mediaPath))
          .pipe(
            Effect.withSpan("PromoService.getPromoById", {
              attributes: { mediaPath }
            })
          );

      return { getPromoById } as const;
    })
  }
) {}
