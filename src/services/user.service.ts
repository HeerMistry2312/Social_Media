import User from "../model/user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ClientSession, ObjectId, Types } from "mongoose";
import { AppError } from "../utils/customErrorHandler";
import { SECRET_KEY } from "../config/config";
import StatusConstants from "../constant/status.constant";
import mongoose from "mongoose";
import OtpService from "./otp.service";
import PasswordService from "./password.service";
import Follow from "../model/follow.model";
import UserPipeline from "../query/user.query";
import Otp from "../model/otp.model";

export default class UserService {
  public static async signup(
    email: string,
    username: string,
    password: string,
    session: ClientSession
  ): Promise<object> {
    if (await User.findOne({ email }).session(session)) {
      throw new AppError(
        StatusConstants.DUPLICATE_KEY_VALUE.body.message,
        StatusConstants.DUPLICATE_KEY_VALUE.httpStatusCode
      );
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      email: email,
      username: username,
      password: hashedPassword,
    });

    const pipeline = UserPipeline.userData(user._id as unknown as ObjectId);
    await OtpService.generateOtp(user.email);
    const data = await User.aggregate(pipeline);
    return { message: "Email send", data: data };
  }

  public static async verifyOtp(
    email: string,
    otp: string,
    session: ClientSession
  ): Promise<object> {
    let findUser = await User.findOne({ email }).session(session);
    if (!findUser) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    } else if (findUser.isVerified) {
      throw new AppError(
        StatusConstants.VERIFIED.body.message,
        StatusConstants.VERIFIED.httpStatusCode
      );
    }

    const isValid = await OtpService.verifyOtp(findUser.email, otp);
    if (!isValid) {
      throw new AppError(
        StatusConstants.INVALID_DATA.body.message,
        StatusConstants.INVALID_DATA.httpStatusCode
      );
    }
    findUser = await User.findByIdAndUpdate(findUser._id, {
      isVerified: true,
    }).session(session);
    const newUser = await new Follow({ userId: findUser!._id });
    await newUser.save();

    const pipeline = UserPipeline.userData(
      findUser!._id as unknown as ObjectId
    );
    const data = await User.aggregate(pipeline);
    return { message: "User verified You can login Now", data: data };
  }

  public static async regenerateOtp(
    email: string,
    session: mongoose.mongo.ClientSession
  ): Promise<object> {
    const user = await User.findOne({ email }).session(session);
    if (!user) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    } else if (user.isVerified) {
      throw new AppError(
        StatusConstants.VERIFIED.body.message,
        StatusConstants.VERIFIED.httpStatusCode
      );
    }
    await OtpService.generateOtp(user.email);
    return { message: "Email re-send" };
  }


  public static async forgotPassword(
    email: string,
    session: ClientSession
  ): Promise<string> {
    const user = await User.findOne({ email }).session(session);
    if (!user) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    if (!user.isVerified) {
      throw new AppError(
        StatusConstants.UNAUTHORIZED.body.message,
        StatusConstants.UNAUTHORIZED.httpStatusCode
      );
    }
    await PasswordService.forgotPassword(user.email, session);
    return `verification Mail send on ${user.email}`;
  }

  public static async validateUser(
    email: string,
    otp: string,
    session: ClientSession
  ): Promise<string> {
    const user = await User.findOne({ email }).session(session);
    if (!user) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    if (!user.isVerified) {
      throw new AppError(
        StatusConstants.UNAUTHORIZED.body.message,
        StatusConstants.UNAUTHORIZED.httpStatusCode
      );
    }
    const isValid = await OtpService.verifyOtp(user.email, otp);
    if (!isValid) {
      throw new AppError(
        StatusConstants.INVALID_DATA.body.message,
        StatusConstants.INVALID_DATA.httpStatusCode
      );
    }
    return `verified ${user.email}. update password link: localhost:5000/forgot_password/update`;
  }

  public static async resetpassword(
    email: string,
    password: string,
    session: ClientSession
  ): Promise<object> {
    let user = await User.findOne({ email }).session(session);
    if (!user) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    const changedPassword = await PasswordService.resetPassword(
      user.email,
      password,
      session
    );

    return { message: "Password Changed", data: changedPassword };
  }
  public static async login(
    username: string,
    password: string,
    session: ClientSession
  ): Promise<object> {
    const user = await User.findOne({ username }).session(session);
    if (!user) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }

    const verifiePassword = await bcrypt.compare(password, user.password);
    if (!verifiePassword && user.isVerified !== true) {
      throw new AppError(
        StatusConstants.UNAUTHORIZED.body.message,
        StatusConstants.UNAUTHORIZED.httpStatusCode
      );
    }
    if (!SECRET_KEY) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, {
      expiresIn: "10h",
    });
    user.token = token;
    await user.save({ session });
    return { message: "logged in success", data: user.token };
  }

  public static async resetpasswordForLoggedUser(
    id: Types.ObjectId,
    password: string,
    session: ClientSession
  ): Promise<object> {
    let user = await User.findById({ _id: id }).session(session);
    if (!user) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    const changedPassword = await PasswordService.resetPassword(
      user.email,
      password,
      session
    );
    return { message: "Password Changed", data: changedPassword };
  }

  public static async editUser(
    id: Types.ObjectId,
    email: string | undefined,
    username: string | undefined,
    session: ClientSession
  ): Promise<object> {
    let user = await User.findById({ _id: id }).session(session);
    if (!user) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    user = await User.findByIdAndUpdate(
      user._id,
      { email: email, username: username },
      { new: true }
    );
    const pipeline = UserPipeline.userData(user!._id as unknown as ObjectId);
    const data = await User.aggregate(pipeline);
    return { message: "user updated", data: data };
  }

  public static async deleteUser(
    id: Types.ObjectId,
    session: ClientSession
  ): Promise<object> {
    let user = await User.findById({ _id: id }).session(session);
    if (!user) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    await User.deleteOne({ _id: id }).session(session);
    const bulkOps = [
      {
        updateMany: {
          filter: { followers: id },
          update: { $pull: { followers: id } },
        },
      },
      {
        updateMany: {
          filter: { following: id },
          update: { $pull: { following: id } },
        },
      },
      {
        updateMany: {
          filter: { requests: id },
          update: { $pull: { requests: id } },
        },
      },
    ];

    await Follow.bulkWrite(bulkOps, { session });

    await Follow.findOneAndDelete({ userId: id }).session(session);
    await Otp.findOneAndDelete({ email: user.email }).session(session);

    return { message: "user deleted success" };
  }
  public static async logout(
    id: Types.ObjectId,
    session: ClientSession
  ): Promise<void> {
    const user = await User.findById({ _id: id }).session(session);
    if (!user) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    user.token = undefined;
    await user.save({ session });
  }
}
