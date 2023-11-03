import { authRouter } from "~/features/auth/server/api/auth-router";
import { cartRouter } from "~/features/cart/server/api/cart-router";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary API router for your server.
 *
 * All sub-routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  cart: cartRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;
