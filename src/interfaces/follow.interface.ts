import { Document,Types } from "mongoose";
import { UserInterface } from "./user.interface";
export interface FollowInterface extends Document{
    _id?: Types.ObjectId,
    userId: Types.ObjectId | UserInterface,
    followers: Types.ObjectId[],
    following: Types.ObjectId[],
    requests: Types.ObjectId[],
}