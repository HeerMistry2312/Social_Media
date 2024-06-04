import { Document,Types } from "mongoose";

export interface UserInterface extends Document {
    _id?: Types.ObjectId,
    email: string,
    username: string,
    password: string,
    isVerified: boolean,
    createdDate: Date,
    token?: string
}

export interface TokenPayload {
    id: Types.ObjectId;
    email: string;
}