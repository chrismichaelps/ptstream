import { Effect } from "effect";
import qs from "qs";

import HttpClientService from "../http-client/HttpClientService";
import { SerieFilter } from "src/types";

export default {
  all: (props: SerieFilter & { with_genres?: number }) => {
    const query: SerieFilter = {
      sort_by: 'popularity.desc',
      api_key: 'a0a7e40dc8162ed7e37aa2fc97db5654',
      with_original_language: 'en',
      include_adult: false,
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
          baseUrl: "https://api.themoviedb.org/3/discover/tv?",
        })
      ),
      Effect.runPromise
    );
  },

  getSeasonById: (id: number) => {
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
          baseUrl: `https://api.themoviedb.org/3/tv/${id}?`,
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
      api_key: '7ac6de5ca5060c7504e05da7b218a30c',
      append_to_response: 'keywords,external_ids'
    };

    const queryString = qs.stringify(query);

    return Effect.gen(function* () {
      const httpClientService = yield* HttpClientService;
      return yield* httpClientService.makeRequest(queryString);
    }).pipe(
      Effect.provide(
        HttpClientService.Live({
          baseUrl: `https://api.themoviedb.org/3/tv/${serieId}/season/${seasonId}?`,
        })
      ),
      Effect.withSpan("getChapterBySeasonId", { attributes: { serieId, seasonId } }),
      Effect.runPromise
    );
  },
};
