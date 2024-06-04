import nodemailer from "nodemailer";
import { MAIL, PASSWORD } from "../config/config";
import { AppError } from "./customErrorHandler";

export const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: MAIL,
    pass: PASSWORD,
  },
});

export const sendEmail = async (
  email: string,
  subject: string,
  otp: string
) => {
  const mailOptions = {
    from: MAIL,
    to: email,
    subject: `OTP for ${subject}`,
    text: `Your OTP for ${subject} is: ${otp}.\n above otp expires in 10mins`,
  };

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      throw new AppError(error.message, 500);
    }
  });

};
