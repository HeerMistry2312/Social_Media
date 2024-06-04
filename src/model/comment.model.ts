import mongoose,{Schema,Types} from "mongoose";
import { CommentInterface } from "../interfaces/comment.interface";

const commentSchema = new Schema<CommentInterface>({
    postId:{
        type: Types.ObjectId,
        ref: 'Post',
        required: true
    },
    text:{
        type: String,
        required: true
    },
    authorId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdDate:{
        type: Date,
        default: Date.now()
    }
}, {
    timestamps: true
})

const Comment = mongoose.model<CommentInterface>('Comment',commentSchema)

export default Comment
