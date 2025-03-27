import { useFetcher as useFetcherOrigin } from "@remix-run/react";
import { useEffect } from "react";
import { Result } from "~/utils/result.server";
import { useTranslation } from "./useTranslation";

export function useFetcher<T>({
  success,
  fail,
}: {
  success?: (data: T) => void;
  fail?: (data: T) => void;
}) {
  const fetcher = useFetcherOrigin();
  const { t } = useTranslation();

  useEffect(() => {
    if (fetcher.data) {
      const res = fetcher.data as Result;
      if (res.code === 200) {
        if (success && typeof success === "function") {
          success(res.data as T);
        } else {
          alert(t(res.message));
        }
      } else if (res.code === 500) {
        if (fail && typeof fail === "function") {
          fail(res.message as T);
        } else {
          alert(t(res.message));
        }
      } else {
        console.log('---------->');
      }
    }
  }, [fetcher.data]);

  return { fetcher };
}
