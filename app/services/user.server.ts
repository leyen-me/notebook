import { prisma } from "~/utils/prisma.server";
import { ERROR_CODE } from "~/constants/error-code";
import { hashPassword } from "~/utils/password.server";

export const createUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const existingUser = await prisma.sysUser.findUnique({
    where: { email },
  });
  if (existingUser) {
    throw new Error(ERROR_CODE.SIGNUP_ERROR_USER_ALREADY_EXISTS);
  }
  const hashedPassword = await hashPassword(password);
  const user = await prisma.sysUser.create({
    data: {
      email,
      password: hashedPassword,
    },
  });
  return user.id;
};
