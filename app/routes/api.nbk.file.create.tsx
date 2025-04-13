import { toSuccess } from "~/utils/result.server";
import { handleActionErrors } from "~/utils/error-handler.server";
import { createFile } from "~/services/nbk.file.server";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Prisma } from "@prisma/client";
import { formDataToPrismaInput } from "~/utils/form-data.server";
import { NBK_FILE_TYPE_ENUM, NBK_FILE_CONTENT_ENUM } from "~/constants";

export async function action({ request }: LoaderFunctionArgs) {
  return await handleActionErrors(async () => {
    const formData = await request.formData();

    const file = formDataToPrismaInput<Prisma.NbkFileCreateInput>(formData, {
      name: { type: "string", required: true },
      type: { type: "enum", enumType: NBK_FILE_TYPE_ENUM, required: true },
      pid: { type: "string" },
      contentType: { type: "enum", enumType: NBK_FILE_CONTENT_ENUM },
      sort: { type: "number", defaultValue: 0 },
    });

    const newFile = await createFile(file);
    return toSuccess(newFile);
  });
}
