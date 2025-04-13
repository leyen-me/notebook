
type FormDataSchema<T> = {
  [K in keyof T]: {
    type: 'string' | 'number' | 'boolean' | 'enum';
    enumType?: any;
    required?: boolean;
    defaultValue?: T[K];
  };
};

/**
 * 将 FormData 转换为 Prisma 输入类型
 * @param formData FormData 对象
 * @param schema 字段映射配置
 * @returns 转换后的对象
 */
export function formDataToPrismaInput<T extends Record<string, unknown>>(
  formData: FormData,
  schema: FormDataSchema<T>
): T {
  const result: Partial<T> = {};

  for (const [key, config] of Object.entries(schema)) {
    const value = formData.get(key);
    
    if (value === null && config.required) {
      throw new Error(`Missing required field: ${key}`);
    }

    if (value === null && config.defaultValue !== undefined) {
      result[key as keyof T] = config.defaultValue;
      continue;
    }

    if (value === null) {
      continue;
    }

    switch (config.type) {
      case 'string':
        result[key as keyof T] = value.toString() as T[keyof T];
        break;
      case 'number':
        result[key as keyof T] = Number(value) as T[keyof T];
        break;
      case 'boolean':
        result[key as keyof T] = (value === 'true') as T[keyof T];
        break;
      case 'enum':
        if (!config.enumType) {
          throw new Error(`Enum type is required for field: ${key}`);
        }
        result[key as keyof T] = value as T[keyof T];
        break;
    }
  }

  return result as T;
} 