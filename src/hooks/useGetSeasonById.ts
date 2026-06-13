import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";

import { AppRuntime } from "../../packages/runtime";
import { SerieService } from "../../packages/services";
import { SerieSeasonsResult } from "../types";

type Options = Omit<
  UseMutationOptions<SerieSeasonsResult, Error, number>,
  "mutationKey" | "mutationFn"
>;

const useGetSeasonById = (
  options: Options = {}
): UseMutationResult<SerieSeasonsResult, Error, number> =>
  useMutation({
    mutationKey: ["UseGetSeasonById"],
    mutationFn: (id) =>
      AppRuntime.runPromise(
        SerieService.getSeasonById(id)
      ) as Promise<SerieSeasonsResult>,
    ...options,
  });

export default useGetSeasonById;
