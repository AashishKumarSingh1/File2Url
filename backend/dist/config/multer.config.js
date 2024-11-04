"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = fileUploader;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
function fileUploader() {
    const storage = multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "uploads/");
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
        },
    });
    const upload = (0, multer_1.default)({
        storage: storage,
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
            const fileTypes = /jpeg|jpg|png|gif/;
            const extname = fileTypes.test(path_1.default.extname(file.originalname).toLowerCase());
            const mimeType = fileTypes.test(file.mimetype);
            if (extname && mimeType) {
                return cb(null, true);
            }
            else {
                cb(new Error("Only images are allowed (jpeg, jpg, png, gif)"));
            }
        },
    });
    return upload;
}
