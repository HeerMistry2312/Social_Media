import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { TokenPayload } from "../interfaces/user.interface";
import { SECRET_KEY } from "../config/config";
import { AppError } from "../utils/customErrorHandler";
import "../types/expressExtension";
import StatusConstants from "../constant/status.constant";

export class Authentication {
  public static async authUser(req: Request, res: Response, next: NextFunction):Promise<void>{
    try {
        let token = req.header("Authorization")
        if(!token){
            throw new AppError(StatusConstants.UNAUTHORIZED.body.message,StatusConstants.UNAUTHORIZED.httpStatusCode);
        }
        token = token.replace("Bearer ","")
        if(!SECRET_KEY){
            throw new AppError(StatusConstants.UNAUTHORIZED.body.message,StatusConstants.UNAUTHORIZED.httpStatusCode);
        }
        const decodedUser = jwt.verify(token,SECRET_KEY) as TokenPayload
        req.id = decodedUser.id;
        req.email = decodedUser.email;
        next()
    } catch (error) {
        next(error)
    }
  }
}
