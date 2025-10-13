import { Effect } from "effect";
import { useEffectSync } from "../contexts/EffectContext";
import { SeasonService, SeasonServiceLive } from "../../packages/services";
import { UniqueSerieSeason } from "../types";

// Season management hooks
export const useSeasonSelected = () => {
  return useEffectSync(
    Effect.gen(function* () {
      const seasonService = yield* SeasonService;
      return yield* seasonService.getSeasonSelected();
    }).pipe(
      Effect.provide(SeasonServiceLive)
    )
  );
};

export const useSetSeasonSelected = () => {
  return (season: UniqueSerieSeason | null) => {
    useEffectSync(
      Effect.gen(function* () {
        const seasonService = yield* SeasonService;
        return yield* seasonService.setSeasonSelected(season);
      }).pipe(
        Effect.provide(SeasonServiceLive)
      )
    );
  };
};

export const useClearSeasonSelected = () => {
  return () => {
    useEffectSync(
      Effect.gen(function* () {
        const seasonService = yield* SeasonService;
        return yield* seasonService.clearSeasonSelected();
      }).pipe(
        Effect.provide(SeasonServiceLive)
      )
    );
  };
};
