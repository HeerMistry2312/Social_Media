import mongoose,{Schema,Types} from "mongoose";
import { PostInterface } from "../interfaces/post.interface";

const postSchema = new Schema<PostInterface>({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: [
        {
            type: Types.ObjectId, ref: 'User'
        }
    ],
    comments: [
        {
            type: Types.ObjectId, ref: 'Comment'
        }
    ],
    createdDate: {
        type: Date,
        default: Date.now()
    }
},{
    timestamps: true,
})

const Post = mongoose.model<PostInterface>('Post',postSchema)

export default Post