import { toSuccess } from "~/utils/result.server";
import { handleActionErrors } from "~/utils/error-handler.server";
import { updateFile } from "~/services/nbk.file.server";
import { LoaderFunctionArgs } from "@remix-run/node";

export async function action({ request }: LoaderFunctionArgs) {
  return await handleActionErrors(async () => {
    const formData = await request.formData();
    const file = {
      id: formData.get("id") as string,
      name: formData.get("name") as string,
      sort: Number(formData.get("sort")) as number,
    };
    const newFile = await updateFile(file);
    return toSuccess(newFile);
  });
}
