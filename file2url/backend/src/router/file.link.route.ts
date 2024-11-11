import { Router } from "express";
import { file } from "../controller/file.link.controller";
import upload from "../config/multer.pdf.config";
import fs from "fs";
import path from "path";

export class link {
  static link() {
    const router = Router();
    router.route("/upload-images").post(file.imageUpload);
    router
      .route("/convert-to-pdf")
      .post(upload.array("files"), file.convert2pdf);
    router.get("/files", file.getfiles);
    return router;
  }
}
