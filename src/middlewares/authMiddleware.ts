import { NextFunction, Request, Response } from "express";
import { ResultFunction, verifyJwt } from "../helpers/utils";
import { prisma } from "../database/conn";
import { JwtPayload } from "jsonwebtoken";

const authMiddleWare = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // extract auth header
  const authorization = req.headers.authorization;
  const response = ResultFunction(
    false,
    "invalid or missing token",
    401,
    null
  );

  if (!authorization) {
    return res.status(response.code).json(response);
  }

  // check if token is bearer token

  if (authorization.startsWith("Bearer ") === false) {
    return res.status(response.code).json(response);
  }

  const token = authorization.split(" ")[1];
  // extract jwt token
  if (!token) {
    return res.status(response.code).json(response);
  }

  // verify jwt token
  const payload = verifyJwt(token);
  if (payload instanceof Error) {
    return res.status(response.code).json(response);
  }

  const payloadId = (payload as JwtPayload).id;
  const id = payloadId || req.params.userId;
  if (!id) {
    return res.status(response.code).json(response);
  }
  // // find user and add to res object
  const data = await prisma.user.findFirst({ where: { id, is_deleted: false } });
  if (!data) {
    return res.status(response.code).json(response);
  }
  const user = {
    ...data,
    token,
  };
  // console.log(user);

  res.locals.user = user;

  next();
};

export default authMiddleWare;
