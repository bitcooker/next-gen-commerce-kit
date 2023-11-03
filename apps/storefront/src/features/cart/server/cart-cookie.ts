import { parse } from "cookie";

const cartCookieName = "t3-commerce-cart-id";

export const getCartCookieValue = (
  cookies: string | Partial<Record<string, string>>
) =>
  typeof cookies === "string"
    ? parse(cookies)[cartCookieName]
    : cookies[cartCookieName];

export const createCartCookieOptions = (cartId: string) =>
  ({
    name: cartCookieName,
    value: cartId,
    path: "/",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    httpOnly: true,
    sameSite: "lax",
  } as const);

export const createRemoveCartCookieOptions = () =>
  ({
    name: cartCookieName,
    value: "",
    path: "/",
    maxAge: 0,
    httpOnly: true,
    sameSite: "lax",
  } as const);
