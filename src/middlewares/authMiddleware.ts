import { Request, Response, NextFunction } from "express";
import { prisma } from "../database/conn";
import { verifyJwt } from "../helpers/utils";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization?.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or missing token" });
    }

    const token = authorization.split(" ")[1];
    const payload = verifyJwt(token) as { id: string };

    if (!payload?.id) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    // ✅ Get user from DB using JWT payload, NOT req.body
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: payload.id },
      select: {
        id: true,
        username: true,
        email: true,
        profile_pic: true,
        bio: true,
        cooking_skill_level: true,
      },
    });

    res.locals.user = { ...user, token };
    next();
  } catch (error: any) {
    console.error("Auth Middleware Error:", error);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

export default authMiddleware;

// import { NextFunction, Request, Response } from "express";
// import { ResultFunction, verifyJwt } from "../helpers/utils";
// import { prisma } from "../database/conn";

// const authMiddleware = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const authorization = req.headers.authorization;

//     if (!authorization || !authorization.startsWith("Bearer ")) {
//       const response = ResultFunction(
//         false,
//         "Invalid or missing token",
//         401,
//         null
//       );
//       return res.status(response.code).json(response);
//     }

//     const token = authorization.split(" ")[1];

//     // verify JWT token; if invalid, verifyJwt should throw
//     const payload = verifyJwt(token) as { id: string };

//     if (!payload || !payload.id) {
//       const response = ResultFunction(false, "Invalid token", 401, null);
//       return res.status(response.code).json(response);
//     }

//     const user = await prisma.user.findUniqueOrThrow({
//       where: { id: payload.id },
//       select: {
//         id: true,
//         username: true,
//         email: true,
//         profile_pic: true,
//         bio: true,
//         cooking_skill_level: true,
//       },
//     });

//     res.locals.user = { ...user, token };
//     next();
//   } catch (error: any) {
//     console.error("Auth Middleware Error:", error);
//     const response = ResultFunction(false, "Unauthorized", 401, null);
//     return res.status(response.code).json(response);
//   }
// };

// export default authMiddleware;
