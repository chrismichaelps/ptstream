import { Effect } from "effect";
import { useEffectSync } from "../contexts/EffectContext";
import { SearchStateService, SearchStateServiceLive } from "../../packages/services";

// Search records hooks
export const useSearchRecords = () => {
  return useEffectSync(
    Effect.gen(function* () {
      const searchStateService = yield* SearchStateService;
      return yield* searchStateService.getSearchRecords();
    }).pipe(
      Effect.provide(SearchStateServiceLive)
    )
  );
};

export const useSetSearchRecords = () => {
  return (records: any[]) => {
    useEffectSync(
      Effect.gen(function* () {
        const searchStateService = yield* SearchStateService;
        return yield* searchStateService.setSearchRecords(records);
      }).pipe(
        Effect.provide(SearchStateServiceLive)
      )
    );
  };
};

// Total records hooks
export const useTotalRecords = () => {
  return useEffectSync(
    Effect.gen(function* () {
      const searchStateService = yield* SearchStateService;
      return yield* searchStateService.getTotalRecords();
    }).pipe(
      Effect.provide(SearchStateServiceLive)
    )
  );
};

export const useSetTotalRecords = () => {
  return (total: number) => {
    useEffectSync(
      Effect.gen(function* () {
        const searchStateService = yield* SearchStateService;
        return yield* searchStateService.setTotalRecords(total);
      }).pipe(
        Effect.provide(SearchStateServiceLive)
      )
    );
  };
};

// Page management hooks
export const useCurrentPage = () => {
  return useEffectSync(
    Effect.gen(function* () {
      const searchStateService = yield* SearchStateService;
      return yield* searchStateService.getCurrentPage();
    }).pipe(
      Effect.provide(SearchStateServiceLive)
    )
  );
};

export const useSetCurrentPage = () => {
  return (page: number) => {
    useEffectSync(
      Effect.gen(function* () {
        const searchStateService = yield* SearchStateService;
        return yield* searchStateService.setCurrentPage(page);
      }).pipe(
        Effect.provide(SearchStateServiceLive)
      )
    );
  };
};

// Selected record hooks
export const useSelectedRecord = () => {
  return useEffectSync(
    Effect.gen(function* () {
      const searchStateService = yield* SearchStateService;
      return yield* searchStateService.getSelectedRecord();
    }).pipe(
      Effect.provide(SearchStateServiceLive)
    )
  );
};

export const useSetSelectedRecord = () => {
  return (record: any | null) => {
    useEffectSync(
      Effect.gen(function* () {
        const searchStateService = yield* SearchStateService;
        return yield* searchStateService.setSelectedRecord(record);
      }).pipe(
        Effect.provide(SearchStateServiceLive)
      )
    );
  };
};

// Reset search state
export const useResetSearchState = () => {
  return () => {
    useEffectSync(
      Effect.gen(function* () {
        const searchStateService = yield* SearchStateService;
        return yield* searchStateService.resetSearchState();
      }).pipe(
        Effect.provide(SearchStateServiceLive)
      )
    );
  };
};