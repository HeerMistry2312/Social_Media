import mongoose,{Schema,Types} from "mongoose";
import { OtpInterface } from "../interfaces/otp.interface";

const otpSchemma = new Schema<OtpInterface>({
    email:{
        type: String,
        ref: 'User'
    },
    secret:{
        type:String,
        required:true
    },
    expiresAt:{
        type: Date,
        required: true
    }
})

const Otp = mongoose.model('Otp',otpSchemma)
export default Otp