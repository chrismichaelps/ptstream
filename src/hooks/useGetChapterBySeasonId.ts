import { useMutation, UseMutationResult } from "@tanstack/react-query";

import { SerieService } from "../../packages/services";

const { getChapterBySeasonId } = SerieService;

type Props = {
  serieId: number;
  seasonId: number;
};

const useGetChapterBySeasonId = (
  values: any
): UseMutationResult<
  ReturnType<typeof getChapterBySeasonId>,
  unknown,
  Props
> => {
  return useMutation({
    mutationKey: ["UseGetChapterBySeasonId"],
    mutationFn: async ({ serieId, seasonId }) => {
      return getChapterBySeasonId({ serieId, seasonId });
    },
    ...values,
  });
};

export default useGetChapterBySeasonId;
