import { Effect } from "effect";
import qs from "qs";

import HttpClientService from "../http-client/HttpClientService";
import { API_CONFIG, API_ENDPOINTS } from "../../constants";

export default {
  search: (params: { q: string }) => {
    const query = {
      query: params.q,
      api_key: API_CONFIG.TMDB.API_KEY,
      include_adult: API_CONFIG.QUERY_PARAMS.INCLUDE_ADULT,
    };

    const queryString = qs.stringify(query);

    return Effect.gen(function* () {
      const httpClientService = yield* HttpClientService;
      return yield* httpClientService.makeRequest(queryString);
    }).pipe(
      Effect.provide(
        HttpClientService.Live({
          baseUrl: API_ENDPOINTS.SEARCH.MULTI,
        })
      ),
      Effect.runPromise
    );
  },
};
