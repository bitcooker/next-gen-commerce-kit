import { api } from "~/utils/api";
import { useCartQueryActions } from "./use-cart-query";

export const useAddCartItem = () => {
  const { setQueryData } = useCartQueryActions();
  return api.cart.addCartItem.useMutation({
    onSuccess(data) {
      setQueryData(data);
    },
  });
};
