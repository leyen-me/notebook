export const APP_NAME = "Notebook";

export const REDIRECT_TO_KEY = "redirectTo";
export const SESSION_KEYS = {
  USER_ID: "USER_ID",
};

export const DIALOG_OPEN_TYPE = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
};

export type DialogOpenType = keyof typeof DIALOG_OPEN_TYPE;

// API 路由
export const API_ROUTES = {
  API_AUTH_LOGIN: "/api/auth/login",
  API_AUTH_SIGNUP: "/api/auth/signup",

  API_NBK_FILE_TREE: "/api/nbk/file/tree",
  API_NBK_FILE_CREATE: "/api/nbk/file/create",
  API_NBK_FILE_UPDATE: "/api/nbk/file/update",
  API_NBK_FILE_DELETE: "/api/nbk/file/delete",
};

// 认证路由
export const AUTH_ROUTES = {
  LOGIN: "/auth/login",
  SIGNUP: "/auth/signup",
};

// 认证白名单
export const AUTH_WHITE_ROUTES = [
  ...Object.values(AUTH_ROUTES),
  "/api/auth/login",
  "/api/auth/signup",
  "/public/about",
  "/public/product",
];
