import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";

import { AppRuntime } from "../../packages/runtime";
import { PromoService } from "../../packages/services";
import { PromoReturnType } from "../types";

type PromoLookup = {
  /** TMDB path prefix and id, e.g. `movie/123` or `tv/456`. */
  id: string;
};

type Options = Omit<
  UseMutationOptions<PromoReturnType, Error, PromoLookup>,
  "mutationKey" | "mutationFn"
>;

const useGetPromoById = (
  options: Options = {}
): UseMutationResult<PromoReturnType, Error, PromoLookup> =>
  useMutation({
    mutationKey: ["UseGetPromoById"],
    mutationFn: ({ id }) =>
      AppRuntime.runPromise(
        PromoService.getPromoById(id)
      ) as Promise<PromoReturnType>,
    ...options,
  });

export default useGetPromoById;
