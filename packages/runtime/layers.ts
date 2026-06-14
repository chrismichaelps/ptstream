import { Layer } from "effect";

import { StorageService } from "../services";

/**
 * Renderer-side service graph.
 *
 * Only browser-backed services live here now — `StorageService` wraps
 * `localStorage`. The TMDB network services (Movie/Serie/Search/Promo) moved to
 * the main process (see `./tmdb` and `src/ipc`) and are reached over IPC, so the
 * renderer bundle no longer contains TMDB request code or API keys.
 */
export const AppLayer = Layer.mergeAll(StorageService.Default);

export type AppServices = Layer.Layer.Success<typeof AppLayer>;
