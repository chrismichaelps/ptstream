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
    // Store current state globally for middleware access
    (globalThis as any).__storeState = currentState;

    // Apply middlewares
    let effect = Effect.sync(() => {
      const newState = rootReducer(currentState, action);
      currentState = newState;

      // Update global state reference
      (globalThis as any).__storeState = newState;

      // Notify global listeners
      listeners.forEach(listener => listener(newState));
    });

    // Apply middlewares in reverse order (last middleware executes first)
    for (const middleware of middlewares.slice().reverse()) {
      const currentEffect = effect;
      effect = middleware.execute(action, () => currentEffect);
    }

    // Execute the middleware chain
    Effect.runSync(effect);
  };

  const subscribe = (listener: (state: StoreState) => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  // Initialize global store
  initializeStore({ dispatch, getState, subscribe }, initialState);

  return {
    getState,
    dispatch,
    subscribe,
  };
};
