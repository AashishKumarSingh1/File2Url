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
exports.file = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pdf_lib_1 = require("pdf-lib");
const image_url_model_1 = __importDefault(require("../model/image.url.model"));
const multer_model_1 = __importDefault(require("../model/multer.model"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
cloudinary_1.default.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
class file {
    static imageUpload(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let images = [];
                if (typeof req.body.images === "string") {
                    images = [req.body.images];
                }
                else if (Array.isArray(req.body.images)) {
                    images = req.body.images;
                }
                else {
                    res.status(400).json({ message: "Invalid input format for images" });
                    return;
                }
                const imagesLinks = [];
                const userId = req.body.id ? req.body.id : new mongoose_1.default.Types.ObjectId();
                for (let i = 0; i < images.length; i++) {
                    const image = images[i];
                    if (typeof image !== "string") {
                        res.status(400).json({ message: "Invalid image path or URL" });
                        return;
                    }
                    try {
                        const result = yield cloudinary_1.default.v2.uploader.upload(image, {
                            folder: "File2Url",
                        });
                        imagesLinks.push({
                            public_id: result.public_id,
                            url: result.secure_url,
                        });
                    }
                    catch (uploadError) {
                        console.error("Error uploading image:", uploadError);
                        res
                            .status(500)
                            .json({ message: "Error uploading image", error: uploadError });
                        return;
                    }
                }
                const newImage = new image_url_model_1.default({
                    url: imagesLinks,
                    userId: userId,
                });
                yield newImage.save();
                res.status(200).json({
                    message: "Files uploaded successfully and saved to the database",
                    urls: imagesLinks,
                });
            }
            catch (err) {
                console.error("Internal server error:", err);
                res.status(500).json({ message: "Internal server error", err });
            }
        });
    }
    static convert2pdf(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const files = req.files;
                const userId = req.body.userId ? req.body.userId : new mongoose_1.default.Types.ObjectId();
                if (!files || files.length === 0) {
                    res.status(400).json({ message: "No files uploaded." });
                    return;
                }
                const pdfDoc = yield pdf_lib_1.PDFDocument.create();
                for (const file of files) {
                    const imageBytes = fs_1.default.readFileSync(file.path);
                    const image = yield pdfDoc.embedJpg(imageBytes);
                    const page = pdfDoc.addPage([image.width, image.height]);
                    page.drawImage(image, {
                        x: 0,
                        y: 0,
                        width: image.width,
                        height: image.height,
                    });
                }
                const pdfBytes = yield pdfDoc.save();
                const pdfPath = path_1.default.join("uploads/pdf", `${Date.now()}-images.pdf`);
                const pdfDir = path_1.default.dirname(pdfPath);
                if (!fs_1.default.existsSync(pdfDir)) {
                    fs_1.default.mkdirSync(pdfDir, { recursive: true });
                }
                fs_1.default.writeFileSync(pdfPath, pdfBytes);
                const savedFiles = yield Promise.all(files.map((file) => __awaiter(this, void 0, void 0, function* () {
                    const newMulterFile = new multer_model_1.default({
                        originalName: file.originalname,
                        fileName: path_1.default.basename(pdfPath),
                        path: pdfPath,
                        userId: userId,
                        fileType: "application/pdf",
                        size: fs_1.default.statSync(pdfPath).size,
                    });
                    return newMulterFile.save();
                })));
                res
                    .status(200)
                    .json({ message: "PDF created and saved", files: savedFiles });
            }
            catch (error) {
                console.log("Error converting images to PDF: ", error);
                res.status(500).json({ message: "PDF conversion failed" });
            }
        });
    }
    static getfiles(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { type, page = 1, itemsPerPage = 10, sortOrder = "desc", userId } = req.query;
            try {
                if (!userId) {
                    res.status(400).json({ message: "User ID is required" });
                    return;
                }
                const sort = sortOrder === "asc" ? 1 : -1;
                const model1 = type === 'pdfs' ? multer_model_1.default : image_url_model_1.default;
                const model = model1;
                const files = yield model
                    .find({ userId: userId })
                    .sort({ uploadDate: sort })
                    .skip((Number(page) - 1) * Number(itemsPerPage))
                    .limit(Number(itemsPerPage));
                const totalFiles = yield model.countDocuments({ userId: userId });
                const totalPages = Math.ceil(totalFiles / Number(itemsPerPage));
                res.status(200).json({
                    files,
                    pagination: {
                        totalFiles,
                        totalPages,
                        currentPage: Number(page),
                    },
                });
            }
            catch (error) {
                console.error("Error fetching files:", error);
                res.status(500).json({ message: "Error fetching files", error });
            }
        });
    }
}
exports.file = file;
