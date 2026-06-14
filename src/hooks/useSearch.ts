import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";

import type { SearchReturnType } from "../ipc/contract";

// Re-export the shared search types so existing importers (useSearchHandler)
// keep working; the canonical definitions now live in the IPC contract.
export type { RawSearchMediaItem, SearchReturnType } from "../ipc/contract";

type SearchProps = {
  q: string;
};

type Options = Omit<
  UseMutationOptions<SearchReturnType, Error, SearchProps>,
  "mutationKey" | "mutationFn"
>;

/**
 * Multi-search. Fetching + caching happen in the main process; this hook is a
 * thin React Query wrapper over the `window.tmdbApi` IPC bridge.
 */
const useSearch = (
  options: Options = {}
): UseMutationResult<SearchReturnType, Error, SearchProps> =>
  useMutation({
    mutationKey: ["UseSearch"],
    mutationFn: ({ q }) => window.tmdbApi.searchMulti(q),
    ...options,
  });

export default useSearch;
