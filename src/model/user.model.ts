import mongoose, { Schema, Types } from "mongoose";
import { UserInterface } from "../interfaces/user.interface";

const  userSchema = new Schema<UserInterface>({
    email: {
        type: String,
        required: true,
        unique: true

    },
    username: {
        type: String,
        required: true,
        unique:true

    }
    ,
    password: {
        type: String,
        required: true,

    },
    isVerified:{
        type: Boolean,
        required: true,
        default: false
    },
    createdDate: {
        type: Date,
        default: Date.now()
    },
    token: {
        type: String
    }


}, {
    timestamps: true
})

const User = mongoose.model<UserInterface>('User',userSchema)

export default User