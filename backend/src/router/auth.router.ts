import { Router } from "express";
import { AuthController } from "../controller/auth.controller";

export class auth{
    static auth(){
        const router=Router();
        router.route('/register').post(AuthController.register);
        router.route('/login').post(AuthController.login);
        router.route('/send-otp').post(AuthController.sendOtp);
        router.route('/verify-otp').post(AuthController.verifyOption);
        router.route('/checkLogin').get(AuthController.checkLogin);
        return router;
    }
}