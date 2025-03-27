export const getLang = () => {
  const lang = process.env.APP_LANG || "zh";
  return lang;
};
