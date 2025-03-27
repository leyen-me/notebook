import { toError, toUnknownError } from "./result.server";

export async function handleActionErrors<T>(
  actionFn: () => Promise<T>
): Promise<T | Response> {
  try {
    return await actionFn();
  } catch (error: unknown) {
    console.log("========>");
    console.log(error.message);
    if (error instanceof Error) {
      return toError(error.message);
    }
    return toUnknownError();
  }
}
