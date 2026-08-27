import type { NextFunction, Response } from "express";
import type { MyRequest } from "../types/Request.js";
export default function verifyToken(req: MyRequest, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=jwtVerify.d.ts.map