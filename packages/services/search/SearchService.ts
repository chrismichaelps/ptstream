import { Effect } from "effect";
import qs from "qs";

import HttpClientService from "../http-client/HttpClientService";

export default {
  search: (params: { q: string }) => {
    const query = {
      query: params.q,
      api_key: "a0a7e40dc8162ed7e37aa2fc97db5654",
      include_adult: false,
    };

    const queryString = qs.stringify(query);

    return Effect.gen(function* () {
      const httpClientService = yield* HttpClientService;
      return yield* httpClientService.makeRequest(queryString);
    }).pipe(
      Effect.provide(
        HttpClientService.Live({
          baseUrl: "https://api.themoviedb.org/3/search/multi?",
        })
      ),
      Effect.runPromise
    );
  },
};
