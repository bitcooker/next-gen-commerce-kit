import Medusa, { type AuthResource } from "@medusajs/medusa-js";

import { env } from "~/env.mjs";

/**
 * Medusa.js API client.
 *
 * @see https://docs.medusajs.com/js-client/overview
 */
export const medusa = new Medusa({
  baseUrl: env.MEDUSA_URL ?? env.NEXT_PUBLIC_MEDUSA_URL,
  maxRetries: 0,
});

/**
 * Extracts the session ID from the given authentication response.
 *
 * @param res Authentication response.
 * @returns Session ID.
 */
export const getSessionId = (
  res: Awaited<ReturnType<AuthResource["authenticate"]>>
) =>
  res.response.headers["set-cookie"]
    ?.find((value) => value.startsWith("connect.sid="))
    ?.replace(/^connect\.sid=([^;]*).*$/, "$1");

/**
 * Creates a custom headers object containing Medusa.js session cookie for
 * given session ID.
 *
 * @param sessionId Medusa.js session ID to authorize request.
 * @returns Object to be used for custom headers in API requests.
 */
export const createSessionCookieHeader = (sessionId?: string) =>
  sessionId ? { cookie: `connect.sid=${sessionId}` } : {};
