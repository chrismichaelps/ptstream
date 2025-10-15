import { Effect } from "effect";

// Store action types
export interface StoreAction<T = any> {
  type: string;
  payload?: T;
  meta?: Record<string, any>;
}

// Store state interface
export interface StoreState {
  app: {
    currentScene: string;
    selectedGenre: number | null;
  };
  search: {
    records: any[];
    totalRecords: number;
    page: number;
    record: any | null;
  };
  inputSearch: {
    query: string;
  };
  season: {
    seasonSelected: any | null;
  };
}

// Middleware interface
export interface StoreMiddleware {
  name: string;
  execute: <A, E>(
    action: StoreAction,
    next: () => Effect.Effect<A, E, never>
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
