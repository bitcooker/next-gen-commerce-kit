import { useMutation } from "@tanstack/react-query";
import { signOut } from "next-auth/react";

import { api } from "~/utils/api";

export const useSignOut = () => {
  /*
   * Use separate tRPC procedure to remove cart cookie first. This is
   * required because Next-Auth does not support setting custom headers
   * or cookies in "signOut" event yet.
   */
  const { mutateAsync: prepareSignOut } = api.auth.prepareSignOut.useMutation();
  return useMutation({
    mutationFn: async () => {
      await prepareSignOut();
      await signOut();
    },
  });
};
