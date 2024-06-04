import UserControl from "../controller/user.controller";
import express from "express";
import { Authentication } from "../middleware/authentication";
export class UserRoute {
    private router: express.Router;

    constructor() {
        this.router = express.Router();
        this.routes();
    }

    private routes(): void {
        this.router.post('/signup',UserControl.signup)
        this.router.post('/verify',UserControl.verifyOtp)
        this.router.post('/regenerate',UserControl.regenerateOtp)
        this.router.post('/forget_password',UserControl.forgotPassword)
        this.router.post('/forget_password/verify_otp',UserControl.validateUser)
        this.router.post('/forget_password/update',UserControl.resestPassword)
        this.router.post('/login',UserControl.login)
        this.router.post('/resetPassword',Authentication.authUser,UserControl.resestPasswordForLoggedUser)
        this.router.put('/edit',Authentication.authUser,UserControl.editUser)
        this.router.delete('/delete',Authentication.authUser,UserControl.deleteUser)
        this.router.get('/logout',Authentication.authUser,UserControl.logout)
    }

    public getRoute(): express.Router {
        return this.router;
    }
}