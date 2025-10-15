import { Context, Effect, Layer } from "effect";
import { UniqueSerieSeason } from "../../../src/types";

export interface SeasonService {
  readonly getSeasonSelected: () => Effect.Effect<UniqueSerieSeason | null, never, never>;
  readonly setSeasonSelected: (season: UniqueSerieSeason | null) => Effect.Effect<void, never, never>;
  readonly clearSeasonSelected: () => Effect.Effect<void, never, never>;
}

export const SeasonService = Context.Tag("SeasonService")<SeasonService, SeasonService>();

const makeSeasonService = (): SeasonService => {
  let seasonSelected: UniqueSerieSeason | null = null;

  return {
    getSeasonSelected: () => Effect.sync(() => seasonSelected),

    setSeasonSelected: (season: UniqueSerieSeason | null) => Effect.sync(() => {
      seasonSelected = season;
    }),

    clearSeasonSelected: () => Effect.sync(() => {
      seasonSelected = null;
    })
  };
};

export const SeasonServiceLive = Layer.succeed(SeasonService, makeSeasonService());
