import { REDIRECT_TO_KEY } from "~/constants";

export function useRedirectTo() {
  return typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get(REDIRECT_TO_KEY) || "/"
    : "/";
}
