import { NbkFile, Prisma } from "@prisma/client";
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
  return buildTree(fileList.map(buildTreeNode));
};

export const createFile = async (file: Prisma.NbkFileCreateInput) => {
  const newFile = await prisma.nbkFile.create({
    data: file,
  });
  return newFile;
};

export const deleteFile = async (id: string) => {
  const deletedFile = await prisma.nbkFile.delete({
    where: { id },
  });
  return deletedFile;
};
