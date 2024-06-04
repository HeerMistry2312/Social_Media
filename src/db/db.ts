import mongoose from 'mongoose';
import { MONGODB_URI } from '../config/config';
import { AppError } from '../utils/customErrorHandler';
import StatusConstants from '../constant/status.constant';
class Database {
    constructor() {
        this.connectDB();
    }

    private async connectDB() {
        if (!MONGODB_URI) {
            throw new AppError(StatusConstants.RESOURCE_NOT_FOUND.body.message, StatusConstants.RESOURCE_NOT_FOUND.httpStatusCode)
        }

        try {
            await mongoose.connect(MONGODB_URI);
            console.log('Connected to MongoDB');
        } catch (error) {
            throw new AppError(StatusConstants.INTERNAL_SERVER_ERROR.body.message, StatusConstants.INTERNAL_SERVER_ERROR.httpStatusCode)
        }
    }
}

export default Database;