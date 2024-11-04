"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const mailSender_1 = require("../utils/mailSender");
const user_model_1 = __importDefault(require("../model/user.model"));
const jwt_util_1 = require("../utils/jwt.util");
const bcrypt_1 = __importDefault(require("bcrypt"));
const otp_util_1 = require("../utils/otp.util");
class AuthController {
    static register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, email, password,
            // otp
             } = req.body;
            const existingUser = yield user_model_1.default.findOne({ username });
            if (existingUser) {
                res.status(400).json({ message: "Username already exists, please try another username." });
                return;
            }
            const existingEmail = yield user_model_1.default.findOne({ email });
            if (existingEmail) {
                res.status(400).json({ message: "Email already in use, please try another email." });
                return;
            }
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            try {
                const newUser = new user_model_1.default({
                    username: username,
                    email: email,
                    password: hashedPassword,
                });
                yield newUser.save();
                res.status(200).json({ message: "User created successfully" });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: "Internal Server error!" });
            }
        });
    }
    static verifyOption(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                const otp = req.body.otp;
                if (!email || !otp) {
                    res.status(400).json({ success: false, message: "Email and OTP are required." });
                    return;
                }
                const storedData = AuthController.otpStore[email];
                if (!storedData) {
                    res.status(404).json({ success: false, message: "No OTP found for this email." });
                    return;
                }
                if (storedData.otp !== otp) {
                    res.status(400).json({ success: false, message: "Invalid OTP." });
                    return;
                }
                if (Date.now() > storedData.expires) {
                    delete AuthController.otpStore[email];
                    res.status(400).json({ success: false, message: "OTP has expired." });
                    return;
                }
                delete AuthController.otpStore[email];
                //   const isOtpValid = await this.otpVerification(email, otp);
                // if (this.otpStore[email] && this.otpStore[email] === otp) {
                //     delete this.otpStore[email];
                //   }
                //   delete this.otpStore[email];
                //   if (!isOtpValid) {
                //     res.status(400).json({ message: "Invalid OTP" });
                //     return;
                //   }
                res
                    .status(200)
                    .json({ message: "OTP verified. Proceeding with registration" });
            }
            catch (e) {
                res.status(500).json({ Success: 'false' });
                console.error("error occurred:", e);
            }
        });
    }
    static login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password, rememberMe } = req.body;
            try {
                const user = yield user_model_1.default.findOne({ username });
                if (!user) {
                    res.status(401).json({ message: "User not found" });
                    return;
                }
                const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
                if (!isPasswordValid) {
                    res.status(401).json({ message: "Invalid password" });
                    return;
                }
                const expiry = rememberMe ? "30d" : "1d";
                const token = (0, jwt_util_1.createToken)(user._id.toString(), username, expiry);
                res.status(200).json({
                    message: "Login Successful",
                    token,
                    user: { id: user._id, username: user.username, email: user.email },
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
    //   static async otpVerification(email: string, otp: string): Promise<boolean> {
    //     // console.log("Received in otpVerification:", email, otp);
    //     // console.log("Current otpStore:", this.otpStore);
    //     if (this.otpStore[email] && this.otpStore[email] === otp) {
    //       delete this.otpStore[email];
    //       return true;
    //     }
    //     delete this.otpStore[email];
    //     return false;
    //   }
    static sendOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                if (!email) {
                    res
                        .status(400)
                        .json({ success: false, message: "Invalid email address." });
                    return;
                }
                const otp = (0, otp_util_1.generateOtp)();
                const subject = "Email-Verification";
                const message = `Your OTP for Email-Verification is ${otp}`;
                yield (0, mailSender_1.mailSender)(email, subject, message);
                AuthController.otpStore[email] = {
                    otp,
                    expiry: Date.now() + 10 * 60 * 1000,
                };
                res.status(200).json({ success: true, message: "Otp send successfully" });
            }
            catch (error) {
                console.log("error sending otp ", error);
                res.status(500).json({
                    success: false,
                    message: "An Error Occured",
                });
            }
        });
    }
    static checkLogin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
                if (!token) {
                    res.status(401).json({ message: "No token provided" });
                    return;
                }
                const decoded = (0, jwt_util_1.verifyToken)(token);
                const user = yield user_model_1.default.findById(decoded.id);
                if (!user) {
                    res.status(404).json({ message: "User not found" });
                    return;
                }
                res.status(200).json({
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                    },
                    token: token
                });
            }
            catch (error) {
                console.log("An error occured", error);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
}
exports.AuthController = AuthController;
//   private static otpStore: { [key: string]: string } = {};
AuthController.otpStore = {};
