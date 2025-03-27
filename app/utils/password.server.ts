import bcrypt from "bcryptjs";

// 加密密码
export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10); // 生成salt，10是推荐的加密轮数
  return bcrypt.hash(password, salt);
};

// 验证密码
export const verifyPassword = async (
  password: string,
  hashedPassword: string
) => {
  return bcrypt.compare(password, hashedPassword);
};
