import express from "express";
import Database from "./db/db";
import { errorHandlerMiddleware } from "./middleware/errorHandler";
import { UserRoute } from "./routes/user.routes";
import FollowRoute from "./routes/follow.routes";
import PostRoute from "./routes/post.routes";
import admin from 'firebase-admin'
import serviceAccount from '../service_account.json'
export class App {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.connectDB();
    this.initializeFirebase();
    this.routes();
  }

  private config(): void {
    this.app.use(express.json());
    this.app.use(errorHandlerMiddleware);


  }
  private initializeFirebase(): void {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
    });
  }
  private connectDB(): void {
    new Database();
  }
  private routes(): void {
    const userRoute = new UserRoute().getRoute();
    const followRoute = new FollowRoute().getRoute();
    const postRoute = new PostRoute().getRoute();
    this.app.use("/", userRoute);
    this.app.use("/follow", followRoute);
    this.app.use("/post", postRoute);
  }
  public start(port: string | undefined): void {
    this.app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  }
}
