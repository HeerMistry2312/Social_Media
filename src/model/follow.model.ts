import mongoose, { Schema, Types } from "mongoose";
import { FollowInterface } from '../interfaces/follow.interface';


const  followSchema = new Schema<FollowInterface>({
    userId:{
        type: Types.ObjectId,
        ref: 'User'

    },
    followers: [
        {
            type: Types.ObjectId, ref: 'User'
        }
    ],
    following: [
        {
            type: Types.ObjectId, ref: 'User'
        }
    ],
    requests: [
        {
            type: Types.ObjectId, ref: 'User'
        }
    ],
})
const Follow = mongoose.model<FollowInterface>('Follow',followSchema)

export default Follow