import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { useCallback } from "react";

import { type Cart } from "~/types/cart";
import { api } from "~/utils/api";

export const useCartQuery = () =>
  api.cart.getCart.useQuery(undefined, { staleTime: Infinity });

export const useCartQueryActions = () => {
  const queryClient = useQueryClient();
  const setQueryData = useCallback(
    (cart: Cart) => {
      queryClient.setQueryData(
        getQueryKey(api.cart.getCart, undefined, "query"),
        cart
      );
    },
    [queryClient]
  );
  return { setQueryData };
};
