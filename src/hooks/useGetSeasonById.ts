import { useMutation, UseMutationResult } from "@tanstack/react-query";

import { SerieService } from "../../packages/services";

const { getSeasonById } = SerieService;

const useGetSeasonById = (
  values: any
): UseMutationResult<ReturnType<typeof getSeasonById>, unknown, number> => {
  return useMutation({
    mutationKey: ["UseGetSeasonById"],
    mutationFn: async (id) => {
      return getSeasonById(id);
    },
    ...values,
  });
};

export default useGetSeasonById;
