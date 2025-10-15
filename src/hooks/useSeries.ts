import { useMutation, UseMutationResult } from "@tanstack/react-query";

import { SerieService } from "../../packages/services";
import { SerieFilter } from "../types";

const { all } = SerieService;

type Props = SerieFilter & { with_genres?: number };

const useSeries = (
  values: any
): UseMutationResult<ReturnType<typeof all>, unknown, Props> => {
  return useMutation({
    mutationKey: ["UseAllSeries"],
    mutationFn: async ({ page, with_genres }) => {
      return all({ page, with_genres });
    },
    ...values,
  });
};

export default useSeries;
