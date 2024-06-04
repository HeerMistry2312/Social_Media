import { AppError } from "../utils/customErrorHandler";
import StatusConstants from "../constant/status.constant";
import otpGenerator from "otp-generator";
import admin from "firebase-admin";
import { sendEmail } from "../utils/nodeMailer";
export default class OtpService {
  public static async generateOtp(email:string): Promise<void> {
    const code = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
      digits: true,
    });
    const db = admin.firestore();
    const expiresAt = new Date(Date.now() + 600000);
    await sendEmail(email, "signup", code);
    await db.collection("otps").doc(email).set({
      email: email,
      otp: code,
      expiry: expiresAt,
    });

  }

  public static async verifyOtp(
    email: string,
    otp: string
  ): Promise<boolean> {
    let bool = false;
    const db = admin.firestore();
    const emailOtp = await db.collection("otps").doc(email).get();
    const existance = emailOtp.exists;
    if (!existance) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    const otpData = emailOtp.data();
    const otpString = otpData?.otp;
    const expiryDate = new Date(otpData?.expiry);

    if (new Date() >= expiryDate) {
      throw new AppError(
        StatusConstants.TOKEN_EXPIRED.body.message,
        StatusConstants.TOKEN_EXPIRED.httpStatusCode
      );
    }
    if (otpString === otp) {
      bool = true;
    }
    return bool;
  }
}
