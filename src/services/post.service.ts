import { ClientSession, ObjectId, Types } from "mongoose";
import User from "../model/user.model";
import { AppError } from "../utils/customErrorHandler";
import StatusConstants from "../constant/status.constant";
import Post from "../model/post.model";
import PostPipeline from "../query/post.query";
import Follow from "../model/follow.model";
import Comment from "../model/comment.model";
export default class PostService {
  public static async createPost(
    id: Types.ObjectId,
    title: string,
    content: string,
    session: ClientSession
  ): Promise<object> {
    const user = await User.findById({ _id: id }).session(session);
    if (!user) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    const post = new Post({ title: title, content: content, author: id });
    await post.save({ session });
    return { message: "Posted Success", data: post };
  }

  public static async updatePost(
    id: Types.ObjectId,
    updateTitle: string,
    title: string | undefined,
    content: string | undefined,
    session: ClientSession
  ): Promise<object> {
    const user = await User.findById({ _id: id }).session(session);
    if (!user) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    const post = await Post.findOne({ title: updateTitle }).session(session);
    if (!post) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    if (post.author != id) {
      throw new AppError(
        StatusConstants.UNAUTHORIZED.body.message,
        StatusConstants.UNAUTHORIZED.httpStatusCode
      );
    }
    const updateData = await Post.findByIdAndUpdate(
      post._id,
      { title: title, content: content },
      { new: true }
    ).session(session);

    return { message: "Update Success", data: updateData };
  }

  public static async deletePost(
    id: Types.ObjectId,
    deleteTitle: string,
    session: ClientSession
  ): Promise<object> {
    const user = await User.findById({ _id: id }).session(session);
    if (!user) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    const post = await Post.findOne({ title: deleteTitle }).session(session);
    if (!post) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    if (post.author !== id) {
      throw new AppError(
        StatusConstants.UNAUTHORIZED.body.message,
        StatusConstants.UNAUTHORIZED.httpStatusCode
      );
    }
    await Post.findByIdAndDelete(post._id).session(session);
    return { message: "Update Success" };
  }

  public static async getOnePost(
    id: Types.ObjectId,
    title: string,
    session: ClientSession
  ): Promise<object> {
    const user = await User.findById({ _id: id }).session(session);
    if (!user) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    const post = await Post.findOne({ title: title, author: id }).session(
      session
    );
    if (!post) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    const pipeline = PostPipeline.getPost(post._id);
    const details = await Post.aggregate(pipeline);
    return { data: details };
  }
  public static async getAllPost(
    id: Types.ObjectId,
    page: number,
    pageSize: number,
    session: ClientSession,
    searchQuery?: string,
    sortBy?: string
  ): Promise<object> {
    const user = await User.findById({ _id: id }).session(session);
    if (!user) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    const post = await Post.find({ author: id }).session(session);
    if (!post) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    const pipeline = PostPipeline.getAllPost(
      user._id,
      page,
      pageSize,
      searchQuery,
      sortBy
    );
    const posts = await Post.aggregate(pipeline);
    const totalPosts = await Post.countDocuments({ author: id }).session(
      session
    );
    return {
      posts: posts,
      totalPosts: totalPosts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / pageSize),
    };
  }
  public static async allPosts(
    id: Types.ObjectId,
    page: number,
    pageSize: number,
    session: ClientSession,
    searchQuery?: string,
    sortBy?: string
  ): Promise<object> {
    const follow = await Follow.findOne({ userId: id }).session(session);
    if (!follow) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    const Ids = [...follow.followers, ...follow.following];
    const pipeline = PostPipeline.allPost(
      Ids,
      page,
      pageSize,
      searchQuery,
      sortBy
    );
    const count = await Post.countDocuments({ author: { $in: Ids } });
    const data = await Post.aggregate(pipeline);

    return {
      data: data,
      currentPage: page,
      totalPages: Math.ceil(count / pageSize),
    };
  }

  public static async likePost(
    id: Types.ObjectId,
    title: string,
    session: ClientSession
  ): Promise<object> {
    const post = await Post.findOne({ title: title }).session(session);
    if (!post) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    if (post.likes.includes(id)) {
      throw new AppError(
        StatusConstants.DUPLICATE_KEY_VALUE.body.message,
        StatusConstants.DUPLICATE_KEY_VALUE.httpStatusCode
      );
    }
    post.likes.push(id);
    await post.save({ session });
    return { message: "liked Post" };
  }
  public static async commentPost(
    id: Types.ObjectId,
    title: string,
    comment: string,
    session: ClientSession
  ): Promise<object> {
    const post = await Post.findOne({ title: title }).session(session);
    if (!post) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
const comments = new Comment({postId:post._id, text: comment, authorId: id})
await comments.save({session})

post.comments.push(comments._id)
    await post.save({ session });

    return { message: "commented on Post" };
  }
}
