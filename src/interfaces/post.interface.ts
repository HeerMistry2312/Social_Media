import { Document, Types } from "mongoose";
import { UserInterface } from "./user.interface";

export interface PostInterface extends Document{
    _id?: Types.ObjectId,
    title: string,
    content: string,
    author: Types.ObjectId | UserInterface,
    likes: Types.ObjectId[],
    comments: Types.ObjectId[],
    createdDate: Date
}