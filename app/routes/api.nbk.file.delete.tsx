import { toSuccess } from "~/utils/result.server";
import { handleActionErrors } from "~/utils/error-handler.server";
import { LoaderFunctionArgs } from "@remix-run/node";
import { deleteFile } from "~/services/nbk.file.server";

export async function action({ request }: LoaderFunctionArgs) {
  return await handleActionErrors(async () => {
    const formData = await request.formData();
    const deleteStatus = await deleteFile(formData.get("id") as string);
    return toSuccess(deleteStatus);
  });
}
