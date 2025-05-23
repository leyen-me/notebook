import { redirect } from "@remix-run/node";
import { getSession } from "~/utils/session.server";
import { AUTH_ROUTES, REDIRECT_TO_KEY, SESSION_KEYS } from "~/constants";

// 获取用户会话信息
export async function getUserFromSession(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get(SESSION_KEYS.USER_ID);

  if (!userId) return null;
  return userId;
}

// 需要登录的路由守卫
export async function requireUser(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const user = await getUserFromSession(request);
  if (!user) {
    const searchParams = new URLSearchParams([[REDIRECT_TO_KEY, redirectTo]]);
    throw redirect(AUTH_ROUTES.LOGIN + `?${searchParams}`);
  }
  return user;
}

// 已登录用户重定向
export async function requireGuest(request: Request) {
  const user = await getUserFromSession(request);
  if (user) {
    throw redirect("/");
  }
}
