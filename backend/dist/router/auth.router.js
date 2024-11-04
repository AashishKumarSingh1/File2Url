"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const express_1 = require("express");
const auth_controller_1 = require("../controller/auth.controller");
class auth {
    static auth() {
        const router = (0, express_1.Router)();
        router.route('/register').post(auth_controller_1.AuthController.register);
        router.route('/login').post(auth_controller_1.AuthController.login);
        router.route('/send-otp').post(auth_controller_1.AuthController.sendOtp);
        router.route('/verify-otp').post(auth_controller_1.AuthController.verifyOption);
        router.route('/checkLogin').get(auth_controller_1.AuthController.checkLogin);
        return router;
    }
}
exports.auth = auth;
