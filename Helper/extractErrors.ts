import { AxiosError } from "axios";

export const extractErrors = (error: AxiosError): string => {
  if (!error.response || !error.response.data) {
    return "An unexpected error occurred.";
  }

  const { data } = error.response;

  if (typeof data === "object" && data !== null && "details" in data) {
    const details = (data as { details: Record<string, string[]> }).details;

    const firstField = Object.keys(details)[0];
    const firstError = details[firstField][0];

    return `${firstField}: ${firstError}` || "Validation error occurred.";
  }

  return (data as { message?: string }).message || "An error occurred.";
};