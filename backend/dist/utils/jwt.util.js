"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_config_1 = require("../config/dotenv.config");
(0, dotenv_config_1.loadEnv)();
const createToken = (userId, userName, expiresIn) => {
    const payload = {
        id: userId,
        name: userName,
    };
    const options = {
        expiresIn,
    };
    const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, options);
    return token;
};
exports.createToken = createToken;
const verifyToken = (token) => {
    if (!token) {
        throw new Error("Token is required");
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        return decoded;
    }
    catch (err) {
        throw new Error("Invalid Token");
    }
};
exports.verifyToken = verifyToken;
