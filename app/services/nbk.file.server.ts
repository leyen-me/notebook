import { NbkFile, Prisma } from "@prisma/client";
import { NBK_FILE_TYPE_ENUM } from "~/constants";
import { prisma } from "~/utils/prisma.server";
import { buildTree, TreeNode } from "~/utils/tree.server";

const buildTreeNode = (file: NbkFile): TreeNode<NbkFile> => {
  return {
    id: file.id,
    parentId: file.pid,
    children: [],
    meta: file,
  };
};

export const getFileTree = async () => {
  const fileList = await prisma.nbkFile.findMany({
    orderBy: {
      sort: "asc",
    },
  });
  // 优先按文件夹的方式排序
  fileList.sort((a, b) => {
    if (a.type === NBK_FILE_TYPE_ENUM.FOLDER && b.type === NBK_FILE_TYPE_ENUM.FILE) {
      return -1;
    }
    return 0;
  });
  return buildTree(fileList.map(buildTreeNode));
};

export const createFile = async (file: Prisma.NbkFileCreateInput) => {
  const newFile = await prisma.nbkFile.create({
    data: file,
  });
  return newFile;
};

export const updateFile = async (file: Prisma.NbkFileUpdateInput) => {
  const updatedFile = await prisma.nbkFile.update({
    where: { id: file.id as string },
    data: file,
  });
  return updatedFile;
};

export const deleteFile = async (id: string) => {
  const deletedFile = await prisma.nbkFile.delete({
    where: { id },
  });
  return deletedFile;
};
