import { Document,Types } from "mongoose";
export interface OtpInterface extends Document {
    email: string,
    secret: string,
    expiresAt: Date
}