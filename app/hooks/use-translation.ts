import { createContext, useCallback, useContext } from "react";
import zh from "~/locales/zh";
import en from "~/locales/en";

export const I18nContext = createContext<string | undefined>(undefined);
export const useI18nContext = (): string | undefined => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("I18nContext is not initialized");
  }
  return context;
};
export const getLocal = (lang: string | undefined) => {
  if (!lang) {
    throw new Error("I18nContext is not initialized");
  }
  return lang === "zh" ? zh : en;
};

export function useTranslation() {
  const lang = useI18nContext();
  const local = getLocal(lang);
  const t = useCallback(
    (key: string) => {
      return local[key as keyof typeof local] || key;
    },
    [local]
  );
  return { t };
}
