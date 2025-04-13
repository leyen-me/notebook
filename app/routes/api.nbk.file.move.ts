import { prisma } from "~/utils/prisma.server";
import { toSuccess } from "~/utils/result.server";
import { handleActionErrors } from "~/utils/error-handler.server";
import { LoaderFunctionArgs } from "@remix-run/node";
import { ERROR_CODE } from "~/constants/error-code";
import { NBK_FILE_TYPE_ENUM } from "~/constants";

export async function action({ request }: LoaderFunctionArgs) {
  return await handleActionErrors(async () => {
    const formData = await request.formData();
    const activeId = formData.get("activeId") as string;
    const targetId = formData.get("targetId") as string;
    
    if (!activeId) {
      throw new Error(ERROR_CODE.FILE_ERROR_MISSING_FIELDS);
    }

    // 获取源文件的信息
    const activeFile = await prisma.nbkFile.findUnique({
      where: { id: activeId },
    });

    if (!activeFile) {
      throw new Error(ERROR_CODE.FILE_ERROR_NOT_FOUND);
    }

    // 如果是移动到根目录
    if (targetId === 'root') {
      // 更新文件的父文件夹为 null，保持原有的 sort 值
      await prisma.nbkFile.update({
        where: { id: activeId },
        data: {
          pid: null,
        },
      });

      return toSuccess(true);
    }

    // 获取目标文件夹的信息
    const targetFolder = await prisma.nbkFile.findUnique({
      where: { id: targetId },
    });

    if (!targetFolder) {
      throw new Error(ERROR_CODE.FILE_ERROR_TARGET_NOT_FOUND);
    }

    // 检查目标是否是文件夹
    if (targetFolder.type !== NBK_FILE_TYPE_ENUM.FOLDER) {
      throw new Error(ERROR_CODE.FILE_ERROR_TARGET_NOT_FOLDER);
    }

    // 更新文件的父文件夹，保持原有的 sort 值
    await prisma.nbkFile.update({
      where: { id: activeId },
      data: {
        pid: targetId,
      },
    });

    return toSuccess(true);
  });
} 