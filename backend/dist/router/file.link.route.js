"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.link = void 0;
const express_1 = require("express");
const file_link_controller_1 = require("../controller/file.link.controller");
const multer_pdf_config_1 = __importDefault(require("../config/multer.pdf.config"));
class link {
    static link() {
        const router = (0, express_1.Router)();
        router.route("/upload-images").post(file_link_controller_1.file.imageUpload);
        router
            .route("/convert-to-pdf")
            .post(multer_pdf_config_1.default.array("files"), file_link_controller_1.file.convert2pdf);
        router.get("/files", file_link_controller_1.file.getfiles);
        return router;
    }
}
exports.link = link;
