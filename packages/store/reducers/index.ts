import { Scene, SearchMediaItem, UniqueSerieSeason } from "../../../src/types";
import { StoreState, StoreAction } from "../types";

// App reducer
export const appReducer = (
  state: StoreState["app"],
  action: StoreAction
): StoreState["app"] => {
  switch (action.type) {
    case "SET_SCENE":
      return { ...state, currentScene: action.payload as Scene };
    case "SET_GENRE":
      return { ...state, selectedGenre: action.payload as number | null };
    case "RESET_GENRE":
      return { ...state, selectedGenre: null };
    default:
      return state;
  }
};

// Search reducer
export const searchReducer = (
  state: StoreState["search"],
  action: StoreAction
): StoreState["search"] => {
  switch (action.type) {
    case "SET_SEARCH_RECORDS":
      return {
        ...state,
        records: action.payload as ReadonlyArray<SearchMediaItem>,
      };
    case "SET_TOTAL_RECORDS":
      return { ...state, totalRecords: action.payload as number };
    case "SET_CURRENT_PAGE":
      return { ...state, page: action.payload as number };
    case "SET_SELECTED_RECORD":
      return { ...state, record: action.payload as SearchMediaItem | null };
    case "RESET_SEARCH_STATE":
      return { records: [], totalRecords: 0, page: 1, record: null };
    default:
      return state;
  }
};

// Input search reducer
export const inputSearchReducer = (
  state: StoreState["inputSearch"],
  action: StoreAction
): StoreState["inputSearch"] => {
  switch (action.type) {
    case "SET_SEARCH_QUERY":
      return { ...state, query: action.payload as string };
    case "CLEAR_SEARCH_QUERY":
      return { ...state, query: "" };
    default:
      return state;
  }
};

// Season reducer
export const seasonReducer = (
  state: StoreState["season"],
  action: StoreAction
): StoreState["season"] => {
  switch (action.type) {
    case "SET_SEASON_SELECTED":
      return {
        ...state,
        seasonSelected: action.payload as UniqueSerieSeason | null,
      };
    case "CLEAR_SEASON_SELECTED":
      return { ...state, seasonSelected: null };
    default:
      return state;
  }
};

// Root reducer
export const rootReducer = (
  state: StoreState,
  action: StoreAction
): StoreState => ({
  app: appReducer(state.app, action),
  search: searchReducer(state.search, action),
  inputSearch: inputSearchReducer(state.inputSearch, action),
  season: seasonReducer(state.season, action),
});
