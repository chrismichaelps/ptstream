import { useMutation, UseMutationResult } from "@tanstack/react-query";

import { MovieService } from "../../packages/services";
import { MovieFilter } from "../types";

const { all } = MovieService;

type Props = MovieFilter & { with_genres?: number };

const useMovies = (
  values: any
): UseMutationResult<ReturnType<typeof all>, unknown, Props> => {
  return useMutation({
    mutationKey: ["UseAllMovies"],
    mutationFn: async ({ page, with_genres }) => {
      return all({ page, with_genres });
    },
    ...values,
  });
};

export default useMovies;
