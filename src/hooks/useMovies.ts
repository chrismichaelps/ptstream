import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";

import { AppRuntime } from "../../packages/runtime";
import { MovieService, DiscoverMoviesFilter } from "../../packages/services";
import { MovieReturnType } from "../types";

type Options = Omit<
  UseMutationOptions<MovieReturnType, Error, DiscoverMoviesFilter>,
  "mutationKey" | "mutationFn"
>;

const useMovies = (
  options: Options = {}
): UseMutationResult<MovieReturnType, Error, DiscoverMoviesFilter> =>
  useMutation({
    mutationKey: ["UseAllMovies"],
    mutationFn: ({ page, with_genres }) =>
      AppRuntime.runPromise(
        MovieService.discover({ page, with_genres })
      ) as Promise<MovieReturnType>,
    ...options,
  });

export default useMovies;
