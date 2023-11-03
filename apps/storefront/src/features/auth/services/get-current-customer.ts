import {
  createSessionCookieHeader,
  medusa,
} from "~/integrations/medusa/client";
import { type Customer } from "~/types/customer";

export const getCurrentCustomer = async (
  sessionId: string
): Promise<Customer> => {
  try {
    const auth = await medusa.auth.getSession(
      createSessionCookieHeader(sessionId)
    );
    return {
      id: auth.customer.id,
      email: auth.customer.email,
      firstName: auth.customer.first_name,
      lastName: auth.customer.last_name,
    };
  } catch (error) {
    throw new Error("Error fetching current customer", { cause: error });
  }
};
