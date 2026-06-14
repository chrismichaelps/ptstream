import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";

import type { ChapterLookup } from "../../packages/services";
import { SeasonChapters } from "../types";

type Options = Omit<
  UseMutationOptions<SeasonChapters, Error, ChapterLookup>,
  "mutationKey" | "mutationFn"
>;

/**
 * Fetch a season's chapters. Fetching + caching happen in the main process;
 * this hook is a thin React Query wrapper over the `window.tmdbApi` IPC bridge.
 */
const useGetChapterBySeasonId = (
  options: Options = {}
): UseMutationResult<SeasonChapters, Error, ChapterLookup> =>
  useMutation({
    mutationKey: ["UseGetChapterBySeasonId"],
    mutationFn: (lookup) => window.tmdbApi.getChapterBySeasonId(lookup),
    ...options,
  });

export default useGetChapterBySeasonId;
