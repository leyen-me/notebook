import { toSuccess } from "~/utils/result.server";
import { handleActionErrors } from "~/utils/error-handler.server";
import { createFile } from "~/services/nbk.file.server";
import { LoaderFunctionArgs } from "@remix-run/node";
import { NbkFileType } from "@prisma/client";

export async function action({ request }: LoaderFunctionArgs) {
  return await handleActionErrors(async () => {
    const formData = await request.formData();
    const file = {
      name: formData.get("name") as string,
      pid: formData.get("pid") as string | null,
      type: formData.get("type") as NbkFileType,
      sort: 0,
    };
    const newFile = await createFile(file);
    return toSuccess(newFile);
  });
}
