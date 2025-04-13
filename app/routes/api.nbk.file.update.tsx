import { toSuccess } from "~/utils/result.server";
import { handleActionErrors } from "~/utils/error-handler.server";
import { updateFile } from "~/services/nbk.file.server";
import { LoaderFunctionArgs } from "@remix-run/node";
import { NbkFileType, NbkFileContentType, Prisma } from "@prisma/client";
import { formDataToPrismaInput } from "~/utils/form-data.server";

export async function action({ request }: LoaderFunctionArgs) {
  return await handleActionErrors(async () => {
    const formData = await request.formData();

    const file = formDataToPrismaInput<Prisma.NbkFileUpdateInput>(formData, {
      id: { type: "string", required: true },
      name: { type: "string", required: true },
      type: { type: "enum", enumType: NbkFileType, required: true },
      pid: { type: "string" },
      contentType: { type: "enum", enumType: NbkFileContentType },
      sort: { type: "number", defaultValue: 0 },
    });
    
    const newFile = await updateFile(file);
    return toSuccess(newFile);
  });
}
