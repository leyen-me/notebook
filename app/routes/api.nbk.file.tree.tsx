import { toSuccess } from "~/utils/result.server";
import { handleActionErrors } from "~/utils/error-handler.server";
import { getFileTree } from "~/services/nbk.file.server";

export async function action() {
  return await handleActionErrors(async () => {
    const fileTree = await getFileTree();
    return toSuccess(fileTree);
  });
}
