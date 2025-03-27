import { prisma } from "~/utils/prisma.server";
import { createUser } from "./user.server";
import { ERROR_CODE } from "~/constants/error-code";
import { verifyPassword } from "~/utils/password.server";

export const loginByPassword = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const user = await prisma.sysUser.findUnique({
    where: { email },
  });
  if (!user) {
    throw new Error(ERROR_CODE.LOGIN_ERROR_USER_NOT_FOUND);
  }
  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error(ERROR_CODE.LOGIN_ERROR_PASSWORD_INVALID);
  }
  return user;
};

export const signup = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  return await createUser({ email, password });
};
