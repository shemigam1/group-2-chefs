import jwt, { JwtPayload } from "jsonwebtoken";
import config from "./config";

export const ResultFunction = <T>(
  success: boolean,
  message: string,
  code: number,
  data: T
) => {
  return {
    success,
    message,
    code,
    data,
  };
};

export const signJwt = (user: any) => {
  try {
    const token = jwt.sign({ id: user.id }, config.JWT_SECRET, {
      expiresIn: "1d",
    });
    return token;
  } catch (error) {
    return null;
  }
};
export const verifyJwt = (token: string) => {
  try {
    const verify = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    return verify;
  } catch (error: any) {
    return error as Error;
  }
};
