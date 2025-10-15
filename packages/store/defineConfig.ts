import { StoreState, StoreConfig, StoreMiddleware } from "./types";
import { createLoggerMiddleware, createDevToolsMiddleware } from "../services/logger";

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
      collapsed: false,
      duration: true,
      timestamp: true,
      diff: false,
      predicate: (getState, action) => {
        // Log all actions in development, filter in production
        return process.env.NODE_ENV === 'development';
      }
    }),
    ...(devTools ? [createDevToolsMiddleware()] : []),
  ];

  return {
    initialState,
    middlewares: allMiddlewares,
  };
};

// Helper to create store with common configurations
export const createStoreConfig = {
  // Development store with all middlewares
  development: () => defineConfig({
    devTools: true,
    middlewares: [createLoggerMiddleware()],
  }),

  // Production store with minimal middlewares
  production: () => defineConfig({
    devTools: false,
    middlewares: [],
  }),

  // Custom store with specific middlewares
  custom: (middlewares: StoreMiddleware[], devTools = false) => defineConfig({
    middlewares,
    devTools,
  }),
};
