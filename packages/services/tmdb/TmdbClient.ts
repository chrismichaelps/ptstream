import { Effect } from "effect";

import { tmdbConfig } from "../../config";
import { HttpError } from "../../errors";
import { QueryParams, toQueryString } from "../../utils";
import { HttpClient } from "../http";

export interface TmdbRequestOptions {
  /**
   * Which API key signs the request. Season/chapter detail endpoints
   * historically use the alternate key.
   */
  readonly apiKeyVariant?: "primary" | "alternate";
}

/**
 * TMDB-aware HTTP client: builds endpoint URLs and signs every request with
 * the configured API key, so domain services only deal with paths and params.
 */
export class TmdbClient extends Effect.Service<TmdbClient>()("TmdbClient", {
  dependencies: [HttpClient.Default],
  effect: Effect.gen(function* () {
    const config = yield* tmdbConfig;
    const http = yield* HttpClient;

    const get = <A = unknown>(
      path: string,
      params: QueryParams = {},
      options: TmdbRequestOptions = {}
    ): Effect.Effect<A, HttpError> => {
      const apiKey =
        options.apiKeyVariant === "alternate"
          ? config.apiKeyAlternate
          : config.apiKey;

      const query = toQueryString({ api_key: apiKey, ...params });

      return http.getJson<A>(`${config.baseUrl}${path}?${query}`);
    };

    return { get } as const;
  })
}) {}
