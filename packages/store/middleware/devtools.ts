import { Effect } from "effect";
import { StoreMiddleware } from "../types";

export const createDevToolsMiddleware = (): StoreMiddleware => ({
  name: "devtools",
  execute: (action, next) =>
    Effect.gen(function* () {
      // Send action to DevTools if available
      if (typeof window !== "undefined" && (window as any).__REDUX_DEVTOOLS_EXTENSION__) {
        (window as any).__REDUX_DEVTOOLS_EXTENSION__.send(action, {});
      }

      return yield* next();
    })
});
