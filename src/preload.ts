// Preload script — runs before the renderer with access to `ipcRenderer`.
// It exposes the TMDB bridge (window.tmdbApi) the renderer uses instead of
// fetching TMDB directly. All fetching/caching now lives in the main process
// (see src/ipc/tmdb-ipc.ts).
//
// This app runs with `contextIsolation: false`, so the bridge is assigned
// straight onto the shared `window` (contextBridge requires context isolation).
import { ipcRenderer } from "electron";

import { TMDB_CHANNELS, type TmdbBridge } from "./ipc/contract";

const tmdbApi: TmdbBridge = {
  discoverMovies: (filter) =>
    ipcRenderer.invoke(TMDB_CHANNELS.discoverMovies, filter),
  discoverSeries: (filter) =>
    ipcRenderer.invoke(TMDB_CHANNELS.discoverSeries, filter),
  searchMulti: (query) => ipcRenderer.invoke(TMDB_CHANNELS.searchMulti, query),
  getSeasonById: (serieId) =>
    ipcRenderer.invoke(TMDB_CHANNELS.getSeasonById, serieId),
  getChapterBySeasonId: (lookup) =>
    ipcRenderer.invoke(TMDB_CHANNELS.getChapterBySeasonId, lookup),
  getPromoById: (mediaPath) =>
    ipcRenderer.invoke(TMDB_CHANNELS.getPromoById, mediaPath),
};

window.tmdbApi = tmdbApi;
