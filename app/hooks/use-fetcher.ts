import { useFetcher as useFetcherOrigin } from "@remix-run/react";
import { useEffect } from "react";
import { Result } from "~/utils/result.server";
import { useTranslation } from "./use-translation";
import { useToast } from "./use-toast";

export function useFetcher<T>({
  success,
  fail,
  action,
}: {
  success?: (data: T) => void;
  fail?: (data: T) => void;
  action: string;
}) {
  const fetcher = useFetcherOrigin();
  const { t } = useTranslation();
  const { toast } = useToast();

  useEffect(() => {
    if (fetcher.data) {
      const res = fetcher.data as Result;
      if (res.code === 200) {
        if (success && typeof success === "function") {
          success(res.data as T);
        } else {
          toast({
            title: "Error",
            variant: "destructive",
            description: t(res.message),
          });
        }
      } else if (res.code === 500) {
        if (fail && typeof fail === "function") {
          fail(res.message as T);
        } else {
          toast({
            title: "Error",
            variant: "destructive",
            description: t(res.message),
          });
        }
      }
    }
  }, [fetcher.data]);

  const submit = (data?: any) => {
    fetcher.submit(data || null, {
      method: "POST",
      action: action,
    });
  };

  return { fetcher, action, submit };
}
