import FollowService from "../services/follow.service";
import { Request, Response, NextFunction } from "express";
import mongoose, { Types } from "mongoose";
import StatusCode from "../enum/statusCode";

export default class FollowControl {
  public static async sendRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const id = req.id!;
      const { name } = req.body;
      const request = await FollowService.sendRequestToFollow(
        id,
        name,
        session
      );
      await session.commitTransaction();
      res.status(StatusCode.OK).send(request);
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }

  public static async listOfRequests(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const { page = 1, pageSize = 2, searchQuery, sortBy } = req.query;
      const id = req.id!;
      const requests = await FollowService.listOfRequests(
        id,
        session,
        +page,
        +pageSize,
        searchQuery as string,
        sortBy as string
      );

      await session.commitTransaction();
      res.status(StatusCode.OK).send(requests);
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }

  public static async confirmRequests(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const { page = 1, pageSize = 2, searchQuery, sortBy } = req.query;
      const id = req.id!;
      const { name } = req.body;
      const requests = await FollowService.confirmRequest(
        id,
        name,
        session,
        +page,
        +pageSize,
        searchQuery as string,
        sortBy as string
      );

      await session.commitTransaction();
      res.status(StatusCode.OK).send(requests);
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }

  public static async deleteRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const { page = 1, pageSize = 2, searchQuery, sortBy } = req.query;
      const id = req.id!;
      const { name } = req.body;
      const requests = await FollowService.deleteRequest(
        id,
        name,
        session,
        +page,
        +pageSize,
        searchQuery as string,
        sortBy as string
      );
      await session.commitTransaction();
      res.status(StatusCode.OK).send(requests);
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }

  public static async unfollowUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>{
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const { page = 1, pageSize = 2, searchQuery, sortBy } = req.query;
      const id = req.id!;
      const { name } = req.body;
      const requests = await FollowService.unfollowUser(
        id,
        name,
        session,
        +page,
        +pageSize,
        searchQuery as string,
        sortBy as string
      );
      await session.commitTransaction();
      res.status(StatusCode.OK).send(requests);
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }
}
