import { Document, Types } from "mongoose";
import { UserInterface } from "./user.interface";

export interface PostInterface extends Document{
    title: string,
    content: string,
    author: Types.ObjectId | UserInterface,
    likes: Types.ObjectId[] | UserInterface[],
    comments: Types.ObjectId[] | UserInterface[],
    createdDate: Date
}