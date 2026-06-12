import { StoreState, StoreConfig, StoreMiddleware } from "./types";
import { createLoggerMiddleware, createDevToolsMiddleware } from "./middleware";

// Default initial state
const defaultInitialState: StoreState = {
  app: {
    currentScene: "series",
    selectedGenre: null,
  },
  search: {
    records: [],
    totalRecords: 0,
    page: 1,
    record: null,
  },
  inputSearch: {
    query: "",
  },
  season: {
    seasonSelected: null,
  },
};

// Define store configuration
export const defineConfig = (config: Partial<StoreConfig> = {}) => {
  const {
    initialState = defaultInitialState,
    middlewares = [],
    devTools = process.env.NODE_ENV === "development",
  } = config;

  // Build middleware array
  const allMiddlewares: StoreMiddleware[] = [
    ...middlewares,
    createLoggerMiddleware({
      duration: true,
      timestamp: true,
      diff: false,
      // Log only in development
      predicate: () => process.env.NODE_ENV === "development",
    }),
    ...(devTools ? [createDevToolsMiddleware()] : []),
  ];

  return {
    initialState,
    middlewares: allMiddlewares,
  };
};
