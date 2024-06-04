import FollowControl from "../controller/follow.controller";
import express from "express";
import { Authentication } from "../middleware/authentication";

export default class FollowRoute {
    private router: express.Router;

    constructor() {
        this.router = express.Router();
        this.routes();
    }


    private routes(): void {
        this.router.post('/sendrequest',Authentication.authUser,FollowControl.sendRequest)
        this.router.get('/details',Authentication.authUser,FollowControl.listOfRequests)
        this.router.post('/accept',Authentication.authUser,FollowControl.confirmRequests)
        this.router.delete('/delete',Authentication.authUser,FollowControl.deleteRequest)
        this.router.delete('/unfollow',Authentication.authUser,FollowControl.unfollowUser)
    }

    public getRoute(): express.Router {
        return this.router;
    }
}