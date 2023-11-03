export const getErrorMessage = (error: unknown) =>
  typeof error === "object" &&
  error &&
  "message" in error &&
  typeof error.message === "string"
    ? error.message
    : undefined;
