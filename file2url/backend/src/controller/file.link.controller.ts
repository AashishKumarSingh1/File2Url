import { Request, Response, NextFunction } from "express";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";
import ImageUrl from "../model/image.url.model";
import MulterFile from "../model/multer.model";
import mongoose from "mongoose";
import { Model } from "mongoose";
dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class file {
  static async imageUpload(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      let images: string[] = [];
      if (typeof req.body.images === "string") {
        images = [req.body.images];
      } else if (Array.isArray(req.body.images)) {
        images = req.body.images;
      } else {
        res.status(400).json({ message: "Invalid input format for images" });
        return;
      }

      const imagesLinks = [];
      const userId = req.body.id ? req.body.id : new mongoose.Types.ObjectId();


      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        if (typeof image !== "string") {
          res.status(400).json({ message: "Invalid image path or URL" });
          return;
        }

        try {
          const result = await cloudinary.v2.uploader.upload(image, {
            folder: "File2Url",
          });
          imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          res
            .status(500)
            .json({ message: "Error uploading image", error: uploadError });
          return;
        }
      }

      const newImage = new ImageUrl({
        url: imagesLinks,
        userId: userId,
      });

      await newImage.save();

      res.status(200).json({
        message: "Files uploaded successfully and saved to the database",
        urls: imagesLinks,
      });
    } catch (err) {
      console.error("Internal server error:", err);
      res.status(500).json({ message: "Internal server error", err });
    }
  }

  static async convert2pdf(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const files = req.files as Express.Multer.File[];
      const userId = req.body.userId ? req.body.userId : new mongoose.Types.ObjectId();
      if (!files || files.length === 0) {
        res.status(400).json({ message: "No files uploaded." });
        return;
      }

      const pdfDoc = await PDFDocument.create();

      for (const file of files) {
        const imageBytes = fs.readFileSync(file.path);
        const image = await pdfDoc.embedJpg(imageBytes);

        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const pdfPath = path.join("uploads/pdf", `${Date.now()}-images.pdf`);
      const pdfDir = path.dirname(pdfPath);
      if (!fs.existsSync(pdfDir)) {
        fs.mkdirSync(pdfDir, { recursive: true });
      }

      fs.writeFileSync(pdfPath, pdfBytes);

      const savedFiles = await Promise.all(
        files.map(async (file) => {
          const newMulterFile = new MulterFile({
            originalName: file.originalname,
            fileName: path.basename(pdfPath),
            path: pdfPath,
            userId:userId,
            fileType: "application/pdf",
            size: fs.statSync(pdfPath).size,
          });
          return newMulterFile.save();
        })
      );

      res
        .status(200)
        .json({ message: "PDF created and saved", files: savedFiles });
    } catch (error) {
      console.log("Error converting images to PDF: ", error);
      res.status(500).json({ message: "PDF conversion failed" });
    }
  }

  static async getfiles(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { type, page = 1, itemsPerPage = 10, sortOrder = "desc", userId } = req.query;
  
    try {
      if (!userId) {
        res.status(400).json({ message: "User ID is required" });
        return;
      }
  
      const sort = sortOrder === "asc" ? 1 : -1;
      const model1 = type === 'pdfs' ? MulterFile : ImageUrl;
      const model:Model<any>=model1;
  
      const files = await model
        .find({ userId: userId })
        .sort({ uploadDate: sort })
        .skip((Number(page) - 1) * Number(itemsPerPage))
        .limit(Number(itemsPerPage));
  
      const totalFiles = await model.countDocuments({ userId: userId });
      const totalPages = Math.ceil(totalFiles / Number(itemsPerPage));
  
      res.status(200).json({
        files,
        pagination: {
          totalFiles,
          totalPages,
          currentPage: Number(page),
        },
      });
    } catch (error) {
      console.error("Error fetching files:", error);
      res.status(500).json({ message: "Error fetching files", error });
    }
  }
  
}
