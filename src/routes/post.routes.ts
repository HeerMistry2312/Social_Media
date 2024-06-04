import PostControl from "../controller/post.controller";
import express from "express";
import { Authentication } from "../middleware/authentication";

export default class PostRoute {
    private router: express.Router;

    constructor() {
        this.router = express.Router();
        this.routes();
    }


    private routes(): void {
        this.router.post('/create',Authentication.authUser,PostControl.createPost)
        this.router.put('/update',Authentication.authUser,PostControl.updatePost)
        this.router.delete('/delete/:title',Authentication.authUser,PostControl.deletePost)
        this.router.get('/getPost/:title',Authentication.authUser,PostControl.getOnePost)
        this.router.get('/getAll',Authentication.authUser,PostControl.getAllPost)
    }

    public getRoute(): express.Router {
        return this.router;
    }
}