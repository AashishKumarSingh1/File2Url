"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const imageUrlSchema = new mongoose_1.default.Schema({
    url: [
        {
            public_id: String,
            url: String,
        }
    ],
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        default: 123456,
        ref: "User",
        required: true,
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
});
const ImageUrl = mongoose_1.default.model("ImageUrl", imageUrlSchema);
exports.default = ImageUrl;
