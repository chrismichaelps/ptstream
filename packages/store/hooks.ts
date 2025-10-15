import { useState, useEffect, useCallback } from "react";
import { StoreState } from "./types";
import { listeners } from "./listeners";

// Global store instance
let globalStore: any = null;
let globalState: StoreState;

// Initialize store
export const initializeStore = (store: any, initialState: StoreState) => {
  globalStore = store;
  globalState = initialState;
};

// Hook to get the entire state
export const useStoreState = () => {
  const [state, setState] = useState<StoreState>(() => globalState || {
    app: { currentScene: "series", selectedGenre: null },
    search: { records: [], totalRecords: 0, page: 1, record: null },
    inputSearch: { query: "" },
    season: { seasonSelected: null }
  });

  useEffect(() => {
    const listener = (newState: StoreState) => setState(newState);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return state;
};

// Hook to get a specific slice of state
export const useStoreSelector = <T>(selector: (state: StoreState) => T) => {
  const [selectedState, setSelectedState] = useState<T>(() => {
    if (globalState) {
      return selector(globalState);
    }
    // Provide fallback state
    const fallbackState: StoreState = {
      app: { currentScene: "series", selectedGenre: null },
      search: { records: [], totalRecords: 0, page: 1, record: null },
      inputSearch: { query: "" },
      season: { seasonSelected: null }
    };
    return selector(fallbackState);
  });

  useEffect(() => {
    const listener = (newState: StoreState) => {
      const newSelectedState = selector(newState);
      setSelectedState(newSelectedState);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, [selector]);

  return selectedState;
};

// Hook to dispatch actions
export const useStoreDispatch = () => {
  return useCallback(<T>(action: { type: string; payload?: T; meta?: Record<string, any> }) => {
    if (globalStore) {
      globalStore.dispatch(action);
    }
  }, []);
};

// Specific hooks for different parts of the state
export const useAppState = () => useStoreSelector(state => state.app);
export const useSearchState = () => useStoreSelector(state => state.search);
export const useInputSearchState = () => useStoreSelector(state => state.inputSearch);
export const useSeasonState = () => useStoreSelector(state => state.season);

// Specific selectors
export const useCurrentScene = () => useStoreSelector(state => state.app.currentScene);
export const useSelectedGenre = () => useStoreSelector(state => state.app.selectedGenre);
export const useSearchRecords = () => useStoreSelector(state => state.search.records);
export const useTotalRecords = () => useStoreSelector(state => state.search.totalRecords);
export const useCurrentPage = () => useStoreSelector(state => state.search.page);
export const useSelectedRecord = () => useStoreSelector(state => state.search.record);
export const useSearchQuery = () => useStoreSelector(state => state.inputSearch.query);
export const useSeasonSelected = () => useStoreSelector(state => state.season.seasonSelected);
