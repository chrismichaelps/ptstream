import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";

import type { DiscoverMoviesFilter } from "../../packages/services";
import { MovieReturnType } from "../types";

type Options = Omit<
  UseMutationOptions<MovieReturnType, Error, DiscoverMoviesFilter>,
  "mutationKey" | "mutationFn"
>;

/**
 * Discover movies. Fetching + caching happen in the main process; this hook is
 * a thin React Query wrapper over the `window.tmdbApi` IPC bridge.
 */
const useMovies = (
  options: Options = {}
): UseMutationResult<MovieReturnType, Error, DiscoverMoviesFilter> =>
  useMutation({
    mutationKey: ["UseAllMovies"],
    mutationFn: (filter) => window.tmdbApi.discoverMovies(filter),
    ...options,
  });

export default useMovies;
