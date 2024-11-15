import multer from "multer";
import path from "path";
import fs from "fs";
import { PDFDocument } from "pdf-lib";

const uploadDir = path.join(__dirname, "uploads/images");
const pdfDir = path.join(__dirname, "uploads/pdf");

// Create directories if they don't exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|jfif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extname && mimeType) {
      return cb(null, true);
    } else {
      cb(new Error("Only images are allowed (jpeg, jpg, png)"));
    }
  },
});

export default upload;

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

