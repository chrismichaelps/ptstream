import { Context, Effect, Layer } from "effect";

export interface InputSearchService {
  readonly getSearchQuery: () => Effect.Effect<string, never, never>;
  readonly setSearchQuery: (query: string) => Effect.Effect<void, never, never>;
  readonly clearSearchQuery: () => Effect.Effect<void, never, never>;
}

export const InputSearchService = Context.Tag("InputSearchService")<InputSearchService, InputSearchService>();

const makeInputSearchService = (): InputSearchService => {
  let query: string = '';

  return {
    getSearchQuery: () => Effect.sync(() => query),

    setSearchQuery: (newQuery: string) => Effect.sync(() => {
      query = newQuery;
    }),

    clearSearchQuery: () => Effect.sync(() => {
      query = '';
    })
  };
};

export const InputSearchServiceLive = Layer.succeed(InputSearchService, makeInputSearchService());
