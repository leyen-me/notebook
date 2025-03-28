import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { loginByPassword } from "~/services/auth.server";
import { handleActionErrors } from "~/utils/error-handler.server";
import { commitSession, getSession } from "~/utils/session.server";
import { REDIRECT_TO_KEY, SESSION_KEYS } from "~/constants";

export async function action({ request }: LoaderFunctionArgs) {
  return await handleActionErrors(async () => {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const redirectTo = formData.get(REDIRECT_TO_KEY) as string;
    const user = await loginByPassword({ email, password });
    const session = await getSession(request.headers.get("Cookie"));
    session.set(SESSION_KEYS.USER_ID, user.id);
    return redirect(redirectTo, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  });
}
