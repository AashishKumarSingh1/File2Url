"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uploadDir = path_1.default.join(__dirname, "uploads/images");
const pdfDir = path_1.default.join(__dirname, "uploads/pdf");
// Create directories if they don't exist
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
if (!fs_1.default.existsSync(pdfDir)) {
    fs_1.default.mkdirSync(pdfDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|jfif/;
        const extname = fileTypes.test(path_1.default.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);
        if (extname && mimeType) {
            return cb(null, true);
        }
        else {
            cb(new Error("Only images are allowed (jpeg, jpg, png)"));
        }
    },
});
exports.default = upload;
// import express from "express";
// import upload from "./fileUploader";
// import PdfUrl from "./models/pdf_url_model";
// import fs from "fs";
// import { PDFDocument } from "pdf-lib";
// const app = express();
// app.post("/upload-images", upload.array("images", 10), async (req, res) => {
//   try {
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ message: "No images uploaded" });
//     }
//     // Create a new PDF document
//     const pdfDoc = await PDFDocument.create();
//     // Embed each image into the PDF
//     for (const file of req.files) {
//       const imageBytes = fs.readFileSync(file.path);
//       const image = await pdfDoc.embedJpg(imageBytes); // or embedPng() based on format
//       const page = pdfDoc.addPage();
//       page.drawImage(image, {
//         x: 0,
//         y: 0,
//         width: page.getWidth(),
//         height: page.getHeight(),
//       });
//     }
//     // Save the PDF
//     const pdfBytes = await pdfDoc.save();
//     const pdfPath = `uploads/pdfs/${Date.now()}-output.pdf`;
//     fs.writeFileSync(pdfPath, pdfBytes);
//     // Save PDF metadata to the database
//     const pdfData = new PdfUrl({
//       url: pdfPath,
//       userId: req.user._id, // Assuming `userId` is available in the request
//     });
//     await pdfData.save();
//     // Respond with the PDF information
//     res.status(200).json({
//       message: "PDF created successfully",
//       pdfUrl: pdfData.url,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   } finally {
//     // Clean up uploaded images after PDF creation
//     req.files.forEach((file) => fs.unlinkSync(file.path));
//   }
// });
