import { Effect } from "effect";
import qs from "qs";

import HttpClientService from "../http-client/HttpClientService";
import { MovieFilter } from "src/types";
import { API_CONFIG, API_ENDPOINTS } from "../../constants";

export default {
  all: (props: MovieFilter & { with_genres?: number }) => {
    const query: MovieFilter = {
      sort_by: API_CONFIG.QUERY_PARAMS.DEFAULT_SORT,
      api_key: API_CONFIG.TMDB.API_KEY,
      include_adult: API_CONFIG.QUERY_PARAMS.INCLUDE_ADULT,
      include_video: API_CONFIG.QUERY_PARAMS.INCLUDE_VIDEO,
      without_keywords: API_CONFIG.QUERY_PARAMS.WITHOUT_KEYWORDS,
      with_original_language: API_CONFIG.QUERY_PARAMS.ORIGINAL_LANGUAGE,
      ...props,
    };

    const queryString = qs.stringify(query);

    return Effect.gen(function* () {
      const httpClientService = yield* HttpClientService;
      return yield* httpClientService.makeRequest(queryString);
    }).pipe(
      Effect.provide(
        HttpClientService.Live({
          baseUrl: API_ENDPOINTS.MOVIES.DISCOVER,
        })
      ),
      Effect.runPromise
    );
  },
};
