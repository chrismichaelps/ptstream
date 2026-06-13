import { Effect } from "effect";

/** Effect-wrapped `localStorage` access. */
export class StorageService extends Effect.Service<StorageService>()(
  "StorageService",
  {
    accessors: true,
    sync: () => ({
      getItem: (key: string) => Effect.sync(() => localStorage.getItem(key)),

      setItem: (key: string, value: string) =>
        Effect.sync(() => {
          localStorage.setItem(key, value);
        }),

      removeItem: (key: string) =>
        Effect.sync(() => {
          localStorage.removeItem(key);
        }),

      clear: () =>
        Effect.sync(() => {
          localStorage.clear();
        })
    })
  }
) {}
