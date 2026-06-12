import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";

import { AppRuntime } from "../../packages/runtime";
import { SerieService, DiscoverSeriesFilter } from "../../packages/services";
import { SerieReturnType } from "../types";

type Options = Omit<
  UseMutationOptions<SerieReturnType, Error, DiscoverSeriesFilter>,
  "mutationKey" | "mutationFn"
>;

const useSeries = (
  options: Options = {}
): UseMutationResult<SerieReturnType, Error, DiscoverSeriesFilter> =>
  useMutation({
    mutationKey: ["UseAllSeries"],
    mutationFn: ({ page, with_genres }) =>
      AppRuntime.runPromise(
        SerieService.discover({ page, with_genres })
      ) as Promise<SerieReturnType>,
    ...options,
  });

export default useSeries;
