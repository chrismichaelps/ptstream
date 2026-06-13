import { Config } from "effect";

/**
 * TMDB API configuration.
 *
 * Every value can be overridden through the environment (e.g. `TMDB_API_KEY`);
 * the defaults keep the app working out of the box.
 */
export const tmdbConfig = Config.all({
  /** Root URL of the TMDB v3 REST API. */
  baseUrl: Config.string("TMDB_BASE_URL").pipe(
    Config.withDefault("https://api.themoviedb.org/3")
  ),
  /** Primary TMDB API key, used by most requests. */
  apiKey: Config.string("TMDB_API_KEY").pipe(
    Config.withDefault("a0a7e40dc8162ed7e37aa2fc97db5654")
  ),
  /** Alternate TMDB API key, used by season/chapter detail requests. */
  apiKeyAlternate: Config.string("TMDB_API_KEY_ALTERNATE").pipe(
    Config.withDefault("7ac6de5ca5060c7504e05da7b218a30c")
  )
});

export type TmdbConfig = Config.Config.Success<typeof tmdbConfig>;
