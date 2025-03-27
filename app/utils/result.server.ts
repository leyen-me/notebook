import { ERROR_CODE } from "~/constants/error-code";

export type Result<T = unknown> = {
  code: number;
  message: string;
  data: T;
};

export const toSuccess = <T>(data: T) => {
  return Response.json(
    {
      code: 200,
      message: "success",
      data,
    },
    { status: 200 }
  );
};

export const toError = (message: string) => {
  return Response.json(
    {
      code: 500,
      message,
    },
    { status: 200 }
  );
};

export const toUnknownError = () => {
  return toError(ERROR_CODE.UNKNOWN_ERROR);
};
