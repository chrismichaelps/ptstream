import { Context, Effect, Layer } from "effect";

export interface StorageService {
  readonly getItem: (key: string) => Effect.Effect<string | null, never, never>;
  readonly setItem: (key: string, value: string) => Effect.Effect<void, never, never>;
  readonly removeItem: (key: string) => Effect.Effect<void, never, never>;
  readonly clear: () => Effect.Effect<void, never, never>;
}

export const StorageService = Context.Tag("StorageService")<StorageService, StorageService>();

const makeStorageService = (): StorageService => ({
  getItem: (key: string) => Effect.sync(() => localStorage.getItem(key)),

  setItem: (key: string, value: string) => Effect.sync(() => {
    localStorage.setItem(key, value);
  }),

  removeItem: (key: string) => Effect.sync(() => {
    localStorage.removeItem(key);
  }),

  clear: () => Effect.sync(() => {
    localStorage.clear();
  })
});

export const StorageServiceLive = Layer.succeed(StorageService, makeStorageService());
