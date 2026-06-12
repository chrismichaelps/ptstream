import { Effect } from "effect";

import { StoreState, StoreAction, StoreMiddleware, Store } from "./types";
import { rootReducer } from "./reducers";
import { initializeStore } from "./hooks";
import { listeners } from "./listeners";

// Store implementation
export const createStore = (
  initialState: StoreState,
  middlewares: StoreMiddleware[] = []
): Store => {
  let currentState = initialState;

  const getState = () => currentState;

  const dispatch = <T>(action: StoreAction<T>) => {
    let effect: Effect.Effect<void, never, never> = Effect.sync(() => {
      currentState = rootReducer(currentState, action);
      listeners.forEach((listener) => listener(currentState));
    });

    // Apply middlewares in reverse order (last middleware executes first)
    for (const middleware of middlewares.slice().reverse()) {
      const currentEffect = effect;
      effect = middleware.execute(action, () => currentEffect, getState);
    }

    Effect.runSync(effect);
  };

  const subscribe = (listener: (state: StoreState) => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  const store: Store = { getState, dispatch, subscribe };

  // Register as the global store used by the React hooks.
  initializeStore(store);

  return store;
};
