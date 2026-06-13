import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";

import { AppRuntime } from "../../packages/runtime";
import { SearchService } from "../../packages/services";
import { UniqueMovie, UniqueSerie } from "../types";

/**
 * Raw multi-search result: TMDB also returns `person` entries, which the
 * app filters out before storing.
 */
export type RawSearchMediaItem = (UniqueMovie | UniqueSerie) & {
  media_type: "movie" | "tv" | "person";
};

export type SearchReturnType = {
  page: number;
  results?: ReadonlyArray<RawSearchMediaItem>;
  total_pages: number;
  total_results?: number;
};

type SearchProps = {
  q: string;
};

type Options = Omit<
  UseMutationOptions<SearchReturnType, Error, SearchProps>,
  "mutationKey" | "mutationFn"
>;

const useSearch = (
  options: Options = {}
): UseMutationResult<SearchReturnType, Error, SearchProps> =>
  useMutation({
    mutationKey: ["UseSearch"],
    mutationFn: ({ q }) =>
      AppRuntime.runPromise(
        SearchService.multi({ query: q })
      ) as Promise<SearchReturnType>,
    ...options,
  });

export default useSearch;
