import { StoreAction } from "../types";

// App actions
export const setScene = (scene: string): StoreAction<string> => ({
  type: "SET_SCENE",
  payload: scene,
});

export const setGenre = (genre: number | null): StoreAction<number | null> => ({
  type: "SET_GENRE",
  payload: genre,
});

export const resetGenre = (): StoreAction => ({
  type: "RESET_GENRE",
});

// Search actions
export const setSearchRecords = (records: any[]): StoreAction<any[]> => ({
  type: "SET_SEARCH_RECORDS",
  payload: records,
});

export const setTotalRecords = (total: number): StoreAction<number> => ({
  type: "SET_TOTAL_RECORDS",
  payload: total,
});

export const setCurrentPage = (page: number): StoreAction<number> => ({
  type: "SET_CURRENT_PAGE",
  payload: page,
});

export const setSelectedRecord = (record: any | null): StoreAction<any | null> => ({
  type: "SET_SELECTED_RECORD",
  payload: record,
});

export const resetSearchState = (): StoreAction => ({
  type: "RESET_SEARCH_STATE",
});

// Input search actions
export const setSearchQuery = (query: string): StoreAction<string> => ({
  type: "SET_SEARCH_QUERY",
  payload: query,
});

export const clearSearchQuery = (): StoreAction => ({
  type: "CLEAR_SEARCH_QUERY",
});

// Season actions
export const setSeasonSelected = (season: any | null): StoreAction<any | null> => ({
  type: "SET_SEASON_SELECTED",
  payload: season,
});

export const clearSeasonSelected = (): StoreAction => ({
  type: "CLEAR_SEASON_SELECTED",
});
