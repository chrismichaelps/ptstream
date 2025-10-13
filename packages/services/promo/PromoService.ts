import { Effect } from "effect";
import qs from "qs";

import HttpClientService from "../http-client/HttpClientService";

export default {
  getPromoById: (id: string) => {
    const query = {
      api_key: 'a0a7e40dc8162ed7e37aa2fc97db5654',
    };

    const queryString = qs.stringify(query);

    return Effect.gen(function* () {
      const httpClientService = yield* HttpClientService;
      return yield* httpClientService.makeRequest(queryString);
    }).pipe(
      Effect.provide(
        HttpClientService.Live({
          baseUrl: `https://api.themoviedb.org/3/${id}/videos?`,
        })
      ),
      Effect.withSpan("getPromoById", { attributes: { id } }),
      Effect.runPromise
    );
  },
};
