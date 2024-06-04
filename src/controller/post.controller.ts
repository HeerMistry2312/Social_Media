import { Request, Response, NextFunction } from "express";
import mongoose, { Types } from "mongoose";
import StatusCode from "../enum/statusCode";
import PostService from "../services/post.service";

export default class PostControl {
  public static async createPost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const id = req.id!;
      const { title, content } = req.body;
      const post = await PostService.createPost(id, title, content, session);
      await session.commitTransaction();
      res.status(StatusCode.OK).send(post);
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }

  public static async updatePost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const id = req.id!;
      const updateTitle = req.params.title;
      const { title, content } = req.body;
      const post = await PostService.updatePost(
        id,
        updateTitle,
        title,
        content,
        session
      );
      await session.commitTransaction();
      res.status(StatusCode.OK).send(post);
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }

  public static async deletePost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const id = req.id!;
      const title = req.params.title;
      const deletePost = await PostService.deletePost(id, title, session);
      await session.commitTransaction();
      res.status(StatusCode.OK).send(deletePost);
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }
  public static async getOnePost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const id = req.id!;
      const title = req.params.title;
      const getPost = await PostService.getOnePost(id, title, session);
      await session.commitTransaction();
      res.status(StatusCode.OK).send(getPost);
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }
  public static async getAllPost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const id = req.id!;
      const { page = 1, pagesize = 4, searchQuery, sortBy } = req.query;
      const posts = await PostService.getAllPost(
        id,
        +page,
        +pagesize,
        session,
        searchQuery as string,
        sortBy as string
      );
      await session.commitTransaction();
      res.status(StatusCode.OK).send(posts);
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }
  public static async allPost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const id = req.id!;
      const { page = 1, pagesize = 4, searchQuery, sortBy } = req.query;
      const posts = await PostService.allPosts(
        id,
        +page,
        +pagesize,
        session,
        searchQuery as string,
        sortBy as string
      );
      await session.commitTransaction();
      res.status(StatusCode.OK).send(posts);
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }

  public static async likePost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const id = req.id!;
      const title = req.params.title;
      const posts = await PostService.likePost(id, title, session);
      await session.commitTransaction();
      res.status(StatusCode.OK).send(posts);
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }

  public static async commentPost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const id = req.id!;
      const title = req.params.title;
      const { comment } = req.body;
      const posts = await PostService.commentPost(id, title,comment, session);
      await session.commitTransaction();
      res.status(StatusCode.OK).send(posts);
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }
}
