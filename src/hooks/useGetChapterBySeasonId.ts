import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";

import { AppRuntime } from "../../packages/runtime";
import { SerieService, ChapterLookup } from "../../packages/services";
import { SeasonChapters } from "../types";

type Options = Omit<
  UseMutationOptions<SeasonChapters, Error, ChapterLookup>,
  "mutationKey" | "mutationFn"
>;

const useGetChapterBySeasonId = (
  options: Options = {}
): UseMutationResult<SeasonChapters, Error, ChapterLookup> =>
  useMutation({
    mutationKey: ["UseGetChapterBySeasonId"],
    mutationFn: ({ serieId, seasonId }) =>
      AppRuntime.runPromise(
        SerieService.getChapterBySeasonId({ serieId, seasonId })
      ) as Promise<SeasonChapters>,
    ...options,
  });

export default useGetChapterBySeasonId;
