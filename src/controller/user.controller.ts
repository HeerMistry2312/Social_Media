import { Request, Response, NextFunction } from "express";
import mongoose, { Types } from "mongoose";
import UserService from "../services/user.service";
import { AppError } from "../utils/customErrorHandler";
import StatusCode from "../enum/statusCode";
import StatusConstants from "../constant/status.constant";
import session from "express-session";

export default class UserControl {
  public static async signup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const { email, username, password } = req.body;
      const user = await UserService.signup(email, username, password, session);
      await session.commitTransaction();
      res.status(StatusCode.OK).send(user);
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }

  public static async verifyOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const { email, otp } = req.body;
      const verify = await UserService.verifyOtp(email, otp, session);
      await session.commitTransaction();
      res.status(StatusCode.OK).send(verify);
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }

  public static async regenerateOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const { email } = req.body;
      const regenerate = await UserService.regenerateOtp(email, session);
      await session.commitTransaction();
      res.status(StatusCode.OK).send(regenerate);
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }

  public static async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const { email } = req.body;
      const mailed = await UserService.forgotPassword(email, session);
      await session.commitTransaction();
      res.status(StatusCode.OK).send(mailed);
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }
  public static async validateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const { email, otp } = req.body;
      const mailed = await UserService.validateUser(email, otp, session);
      await session.commitTransaction();
      res.status(StatusCode.OK).send(mailed);
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }
  public static async resestPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const { email, password } = req.body;
      const update = await UserService.resetpassword(email, password, session);
      await session.commitTransaction();
      res.status(StatusCode.OK).send(update);
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }

  public static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const { username, password } = req.body;
      const loggedUser = await UserService.login(username, password, session);
      await session.commitTransaction();
      res.status(StatusCode.OK).send(loggedUser);
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }

  public static async resestPasswordForLoggedUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const id = req.id!;
      const { password } = req.body;
      const update = await UserService.resetpasswordForLoggedUser(
        id,
        password,
        session
      );
      await session.commitTransaction();
      res.status(StatusCode.OK).send(update);
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }

  public static async editUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const id = req.id!;
      const { email, username } = req.body;
      const update = await UserService.editUser(id, email, username, session);
      await session.commitTransaction();
      res.status(StatusCode.OK).send(update);
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }

  public static async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const id = req.id!;
      const deleteUser = await UserService.deleteUser(id, session);
      await session.commitTransaction();
      res.status(StatusCode.OK).send({message: "User Deleted Success"});
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }

  public static async logout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const id = req.id!;
      await UserService.logout(id, session);
      await session.commitTransaction();
      res.status(StatusCode.OK).send("User Logged out Success");
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }
}
