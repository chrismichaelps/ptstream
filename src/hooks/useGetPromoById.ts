import { useMutation, UseMutationResult } from "@tanstack/react-query";

import { PromoService } from "../../packages/services";

const { getPromoById } = PromoService;

type Props = {
  id: string;
}

const useGetPromoById = (
  values: any
): UseMutationResult<ReturnType<typeof getPromoById>, unknown, Props> => {
  return useMutation({
    mutationKey: ["UseGetPromoById"],
    mutationFn: async ({ id }) => {
      return getPromoById(id);
    },
    ...values,
  });
};

export default useGetPromoById;
