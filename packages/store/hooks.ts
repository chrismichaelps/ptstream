import { useCallback, useSyncExternalStore } from "react";

import { Store, StoreAction, StoreState } from "./types";

// Used before a StoreProvider has created the real store (e.g. in tests).
const fallbackState: StoreState = {
  app: { currentScene: "series", selectedGenre: null },
  search: { records: [], totalRecords: 0, page: 1, record: null },
  inputSearch: { query: "" },
  season: { seasonSelected: null },
};

// Global store instance (single renderer-wide store)
let globalStore: Store | null = null;

export const initializeStore = (store: Store) => {
  globalStore = store;
};

const subscribe = (onStoreChange: () => void) =>
  globalStore ? globalStore.subscribe(onStoreChange) : () => {};

const getState = (): StoreState =>
  globalStore ? globalStore.getState() : fallbackState;

// Hook to get the entire state
export const useStoreState = (): StoreState =>
  useSyncExternalStore(subscribe, getState);

// Hook to get a specific slice of state.
// NOTE: the selector must return a value held inside the state (or a
// primitive); returning a freshly-created object on every call would defeat
// useSyncExternalStore's equality check and re-render endlessly.
export const useStoreSelector = <T>(selector: (state: StoreState) => T): T =>
  useSyncExternalStore(subscribe, () => selector(getState()));

// Hook to dispatch actions
export const useStoreDispatch = () =>
  useCallback(<T>(action: StoreAction<T>) => {
    globalStore?.dispatch(action);
  }, []);

// Specific hooks for different parts of the state
export const useAppState = () => useStoreSelector((state) => state.app);
export const useSearchState = () => useStoreSelector((state) => state.search);
export const useInputSearchState = () =>
  useStoreSelector((state) => state.inputSearch);
export const useSeasonState = () => useStoreSelector((state) => state.season);

// Specific selectors
export const useCurrentScene = () =>
  useStoreSelector((state) => state.app.currentScene);
export const useSelectedGenre = () =>
  useStoreSelector((state) => state.app.selectedGenre);
export const useSearchRecords = () =>
  useStoreSelector((state) => state.search.records);
export const useTotalRecords = () =>
  useStoreSelector((state) => state.search.totalRecords);
export const useCurrentPage = () =>
  useStoreSelector((state) => state.search.page);
export const useSelectedRecord = () =>
  useStoreSelector((state) => state.search.record);
export const useSearchQuery = () =>
  useStoreSelector((state) => state.inputSearch.query);
export const useSeasonSelected = () =>
  useStoreSelector((state) => state.season.seasonSelected);
