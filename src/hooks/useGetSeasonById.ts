import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";

import { SerieSeasonsResult } from "../types";

type Options = Omit<
  UseMutationOptions<SerieSeasonsResult, Error, number>,
  "mutationKey" | "mutationFn"
>;

/**
 * Fetch a serie's seasons by id. Fetching + caching happen in the main process;
 * this hook is a thin React Query wrapper over the `window.tmdbApi` IPC bridge.
 */
const useGetSeasonById = (
  options: Options = {}
): UseMutationResult<SerieSeasonsResult, Error, number> =>
  useMutation({
    mutationKey: ["UseGetSeasonById"],
    mutationFn: (id) => window.tmdbApi.getSeasonById(id),
    ...options,
  });

export default useGetSeasonById;
