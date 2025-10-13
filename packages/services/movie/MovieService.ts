import { Effect } from "effect";
import qs from "qs";

import HttpClientService from "../http-client/HttpClientService";
import { MovieFilter } from "src/types";

export default {
  all: (props: MovieFilter & { with_genres?: number }) => {
    const query: MovieFilter = {
      sort_by: "popularity.desc",
      api_key: "a0a7e40dc8162ed7e37aa2fc97db5654",
      include_adult: false,
      include_video: true,
      without_keywords: "478,210024",
      with_original_language: "en",
      ...props,
    };

    const queryString = qs.stringify(query);

    return Effect.gen(function* () {
      const httpClientService = yield* HttpClientService;
      return yield* httpClientService.makeRequest(queryString);
    }).pipe(
      Effect.provide(
        HttpClientService.Live({
          baseUrl: "https://api.themoviedb.org/3/discover/movie?",
        })
      ),
      Effect.runPromise
    );
  },
};
