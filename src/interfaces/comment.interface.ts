import { Document, Types } from "mongoose";
import { UserInterface } from "./user.interface";
import { PostInterface } from "./post.interface";

export interface CommentInterface extends Document {
    postId: Types.ObjectId | PostInterface,
    text: string,
    authorId: Types.ObjectId | UserInterface,
    createdDate: Date
}