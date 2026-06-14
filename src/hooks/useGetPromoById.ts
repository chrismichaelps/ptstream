import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";

import { PromoReturnType } from "../types";

type PromoLookup = {
  /** TMDB path prefix and id, e.g. `movie/123` or `tv/456`. */
  id: string;
};

type Options = Omit<
  UseMutationOptions<PromoReturnType, Error, PromoLookup>,
  "mutationKey" | "mutationFn"
>;

/**
 * Fetch a title's promo (trailer) by id. Fetching + caching happen in the main
 * process; this hook is a thin React Query wrapper over the `window.tmdbApi`
 * IPC bridge.
 */
const useGetPromoById = (
  options: Options = {}
): UseMutationResult<PromoReturnType, Error, PromoLookup> =>
  useMutation({
    mutationKey: ["UseGetPromoById"],
    mutationFn: ({ id }) => window.tmdbApi.getPromoById(id),
    ...options,
  });

export default useGetPromoById;
