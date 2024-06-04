import { ClientSession, ObjectId, Types } from "mongoose";
import { AppError } from "../utils/customErrorHandler";
import StatusConstants from "../constant/status.constant";
import User from "../model/user.model";
import Follow from "../model/follow.model";
import UserPipeline from "../query/user.query";
export default class FollowService {
  public static async sendRequestToFollow(
    userId: Types.ObjectId,
    requestName: string,
    session: ClientSession
  ): Promise<object> {
    const user = await Follow.findOne({ userId: userId }).session(session);
    if (!user) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    const requestedUser = await User.findOne({ username: requestName }).session(
      session
    );
    if (!requestedUser) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    let requested = await Follow.findOne({ userId: requestedUser._id }).session(
      session
    );
    if (!requested) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    const requestedid = requested.userId as Types.ObjectId;
    const userid = user.userId as Types.ObjectId;

    if (
      user.following.includes(requestedid) ||
      requested.requests.includes(userid)
    ) {
      throw new AppError(
        StatusConstants.DUPLICATE_KEY_VALUE.body.message,
        StatusConstants.DUPLICATE_KEY_VALUE.httpStatusCode
      );
    }
    requested.requests.push(userid);
    await requested.save({ session });
    return { message: `Request sent to ${requestName}` };
  }

  public static async listOfRequests(
    userId: Types.ObjectId,
    session: ClientSession,
    page: number,
    pagesize: number,
    searchQuery?: string,
    sortBy?: string
  ): Promise<object> {
    const user = await Follow.findOne({ userId: userId }).session(session);
    if (!user) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    const pipeline = UserPipeline.listOfRequests(
      user._id as unknown as ObjectId,
      page,
      pagesize,
      searchQuery,
      sortBy
    );
    const data = await Follow.aggregate(pipeline);
    return { message: `list of Requests`, data: data };
  }

  public static async confirmRequest(
    userId: Types.ObjectId,
    name: string,
    session: ClientSession,
    page: number,
    pagesize: number,
    searchQuery?: string,
    sortBy?: string,

  ): Promise<object> {
    const user = await Follow.findOne({userId: userId}).session(session)
    if(!user){
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    const request = await User.findOne({username:name}).session(session)
    if(!request){
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    const requestedUser = await Follow.findOne({userId: request._id}).session(session)
    if(!requestedUser){
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    if(!user.requests.includes(request._id))
      {
        throw new AppError(
          StatusConstants.BAD_REQUEST.body.message,
          StatusConstants.BAD_REQUEST.httpStatusCode
        );
      }

      user.requests = user.requests.filter(id => !id.equals(request._id));
      user.followers.push(request._id)
      requestedUser.following.push(userId)
      await user.save({session})
      await requestedUser.save({session})

      return {message: `Request accepted for ${name}`}
  }
  public static async deleteRequest(
    userId: Types.ObjectId,
    name: string,
    session: ClientSession,
    page: number,
    pagesize: number,
    searchQuery?: string,
    sortBy?: string
  ): Promise<object> {
    const user = await Follow.findOne({userId: userId}).session(session)
    if(!user){
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    const request = await User.findOne({username:name}).session(session)
    if(!request){
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    const requestedUser = await Follow.findOne({userId: request._id}).session(session)
    if(!requestedUser){
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    if(!user.requests.includes(request._id))
      {
        throw new AppError(
          StatusConstants.BAD_REQUEST.body.message,
          StatusConstants.BAD_REQUEST.httpStatusCode
        );
      }

      user.requests = user.requests.filter(id => !id.equals(request._id));
      await user.save({session})
      return {message: `Request deleted for ${name}`}
  }

  public static async unfollowUser(
    userId: Types.ObjectId,
    name: string,
    session: ClientSession,
    page: number,
    pagesize: number,
    searchQuery?: string,
    sortBy?: string
  ): Promise<object>{
    const user = await Follow.findOne({userId: userId}).session(session)
    if(!user){
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    const request = await User.findOne({username:name}).session(session)
    if(!request){
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    const requestedUser = await Follow.findOne({userId: request._id}).session(session)
    if(!requestedUser){
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    if(!user.following.includes(request._id))
      {
        throw new AppError(
          StatusConstants.BAD_REQUEST.body.message,
          StatusConstants.BAD_REQUEST.httpStatusCode
        );
      }
      user.following = user.following.filter(id => !id.equals(request._id));
      requestedUser.followers = requestedUser.followers.filter(id => !id.equals(userId))

      await user.save({session})
      await requestedUser.save({session})
      return {message: `unfollow user: ${name}`}
  }
}
