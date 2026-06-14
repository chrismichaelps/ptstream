import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";

import type { DiscoverSeriesFilter } from "../../packages/services";
import { SerieReturnType } from "../types";

type Options = Omit<
  UseMutationOptions<SerieReturnType, Error, DiscoverSeriesFilter>,
  "mutationKey" | "mutationFn"
>;

/**
 * Discover series. Fetching + caching happen in the main process; this hook is
 * a thin React Query wrapper over the `window.tmdbApi` IPC bridge.
 */
const useSeries = (
  options: Options = {}
): UseMutationResult<SerieReturnType, Error, DiscoverSeriesFilter> =>
  useMutation({
    mutationKey: ["UseAllSeries"],
    mutationFn: (filter) => window.tmdbApi.discoverSeries(filter),
    ...options,
  });

export default useSeries;
