import { Effect } from "effect";

// Domain types shared with the renderer. The store is app-level state, so it
// is allowed to depend on the app's domain model (and nothing else from src).
import { Scene, SearchMediaItem, UniqueSerieSeason } from "../../src/types";

// Store action types
export interface StoreAction<T = unknown> {
  type: string;
  payload?: T;
  meta?: Record<string, unknown>;
}

// Store state interface
export interface StoreState {
  app: {
    currentScene: Scene;
    selectedGenre: number | null;
  };
  search: {
    records: ReadonlyArray<SearchMediaItem>;
    totalRecords: number;
    page: number;
    record: SearchMediaItem | null;
  };
  inputSearch: {
    query: string;
  };
  season: {
    seasonSelected: UniqueSerieSeason | null;
  };
}

// Middleware interface
export interface StoreMiddleware {
  name: string;
  execute: <A, E>(
    action: StoreAction,
    next: () => Effect.Effect<A, E, never>,
    getState: () => StoreState
  ) => Effect.Effect<A, E, never>;
}

// Store configuration
export interface StoreConfig {
  initialState: StoreState;
  middlewares?: StoreMiddleware[];
  devTools?: boolean;
}

// Store interface
export interface Store {
  getState: () => StoreState;
  dispatch: <T>(action: StoreAction<T>) => void;
  subscribe: (listener: (state: StoreState) => void) => () => void;
}
