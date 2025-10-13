import { Effect } from "effect";
import qs from "qs";

import HttpClientService from "../http-client/HttpClientService";
import { SerieFilter } from "src/types";
import { API_CONFIG, API_ENDPOINTS } from "../../constants";

export default {
  all: (props: SerieFilter & { with_genres?: number }) => {
    const query: SerieFilter = {
      sort_by: API_CONFIG.QUERY_PARAMS.DEFAULT_SORT,
      api_key: API_CONFIG.TMDB.API_KEY,
      with_original_language: API_CONFIG.QUERY_PARAMS.ORIGINAL_LANGUAGE,
      include_adult: API_CONFIG.QUERY_PARAMS.INCLUDE_ADULT,
      with_type: 4,
      without_keywords: '210024,9755,272877,197251,6513,287501,290799',
      ...props,
    };

    const queryString = qs.stringify(query);

    return Effect.gen(function* () {
      const httpClientService = yield* HttpClientService;
      return yield* httpClientService.makeRequest(queryString);
    }).pipe(
      Effect.provide(
        HttpClientService.Live({
          baseUrl: API_ENDPOINTS.SERIES.DISCOVER,
        })
      ),
      Effect.runPromise
    );
  },

  getSeasonById: (id: number) => {
    const query = {
      api_key: API_CONFIG.TMDB.API_KEY,
    };

    const queryString = qs.stringify(query);

    return Effect.gen(function* () {
      const httpClientService = yield* HttpClientService;
      return yield* httpClientService.makeRequest(queryString);
    }).pipe(
      Effect.provide(
        HttpClientService.Live({
          baseUrl: `${API_CONFIG.TMDB.BASE_URL}/tv/${id}?`,
        })
      ),
      Effect.withSpan("getSeasonById", { attributes: { id } }),
      Effect.runPromise
    );
  },

  getChapterBySeasonId: ({ serieId, seasonId }: {
    serieId: number,
    seasonId: number,
  }) => {
    const query = {
      api_key: API_CONFIG.TMDB.API_KEY_ALT,
      append_to_response: 'keywords,external_ids'
    };

    const queryString = qs.stringify(query);

    return Effect.gen(function* () {
      const httpClientService = yield* HttpClientService;
      return yield* httpClientService.makeRequest(queryString);
    }).pipe(
      Effect.provide(
        HttpClientService.Live({
          baseUrl: `${API_CONFIG.TMDB.BASE_URL}/tv/${serieId}/season/${seasonId}?`,
        })
      ),
      Effect.withSpan("getChapterBySeasonId", { attributes: { serieId, seasonId } }),
      Effect.runPromise
    );
  },
};
