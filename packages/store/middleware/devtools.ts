import { Effect } from "effect";

import { StoreMiddleware } from "../types";

type DevToolsWindow = Window & {
  __REDUX_DEVTOOLS_EXTENSION__?: {
    send: (action: unknown, state: unknown) => void;
  };
};

export const createDevToolsMiddleware = (): StoreMiddleware => ({
  name: "devtools",
  execute: (action, next, getState) =>
    Effect.gen(function* () {
      const result = yield* next();

      if (typeof window !== "undefined") {
        (window as DevToolsWindow).__REDUX_DEVTOOLS_EXTENSION__?.send(
          action,
          getState()
        );
      }

      return result;
    }),
});
