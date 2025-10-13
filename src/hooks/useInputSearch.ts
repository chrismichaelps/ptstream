import { Effect } from "effect";
import { useEffectSync } from "../contexts/EffectContext";
import { InputSearchService, InputSearchServiceLive } from "../../packages/services";

// Search query hooks
export const useSearchQuery = () => {
  return useEffectSync(
    Effect.gen(function* () {
      const inputSearchService = yield* InputSearchService;
      return yield* inputSearchService.getSearchQuery();
    }).pipe(
      Effect.provide(InputSearchServiceLive)
    )
  );
};

export const useSetSearchQuery = () => {
  return (query: string) => {
    useEffectSync(
      Effect.gen(function* () {
        const inputSearchService = yield* InputSearchService;
        return yield* inputSearchService.setSearchQuery(query);
      }).pipe(
        Effect.provide(InputSearchServiceLive)
      )
    );
  };
};

export const useClearSearchQuery = () => {
  return () => {
    useEffectSync(
      Effect.gen(function* () {
        const inputSearchService = yield* InputSearchService;
        return yield* inputSearchService.clearSearchQuery();
      }).pipe(
        Effect.provide(InputSearchServiceLive)
      )
    );
  };
};
