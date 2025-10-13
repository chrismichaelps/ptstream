import { Effect } from "effect";
import qs from "qs";

import HttpClientService from "../http-client/HttpClientService";
import { API_CONFIG } from "../../constants";

export default {
  getPromoById: (id: string) => {
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
          baseUrl: `${API_CONFIG.TMDB.BASE_URL}/${id}/videos?`,
        })
      ),
      Effect.withSpan("getPromoById", { attributes: { id } }),
      Effect.runPromise
    );
  },
};
