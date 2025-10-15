import { Context, Effect, Layer } from "effect";

export interface SearchStateService {
  readonly getSearchRecords: () => Effect.Effect<any[], never, never>;
  readonly setSearchRecords: (records: any[]) => Effect.Effect<void, never, never>;
  readonly getTotalRecords: () => Effect.Effect<number, never, never>;
  readonly setTotalRecords: (total: number) => Effect.Effect<void, never, never>;
  readonly getCurrentPage: () => Effect.Effect<number, never, never>;
  readonly setCurrentPage: (page: number) => Effect.Effect<void, never, never>;
  readonly getSelectedRecord: () => Effect.Effect<any | null, never, never>;
  readonly setSelectedRecord: (record: any | null) => Effect.Effect<void, never, never>;
  readonly resetSearchState: () => Effect.Effect<void, never, never>;
}

export const SearchStateService = Context.Tag("SearchStateService")<SearchStateService, SearchStateService>();

const makeSearchStateService = (): SearchStateService => {
  let records: any[] = [];
  let totalRecords: number = 0;
  let page: number = 1;
  let record: any | null = null;

  return {
    getSearchRecords: () => Effect.sync(() => records),

    setSearchRecords: (newRecords: any[]) => Effect.sync(() => {
      records = newRecords;
    }),

    getTotalRecords: () => Effect.sync(() => totalRecords),

    setTotalRecords: (total: number) => Effect.sync(() => {
      totalRecords = total;
    }),

    getCurrentPage: () => Effect.sync(() => page),

    setCurrentPage: (newPage: number) => Effect.sync(() => {
      page = newPage;
    }),

    getSelectedRecord: () => Effect.sync(() => record),

    setSelectedRecord: (newRecord: any | null) => Effect.sync(() => {
      record = newRecord;
    }),

    resetSearchState: () => Effect.sync(() => {
      records = [];
      totalRecords = 0;
      page = 1;
      record = null;
    })
  };
};

export const SearchStateServiceLive = Layer.succeed(SearchStateService, makeSearchStateService());
