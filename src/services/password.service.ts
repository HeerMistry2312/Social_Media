
import { ClientSession } from "mongoose";
import { AppError } from "../utils/customErrorHandler";
import StatusConstants from "../constant/status.constant";
import bcrypt from 'bcrypt';
import Otp from "../model/otp.model";
import OtpService from "./otp.service";
import User from "../model/user.model";
export default class PasswordService{
    public static async resetPassword(
        email: string,
        password: string,
        session: ClientSession
      ): Promise<void> {
        let user = await User.findOne({ email }).session(session);
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
        const hashedPassword = await bcrypt.hash(password, 12);
        user = await User.findByIdAndUpdate(user._id, {
          password: hashedPassword,
        }).session(session);

      }


      public static async forgotPassword(
        email: string,
        session: ClientSession
      ): Promise<void> {
        const checkEmail = await Otp.findOne({ email }).session(session);
        if (!checkEmail) {
          throw new AppError(
            StatusConstants.NOT_FOUND.body.message,
            StatusConstants.NOT_FOUND.httpStatusCode
          );
        }
        await OtpService.generateOtp(checkEmail.email)

      }
}