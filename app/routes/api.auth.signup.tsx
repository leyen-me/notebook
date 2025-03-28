import { LoaderFunctionArgs } from "@remix-run/node";
import { toSuccess } from "~/utils/result.server";
import { handleActionErrors } from "~/utils/error-handler.server";
import { signup } from "~/services/auth.server";

export async function action({ request }: LoaderFunctionArgs) {
  return await handleActionErrors(async () => {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const userId = await signup({ email, password });
    return toSuccess(userId);
  });
}
